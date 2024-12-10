document.addEventListener('DOMContentLoaded', function () {
    const uploadButton = document.getElementById('uploadButton');
    const uploadPanel = document.getElementById('uploadPanel');
    const closeUploadPanel = document.getElementById('closeUploadPanel');
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('design');
    const cursor = document.querySelector('.cursor');

    // Actualizar etiqueta del archivo
    fileInput.addEventListener('change', function (e) {
        const fileName = e.target.files[0]?.name || 'Agregar diseño (Imagen o PDF)';
        document.querySelector('.file-input label').textContent = fileName;
    });

    // Mover cursor personalizado
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // Enviar formulario
    uploadForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(e.target);
    try {
        const response = await fetch('/send-email', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Diseño enviado con éxito');
        } else {
            alert('Error al enviar el diseño');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
});

    // Mostrar panel de subida
    uploadButton.addEventListener('click', function (e) {
        e.preventDefault();
        uploadPanel.style.display = 'flex';
    });

    // Cerrar panel de subida
    closeUploadPanel.addEventListener('click', function () {
        uploadPanel.style.display = 'none';
    });

    // Cerrar panel al hacer clic fuera del contenido
    uploadPanel.addEventListener('click', function (e) {
        if (e.target === uploadPanel) {
            uploadPanel.style.display = 'none';
        }
    });

    // Animaciones de cursor personalizado
    document.querySelectorAll('.nav-button, .logo, .design-button, .file-input label').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            cursor.style.borderColor = 'rgba(0, 0, 0, 0.5)';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'transparent';
            cursor.style.borderColor = 'black';
        });
    });
});
