/**
 * @fileoverview Aurum West Trip Core Interactive Engineering Script
 * @version 1.8.0 (Dynamic Routing Engine Added)
 */

/* ==========================================================================
   1. MAP INITIALIZATION ENGINE
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

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
    maxZoom: 19,
    updateWhenIdle: false,
    updateWhenZooming: true
}).addTo(map);

/* ==========================================================================
   2. CORE SYSTEM COORDINATES DATABANK
   ========================================================================== */
const koordinat = {
    // Start Points
    juanda: [-7.383739, 112.775601],
    unair: [-7.271968, 112.758728],
    gubeng: [-7.265203, 112.751953],

    // Transit Halte Baru
    halteptc: [-7.288795, 112.677660],
    haltesma4: [-7.265448, 112.755471],
    haltehockey: [-7.267510, 112.756453],

    // Destinations
    natura: [-7.274912, 112.668706],
    ptc: [-7.289188, 112.675658],
    gwalk: [-7.283774, 112.656825],

    // Culinary
    rustic: [-7.274754, 112.667639],
    mcd: [-7.287999, 112.678694],
    bangali: [-7.276392, 112.683129],
    joyoboyo: [-7.298759, 112.734006],
    paksadak: [-7.291705, 112.721814],
    semanggi: [-7.266114, 112.647123],

    // Emergency
    soetomo: [-7.268086, 112.758055],
    ciputra: [-7.280919, 112.634633],
    mitra: [-7.362625, 112.728524],
    tandes: [-7.276593, 112.684078],
    polda: [-7.322356, 112.730712],
    lakarsantri: [-7.276200, 112.637701],
    pemadam: [-7.294477, 112.671463],
    pmkcitra: [-7.287947, 112.635783],
    pmkuptd: [-7.314116, 112.695786]
};

const dataInfo = {
    juanda: { label: "Juanda Airport", emoji: "✈️", desc: "Aurum Pick-up Hub (Airport Terminal)" },
    unair: { label: "UNAIR Campus B", emoji: "🎓", desc: "Aurum Pick-up Point (Education Hub)" },
    gubeng: { label: "Gubeng Station", emoji: "🚂", desc: "Main Railway Station Pick-up" },
    halteptc: { label: "Halte PTC", emoji: "🚏", desc: "Transit Stop at Pakuwon Trade Center" },
    haltesma4: { label: "Halte SMA 4", emoji: "🚏", desc: "Transit Stop near SMA 4 Surabaya" },
    haltehockey: { label: "Halte Lapangan Hockey", emoji: "🚏", desc: "Transit Stop at Lapangan Hockey" },
    ptc: { label: "Pakuwon Trade Center", emoji: "🛍️", desc: "Urban Shopping & Lifestyle Center" },
    natura: { label: "Graha Natura Park", emoji: "🌳", desc: "Green Nature Park & Lakeside" },
    gwalk: { label: "G-Walk Citraland", emoji: "🍴", desc: "Culinary Night Market Center" },
    rustic: { label: "Rustic Market Café", emoji: "☕", desc: "Where Rustic Charm Meets Urban Taste." },
    mcd: { label: "McDonald's Graha Famili", emoji: "🍔", desc: "24/7 Fast Food Services" },
    bangali: { label: "Penyetan Bang Ali", emoji: "🍛", desc: "Legendary Local Traditional Food" },
    joyoboyo: { label: "Soto Seger Joyoboyo", emoji: "🍲", desc: "Legendary Local Fresh Soto" },
    paksadak: { label: "Tahu Campur Pak Sadak", emoji: "🍛", desc: "Authentic Local Tahu Campur" },
    semanggi: { label: "Kampung Semanggi", emoji: "🥗", desc: "Traditional Surabaya Semanggi Village" },
    soetomo: { label: "Dr. Soetomo Hospital", emoji: "🏥", desc: "24/7 Main Emergency General Hospital" },
    ciputra: { label: "Ciputra Hospital", emoji: "🏥", desc: "West Surabaya Advanced Emergency Center" },
    mitra: { label: "Mitra Keluarga Waru", emoji: "🏥", desc: "24/7 Comprehensive Medical Emergency" },
    tandes: { label: "Tandes Police Station", emoji: "👮", desc: "24/7 Civil Security & District Protection" },
    polda: { label: "Polda Jatim", emoji: "👮", desc: "East Java Regional Police HQ" },
    lakarsantri: { label: "Polsek Lakarsantri", emoji: "👮", desc: "District Police Security" },
    pemadam: { label: "Fire Station Pakuwon Indah", emoji: "🚒", desc: "Emergency Fire Control & Disaster Rescue" },
    pmkcitra: { label: "PMK Citraland", emoji: "🚒", desc: "Citraland Fire Rescue Unit" },
    pmkuptd: { label: "PMK UPTD IV Surabaya", emoji: "🚒", desc: "Regional Fire Rescue" }
};

