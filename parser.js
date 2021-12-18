function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

export function parseMessage(msg) {
  let amount = isMexicanPeso(msg)
    ? Number(msg.match(/[0-9\.]+/g)) / 20.78
    : Number(msg.match(/[0-9\.]+/g));

  let txt = msg
    .replace(/[0-9\.]+/g, "")
    .trim()
    .toLowerCase();
  let items = isMexicanPeso(msg) ? removePesosFromTxt(txt) : txt;

  let peso = isMexicanPeso(msg) ? Number(msg.match(/[0-9\.]+/g)) : 0;

  return {
    price: amount,
    description: capitalize(items),
    otherCurrency: peso,
  };
}

parseMessage("shrimps 120 pesos");

export function isValidMessage(msg) {
  let amount = Number(msg.match(/[0-9\.]+/g));
  let items = msg.replace(/[0-9\.]+/g, "").trim();
  return amount != 0 && items != "";
}

export function isMexicanPeso(msg) {
  return (
    msg.toLowerCase().includes("peso") || msg.toLowerCase().includes("pesos")
  );
}

function removePesosFromTxt(txt) {
  if (txt.includes("pesos")) {
    return txt.replace("pesos", "");
  }
  return txt.replace("peso", "").trim();
}
