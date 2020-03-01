const Database = require('../../../libraries/database');
const db = new Database();
const dbDriver = db.connect();

class Location {
    constructor(name, local_name, vertex_id){
        this.name = name;
        this.local_name = local_name;
        this.vertex_id = vertex_id;
    }
}

class RoutePlannerModel {
    constructor(name) {
        this.location_name = name;
    }
    
    locationExists(name) {
        let locations = []
        const session = dbDriver.session();
        return new Promise((resolve, reject) => {
            const readTx = session.readTransaction((tx) => {
                return tx.run(
                    "MATCH(n:Node) WHERE (n.name=~ '(?i)[a-z]*"+name+".*') OR (n.local_name=~ '(?i)[a-z]*"+name+".*') return n.local_name as local_name, n.name as name, n.vertex_id as vertex_id"
                )
            });
            readTx.then((result) => {
                session.close();
                if(result.records.length > 0) {
                    result.records.map(record => {
                        let location = new Location(record.get("name"), record.get("local_name"), record.get("vertex_id"));
                        console.log(location);
                        locations.push(location);
                    });
                    resolve(locations);
                } else reject("Location does not exist in our database currently");
            }).catch(error => {
                session.close();
                reject(error.message);
            })
        })
    }

}

module.exports = RoutePlannerModel;