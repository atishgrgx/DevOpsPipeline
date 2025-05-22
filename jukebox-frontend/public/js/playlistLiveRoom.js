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
  M.Modal.init(document.querySelectorAll('.modal'));
  if (usernameElem) {
    usernameElem.textContent = username;
  }

  // Initialize Materialize components
  M.FormSelect.init(document.querySelectorAll('select'));

  // Close button functionality
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const instance = M.Modal.getInstance(playlistSongsModalElem);
      instance.close();
    });
  });

  // Handle click on "Join" buttons
  playlistListContainer.addEventListener('click', async function (e) {
    if (e.target.classList.contains('join-playlist-btn')) {
      e.preventDefault();
      const playlistId = e.target.getAttribute('data-id');

      try {
        const res = await fetch('http://localhost:3000/api/playlist/all');
        const playlists = await res.json();
        const playlist = playlists.find(p => p._id === playlistId);

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
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${song.title}</td>
              <td>${song.addedBy?.username || 'Unknown'}</td>
            `;
            tbody.appendChild(tr);
          });
        }

        playlistSongsModal.open();
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

  window.logout = () => {
    sessionStorage.clear();
    window.location.href = '../views/login.html';
  };

  async function serach() {
    const songSearchInput = document.getElementById('songSearchInput');
    const songSuggestions = document.getElementById('songSuggestions');
    console.log("1111")
    console.log("🎧 Setting up song search listener", songSearchInput, songSuggestions);
    if (songSearchInput && songSuggestions) {
  console.log("🎧 Setting up song search listener");

  songSearchInput.addEventListener('input', async () => {
    const query = songSearchInput.value.trim();

    songSuggestions.innerHTML = '';
    if (!query) return;

    try {
      const res = await fetch(`http://localhost:3000/api/songs/top-songs`);
      console.log("🎤 Fetched top songs"); // Fixed typo here
      const allSongs = await res.json();
      console.log(allSongs);

      const filtered = allSongs.filter(song =>
        song.title.toLowerCase().includes(query.toLowerCase())
      );

      filtered.slice(0, 5).forEach(song => {
        const li = document.createElement('li');
        li.classList.add('collection-item');
        li.style.cursor = 'pointer';
        li.textContent = song.title;
        li.addEventListener('click', () => {
          songSearchInput.value = song.title;
          songSuggestions.innerHTML = '';
        });
        songSuggestions.appendChild(li);
      });
    } catch (err) {
      console.error('Error fetching songs:', err);
    }
  });
}

  }

  await fetchPlaylists();
  await handleCreatePlaylist();
  await serach();
});
