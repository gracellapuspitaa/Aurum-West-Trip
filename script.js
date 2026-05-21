/* ==========================================================================
   1. MAP INITIALIZATION
   ========================================================================== */

const map = L.map('map', {
    fadeAnimation: true,
    zoomAnimation: true,
    markerZoomAnimation: true,
    inertia: true,
    inertiaWarmupRatio: 0.1,
    inertiaMaxSpeed: 2000,
    zoomSnap: 0.25
}).setView([-7.3000, 112.7100], 12);

// Menggunakan Carto Positron agar pemuatan aset ubin peta instan & anti lag
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    updateWhenIdle: false,
    updateWhenZooming: true
}).addTo(map);

/* ==========================================================================
   2. DATA
   ========================================================================== */

const koordinat = {

    juanda: [-7.3797, 112.7885],
    unair: [-7.2721345, 112.7586672],
    gubeng: [-7.2654, 112.7519],

    ptc: [-7.2886, 112.6766],
    natura: [-7.275400, 112.669000],
    gwalk: [-7.2891, 112.6441],

    rustic: [-7.274730, 112.667514],
    mcd: [-7.288187, 112.678730],

    rawon: [-7.2590943, 112.7352172],

    soetomo: [-7.2678, 112.7576],
    ciputra: [-7.2818, 112.6475],
    tandes: [-7.2612, 112.6710]
};

const dataInfo = {

    juanda: {
        label: "Bandara Juanda",
        desc: "Aurum Pick-up Hub (Airport Terminal)"
    },

    unair: {
        label: "Kampus B UNAIR",
        desc: "Aurum Pick-up Point (Education Area)"
    },

    gubeng: {
        label: "Stasiun Gubeng",
        desc: "Aurum Pick-up Point (Railway Station)"
    },

    ptc: {
        label: "Pakuwon Trade Center",
        emoji: "🛍️",
        desc: "Modern Shopping Mall"
    },

    natura: {
        label: "Graha Natura Park",
        emoji: "🌳",
        desc: "Green Nature Park & Lakeside"
    },

    gwalk: {
        label: "G-Walk",
        emoji: "🍴",
        desc: "Popular West Surabaya Culinary"
    },

    rustic: {
        label: "Rustic Market Café",
        emoji: "☕",
        desc: "Where Rustic Charm Meets Urban Taste."
    },

    mcd: {
        label: "McDonald's Graha Famili",
        emoji: "🍔",
        desc: "Late Night? McD's Time"
    },

    rawon: {
        label: "Rawon Setan",
        emoji: "🍲",
        desc: "Kuliner Rawon Legendaris"
    },

    soetomo: {
        label: "RSUD Dr. Soetomo",
        emoji: "🏥",
        desc: "UGD 24 Jam"
    },

    ciputra: {
        label: "Ciputra Hospital Surabaya",
        emoji: "🏥",
        desc: "UGD Surabaya Barat"
    },

    tandes: {
        label: "Polsek Tandes",
        emoji: "👮",
        desc: "Keamanan 24 Jam"
    }
};

const allMarkers = {};
let userMarker = null;

/* ==========================================================================
   3. POPUP CONFIG
   ========================================================================== */

const popupConfig = {

    autoPan: false,
    keepInView: false,

    closeButton: true,

    offset: [0, -28],

    maxWidth: 220,
    minWidth: 140,

    className: 'compact-popup'
};

/* ==========================================================================
   4. LABEL MARKER
   ========================================================================== */

function createLabelMarker(key) {

    const html = `
        <div class="label-marker-container">
            <div class="label-box">${dataInfo[key].label}</div>
            <div class="label-arrow"></div>
        </div>
    `;

    const icon = L.divIcon({
        html: html,
        className: '',
        iconSize: [110, 40],
        iconAnchor: [55, 40]
    });

    allMarkers[key] = L.marker(
        koordinat[key],
        { icon: icon }
    )
    .addTo(map)
    .bindPopup(`
        <h4>${dataInfo[key].label}</h4>
        <p>${dataInfo[key].desc}</p>
    `, popupConfig);
}

/* ==========================================================================
   5. DESTINATION MARKER
   ========================================================================== */

function createDestinationMarker(key) {

    const html = `
        <div class="dest-marker-container">
            <div class="dest-glow"></div>
            <div class="dest-badge">${dataInfo[key].emoji}</div>
        </div>
    `;

    const icon = L.divIcon({
        html: html,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
    });

    allMarkers[key] = L.marker(
        koordinat[key],
        { icon: icon }
    )
    .addTo(map)
    .bindPopup(`
        <h4>${dataInfo[key].label}</h4>
        <p>${dataInfo[key].desc}</p>
    `, popupConfig);
}

/* ==========================================================================
   6. FOOD MARKER
   ========================================================================== */

