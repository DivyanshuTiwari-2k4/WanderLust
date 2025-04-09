if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const mongoose = require("mongoose");
const { data: sampleListings } = require("./data.js");
const Listing = require("../modules/listing.js");
const User = require("../modules/user.js");

const dbUrl=process.env.ATLASDB_URL;

main()
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

async function main() {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const initDB = async () => {
  try {
    // Clear previous listings (keep reviews/users if needed)
    await Listing.deleteMany({});

    // Check if dummy user exists, otherwise create it
    let dummyUser = await User.findOne({ email: "dummy@gmail.com" });

    if (!dummyUser) {
      dummyUser = new User({
        username: "Divyanshu Tiwari",
        email: "dummy@gmail.com",
      });
      await dummyUser.save();
    }

    // Add listings with dummy user as owner
    const listingsWithOwner = sampleListings.map((listing) => ({
      ...listing,
      owner: dummyUser._id,
    }));

    await Listing.insertMany(listingsWithOwner);

    console.log("✔️ Listings initialized with dummy owner (Divyanshu Tiwari).");
  } catch (error) {
    console.error("❌ Error during DB initialization:", error);
  } finally {
    mongoose.connection.close();
  }
};

initDB();
