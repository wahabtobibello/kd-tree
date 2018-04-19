const createKDTreeNode = require("./KDTreeNode");

module.exports = function createKDTree(point, axisIndex, depth, parent) {
    return new (function () {
        let _axes = null;
        let _dimension = null;
        let _metric = null;
        let _points = null;

        const buildTree = (points, depth = 0, parent = null) => {

            let currentAxisIndex = depth % _dimension,
                median,
                node;

            if (points.length === 0) {
                return null;
            }
            if (points.length === 1) {
                return createKDTreeNode(points[0], currentAxisIndex, depth, parent);
            }

            points.sort(function (pointA, pointB) {
                return pointA[_axes[currentAxisIndex]] - pointB[_axes[currentAxisIndex]];
            });

            median = Math.floor(points.length / 2);
            node = createKDTreeNode(points[median], currentAxisIndex, depth, parent);
            node.left = buildTree(points.slice(0, median), depth + 1, node);
            node.right = buildTree(points.slice(median + 1), depth + 1, node);

            return node;
        }

        return class KDTree {

            constructor(points, axes, metric) {
                _points = [...points];
                _axes = [...axes];
                _dimension = axes.length;
                _metric = metric;
                this.root = buildTree(_points);
            }

            add(point) {
                const getInsertPosition = (node, parent) => {

                    if (node === null) {
                        return parent;
                    }
                    var axis = _axes[node.getAxisIndex()];
                    if (point[axis] < node.point[axis]) {
                        return getInsertPosition(node.left, node);
                    } else {
                        return getInsertPosition(node.right, node);
                    }

                }
                var insertPosition = getInsertPosition(this.root, null),
                    newNode,
                    axis;

                if (insertPosition === null) {
                    this.root = createKDTreeNode(point, 0, 0, null);
                    return;
                }

                newNode = createKDTreeNode(point, (insertPosition.getAxisIndex() + 1) % _dimension, insertPosition.getDepth() + 1, insertPosition);
                axis = _axes[insertPosition.getAxisIndex()];

                if (point[axis] < insertPosition.point[axis]) {
                    insertPosition.left = newNode;
                } else {
                    insertPosition.right = newNode;
                }
                _points = [..._points, point];
            }

            addAndRebuildTree(point) {
                _points = [..._points, point];
                this.root = buildTree(_points);
            }

            remove(point) {
                let node;

                const findNode = (node) => {
                    if (node === null) {
                        return null;
                    }

                    if ((_axes.reduce((acc, curr) => {
                        return acc && node.point[curr] === point[curr]
                    }, true))) {
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

                _points = _points.filter((value) => value !== node.point);
            }

            removeAndRebuildTree(point) {
                _points = _points.filter((value) => value !== node.point);
                this.root = buildTree(_points);
            }

            searchRange(pointA, pointB) {
                let result = [];
                let count = 0;
                let minValuesByAxis = _axes.reduce((acc, curr) => ({
                    ...acc,
                    [curr]: Math.min(pointA[curr], pointB[curr])
                }), {});
                let maxValuesByAxis = _axes.reduce((acc, curr) => ({
                    ...acc,
                    [curr]: Math.max(pointA[curr], pointB[curr])
                }), {});

                (function findResult(node) {
                    if (node == null) {
                        return;
                    }

                    let axis = _axes[node.getAxisIndex()];

                    if (_axes.reduce((acc, curr) => (acc && node.point[curr] >= minValuesByAxis[curr]
                        && node.point[curr] <= maxValuesByAxis[curr]), true)) {
                        result.push(node.point);
                    }

                    if (node.point[axis] >= minValuesByAxis[axis]) {
                        findResult(node.left);
                    }
                    if (node.point[axis] <= maxValuesByAxis[axis]) {
                        findResult(node.right);
                    }
                })(this.root);

                return result;
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

                    if (point[axis] < node.point[axis]) {
                        nextBranch = node.left;
                        oppositeBranch = node.right;
                    } else {
                        oppositeBranch = node.left;
                        nextBranch = node.right;
                    }

                    let best = closerDistance(point,
                        findClosestTo(nextBranch,
                            depth + 1),
                        node.point);

                    if (_metric(point, best) > Math.abs(point[axis] - node.point[axis])) {
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

    }())(point, axisIndex, depth, parent);
}