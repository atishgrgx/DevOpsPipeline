// public/js/home.js

const songs = [
  { title: 'Old Phone', artist: 'Ed Sheeran', img: '../public/images/play 6.png' },
  { title: 'Show Me Love', artist: 'Honey Tyla', img: '../public/images/song 4.png' },
  { title: 'Egypt - Remix', artist: 'Ed Sheeran', img: '../public/images/song 1.png' },
  { title: 'Egypt - Remix', artist: 'Ed Sheeran', img: '../public/images/song 1.png' },
  { title: 'Egypt - Remix', artist: 'Ed Sheeran', img: '../public/images/song 1.png' },
  { title: 'Egypt - Remix', artist: 'Ed Sheeran', img: '../public/images/play 6.png' },
  { title: 'Egypt - Remix', artist: 'Ed Sheeran', img: '../public/images/song 1.png' },
  { title: 'Egypt - Remix', artist: 'Ed Sheeran', img: '../public/images/song 1.png' },
  { title: 'Egypt - Remix', artist: 'Ed Sheeran', img: '../public/images/song 1.png' },
  { title: 'Egypt - Remix', artist: 'Ed Sheeran', img: '../public/images/song 1.png' },
  { title: 'Egypt - Remix', artist: 'Honey Tyla', img: '../public/images/play 6.png' }
];

const artists = [
  { name: 'Ed Sheeran', label: 'Artist', img: '../public/images/song 1.png' },
  { name: 'Beyoncé', label: 'Artist', img: '../public/images/song 1.png' },
  { name: 'Drake', label: 'Honey Tyla', img: '../public/images/song 4.png' },
  { name: 'Drake', label: 'Artist', img: '../public/images/song 4.png' },
  { name: 'Drake', label: 'Honey Tyla', img: '../public/images/song 4.png' },
  { name: 'Drake', label: 'Artist', img: '../public/images/song 4.png' },
  { name: 'Drake', label: 'Artist', img: '../public/images/song 4.png' },
  { name: 'Drake', label: 'Honey Tyla', img: '../public/images/song 4.png' },
  { name: 'Drake', label: 'Artist', img: '../public/images/play 6.png' },
  { name: 'Drake', label: 'Artist', img: '../public/images/song 4.png' },
  { name: 'Drake', label: 'Artist', img: '../public/images/play 6.png' }
];

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

  const para = document.createElement('p');
  para.textContent = type === 'song' ? item.artist : item.label;
  para.classList.add(type === 'song' ? 'song-artist' : 'artist-label');
  content.appendChild(para);

  card.appendChild(content);
  wrapper.appendChild(card);
  return wrapper;
}

function renderCarousels() {
  const trendingContainer = document.getElementById('carousel-trending');
  const artistsContainer = document.getElementById('carousel-artists');
  songs.forEach(song => trendingContainer.appendChild(createCard(song, 'song')));
  artists.forEach(art => artistsContainer.appendChild(createCard(art, 'artist')));
}

document.addEventListener('DOMContentLoaded', renderCarousels);
