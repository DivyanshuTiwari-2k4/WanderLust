const mongoose=require("mongoose")
const initData=require("./data")
const Listing=require("../modules/listing")

const MONGO_URL="mongodb://127.0.0.1:27017/wandervision"
async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
.then(()=>{
    console.log("Connected to database")
})
.catch(err => console.log(err));

const initDB= async ()=>{
    await Listing.deleteMany({})
    initData.data=initData.data.map((obj)=>({...obj,owner:"67e3d145c1378fc337c2cbf0"}))
    await Listing.insertMany(initData.data)
    console.log("data is initalised")
}
initDB()