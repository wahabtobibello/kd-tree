const createKDTree = require("./../index");

let points = [
  { x: 20, y: 20 },
  { x: 10, y: 30 },
  { x: 25, y: 50 },
  { x: 35, y: 25 },
  { x: 30, y: 45 },
  { x: 30, y: 35 },
  { x: 55, y: 40 },
  { x: 45, y: 35 },
  { x: 50, y: 30 },]
let dimensions = ["x", "y"];
function metric(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

let kdtree = createKDTree(points, dimensions, metric);
console.log("Tree created");

kdtree.remove(points[0]);
console.log(`Point ${JSON.stringify(points[0], null, 4)} has been removed`);

let newPoint = { x: 51, y: 75 }
kdtree.add(newPoint);
console.log(`Point ${JSON.stringify(newPoint, null, 4)} has been added`);

let pivot = { x: 25, y: 20 };
console.log(`Closest point to ${JSON.stringify(pivot, null, 4)} 
                    is ${JSON.stringify(kdtree.closestTo(pivot), null, 4)}`);

let range = [{ x: 10, y: 15 }, { x: 30, y: 50 }]
console.log(`Points within the range of ${JSON.stringify(range, null, 4)} 
                    are ${ JSON.stringify(kdtree.searchRange(...range), null, 4)}`);
