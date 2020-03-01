class Point {
    constructor(lat, lon) {
        this.lat =  lat;
        this.lon = lon;
    }

    add(otherCoord) {
        return new Point(this.lat + otherCoord.lat, this.lon + otherCoord.lon)
    }

    subtract(otherCoord) {
        return new Point(this.lat - otherCoord.lat, this.lon - otherCoord.lon)
    }

    static toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    static toDegrees(radians) {
        return radians * (180 / Math.PI)
    }

    /**
     * Constrain degrees to range 0..360 (e.g. for bearings); -1 => 359, 361 => 1.
     *
     * @private
     * @param {number} degrees
     * @returns degrees within range 0..360.
     */
    static wrap360(degrees) {
        if (0<=degrees && degrees<360) return degrees; // avoid rounding due to arithmetic ops if within range
        return (degrees % 360 + 360) % 360; // sawtooth wave p:360, a:360
    }


    /**
     * θ = atan2(sin(Δlong)*cos(lat2), cos(lat1)*sin(lat2) − sin(lat1)*cos(lat2)*cos(Δlong))
     * @param {Point} A 
     * @param {Point} B 
     */
    initialBearingTo(B) {
        let lat1 = Point.toRadians(this.lat);
        let lat2 = Point.toRadians(B.lat);
        let lon1 = Point.toRadians(this.lon);
        let lon2 = Point.toRadians(B.lon);
        let lon_difference = lon2 - lon1;
        let bearing = Math.atan2(Math.sin(lon_difference) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon_difference));
        let compass_bearing = Point.toDegrees(bearing);
        compass_bearing = Point.wrap360(compass_bearing);
        return compass_bearing;
    }

     /**
     * Returns final bearing arriving at destination point from ‘this’ point; the final bearing will
     * differ from the initial bearing by varying degrees according to distance and latitude.
     *
     * @param   {LatLon} point - Latitude/longitude of destination point.
     * @returns {number} Final bearing in degrees from north (0°..360°).
     *
     * @example
     *   const p1 = new Point(52.205, 0.119);
     *   const p2 = new Point(48.857, 2.351);
     *   const b2 = p1.finalBearingTo(p2); // 157.9°
     */
    finalBearingTo(point) {
        // get initial bearing from destination point to this point & reverse it by adding 180°

        const bearing = point.initialBearingTo(this) + 180;

        return Point.wrap360(bearing);
    }

    /**
     * 2D vector cross product analog.
     * The cross product of 2D vectors results in a 3D vector with only a z component.
     * This function returns the magnitude of the z value.
     * @param {Point} A 
     * @param {Point} B 
     */
    static crossProduct(A, B) {
        return A.lat * B.lon - A.lon * B.lat;
    }

    /**
     * 
     * @param {Point} A 
     * @param {Point} B 
     */
    static turnDirection(source, target) {
        let theta = target - source;
        if (theta < 0) theta + 360;
        if (theta > 180)return "RIGHT"
        else if (theta < 180)return "LEFT";
        else ""
    }

}

module.exports = Point;