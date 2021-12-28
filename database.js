import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base(
  process.env.AIRTABLE_BASE
);

export const createExpense = ({ price, description, otherCurrency, tag }) => {
  const promise = new Promise((resolve, reject) => {
    base("Expenses").create(
      [
        {
          fields: {
            Amount: price,
            MexicanPeso: otherCurrency,
            Items: description,
            Category: tag,
            Date: new Date().toISOString().substring(0, 10),
          },
        },
      ],
      function (err, record) {
        if (err) {
          console.error(err);
          return;
        }
        resolve(record[0].fields.ShortId);
      }
    );
  });

  return promise;
};

export const deleteRecordWithId = async (id) => {
  base("Expenses").destroy(id, function (err) {
    if (err) {
      console.error(err);
      return;
    }
  });
};

export const getRecordWithShortId = async (shortId) => {
  const matchingRecords = await base("Expenses")
    .select({
      filterByFormula: `{ShortId} = ${shortId}`,
    })
    .all();

  return matchingRecords[0];
};

const getSum = (allRecords) => {
  const sum = allRecords.reduce(
    (currentSum, record) => currentSum + record.fields.Amount,
    0
  );
  return sum.toFixed(2);
};

export const getTotalDayExpense = async () => {
  const midnightToday = new Date();
  midnightToday.setHours(0, 0, 0);

  const allRecords = await base("Expenses")
    .select({
      fields: ["Amount", "Date"],
      filterByFormula: `IS_AFTER({DATE}, '${midnightToday}')`,
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

//
