document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img[data-src]');
  const options = {
    threshold: 0,
    rootMargin: '0px 0px 100px 0px'
  };

  const handleIntersection = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.src = entry.target.dataset.src;
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(handleIntersection, options);

  images.forEach((image) => {
    observer.observe(image);
  });

  const message = document.getElementById('message');
  let loadedCount = 0;

  const updateMessage = () => {
    loadedCount++;
    message.textContent = `Loaded: ${loadedCount}/${images.length}`;

    if (loadedCount === images.length) {
      message.style.backgroundColor = '#0f0';
      message.style.display = 'block';

      setTimeout(() => {
        message.style.display = 'none';
      }, 3000);
    }
  };

  images.forEach((image) => {
    image.addEventListener('load', updateMessage);
    image.addEventListener('error', updateMessage);
  });
});
