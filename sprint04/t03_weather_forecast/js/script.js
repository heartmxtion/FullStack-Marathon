document.addEventListener('DOMContentLoaded', function() {
  const apiKey = 'eb338804771b47509c5122835232605';
  const location = 'Kharkiv';

  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=5`)
    .then(response => response.json())
    .then(data => {
      const forecastData = data.forecast.forecastday.map(item => {
        return {
          date: item.date,
          temperature: item.day.avgtemp_c,
          weather: item.day.condition.text,
          icon: item.day.condition.icon
        };
      });

      const forecastContainer = document.getElementById('forecast-container');
      forecastData.forEach(forecast => {
        const forecastElement = document.createElement('div');
        forecastElement.innerHTML = `
		  <p>Date: ${forecast.date}</p>
		  <img src="https:${forecast.icon}" alt="Weather Icon">
		  <p>Weather: ${forecast.weather}</p>
          <p>Temperature: ${forecast.temperature} °C</p>
        `;
        forecastContainer.appendChild(forecastElement);
      });
    })
});
