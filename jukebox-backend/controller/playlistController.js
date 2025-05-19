const Playlist = require('../model/playlist.js');

exports.getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find(); 
    console.log('Fetched playlists:', playlists);
    res.json(playlists);
  } catch (error) {
    console.error('Failed to get playlists', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
};