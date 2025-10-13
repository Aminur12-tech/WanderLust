const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};


module.exports.category = async (req, res) => {
  try {
    const category = req.params.category;
    console.log("Requested category:", category);

    const validCategories = [
      'Trending',
      'Rooms',
      'Iconic Cities',
      'Mountain',
      'Castles',
      'Amazing Pools',
      'Camping',
      'Farms',
      'Arctic'
    ];

    const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);

    if (!validCategories.includes(normalizedCategory)) {
      req.flash("error", "Invalid category selected.");
      return res.redirect("/");
    }

    const categoryListings = await Listing.find({ category: normalizedCategory });
    res.render("listings/category.ejs", { categoryListings, category: normalizedCategory });
  } catch (err) {
    console.error("Error fetching category listings:", err);
    req.flash("error", "Could not find listings for the specified category.");
    res.redirect("/");
  }
};

module.exports.search = async (req, res) => {
  const { country } = req.query;
  console.log("Search country: ", country);

  if (!country || country.trim() === "") {
    req.flash("error", "Please enter a valid location to search.");
    res.redirect('/');
    return;
  }
  try {
    const searchListings = await Listing.find({ country: country.trim() });
    if (searchListings.length === 0) {
      req.flash("error", "No listings found for the specified location.");
      return res.redirect('/');
    }
    res.render('listings/search.ejs', { searchListings, country: country.trim() });
  } catch (err) {
    console.error("Search error: ", err);
    req.flash("error", "An error occured while searching. Please try again.");
    res.redirect('/');
  }
};

module.exports.newform = async (req, res) => {
  res.render('/new.ejs');
};

module.exports.create = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const title = req.body.title;
  const description = req.body.description;
  const image = {
    url: req.file.path,
    filename: req.file.filename,
  };
  const price = req.body.price;
  const location = req.body.location;
  const country = req.body.country;
  let category = req.body.category || [];
  if (!Array.isArray(category)) {
    category = [category]; // convert single selection to array
  }

  const newListing = new Listing({
    title,
    description,
    image,
    price,
    location,
    country,
    category,
  });
  newListing.owner = req.user._id;
  console.log(req.user);
  await newListing.save();
  console.log(newListing);
  req.flash('success', 'Listing is created successfully!');
  res.redirect('/');
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  let originalImage = listing.image.url;
  originalImage.replace("/upload", "/upload/h_300,w_250");
  res.render('/edit.ejs', { listing, originalImage });
};

module.exports.update = async (req, res) => {
  console.log("PUT route hit!");
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
  console.log(listing);
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }
  res.redirect(`/${id}`);
  console.log(req.method, req.url);
};

module.exports.showUpdate = async (req, res) => {
  try {
    console.log("POST route for /listings/:id hit!");
    console.log("Raw req.body:", req.body);
    console.log("Uploaded file:", req.file);

    const { id } = req.params;
    const updatedData = req.body.listing || {};

    if (req.file) {
      updatedData.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    console.log("Final update payload:", updatedData);

    const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });

    console.log("Updated Listing:", updatedListing);
    req.flash('success', 'Listing is updated successfully!');
    res.redirect(`/${id}`);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).send("Something went wrong during update.");
  }
};

module.exports.show = async (req, res) => {
  console.log(req.params)
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/");
  }
  console.log(listing);
  res.render('/show.ejs', { listing });
};


module.exports.delete = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash('success', 'Listing is deleted successfully!');
  res.redirect('/');
};


