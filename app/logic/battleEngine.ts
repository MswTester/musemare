import { obj, renderVar } from "../data/types"
import { drawRect } from "./canvasDrawer"

export function render(canvas:HTMLCanvasElement, timeline:number, renderVar:renderVar){
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let base:renderVar = JSON.parse(JSON.stringify(renderVar))
    base.events.forEach((v, i) => {
        if(v.type == 'bgcolor'){
            if(timeline >= v.stamp) base.backgroundColor = v.value
        }
    })

    // canvas drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawRect(canvas, [50, 50], 0, [1, 1], 1, [0, 0], [canvas.width, canvas.height], base.backgroundColor, 'fill') // background
}

function setChart(chart:obj){
    // 채보 시스템
}