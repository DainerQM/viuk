function agregarProducto(id) {
    fetch("/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Producto agregado a la nueva lista.");
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.cursor');
    const sizeButtons = document.querySelectorAll('.size-button');
    const addToCartButton = document.querySelector('.add-to-cart-button');

    // Cursor personalizado
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
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

    // Efecto hover para los botones de talla
    sizeButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.backgroundColor = 'rgba(0,0,0,0.1)';
            cursor.style.borderColor = 'rgba(0,0,0,0.5)';
        });

        button.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'transparent';
            cursor.style.borderColor = 'black';
        });

        button.addEventListener('click', () => {
            sizeButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    // Efecto hover para el botón de agregar al carrito
    addToCartButton.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursor.style.backgroundColor = 'rgba(255,255,255,0.1)';
        cursor.style.borderColor = 'rgba(255,255,255,0.5)';
    });

    addToCartButton.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.backgroundColor = 'transparent';
        cursor.style.borderColor = 'black';
    });
});

