'use strict'

const User = require('../models/user')
const paginate = require('express-paginate');
var CronJob = require('cron').CronJob;


var job = new CronJob({
    cronTime: '*/1 * * * * ',
    onTick: function () {
        /*
         * Runs every weekday (Monday through Friday)
         * at 11:30:00 AM. It does not run on Saturday
         * or Sunday.
         */
        User.update({ "state.hungry": { $gt: 0 } }, { $inc: { "state.hungry": -1 } }, { multi: true }, (err, userUpdate) => {
            if (err) return userUpdate.status(500).send({ message: `Error al realizar la peticion ${err}` })
            //if (!user) return res.status(404).send({ message: `El user no existe`})

            //userUpdate.status(200).send({ user: userUpdate })
        })
        User.update({ "state.cheerful": { $gt: 0 } }, { $inc: { "state.cheerful": -1 } }, { multi: true }, (err, userUpdate) => {
            if (err) return userUpdate.status(500).send({ message: `Error al realizar la peticion ${err}` })
            //if (!user) return res.status(404).send({ message: `El user no existe`})

            //userUpdate.status(200).send({ user: userUpdate })
        })
        User.update({ "state.hygiene": { $gt: 0 } }, { $inc: { "state.hygiene": -1 } }, { multi: true }, (err, userUpdate) => {
            if (err) return userUpdate.status(500).send({ message: `Error al realizar la peticion ${err}` })
            //if (!user) return res.status(404).send({ message: `El user no existe`})

            //userUpdate.status(200).send({ user: userUpdate })
        })
        console.log(" timer: ");
    },
    start: false,
    timeZone: 'America/Los_Angeles'
});
job.start();

function getUser(req, res) {
    /*console.log('POST /api/getuser')
    console.log(req.body)*/
    let userId = req.params.userId

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
        if (!user) return res.status(404).send({ message: `El user no existe` })
        //console.log("USER: " + user)
        res.status(200).send({ user })
    })
}

function getPaginateUser(req, res) {
    let limite = 2;
    let page = (parseInt(req.params.num_page) - 1) * limite,
        num_page = parseInt(req.params.num_page),
        search = req.query.search,
        count;
    User
        .count()
        .then(date => {
            count = parseInt((date / limite) + 1);
        });
    User
        .find()
        .skip(page)
        .limit(limite)
        .then(user => {
            let context = {
                user: user,
                num_page: num_page,
                count: count,
                limit: limite
            }
            res.status(200).send(context)
            //res.render('user', context);
        });
}

function getUsers(req, res) {

    User.find({}, (err, users) => {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
        if (!users) return res.status(404).send({ message: `No existen user` })

        res.status(200).send({ user: users })
    })
}

function getRandomUsers(req, res) {
    let userId = req.params.userId

   /* User.findRandom({}, {}, { limit: 15 }, function (err, users) {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
        if (!users) return res.status(404).send({ message: `No existen user` })
        if (!err) {
            res.status(200).send({ user: users })
        }
    });*/
    User.findRandom({"_id": { $ne: userId }}, {}, { limit: 15 }, function (err, users) {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
        if (!users) return res.status(404).send({ message: `No existen user` })
        if (!err) {
            res.status(200).send({ user: users })
        }
    });

}
function saveUser(req, res) {
    console.log("SaveUser: " )

    let user = User()
    user.email = req.body.email
    user.displayName = req.body.displayName
    user.password = req.body.password
    user.animal.description = req.body.description
    user.animal.animalName = req.body.animalName
    //user.animal.location = req.body.location.replace("\"", '')
    user.animal.location = 'Valencia'
    user.avatar = 'img/avatar1.jpg'
    user.currentPhoto = 'img/img0.jpg'
    user.activeRank = 0;
    user.activeUser = true;
    user.activeDuel = true;
    user.numberBans = 0;
    user.createAcount = Date.now();
    user.numVotes = 0;
    user.level = 0;
    user.articles.bones = 0;
    user.articles.soap = 0;
    user.articles.toy = 0;
    user.articles.present = 0;
    user.state.hungry = 10;
    user.state.cheerful = 10;
    user.state.hygiene = 10;
    user.topRank.toppointRank = 0;


    user.save((err, userStored) => {
        if (err) return res.status(500).send({ message: `Error al salvar la base de datos ${err} ` })

        res.status(200).send({ user: userStored })
    })

}

