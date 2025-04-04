const express=require("express")
router=express.Router()

//custom Error handling
const wrapAsync = require("../utils/wrapAsync.js")

//custom middleware
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")

//controller
const listingController=require("../controllers/listing.js")

//multer and cloudinary
const multer=require("multer")
const {storage}=require("../cloudConfig.js")
const upload=multer({storage})

// for "/" path
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing))

// Search Route
router.get("/search",wrapAsync( listingController.searchListings));

//for "/new" path
router.get("/new", isLoggedIn,listingController.renderNewForm)

//for "/:id" path
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing))


// edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm))


module.exports=router;