const allMarkers = {};
let userMarker = null;

const popupConfig = { autoPan: false, keepInView: false, closeButton: true, offset: [0, -28], maxWidth: 220, minWidth: 140, className: 'compact-popup' };

/* ==========================================================================
   3. DYNAMIC ROUTING ENGINE (BARU)
   ========================================================================== */
// Array Rute Navigasi
const routes = {
    // Rute Default (Hanya 3 Destinasi Utama)
    default: [ koordinat.ptc, koordinat.natura, koordinat.gwalk ],
    // Rute Juanda -> PTC -> Natura -> Gwalk
    juanda: [ koordinat.juanda, koordinat.ptc, koordinat.natura, koordinat.gwalk ],
    // Rute Gubeng -> Halte SMA 4 -> PTC -> Natura -> Gwalk
    gubeng: [ koordinat.gubeng, koordinat.haltesma4, koordinat.ptc, koordinat.natura, koordinat.gwalk ],
    // Rute UNAIR -> Halte Hockey -> PTC -> Natura -> Gwalk
    unair: [ koordinat.unair, koordinat.haltehockey, koordinat.ptc, koordinat.natura, koordinat.gwalk ]
};

let activeLines = [];

function renderRoute(routeKey) {
    // Hapus garis yang ada di peta saat ini
    activeLines.forEach(line => map.removeLayer(line));
    activeLines = [];

    const path = routes[routeKey] || routes.default;

    // Render Garis Bayangan (Shadow)
    const shadowLine = L.polyline(path, {
        color: '#111111', opacity: 0.2, weight: 8, interactive: false
    }).addTo(map);

    // Render Garis Emas (Main Line)
    const mainLine = L.polyline(path, {
        color: '#d4af37', opacity: 0.9, weight: 5, dashArray: '10, 12', interactive: false
    }).addTo(map);

    activeLines.push(shadowLine, mainLine);
}

// Fitur Tombol General Overview
function resetOverview() {
    renderRoute('default');
    
    // Auto Zoom agar 3 destinasi utama pas di tengah layar
    map.flyToBounds(L.polyline(routes.default).getBounds(), { padding: [60, 60], duration: 1.2 });
    
    document.querySelectorAll('.card-item, .sub-card-item').forEach(c => c.classList.remove('active-card'));
}

/* ==========================================================================
   4. TWOWAY INTERACTIVE SINKING
   ========================================================================== */