function updateUser(req, res) {
    /* console.log('POST /api/updateuser')
     console.log(req.body)*/
    let userId = req.params.userId
    let update = req.body

    User.findByIdAndUpdate(userId, update, (err, userUpdate) => {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
        if (!userUpdate) return res.status(404).send({ message: `El user no existe` })

        //res.status(200).send({ user: userUpdate })
    })
    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
        if (!user) return res.status(404).send({ message: `El user no existe` })
        //console.log("USER: " + user)

        res.status(200).send({ user })
    })

}

function deleteUser(req, res) {
    let userId = req.params.userId

    User.findById(userId, (err, user) => {
        if (err) res.status(500).send({ message: `Error al borrar el usuario ${err} ` })

        user.remove(err => {
            if (err) res.status(500).send({ message: `Error al borrar el usuario ${err} ` })

            res.status(200).send({ message: 'El usuario ha sido eliminado' })
        })
    })

}

function findByEmail(req, res) {
    /* console.log('POST /api/user')
     console.log(req.body)*/
    let email = req.params.email
    User.find().where("email", email).exec((err, user) => {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
        if (!user) return res.status(404).send({ message: `El user no existe` })

        res.status(200).send({ user: user })
    })
}
//HAMBRE
function addhungry(req, res) {
    let userId = req.params.userId
    //console.log("addhungry: " + userId)
    //let update = req.body

    User.update({ "_id": userId, "articles.bones": { $gt: 0 }, "state.hungry": { $lt: 10 } }, { $inc: { "state.hungry": 1, "articles.bones": -1, "level": 1 } },
        (err, userUpdate) => {
            if (err) return userUpdate.status(500).send({ message: `Error al realizar la peticion ${err}` })
            else {
                User.findById(userId, (err, user) => {
                    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
                    if (!user) return res.status(404).send({ message: `El user no existe` })
                    //console.log("USER: " + user)

                    res.status(200).send({ user })
                })
            }
        })
}
//ALEEGRIA
function addCheerful(req, res) {

    let userId = req.params.userId
    //console.log("addcheerful: " + userId)
    //let update = req.body
    User.update({ "_id": userId, "articles.toy": { $gt: 0 }, "state.cheerful": { $lt: 10 } }, { $inc: { "state.cheerful": 1, "articles.toy": -1, "level": 1 } }, (err, userUpdate) => {
        if (err) return userUpdate.status(500).send({ message: `Error al realizar la peticion ${err}` })
        else {
                User.findById(userId, (err, user) => {
                    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
                    if (!user) return res.status(404).send({ message: `El user no existe` })
                    //console.log("USER: " + user)

                    res.status(200).send({ user })
                })
            }
    })
}
//HIGUIENE
function addHygiene(req, res) {

    let userId = req.params.userId
    //console.log("addcheerful: " + userId)
    //let update = req.body

    User.update({ "_id": userId, "articles.soap": { $gt: 0 }, "state.hygiene": { $lt: 10 } }, { $inc: { "state.hygiene": 1, "articles.soap": -1, "level": 1 } }, (err, userUpdate) => {
        console.log("addcheerful: " + err)    
        if (err) return userUpdate.status(500).send({ message: `Error al realizar la peticion ${err}` })
        else {
                User.findById(userId, (err, user) => {
                    if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
                    if (!user) return res.status(404).send({ message: `El user no existe` })
                    //console.log("USER: " + user)

                    res.status(200).send({ user })
                })
            }
        
    })
}

//VOTES
function addVote(req, res) {

    let userId = req.params.userId
    //console.log("addcheerful: " + userId)
    //let update = req.body

    User.update({"_id": userId}, { $inc: {"numVotes": 1 } }, (err, userUpdate) => {
        console.log("addcheerful: " + err)    
        if (err) return userUpdate.status(500).send({ message: `Error al realizar la peticion ${err}` })
        
    })
}

/*function updateCurrentPhoto(req, res) {
    console.log("updateCurrentPhoto 3: ")
    let userId = req.params.userId
    let currentPhoto = req.body.currentPhoto

    Timeline.findByIdAndUpdate(userId, {currentPhoto: currentPhot}, (err, userUpdate) => {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
        //if (!user) return res.status(404).send({ message: `El user no existe`})

        res.status(200).send({ user: userUpdate })
    })

}*/

module.exports = {
    getUser,
    getPaginateUser,
    getUsers,
    saveUser,
    updateUser,
    deleteUser,
    findByEmail,
    getRandomUsers,
    addhungry,
    addCheerful,
    addHygiene,
    addVote
}