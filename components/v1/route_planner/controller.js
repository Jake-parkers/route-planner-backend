const RoutePlannerService = require('./service');
const service = new RoutePlannerService();
const Response = require('../../../libraries/response');
const Validator = require('./validator');
const Errors = require('../../../libraries/errors');
const Transformer = require('./transformer');

const Geo = require('../../../libraries/compass_points');
const Point = require('../../../libraries/point');


class DirectionsResult  {
    constructor(resultObject) {
        this.path = resultObject.path;
        this.distance = resultObject.distance;
        this.eta = resultObject.eta;
        this.coords = resultObject.coords;
        this.images = resultObject.images;
        this.names = resultObject.names;
    }
}

class RoutePlannerController {
    constructor() {}

    getDirections(payload) {
        return new Promise((resolve, reject) => {
            service.getDirections(payload).then(result => {
                let data = new DirectionsResult(result.message);
                let directions = RoutePlannerController.determineBearing(data);
                resolve(new Response('success', null, {
                    eta: result.eta,
                    distance: result.distance,
                    directions
                }, 200));
            }).catch(error => {
                reject(error);
            })
        })
    }

    static determineBearing(geoData) {
        let directionIsFound = false;
        let directions = [];
        let result = RoutePlannerController.findAngle(geoData);
        let temp_compass_point;
        result.bearings.forEach((bearing, index) => {
            for (let [compass_point, Point] of Object.entries(Geo.COMPASS_POINTS)) {
                temp_compass_point = compass_point;
                if (Point.inRange(bearing)) {
                    directions.push({
                        text: `Head ${compass_point} towards ${geoData.names[result.nodes[index]]}\n`,
                        image: geoData.images[result.nodes[index]]
                    })
                    directionIsFound = true;
                    break;
                }
            }
            if (!directionIsFound) directions.push({
                text: `Head ${temp_compass_point} towards ${geoData.names[result.nodes[index]]}\n`,
                image: geoData.images[result.nodes[index]]
            })
        });
        // for (let [node, bearing] of Object.entries(angles)) {
        //     for (let [compass_point, Point] of Object.entries(Geo.COMPASS_POINTS)) {
        //         if (Point.inRange(bearing)) {
        //             directions.push({
        //                 text: `Head ${compass_point} towards ${geoData.names[node]}\n`,
        //                 image: geoData.images[node]
        //             })
        //             directionIsFound = true;
        //             break;
        //         }
        //     }
        //     if (!directionIsFound) directions.push({
        //         text: `Head ${compass_point} towards ${geoData.names[node]}\n`,
        //         image: geoData.images[node]
        //     })
        // }
        return directions;

    }

    static findAngle(geoData) {
        let bearings = [];
        let nodes = [];
        for (let i = 0; i < geoData.path.length; i++) {
            if (geoData.path[i + 1] !== undefined) {
                let p1 = new Point(geoData.coords[geoData.path[i].index]["lat"], geoData.coords[geoData.path[i].index]["lon"]);
                let p2 = new Point(geoData.coords[geoData.path[i + 1].index]["lat"], geoData.coords[geoData.path[i + 1].index]["lon"]);
                let angle = p1.finalBearingTo(p2);
                bearings.push(angle);
                nodes.push(geoData.path[i + 1].index);
            }
        }
        return {
            bearings,
            nodes
        };
    }

    locationExists(payload) {
        return new Promise((resolve, reject) => {
            service.locationExists(payload).then(result => {
                console.log(result);
                resolve(new Response('success', null, result, 200));
            }).catch(error => {
                console.log(error);
                reject(error);
            })
        })
    }
}

module.exports = RoutePlannerController;