function createFoodMarker(key) {

    const html = `
        <div class="food-marker-container">
            <div class="food-pulse"></div>
            <div class="food-badge">${dataInfo[key].emoji}</div>
        </div>
    `;

    const icon = L.divIcon({
        html: html,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    allMarkers[key] = L.marker(
        koordinat[key],
        { icon: icon }
    )
    .addTo(map)
    .bindPopup(`
        <h4>${dataInfo[key].label}</h4>
        <p>${dataInfo[key].desc}</p>
    `, popupConfig);
}

/* ==========================================================================
   7. EMERGENCY MARKER
   ========================================================================== */

function createEmergencyMarker(key) {

    const html = `
        <div class="emergency-marker-container">
            <div class="emergency-pulse"></div>
            <div class="emergency-badge">${dataInfo[key].emoji}</div>
        </div>
    `;

    const icon = L.divIcon({
        html: html,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    allMarkers[key] = L.marker(
        koordinat[key],
        { icon: icon }
    )
    .addTo(map)
    .bindPopup(`
        <h4>${dataInfo[key].label}</h4>
        <p>${dataInfo[key].desc}</p>
    `, popupConfig);
}

/* ==========================================================================
   8. RENDER MARKERS
   ========================================================================== */

['juanda', 'unair', 'gubeng']
.forEach(k => createLabelMarker(k));

['ptc', 'natura', 'gwalk']
.forEach(k => createDestinationMarker(k));

['rustic', 'mcd', 'rawon']
.forEach(k => createFoodMarker(k));

['soetomo', 'ciputra', 'tandes']
.forEach(k => createEmergencyMarker(k));

/* ==========================================================================
   9. ROUTE
   ========================================================================== */

const jalurDestinasi = [
    koordinat.ptc,
    koordinat.natura,
    koordinat.gwalk
];

L.polyline(jalurDestinasi, {
    color: '#111111',
    opacity: 0.1,
    weight: 8,
    interactive: false
}).addTo(map);

L.polyline(jalurDestinasi, {
    color: '#d4af37',
    opacity: 0.9,
    weight: 5,
    className: 'aurum-smooth-line',
    interactive: false
}).addTo(map);

/* ==========================================================================
   10. GEOLOCATION
   ========================================================================== */

function temukanLokasiSaya() {

    if (!navigator.geolocation) {
        alert("Browser tidak mendukung GPS.");
        return;
    }

    const btn = document.getElementById('locate-btn');

    btn.innerHTML = "⏳";

    navigator.geolocation.getCurrentPosition(

        (position) => {

            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            if (userMarker) {
                map.removeLayer(userMarker);
            }

            const liveHtml = `
                <div class="user-marker-container">
                    <div class="user-pulse"></div>
                    <div class="user-badge"></div>
                </div>
            `;

            const liveIcon = L.divIcon({
                html: liveHtml,
                className: '',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            userMarker = L.marker(
                [userLat, userLng],
                { icon: liveIcon }
            )
            .addTo(map)
            .bindPopup(`
                <h4>Lokasi Kamu</h4>
                <p>GPS berhasil ditemukan.</p>
            `, popupConfig)
            .openPopup();

            map.flyTo(
                [userLat, userLng],
                15.5,
                {
                    animate: true,
                    duration: 2.5
                }
            );

            btn.innerHTML = "📍";
        },

        () => {

            btn.innerHTML = "📍";

            alert("GPS gagal diakses.");
        },

        {
            enableHighAccuracy: true,
            timeout: 8000
        }
    );
}

/* ==========================================================================
   11. FOCUS LOCATION
   ========================================================================== */

function fokusKeLokasi(lat, lng, zoom, id) {

    map.setView(
        [lat, lng],
        zoom,
        {
            animate: true,
            duration: 0.4
        }
    );

    const key = id.replace('item-', '');

    setTimeout(() => {

        if (allMarkers[key]) {
            allMarkers[key].openPopup();
        }

    }, 450);

    document
        .querySelectorAll('.card-item, .sub-card-item')
        .forEach(c => c.classList.remove('active-card'));

    document
        .getElementById(id)
        .classList.add('active-card');
}

/* ==========================================================================
   12. TAB SYSTEM
   ========================================================================== */

function gantiTab(tab) {

    document
        .querySelectorAll('.tab-btn')
        .forEach(b => b.classList.remove('active'));

    document
        .querySelectorAll('.tab-content')
        .forEach(c => c.classList.remove('active-content'));

    if(tab === 'jemput') {

        document.querySelectorAll('.tab-btn')[0]
        .classList.add('active');

        document.getElementById('tab-jemput')
        .classList.add('active-content');

    } else {

        document.querySelectorAll('.tab-btn')[1]
        .classList.add('active');

        document.getElementById('tab-tour')
        .classList.add('active-content');
    }
}

/* ==========================================================================
   13. ACCORDION
   ========================================================================== */

function toggleAccordion(id) {

    const content = document.getElementById(id);

    const header = content.previousElementSibling;

    const arrow = header.querySelector('.arrow');

    if(content.style.maxHeight &&
       content.style.maxHeight !== "0px") {

        content.style.maxHeight = "0px";

        content.style.paddingTop = "0px";
        content.style.paddingBottom = "0px";

        arrow.style.transform = "rotate(0deg)";

    } else {

        content.style.paddingTop = "10px";
        content.style.paddingBottom = "10px";

        content.style.maxHeight =
            content.scrollHeight + 20 + "px";

        arrow.style.transform = "rotate(180deg)";
    }
}