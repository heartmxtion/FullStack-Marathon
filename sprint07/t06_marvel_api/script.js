const application = async () => {
	try {
		const response = await fetch('/api');
		const data = await response.json();

		const renderData = (data) => {
			let result = '';
			for (let key in data) {
				if (typeof data[key] === 'object') {
					result += `
						<div class="box parent">
							<p class="name__object parent__color">${key}:</p>
							${renderData(data[key])}
						</div>
					`;
				} else {
					result += `
						<div class="box child">
							<p class="name__object">${key}: <span class="value">${data[key]}</span></p>
						</div>
					`;
				}
			}
			return result;
		};

		document.getElementById('content').innerHTML = renderData(data);
	} catch (error) {
		console.error('Error:', error);
	}
};

document.addEventListener('DOMContentLoaded', application);
