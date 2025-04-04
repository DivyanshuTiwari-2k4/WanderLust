const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review")

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename:String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
    // 'geoCoordinates' to store coordinates in GeoJSON format
    geoCoordinates: {
      type: {
        type: String, // This will be "Point"
        enum: ["Point"], // Only "Point" is allowed
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  }, {
    // Enabling geo indexing on the geoCoordinates field for faster querying
    index: { geoCoordinates: "2dsphere" },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } })
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;