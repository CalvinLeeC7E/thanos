const LAYER_COUNT = 120
const DIS_PART = 5
const BASE_DELAY = 1.15
const THANOS_CONTAINER_CLASS_NAME = 'thanos--container'

// 灭霸效果
function thanos (element) {
  html2canvas(element).then($canvas => {
    const layers = createLayers($canvas, LAYER_COUNT)
    const newElement = createLayersContainer($canvas)
    layers.forEach((layer, i) => {
      layer.style.transitionDelay = `${BASE_DELAY * i / layers.length}s`;
      newElement.appendChild(layer)
    })
    element.parentNode.replaceChild(newElement, element)
    startAnimation(layers)
  })
}

// 开始执行动画
function startAnimation (layers) {
  setTimeout(() => {
    layers.forEach(layer => {
      // 随机生成-180度到+180度角
      const randomRadian = 2 * Math.PI * (Math.random() - 0.5)
      const rotate = 20 * (Math.random() - 0.5)
      const translateX = 60 * Math.sin(randomRadian)
      const translateY = 30 * Math.cos(randomRadian)
      layer.style.transform = `rotate(${rotate}deg) translate(${translateX}px, ${translateY}px)`
      layer.style.opacity = 0
    })
  })
}

// 创建动画层容器
function createLayersContainer ({width, height}) {
  const element = document.createElement('div')
  const devicePixelRatio = window.devicePixelRatio
  element.style.width = width / devicePixelRatio + 'px'
  element.style.height = height / devicePixelRatio + 'px'
  element.classList.add(THANOS_CONTAINER_CLASS_NAME)
  return element
}

// 创建动画层
function createLayers ($canvas, layersCount = 60) {
  const {width, height} = $canvas
  const ctx = $canvas.getContext('2d')
  const oriData = ctx.getImageData(0, 0, width, height)
  const layers = [...Array(layersCount)].map(() => ctx.createImageData(width, height))
  pickPixel(layers, oriData, width, height)
  return layers.map(data => {
    const layerContent = $canvas.cloneNode(true)
    layerContent.getContext('2d').putImageData(data, 0, 0)
    return layerContent
  })
}

// 向每一层随机采集像素点
function pickPixel (layers, oriData, width, height) {
  const layersCount = layers.length
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // 从左向右计算layerIndex
      const layerIndex = Math.floor(layersCount * ((Math.random() + (DIS_PART - 1) * x / width) / DIS_PART))
      const pIndexStart = (y * width + x) * 4
      for (let offset = 0; offset < 4; offset++) {
        const pIndex = pIndexStart + offset
        layers[layerIndex].data[pIndex] = oriData.data[pIndex]
      }
    }
  }
}
