'use strict'

const User = require('../models/user')

function addVote(req, res) {
    let update = req.body
    let email = String(update.email);
    User.update({ "email": email }, { $inc: { "numVotes": 1 } }, (err, userUpdate) => {
        if (err){
            console.log("Entraaa ")
            return res.status(500).send({ message: `[addtoy] Error al realizar la peticion addtoy: ${err}` })
        }else if (!userUpdate) {
            return res.status(404).send({ message: `El user no existe` }) 
        }    
    })
}

module.exports = {
    addVote

}