window.addEventListener("DOMContentLoaded", e => {
    const backgroundElement = document.createElement("iframe");
    backgroundElement.setAttribute("id", "background");
    backgroundElement.setAttribute("src", "/vaporwave/");
    document.body.appendChild(backgroundElement);
    
    function resize() {
        backgroundElement.width = innerWidth;
        backgroundElement.height = innerHeight;
    }

    window.addEventListener("resize", resize);
    resize();
});