
class CoordDegree {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    inRange(number) {
        return number >= this.start && number <= this.end
    }
}

const COMPASS_POINTS = {
    "North" : new CoordDegree(0, 33),
    "North East": new CoordDegree(34, 78),
    "East": new CoordDegree(79, 123),
    "South East": new CoordDegree(124, 168),
    "South": new CoordDegree(169, 213),
    "South West": new CoordDegree(214, 258),
    "West": new CoordDegree(259, 303),
    "North West": new CoordDegree(304, 348),
}

module.exports = {
    COMPASS_POINTS,
    CoordDegree
}