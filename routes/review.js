// const express=require("express");
// const router=express.Router({mergeParams:true});  //mergeParams is used to merge the rest of the address(child address) with the parent address that was in app.js in order to get access to the id that was in parent address other wise that id would be left in the app.js itself
// const wrapAsync=require("../utils/wrapAsync.js");
// const ExpressError=require("../utils/ExpressError.js");
// const Review=require("../models/reviews.js");
// const Listing=require("../models/listing.js");
// const { isLoggedIn, isReviewAuthor } = require("../middleware.js");


// //creating reviews- POST route
// //we will not create index and show route for this because we will not be accessing reviews individually and only access them along with listing so no need
// router.post("/",isLoggedIn, async(req,res)=>{
//   let listing=await Listing.findById(req.params.id);
//   let newReview=new Review(req.body.review);
//   newReview.author=req.user._id;
//   listing.reviews.push(newReview);
//   await newReview.save();
//   await listing.save();
//   req.flash("success","Review added");
//  res.redirect(`/listings/${listing._id}`);
// })
 

// //delete route- deleting  reveiws
// router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
//   let {id, reviewId}=req.params;

// // $pull- The $pull operator removes from an existing array all instances of a value or values that match a specified condition. to delete the id of review we are deleting from the listings as well
// await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//   await Review.findByIdAndDelete(reviewId);
//     req.flash("success","Review deleted");
//   res.redirect(`/listings/${id}`); 
// }))


// module.exports=router;


const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviews = require("../controllers/reviews.js");

// POST - Create review
router.post("/", isLoggedIn, wrapAsync(reviews.createReview));

// DELETE - Delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview));

module.exports = router;
