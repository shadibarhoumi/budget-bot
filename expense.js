import { AirtableBase } from "./airtable.js";

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setHours(0, 0, 0, 0);

const today = new Date();
const dateAWeekAgo = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 7
);

const dateAMonthAgo = new Date(
  today.getFullYear(),
  today.getMonth() - 1,
  today.getDate()
);

const filterByDuration = (duration) => {
  if (duration === "day") {
    return `IS_AFTER({DATE}, '${yesterday}')`;
  }
  if (duration === "week") {
    return `IF(AND(IS_AFTER({DATE}, '${dateAWeekAgo}'), IS_BEFORE({DATE}, '${today}')), 1, 0)`;
  }
  if (duration === "month") {
    return `IF(AND(IS_AFTER({DATE}, '${dateAMonthAgo}'), IS_BEFORE({DATE}, '${today}')), 1, 0)`;
  }
};

const getSum = (records) => {
  if (records.length > 0) {
    const sum = records.reduce(
      (currentSum, record) => currentSum + record.fields.Amount,
      0
    );
    return sum.toFixed(2);
  } else {
    return 0;
  }
};

export const getRecordsForDuration = async (duration) => {
  const formula = filterByDuration(duration);

  const allRecordsForDuration = await AirtableBase("Expenses")
    .select({
      fields: ["Amount", "Date", "Category"],
      filterByFormula: formula,
    })
    .all();

  return allRecordsForDuration;
};

export const getExpenseForDuration = async (duration) => {
  const allRecords = await getRecordsForDuration(duration);
  const sum = getSum(allRecords);
  return sum;
};

export const getTotalOfEachCategory = (allRecordsForDuration) => {
  let totalOfCategory = {
    Food: 0,
    Transportation: 0,
    Other: 0,
    Shopping: 0,
    Lodging: 0,
    ReimburseHusband: 0,
    ReimburseWife: 0,
  };

  for (const record of allRecordsForDuration) {
    const category = record.fields.Category;
    const amount = Math.round(record.fields.Amount);
    if (category === "Food") {
      totalOfCategory["Food"] += amount;
    } else if (category === "Transportation") {
      totalOfCategory["Transportation"] += amount;
    } else if (category === "Other") {
      totalOfCategory["Other"] += amount;
    } else if (category === "Lodging") {
      totalOfCategory["Lodging"] += amount;
    } else if (category == "Shopping") {
      totalOfCategory["Shopping"] += amount;
    } else if (category == "ReimburseHusband") {
      totalOfCategory["ReimburseHusband"] += amount;
    } else if (category == "ReimburseWife") {
      totalOfCategory["ReimburseWife"] += amount;
    }
  }
  return totalOfCategory;
};
