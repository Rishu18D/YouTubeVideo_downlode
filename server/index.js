const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 4000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to the YouTube Downloader');
});

app.get('/downloadmp3', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url || !ytdl.validateURL(url)) {
            return res.status(400).send('Invalid or missing YouTube URL');
        }

        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\x00-\x7F]/g, '');

        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
        res.setHeader('Content-Type', 'audio/mpeg');
        res.status(200);

        const audio = ytdl(url, { quality: 'highestaudio' });
        audio.pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/downloadmp4', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url || !ytdl.validateURL(url)) {
            return res.status(400).send('Invalid or missing YouTube URL');
        }

        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\x00-\x7F]/g, '');

        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');
        res.status(200);

        const video = ytdl(url, { quality: 'highestvideo' });
        video.pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
    console.log(`Server Works !!! At port ${PORT}`);
});

module.exports = app;
