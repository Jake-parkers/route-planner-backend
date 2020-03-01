const Point = require('./point');

const Direction = Object.freeze({
    RIGHT: Symbol("Right"),
    LEFT: Symbol("Left"),
    STRAIGHT: Symbol("Straight"),
    UTURN: Symbol("Uturn"),
})

/**
 * 
 * @param {Point} A 
 * @param {Point} B 
 * @param {Point} C 
 */
function getTurnDirection(A, B, C)  {
    let p1 = B.subtract(A);
    let p2 = C.subtract(B);

    let cross_product = p1.lat * p2.lon - p1.lon * p2.lat;
    if (cross_product > 0) {
        return Direction.LEFT
    }// turn left
    if (cross_product < 0) {
        return Direction.RIGHT
    } // turn right
    // cross_product is zero, use dot product to detect if its a straight line or a u-turn
    let dot_product = p1.lat * p2.lat + p1.lon * p2.lon;
    console.log("dot_product => ", dot_product);
    if (dot_product > 0) {
        return Direction.STRAIGHT
    } // go straight
    // u-turn
    return Direction.UTURN;
}


/**
 * θ = atan2(sin(Δlong)*cos(lat2), cos(lat1)*sin(lat2) − sin(lat1)*cos(lat2)*cos(Δlong))
 * @param {Point} A 
 * @param {Point} B 
 */
function getBearing(A, B) {
    let lat1 = Point.toRadians(A.lat);
    let lat2 = Point.toRadians(B.lat);
    let lon1 = Point.toRadians(A.lon);
    let lon2 = Point.toRadians(B.lon);
    let lon_difference = lon2 - lon1;
    let bearing = Math.atan2(Math.sin(lon_difference) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon_difference));
    let compass_bearing = Point.toDegrees(bearing);
    compass_bearing = Point.wrap360(compass_bearing);
    return compass_bearing;
}

// fassa to FLT
console.log(new Point(7.4437474, 3.8939585).finalBearingTo(new Point(7.4452255, 3.89315)));
console.log(new Point(7.4452255, 3.89315).finalBearingTo(new Point(7.4440986, 3.89331)));
console.log(getTurnDirection(new Point(7.4437474, 3.8939585),new Point(7.4452255, 3.89315),  new Point(7.4440986, 3.89331)));

console.log(new Point(7.4460407, 3.8938002).finalBearingTo(new Point(7.4440986, 3.89331)));
console.log(getTurnDirection(new Point(7.4460407, 3.8938002),  new Point(7.4437474, 3.8939585), new Point(7.4440986, 3.89331)));

