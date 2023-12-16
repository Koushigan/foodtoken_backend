const { MongoClient } = require("mongodb");
const log = require("./log");
require("dotenv").config();

let MONGO_URL = "mongodb+srv://koushik:${process.env.MONGO_PASSWORD}@cluster0.r729svo.mongodb.net/?retryWrites=true&w=majority";
let MONGO_NAME = "food";

const mongo = {
    db: null,
    biriyani: null,
    users: null,
    rice: null,
    drinks: null,
    noodles: null,
    pasta: null,
    dessert: null,

    async connect() {
        try {
            // Connecting to Mongo(server)
            const client = new MongoClient(MONGO_URL);
            // using await in order to wait until it gets a response
            await client.connect();
            log("Mongo Connected Successfully");

            log(process.env.MONGO_URL);

            // Selecting the DB
            this.db = await client.db(MONGO_NAME);
            log(`Mongo database selected - ${MONGO_NAME}`);

            this.biriyani = await this.db.collection("biriyani");
            this.rice = await this.db.collection("rice");
            this.dessert = await this.db.collection("dessert");
            this.drinks = await this.db.collection("drinks");
            this.noodles = await this.db.collection("noodles");
            this.pasta = await this.db.collection("pasta");

            this.users = await this.db.collection("users");

            log("Mongo collections Initialized");
            // Close the connection when done
            await client.close();
        } catch (err) {
            console.log("Error creating server", err.message);
        }
    },
};

module.exports = mongo;
