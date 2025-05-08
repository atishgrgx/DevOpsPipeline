const fs = require('fs');
const path = require('path');
const Song = require('../model/song.js');
const { getSongById } = require('../services/spotifyService.js');

const saveSongsFromFile = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../data/unique_song_ids_by_genre.txt');
        const content = fs.readFileSync(filePath, 'utf-8');
        const songIds = content.split('\n').map(id => id.trim()).filter(Boolean);

        const savedSongs = [];

        for (const id of songIds) {
            const songData = await getSongById(id);

            const newSong = new Song({
                name: songData.name,
                songId: songData.id,
                artists: songData.artists.map(a => ({
                    name: a.name,
                    id: a.id,
                    href: a.href,
                })),
                album: {
                    name: songData.album.name,
                    id: songData.album.id,
                    href: songData.album.href,
                    images: songData.album.images,
                    release_date: songData.album.release_date,
                },
                duration_ms: songData.duration_ms,
                popularity: songData.popularity,
                explicit: songData.explicit,
                preview_url: songData.preview_url,
                external_urls: songData.external_urls,
                type: songData.type,
                release_date: new Date(songData.album.release_date),
                external_id: songData.external_ids?.isrc || '',
            });

            await newSong.save();
            savedSongs.push(newSong);
            console.log(`Song added: ${songData.name}`);
        }

        res.status(201).json({
            message: `${savedSongs.length} songs saved from file.`,
            songs: savedSongs,
        });
    } catch (error) {
        console.error('Error saving songs from file:', error);
        res.status(500).json({ error: 'Failed to save songs from file' });
    }
};

module.exports = {
    saveSongsFromFile,
};