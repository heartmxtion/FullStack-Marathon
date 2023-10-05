function encodeString(input, charset) {
	const encoder = new TextEncoder(charset);
	const data = encoder.encode(input);
	return new TextDecoder(charset).decode(data);
}

function changeCharset() {
	const inputString = document.getElementById('inputString').value;
	const selectedCharsets = Array.from(document.getElementById('charset').selectedOptions).map(option => option.value);

	const outputContainer = document.getElementById('output');
	outputContainer.style.display = 'block';

	outputContainer.innerHTML = '';

	selectedCharsets.forEach(charset => {
		const outputElement = document.createElement('div');
		outputElement.innerHTML = `${charset}: ${encodeString(inputString, charset)}`;
		outputContainer.appendChild(outputElement);
	});
}

function clearFields() {
	document.getElementById('inputString').value = '';
	document.getElementById('output').style.display = 'none';
}
