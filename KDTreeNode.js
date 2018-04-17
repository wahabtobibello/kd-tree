class KDTreeNode {
  constructor(data, depth) {
    this.data = data;
    this.left = null;
    this.right = null;
    this.isRoot = depth == 0;
    this.axis = depth % dimensions.length;
    this.depth = depth;
  }
}
module.exports = KDTreeNode;