function toggleInfo() {
  var elements = document.querySelectorAll('.pestaña');
  
  elements.forEach(function(element) {
    var info = element.nextElementSibling; // Obtén el siguiente elemento, que es el contenedor de información
    var flecha = element.querySelector('.flecha'); // Busca la flecha dentro del elemento actual
  
    if (info && flecha) {
      if (info.style.display === "none" || info.style.display === "") {
        info.style.display = "block";
        flecha.style.transform = "rotate(135deg)";
      } else {
        info.style.display = "none";
        flecha.style.transform = "rotate(45deg)";
      }
    }
  });
}