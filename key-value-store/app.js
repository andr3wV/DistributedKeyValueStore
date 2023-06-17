const express = require("express")
const axios = require('axios')
const bodyParser = require("body-parser")
const Docker = require('dockerode')
const e = require("express")
const app = express()
app.use(bodyParser.urlencoded({extended : true}))
const key_store = {}

function checkFind(object, key) {
    //checks if a key is in a given object
    var result = object[key];
    return (typeof result !== "undefined") ? true : false;
}
function causalConsistent(metadata){
    //finds the order of the events by comparing causal metadata
    //if the data is not consistent with the causal order it returns an error
    let sameVector = null
    let lessThan = null
    for (i=0;i<metadata.length;i++){
        if (metadata[i]===vectorClock[i]){
            continue
        }else{
            sameVector = false
            if (metadata[i]<vectorClock[i]){
                continue
            }else{
                lessThan = false
            }
        }
    }
    if (sameVector === null){
        sameVector = true
    }
    if (lessThan === null){
        lessThan = true
    }
    if (sameVector === false && lessThan === true){
        return true
    }else if (sameVector === true && lessThan === false){
        return 2
    }else {
        return false
    }
}


function broadcastReplicate(dataBody,route){
    //broadcasts the data to every replica and checks if they are down and if so then it broadcasts a delete request for that replica node
    for (let i = 0; i < view.length; i++) {
        const address = Object.keys(view)[i];
        if (address === ipAddress) {
        continue;
        }
    axios.put(address+route,{"value":dataBod.value,"broadcast":true},{
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        }})
        .then(function (response) {
            if (response.status===503){
                setTimeout(() => {
                    console.log("Delayed for 1 second.");
                  }, "1000");
                  axios.put(address+route,{"value":dataBod.value,"broadcast":true},{
                    headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                    }})
                    .then(function(req,res){
                        res.status(response.status).send(response.data)
                    })
                    .catch(function (error) {
                        // handle error
                        res.status(error.response.status).send(error.response.data);
                    })
            }else if (response.status===500){
                for (let i = 0; i < view.length; i++) {
                    const address = Object.keys(view)[i];
                    if (address === ipAddress) {
                    continue;
                    }
                //broadcasts a delete from the view, different from broadcastDelete() function
                axios.delete(address+"\view", {"socket-address":address,"broadcast":true},{
                    headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                    }})
                    .then(function (response) {
                        // handle success
                        res.status(response.status).send(response.data)
                    })
                    .catch(function (error) {
                        // handle error
                        res.status(error.response.status).send(error.response.data);
                    })
                }
            }else{
            // handle success
            res.status(response.status).send(response.data)
            }
        })
        .catch(function (error) {
            // handle error
            res.status(error.response.status).send(error.response.data);
        })
    }

}

function broadcastDelete(route){
    //broadcasts a delete in the key value store 
    for (let i = 0; i < view.length; i++) {
        const address = Object.keys(view)[i];
        if (address === ipAddress) {
        continue;
        }
    axios.delete(address+route, {"broadcast":true})
        .then(function (response) {
            // handle success
            res.status(response.status).send(response.data)
        })
        .catch(function (error) {
            // handle error
            res.status(error.response.status).send(error.response.data);
        })
    }

}

// if (!process.env.FORWARDING_ADDRESS){

// main().catch(err => console.log(err));

// async function main() {
//     app.route("/hello")
//     .get(function(req,res){
//         res.status(200).json({
//             "message":"world"
//         })
//     })
//     app.route("/hello")
//     .post(function(req,res, next){
//         const err = new Error('Method Not Allowed');
//         err.status = 405;
//         next(err);
//     })


//     app.route("/hello/:name")
//     .post(function(req,res){
//         res.status(200).json({
//             "message":"Hi, "+req.params.name
//         })
//     })
//     .get(function(req,res,next){
//         const err = new Error('Method Not Allowed');
//         err.status = 405;
//         next(err);
//     })

    
//     app.route("/test")
//     .get(function(req,res){
//         res.status(200).json({
//             "message":"test is successful"
//         })
//     })
//     .post(function(req,res,next){
//         if(!req.query.msg) {
//             const err = new Error('Unkown query parameter');
//             err.status = 400;
//             next(err);
//         }else{
//         res.status(200).json({
//             "message":req.query.msg
//         })}
//     })


//     app.route("/kvs/:key")
//     .put(function(req,res){
//         console.log(req.body)
//         if (req.params.key.length > 50){
//             res.status(400).json({"error" : "Key is too long"})
//         }else{
//             if (!checkFind(req.body,"value")){
//                 res.status(400).json({"error" : "PUT request does not specify a value"})
//             }else{
            
