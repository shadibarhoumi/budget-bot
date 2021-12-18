import Airtable from "airtable";

const base = new Airtable({ apiKey: "keyP1SbuDuLo1qPhM" }).base(
  "appuSqLyneHIkdtvH"
);

export const createExpense = ({ price, description, otherCurrency }) => {
  base("Expenses").create(
    [
      {
        fields: {
          Amount: price,
          MexicanPeso: otherCurrency,
          Items: description,
          Date: new Date().toISOString().substring(0, 10),
        },
      },
    ],
    function (err) {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
};

const getSum = (allRecords) => {
  const sum = allRecords.reduce(
    (currentSum, record) => currentSum + record.fields.Amount,
    0
  );
  return sum.toFixed(2);
};

export const getTotalDayExpense = async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const allRecords = await base("Expenses")
    .select({
      fields: ["Amount", "Date"],
      filterByFormula: `IS_AFTER({DATE}, '${yesterday}')`,
    })
    .all();

  const sum = getSum(allRecords);
  return sum;
};

export const getTotalWeekExpense = async () => {
  const today = new Date();
  const dateAWeekAgo = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );

  const allRecords = await base("Expenses")
    .select({
      fields: ["Amount", "Date"],
      filterByFormula: `IF(AND(IS_AFTER({DATE}, '${dateAWeekAgo}'), IS_BEFORE({DATE}, '${today}')), 1, 0)`,
    })
    .all();

  const sumWeek = getSum(allRecords);

  return sumWeek;
};

export const getTotalMonthExpense = async () => {
  const today = new Date();
  const dateAMonthAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate()
  );

  const allRecords = await base("Expenses")
    .select({
      fields: ["Amount", "Date"],
      filterByFormula: `IF(AND(IS_AFTER({DATE}, '${dateAMonthAgo}'), IS_BEFORE({DATE}, '${today}')), 1, 0)`,
    })
    .all();

  const sumMonth = getSum(allRecords);

  // console.log(sumMonth);

  return sumMonth;
};
