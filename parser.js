function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

export function parseMessage(msg) {
  let amount = Number(msg.match(/[0-9\.]+/g));
  let items = msg.replace(/[0-9\.]+/g, "").trim();

  return { price: amount, description: capitalize(items) };
}

export function isValidMessage(msg) {
  let amount = Number(msg.match(/[0-9\.]+/g));
  let items = msg.replace(/[0-9\.]+/g, "").trim();
  return amount != 0 && items != "";
}
