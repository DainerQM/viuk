from flask import Flask, render_template

sancheztore = [
    {"id": 322, "nombre": "Chaqueta amarrilla", "precio": 65, "imagen": "../static/img/tiendas/sancheztore/Dibujo1.jpg", "origen": "Sanheztore"}
]

def obtener_productos_sancheztore():
    return sancheztore
