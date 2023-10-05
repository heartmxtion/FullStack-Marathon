let currentData = [];
let selectedHeader = null;

document.querySelector('form').addEventListener('submit', handleFormSubmit);

function handleFormSubmit(evt) {
	evt.preventDefault();
	let formData = new FormData(evt.target);
	fetch('/upload', { method: 'POST', body: formData })
		.then(response => response.json())
		.then(handleData)
		.catch(handleError);
}

function handleData(data) {
	currentData = data;
	displayData(data);
	if (data.length > 0) {
		selectedHeader = Object.keys(data[0])[0];
		populateValueFilter([...new Set(currentData.map(row => row[selectedHeader]))]);
	}
}

function handleError(error) {
	console.error(error);
}

function displayData(data) {
	let table = document.getElementById('data');
	table.innerHTML = '';
	if (data.length > 0) {
		let headers = Object.keys(data[0]);
		let headerRow = document.createElement('tr');
		headers.forEach(header => {
			let th = document.createElement('th');
			th.textContent = header;
			th.onclick = () => handleHeaderClick(header);
			headerRow.appendChild(th);
		});
		table.appendChild(headerRow);
	}
	data.forEach(row => {
		let tr = document.createElement('tr');
		Object.values(row).forEach(cell => {
			let td = document.createElement('td');
			td.textContent = cell;
			tr.appendChild(td);
		});
		table.appendChild(tr);
	});
}

function handleHeaderClick(header) {
	selectedHeader = header;
	populateValueFilter([...new Set(currentData.map(row => row[header]))]);
}

function populateValueFilter(values) {
	let filter = document.getElementById('valueFilter');
	filter.innerHTML = '';
	values.forEach(value => {
		let option = document.createElement('option');
		option.value = value;
		option.textContent = value;
		filter.appendChild(option);
	});
}

function applyFilter() {
	let valueFilter = document.getElementById('valueFilter');
	let selectedValue = valueFilter.value;
	let filteredData = currentData.filter(row => row[selectedHeader] === selectedValue);
	displayData(filteredData);
}

function resetFilter() {
	displayData(currentData);
}
