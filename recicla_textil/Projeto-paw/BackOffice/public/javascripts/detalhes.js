function toggleDetalhes(elemento) {
    var detalhes = elemento.querySelector('.detalhes');
  
    var visibilidade = getComputedStyle(detalhes).display;
  
    if (visibilidade === 'none') {
        detalhes.style.display = 'block';
    } else {
        detalhes.style.display = 'none';
    }
}