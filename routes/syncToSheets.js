// utils/syncToSheets.js
const { google } = require("googleapis");
const { MongoClient } = require("mongodb");
const fs = require("fs");
require("dotenv").config();

const LAST_SYNC_FILE = "./lastSync.json";

async function syncToSheets() {
  const auth = new google.auth.GoogleAuth({

    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: authClient });

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const collection = db.collection("submissions");

  let lastSyncedAt = null;
  if (fs.existsSync(LAST_SYNC_FILE)) {
    const syncData = JSON.parse(fs.readFileSync(LAST_SYNC_FILE, "utf-8"));
    lastSyncedAt = syncData.lastSyncedAt ? new Date(syncData.lastSyncedAt) : null;
  }

  const query = lastSyncedAt ? { createdAt: { $gt: lastSyncedAt } } : {};
  const submissions = await collection.find(query).sort({ createdAt: 1 }).toArray();

  if (submissions.length === 0) {
    console.log("No new submissions to sync.");
    return;
  }

  const rows = submissions.map((doc) => [
    doc.name,
    doc.email,
    doc.message,
    doc.status,
    doc.createdAt,
  ]);

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: "Sheet1!A1",
    valueInputOption: "RAW",
    requestBody: {
      values: rows,
    },
  });

  const latest = submissions[submissions.length - 1].createdAt;
  fs.writeFileSync(
    LAST_SYNC_FILE,
    JSON.stringify({ lastSyncedAt: latest }, null, 2)
  );

  console.log(`Synced ${submissions.length} new submissions to Google Sheets.`);
  await client.close();
}

module.exports = syncToSheets;
