const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();


// const client = new MongoClient(process.env.MONGO_URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
const connectDB = async () => {
  try {
  mongoose.connect(process.env.MONGO_URI, {
   
  });
    console.log("MongoDB connected");
  //  await client.db("test-y").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
