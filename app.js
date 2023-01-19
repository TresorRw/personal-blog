const express = require("express");
const mongoose = require("mongoose");
const cp = require("cookie-parser");
const appRoutes = require("./routes/appRoutes");
const { authUser } = require("./middleware/userStatus");
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const dotenv = require('dotenv').config();
/*
Servers
https://tresor-blog.up.railway.app/ 
http://localhost:5000
*/
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MY Personal Blog",
      version: "2.0.0",
      description: "This is my simple personal blog that allows me to post articles to share them with community to understand their opinion."
    }, 
    servers: [
      {
        url: process.env.DOC_SERVER
      }
    ]
  },
  apis: ["./routes/*.js"]
}
const specs = swaggerJsDoc(options)

const app = express();
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs))

// Configuring middlewares
app.use(express.json());
app.use(express.static("public"));
app.use(cp());

// Template engine
app.set("view engine", "ejs");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(process.env.PORT || 5000))
  .catch((err) => "Invalid connection string");

// Routes
app.get("/", (req, res) => res.render("index"));
app.get("/dashboard", authUser, (req, res) => res.render("dashboard"));
app.get("/allArticles", authUser, (req, res) => res.render("allArticles"));
app.get("/blog", (req, res) => res.render("blog"));
app.get("/logout", (req, res) => {
  res.cookie("pbtkn", "", { maxAge: 0 });
  res.redirect("/");
});
app.use(appRoutes);

module.exports = { app };
