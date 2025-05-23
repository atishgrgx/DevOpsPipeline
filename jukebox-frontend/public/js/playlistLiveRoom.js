console.log("🎬 playlistLiveRoom.js is running");
const socket = io("http://localhost:3000"); // Connect to backend server

socket.on("connect", () => {
  console.log("🔌 Connected to Socket.IO server:", socket.id);
});

socket.on("playlistCreated", (playlist) => {
  console.log("🆕 New playlist created via socket:", playlist);

  const playlistListContainer = document.getElementById('playlistList');

  if (playlistListContainer) {
    const col = document.createElement('div');
    col.className = 'col s12 m6 l4';
    col.innerHTML = `
      <div class="card black">
        <div class="card-content white-text">
          <span class="card-title">${playlist.name}</span>
          <p>Created By: ${playlist.createdBy.username}</p>
        </div>
        <div class="card-action">
          <a href="#" class="join-playlist-btn pink-text" data-id="${playlist._id}">Join</a>
        </div>
      </div>
    `;
    playlistListContainer.appendChild(col);
  }
});

socket.on('songAdded', ({ playlistId: plId, song }) => {
  const currentPlaylistId = localStorage.getItem('currentPlaylistId');
  if (plId === currentPlaylistId) {
    const tbody = document.getElementById('songsTableBody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${song.title}</td>
      <td>${song.artist}</td>
      <td>${song.addedBy}</td>
    `;
    tbody.appendChild(tr);
  }
});

socket.on('userJoined', ({ userId, message }) => {
  console.log("👤 User joined:", message);
  console.log("📢 Received userJoined event for user:", userId);
  const notifElem = document.getElementById("userJoinNotification");
  if (notifElem) {
    notifElem.innerText = `🎉 ${username || 'A user'} joined the playlist!`;
    notifElem.style.display = "block";

    setTimeout(() => {
      notifElem.style.display = "none";
    }, 3000);
  }
});


document.addEventListener('DOMContentLoaded', async function () {
  const username = sessionStorage.getItem('userName') || 'Guest';
  const email = sessionStorage.getItem('userEmail');


  if (!email) {
    alert('You must be logged in.');
    window.location.href = '../views/login.html';
    return;
  }

  const usernameElem = document.getElementById('username');
  const playlistSelect = document.getElementById('playlistSelect');
  const playlistListContainer = document.getElementById('playlistList');
  const playlistSongsModalElem = document.getElementById('playlistSongsModal');
  const playlistSongsModal = M.Modal.init(playlistSongsModalElem); // Only init once
  const modalElem = document.getElementById('addSongModal');

  const modalInstance = M.Modal.getInstance(modalElem);
  M.Modal.init(document.querySelectorAll('.modal'));
  if (usernameElem) {
    usernameElem.textContent = username;
  }

  // Initialize Materialize components
  M.FormSelect.init(document.querySelectorAll('select'));

  // Close button functionality
  document.addEventListener('DOMContentLoaded', function () {
    const elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
  });


  playlistListContainer.addEventListener('click', async function (e) {

    if (e.target.classList.contains('join-playlist-btn')) {
      e.preventDefault();
      const playlistId = e.target.getAttribute('data-id');
      localStorage.setItem('currentPlaylistId', playlistId);
      try {
        const res = await fetch('http://localhost:3000/api/playlist/all');
        const playlists = await res.json();
        const playlist = playlists.find(p => p._id === playlistId);
        console.log(playlist)
        if (!playlist) {
          alert('Playlist not found.');
          return;
        }

        // Show playlist name
        document.getElementById('modalPlaylistName').textContent = playlist.name;

        // Fill table
        const tbody = document.getElementById('songsTableBody');
        tbody.innerHTML = '';

        if (playlist.songs.length === 0) {
          tbody.innerHTML = `<tr><td colspan="2" class="center-align">No songs in this playlist.</td></tr>`;
        } else {
          playlist.songs.forEach(song => {
            console.log(song)
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${song.title}</td>
              <td>${song.addedBy.username}</td>
            `;
            tbody.appendChild(tr);
          });
        }

        playlistSongsModal.open();
        console.log("🟢 Joining playlist with ID:", playlistId);
        socket.emit('joinPlaylist', username);
      } catch (err) {
        console.error('Failed to fetch playlist songs:', err);
        alert('Failed to load songs. Please try again later.');
      }
    }

  });

  async function fetchPlaylists() {
    try {
      const res = await fetch('http://localhost:3000/api/playlist/all');
      const playlists = await res.json();

      if (playlistSelect) {
        playlistSelect.innerHTML = '<option disabled selected>Select a Playlist Room</option>';
      }
      if (playlistListContainer) {
        playlistListContainer.innerHTML = '';
      }

      playlists.forEach(p => {
        if (playlistSelect) {
          const option = document.createElement('option');
          option.value = p._id;
          option.textContent = p.name;
          playlistSelect.appendChild(option);
        }

        const col = document.createElement('div');
        col.className = 'col s12 m6 l4';
        col.innerHTML = `
          <div class="card black">
            <div class="card-content white-text">
              <span class="card-title">${p.name}</span>
              <p>Created By: ${p.createdBy.username}</p>
            </div>
            <div class="card-action">
              <a href="#" class="join-playlist-btn pink-text" data-id="${p._id}">Join</a>
            </div>
          </div>
        `;
        playlistListContainer.appendChild(col);
      });

      M.FormSelect.init(playlistSelect);
    } catch (err) {
      console.error('Failed to fetch playlists:', err);
    }
  }

  async function handleCreatePlaylist() {
    const form = document.getElementById('createPlaylistForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const input = document.getElementById('playlistNameInput');
      const name = input.value.trim();

      if (!name) return;

      try {
        const res = await fetch('http://localhost:3000/api/playlist/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, name }),
        });

        if (res.ok) {
          input.value = '';
          M.Modal.getInstance(document.getElementById('createPlaylistModal')).close();
          await fetchPlaylists(); // Refresh list
        } else {
          const errData = await res.json();
          alert(`Error: ${errData.message || 'Failed to create playlist'}`);
        }
      } catch (err) {
        console.error('Error creating playlist:', err);
      }
    });
  }

  const addSongToPlaylist = async () => {
    const playlistId = localStorage.getItem('currentPlaylistId');
    console.log(playlistId)
    if (!playlistId) {
      console.error('playlistId is required to add a song');
      return;
    }
    // Add song to playlist
    document.getElementById('addSongButton').addEventListener('click', async () => {
      const searchInput = document.getElementById('searchInput').value.trim();
      const playlistName = document.getElementById('modalPlaylistName').textContent;
      console.log('Hi')
      if (!searchInput || !playlistName) {
        alert('Please enter a song title and ensure a playlist is selected.');
        return;
      }

      try {
        const songId = localStorage.getItem(`selectedSong`) // you need to implement this
        console.log(songId)
        if (!songId) {
          alert('Song not found.');
          return;
        }
        // Get current user info
        const addedBy = {
          username: sessionStorage.getItem('userName') || 'Guest',
          email: sessionStorage.getItem('userEmail') || 'unknown@example.com'
        };

        // Send song to backend
        const res = await fetch(`http://localhost:3000/api/playlist/${playlistId}/add-song`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ songId,username }),
        });

        const data = await res.json();
        console.log('Song added:', data.playlist);
        if (res.ok) {
          alert(`✅ Song "${searchInput}" added to "${playlistName}"!`);
          document.getElementById('searchInput').value = '';

          // Refresh playlist songs in modal
          const tbody = document.getElementById('songsTableBody');
          const tr = document.createElement('tr');
          const title = localStorage.getItem(`songtitle`)
          tr.innerHTML = `
        <td>${title}</td>
        <td>${username}</td>
      `;
          tbody.appendChild(tr);
        } else {
          throw new Error(data.message || 'Failed to add song');
        }
      } catch (error) {
        console.error('❌ Error adding song:', error);
        console.error('Failed to add song. Please try again.');
      }
    });

  }
  window.logout = () => {
    sessionStorage.clear();
    window.location.href = '../views/login.html';
  };


  await fetchPlaylists();
  await handleCreatePlaylist();
  await addSongToPlaylist();

});

