const express=require("express")
router=express.Router({mergeParams:true});

//custom Error handling
const wrapAsync = require("../utils/wrapAsync.js")

//custom middleware
const {isLoggedIn,isReviewAuthor,validateReview}=require("../middleware.js")

//controller
const reviewController=require("../controllers/reviews.js")

//post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))
//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports=router;