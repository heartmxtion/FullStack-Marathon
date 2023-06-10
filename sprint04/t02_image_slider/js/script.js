document.addEventListener("DOMContentLoaded", function() {
  var images = document.querySelectorAll(".slider img");
  var prevButton = document.getElementById("prevButton");
  var nextButton = document.getElementById("nextButton");
  var currentIndex = 0;
  var slideInterval;

  function showImage(index) {
    images.forEach(function(img) {
      img.classList.remove("active");
    });

    images[index].classList.add("active");
  }

  function prevImage() {
    clearInterval(slideInterval);
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = images.length - 1;
    }
    showImage(currentIndex);
  }

  function nextImage() {
    clearInterval(slideInterval);
    currentIndex++;
    if (currentIndex >= images.length) {
      currentIndex = 0;
    }
    showImage(currentIndex);
  }
  
   function nextImageAutomatic() {
    currentIndex++;
    if (currentIndex >= images.length) {
      currentIndex = 0;
    }
    showImage(currentIndex);
  }

  function startSlideInterval() {
    showImage(currentIndex);
    slideInterval = setInterval(function() {
      nextImageAutomatic();
    }, 3000);
  }

  prevButton.addEventListener("click", prevImage);
  nextButton.addEventListener("click", nextImage);

  startSlideInterval();
});
