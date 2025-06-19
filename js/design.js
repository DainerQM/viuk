class ImageEditor {
  constructor() {
    this.canvas = document.getElementById("canvas")
    this.ctx = this.canvas.getContext("2d")
    this.layers = []
    this.selectedLayer = null
    this.isDragging = false
    this.dragOffset = { x: 0, y: 0 }
    this.currentTool = "text"
    this.selectedShape = "rectangle"

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.render()
  }

  setupEventListeners() {
    // Tool selection
    document.querySelectorAll(".tool-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".tool-btn").forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")
        this.currentTool = btn.dataset.tool
        this.showToolControls(this.currentTool)
      })
    })

    // Shape selection
    document.querySelectorAll(".shape-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".shape-btn").forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")
        this.selectedShape = btn.dataset.shape
      })
    })

    // Canvas events
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this))
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this))
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this))
    this.canvas.addEventListener("click", this.handleCanvasClick.bind(this))

    // Control events
    document.getElementById("addTextBtn").addEventListener("click", this.addText.bind(this))
    document.getElementById("imageInput").addEventListener("change", this.handleImageUpload.bind(this))
    document.getElementById("applyBackground").addEventListener("click", this.applyBackground.bind(this))
    document.getElementById("clearCanvas").addEventListener("click", this.clearCanvas.bind(this))
    document.getElementById("downloadImage").addEventListener("click", this.downloadImage.bind(this))

    // Range inputs
    document.getElementById("fontSize").addEventListener("input", (e) => {
      document.getElementById("fontSizeValue").textContent = e.target.value + "px"
    })

    document.getElementById("shapeSize").addEventListener("input", (e) => {
      document.getElementById("shapeSizeValue").textContent = e.target.value + "px"
    })

    document.getElementById("imageSize").addEventListener("input", (e) => {
      document.getElementById("imageSizeValue").textContent = e.target.value + "px"
    })
  }

  showToolControls(tool) {
    document.querySelectorAll(".tool-controls").forEach((control) => {
      control.style.display = "none"
    })

    const controlMap = {
      text: "textControls",
      shape: "shapeControls",
      image: "imageControls",
      color: "colorControls",
    }

    if (controlMap[tool]) {
      document.getElementById(controlMap[tool]).style.display = "block"
    }
  }

  handleMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const clickedLayer = this.getLayerAtPosition(x, y)

    if (clickedLayer) {
      this.selectedLayer = clickedLayer
      this.isDragging = true
      this.dragOffset.x = x - clickedLayer.x
      this.dragOffset.y = y - clickedLayer.y
      this.updateLayersList()
      this.showElementProperties(clickedLayer)
    } else {
      this.selectedLayer = null
      this.updateLayersList()
      this.hideElementProperties()
    }
  }

  handleMouseMove(e) {
    if (this.isDragging && this.selectedLayer) {
      const rect = this.canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      this.selectedLayer.x = x - this.dragOffset.x
      this.selectedLayer.y = y - this.dragOffset.y

      this.render()
    }
  }

  handleMouseUp(e) {
    this.isDragging = false
  }

  handleCanvasClick(e) {
    if (this.isDragging) return

    const rect = this.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (this.currentTool === "shape") {
      this.addShape(x, y)
    }
  }

  getLayerAtPosition(x, y) {
    // Check layers from top to bottom (reverse order)
    for (let i = this.layers.length - 1; i >= 0; i--) {
      const layer = this.layers[i]
      if (this.isPointInLayer(x, y, layer)) {
        return layer
      }
    }
    return null
  }

  isPointInLayer(x, y, layer) {
    switch (layer.type) {
      case "text":
        const textWidth = this.ctx.measureText(layer.text).width
        const textHeight = layer.fontSize
        return x >= layer.x && x <= layer.x + textWidth && y >= layer.y - textHeight && y <= layer.y

      case "shape":
        if (layer.shape === "rectangle") {
          return x >= layer.x && x <= layer.x + layer.size && y >= layer.y && y <= layer.y + layer.size
        } else if (layer.shape === "circle") {
          const centerX = layer.x + layer.size / 2
          const centerY = layer.y + layer.size / 2
          const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
          return distance <= layer.size / 2
        }
        break

      case "image":
        return x >= layer.x && x <= layer.x + layer.width && y >= layer.y && y <= layer.y + layer.height
    }
    return false
  }

  addText() {
    const text = document.getElementById("textInput").value
    const fontSize = Number.parseInt(document.getElementById("fontSize").value)
    const fontFamily = document.getElementById("fontFamily").value
    const color = document.getElementById("textColor").value

    if (!text.trim()) return

    const layer = {
      id: Date.now(),
      type: "text",
      text: text,
      x: 100,
      y: 100,
      fontSize: fontSize,
      fontFamily: fontFamily,
      color: color,
    }

    this.layers.push(layer)
    this.render()
    this.updateLayersList()
  }

  addShape(x, y) {
    const color = document.getElementById("shapeColor").value
    const size = Number.parseInt(document.getElementById("shapeSize").value)

    const layer = {
      id: Date.now(),
      type: "shape",
      shape: this.selectedShape,
      x: x - size / 2,
      y: y - size / 2,
      size: size,
      color: color,
    }

    this.layers.push(layer)
    this.render()
    this.updateLayersList()
  }

  handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const size = Number.parseInt(document.getElementById("imageSize").value)
        const aspectRatio = img.width / img.height

        const layer = {
          id: Date.now(),
          type: "image",
          image: img,
          x: 100,
          y: 100,
          width: size,
          height: size / aspectRatio,
        }

        this.layers.push(layer)
        this.render()
        this.updateLayersList()
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  applyBackground() {
    const color = document.getElementById("backgroundColor").value
    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.render()
  }

  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Render all layers
    this.layers.forEach((layer) => {
      this.renderLayer(layer)
    })

    // Highlight selected layer
    if (this.selectedLayer) {
      this.highlightLayer(this.selectedLayer)
    }
  }

  renderLayer(layer) {
    switch (layer.type) {
      case "text":
        this.ctx.font = `${layer.fontSize}px ${layer.fontFamily}`
        this.ctx.fillStyle = layer.color
        this.ctx.fillText(layer.text, layer.x, layer.y)
        break

      case "shape":
        this.ctx.fillStyle = layer.color
        if (layer.shape === "rectangle") {
          this.ctx.fillRect(layer.x, layer.y, layer.size, layer.size)
        } else if (layer.shape === "circle") {
          this.ctx.beginPath()
          this.ctx.arc(layer.x + layer.size / 2, layer.y + layer.size / 2, layer.size / 2, 0, 2 * Math.PI)
          this.ctx.fill()
        } else if (layer.shape === "triangle") {
          this.ctx.beginPath()
          this.ctx.moveTo(layer.x + layer.size / 2, layer.y)
          this.ctx.lineTo(layer.x, layer.y + layer.size)
          this.ctx.lineTo(layer.x + layer.size, layer.y + layer.size)
          this.ctx.closePath()
          this.ctx.fill()
        }
        break

      case "image":
        this.ctx.drawImage(layer.image, layer.x, layer.y, layer.width, layer.height)
        break
    }
  }

  highlightLayer(layer) {
    this.ctx.strokeStyle = "#3498db"
    this.ctx.lineWidth = 2
    this.ctx.setLineDash([5, 5])

    const bounds = this.getLayerBounds(layer)
    this.ctx.strokeRect(bounds.x - 5, bounds.y - 5, bounds.width + 10, bounds.height + 10)

    this.ctx.setLineDash([])
  }

  getLayerBounds(layer) {
    switch (layer.type) {
      case "text":
        const textWidth = this.ctx.measureText(layer.text).width
        return {
          x: layer.x,
          y: layer.y - layer.fontSize,
          width: textWidth,
          height: layer.fontSize,
        }

      case "shape":
        return {
          x: layer.x,
          y: layer.y,
          width: layer.size,
          height: layer.size,
        }

      case "image":
        return {
          x: layer.x,
          y: layer.y,
          width: layer.width,
          height: layer.height,
        }
    }
  }

  updateLayersList() {
    const layersList = document.getElementById("layersList")
    layersList.innerHTML = ""

    // Show layers in reverse order (top to bottom)
    ;[...this.layers].reverse().forEach((layer, index) => {
      const layerItem = document.createElement("div")
      layerItem.className = `layer-item ${this.selectedLayer === layer ? "selected" : ""}`

      const layerInfo = document.createElement("div")
      layerInfo.className = "layer-info"

      const layerName = document.createElement("div")
      layerName.textContent = this.getLayerName(layer)

      const layerType = document.createElement("div")
      layerType.className = "layer-type"
      layerType.textContent = layer.type.toUpperCase()

      layerInfo.appendChild(layerName)
      layerInfo.appendChild(layerType)

      const layerActions = document.createElement("div")
      layerActions.className = "layer-actions"

      const deleteBtn = document.createElement("button")
      deleteBtn.className = "layer-btn"
      deleteBtn.textContent = "🗑"
      deleteBtn.onclick = (e) => {
        e.stopPropagation()
        this.deleteLayer(layer)
      }

      layerActions.appendChild(deleteBtn)

      layerItem.appendChild(layerInfo)
      layerItem.appendChild(layerActions)

      layerItem.onclick = () => {
        this.selectedLayer = layer
        this.updateLayersList()
        this.showElementProperties(layer)
        this.render()
      }

      layersList.appendChild(layerItem)
    })
  }

  getLayerName(layer) {
    switch (layer.type) {
      case "text":
        return layer.text.substring(0, 20) + (layer.text.length > 20 ? "..." : "")
      case "shape":
        return layer.shape.charAt(0).toUpperCase() + layer.shape.slice(1)
      case "image":
        return "Imagen"
      default:
        return "Elemento"
    }
  }

  deleteLayer(layer) {
    const index = this.layers.indexOf(layer)
    if (index > -1) {
      this.layers.splice(index, 1)
      if (this.selectedLayer === layer) {
        this.selectedLayer = null
        this.hideElementProperties()
      }
      this.render()
      this.updateLayersList()
    }
  }

  showElementProperties(layer) {
    const propertiesPanel = document.getElementById("elementProperties")
    propertiesPanel.innerHTML = ""

    const title = document.createElement("h5")
    title.textContent = `Propiedades - ${this.getLayerName(layer)}`
    propertiesPanel.appendChild(title)

    // Position controls
    const positionGroup = document.createElement("div")
    positionGroup.innerHTML = `
            <label>Posición X:</label>
            <input type="number" id="layerX" value="${Math.round(layer.x)}">
            <label>Posición Y:</label>
            <input type="number" id="layerY" value="${Math.round(layer.y)}">
        `
    propertiesPanel.appendChild(positionGroup)

    // Type-specific controls
    if (layer.type === "text") {
      const textGroup = document.createElement("div")
      textGroup.innerHTML = `
                <label>Texto:</label>
                <input type="text" id="layerText" value="${layer.text}">
                <label>Tamaño:</label>
                <input type="range" id="layerFontSize" min="12" max="72" value="${layer.fontSize}">
                <label>Color:</label>
                <input type="color" id="layerColor" value="${layer.color}">
                <label>Fuente:</label>
                <select id="layerFontFamily">
                    <option value="Arial" ${layer.fontFamily === "Arial" ? "selected" : ""}>Arial</option>
                    <option value="Georgia" ${layer.fontFamily === "Georgia" ? "selected" : ""}>Georgia</option>
                    <option value="Times New Roman" ${layer.fontFamily === "Times New Roman" ? "selected" : ""}>Times New Roman</option>
                    <option value="Courier New" ${layer.fontFamily === "Courier New" ? "selected" : ""}>Courier New</option>
                    <option value="Verdana" ${layer.fontFamily === "Verdana" ? "selected" : ""}>Verdana</option>
                </select>
            `
      propertiesPanel.appendChild(textGroup)
    } else if (layer.type === "shape") {
      const shapeGroup = document.createElement("div")
      shapeGroup.innerHTML = `
                <label>Tamaño:</label>
                <input type="range" id="layerSize" min="20" max="200" value="${layer.size}">
                <label>Color:</label>
                <input type="color" id="layerColor" value="${layer.color}">
            `
      propertiesPanel.appendChild(shapeGroup)
    } else if (layer.type === "image") {
      const imageGroup = document.createElement("div")
      imageGroup.innerHTML = `
                <label>Ancho:</label>
                <input type="number" id="layerWidth" value="${Math.round(layer.width)}">
                <label>Alto:</label>
                <input type="number" id="layerHeight" value="${Math.round(layer.height)}">
            `
      propertiesPanel.appendChild(imageGroup)
    }

    // Add event listeners for property changes
    this.setupPropertyListeners(layer)
  }

  setupPropertyListeners(layer) {
    const updateProperty = (property, value) => {
      layer[property] = value
      this.render()
    }

    // Position
    const layerX = document.getElementById("layerX")
    const layerY = document.getElementById("layerY")
    if (layerX) layerX.addEventListener("input", (e) => updateProperty("x", Number.parseFloat(e.target.value)))
    if (layerY) layerY.addEventListener("input", (e) => updateProperty("y", Number.parseFloat(e.target.value)))

    // Text properties
    const layerText = document.getElementById("layerText")
    const layerFontSize = document.getElementById("layerFontSize")
    const layerColor = document.getElementById("layerColor")
    const layerFontFamily = document.getElementById("layerFontFamily")

    if (layerText) layerText.addEventListener("input", (e) => updateProperty("text", e.target.value))
    if (layerFontSize)
      layerFontSize.addEventListener("input", (e) => updateProperty("fontSize", Number.parseInt(e.target.value)))
    if (layerColor) layerColor.addEventListener("input", (e) => updateProperty("color", e.target.value))
    if (layerFontFamily) layerFontFamily.addEventListener("change", (e) => updateProperty("fontFamily", e.target.value))

    // Shape properties
    const layerSize = document.getElementById("layerSize")
    if (layerSize) layerSize.addEventListener("input", (e) => updateProperty("size", Number.parseInt(e.target.value)))

    // Image properties
    const layerWidth = document.getElementById("layerWidth")
    const layerHeight = document.getElementById("layerHeight")
    if (layerWidth)
      layerWidth.addEventListener("input", (e) => updateProperty("width", Number.parseFloat(e.target.value)))
    if (layerHeight)
      layerHeight.addEventListener("input", (e) => updateProperty("height", Number.parseFloat(e.target.value)))
  }

  hideElementProperties() {
    const propertiesPanel = document.getElementById("elementProperties")
    propertiesPanel.innerHTML = "<p>Selecciona un elemento para editar sus propiedades</p>"
  }

  clearCanvas() {
    if (confirm("¿Estás seguro de que quieres limpiar todo el canvas?")) {
      this.layers = []
      this.selectedLayer = null
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.updateLayersList()
      this.hideElementProperties()
    }
  }

  downloadImage() {
    // Create a temporary canvas to render the final image
    const tempCanvas = document.createElement("canvas")
    tempCanvas.width = this.canvas.width
    tempCanvas.height = this.canvas.height
    const tempCtx = tempCanvas.getContext("2d")

    // Fill with white background
    tempCtx.fillStyle = "white"
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

    // Render all layers without selection highlights
    this.layers.forEach((layer) => {
      this.renderLayerOnContext(tempCtx, layer)
    })

    // Download the image
    const link = document.createElement("a")
    link.download = "imagen-editada.png"
    link.href = tempCanvas.toDataURL()
    link.click()
  }

  renderLayerOnContext(ctx, layer) {
    switch (layer.type) {
      case "text":
        ctx.font = `${layer.fontSize}px ${layer.fontFamily}`
        ctx.fillStyle = layer.color
        ctx.fillText(layer.text, layer.x, layer.y)
        break

      case "shape":
        ctx.fillStyle = layer.color
        if (layer.shape === "rectangle") {
          ctx.fillRect(layer.x, layer.y, layer.size, layer.size)
        } else if (layer.shape === "circle") {
          ctx.beginPath()
          ctx.arc(layer.x + layer.size / 2, layer.y + layer.size / 2, layer.size / 2, 0, 2 * Math.PI)
          ctx.fill()
        } else if (layer.shape === "triangle") {
          ctx.beginPath()
          ctx.moveTo(layer.x + layer.size / 2, layer.y)
          ctx.lineTo(layer.x, layer.y + layer.size)
          ctx.lineTo(layer.x + layer.size, layer.y + layer.size)
          ctx.closePath()
          ctx.fill()
        }
        break

      case "image":
        ctx.drawImage(layer.image, layer.x, layer.y, layer.width, layer.height)
        break
    }
  }
}

// Initialize the editor when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new ImageEditor()
})
