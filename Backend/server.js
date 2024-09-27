const express = require("express");

const dotenv = require("dotenv").config({
  path: "./configs/environments.env",
});

const app = express();

const ServerErrorResponse = require("./utils/classes/ServerErrorResponse");
const { connectDB } = require("./configs/DBConnection");

const mongoose = require("mongoose");
const morgan = require("morgan");

const cors = require("cors");

app.use(cors(
  {origin: 'https://techit-eight.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // specify the methods allowed
    credentials: true // if you are using credentials such as cookies
  }
));

app.options('*', cors());
app.use(express.json({ limit: "50mb" }));

app.use(
  express.urlencoded({ extended: false, limit: "50mb", parameterLimit: 50000 })
);

app.use(morgan("dev"));

const allRoutes = require("./routes/AllRoutes");

app.use("/api", allRoutes);

const PORT = process.env.PORT || 8080;

app.all("*", (req, res, next) =>
  next(
    res.status(404).json(
      ServerErrorResponse.customError(
        "Failed",
        404,
        `can't find ${req.originalUrl} on this server`,
        {
          metadata: {
            method: req.method,
          },
        }
      )
    )
  )
);

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error While Starting Tech It Server: ", err);
  } else {
    console.log(
      `Tech It Server Is Listening on PORT: ${PORT} - Server ID: ${process.pid}`
    );
    connectDB();
  }
});
