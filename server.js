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
  const entry = parseMessage("sjfdh");
  // const message =
  // "Price: " + entry.price + "\nDescription: " + entry.description;
  const message = req.body.Body;
  // console.log(req);
  twiml.message(message);

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log("Express server listening on port 1337");
});
