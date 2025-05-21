const socket = io('http://localhost:3000'); // adjust if deployed

document.addEventListener('DOMContentLoaded', async function () {
  const username = sessionStorage.getItem('userName') || 'Guest';
  const email = sessionStorage.getItem('userEmail');

  if (!email) {
    alert('You must be logged in.');
    window.location.href = '../views/login.html';
    return;
  }

  document.getElementById('username').textContent = username;

  const playlistSelect = document.getElementById('playlistSelect');
  const playlistDetails = document.getElementById('playlistDetails');
  const playlistNameHeading = document.getElementById('playlistName');
  const songList = document.getElementById('songList');
  let currentPlaylistId = null;

  // Materialize setup
  const selects = document.querySelectorAll('select');
  M.FormSelect.init(selects);
  const modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  // Fetch playlists from backend
  async function fetchPlaylists() {
    const res = await fetch('http://localhost:3000/api/playlist');
    const playlists = await res.json();
    playlists.forEach(p => {
      const option = document.createElement('option');
      option.value = p._id;
      option.textContent = p.name;
      playlistSelect.appendChild(option);
    });
    M.FormSelect.init(playlistSelect); // Re-init after adding
  }

  // Join a playlist room
  playlistSelect.addEventListener('change', async () => {
    const playlistId = playlistSelect.value;
    if (!playlistId) return;

    currentPlaylistId = playlistId;
    socket.emit('joinRoom', playlistId);

    // Get playlist data
    const res = await fetch(`http://localhost:3000/api/playlist/${playlistId}`);
    const data = await res.json();

    playlistNameHeading.textContent = data.name;
    renderSongs(data.songs || []);
    playlistDetails.style.display = 'block';
  });

  // Render song list
  function renderSongs(songs) {
    songList.innerHTML = '';
    songs.forEach(song => {
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.innerHTML = `<strong>${song.title}</strong> by ${song.artist}`;
      songList.appendChild(li);
    });
  }

  // Add song form submit
  document.getElementById('addSongForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!currentPlaylistId) return;

    const title = document.getElementById('songTitle').value.trim();
    const artist = document.getElementById('songArtist').value.trim();
    if (!title || !artist) return;

    socket.emit('addSong', {
      playlistId: currentPlaylistId,
      song: { title, artist, addedBy: email }
    });

    document.getElementById('songTitle').value = '';
    document.getElementById('songArtist').value = '';
  });

  // Real-time song added
  socket.on('songAdded', ({ song, playlistId }) => {
    if (playlistId !== currentPlaylistId) return;
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.innerHTML = `<strong>${song.title}</strong> by ${song.artist}`;
    songList.appendChild(li);
  });

  // Create playlist form
  document.getElementById('createPlaylistForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const playlistName = document.getElementById('playlistNameInput').value.trim();
    if (!playlistName) return;

    const res = await fetch('http://localhost:3000/api/playlist/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: playlistName, createdBy: email })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Playlist created!');
      playlistSelect.innerHTML = '<option disabled selected>Select a Playlist Room</option>';
      fetchPlaylists();
      M.Modal.getInstance(document.getElementById('createPlaylistModal')).close();
      document.getElementById('playlistNameInput').value = '';
    } else {
      alert(data.message || 'Failed to create playlist');
    }
  });

  // Logout function
  window.logout = () => {
    sessionStorage.clear();
    window.location.href = '../views/login.html';
  };

  fetchPlaylists();
});
