import { AirtableBase } from "./airtable.js";

export const createExpense = ({ price, description, otherCurrency, tag }) => {
  const promise = new Promise((resolve, reject) => {
    AirtableBase("Expenses").create(
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
  AirtableBase("Expenses").destroy(id, function (err) {
    if (err) {
      console.error(err);
      return;
    }
  });
};

export const getRecordWithShortId = async (shortId) => {
  const matchingRecords = await AirtableBase("Expenses")
    .select({
      filterByFormula: `{ShortId} = ${shortId}`,
    })
    .all();

  return matchingRecords[0];
};
