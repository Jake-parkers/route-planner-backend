const request = require('request-promise');
const RoutePlannerModel = require('./model');
const model = new RoutePlannerModel();

class RoutePlannerService {
    constructor () {}

    getDirections(payload) {
        return new Promise((resolve, reject) => {
            request({
                method: 'POST',
                uri: 'https://uimaps-core.herokuapp.com/api/v1/search/',
                body: {
                    source: payload.source,
                    destination: payload.destination
                },
                json: true
            }).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            })
        })
    }

    locationExists(payload) {
        return new Promise((resolve, reject) => {
            model.locationExists(payload.name).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error);
            })
        })
    }
}

module.exports = RoutePlannerService;
