'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
//const bcrypt = require('bcrypt-nodejs')
//const crypto = require('crypto')
const random = require('mongoose-simple-random');



const UserSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,
    displayName: String,
    location:String,
    avatar: String,
    currentPhoto: String,
    //activeRank: { type: Boolean, select: false },
    activeRank: Boolean,
    createAcount: Date,
    activeUser: Boolean,
    activeDuel: Boolean,
    userBan: Number,
    numVotes: Number,
    level: Number,
    animal:{
        animalName: String,
        description: String,
        location: String      
    },
    articles:{
        bones: Number,
        soap: Number,
        toy: Number,
        present: Number
    },
    state:{
        hungry: Number,
        cheerful: Number,
        hygiene: Number
    },
    topRank:{
        toppointRank: Number,
    },
    weeklyRank:{
        weeklydateRank: Date,
        weeklyintRank: Number
    }

})
UserSchema.plugin(random);

module.exports = mongoose.model('User', UserSchema)
//Este codigo se ejecuta antes de hacer el insert
/*UserSchema.pre('save', (next)=>{
    let user = this
    if (!user.isModified('password')) return next()

    bcrypt.genSalt(10,(err,salt) =>{
        if (err) return next(err)

        bcrypt.hash(user.password, salt, null, (err, hash) =>{
            if (err) return next(err)

            user.password = hash
            next()
        })
    })*/

//Para añadir avatars
/*UserSchema.methods.gravatar = function () {
    if (!this.email) return `https://gravatar.com/avatar/?s200&d=retro`

    const md5 =  crypto.createHash('md5').update(this.email).digest('hex')
    return `https:/gravatar.com/avatar/${md5}?s=200&d=retro`
} */   


//})