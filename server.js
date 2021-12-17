import { parseMessage, isValidMessage } from "./parser.js";
import http from "http";
import express from "express";
import twilio from "twilio";
import bodyParser from "body-parser";
import {
  createExpense,
  getTotalExpense,
  getTotalDayExpense,
} from "./database.js";

// const http = require("http");
// const express = require("express");
// const MessagingResponse = require("twilio").twiml.MessagingResponse;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/sms", async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  // const text = req.textMessage

  // get the message user sent
  const message = req.body.Body.trim().toLowerCase();

  if (
    message === "total today" ||
    message === "today total" ||
    message == "tt"
  ) {
    // twiml.message("🧐Calculating🧮 total spending...");
    const sum = await getTotalDayExpense();
    twiml.message("💰Your total spending today: $" + sum);
    // console.log(sum);
  }

  // if (message === "total" || message == "t") {
  //   // twiml.message("🧐Calculating🧮 total spending...");
  //   const sum = await getTotalExpense();
  //   twiml.message("💰Your total spending: $" + sum);
  //   // console.log(sum);
  // }

  if (
    message != "total" &&
    message != "total today" &&
    message != "today total"
  ) {
    logInExpense(twiml, message);
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log("Express server listening on port 1337");
});

const logInExpense = (twiml, message) => {
  if (isValidMessage(message)) {
    const expense = parseMessage(message);
    // send back message listing logged-in items to the user
    twiml.message(
      "****🌈Yay! New expense logged in!🌈**** " +
        "\nPrice: $" +
        expense.price +
        "\nDescription: " +
        expense.description
    );
    createExpense(expense);
  } else {
    twiml.message("Please enter a valid expense🤪");
  }
};