//             if (!checkFind(key_store, req.params.key)){
//                 key_store[req.params.key] = req.body.value
//                 res.status(201).json({"result" : "created"})
//             }else{
//                 key_store[req.params.key] = req.body.value
//                 res.status(200).json({"result" : "replaced"})
//             }
//         }
//     }
//     })
//     .get(function(req,res){
//         if (!checkFind(key_store, req.params.key)){
//             res.status(404).json({"error" : "Key does not exist"})
//         } else{
//             res.status(200).json({"result" : "found", "value" : key_store[req.params.key]})
//         }
//     })
//     .delete(function(req,res){
//         if (!checkFind(key_store, req.params.key)){
//             res.status(404).json({"error" : "Key does not exist"})
//         } else{
//             delete key_store[req.params.key]
//             res.status(200).json({"result" : "deleted"})
//         }
//     })







//     app.listen(8090,function(){
//         console.log("Running main on port 8082")
//     })

// }
// //-------------------------------------------------------PROXY-------------------------------------------------------------

// } else{


// main().catch(err => console.log(err));

// async function main() {

// app.route("/hello")
//     .get(function(req,res){
//         axios.get('http://10.10.0.2:8090/hello')
//         .then(function (response) {
//             // handle success
//             res.status(response.status).send(response.data)
//         })
//         .catch(function (error) {
//             // handle error
//             res.send(error);
//         })
//     })

//     .post(function(req, res) {
//         axios.post('http://10.10.0.2:8090/hello')
//         .then(function (response) {
//             // handle success
//             res.status(response.status).send(response.data)
//         })
//         .catch(function (error) {
//             // handle error
//             res.status(error.response.status).send(error.response.statusText)
//         })
//     })

//     app.route("/hello/:name")
//     .post(function(req,res){
//         axios.post('http://10.10.0.2:8090/hello/'+req.params.name)
//         .then(function (response) {
//             // handle success
//             res.status(response.status).send(response.data)
//         })
//         .catch(function (error) {
//             // handle error
//             res.send(error);
//         })
//     })
//     .get(function(req,res){
//         axios.get('http://10.10.0.2:8090/hello/'+req.params.name)
//         .then(function (response) {
//             // handle success
//             res.status(response.status).send(response.data)
//         })
//         .catch(function (error) {
//             // handle error
//             res.status(error.response.status).send(error.response.statusText)
//         })
//     })

    
//     app.route("/test")
//     .get(function(req,res){
//         axios.get('http://10.10.0.2:8090/test')
//         .then(function (response) {
//             // handle success
//             res.status(response.status).send(response.data)
//         })
//         .catch(function (error) {
//             // handle error
//             res.send(error);
//         })
//     })
//     .post(function(req,res){
//         if (typeof(req.query.msg) !== 'undefined'){
//             var newPath = '/test?msg='+req.query.msg
//         }else{
//             var newPath = '/test'
//             }
//             axios.post('http://10.10.0.2:8090'+newPath)
//             .then(function (response) {
//                 // handle success
//                 res.status(response.status).send(response.data)
//             })
//             .catch(function (error) {
//                 // handle error
//                 res.status(error.response.status).send(error.response.statusText)
//             })
//     })


//     app.route("/kvs/:key")
//     .put(function(req,res){
//         console.log(typeof(req.body))
//         axios.put('http://10.10.0.2:8090/kvs/'+req.params.key, req.body,{
//             headers: {
//               'Content-Type': 'application/x-www-form-urlencoded'
//             }})
//         .then(function (response) {
//             // handle success
//             res.status(response.status).send(response.data)
//         })
//         .catch(function (error) {
//             // handle error
//             console.log(error)
//             res.status(error.response.status).send(error.response.data)
//         })
//     })
//     .get(function(req,res){
//         axios.get('http://10.10.0.2:8090/kvs/'+req.params.key)
//         .then(function (response) {
//             // handle success
//             res.status(response.status).send(response.data)
//         })
//         .catch(function (error) {
//             // handle error
//             res.status(error.response.status).send(error.response.data)
//         })
//     })
//     .delete(function(req,res){
//         axios.delete('http://10.10.0.2:8090/kvs/'+req.params.key)
//         .then(function (response) {
//             // handle success
//             res.status(response.status).send(response.data)
//         })
//         .catch(function (error) {
//             // handle error
//             res.status(error.response.status).send(error.response.data);
//         })
//     })


//     app.listen(8090,function(){
//         console.log("Running proxy on port 8083")
//     })
// }
// }

// -------------------------------------------- REPLICAS ---------------------------------------------
const view = {}
const vectorClock = []
const docker = new Docker();
const containerId = process.env.HOSTNAME;
const container = docker.getContainer(containerId);
container.inspect(function (err, data) {
    if (err) {
      console.error(err);
      return;
    }
  
    var ipAddress = data.NetworkSettings.Networks.bridge.IPAddress
  });
  



main().catch(err => console.log(err));

