document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.cursor');
    const coleccionBtn = document.getElementById('coleccionBtn');
    const collectionsContainer = document.getElementById('collectionsContainer');
    const banner = document.getElementById('banner');
    const bannerImages = document.querySelectorAll('.banner-image');

    // Cursor personalizado
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Efecto hover para los enlaces de navegación de la tienda
    document.querySelectorAll('.store-nav-link').forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.backgroundColor = 'rgba(0,0,0,0.1)';
            cursor.style.borderColor = 'rgba(0,0,0,0.5)';
        });

        link.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'transparent';
            cursor.style.borderColor = 'black';
        });
    });
    document.querySelectorAll('.nav-button').forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            cursor.style.borderColor = 'rgba(0, 0, 0, 0.5)';
        });
        

        link.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'transparent';
            cursor.style.borderColor = 'black';
        });
    });
    document.querySelectorAll('.logo').forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            cursor.style.borderColor = 'rgba(0, 0, 0, 0.5)';
        });
        

        link.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'transparent';
            cursor.style.borderColor = 'black';
        });
    });

    // Manejo del botón de Colección
    coleccionBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (collectionsContainer.classList.contains('show')) {
            collectionsContainer.classList.remove('show');
            banner.classList.remove('hide');
        } else {
            collectionsContainer.classList.add('show');
            banner.classList.add('hide');
        }
    });

    // Rotación del banner
    let currentBannerIndex = 0;
    
    function rotateBanner() {
        bannerImages[currentBannerIndex].classList.remove('active');
        currentBannerIndex = (currentBannerIndex + 1) % bannerImages.length;
        bannerImages[currentBannerIndex].classList.add('active');
    }

    setInterval(rotateBanner, 5000);
});

