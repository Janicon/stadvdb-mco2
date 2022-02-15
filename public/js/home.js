$(document).ready(function() {
    $('#search-movie-btn').on('click', function() {
        var id = $('#movie-id').val().trim();
        if(id != '')
            document.location.href = '/movie/' + id;
        else
            document.location.href = '/';
    });

    $('#add-movie').on('keyup', function() {
        var valid = true;
        var errorMessage = '&nbsp';

        if($('#add-id').val().trim() == '' ||
            $('#add-name').val().trim() == '' ||
            $('#add-year').val().trim() == '' ||
            $('#add-rank').val().trim() == '' ||
            $('#add-genre').val().trim() == '' ||
            $('#add-director').val().trim() == '' ||
            $('#add-actor1').val().trim() == '' ||
            $('#add-actor2').val().trim() == '') {
                errorMessage = 'Form incomplete.'
                valid = false;
            }
            
        $('#add-movie-error-msg').html(errorMessage);
        if(valid)
            setEnabled($("#add-movie-btn"));
        else
            setDisabled($("#add-movie-btn"));
    });
});

function setEnabled (element) {
	$(element).prop("disabled", false);
	$(element).addClass("clickable");
}

function setDisabled (element) {
	$(element).prop("disabled", true);
	$(element).removeClass("clickable");
}