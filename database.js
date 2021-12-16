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
    function (err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record) {
        console.log(record.getId());
      });
    }
  );
};
