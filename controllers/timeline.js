'use strict'

const Timeline = require('../models/timeline')
const User = require('../models/user')

function getTimeline(req, res) {
    //console.log("getTimeline: " + req.body)
    Timeline.find({}, (err, timeline) => {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
        if (!timeline) return res.status(404).send({ message: `No existen timeline` })

        res.status(200).send({ timeline: timeline })
    })
}

function getTimeLineByEmail(req, res) {
    let email = req.params.email
    Timeline.find().where("email", email).exec((err, timeline) => {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
        if (!timeline) return res.status(404).send({ message: `El timeline no existe` })

        res.status(200).send({ timeline: timeline })
    })
}

function getPaginateTimeline(req, res) {
    //console.log("getPaginateTimeline: " + req.body)
    let limite = 10;
    //let email = req.search.params.emailUser;
    let req_email = req.query['emailUser'];
    let req_num_page = req.query['num_page'];
    console.log("emailUser: " + req_email)
    console.log("req_num_page: " + req_num_page)
    let page = (parseInt(req_num_page) - 1) * limite,
        num_page = parseInt(req_num_page),
        search = req.query.search,
        count;
    Timeline
        .count()
        .then(date => {
            count = parseInt((date / limite) + 1);
        });
    Timeline
        .find({ emailUser: { '$ne': req_email } })
        .skip(page)
        .limit(limite)
        .sort({createTimeline: -1})
        .then(timeline => {
            let context = {
                timeline: timeline,
                num_page: num_page,
                count: count,
                limit: limite
            }
            res.status(200).send(context)
            //res.render('user', context);
        });
}

function addTimeLine(req, res) {
    console.log("addTimeLine: ")
    let timeline = Timeline()
    timeline.emailUser = req.body.emailUser
    timeline.createTimeline = Date.now();
    timeline.animalName = req.body.animalName
    timeline.location = req.body.location
    timeline.animalPhoto = req.body.animalPhoto
    timeline.descriptiontTimeline = (req.body.descriptiontTimeline).replace("\"", '')
    timeline.likes = 0
    timeline.duelPhoto = 0
    timeline.activePhoto = 1
    timeline.likes = 0,
    timeline.bones= 0,
    timeline.soap = 0,
    timeline.toy = 0,
    timeline.present = 0,
    timeline.photoban = 0,
    //timeline.photoSelected = 0

    timeline.save((err, timelineStored) => {
        if (err) return res.status(500).send({ message: `Error al salvar la base de datos ${err} ` })

        res.status(200).send({ timeline: timelineStored })
    })

}


function addLikeUser(req, res) {
    console.log("addLikeUser: ")
    let userId = req.params.userId
    //let update = req.body

    Timeline.findByIdAndUpdate(userId, { $inc: { "likes": 1 } }, (err, userUpdate) => {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
        //if (!user) return res.status(404).send({ message: `El user no existe`})

        res.status(200).send({ user: userUpdate })
    })

}
function deleteTimeline(req, res) {
    let userId = req.params.userId

    Timeline.findById(userId, (err, user) => {
        if (err) res.status(500).send({ message: `Error al borrar el usuario ${err} ` })

        Timeline.remove(err => {
            if (err) res.status(500).send({ message: `Error al borrar el usuario ${err} ` })

            res.status(200).send({ message: 'El usuario ha sido eliminado' })
        })
    })

}

function addtoy(req, res) {
    console.log("Entraaa addtoy ")
    let update = req.body
    let email = String(update.email);
    let userId =  String(update.myid);
    let timelineId =  String(update.timelineid).replace('"', '');
    console.log("Entraaa addtoy " + timelineId)
    User.update({ "email": email }, { $inc: { "articles.toy": 1, "level": 1 } }, (err, userUpdate) => {
        if (err){
            
            return res.status(500).send({ message: `[addtoy] Error al realizar la peticion addtoy: ${err}` })
        }else if (!userUpdate) {
            return res.status(404).send({ message: `El user no existe` }) 
        }
        else{

            User.findByIdAndUpdate(userId, { $inc: { "articles.toy": -1, "level": 1 } }, (err, userUpdate) => {
                if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
                if (!userUpdate) return res.status(404).send({ message: `El user no existe` })

                Timeline.findByIdAndUpdate(timelineId, { $inc: { "toy": 1 } }, (err, userUpdate) => {
                    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
                    if (!userUpdate) return res.status(404).send({ message: `El user no existe` })


                     })

                res.status(200).send({ user: userUpdate })
                })
        }      
    })
}

