'use strict'

const User = require('../models/user')

function getTopRank(req, res) {

    console.log("ENTRA 1")
    /*User.find({}, (err, users) => {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
        if (!users) return res.status(404).send({ message: `No existen user` })

        res.status(200).send({ user: users })
    })*/
    User.find({activeRank: true}).sort({'toppointRank': -1}).limit(3).exec(function(err, posts) {
     // `posts` will be of length 20
     //console.log("MAXX"  + { user: posts })
     res.status(200).send({ user: posts })
});

}

function increaseTopRank(req, res) {
    let userId = req.params.userId
    //let update = req.body

    User.findByIdAndUpdate(userId, { $inc: {"topRank.toppointRank" : 1} }, (err, userUpdate) => {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion ${err}` })
        //if (!user) return res.status(404).send({ message: `El user no existe`})

        res.status(200).send({ user: userUpdate })
    })

}


module.exports = {
    increaseTopRank,
    getTopRank
}