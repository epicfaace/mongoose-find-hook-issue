const mongoose = require("mongoose");
const MongodbMemoryServer = require('mongodb-memory-server');

const mongoServer = new MongodbMemoryServer.MongoMemoryServer({
  binary: { version: "latest" },
  instance: { port: 65210, dbName: "test" }
});

let schema = new mongoose.Schema({
    "name": String
  });

schema.pre('find', () => {
    console.log("Pre find hook called");
});

let model = mongoose.model("model", schema);

mongoServer.getConnectionString().then(async (uri) => {
    process.env.MONGODB_URI = uri;
    try {
    await mongoose.connect(uri);
    await model.find({}); // Calls find hook
    await model.find({}).count(); // Does not call find hook!

    await mongoose.disconnect();
    await mongoServer.stop();
    }
    catch(e) {
        console.error("Error: " + e);
    }
  });

// mongoose.connect("mongodb://localhost:127017/test")

