document.addEventListener("DOMContentLoaded", function() {
  const logo = document.querySelector(".logo-image");
  let isDragging = false;
  let offsetX, offsetY;
  const loginContainer = document.querySelector(".login-container");

  logo.addEventListener("mousedown", (e) => {
    if (!isInsideLoginContainer(e.clientX, e.clientY)) {
      isDragging = true;
      offsetX = e.clientX - logo.getBoundingClientRect().left;
      offsetY = e.clientY - logo.getBoundingClientRect().top;
      logo.style.cursor = "grabbing";
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
      logo.style.left = `${newX}px`;
      logo.style.top = `${newY}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      logo.style.cursor = "grab";
    }
  });

  function isInsideLoginContainer(x, y) {
    const loginRect = loginContainer.getBoundingClientRect();
    return (
      x >= loginRect.left &&
      x <= loginRect.right &&
      y >= loginRect.top &&
      y <= loginRect.bottom
    );
  }

  setTimeout(moveLogo, 2000);

  function moveLogo() {
    const randomX = Math.random() * (window.innerWidth - logo.clientWidth);
    const randomY = Math.random() * (window.innerHeight - logo.clientHeight);
    logo.style.left = `${randomX}px`;
    logo.style.top = `${randomY}px`;
    setTimeout(moveLogo, 5000);
  }
});
