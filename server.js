import { parseMessage } from "./parser.js";
import http from "http";
import express from "express";
import twilio from "twilio";
import bodyParser from "body-parser";

// const http = require("http");
// const express = require("express");
// const MessagingResponse = require("twilio").twiml.MessagingResponse;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/sms", (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  // const text = req.textMessage

  // get the message user sent
  const message = req.body.Body;

  const entry = parseMessage(message);

  // send back message to the user
  twiml.message(
    "****💰Expense logged in💰**** " +
      "\nPrice: $" +
      entry.price +
      "\nDescription: " +
      entry.description
  );

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log("Express server listening on port 1337");
});
