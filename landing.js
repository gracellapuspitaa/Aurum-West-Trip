/**
 * File: landing.js
 * Berisi logika untuk smooth scroll dan popup gallery modal
 */

// 1. Logika Smooth Scroll untuk tombol Explore
const btnExplore = document.querySelector('.btn-explore');
if (btnExplore) {
    btnExplore.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
}

// 2. Logika Popup Modal Gallery
const cards = document.querySelectorAll('.card');
const modal = document.getElementById('cardModal');
const closeModalBtn = document.querySelector('.close-modal');

const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalGalleryImg = document.getElementById('modalGalleryImg');

const prevImgBtn = document.querySelector('.prev-img-btn');
const nextImgBtn = document.querySelector('.next-img-btn');

let currentCardImages = [];
let currentImgIndex = 0;

function updateModalImage() {
    if(currentCardImages.length > 0) {
        modalGalleryImg.src = currentCardImages[currentImgIndex];
    }
}

function openModal(card) {
    modalTitle.innerText = card.getAttribute('data-title') || "Title";
    modalDesc.innerText = card.getAttribute('data-desc') || "Description unavailable.";
    
    try {
        currentCardImages = JSON.parse(card.getAttribute('data-images'));
    } catch(e) {
        currentCardImages = ["https://placehold.co/600x800/222/d4af37?text=No+Image"];
    }

    currentImgIndex = 0;
    updateModalImage();

    if(currentCardImages.length <= 1) {
        prevImgBtn.style.display = 'none';
        nextImgBtn.style.display = 'none';
    } else {
        prevImgBtn.style.display = 'flex';
        nextImgBtn.style.display = 'flex';
    }

    modal.classList.add('show-modal');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('show-modal');
    document.body.style.overflow = 'auto';
}

// Pasang event listener ke semua kartu
cards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
});

if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

if (modal) {
    modal.addEventListener('click', (e) => {
        if(e.target === modal) closeModal();
    });
}

if (prevImgBtn) {
    prevImgBtn.addEventListener('click', () => {
        currentImgIndex = (currentImgIndex > 0) ? currentImgIndex - 1 : currentCardImages.length - 1;
        updateModalImage();
    });
}

if (nextImgBtn) {
    nextImgBtn.addEventListener('click', () => {
        currentImgIndex = (currentImgIndex < currentCardImages.length - 1) ? currentImgIndex + 1 : 0;
        updateModalImage();
    });
}