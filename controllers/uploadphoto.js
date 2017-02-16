'use strict'

const Timeline = require('../models/timeline')
const User = require('../models/user')

function uploadPhoto(req, res) {
    
    console.log("uploadPhoto: " + req.files)
    //res.send(console.dir(req.files));

}

module.exports = {
    uploadPhoto
}