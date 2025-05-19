// public/js/home.js

// const playlist = [
//   { title: 'Old Phone', img: '../public/images/play 6.png' },
//   { title: 'Show Me Love', img: '../public/images/song 4.png' },
//   { title: 'Egypt - Remix', img: '../public/images/song 1.png' },
//   { title: 'Egypt - Remix', img: '../public/images/song 1.png' },
//   { title: 'Egypt - Remix', img: '../public/images/song 1.png' },
//   { title: 'Egypt - Remix', img: '../public/images/play 6.png' },
//   { title: 'Egypt - Remix', img: '../public/images/song 1.png' },
//   { title: 'Egypt - Remix', img: '../public/images/song 1.png' },
//   { title: 'Egypt - Remix', img: '../public/images/song 1.png' },
//   { title: 'Egypt - Remix', img: '../public/images/song 1.png' },
//   { title: 'Egypt - Remix', img: '../public/images/play 6.png' }
// ];

let playlist = [];
let playlistSongs = [];
let allPlaylists = [];

async function fetchPlaylists() {
  try {
    const response = await fetch('http://127.0.0.1:3000/api/playlists');
    const data = await response.json();
    playlist = data.map(pl => ({
      title: pl.playlist_name,
      img: pl.songs[0]?.image || 'jukebox-frontend/public/images/play 6.png'  // fallback image
    }));
    allPlaylists = data;
    playlistSongs = data[0]?.songs || [];

    renderCarousels();
  } catch (error) {
    console.error('Failed to fetch playlists:', error);
  }
}

function createCard(item, type) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('carousel-item');

  const card = document.createElement('div');
  card.classList.add(type === 'song' ? 'card-song' : 'card-artist');

  const img = document.createElement('img');
  img.src = item.img;
  img.alt = type === 'song' ? item.title : item.name;
  card.appendChild(img);

  const content = document.createElement('div');
  content.classList.add('card-content');

  const heading = document.createElement('h6');
  heading.textContent = type === 'song' ? item.title : item.name;
  heading.classList.add(type === 'song' ? 'song-title' : 'artist-name');
  content.appendChild(heading);


  const button = document.createElement('button');
  button.textContent = 'Explore';
  button.classList.add('explore-button'); // Add this class for styling
  button.addEventListener('click', () => {
  // Load matching playlist songs by title
  const matched = allPlaylists.find(p => p.playlist_name === item.title);
  playlistSongs = matched?.songs || [];
  openPlaylistModal();
});
  content.appendChild(button);

  card.appendChild(content);
  wrapper.appendChild(card);
  return wrapper;
}

function renderCarousels() {
  const trendingContainer = document.getElementById('carousel-trending');
  const artistsContainer = document.getElementById('carousel-artists');
  playlist.forEach(song => trendingContainer.appendChild(createCard(song, 'song')));
}

function openPlaylistModal() {
  const modal = document.getElementById('playlist-modal');
  if (modal) {
    modal.classList.add('active');
    renderPlaylistSongs(); // Render songs when modal opens
  }
}


function closePlaylistModal() {
  const modal = document.getElementById('playlist-modal');
  if (modal) modal.classList.remove('active');
}

document.getElementById('modal-close-btn').addEventListener('click', () => {
  const modal = document.getElementById('playlist-modal');
  if (modal) {
    modal.classList.remove('active');
  }
});


document.addEventListener('DOMContentLoaded', fetchPlaylists);

// const playlistSongs = [
//   {
//     title: 'Adiye – From “Bachelor”',
//     artist: 'Dhibu Ninan Thomas',
//     album: 'Adiye (From “Bachelor”)',
//     duration: '4:32',
//     image: '../public/images/play 6.png'
//   },
//   {
//     title: 'Adiye – From “Bachelor”',
//     artist: 'Dhibu Ninan Thomas',
//     album: 'Adiye (From “Bachelor”)',
//     duration: '4:32',
//     image: '../public/images/song 1.png'
//   },
//   {
//     title: 'Adiye – From “Bachelor”',
//     artist: 'Dhibu Ninan Thomas',
//     album: 'Adiye (From “Bachelor”)',
//     duration: '4:32',
//     image: '../public/images/song 1.png'
//   },
//   {
//     title: 'Adiye – From “Bachelor”',
//     artist: 'Dhibu Ninan Thomas',
//     album: 'Adiye (From “Bachelor”)',
//     duration: '4:32',
//     image: '../public/images/song 1.png'
//   },
//   {
//     title: 'Adiye – From “Bachelor”',
//     artist: 'Dhibu Ninan Thomas',
//     album: 'Adiye (From “Bachelor”)',
//     duration: '4:32',
//     image: '../public/images/song 1.png'
//   },
//   {
//     title: 'Adiye – From “Bachelor”',
//     artist: 'Dhibu Ninan Thomas',
//     album: 'Adiye (From “Bachelor”)',
//     duration: '4:32',
//     image: '../public/images/song 1.png'
//   },
//   // Add more songs as needed...
// ];

function renderPlaylistSongs() {
  const tbody = document.getElementById('playlist-songs-body');
  tbody.innerHTML = ''; // Clear existing rows

  playlistSongs.forEach((song, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>
        <div style="display: flex; align-items: center;">
          <img src="${song.image}" alt="${song.title}" style="width: 40px; height: 40px; margin-right: 10px;">
          <div>
            <div style="font-weight: 600;">${song.title}</div>
            <div style="font-size: 12px; color: gray;">${song.artist}</div>
          </div>
        </div>
      </td>
      <td>${song.album}</td>
      <td>${song.duration}</td>
      <td>
        <button class="remove-button" data-index="${index}" style="
          background-color: transparent;
          color: red;
          border: none;
          cursor: pointer;
          font-size: 16px;
        ">
          Remove
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });

  // Attach remove event to each button
  const removeButtons = document.querySelectorAll('.remove-button');
  removeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const songIndex = parseInt(e.target.getAttribute('data-index'), 10);
      playlistSongs.splice(songIndex, 1); // Remove song
      renderPlaylistSongs(); // Re-render table
    });
  });
}

