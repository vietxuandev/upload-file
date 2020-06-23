const fs = require('fs');
const credentials = require('./credentials.json');
const token = require('./token.json') || '';
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];


const authorize = (credentials) => {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    if (!token) return getAccessToken(oAuth2Client);
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
}

const getAccessToken = (oAuth2Client) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            return oAuth2Client;
        });
    });
}

const listFiles = async () => {
    try {
        const auth = authorize(credentials);
        const drive = google.drive({ version: 'v3', auth });
        const response = await drive.files.list({
            pageSize: 100,
            fields: 'nextPageToken, files(id, name)',
        })
        const files = response.data.files;
        return files;
    } catch (err) {
        return err;
    }
}

const uploadFile = async (bufferStream, originalname, mimetype) => {
    try {
        const auth = authorize(credentials);
        const drive = google.drive({ version: 'v3', auth });
        const fileMetadata = {
            name: originalname
        };
        const media = {
            mimeType: mimetype,
            body: bufferStream
        };
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, name, mimeType'
        })
        const file = response.data;
        return { src: `https://drive.google.com/uc?export=view&id=${file.id}`, name: file.name, type: file.mimeType };
    } catch (err) {
        return err;
    }
}

module.exports = { listFiles, uploadFile };