import { obj, renderVar } from "../data/types"
import { hexToRgb, rgbToHex } from "../data/utils"
import { drawRect } from "./canvasDrawer"

export function render(canvas:HTMLCanvasElement, timeline:number, renderVar:renderVar){
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let base:renderVar = JSON.parse(JSON.stringify(renderVar))
    base.events.forEach((v, i) => {
        if(v.type == 'bgcolor'){
            if(timeline >= v.stamp && v.duration == 0){base.backgroundColor = v.value}
            else {
                let _per:number = (timeline - v.stamp) / (v.duration as number)
                let _bs = hexToRgb(base.backgroundColor)
                let _nw = hexToRgb(v.value);
                let _rs = _bs.map((_v, _i) => {
                    return _v + _per * (_nw[_i] - _v)
                })
                base.backgroundColor = rgbToHex(_rs[0], _rs[1], _rs[2])
            }
        }
    })

    // canvas drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawRect(canvas, [50, 50], 0, [1, 1], 1, [0, 0], [canvas.width, canvas.height], base.backgroundColor, 'fill') // background
}

function setChart(chart:obj){
    // 채보 시스템
}
