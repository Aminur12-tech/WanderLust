const express = require('express');
const router = express.Router({ mergeParams: true }); // 💡 Ensure mergeParams is true
const { isloggedin, isReviewAuthor } = require("../middleware.js");

const reviewController = require('../controllers/review.js');

// review post route
router.post('/', isloggedin, reviewController.createReview);

// delete review post route
router.delete('/:reviewId', isloggedin, isReviewAuthor, reviewController.deleteReview);

module.exports = router;