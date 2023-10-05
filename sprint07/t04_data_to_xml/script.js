window.onload = function () {
	fetch('/XML').then((response) => response.json()).then((data) => {
		document.getElementById('to').innerText = data.to;
		document.getElementById('from').innerText = data.from;
	});
};

