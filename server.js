import { parseMessage, isValidMessage, isMexicanPeso } from "./parser.js";
import http from "http";
import express from "express";
import twilio from "twilio";
import bodyParser from "body-parser";
import {
  createExpense,
  getTotalWeekExpense,
  getTotalDayExpense,
  getTotalMonthExpense,
} from "./database.js";

// const matchingEmoji = {
//   Lodging: "🏡",
//   Transportation: "🎢",
//   Other: "🎠",
//   Shopping: "🧺",
// };

// TODO: express api, node.js -- common stack to create an api in js
// together they form a stack

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/sms", async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  // const text = req.textMessage

  // get the message user sent
  const message = req.body.Body.trim().toLowerCase();

  if (message === "total day" || message === "day total" || message === "td") {
    const sumToday = await getTotalDayExpense();
    twiml.message("💰Your total spending today: $" + sumToday);
  } else if (
    message === "total week" ||
    message === "week total" ||
    message === "tw"
  ) {
    const sumWeek = await getTotalWeekExpense();
    twiml.message("💰Your total spending this week: $" + sumWeek);
  } else if (
    message === "total month" ||
    message === "month total" ||
    message === "mt" ||
    message === "tm"
  ) {
    const sumMonth = await getTotalMonthExpense();
    twiml.message("💰Your total spending this month: $" + sumMonth);
  } else {
    logInExpense(twiml, message);
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

const port = process.env.PORT || 3000;
http.createServer(app).listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

const logInExpense = (twiml, message) => {
  if (isValidMessage(message)) {
    const expense = parseMessage(message);

    createExpense(expense);
    // send back message listing logged-in items to the user
    twiml.message(
      `🌈Yay! New expense logged in!🌈
      Price: ${
        isMexicanPeso(message)
          ? expense.otherCurrency.toFixed(2) +
            " pesos🇲🇽" +
            " ($" +
            expense.price.toFixed(2) +
            ")"
          : "$" + expense.price
      }
      Description: ${expense.description}
      Category: ${expense.tag}
      `
    );

    // console.log(expense);
  } else {
    twiml.message("Please enter a valid expense🤪");
  }
};
