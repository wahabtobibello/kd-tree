const KDTreeNodeFactory = require("./KDTreeNode");

module.exports = function KDTreeFactory() {
    let _axes = null;
    let _dimension = null;
    let _metric = null;

    const buildTree = (points, depth = 0, parent = null) => {

        let currentAxisIndex = depth % _dimension,
            median,
            node;

        if (points.length === 0) {
            return null;
        }
        const KDTreeNode = KDTreeNodeFactory();
        if (points.length === 1) {
            return new KDTreeNode(points[0], currentAxisIndex, depth, parent);
        }

        points.sort(function (pointA, pointB) {
            return pointA[_axes[currentAxisIndex]] - pointB[_axes[currentAxisIndex]];
        });

        median = Math.floor(points.length / 2);
        node = new KDTreeNode(points[median], currentAxisIndex, depth, parent);
        node.setLeft(buildTree(points.slice(0, median), depth + 1, node));
        node.setRight(buildTree(points.slice(median + 1), depth + 1, node));

        return node;
    }

    return class KDTree {

        constructor(points, axes, metric) {
            _axes = axes;
            _dimension = axes.length;
            _metric = metric;
            this.root = buildTree(points);
        }

        add(point) {
            const getInsertPosition = (node, parent) => {

                if (node === null) {
                    return parent;
                }
                var axis = _axes[node.getAxisIndex()];
                if (point[axis] < node.getPoint()[axis]) {
                    return getInsertPosition(node.getLeft(), node);
                } else {
                    return getInsertPosition(node.getRight(), node);
                }

            }
            var insertPosition = getInsertPosition(this.root, null),
                newNode,
                axis;
            const KDTreeNode = KDTreeNodeFactory();

            if (insertPosition === null) {
                this.root = new KDTreeNode(point, 0, 0, null);
                return;
            }

            newNode = new KDTreeNode(point, (insertPosition.getAxisIndex() + 1) % _dimension, insertPosition.getDepth() + 1, insertPosition);
            axis = _axes[insertPosition.getAxisIndex()];

            if (point[axis] < insertPosition.getPoint()[axis]) {
                insertPosition.setLeft(newNode);
            } else {
                insertPosition.setRight(newNode);
            }
        }

        remove(point) {
            let node;

            const findNode = (node) => {
                if (node === null) {
                    return null;
                }

                if (node.getPoint() === point) {
                    return node;
                }

                var axis = _axes[node.getAxisIndex()];

                if (point[axis] < node.point[axis]) {
                    return findNode(node.left);
                } else {
                    return findNode(node.right);
                }
            }

            const removeNode = (node) => {
                let nodeAxisIndex = node.getAxisIndex(),
                    nextNode,
                    nextPoint,
                    parentAxis,
                    parentNode;

                const findMin = (node) => {
                    var axis,
                        own,
                        left,
                        right,
                        min;

                    if (node === null) {
                        return null;
                    }

                    axis = _axes[nodeAxisIndex];

                    if (node.getAxisIndex() === nodeAxisIndex) {
                        if (node.left !== null) {
                            return findMin(node.left);
                        }
                        return node;
                    }

                    own = node.point[axis];
                    left = findMin(node.left);
                    right = findMin(node.right);
                    min = node;

                    if (left !== null && left.point[axis] < own) {
                        min = left;
                    }
                    if (right !== null && right.point[axis] < min.point[axis]) {
                        min = right;
                    }
                    return min;
                }

                if (node.left === null && node.right === null) {
                    if (node.parent === null) {
                        self.root = null;
                        return;
                    }
                    parentNode = node.getParent();
                    parentAxis = _axes[parentNode.getAxisIndex()];

                    if (node.point[parentAxis] < parentNode.point[parentAxis]) {
                        parentNode.left = null;
                    } else {
                        parentNode.right = null;
                    }
                    return;
                }

                // If the right subtree is not empty, swap with the minimum element on the
                // node's dimension. If it is empty, we swap the left and right subtrees and
                // do the same.
                if (node.right !== null) {
                    nextNode = findMin(node.right);
                    nextPoint = nextNode.point;
                    removeNode(nextNode);
                    node.point = nextPoint;
                } else {
                    nextNode = findMin(node.left);
                    nextPoint = nextNode.point;
                    removeNode(nextNode);
                    node.right = node.left;
                    node.left = null;
                    node.point = nextPoint;
                }

            }

            node = findNode(this.root);

            if (node === null) return;

            removeNode(node);
        }

        searchRange() {

        }

        closestTo(point) {
            const findClosestTo = (node, depth = 0) => {
                const closerDistance = (pivot, p1, p2) => {
                    if (p1 == null) return p2;
                    if (p2 == null) return p1;

                    let d1 = _metric(pivot, p1);
                    let d2 = _metric(pivot, p2);

                    if (d1 < d2) {
                        return p1;
                    } else {
                        return p2;
                    }
                }

                if (node === null) {
                    return null;
                }
                let axis = _axes[depth % _dimension];

                let nextBranch = null,
                    oppositeBranch = null;
                
                if (point[axis] < node.getPoint()[axis]) {
                    nextBranch = node.getLeft();
                    oppositeBranch = node.getRight();
                } else {
                    oppositeBranch = node.getLeft();
                    nextBranch = node.getRight();
                }

                let best = closerDistance(point,
                    findClosestTo(nextBranch,
                        depth + 1),
                    node.getPoint());

                if (_metric(point, best) > Math.abs(point[axis] - node.getPoint()[axis])) {
                    best = closerDistance(point,
                        findClosestTo(oppositeBranch,
                            depth + 1),
                        best);
                }
                return best;
            }
            return findClosestTo(this.root);
        }
    }

};