from flask import Flask, render_template

veruzka = [
    {"id": 226, "nombre": "El viejo en el parque", "precio": 200, "imagen": "../static/img/diseñadores/VeruzkaQuiroz/ViejoEnElParque.jpg", "origen": "Veruzka Quiroz"}
]

def obtener_productos_veruzka():
    return veruzka
