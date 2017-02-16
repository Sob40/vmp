'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
//const bcrypt = require('bcrypt-nodejs')
//const crypto = require('crypto')

const UserSchema = new Schema({
    emailUser: String,
    createTimeline: Date,
    animalName: String,
    location: String,
    animalPhoto: String,
    descriptiontTimeline: String,
    likes: Number,
    bones: Number,
    soap: Number,
    toy: Number,
    present: Number,
    duelPhoto: Boolean,
    activePhoto: Boolean,
    photoban: Number
    //photoSelected: Boolean
})

module.exports = mongoose.model('Timeline', UserSchema)
