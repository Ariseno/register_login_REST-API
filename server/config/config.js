const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_LOCAL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database is Connected.");
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnection;
