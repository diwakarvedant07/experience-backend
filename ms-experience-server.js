const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

mongoose.connect(process.env.MS_EXPERIENCE_MONGO_URI, {
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("experience-database : connected"));

app.use(express.json());
app.use(cors());

const RegisterRouter = require("./app/routes/register-route.js");
app.use("/register", RegisterRouter);
const loginRouter = require("./app/routes/login-route.js");
app.use("/login", loginRouter);
const productRouter = require("./app/routes/product-route.js");
app.use("/product", productRouter);
const moduleRouter = require("./app/routes/module-route.js");
app.use("/module", moduleRouter);
const uploadRouter = require("./app/routes/upload-route.js");
app.use("/upload", uploadRouter);
const tokenRouter = require("./app/routes/verify-token-route.js");
app.use("/verifyToken", tokenRouter);
const feedbackRouter = require("./app/routes/feedback-route.js");
app.use("/feedback", feedbackRouter);
const tierRouter = require("./app/routes/tier-route.js");
app.use("/tier", tierRouter);

app.listen(5605, () => console.log("experience-server : started"));