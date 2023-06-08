const express = require("express");
const app = express();
app.use(express.json());
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const UserRoutes = require("./routes/userRoutes");
const ChatRoutes = require("./routes/chatRoutes");
const MessageRoutes = require("./routes/messageRoute");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
//db connection
connectDB();

const PORT = process.env.PORT;
//
app.get("/", (req, res) => {
  res.send("running");
});

//routes config
app.use("/api/user", UserRoutes);
app.use("/api/chat", ChatRoutes);
app.use("/api/message", MessageRoutes);
//error handling
//not found
app.use(notFound);
app.use(errorHandler);
//normal error handler
//server connection
app.listen(PORT, () => {
  console.log(`server started om http://localhost:${PORT}`);
});
