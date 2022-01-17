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

  let items = containsRedundantWords(txt) ? removeRedundantWords(txt) : txt;

  let peso = isMexicanPeso(msg) ? Number(msg.match(/[0-9\.]+/g)) : null;

  let category = getCategoryFromMap(txt);

  return {
    price: amount,
    description: capitalize(items),
    otherCurrency: peso,
    tag: category,
  };
}

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

const redundantInputWords = [
  "pesos",
  "peso",
  "lodging",
  "transportation",
  "other",
  "shopping",
  "food",
  "reimbursesb",
  "reimbursewx",
];

function getRedundantWords(txt) {
  let redundantWords = [];
  const txtList = txt.split(" ");

  for (const word of txtList) {
    if (redundantInputWords.includes(word)) {
      redundantWords.push(word);
    }
  }
  return redundantWords;
}

function containsRedundantWords(txt) {
  return getRedundantWords(txt).length != 0;
}

function removeRedundantWords(txt) {
  const words = getRedundantWords(txt);
  for (const word of words) {
    txt = txt.replace(word, "").trim();
  }
  return txt;
}

function getNewCategory(txt) {
  if (txt.includes("lodging")) {
    return "Lodging";
  }
  if (txt.includes("transportation")) {
    return "Transportation";
  }
  if (txt.includes("other")) {
    return "Other";
  }
  if (txt.includes("shopping")) {
    return "Shopping";
  }
  if (txt.includes("reimbursesb")) {
    return "Reimbursesb";
  }
  if (txt.includes("Reimbursewx")) {
    return "Reimbursewx";
  }
  // the input category is set to food by default
  return "Food";
}

let categoryMap = { airbnb: "Lodging", flight: "Transportation" };

const getCategoryFromMap = (txt) => {
  const wordList = txt.split(" ");
  for (const word of wordList) {
    if (word in categoryMap) {
      return categoryMap[word];
    }
  }
  const newCategory = getNewCategory(txt);
  const newItem = removeRedundantWords(txt);
  if (newItem) {
    categoryMap[newItem] = newCategory;
  }
  return newCategory;
};

export const getRow = (msg) => {
  const row = Number(msg.match(/[0-9]+/g));
  return row;
};
