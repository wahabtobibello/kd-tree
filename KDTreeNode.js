'use strict';

module.exports = function KDTreeNodeFactory () {
  let _depth;
  let _parent;
  let _axisIndex;
  let _point;
  let _left;
  let _right;

  return class KDTreeNode {

    constructor(point, axisIndex, depth, parent) {
      this.point = point;
      _point = point;
      this.left = null;
      _left = null;
      this.right = null;
      _right = null;
      _axisIndex = axisIndex;
      _depth = depth;
      _parent = parent;
    }

    getLeft() {
      return _left;
    }

    setLeft(left) {
      _left = left;
      this.left = left;
    }

    getRight() {
      return _right;
    }

    setRight(right) {
      _right = right;
      this.right = right;
    }

    getPoint() {
      return _point;
    }

    setPoint(point) {
      _point = point;
      this.point = point;
    }

    getDepth() {
      return _depth;
    }

    getParent() {
      return _parent;
    }

    getAxisIndex() {
      return _axisIndex;
    }

  }
};