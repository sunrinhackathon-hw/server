module.exports = init

function init(app, Users){
    app.post("/money/chargeSelf", (req, res)=>{
        var token = req.body.token
        var cost = req.body.cost
        /*
        Users.findOneAndUpdate({"token" : token}, { $add : {"money" : cost}}, (err, user)=>{
            res.send(200, user)
        })
        */

        
        Users.findOne({"token" : token}, (err, user)=>{
            if(err){
                console.log("money.js : user find err")
                throw err
            }
            if(!user){
                console.log("user not found")
                res.send(400, {"message" : "user not found"})
            }else{
                var ncost = user.money*1 + cost*1
                if(user.money){
                    user.money = ncost
                }else{
                    user.money = cost
                }
                user.save((err, nuser)=>{
                    if(err){
                        console.log("money.js: user save err")
                        throw err
                    }else{
                        res.send(200, nuser)
                    }
                })
            }
        })
        
    })


    app.post("/money/chargeFriend", (req, res)=>{
        var cost = req.body.cost
        var token = req.body.token
        var email = req.body.email

        Users.findOne({"token" : token}, (err, user)=>{
            if(err){
                console.log("money.js : user find err")
                throw err
            }
            if(user){
                var ncost = user.money*1 - cost*1
                if(ncost < 0){
                    res.send(400, {"message" : "돈이 부족합니다."})
                }else{
                    user.money = ncost

                    user.save((err, nuser)=>{
                        if(err){
                            console.log("money.js : user save err")
                            throw err
                        }
                        
                        Users.findOne({"email" : email}, (err, tuser)=>{
                            if(err){
                                console.log("money.js : user find err")
                                throw err
                            }
                            if(tuser){
                                var ncost = tuser.money*1 + cost*1
                                tuser.money = ncost
                                tuser.save((err, ntuser)=>{
                                    res.send(200, {"user" : nuser , "tuser" : tuser})
                                })
                            }
                        })
                    })
                }
            }
        })
    })
}
