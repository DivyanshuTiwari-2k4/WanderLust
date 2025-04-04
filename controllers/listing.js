const Listing = require("../modules/listing.js");
const { Client } = require("@googlemaps/google-maps-services-js");
const googleMapsClient = new Client({});

// All Listings
module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/allListing.ejs", { allListing });
};

// Render New Form
module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
};

// Show Specific Listing
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    
    if (!listing) {
        req.flash("error", "Listing you requested doesn't exist!");
        return res.redirect("/listing");
    }
    
    res.render("listing/show.ejs", { listing });
};

// Search Listings
module.exports.searchListings = async (req, res) => {
    try {
        let searchQuery = req.query.query;

        // Use regex to perform case-insensitive title search
        let listings = await Listing.find({ title: new RegExp(searchQuery, "i") });

        if (listings.length === 0) {
            req.flash("error", "No listings found with that title.");
            return res.redirect("/listing");
        }

        res.render("listing/allListing", { allListing: listings });
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong. Try again!");
        res.redirect("/listing");
    }
};


// Create Listing (Without Saving GeoJSON)
module.exports.createListing = async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    
    if (req.file) {
        newListing.image = { url: req.file.path, filename: req.file.filename };
    }

    if (req.body.listing.location) {
        try {
            const geocodeResponse = await googleMapsClient.geocode({
                params: { address: req.body.listing.location, key: process.env.GOOGLE_MAPS_API_KEY },
            });
            if (geocodeResponse.data.results.length > 0) {
                const coordinates = geocodeResponse.data.results[0].geometry.location;
                newListing.geoCoordinates = { type: "Point", coordinates: [coordinates.lng, coordinates.lat] };
            }
        } catch (error) {
            req.flash("error", "Unable to locate the destination!");
            console.error("Geocoding error:", error);
        }
    }

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listing");
};

// Edit Listing Form
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash("error", "Listing you requested doesn't exist!");
        return res.redirect("/listing");
    }

    let originalImageUrl = listing.image.url.replace("/upload", "/upload/c_fill,h_300,w_250");
    res.render("listing/edit.ejs", { listing, originalImageUrl });
};

// Update Listing
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
        await listing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listing/${id}`);
};

// Delete Listing (Without Removing GeoJSON Files)
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    
    req.flash("success", "Listing deleted!");
    res.redirect("/listing");
};
