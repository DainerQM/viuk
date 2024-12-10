document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.cursor');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const payButton = document.getElementById('payButton');
    const modal = document.getElementById('paymentModal');
    const closeModal = document.querySelector('.close');
    const paymentForm = document.getElementById('paymentForm');

    // Cursor personalizado
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    // Función para renderizar los items del carrito
    function renderCartItems() {
        cartItems.innerHTML = '';
        let total = 0;

        cartData.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.designer}</td>
                <td>${item.size}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td><button class="remove-btn" data-id="${item.id}">Eliminar</button></td>
            `;
            cartItems.appendChild(row);
        });

        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Mostrar modal de pago
    payButton.addEventListener('click', () => {
        modal.style.display = "block";
    });

    // Cerrar modal
    closeModal.addEventListener('click', () => {
        modal.style.display = "none";
    });

    // Cerrar modal al hacer clic fuera de él
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // Manejar envío del formulario de pago
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
    
        const fullName = document.getElementById('fullName').value;
        const docType = document.getElementById('docType').value;
        const docNumber = document.getElementById('docNumber').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
    
        if (!fullName || !docType || !docNumber || !email || !phone) {
            alert("Todos los campos son obligatorios.");
            return;
        }
    
        fetch('/procesar_pago', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fullName, docType, docNumber, email, phone }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert(data.mensaje);
                    modal.style.display = "none";
                    location.reload(); // Refresca la página para vaciar el carrito
                }
            })
            .catch(error => console.error('Error al procesar el pago:', error));
    });
    

    // Renderizar items iniciales
    renderCartItems();

    // Funcionalidad para agregar al carrito
    document.addEventListener('DOMContentLoaded', function() {
        const agregarCarritoBtn = document.getElementById('agregarCarrito');
    
        if (agregarCarritoBtn) {
            agregarCarritoBtn.addEventListener('click', function() {
                const productoId = agregarCarritoBtn.getAttribute('data-id');
    
                // Realizar la solicitud AJAX para agregar el producto al carrito
                fetch('/agregar_al_carrito', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: productoId })
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.mensaje); // Muestra un mensaje de confirmación
                    // Actualizar el contador del carrito si es necesario
                    // Por ejemplo, si tienes un contador de productos en el carrito:
                    // document.getElementById('cartCount').textContent = data.carrito_count;
                })
                .catch(error => {
                    console.error('Error al agregar al carrito:', error);
                });
            });
        }
    });
});

