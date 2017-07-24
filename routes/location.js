module.exports = init;

function init(app, LocData){
    app.get("/map", (req, res)=>{
        console.log(req.query.lat + "  " + req.query.lon)
        
        LocData.find({}, (err, datas)=>{
            if(err){
                console.log("location.js: data find err")
                throw err
            }
            if(datas){
                var dataList = []
                datas.forEach((data)=>{
                    if(calculateDistance(req.query.lat, req.query.lon, data.latitude, data.longitude) < 0.500){
                        dataList.push(data)
                    }
                })
                res.send(200, dataList)
            }
        })  
    })
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    lat1 *= 1
    lon1 *= 1
    lat2 *= 1
    lon2 *= 1

    var R = 6371; // km
    var dLat = (lat2-lat1).toRad();
    var dLon = (lon2-lon1).toRad(); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}

Number.prototype.toRad = function() {
    return this * Math.PI / 180;
}
