let outputArea = document.querySelector('.outputArea');
let textArea = document.querySelector('.textArea');
let savedNotes = [];

function getSavedNotes() {
  savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
}

getSavedNotes();

if (savedNotes.length === 0) {
  outputArea.innerHTML = '[Empty]';
}

function Input() {
  if (textArea.value.trim() === '') {
    alert(`It's Empty. Try to input something in "Text input".`);
    return;
  }

  if (outputArea.innerHTML === '[Empty]') {
    outputArea.innerHTML = '';
  }

  let currentDate = new Date();
  let formattedDate = currentDate.toLocaleString();

  let newNote = {
    content: textArea.value,
    date: formattedDate
  };

  savedNotes.push(newNote);
  localStorage.setItem('notes', JSON.stringify(savedNotes));

  let div = document.createElement('div');
  div.textContent = "--> " + textArea.value + " [" + formattedDate + "]";
  outputArea.append(div);
  textArea.value = '';
}

function deleteAllNotes() {
  let answer = confirm("Are you sure?");
  if (answer) {
    localStorage.removeItem('notes');
    savedNotes = [];
    outputArea.innerHTML = '[Empty]';
  }
}

window.addEventListener('load', () => {
  if (savedNotes.length !== 0) {
    outputArea.innerHTML = savedNotes.map(note => `<div>${note.content} [${note.date}]</div>`).join('');
  }
});
