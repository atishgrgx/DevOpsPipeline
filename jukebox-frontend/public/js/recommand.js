const songs = [
  {
    title: "Adiye – From “Bachelor”",
    artist: "Dhibu Ninan Thomas",
    album: "Adiye (From “Bachelor”)",
    duration: "4:32",
    image: "../public/images/song 1.png"
  },
  {
    title: "Vaarayo Vaarayo – Lofi Flip",
    artist: "Narendar Sankar",
    album: "Vaarayo Vaarayo (Lofi Flip)",
    duration: "2:29",
    image: "../public/images/song 4.png"
  },
  {
    title: "Thozhi (From “Hey Sinamika”)",
    artist: "Kovindh Vasanth",
    album: "Thozhi (From “Hey Sinamika”)",
    duration: "5:57",
    image: "../public/images/song 4.png"
  }
];

// Render songs
const tableBody = document.getElementById('song-table-body');

songs.forEach((song, index) => {
  const row = `
    <tr>
      <td class="white-text">${index + 1}</td>
      <td>
        <div class="song-info">
          <img src="${song.image}" class="song-img">
          <div>
            <span class="song-title white-text">${song.title}</span><br>
            <span class="song-artist grey-text text-lighten-1">${song.artist}</span>
          </div>
        </div>
      </td>
      <td class="white-text">${song.album}</td>
      <td class="white-text">${song.duration}</td>
    </tr>
  `;
  tableBody.insertAdjacentHTML('beforeend', row);
});

function openPlaylistModal() {
  
  const songs = ['Rain', 'Naina', 'Comedy'];

  fetch('http://127.0.0.1:5000/api/recommend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      songs: songs,
      model_type: 'song'  // or 'playlist' if you want to test that
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Response:', data);
    if (data.error) {
      alert(data.error);
      return;
    }

const trackIds = data.recommendations.map(r => r.track_id);

      return fetch('http://127.0.0.1:5000/api/song_details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_ids: trackIds })
      });
    })
    .then(res => res.json())
    .then(songDetails => {
      playlistSongs.length = 0;
      songDetails.forEach(song => {
        playlistSongs.push({
          title: song.title,
          artist: song.artist,
          album: song.album,
          duration: song.duration || '3:30',
          image: song.image || '../public/images/song 1.png'
        });
      });
      
    renderPlaylistSongs();
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
  })
  .catch(err => {
    console.error('Error:', err);
    alert('Failed to get recommendations.');
  });
}

  function closePlaylistModal() {
  document.getElementById('playlist-modal').style.display = 'none';
}

// Dummy playlist songs (you'll pull from real data later)
const playlistSongs = [
  {
    title: 'Adiye – From “Bachelor”',
    artist: 'Dhibu Ninan Thomas',
    album: 'Adiye (From “Bachelor”)',
    duration: '4:32',
    image: '../public/images/play 6.png'
  },
  {
    title: 'Adiye – From “Bachelor”',
    artist: 'Dhibu Ninan Thomas',
    album: 'Adiye (From “Bachelor”)',
    duration: '4:32',
    image: '../public/images/song 1.png'
  },
  {
    title: 'Adiye – From “Bachelor”',
    artist: 'Dhibu Ninan Thomas',
    album: 'Adiye (From “Bachelor”)',
    duration: '4:32',
    image: '../public/images/song 1.png'
  },
  {
    title: 'Adiye – From “Bachelor”',
    artist: 'Dhibu Ninan Thomas',
    album: 'Adiye (From “Bachelor”)',
    duration: '4:32',
    image: '../public/images/song 1.png'
  },
  {
    title: 'Adiye – From “Bachelor”',
    artist: 'Dhibu Ninan Thomas',
    album: 'Adiye (From “Bachelor”)',
    duration: '4:32',
    image: '../public/images/song 1.png'
  },
  {
    title: 'Adiye – From “Bachelor”',
    artist: 'Dhibu Ninan Thomas',
    album: 'Adiye (From “Bachelor”)',
    duration: '4:32',
    image: '../public/images/song 1.png'
  },
  // Add more songs as needed...
];

const modal = document.getElementById('playlist-modal');
const playlistBody = document.getElementById('playlist-songs-body');

// Show modal
document.querySelector('.btn').addEventListener('click', () => {
  renderPlaylistSongs();
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
});

// Hide modal when clicking outside content
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 400);
  }
});

// Render playlist songs table
function renderPlaylistSongs() {
  playlistBody.innerHTML = '';
  playlistSongs.forEach((song, index) => {
    const row = `
      <tr>
        <td class="white-text">${index + 1}</td>
        <td>
          <div class="song-info">
            <img src="${song.image}" class="song-img">
            <div>
              <span class="song-title white-text">${song.title}</span><br>
              <span class="song-artist grey-text text-lighten-1">${song.artist}</span>
            </div>
          </div>
        </td>
        <td class="white-text">${song.album}</td>
        <td class="white-text">${song.duration}</td>
        <td><button class="remove-btn" onclick="removeSong(this)">Remove</button></td>
      </tr>
    `;
    playlistBody.insertAdjacentHTML('beforeend', row);
  });
}

function removeSong(button) {
    // Find the closest <tr> (row) and remove it
    var row = button.closest('tr');
    row.remove();
}
