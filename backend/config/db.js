const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`db connected ${connect.connection.host}`);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
