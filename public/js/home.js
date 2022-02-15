$(document).ready(function() {
    $('#random-movie-btn').on('click', function() {
        window.location.href = '/movie/1';
    });

    $('#search-movie-btn').on('click', function() {
        var id = $('#movie-id').val().trim();
        window.location.href = '/movie/' + id;
    });
});