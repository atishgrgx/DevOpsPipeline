$(document).ready(function () {
    function loadSongs() {
        $.ajax({
            url: 'http://localhost:3000/api/songs/',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                const songList = $('#song-list');
                songList.empty();
                if (data && data.length > 0) {
                    data.forEach(song => {
                        const artistNames = song.artists.map(artist => artist.name).join(', ');
                        const releaseDate = song.release_date ? song.release_date.substring(0, 10) : 'N/A';
                        const explicit = song.explicit ? 'True' : 'False';

                        const row = `
                            <tr>
                                <td>${song.name}</td>
                                <td>${artistNames}</td>
                                <td>${song.album ? song.album.name : 'N/A'}</td>
                                <td>${song.album ? song.songId : 'N/A'}</td>
                                <td>${releaseDate}</td>
                                <td>${song.popularity}</td>
                                <td>${explicit}</td>
                                <td>
                                    <button class="waves-effect waves-light btn btn-small red delete-song" data-id="${song.songId}"><i class="material-icons">delete</i></button>
                                </td>
                            </tr>
                        `;
                        songList.append(row);
                    });
                } else {
                    songList.append('<tr><td colspan="8" class="center-align">No songs found.</td></tr>');
                }
            },
            error: function (error) {
                console.error('Error loading songs:', error);
                $('#song-list').append('<tr><td colspan="8" class="center-align">Failed to load songs.</td></tr>');
            }
        });
    }

    $('#add-song-modal .modal-footer button').on('click', function () {
        const name = $('#add_name').val();
        const addSongUrl = `http://localhost:3000/api/songs/search/${encodeURIComponent(name)}`;

        $.ajax({
            url: addSongUrl,
            method: 'GET',
            success: function (response) {
                M.toast({ html: `Song "${name}" added successfully` });
                $('#add-song-modal').modal('close');
                loadSongs();
                $('#add-song-modal input').val('');
            },
            error: function (error) {
                M.toast({ html: `Error adding song "${name}"` });
                console.error(`Error adding song "${name}"`, error);
            }
        });
    });

    $('#add-song-with-file .modal-footer button').on('click', function () {
        const addSongsUrl = `http://localhost:3000/api/songs/save-from-file`;

        $.ajax({
            url: addSongsUrl,
            method: 'GET',
            success: function (response) {
                M.toast({ html: `Song "${name}" added successfully (via GET URL)!` });
                loadSongs();
            },
            error: function (error) {
                M.toast({ html: `Error adding songs` });
                console.error(`Error adding songs`, error);
            }
        });
    });

    $(document).on('click', '.delete-song', function () {
        const songId = $(this).data('id');
        console.error('Error loading songs:', this);
        if (confirm('Are you sure you want to delete this song?')) {
            $.ajax({
                url: `http://localhost:3000/api/songs/remove/${songId}`,
                method: 'DELETE',
                success: function (response) {
                    M.toast({ html: 'Song deleted successfully!' });
                    loadSongs();
                },
                error: function (error) {
                    M.toast({ html: 'Error deleting song.' });
                    console.error('Error deleting song:', error);
                }
            });
        }
    });

    loadSongs();
});