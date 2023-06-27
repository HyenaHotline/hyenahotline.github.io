import artwork from "./artwork.js";


const placeholderWorks = [
    {
        filename: "1024x1024.png",
        caption: "A placeholder image for a square canvas",
        description: "A 1024x1024 test image"
    },
    {
        filename: "1920x1080.png",
        caption: "A placeholder image for a landscape 16:9 canvas",
        description: "A 1920x1080 test image"
    },
    {
        filename: "1080x1920.png",
        caption: "A placeholder image for a portrait 16:9 canvas",
        description: "A 1080x1920 test image"
    },
    {
        filename: "1920x1440.png",
        caption: "A placeholder image for a landscape 4:3 canvas",
        description: "A 1920x1440 test image"
    },
    {
        filename: "1440x1920.png",
        caption: "A placeholder image for a portrait 4:3 canvas",
        description: "A 1440x1920 test image"
    }
]

const placeholderCommissioners = [
    "@WhisperingScribe",
    "@PixelJuggler",
    "@AstralDreamer",
    "@SparklingEcho",
    "@NeonGlimmer",
    "@SerenityGazer",
    "@VelvetWanderer",
    "@MidnightGlow",
    "@LunarDust",
    "@EnigmaJade"
];
const placeholderTypes = [];

for(const type of ["Profile", "Bust", "Half-body", "Full-body"]) {
    for(const renderLevel of ["Sketch", "Lineart", "Flat-color", "Fully Shaded"]) {
        placeholderTypes.push(type + " / " + renderLevel);
    }
}

function generatePlaceholderArt() {
    for(let i = 0; i < 100; i++) {
        const randomPlaceholder = placeholderWorks[Math.floor(Math.random() * placeholderWorks.length)];
        randomPlaceholder.commission = Math.random() > 0.5;

        if(randomPlaceholder.commission) {
            randomPlaceholder.commissioner = Math.random() > 0.2 ? placeholderCommissioners[Math.floor(Math.random() * placeholderCommissioners.length)] : null;
            randomPlaceholder.type = placeholderTypes[Math.floor(Math.random() * placeholderTypes.length)];

            if(randomPlaceholder.commissioner != null) {
                randomPlaceholder.commissionerLink = Math.random() > 0.8 ? "https://example.com" : null;
            }
        }
        const clone = Object.assign({}, randomPlaceholder);
        artwork.push(clone);
    }
}


window.addEventListener("load", e => {
    const generalArt = document.querySelector("#general-art");
    const commissionPieces = document.querySelector("#commission-pieces");

    for(const work of artwork) {
        const elem = document.createElement("div");
        elem.classList.add("portfolio-image");
        elem.classList.add("display-container");

        const image = document.createElement("img");
        image.classList.add("image");
        image.setAttribute("src", "/assets/portfolio/" + work.filename);
        image.setAttribute("alt", work.description);
        image.setAttribute("title", work.description);
        
        const workType = document.createElement("span");
        workType.classList.add("commission-type");
        workType.textContent = work.type;

        const caption = document.createElement("span");
        caption.classList.add("caption");
        caption.textContent = work.caption;

        const dateCreatedElement = document.createElement("span");
        dateCreatedElement.classList.add("date-created");

        const dateCreated = new Date(0);
        if(work.dateCreated.year >= 1000) {
            dateCreated.setFullYear(work.dateCreated.year);
        } else {
            dateCreated.setYear(work.dateCreated.year);
        }
        dateCreated.setMonth(work.dateCreated.month - 1, work.dateCreated.day);
        dateCreatedElement.textContent = new Intl.DateTimeFormat().format(dateCreated);

        const topBar = document.createElement("div");
        topBar.classList.add("top-bar");
        topBar.appendChild(workType);
        topBar.appendChild(dateCreatedElement);

        if(typeof work.commission == "object") {
            elem.classList.add("commissioned");

            let commissioner = document.createElement("div");
            let commissionerName;
            if(work.commission.link == null) {
                commissionerName = document.createElement("span");
            } else {
                commissionerName = document.createElement("a");
                commissionerName.setAttribute("href", work.commission.link);
            }
            commissioner.classList.add("commissioner");
            commissionerName.textContent = work.commission.name ?? "an anonymous person";
            commissionerName.classList.add("commissioner-name");

            commissioner.appendChild(commissionerName);

            elem.appendChild(topBar);
            elem.appendChild(image);
            elem.appendChild(caption);
            elem.appendChild(commissioner);
            commissionPieces.appendChild(elem);
        } else {
            elem.appendChild(topBar);
            elem.appendChild(image);
            elem.appendChild(caption);
            generalArt.appendChild(elem);
        }
    }
})