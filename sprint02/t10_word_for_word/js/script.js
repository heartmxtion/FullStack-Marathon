// Add words to the object's property
function addWords(obj, wrds) {
  if (obj && obj.words && typeof wrds === 'string') {
    const wordsArray = obj.words.split(' ').filter(word => word.trim() !== '');
    const newWordsArray = wrds.split(' ').filter(word => word.trim() !== '');
    obj.words = [...new Set([...wordsArray, ...newWordsArray])].join(' ');
  }
}

// Remove specified words from the object's property
function removeWords(obj, wrds) {
  if (obj && obj.words && typeof wrds === 'string') {
    const wordsArray = obj.words.split(' ').filter(word => word.trim() !== '');
    const removeWordsArray = wrds.split(' ').filter(word => word.trim() !== '');
    obj.words = wordsArray.filter(word => !removeWordsArray.includes(word)).join(' ');
  }
}

// Change one or more words in the object's property
function changeWords(obj, oldWrds, newWrds) {
  if (obj && obj.words && typeof oldWrds === 'string' && typeof newWrds === 'string') {
    const wordsArray = obj.words.split(' ').filter(word => word.trim() !== '');
    const oldWordsArray = oldWrds.split(' ').filter(word => word.trim() !== '');
    const newWordsArray = newWrds.split(' ').filter(word => word.trim() !== '');

    for (let i = 0; i < wordsArray.length; i++) {
      if (oldWordsArray.includes(wordsArray[i]) && i < newWordsArray.length) {
        wordsArray[i] = newWordsArray[i];
      }
    }

    obj.words = wordsArray.join(' ');
  }
}