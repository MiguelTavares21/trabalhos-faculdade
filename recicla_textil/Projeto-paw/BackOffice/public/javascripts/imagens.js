document.getElementById('fotos').addEventListener('change', function(event) {
    var files = event.target.files;
    var imagePreviews = document.getElementById('imagePreviews');
    imagePreviews.innerHTML = '';

    for (var i = 0; i < files.length; i++) {
        var img = document.createElement('img');
        img.classList.add('preview-image');
        img.src = URL.createObjectURL(files[i]);

        var button = document.createElement('button');
        button.innerHTML = 'Remover';
        button.addEventListener('click', function(e) {
            e.target.previousSibling.remove();
            e.target.remove();
        });

        var div = document.createElement('div');
        div.appendChild(img);
        div.appendChild(button);

        imagePreviews.appendChild(div);
    }
});

document.getElementById('fotoPerfil').addEventListener('change', function(event) {
    var file = event.target.files[0];
    var perfilPreview = document.getElementById('perfilPreview');
    perfilPreview.innerHTML = '';

    var img = document.createElement('img');
    img.classList.add('preview-image');
    img.src = URL.createObjectURL(file);

    var button = document.createElement('button');
    button.innerHTML = 'Remover';
    button.addEventListener('click', function(e) {
        e.target.previousSibling.remove();
        e.target.remove();
    });

    var div = document.createElement('div');
    div.appendChild(img);
    div.appendChild(button);

    perfilPreview.appendChild(div);
});