const Listing = require("../models/listing");


module.exports.root = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("index.ejs", { allListings });
};