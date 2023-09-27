import { ease, renderVar } from "../data/types"
import { Easing, calcEventColor, calcEventValue} from "../data/utils"
import { drawArc, drawImg, drawRect } from "./canvasDrawer"

// rendering 함수 내보내기
export function render(canvas:HTMLCanvasElement, timeline:number, renderVar:renderVar){
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let base:renderVar = JSON.parse(JSON.stringify(renderVar))

    // main event 적용
    base.events.forEach((v, i) => {
        console.log(v.value)
        if(timeline >= v.stamp){
            if(v.type == 'bgcolor'){base.backgroundColor = calcEventColor(timeline, v.stamp, 60/(v.duration as number), base.backgroundColor, v.value, v.ease)}
        }
    })

    // objects event 적용
    base.objs.forEach((_v, _i) => {
        _v.events.forEach((_v2, _i2) => {
            if(timeline >= _v2.stamp){
                if(_v2.type == 'opacity' || _v2.type == 'rotate' || _v2.type == 'bpm')
                {base.objs[_i][_v2.type] = calcEventValue(timeline, _v2.stamp, 60/(_v2.duration as number), base.objs[_i][_v2.type] as number, +(_v2.value), _v2.ease)}
                else if(_v2.type == 'position' || _v2.type == 'anchor' || _v2.type == 'scale')
                {
                    let _m = base.objs[_i][_v2.type]
                    base.objs[_i][_v2.type][0] = calcEventValue(timeline, _v2.stamp, 60/(_v2.duration as number), _m[0] as number, +(_v2.value[0]), _v2.ease)
                    base.objs[_i][_v2.type][1] = calcEventValue(timeline, _v2.stamp, 60/(_v2.duration as number), _m[1] as number, +(_v2.value[1]), _v2.ease)
                }
                else if(_v2.type == 'visible'){base.objs[_i].visible = _v2.value}
                else if(_v2.type == 'ease'){base.objs[_i].ease = _v2.value}
                else if(_v2.type == 'change'){base.objs[_i].src = _v2.value}
            }
        })
    })

    // canvas drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawRect(canvas, base, false, [50, 50], 0, [1, 1], 1, [0, 0], [canvas.width, canvas.height], base.backgroundColor, 'fill') // background
    base.objs.forEach((_v, _i) => {
        if(_v.visible){
            if(_v.type == 'chart'){ // chart drawing
                drawRect(canvas, base, true, _v.position, _v.rotate, _v.scale, _v.opacity, _v.anchor, [500, 3], '#ffffff', 'fill')
                drawRect(canvas, base, true, _v.position, _v.rotate, _v.scale, _v.opacity, [-200/(canvas.width/100)+_v.anchor[0], _v.anchor[1]], [3, 50], '#0099ff', 'fill')
                drawRect(canvas, base, true, _v.position, _v.rotate, _v.scale, _v.opacity, [250/(canvas.width/100)+_v.anchor[0], _v.anchor[1]], [3, 50], '#ffffff', 'fill')
                drawRect(canvas, base, true, _v.position, _v.rotate, _v.scale, _v.opacity, [-250/(canvas.width/100)+_v.anchor[0], _v.anchor[1]], [3, 50], '#ffffff', 'fill')
                // note drawing
                _v.notes?.forEach((_v2, _i2) => {
                    let _timing:number = (_v2 - timeline) / (240/(_v.bpm as number))
                    _timing = _timing <= 1 && _timing >= 0 ? Easing(_timing, _v.ease as ease) : _timing
                    if(_timing <= 1 && _timing >= -0.1){
                        drawArc(canvas, base, true, _v.position, _v.rotate, _v.scale, _v.opacity, [(-200+450*_timing)/(canvas.width/100)+_v.anchor[0], _v.anchor[1]], 25, '#ffffff', 'stroke', '', 3)
                    }
                })
            } else if(_v.type == 'sprite'){ // sprite drawing
                drawImg(canvas, base, true, _v.position, _v.rotate, _v.scale, _v.opacity, _v.anchor, _v.src as string)
            }
        }
    })
}
