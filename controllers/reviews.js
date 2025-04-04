//Review Model
const Review=require("../modules/review.js")
//Listing Model
const Listing = require("../modules/listing.js")

module.exports.createReview=( async(req,res)=>{
    let listing=await Listing.findById(req.params.id)
    let newReview=new Review(req.body.review)
    newReview.author=req.user._id;
    listing.reviews.push(newReview);//Important as this line make relation b/w review & list
    await newReview.save()
    await listing.save()
    req.flash("success","Review added!")
    res.redirect(`/listing/${listing._id}`)
});

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    req.flash("success","Review deleted!")
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`)
}

