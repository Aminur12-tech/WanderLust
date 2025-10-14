const express = require('express');
const router = express.Router();
const { isloggedin, isOwner } = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

const listingController = require('../controllers/listing.js');

router.route('/')
    .get(listingController.root)
    .get(listingController.index)
    .post(isloggedin, upload.single('listing[image]'), listingController.create);

router.get('/category/:category', listingController.category);  

router.get('/search', listingController.search);

router.get('/new', isloggedin, listingController.newform);

router.route('/:id')
    .put(isloggedin, isOwner, upload.single('listing[image]'), listingController.update)
    .post(isloggedin, upload.single('listing[image]'), listingController.showUpdate)
    .get(listingController.show)
    .delete(isloggedin, listingController.delete);

router.get('/:id/edit', isloggedin, listingController.edit);


module.exports = router;