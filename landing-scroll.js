document.querySelector('.btn-explore').addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    // Menggunakan window.scrollTo dengan behavior smooth
    window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'
    });
});