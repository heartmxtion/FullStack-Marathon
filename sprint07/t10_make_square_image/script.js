$(document).ready(function() {
	$('#imageForm').submit(function(e) {
		e.preventDefault();
		const imageUrl = $('#imageUrl').val();

		$.post('/process', { imageUrl }, function(data) {
			const imgElement = $('<img>', {
				src: 'data:image/png;base64,' + data,
				style: 'max-width:100%;height:auto;'
			});

			$('#result').empty().append(imgElement);
		});
	});
});
