const KDTree = require("./../index");

points = [{ x: 5, y: 2 }, { x: 1, y: 1 }, { x: 3, y: 4 }, { x: 2, y: 9 }, { x: 7, y: 4 },]
dimensions = ["x", "y"];
function metric(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

let kdtree = new KDTree(points, dimensions, metric);
console.log(JSON.stringify(kdtree, null, 4));
kdtree.insert({ x: 1, y: 6 });
console.log(JSON.stringify(kdtree, null, 4));
