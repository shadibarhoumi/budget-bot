import Airtable from "airtable";

export const AirtableBase = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base(process.env.AIRTABLE_BASE);
