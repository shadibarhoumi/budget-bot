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

export const getTotalExpense = async () => {
  const allRecords = await base("Expenses")
    .select({ fields: ["Amount"] })
    .all();

  const sum = getSum(allRecords);
  return sum;
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

const getSum = (allRecords) => {
  const sum = allRecords.reduce(
    (currentSum, record) => currentSum + record.fields.Amount,
    0
  );
  return sum.toFixed(2);
};
