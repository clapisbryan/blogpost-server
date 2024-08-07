const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

// Import routes//Routes Middleware
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");

const app = express();

require("dotenv").config();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once("open", () =>
    console.log("Now connected to MongoDB Atlas")
);

app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);

app.listen(process.env.PORT || port, () => {
    console.log(`API is now online on port ${process.env.PORT || port}`)
});
