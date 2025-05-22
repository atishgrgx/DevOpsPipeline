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

async function fetchTopSongs() {
    try {
        const res = await fetch('http://localhost:3000/api/songs/top-songs');
        const data = await res.json();

        if (!Array.isArray(data)) {
            console.error('Unexpected response format:', data);
            return [];
        }

        return data.map(song => ({
            title: song.name,
            artist: song.artists.map(a => a.name).join(', '),
            img: song.album?.images?.[0]?.url || '../public/images/default-song.png'
        }));
    } catch (error) {
        console.error('Error fetching top songs:', error);
        return [];
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

    const para = document.createElement('p');
    para.textContent = type === 'song' ? item.artist : item.label;
    para.classList.add(type === 'song' ? 'song-artist' : 'artist-label');
    content.appendChild(para);

    card.appendChild(content);
    wrapper.appendChild(card);
    return wrapper;
}

async function renderCarousels() {
    const trendingContainer = document.getElementById('carousel-trending');
    const artistsContainer = document.getElementById('carousel-artists');

    const topSongs = await fetchTopSongs();
    topSongs.forEach(song => trendingContainer.appendChild(createCard(song, 'song')));

    artists.forEach(art => artistsContainer.appendChild(createCard(art, 'artist')));
}

document.addEventListener('DOMContentLoaded', renderCarousels);