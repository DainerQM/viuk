from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os
from tiendas import obtener_productos_sancheztore
from diseñadores import obtener_productos_veruzka
from shop import obtener_productos_nuevo, obtener_productos_oferta, obtener_productos_popular

app = Flask(__name__)

# Configuración de Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'dainer.0226qm@gmail.com'  # Cambiar por tu correo
app.config['MAIL_PASSWORD'] = 'zorq jrxm aftf fdgv'   # Contraseña de la app
app.config['MAIL_DEFAULT_SENDER'] = 'viukropa@gmail.com'

mail = Mail(app)
# Ruta para la página principal
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/estandar")
def estandar():
    sancheztore = obtener_productos_sancheztore()
    return render_template("estandar.html",
                           sancheztore = sancheztore)

@app.route("/designers")
def designers():
    veruzka = obtener_productos_veruzka()
    return render_template("designers.html",
                           veruzka = veruzka)

@app.route("/design")
def design():
    return render_template("design.html")

@app.route("/shop")
def shop():
    shop = obtener_productos_nuevo() + obtener_productos_oferta() + obtener_productos_popular()
    return render_template("shop.html", shop = shop)

@app.route("/visor/<int:id>")
def view(id):
    disenos = obtener_productos_sancheztore() + obtener_productos_veruzka() + obtener_productos_nuevo() + obtener_productos_oferta() + obtener_productos_popular()
    diseno = next((d for d in disenos if d["id"] == id), None)

    if diseno is None:
        return "Diseño no encontrado", 404
    return render_template("visor.html", diseno=diseno)

# Carrito
nueva_lista = []

@app.route('/agregar', methods=['POST'])
def agregar():
    productos = obtener_productos_sancheztore() + obtener_productos_veruzka() + obtener_productos_nuevo() + obtener_productos_oferta() + obtener_productos_popular()
    data = request.json
    producto = next((prod for prod in productos if prod["id"] == data["id"]), None)
    if producto and producto not in nueva_lista:
        nueva_lista.append(producto)
    return jsonify({"success": True, "nueva_lista": nueva_lista})

@app.route('/cart')
def cart():
    total_precio = sum(prod["precio"] for prod in nueva_lista)
    return render_template("cart.html", nueva_lista=nueva_lista, total_precio=total_precio)

# Ruta para manejar el envío del formulario
@app.route('/send-email', methods=['POST'])
def send_email():
    name = request.form.get('name')
    email = request.form.get('email')
    message = request.form.get('message', 'Sin peticiones')
    file = request.files.get('file')

    if not file:
        return jsonify({'error': 'No se subió ningún archivo'}), 400

    # Guardar el archivo subido
    file_path = os.path.join('uploads', file.filename)
    file.save(file_path)

    # Configurar el mensaje de correo
    msg = Message(
        'Nuevo diseño enviado',
        recipients=['viukropa@gmail.com']
    )
    msg.body = f'''
    Nombre: {name}
    Correo/WP: {email}
    Petición: {message}
    '''
    with app.open_resource(file_path) as fp:
        msg.attach(file.filename, file.content_type, fp.read())

    # Intentar enviar el correo
    try:
        mail.send(msg)
        os.remove(file_path)  # Eliminar el archivo después de enviarlo
        return jsonify({'message': 'Correo enviado exitosamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/procesar_pago', methods=['POST'])
def procesar_pago():
    data = request.json
    nombre = data.get("fullName")
    doc_tipo = data.get("docType")  # Asegúrate de que 'doc_type' esté correctamente capturado
    doc_numero = data.get("docNumber")
    correo = data.get("email")
    telefono = data.get("phone")

    # Validar que todos los campos estén completos
    if not all([nombre, doc_tipo, doc_numero, correo, telefono]):
        return jsonify({"error": "Todos los campos son obligatorios."}), 400

    # Generar el PDF con los detalles y la lista
    detalles_pdf = "detalles_pago.pdf"
    lista_compras = {
        "email": correo,
        "phone": telefono,
        "doc_type": doc_tipo,  # Asegúrate de pasar 'doc_type' correctamente
        "doc_number": doc_numero,
        "items": nueva_lista  # Lista de productos
    }
    total_precio = sum(prod["precio"] for prod in nueva_lista)
    generar_pdf(detalles_pdf, nombre, lista_compras, total_precio)

    # Enviar el correo con el PDF
    enviar_correo(correo, "Detalles de tu pago", detalles_pdf)  # Enviar solo a un correo

    # Vaciar el carrito
    nueva_lista.clear()

    return jsonify({"mensaje": "Pedido procesado con éxito, revisa tu correo."})



def generar_pdf(nombre_archivo, nombre_comprador, lista_compras, total_precio):
    c = canvas.Canvas(nombre_archivo, pagesize=letter)
    c.setFont("Helvetica-Bold", 18)

    # Encabezado (VIUK)
    c.drawString(30, 750, "VIUK")
    c.setFont("Helvetica", 14)
    c.drawString(30, 730, "DETALLES DEL PAGO")

    # Datos Personales
    c.setFont("Helvetica", 12)
    c.drawString(30, 690, f"DATOS PERSONALES:")
    c.drawString(30, 670, f"Nombre y apellido: {nombre_comprador}")
    c.drawString(30, 650, f"Tipo de documento: {lista_compras['doc_type']}")
    c.drawString(30, 630, f"Número de documento: {lista_compras['doc_number']}")
    c.drawString(30, 610, f"Correo: {lista_compras['email']}")
    c.drawString(30, 590, f"Número de teléfono: {lista_compras['phone']}")

    # Lista de Compras
    y_position = 560
    c.setFont("Helvetica-Bold", 12)
    c.drawString(30, y_position, "LISTA DE COMPRAS:")
    y_position -= 20
    
    # Encabezado de la tabla
    c.setFont("Helvetica", 10)
    c.drawString(30, y_position, "ID")
    c.drawString(100, y_position, "NOMBRE")
    c.drawString(250, y_position, "DISEÑADOR")
    c.drawString(400, y_position, "PRECIO")
    c.drawString(500, y_position, "CANTIDAD")
    y_position -= 20
    
    # Detalles de los productos
    for item in lista_compras['items']:
        c.drawString(30, y_position, str(item['id']))
        c.drawString(100, y_position, item['nombre'])
        c.drawString(250, y_position, item['origen'])
        c.drawString(400, y_position, f"${item['precio']}")
        c.drawString(500, y_position, str(1))
        y_position -= 20
    
    # Precio total
    c.setFont("Helvetica-Bold", 12)
    c.drawString(30, y_position, f"Total: ${total_precio}")
    
    c.save()


def enviar_correo(destinatario_usuario, asunto, archivo_pdf):
    # Definir los correos a los que se enviará el mensaje
    destinatarios = ['viukropa@gmail.com', destinatario_usuario]  # Agregar el correo de la persona del formulario

    # Configurar el mensaje
    msg = Message(asunto, sender=app.config['MAIL_USERNAME'], recipients=destinatarios)
    msg.body = "Adjunto encontrarás el archivo solicitado."

    # Adjuntar el archivo PDF
    with app.open_resource(archivo_pdf) as fp:
        msg.attach(archivo_pdf, "application/pdf", fp.read())

    # Enviar el correo
    try:
        mail.send(msg)
        print("Correo enviado a los destinatarios.")
    except Exception as e:
        print(f"Error al enviar correo: {e}")


if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)
