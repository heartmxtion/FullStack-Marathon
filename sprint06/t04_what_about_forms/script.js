document.getElementById('quizForm').addEventListener('submit', function (event) {
	event.preventDefault();

	const answers = {
		q1: document.querySelector('input[name="q1"]:checked').value,
		q2: document.querySelector('input[name="q2"]:checked').value
	};

	fetch('/submit', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(answers),
	})
	.then(response => response.text())
	.then(data => {
		document.getElementById('result').innerText = data;
	})
	.catch((error) => {
		console.error('Error:', error);
	});
});
