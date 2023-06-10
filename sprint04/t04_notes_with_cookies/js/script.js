let outputArea = document.querySelector('.outputArea');
let textArea = document.querySelector('.textArea');
let savedNotes = [];

function getSavedNotes() {
  let cookiesArr = document.cookie.split(';');
  savedNotes = [];

  for (const cookie of cookiesArr) {
    const trimmedCookie = cookie.trim();
    const [cookieName, cookieValue] = trimmedCookie.split('=');

    if (cookieName.trim() === 'notes') {
      savedNotes = JSON.parse(decodeURIComponent(cookieValue.trim()));
      break;
    }
  }
}

getSavedNotes();

if (savedNotes.length === 0) {
  outputArea.innerHTML = '[Empty]';
} else {
  outputArea.innerHTML = savedNotes.join('<br>');
}

function Input() {
  if (textArea.value.trim() === '') {
    alert(`It's Empty. Try to input something in "Text input".`);
    return;
  }

  if (outputArea.innerHTML === '[Empty]') {
    outputArea.innerHTML = '';
  }

  let date = new Date(Date.now() + 86400e3 * 30);
  date.toUTCString();

  let notesJSON = JSON.stringify(savedNotes.concat(textArea.value));

  document.cookie = `notes=${encodeURIComponent(notesJSON)};expires=${date.toUTCString()}`;
  getSavedNotes();
  let div = document.createElement('div');
  div.append("--> " + textArea.value);
  outputArea.append(div);
  textArea.value = '';
}

function deleteAllCookies() {
  let answer = confirm("Are you sure?");
  if (answer) {
    document.cookie = 'notes=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    savedNotes = [];
    outputArea.innerHTML = '[Empty]';
  }
}

window.addEventListener('load', () => {
  if (savedNotes.length !== 0) {
    outputArea.innerHTML = savedNotes.join('<br>');
  }
});
