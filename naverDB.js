var request = require("request")
var urlencode = require('urlencode');
var mongoose = require('mongoose');
var delay = require('delay');

mongoose.connect("mongodb://localhost:/dudco", (err) => {
    if(err){
        console.log("db connected error");
        throw err;
    }
});

var LocSchema = mongoose.Schema({
    title : String,
    address : String,
    roadAddress : String,
    longitude : String,
    latitude : String
})

LocData = mongoose.model('location', LocSchema);

// 1 ~ 99 ; 100 ~ 199 ; 200 ~ 299

function requestDB(num){
    
    var options = {
        url: 'https://openapi.naver.com/v1/search/local.json?display=9&start='+ num +'&query='+urlencode('공중전화'),
        headers: {
                'X-Naver-Client-Id': 'djXqKlGSzwJRLfpChMsX',
                'X-Naver-Client-Secret':'pRfku1I1au'
            },
    };

    request.get(options, (err, res, body)=>{
        //console.log(body.items)
        var jbody = JSON.parse(body)
        console.log(jbody.items.length)
        for(var i = 0 ; i < jbody.items.length ; i++){
            setTimeout(function(i){
                toWGS(jbody.items[i].mapx, jbody.items[i].mapy, (data)=>{
                    //console.log(data.x + "    " + data.y)
                    LocData.findOne({"title" : jbody.items[i].title}, (loc) =>{
                        if(loc){
                            console.log("data exist")
                        }else{
                            var nLoc = LocData({
                                title : jbody.items[i].title,
                                address : jbody.items[i].address,
                                roadAddress : jbody.items[i].roadAddress,
                                longitude : data.x,
                                latitude : data.y
                            })

                            nLoc.save((err)=>{
                                if(err){
                                    console.log("save err")
                                }
                            }).then((loc)=>{
                                console.log(loc.title + "saved!")
                            })
                        }
                    })
                })
            }, 800 * i, i)
        }
    })
}

function toWGS(x, y, callback){
    var toWGSOptions = {
        url: 'https://dapi.kakao.com/v2/local/geo/transcoord.json?input_coord=KTM&output_coord=WGS84&x='+x+'&y='+y,
        headers:{
            'Authorization':'KakaoAK 4943231fa67b4c345b3478622ec20144'
        }
    };
    request.get(toWGSOptions, (err, res, body)=>{
        try{
            var jbody = JSON.parse(body)
            if(jbody.documents){
                callback(jbody.documents[0])
               // return jbody.documents[0]
            }
        }catch(e){
            console.log(body)
        }
    })  
}

function getDB(){
    requestDB(1)
    
    for(var i = 1; i <= 100 ; i++){
        setTimeout(function(i){
            console.log(i)
            num = i*10
            console.log(num)
            requestDB(num)
        }, 8000 * i, i)
    }
    
}

getDB()
