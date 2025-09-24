const express = require('express');
const router = express.Router();
const Listing = require("../models/listing");
const {isloggedin} = require('../middleware.js');

//index Route
router.get('/', async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//New Route
router.get('/new', isloggedin, (req, res) => {
  res.render('listings/new.ejs');
});


//create route
router.post('/', async (req, res) => {
  console.log(req.body); // 👉 See what Express is parsing
  const title = req.body.title;
  const description = req.body.description;
  const image = {
    url: req.body['image[url]'],
    filename: req.body['image[filename]']
  };
  const price = req.body.price;
  const location = req.body.location;
  const country = req.body.country;

  const newListing = new Listing({
    title,
    description,
    image,
    price,
    location,
    country
  });

  await newListing.save();
  console.log(newListing);
  req.flash('success', 'Listing is created successfully!');
  res.redirect('/listings');
});




//Edit Route
router.get('/:id/edit',   isloggedin, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', { listing });
});

//update Route
router.put('/:id', isloggedin, async (req, res) => {
  console.log("PUT route hit!");
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
  console.log(req.method, req.url);
});

// POST route for /listings/:id
router.post('/:id', async (req, res) => {
  console.log("POST route for /listings/:id hit!");

  const { id } = req.params;
  const updatedData = req.body.listing; // Assuming your form data uses `listing` object

  // Example update
  const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });

  console.log("Updated Listing:", updatedListing);
  req.flash('success', 'Listing is updated successfully!');
  res.redirect(`/listings/${id}`);
});


//show Route
router.get('/:id', async (req, res) => {
  console.log(req.params)
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render('listings/show.ejs', { listing });
});

//delete Route
router.delete('/:id', isloggedin, async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash('success', 'Listing is deleted successfully!');
  res.redirect('/listings');
});

module.exports = router;