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
        $('#crash-node1-btn').on('click', function() {
                          $.post('' + '/crashNode1');
                          $.post('' + '/crashNode1mv');

                    });
         $('#crash-node1bef-btn').on('click', function() {
                                  $.post('' + '/crashNode1bef');

                            });
        $('#crash-node2-btn').on('click', function() {
                              $.post('' + '/crashNode2');
                              $.post('' + '/crashNode2mv');
                        });
        $('#crash-node3-btn').on('click', function() {
                              $.post('' + '/crashNode3');
                              $.post('' + '/crashNode3mv');
                        });

    $('#genre-count-btn').on('click', function() {
        $('#report-box').show();
        $.get('/getGenreCounts', function(result) {
            $('#report-box-records tbody').children().remove();
            
            var html = '';
            for(var i = 0; i < result.length; i++)
                        html += '<tr><td>' + result[i].label + 
                                '</td><td>' + result[i].data + '</td></tr>';
            $('#report-box-records tbody').append(html);
        });
    });

    $('#genre-rank-btn').on('click', function() {
        $('#report-box').show();
        $.get('/getGenreRanks', function(result) {
            $('#report-box-records tbody').children().remove();
            
            var html = '';
            for(var i = 0; i < result.length; i++)
                        html += '<tr><td>' + result[i].label + 
                                '</td><td>' + result[i].data + '</td></tr>';
            $('#report-box-records tbody').append(html);
        });
    });

    $('#director-count-btn').on('click', function() {
        $('#report-box').show();
        $.get('/getDirectorCounts', function(result) {
            $('#report-box-records tbody').children().remove();
            
            var html = '';
            for(var i = 0; i < result.length; i++)
                        html += '<tr><td>' + result[i].label + 
                                '</td><td>' + result[i].data + '</td></tr>';
            $('#report-box-records tbody').append(html);
        });
    });

    $('#actor-count-btn').on('click', function() {
        $('#report-box').show();
        $.get('/getActorCounts', function(result) {
            $('#report-box-records tbody').children().remove();
            
            var html = '';
            for(var i = 0; i < result.length; i++)
                        html += '<tr><td>' + result[i].label + 
                                '</td><td>' + result[i].data + '</td></tr>';
            $('#report-box-records tbody').append(html);
        });
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