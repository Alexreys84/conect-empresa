// Função para exibir a seta quando rolar até o final da página
window.onscroll = function() {
    var backToTopButton = document.getElementById("backToTop");
    
    // Verifica se a página foi rolada até o final
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
};

// Função para rolar ao topo ao clicar na seta
document.getElementById("backToTop").addEventListener("click", function(event) {
    event.preventDefault();
    window.scrollTo({top: 0, behavior: 'smooth'});
});
