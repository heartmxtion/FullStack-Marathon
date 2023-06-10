document.addEventListener('DOMContentLoaded', () => {
  const filmTitles = document.querySelectorAll('.film-title');
  const filmTitleElement = document.getElementById('film-title');
  const filmPosterElement = document.getElementById('film-poster');
  const filmProductionDateElement = document.getElementById('film-production-date');
  const filmInfoElement = document.getElementById('film-info');
  const filmActorsElement = document.getElementById('film-actors');

  const initialFilmTitle = 'John Wick';
  const initialFilmData = getFilmData(initialFilmTitle);

  filmTitleElement.textContent = initialFilmTitle;
  filmPosterElement.src = initialFilmData.poster;
  filmProductionDateElement.textContent = `${initialFilmData.productionDate}`;
  filmInfoElement.textContent = `${initialFilmData.information}`;


  const actors = initialFilmData.actors.split(', ');
  actors.forEach(actor => {
    const actorElement = document.createElement('span');
    actorElement.textContent = actor;
    filmActorsElement.appendChild(actorElement);
  });


  document.getElementById('film-details').style.display = 'block';

  filmTitles.forEach(title => {
    title.addEventListener('click', () => {

      const prevSelectedTitle = document.querySelector('.selected');
      if (prevSelectedTitle) {
        prevSelectedTitle.classList.remove('selected');
      }


      title.classList.add('selected');

      const selectedTitle = title.getAttribute('data-title');
      const filmData = getFilmData(selectedTitle);

      filmTitleElement.textContent = selectedTitle;
      filmPosterElement.src = filmData.poster;
      filmProductionDateElement.textContent = `${filmData.productionDate}`;
      filmInfoElement.textContent = `${filmData.information}`;


      filmActorsElement.innerHTML = '';


      const actors = filmData.actors.split(', ');
      actors.forEach(actor => {
        const actorElement = document.createElement('span');
        actorElement.textContent = actor;
        filmActorsElement.appendChild(actorElement);
      });

      document.getElementById('film-details').style.display = 'block';
    });
  });
  


  const initialFilmTitleElement = document.querySelector(`.film-title[data-title="${initialFilmTitle}"]`);
  initialFilmTitleElement.classList.add('selected');


  function getFilmData(title) {

    const filmData = {
      'John Wick': {
        poster: 'assets/images/film1-poster.jpg',
        productionDate: 'Sept 19, 2014',
        information: "John Wick (Keanu Reeves) has lost his wife Helen (Bridget Moynahan) due to an unnamed illness. Her posthumous gift was Daisy's puppy, along with a letter in which she hoped that the dog would help him cope with the loss. Wick becomes attached to the puppy and they spend whole days driving around in a 1969 Ford Mustang Mach 1. 7 days after his wife's death at a gas station, John meets three strangers and one of them, Josef Tarasov (Alfie Allen), goes up for sale Mustang, but John refuses.",
        actors: 'Keanu Reeves, Michael Nyqvist, Alfie Allen, Adrianne Palicki, Bridget Moynahan',
      },
      'Avengers: Endgame': {
        poster: 'assets/images/film2-poster.jpg',
        productionDate: 'April 22, 2019',
        information: "After the devasting events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos' actions and restore oreder to the univers once and for all, no matter what consequences may be in store.",
        actors: 'Robert Downey Jr., Chris Evans, Ian McShine, Chris Hemsworth, Scarlett Johansson',
      },
      'Inception': {
        poster: 'assets/images/film3-poster.jpg',
        productionDate: 'July 8, 2010',
        information: "Dominic Cobb and Arthur are ''extractors'': they engage in corporate espionage, using experimental military technology to penetrate the subconscious of their ''targets'' and extract information through a shared dream world. Their latest target, Saito, reveals that he arranged a meeting to see if Cobb could do the seemingly impossible job of implanting an idea into a person's subconscious, or ''beginning.'' Saito wants Cobb to convince Robert Fisher, the son of Saito's ailing competitor Maurice Fisher, to take down his father's company. In return, Saito promises ''with just one call'' to help Cobb, who is falsely accused of killing his wife, legally return to the United States, where his children remained.",
        actors: 'Leonardo DiCaprio, Ken Watanabe, Joseph Gordon-Levitt, Ellen Page, Marion Cotillard',
      },

    };

    return filmData[title];
  }
});
