// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = "ACca4eee14f2ad94003bb4394197145179";
const authToken = "4a44b3093bc4cddf14a2a7e0d74947a3";
const client = require("twilio")(accountSid, authToken);

client.messages
  .create({
    body: "This is the ship that made the Kessel Run in fourteen parsecs?",
    from: "+17409821524",
    to: "+16503138895",
  })
  .then((message) => console.log(message.sid));
