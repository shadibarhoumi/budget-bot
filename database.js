import Airtable from "airtable";

const base = new Airtable({ apiKey: "keyP1SbuDuLo1qPhM" }).base(
  "appuSqLyneHIkdtvH"
);

export const createExpense = ({ price, description }) => {
  base("Expenses").create(
    [
      {
        fields: {
          Items: description,
          Amount: price,
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

// export const getTotalExpense = async () => {
//   const allRecords = await base("Expenses")
//     .select({ fields: ["Amount"] })
//     .all();

//   const sum = getSum(allRecords);
//   return sum;
// };

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

// getTotalDayExpense();

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

  // console.log(allRecords);

  const sumWeek = getSum(allRecords);

  // console.log(sumWeek);
  return sumWeek;
};

//TODO: get the date range right
export const getTotalMonthExpense = async () => {
  const today = new Date();
  const dateAMonthAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate()
  );
  // console.log(dateAMonthAgo);

  const allRecords = await base("Expenses")
    .select({
      fields: ["Amount", "Date"],
      filterByFormula: `IF(AND(IS_AFTER({DATE}, '${dateAMonthAgo}'), IS_BEFORE({DATE}, '${today}')), 1, 0)`,
    })
    .all();

  // console.log(allRecords);

  const sumMonth = getSum(allRecords);

  // console.log(sumMonth);

  return sumMonth;
};

// getTotalWeekExpense();
// getTotalMonthExpense();
