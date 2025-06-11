// const express=require("express");
// const router=express.Router();
// const wrapAsync=require("../utils/wrapAsync.js");
// const ExpressError=require("../utils/ExpressError.js");
// const Listing=require("../models/listing.js");
// const {isLoggedIn}=require("../middleware.js");
// const {isOwner}=require("../middleware.js");



// //index route
// router.get("/", wrapAsync(async (req,res)=>{
//   const allListings =await Listing.find({});
//   res.render("listings/index.ejs",{allListings});
// }) );

// // new route
// router.get("/new",isLoggedIn,(req,res)=>{
//   res.render("listings/new.ejs");
// });

// //we will keep the new route above show route because otherwise new would be considered an id

// //show route
// router.get("/:id",wrapAsync(async (req,res)=>{
//   let {id}=req.params;
//   const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner"); 
//   if(!listing){
//       req.flash("error","Listing you requested for does not exist");
//       res.redirect("/listings");
//   }
//   res.render("listings/show.ejs",{listing}); 

// }));
// // Create Route
// router.post("/", isLoggedIn,  wrapAsync(async (req, res) => {
//   // let {title, description, image, price, country, location} = req.body;
//   if(!req.body.listing){   //to handle if there's no listing in the req body 
//     throw new ExpressError(400,"Send valid data for listing");
//   }
//   const newListing = new Listing(req.body.listing);

//   newListing.owner=req.user._id;
//   await newListing.save();  
//   req.flash("success","New Listing Created");
//   res.redirect("/listings");

// }));

// // edit route
// router.get("/:id/edit",isLoggedIn,isOwner, async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
//     if(!listing){
//       req.flash("error","Listing you requested for does not exist");
//       res.redirect("/listings");
//   }
//   res.render("listings/edit.ejs", { listing });
// });
 
// //update route
// router.put("/:id",isLoggedIn,isOwner, async (req, res) => {
//   let { id } = req.params;
//   if(!req.body.listing){   //to handle if there's no listing in the req body 
//     throw new ExpressError(400,"Send valid data for listing");
//   }
  
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });  //req.body.listing is an object that has all the parameters which we are deconstructing to get separate parameters
//     req.flash("success","Listing Updated");
//   res.redirect(`/listings/${id}`);  //to redirect it to show route
// });

// //delete route
// router.delete("/:id",isLoggedIn,isOwner,async (req,res)=>{
//   let {id} =req.params;
//   const deleted=await Listing.findByIdAndDelete(id);
//   console.log(deleted);
//     req.flash("success","Listing deleted");
//   res.redirect("/listings");
// })


// module.exports=router;


const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listings = require("../controllers/listings.js");
const multer = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage })   //to initialize multer

// Index
router.get("/", wrapAsync(listings.index));

// New
router.get("/new", isLoggedIn, listings.renderNewForm);
 
// Create
router.post("/", isLoggedIn, upload.single('listing[image]'), wrapAsync(listings.createListing));

// router.post("/",upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// })

// Show
router.get("/:id", wrapAsync(listings.showListing));

// Edit
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listings.renderEditForm));

// Update
router.put("/:id", isLoggedIn, upload.single('listing[image]'),isOwner, wrapAsync(listings.updateListing));

// Delete
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listings.deleteListing));

module.exports = router;