async function main() {
    app.route("/view")
    .put(function(req,res){
        //if the request is a broadcast we don't want to chain broadcasts
        if (req.body.broadcast){
            if (view[req.body.socket-address]){
                res.status(200).json({"result":"already present"})
            }else{
            vectorClock.push(0)
            view[req.body.socket-address] = vectorClock.length -1
            res.status(201).json({"result":"added"})
            }
        }else{
        //else we treat it has the origin of the view put request
        if (view[req.body.socket-address]){
            res.status(200).json({"result":"already present"})
        }else{
        //broadcast the request to all over replicas 
        for (let i = 0; i < view.length; i++) {
                const address = Object.keys(view)[i];
                if (address === ipAddress) {
                continue;
                }
            axios.put(address+"\view", {"socket-address":address,"broadcast":true},{
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                }})
                .then(function (response) {
                    // handle success
                    res.status(response.status).send(response.data)
                })
                .catch(function (error) {
                    // handle error
                    res.status(error.response.status).send(error.response.data);
                })
            }
            if (Object.keys(view).length > 1){
                axios.get(Object.keys(view)[0]+"/kvs")
                .then(function (response) {
                    // handle success
                    key_store = response.data
                    res.status(response.status).send(response.data)
                })
                .catch(function (error) {
                    // handle error
                    res.status(error.response.status).send(error.response.data)
                })
            }
            vectorClock.push(0)
            view[req.body.sock-address] = vectorClock.length -1
            res.status(201).json({"result":"added"})
            }
        }
    })
    .get(function(req,res){
        const viewList = []
        const keys = Object.keys(view)
        keys.forEach(function(key){
            viewList.push(key)
        })
        res.status(200).json({"view":viewList})
    })
    .delete(function(req,res){
        if (view[req.body.socket-address]){
            vectorClock[view[req.body.socket-address]] = null
            delete view[req.body.socket-address]
            res.status(200).json({"result":"deleted"})
        }else{
            res.status(404).json({"error":"View has no such replica"})
        }
    })

    app.route("/kvs")
    .get(function(req,res){
        res.status(200).json(key_store)
    })


    app.route("/kvs/:key")
    .put(function(req,res){
        const causality = causalConsistent(req.body.causal-metadata)
        if (causality === true){
            if (req.params.key.length > 50){
                res.status(400).json({"error" : "Key is too long"})
            }else{
                if (!checkFind(req.body,"value")){
                    res.status(400).json({"error" : "PUT request does not specify a value"})
                }else{
                
                if (!checkFind(key_store, req.params.key)){
                    if (req.body.broadcast){
                        vectorClock[view[ipAddress]] += 1
                        key_store[req.params.key] = req.body.value
                        res.status(201).json({"result" : "created","causal-metadata":vectorClock })
                    }else{
                        vectorClock[view[ipAddress]] += 1
                        key_store[req.params.key] = req.body.value
                        broadcastReplicate(req.body,"/kvs/"+req.params.key)
                        res.status(201).json({"result" : "created","causal-metadata":vectorClock})
                    }
                }else{
                    if(req.body.broadcast){
                        vectorClock[view[ipAddress]] += 1
                        key_store[req.params.key] = req.body.value
                        res.status(200).json({"result" : "replaced","causal-metadata":vectorClock})
                    }else{
                        vectorClock[view[ipAddress]] += 1
                        key_store[req.params.key] = req.body.value
                        broadcastReplicate(req.body,"/kvs/"+req.params.key)
                        res.status(200).json({"result" : "replaced","causal-metadata":vectorClock})
                    }
                }
            }
        }
        }else if (causality ===false){
            res.status(503).json({"error": "Causal dependencies not satisfied; try again later"})
        }
    })
    .get(function(req,res){
        if (!checkFind(key_store, req.params.key)){
            res.status(404).json({"error" : "Key does not exist"})
        } else{
            vectorClock[view[ipAddress]] += 1
            res.status(200).json({"result" : "found", "value" : key_store[req.params.key], "causal-metadata":vectorClock})
        }
    })
    .delete(function(req,res){
        const causality = causalConsistent(req.body.causal-metadata)
        if (causality === true){
        if (!checkFind(key_store, req.params.key)){
            res.status(404).json({"error" : "Key does not exist"})
        } else{
            if (req.body.broadcast){
            vectorClock[view[ipAddress]] += 1
            delete key_store[req.params.key]
            res.status(200).json({"result" : "deleted","causal-metadata":vectorClock})
            }else{
            vectorClock[view[ipAddress]] += 1
            delete key_store[req.params.key]
            broadcastDelete("/kvs/"+req.params.key)
            res.status(200).json({"result" : "deleted","causal-metadata":vectorClock})
            }
        }
    }else if (causality ===false){
        res.status(503).json({"error": "Causal dependencies not satisfied; try again later"})
    }
    })

    app.listen(8090,function(){
        console.log("Replica started")
    })
}

