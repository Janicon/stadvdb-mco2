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

    $('#delete-movie').on('keyup', function() {
        var ref = $('#movie-name').text().trim();
        var cmp = $('#delete-movie').val();

        if(cmp != '') {
            if(ref == cmp)
                setEnabled($('#delete-movie-btn'));
            else
                setDisabled($('#delete-movie-btn'));
        }
        else
            setDisabled($('#delete-movie-btn'));
    });

    $('#delete-movie-btn').on('click', function() {
        document.location.href = document.location.href + '/delete';
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