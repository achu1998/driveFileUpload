const express = require('express');
const path = require("path");
const { google } = require("googleapis");
const cron = require("node-cron");
const app = express();

require('dotenv').config();
const port = process.env.PORT || 3000;
const fs = require("fs");

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

const filePath = path.join(__dirname, "FILE_PATH");


app.get("/", (req, res) => {
    res.status(201).json({ message: "Unauthorized access" });
});

app.listen(port, async () => {
    console.log(`App listening on port ${port}`);
});

const KEYFILEPATH = path.join(__dirname, "cred.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

cron.schedule("*/10 * * * * *", async function() {
    console.log("running a task every 10 second");
    await uploadFile();
});

const uploadFile = async () => {

    const { data } = await google.drive({ version: "v3", auth }).files.create({
        media: {
            mimeType: "MIME_TYPE",
            body: fs.createReadStream(filePath),
        },
        requestBody: {
            name: "FILE_NAME",
            parents: ["DRIVE_FOLDER_ID"],
        },
        fields: "id,name",
    });
    console.log(`Uploaded file ${data.name} ${data.id}`);
    return data.id;
};