function addPresent(req, res) {
    let update = req.body
    let email = String(update.email);
    let userId =  String(update.myid);
    let timelineId =  String(update.timelineid).replace('"', '');

    User.update({ "email": email }, { $inc: { "articles.present": 1, "level": 5 } }, (err, userUpdate) => {
        if (err){
            console.log("Entraaa timelineId " + timelineId)
            return res.status(500).send({ message: `[addpresent] Error al realizar la peticion addpresent: ${err}` })
        }else if (!userUpdate) {
            return res.status(404).send({ message: `El user no existe` }) 
        }
        else{
            console.log("Entraaa 2 ")
            User.findByIdAndUpdate(userId, { $inc: { "articles.present": -1, "level": 5 } }, (err, userUpdate) => {
                if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
                if (!userUpdate) return res.status(404).send({ message: `El user no existe` })

                Timeline.findByIdAndUpdate(timelineId, { $inc: { "present": 1 } }, (err, userUpdate) => {
                    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
                    if (!userUpdate) return res.status(404).send({ message: `El user no existe` })


                     })
                
                res.status(200).send({ user: userUpdate })
                })
        }  
    })
}
function addBones(req, res) {
    let update = req.body
    let email = String(update.email);
    let userId =  String(update.myid);
    let timelineId =  String(update.timelineid).replace('"', '');
    User.update({ "email": email }, { $inc: { "articles.bones": 1, "level": 1 } }, (err, userUpdate) => {
        if (err){
            console.log("Entraaa ")
            return res.status(500).send({ message: `[addBones] Error al realizar la peticion addBones: ${err}` })
        }else if (!userUpdate) {
            return res.status(404).send({ message: `El user no existe` }) 
        }
        else{
            console.log("Entraaa 2 ")
            User.findByIdAndUpdate(userId, { $inc: { "articles.bones": -1, "level": 1 } }, (err, userUpdate) => {
                if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
                if (!userUpdate) return res.status(404).send({ message: `El user no existe` })

                Timeline.findByIdAndUpdate(timelineId, { $inc: { "bones": 1 } }, (err, userUpdate) => {
                    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
                    if (!userUpdate) return res.status(404).send({ message: `El user no existe` })


                     })
                
                res.status(200).send({ user: userUpdate })
                })
        }      
    })
}
function addSoap(req, res) {
    let update = req.body
    let email = String(update.email);
    let userId =  String(update.myid);
    let timelineId =  String(update.timelineid).replace('"', '');
    User.update({ "email": email }, { $inc: { "articles.soap": 1, "level": 1 } }, (err, userUpdate) => {
        if (err){
            console.log("Entraaa ")
            return res.status(500).send({ message: `[addsoap] Error al realizar la peticion addsoap: ${err}` })
        }else if (!userUpdate) {
            return res.status(404).send({ message: `El user no existe` }) 
        }
        else{
            console.log("Entraaa 2 ")

            User.findByIdAndUpdate(userId, { $inc: { "articles.soap": -1, "level": 1 } }, (err, userUpdate) => {
                if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
                if (!userUpdate) return res.status(404).send({ message: `El user no existe` })

                Timeline.findByIdAndUpdate(timelineId, { $inc: { "soap": 1 } }, (err, userUpdate) => {
                    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
                    if (!userUpdate) return res.status(404).send({ message: `El user no existe` })


                     })
                
                res.status(200).send({ user: userUpdate })
                })

        } 

        
    })
    
}
function addPhotoBan(req, res) {
        console.log("addPhotoBan ")
        let update = req.body
        let email = String(update.email);
        let timelineId =  String(update.timelineid).replace('"', '');
        User.update({ "email": email }, { $inc: { "userBan": 1 } }, (err, userUpdate) => {
            if (err) {
                console.log("Entraaa ")
                return res.status(500).send({ message: `[addsoap] Error al realizar la peticion addsoap: ${err}` })
            } else if (!userUpdate) {
                return res.status(404).send({ message: `El user no existe` })
            } else {

                Timeline.findByIdAndUpdate(timelineId, { $inc: { "photoban": 1 } }, (err, userUpdate) => {
                    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
                    if (!userUpdate) return res.status(404).send({ message: `El user no existe` })


                })
            }

        })
    }

module.exports = {
    getTimeLineByEmail,
    getPaginateTimeline,
    addTimeLine,
    addLikeUser,
    getTimeline,
    deleteTimeline,
    addtoy,
    addPresent,
    addBones,
    addSoap,
    addPhotoBan
}