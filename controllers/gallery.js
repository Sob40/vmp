'use strict'

const Timeline = require('../models/timeline')
const User = require('../models/user')

function getGallery(req, res) {

    Timeline.find({}, (err, gallery) => {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
        if (!gallery) return res.status(404).send({ message: `No existen galery` })

        res.status(200).send({ gallery: gallery })
    })
}

function getPaginateGallery(req, res) {
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
        .find({"emailUser": req_email })
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


function getGalleryByUser(req, res) {
    console.log('POST /api/getuser')
    console.log(req.body)
    let userId = req.params.userId

    Timeline.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
        if (!user) return res.status(404).send({ message: `El user no existe` })
        console.log("USER: "+user)
        res.status(200).send({ user })
    })
}

function deleteGallery(req, res) {
    let userId = req.params.userId

    Timeline.findById(userId, (err, user) => {
        if (err) res.status(500).send({ message: `Error al borrar el usuario ${err} ` })

        Timeline.remove(err => {
            if (err) res.status(500).send({ message: `Error al borrar el usuario ${err} ` })

            res.status(200).send({ message: 'El usuario ha sido eliminado' })
        })
    })

}
function findByEmail(req, res) {
    console.log('POST /api/galerybyemail')
    //console.log(req.body)
    let email = (req.params.email).replace("\"",'')
    Timeline.find().where("emailUser", email).exec((err, gallery) => {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
        if (!gallery) return res.status(404).send({ message: `El user no existe` })

        res.status(200).send({ gallery: gallery })
    })
}


module.exports = {
    getGallery,
    getGalleryByUser,
    deleteGallery,
    findByEmail,
    getPaginateGallery
}