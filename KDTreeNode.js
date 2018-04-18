'use strict';

module.exports = function createKDTreeNode(point, axisIndex, depth, parent) {
	return new (function () {
		let _depth;
		let _parent;
		let _axisIndex;

		return class KDTreeNode {

			constructor(point, axisIndex, depth, parent) {
				this.point = point;
				this.left = null;
				this.right = null;
				_axisIndex = axisIndex;
				_depth = depth;
				_parent = parent;
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
	}())(point, axisIndex, depth, parent);
}