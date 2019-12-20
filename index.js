const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);
app.use(express.json());

const mongooseSetup = require("./mongooseSetup/mongooseSetup.js")();
const employeesRoutes = require("./routes/employeesRoutes");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", employeesRoutes);

app.listen(PORT, () => console.log("Job Dispatch API running on port 8080!"));
