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
  let items = containsRedundantWord(txt) ? removeRedundantWord(txt) : txt;

  let peso = isMexicanPeso(msg) ? Number(msg.match(/[0-9\.]+/g)) : null;

  let category = getCategoryFromMap(txt);

  return {
    price: amount,
    description: capitalize(items),
    otherCurrency: peso,
    tag: category,
  };
}

function containsRedundantWord(txt) {
  return (
    txt.includes("food") ||
    txt.includes("transportation") ||
    txt.includes("lodging") ||
    txt.includes("other") ||
    txt.includes("shopping") ||
    txt.includes("peso") ||
    txt.includes("pesos")
  );
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

function removeRedundantWord(txt) {
  if (txt.includes("pesos")) {
    return txt.replace("pesos", "").trim();
  }
  if (txt.includes("pesos")) {
    return txt.replace("peso", "").trim();
  }
  if (txt.includes("lodging")) {
    return txt.replace("lodging", "").trim();
  }
  if (txt.includes("transportation")) {
    return txt.replace("transportation", "").trim();
  }
  if (txt.includes("other")) {
    return txt.replace("other", "").trim();
  }
  if (txt.includes("shopping")) {
    return txt.replace("shopping", "").trim();
  }
  if (txt.includes("food")) {
    return txt.replace("food", "").trim();
  }
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
  // the input category is set to food by default
  return "Food";
}

let categoryMap = { airbnb: "Lodging", flight: "Transportation" };
// console.log("creating category map", categoryMap);
const getCategoryFromMap = (txt) => {
  const wordList = txt.split(" ");
  for (const word of wordList) {
    if (word in categoryMap) {
      return categoryMap[word];
    }
  }
  const newCategory = getNewCategory(txt);
  const newItem = removeRedundantWord(txt);
  if (newItem) {
    categoryMap[newItem] = newCategory;
    console.log(newItem);
    console.log(categoryMap);
  }
  return newCategory;
};

export const getRow = (msg) => {
  const row = Number(msg.match(/[0-9]+/g));
  console.log(row);
  return row;
};
