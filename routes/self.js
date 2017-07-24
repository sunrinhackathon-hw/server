module.exports = init

function init(app, Users){
    app.post("/self/updateNickname", (req, res)=>{
        var token = req.body.token
        var nickname = req.body.nickname
         
        Users.findOne({"token" : token}, (err, user)=>{
            if(err){
                console.log("self.js: user find err")
                throw err
            }
            if(!user){
                console.log("user not found")
                res.send(400, {"message" : "user not found"})
            }else{
                user.name = nickname
                
                user.save((err, user)=>{
                    if(err){
                        console.log("user save err")
                        throw err
                    }else{
                        res.send(200, user)
                    }
                })
            }
        })
    })

    app.post("/self/getSelfInfo", (req, res)=>{
        var token = req.body.token

        Users.findOne({"token" : token} , (err, user)=>{
            if(err){
                console.log("self.js : user find err")
                throw err
            }
            if(!user){
                console.log("user not found")
                res.send(400, {"message" : "user not found"})
            }else{
                res.send(200, user)
            }
        })
    })

    app.post("/self/gethistory", (req, res)=>{
        var token = req.body.token
    
        Users.findOne({"token" : token}, (err, user)=>{
            if(user){
                res.send(user.history)            
            }
        })
    })
}
