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

  if (usernameElem) {
    usernameElem.textContent = username;
  }

  // Initialize Materialize components
  M.FormSelect.init(document.querySelectorAll('select'));
  M.Modal.init(document.querySelectorAll('.modal'));

  // Fetch playlists and render them
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
        // Dropdown option
        if (playlistSelect) {
          const option = document.createElement('option');
          option.value = p._id;
          option.textContent = p.name;
          playlistSelect.appendChild(option);
        }

        console.log(p)
        // Playlist card
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

      M.FormSelect.init(playlistSelect); // Re-initialize
    } catch (err) {
      console.error('Failed to fetch playlists:', err);
    }
  }


  // Handle create playlist submission
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
          await fetchPlaylists(); // Refresh playlist list
        } else {
          const errData = await res.json();
          alert(`Error: ${errData.message || 'Failed to create playlist'}`);
        }
      } catch (err) {
        console.error('Error creating playlist:', err);
      }
    });
  }

  // Logout function
  window.logout = () => {
    sessionStorage.clear();
    window.location.href = '../views/login.html';
  };

  // Initial calls
  await fetchPlaylists();
  await handleCreatePlaylist();
});
