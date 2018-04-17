class KDTreeNode {
  constructor(data, axis, isRoot) {
    this.data = data;
    this.isRoot = isRoot;
    this.left = null;
    this.right = null;
    this.axis = axis;
  }
}
module.exports = KDTreeNode;