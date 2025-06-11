const Listing = require("../models/listing");
const Review = require("../models/reviews");

// Create a new review
module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);

  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "Review added");
  res.redirect(`/listings/${listing._id}`);
};

// Delete a review
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  // Remove the review from the listing's reviews array
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted");
  res.redirect(`/listings/${id}`);
};
