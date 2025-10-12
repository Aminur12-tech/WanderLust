require('dotenv').config(); 
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const DB_URL = process.env.ATLASDB_URL;

if (!DB_URL) {
    console.error("Error: ATLASDB_URL environment variable not set");
    process.exit(1);
}

async function main() {
    try {
        await mongoose.connect(DB_URL);
        console.log('Connected to MongoDB');

        await initDB();

        console.log("Data was initialized successfully");

        process.exit(0); // Exit after init
    } catch (err) {
        console.error("Error during MongoDB connection or data initialization:", err);
        process.exit(1);
    }
}

const initDB = async () => {
    await Listing.deleteMany({});
    const dataWithOwner = initData.data.map((obj) => ({
        ...obj,
        owner: "68d7e3c0fa3f14e202684e43",
    }));
    await Listing.insertMany(dataWithOwner);
};

main();
