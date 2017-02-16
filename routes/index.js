'use strict'

const express = require('express')
const auth = require('../middlewares/auth')
const timelineCtrl = require('../controllers/timeline')
const userCtrl = require('../controllers/user')
const topRankCtrl = require('../controllers/toprank')
const galleryCtrl = require('../controllers/gallery')
const uploadPhotoCtrl = require('../controllers/uploadphoto')
const duelCtrl = require('../controllers/duel')
const api = express.Router()

//TIMELINE
api.get('/timeline', timelineCtrl.getTimeline)
api.get('/getalltimeline/', timelineCtrl.getPaginateTimeline)
api.post('/addtimeline', timelineCtrl.addTimeLine)
api.delete('/timeline/:userId', timelineCtrl.deleteTimeline)
api.put('/setlike/:userId', timelineCtrl.addLikeUser)
api.put('/settoy/', timelineCtrl.addtoy)
api.put('/setpresent/', timelineCtrl.addPresent)
api.put('/setbones/', timelineCtrl.addBones)
api.put('/setsoap/', timelineCtrl.addSoap)
api.put('/setphotoban/', timelineCtrl.addPhotoBan)


//PROFILE
api.get('/user', userCtrl.getUsers)
api.get('/user/:num_page', userCtrl.getPaginateUser)
api.get('/getuser/:userId', userCtrl.getUser)
api.post('/newuser', userCtrl.saveUser)
api.put('/updateuser/:userId', userCtrl.updateUser)
api.delete('/user/:userId', userCtrl.deleteUser)
api.get('/userprofile/:email', userCtrl.findByEmail)
api.put('/sethungry/:userId', userCtrl.addhungry)
api.put('/setcheerful/:userId', userCtrl.addCheerful)
api.put('/sethygiene/:userId', userCtrl.addHygiene)
api.put('/addvote/:userId', userCtrl.addVote)

//TOPRANK
api.put('/toprank/:userId', topRankCtrl.increaseTopRank)
api.get('/toprank', topRankCtrl.getTopRank)

//GALERY
api.get('/galery', galleryCtrl.getGallery)
api.get('/galery/:userId', galleryCtrl.getGalleryByUser)
api.delete('/galery/:userId', galleryCtrl.deleteGallery)
api.get('/galerybyemail/:email', galleryCtrl.findByEmail)
api.put('/updatecurrentphoto/:userId', userCtrl.updateUser)
api.get('/getallgallery/', galleryCtrl.getPaginateGallery)
/*api.post('/addtimeline', galeryCtrl.addTimeLine)
api.put('/setphotoduel/:userId', galeryCtrl.addLikeUser)*/

//DULO
api.get('/getrandomuser/:userId', userCtrl.getRandomUsers)
api.put('/setVote/', duelCtrl.addVote)

//UPLOADPHOTO
api.post('/addphoto', uploadPhotoCtrl.uploadPhoto)

/*api.get('/private', auth.isAuth, function(req, res){
    res.status(200).send({message: 'Tienes acceso'})
})*/


module.exports = api