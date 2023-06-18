const pages = [
    {
        path: "/home/",
        name: "Home"
    },
    {
        path: "/portfolio/",
        name: "Portfolio"
    },
    {
        path: "/prices/",
        name: "Prices"
    }
];

if(!document.location.pathname.includes(".") && !document.location.pathname.endsWith("/")) {
    document.location.pathname = document.location.pathname + "/";
}

window.addEventListener("load", e => {
    const navbar = document.querySelector("#navigation-bar");

    if(navbar == null) {
        console.warn("No navigation bar element exists, skipping setup");
        return;
    }

    for(const page of pages) {
        const root = document.createElement("a");
        root.classList.add("navigation-page");
        root.setAttribute("href", page.path);
        
        if(document.location.pathname == page.path) {
            root.classList.add("selected");
        }

        const label = document.createElement("span");
        label.textContent = page.name;

        root.appendChild(label);
        navbar.appendChild(root);
    }
})