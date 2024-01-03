document.addEventListener("DOMContentLoaded", function() {
    var avatar = document.getElementById('avatar');
    var userAvatar = document.getElementById('userAvatar');
    var initialAvatar = document.getElementById('initialAvatar');
    var uploadButton = document.getElementById('uploadImageButton');

    // Obtener la primera letra del nombre completo
    var fullNameElement = document.getElementById('fullName'); // Asegúrate de que este sea el ID correcto
    var fullName = fullNameElement.textContent.trim();
    var firstLetter = fullName.charAt(0).toUpperCase();

    // Establecer la inicial del avatar
    initialAvatar.innerText = firstLetter;

    avatar.addEventListener('mouseover', function() {
        uploadButton.style.display = 'block';
    });

    avatar.addEventListener('mouseout', function() {
        uploadButton.style.display = 'none';
    });
});
