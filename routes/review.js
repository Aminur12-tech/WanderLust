const express = require('express');
const router = express.Router({ mergeParams: true }); // 💡 Ensure mergeParams is true
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// review post route
router.post('/', async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
        console.log("No listing found for id:", req.params.id);
        return res.status(404).send("Listing not found");
    }

    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    req.flash('success','New review added');
    res.redirect(`/listings/${listing._id}`);
});

// delete review post route
router.delete('/:reviewId', async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    console.log("Delete review");
    req.flash('success','Review deleted');
    res.redirect(`/listings/${id}`);
});

module.exports = router;
