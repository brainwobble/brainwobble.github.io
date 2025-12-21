const container = document.getElementById("service-container");
const searchInput = document.getElementById("search");

let officialServices = [];
let contributedServices = [];
let combinedServices = [];

// Load both JSON files
async function loadServices() {
    const officialRes = await fetch("data/officiallypicked.json");
    const contributedRes = await fetch("data/contributedsites.json");

    officialServices = await officialRes.json();

    // ✅ Only include verified contributed services
    contributedServices = (await contributedRes.json()).filter(s => s.verified === true);

    combinedServices = [
        ...officialServices.map(s => ({ ...s, type: "official" })),
        ...contributedServices.map(s => ({ ...s, type: "contributed" }))
    ];

    displayServices(combinedServices);
}

function displayServices(services) {
    container.innerHTML = "";

    const official = services.filter(s => s.type === "official");
    const contributed = services.filter(s => s.type === "contributed");

    if (official.length > 0) {
        container.innerHTML += `
            <h2 class="divider">Officially Picked</h2>
        `;
        official.forEach(service => container.appendChild(createCard(service)));
    }

    if (contributed.length > 0) {
        container.innerHTML += `
            <h2 class="divider">Community Contributed</h2>
        `;
        contributed.forEach(service => container.appendChild(createCard(service)));
    }
}

function createCard(service) {
    const card = document.createElement("div");
    card.className = "card";

    // ✅ Add verified badge if present
    const verifiedBadge = service.verified
        ? `<span class="verified-badge">-Verified ✅</span>`
        : "";

    card.innerHTML = `
        <h3>${service.name} ${verifiedBadge}</h3>
        <p>${service.description}</p>
        <p><a href="${service.url}" target="_blank">Visit Website</a></p>
        <div>${service.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
    `;

    return card;
}

// Search filter
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();

    const filtered = combinedServices.filter(service =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.tags.some(tag => tag.toLowerCase().includes(query))
    );

    displayServices(filtered);
});

// Start
loadServices();

// Start
loadServices();

