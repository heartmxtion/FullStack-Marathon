window.onload = function() {
	const submitButton = document.getElementById('submit');
	const deleteButton = document.getElementById('delete');
	const filenameInput = document.getElementById('str');
	const contentInput = document.getElementById('content');
	const filenameDisplay = document.getElementById('filename');
	const contentDisplay = document.getElementById('content-selected');
	const fileListDiv = document.getElementById('list');
	const fileSection = document.getElementById('file');

	function updateFileList() {
		fetch('/file-list')
			.then(response => response.json())
			.then(data => {
				fileListDiv.innerHTML = data.htmlList;
				let links = fileListDiv.getElementsByTagName('a');
				for (let link of links) {
					link.addEventListener('click', function(event) {
						event.preventDefault();
						selectFile(link.textContent);
					});
				}
			});
	}

	function selectFile(filename) {
		fetch(`/select-file?file=${filename}`)
			.then(response => response.json())
			.then(data => {
				filenameDisplay.textContent = data.filename;
				contentDisplay.textContent = data.content;
				fileSection.style.display = 'block';
			});
	}

	submitButton.addEventListener('click', function(event) {
		event.preventDefault();
		fetch('/create-file', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				filename: filenameInput.value,
				content: contentInput.value,
			}),
		})
		.then(() => {
			updateFileList();
			filenameInput.value = '';
			contentInput.value = '';
		});
	});

	deleteButton.addEventListener('click', function(event) {
		event.preventDefault();
		fetch(`/delete-file?file=${filenameDisplay.textContent}`, {
			method: 'POST',
		})
		.then(() => {
			updateFileList();
			fileSection.style.display = 'none';
		});
	});

	updateFileList();
};