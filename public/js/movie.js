$(document).ready(function() {
    $('#edit-movie').on('keyup', function() {
        var valid = true;
        var errorMessage = '&nbsp';

        if($('#edit-name').val().trim() == '' &&
            $('#edit-year').val().trim() == '' &&
            $('#edit-rank').val().trim() == '' &&
            $('#edit-genre').val().trim() == '' &&
            $('#edit-director').val().trim() == '' &&
            $('#edit-actor1').val().trim() == '' &&
            $('#edit-actor2').val().trim() == '') {
                errorMessage = 'Form empty.'
                valid = false;
            }
            
        $('#edit-movie-error-msg').html(errorMessage);
        if(valid)
            setEnabled($("#edit-movie-btn"));
        else
            setDisabled($("#edit-movie-btn"));
    });
});

function setEnabled (element) {
	$(element).prop("disabled", false);
	$(element).removeClass("clickable-disabled");
	$(element).addClass("clickable");
}

function setDisabled (element) {
	$(element).prop("disabled", true);
	$(element).removeClass("clickable");
	$(element).addClass("clickable-disabled");
}