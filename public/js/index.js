$(document).ready(function() {
    // TODO: Get random movie from existing in DB
    $('#random-actor-btn').on('click', function() {
        window.location.href = '/actor/1';
    });

    // TODO: Get random movie from existing in DB
    $('#random-director-btn').on('click', function() {
        window.location.href = '/director/1';
    });

    // TODO: Get random movie from existing in DB
    $('#random-movie-btn').on('click', function() {
        window.location.href = '/movie/1';
    });

    $('#search-actor-btn').on('click', function() {
        var id = $('#actor-id').val().trim();
        window.location.href = '/actor/' + id;
    });

    $('#search-director-btn').on('click', function() {
        var id = $('#director-id').val().trim();
        window.location.href = '/director/' + id;
    });

    $('#search-movie-btn').on('click', function() {
        var id = $('#movie-id').val().trim();
        window.location.href = '/movie/' + id;
    });
});