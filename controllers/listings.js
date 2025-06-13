const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({ accessToken: mapToken });

// Index route callback
// module.exports.index = async (req, res) => { 
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// };


// Updated Index route callback
module.exports.index = async (req, res) => {
  const { category } = req.query; 
  let allListings;

  if (category) {

    allListings = await Listing.find({ category: category });
  } else {

    allListings = await Listing.find({});
  }

  res.render("listings/index.ejs", { allListings, selectedCategory: category });
};



// New route callback
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Show route callback
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
  // res.render("listings/show.ejs", { listing , mapToken: process.env.MAPBOX_TOKEN});
};

// Create route callback
module.exports.createListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }


  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();




  let url=req.file.path;
  let filename=req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  // newListing.category=req.body.listing.category;

  newListing.image={url,filename};
  newListing.geometry=response.body.features[0].geometry; 
   let savedListing=await newListing.save();
//  let savedListing= await newListing.save();
//  console.log(savedListing);

  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

// Edit route callback
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};

// Update route callback
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }

  // await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

if(typeof req.file!=="undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save(); 
}

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

// Delete route callback
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const deleted = await Listing.findByIdAndDelete(id);

  console.log(deleted);

  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
