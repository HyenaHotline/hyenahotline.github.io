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
const placeholderCommissionTypes = [];

for(const type of ["Profile", "Bust", "Half-body", "Full-body"]) {
    for(const renderLevel of ["Sketch", "Lineart", "Flat-color", "Fully Shaded"]) {
        placeholderCommissionTypes.push(type + " / " + renderLevel);
    }
}



const artwork = [
    // {
    //     filename: "1024x1024.png",
    //     caption: "A placeholder image for a square canvas",
    //     description: "A 1024x1024 test image",
    //     commission: false,
    //     commissionType: "Bust / Flat-color",
    //     commissioner: "JohnDoe",
    //     commissionerLink: "https://example.com"
    // }
]


for(let i = 0; i < 100; i++) {
    const randomPlaceholder = placeholderWorks[Math.floor(Math.random() * placeholderWorks.length)];
    randomPlaceholder.commission = Math.random() > 0.5;

    if(randomPlaceholder.commission) {
        randomPlaceholder.commissioner = Math.random() > 0.2 ? placeholderCommissioners[Math.floor(Math.random() * placeholderCommissioners.length)] : null;
        randomPlaceholder.commissionType = placeholderCommissionTypes[Math.floor(Math.random() * placeholderCommissionTypes.length)];

        if(randomPlaceholder.commissioner != null) {
            randomPlaceholder.commissionerLink = Math.random() > 0.8 ? "https://example.com" : null;
        }
    }
    const clone = Object.assign({}, randomPlaceholder);
    artwork.push(clone);
}


window.addEventListener("load", e => {
    const generalArt = document.querySelector("#general-art");
    const commissionPieces = document.querySelector("#commission-pieces");

    for(const work of artwork) {
        const elem = document.createElement("div");
        elem.classList.add("portfolio-image");

        const image = document.createElement("img");
        image.classList.add("image");
        image.setAttribute("src", "/assets/portfolio/" + work.filename);
        image.setAttribute("alt", work.description);
        image.setAttribute("title", work.description);

        const caption = document.createElement("span");
        caption.classList.add("caption");
        caption.textContent = work.caption;

        if(work.commission) {
            elem.classList.add("commissioned");

            let commissioner = document.createElement("div");
            let commissionerName;
            if(work.commissionerLink == null) {
                commissionerName = document.createElement("span");
            } else {
                commissionerName = document.createElement("a");
                commissionerName.setAttribute("href", work.commissionerLink);
            }
            commissioner.classList.add("commissioner");
            commissionerName.textContent = work.commissioner ?? "an anonymous person";
            commissionerName.classList.add("commissioner-name");

            commissioner.appendChild(commissionerName);

            const commissionType = document.createElement("span");
            commissionType.classList.add("commission-type");
            commissionType.textContent = work.commissionType;

            elem.appendChild(commissionType);
            elem.appendChild(image);
            elem.appendChild(caption);
            elem.appendChild(commissioner);
            commissionPieces.appendChild(elem);
        } else {
            elem.appendChild(image);
            elem.appendChild(caption);
            generalArt.appendChild(elem);
        }
    }
})