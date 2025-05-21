const Playlist = require('../models/CollaborativePlaylist');
const UserPlaylist = require('../models/userPlaylist.model');
const io = require('../socket');

exports.getPlaylists = async (req, res) => {
  const playlists = await Playlist.find().sort({ createdAt: -1 });
  res.json(playlists);
};

exports.createPlaylist = async (req, res) => {
  const { name, imageUrl, userId, username } = req.body;

  const playlist = new Playlist({
    name,
    imageUrl,
    createdBy: { userId, username },
    songs: []
  });

  await playlist.save();

  // Emit globally since it's a new playlist created
  io.getIO().emit('playlistCreated', playlist);

  res.status(201).json({ message: 'Playlist created', playlist });
};

exports.addSong = async (req, res) => {
  const { playlistId } = req.params;
  const { songId, title, artist, imageUrl, userId, username } = req.body;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

  playlist.songs.push({
    songId,
    title,
    artist,
    imageUrl,
    addedBy: { userId, username },
    addedAt: new Date()
  });

  await playlist.save();

  // Emit event to specific playlist room only
  io.getIO().to(`playlist-${playlistId}`).emit('songAdded', { playlistId, song: playlist.songs.at(-1) });

  res.json({ message: 'Song added', playlist });
};

exports.removeSong = async (req, res) => {
  const { playlistId } = req.params;
  const { songId, userId } = req.body;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

  if (String(playlist.createdBy.userId) !== userId)
    return res.status(403).json({ message: 'Only the creator can remove songs' });

  playlist.songs = playlist.songs.filter(song => song.songId !== songId);
  await playlist.save();

  // Emit event to specific playlist room only
  io.getIO().to(`playlist-${playlistId}`).emit('songRemoved', { playlistId, songId });

  res.json({ message: 'Song removed', playlist });
};

exports.savePlaylistToUser = async (req, res) => {
  const { playlistId } = req.params;
  const { userId } = req.body;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

  const userPlaylist = new UserPlaylist({
    userId,
    name: playlist.name,
    songs: playlist.songs.map(song => ({
      spotifyId: song.songId,
      title: song.title,
      artist: song.artist,
      imageUrl: song.imageUrl,
      addedBy: song.addedBy,
      timestamp: new Date()
    }))
  });

  await userPlaylist.save();

  res.json({ message: 'Playlist saved', userPlaylist });
};