const input = document.getElementById('searchInput');
const suggestionsList = document.getElementById('suggestions');

input.addEventListener('input', async () => {
  const query = input.value.trim();
  if (!query) {
    suggestionsList.style.display = 'none';
    suggestionsList.innerHTML = '';
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/songs/search-db?q=${encodeURIComponent(query)}`);
    const songs = await res.json();

    suggestionsList.innerHTML = '';
    if (!Array.isArray(songs)) {
      suggestionsList.style.display = 'none';
      return;
    }

    songs.forEach(song => {
      const li = document.createElement('li');
      li.textContent = song.name + ' – ' + (song.artists[0]?.name || 'Unknown Artist');
      li.style.padding = '8px';
      li.style.cursor = 'pointer';

      li.addEventListener('click', () => {
        input.value = song.name;
        suggestionsList.style.display = 'none';
        // Optional: redirect to song detail or display info
        console.log('Selected song:', song);
        localStorage.setItem('selectedSong', song._id);
        localStorage.setItem('songtitle', song.name);

      });

      suggestionsList.appendChild(li);
    });

    suggestionsList.style.display = songs.length > 0 ? 'block' : 'none';
  } catch (err) {
    console.error('Search error:', err);
    suggestionsList.innerHTML = '';
    suggestionsList.style.display = 'none';
  }
});

// Hide dropdown when clicking outside
document.addEventListener('click', e => {
  if (!e.target.closest('#searchInput')) {
    suggestionsList.style.display = 'none';
  }
});
