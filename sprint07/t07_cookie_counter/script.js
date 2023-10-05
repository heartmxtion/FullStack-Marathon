document.addEventListener('DOMContentLoaded', function() {
	let loadCount = parseInt(getCookie('pageLoadCount')) || 0;
	loadCount++;
	document.getElementById('loadCount').textContent = loadCount;
	document.cookie = `pageLoadCount=${loadCount}; max-age=60; path=/`;
});

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}
