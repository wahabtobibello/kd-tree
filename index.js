const KDTreeNode = require("./KDTreeNode");

const buildTree = (points, dimensions, depth = 0, parent = null) => {
    let axis = depth % dimensions.length;
    let isRoot = depth == 0;
    if (points.length === 0) {
        return null;
    }
    if (points.length === 1) {
        return new KDTreeNode(points[0], axis, isRoot);
    }
    points.sort(function (pointA, pointB) {
        return pointA[dimensions[axis]] - pointB[dimensions[axis]];
    });
    let median = Math.floor(points.length / 2);
    let node = new KDTreeNode(points[median], axis, isRoot);
    node.left = buildTree(points.slice(0, median), dimensions, depth + 1, node);
    node.right = buildTree(points.slice(median + 1), dimensions, depth + 1, node);
    return node;
}

module.exports = class KDTree {
    constructor(points = [], dimensions = [], metric = function () { return 0; }) {
        this.root = buildTree(points, dimensions);
        this.dimensions = dimensions;
    }
    insert(point) {
        const innerSearch = (node, parent) => {

            if (node === null) {
                return parent;
            }

            var dimension = this.dimensions[node.axis];
            if (point[dimension] < node.data[dimension]) {
                return innerSearch(node.left, node);
            } else {
                return innerSearch(node.right, node);
            }
        }

        var insertPosition = innerSearch(this.root, null),
            newNode,
            dimension;

        if (insertPosition === null) {
            this.root = new Node(point, 0, null);
            return;
        }
        let newDepth = insertPosition.axis + 1
        let axis = newDepth % dimensions.length;
        let isRoot = newDepth === 0;

        newNode = new KDTreeNode(point, newDepth, isRoot);
        dimension = dimensions[insertPosition.dimension];

        if (point[dimension] < insertPosition.data[dimension]) {
            insertPosition.left = newNode;
        } else {
            insertPosition.right = newNode;
        }
    }
    remove(point) {

    }
    search(point) {

    }
    rangeSearch() {

    }
    closestTo() {

    }
}