function highlightSidebar(key) {
    const id = 'item-' + key;
    const item = document.getElementById(id);
    if (!item) return;

    const tabContent = item.closest('.tab-content');
    if (tabContent && !tabContent.classList.contains('active-content')) {
        const tabId = tabContent.id === 'tab-jemput' ? 'jemput' : 'tour';
        gantiTab(tabId);
    }

    const accordionContent = item.closest('.accordion-content');
    if (accordionContent) {
        if (!accordionContent.style.maxHeight || accordionContent.style.maxHeight === "0px") {
            const header = accordionContent.previousElementSibling;
            const arrow = header.querySelector('.arrow');
            accordionContent.style.paddingTop = "10px";
            accordionContent.style.paddingBottom = "10px";
            accordionContent.style.maxHeight = accordionContent.scrollHeight + 50 + "px";
            if (arrow) arrow.style.transform = "rotate(180deg)";
        }
    }

    document.querySelectorAll('.card-item, .sub-card-item').forEach(c => c.classList.remove('active-card'));
    item.classList.add('active-card');

    setTimeout(() => { item.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
}

function bindMarkerEvent(marker, key) {
    marker.on('click', () => {
        highlightSidebar(key);
        map.flyTo(koordinat[key], 15.5, { animate: true, duration: 0.8 });
        
        // Cek jika Start Point ditekan, render rute secara otomatis
        if (routes[key]) renderRoute(key);
    });
}

/* ==========================================================================
   5. MARKER CREATORS
   ========================================================================== */
function createPickupMarker(key) {
    const html = `<div class="pickup-marker-container"><div class="pickup-pulse"></div><div class="pickup-badge">${dataInfo[key].emoji}</div></div>`;
    const icon = L.divIcon({ html: html, className: '', iconSize: [36, 36], iconAnchor: [18, 18] });
    allMarkers[key] = L.marker(koordinat[key], { icon: icon }).addTo(map)
        .bindPopup(`<h4>${dataInfo[key].label}</h4><p>${dataInfo[key].desc}</p>`, popupConfig);
    bindMarkerEvent(allMarkers[key], key);
}

function createDestinationMarker(key) {
    const html = `<div class="dest-marker-container"><div class="dest-glow"></div><div class="dest-badge">${dataInfo[key].emoji}</div></div>`;
    const icon = L.divIcon({ html: html, className: '', iconSize: [36, 36], iconAnchor: [18, 18] });
    allMarkers[key] = L.marker(koordinat[key], { icon: icon }).addTo(map)
        .bindPopup(`<h4>${dataInfo[key].label}</h4><p>${dataInfo[key].desc}</p>`, popupConfig);
    bindMarkerEvent(allMarkers[key], key);
}

function createFoodMarker(key) {
    const html = `<div class="food-marker-container"><div class="food-pulse"></div><div class="food-badge">${dataInfo[key].emoji}</div></div>`;
    const icon = L.divIcon({ html: html, className: '', iconSize: [32, 32], iconAnchor: [16, 16] });
    allMarkers[key] = L.marker(koordinat[key], { icon: icon }).addTo(map)
        .bindPopup(`<h4>${dataInfo[key].label}</h4><p>${dataInfo[key].desc}</p>`, popupConfig);
    bindMarkerEvent(allMarkers[key], key);
}

function createEmergencyMarker(key) {
    const html = `<div class="emergency-marker-container"><div class="emergency-pulse"></div><div class="emergency-badge">${dataInfo[key].emoji}</div></div>`;
    const icon = L.divIcon({ html: html, className: '', iconSize: [32, 32], iconAnchor: [16, 16] });
    allMarkers[key] = L.marker(koordinat[key], { icon: icon }).addTo(map)
        .bindPopup(`<h4>${dataInfo[key].label}</h4><p>${dataInfo[key].desc}</p>`, popupConfig);
    bindMarkerEvent(allMarkers[key], key);
}

/* ==========================================================================
   6. RENDER MARKERS & INITIAL ROUTE
   ========================================================================== */
['juanda', 'unair', 'gubeng', 'halteptc', 'haltesma4', 'haltehockey'].forEach(k => createPickupMarker(k));
['natura', 'ptc', 'gwalk'].forEach(k => createDestinationMarker(k));
['rustic', 'mcd', 'bangali', 'joyoboyo', 'paksadak', 'semanggi'].forEach(k => createFoodMarker(k));
['soetomo', 'ciputra', 'mitra', 'tandes', 'pemadam', 'polda', 'lakarsantri', 'pmkcitra', 'pmkuptd'].forEach(k => createEmergencyMarker(k));

// Gambar rute default saat pertama buka web
renderRoute('default'); 

/* ==========================================================================
   7. CORE GEOLOCATION CONTROL
   ========================================================================== */
function temukanLokasiSaya() {
    if (!navigator.geolocation) { alert("GPS device access interface not supported."); return; }
    const btn = document.getElementById('locate-btn');
    btn.innerHTML = "⏳";
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            if (userMarker) map.removeLayer(userMarker);

            const liveHtml = `<div class="user-marker-container"><div class="user-pulse"></div><div class="user-badge"></div></div>`;
            const liveIcon = L.divIcon({ html: liveHtml, className: '', iconSize: [30, 30], iconAnchor: [15, 15] });

            userMarker = L.marker([userLat, userLng], { icon: liveIcon }).addTo(map)
                .bindPopup(`<h4>Your Location</h4><p>GPS tracking parsed successfully.</p>`, popupConfig).openPopup();

            map.flyTo([userLat, userLng], 15.5, { animate: true, duration: 2.5 });
            btn.innerHTML = "📍";
        },
        () => { btn.innerHTML = "📍"; alert("Unable to access GPS."); },
        { enableHighAccuracy: true, timeout: 8000 }
    );
}

/* ==========================================================================
   8. UI INTERACTIONS
   ========================================================================== */
function fokusKeLokasi(lat, lng, zoom, id) {
    map.flyTo([lat, lng], zoom, { animate: true, duration: 0.8 }); 
    const key = id.replace('item-', '');
    setTimeout(() => { if (allMarkers[key]) allMarkers[key].openPopup(); }, 850);

    document.querySelectorAll('.card-item, .sub-card-item').forEach(c => c.classList.remove('active-card'));
    document.getElementById(id).classList.add('active-card');
    
    // Cek jika Start Point ditekan di sidebar, render rute
    if (routes[key]) renderRoute(key);
}

function gantiTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active-content'));

    if(tab === 'jemput') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('tab-jemput').classList.add('active-content');
    } else {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('tab-tour').classList.add('active-content');
    }
}

function toggleAccordion(id) {
    const content = document.getElementById(id);
    const header = content.previousElementSibling;
    const arrow = header.querySelector('.arrow');

    if(content.style.maxHeight && content.style.maxHeight !== "0px") {
        content.style.maxHeight = "0px";
        content.style.paddingTop = "0px";
        content.style.paddingBottom = "0px";
        arrow.style.transform = "rotate(0deg)";
    } else {
        content.style.paddingTop = "10px";
        content.style.paddingBottom = "10px";
        content.style.maxHeight = content.scrollHeight + 50 + "px";
        arrow.style.transform = "rotate(180deg)";
    }
}

setTimeout(() => { map.invalidateSize(); }, 500);