document.getElementById('noteForm').addEventListener('submit', async function (e) {
	e.preventDefault();

	const name = document.getElementById('name').value;
	const importance = document.getElementById('importance').value;
	const content = document.getElementById('content').value;

	try {
		await axios.post('/notes', { name, importance, content });
		loadNotes();
	} catch (error) {
		console.error(error);
	}
});

async function loadNotes() {
	try {
		const response = await axios.get('/notes');
		const notesElement = document.getElementById('notes');
		notesElement.innerHTML = '';

		response.data.forEach((note) => {
			const li = document.createElement('li');
			const a = document.createElement('a');
			const formattedDate = new Date(note.date).toLocaleString();

			a.textContent = `${formattedDate} > ${note.name}`;
			a.href = '#';
			a.style.color = 'blue';

			a.addEventListener('click', function (e) {
				e.preventDefault();
				showNoteDetails(note);
				this.style.color = 'purple';
			});

			li.appendChild(a);

			const deleteLink = document.createElement('a');
			deleteLink.textContent = ' DELETE';
			deleteLink.href = '#';

			deleteLink.addEventListener('click', async function (e) {
				e.preventDefault();
				try {
					await axios.delete(`/notes/${note.id}`);
					loadNotes();
					clearNoteDetails(note);
				} catch (error) {
					console.error(error);
				}
			});

			li.appendChild(deleteLink);
			notesElement.appendChild(li);
		});
	} catch (error) {
		console.error(error);
	}
}

function showNoteDetails(note) {
	const noteDetailsElement = document.getElementById('noteDetails');
	noteDetailsElement.innerHTML = `<h2>Detail of "${note.name}"</h2>
									<ul>
										<li>date: <strong>${new Date(note.date).toLocaleString()} </strong></li>
										<li>name: <strong>${note.name} </strong></li>
										<li>importance: <strong>${note.importance} </strong></li>
										<li>text: <strong>${note.content} </strong></li>
									</ul>`;
}

function clearNoteDetails(note) {
	const noteDetailsElement = document.getElementById('noteDetails');
	if (noteDetailsElement.innerHTML.includes(note.name)) {
		noteDetailsElement.innerHTML = '';
	}
}

loadNotes();
