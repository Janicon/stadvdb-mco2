$(document).ready(function() {
    $('#add-user-btn').on('click', function() {
        var user = {};

        user.id = $('#add-id').val();
        user.fname = $('#add-fname').val();
        user.lname = $('#add-lname').val();

        $.get('/test' + "/addUser", user, function (result) {
			if (result != false) {
				$("#user-box").load ('/test' + " #user-box>*");
			}
		});
    });
});