import { drawer, ease, renderVar } from "../data/types"
import { Easing, calcEventColor, calcEventValue} from "../data/utils"
import { drawArc, drawImg, drawRect } from "./canvasDrawer"

// rendering 함수 내보내기
export function render(canvas:HTMLCanvasElement, timeline:number, renderVar:renderVar){
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let base:renderVar = JSON.parse(JSON.stringify(renderVar))

    // main event 적용
    base.events.forEach((v, i) => {
        if(timeline >= v.stamp){
            if(v.type == 'bgcolor'){base.backgroundColor = calcEventColor(timeline, v.stamp, 60/(v.duration as number), base.backgroundColor, v.value, v.ease)}
            else if(v.type == 'wiggle'){
                if (timeline >= v.stamp + (60/(v.duration as number))) return
                let _rt:number = timeline - v.stamp
                let _sp:number = 1 / +(v.speed as number);
                let _st:number = (_rt % _sp) * (1/_sp)
                let _n:number = Math.round(_rt / (_sp / 10)) % 4
                let _r:number = _n >= 2 ? -1 : 1
                let _rs:number = _n % 2 == 0 ? _st : 1 - _st
                let _sm:number = v.smooth ? 1 - _rt/(60/(v.duration as number)) : 1
                base.position[1] = base.position[1] + (_rs * _r * _sm * (+v.value/10))
            }
        }
    })

    // objects event 적용
    base.objs.forEach((_v, _i) => {
        _v.events.forEach((_v2, _i2) => {
            if(timeline >= _v2.stamp){
                if(_v2.type == 'opacity' || _v2.type == 'rotate' || _v2.type == 'bpm' || _v2.type == 'line' || _v2.type == 'nline')
                {base.objs[_i][_v2.type] = calcEventValue(timeline, _v2.stamp, 60/(_v2.duration as number), base.objs[_i][_v2.type] as number, +(_v2.value), _v2.ease)}
                else if(_v2.type == 'position' || _v2.type == 'anchor' || _v2.type == 'scale')
                {
                    let _m = base.objs[_i][_v2.type]
                    base.objs[_i][_v2.type][0] = calcEventValue(timeline, _v2.stamp, 60/(_v2.duration as number), _m[0] as number, +(_v2.value[0]), _v2.ease)
                    base.objs[_i][_v2.type][1] = calcEventValue(timeline, _v2.stamp, 60/(_v2.duration as number), _m[1] as number, +(_v2.value[1]), _v2.ease)
                }
                else if(_v2.type == 'mcolor' || _v2.type == 'jcolor' || _v2.type == 'ncolor'){
                    {base.objs[_i][_v2.type] = calcEventColor(timeline, _v2.stamp, 60/(_v2.duration as number), base.objs[_i][_v2.type] as string, _v2.value, _v2.ease)}
                }
                else if(_v2.type == 'visible'){base.objs[_i].visible = _v2.value}
                else if(_v2.type == 'ease'){base.objs[_i].ease = _v2.value}
                else if(_v2.type == 'drawer'){base.objs[_i].drawer = _v2.value}
                else if(_v2.type == 'shape'){base.objs[_i].shape = _v2.value}
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
                drawRect(canvas, base, true, _v.position, _v.rotate, _v.scale, _v.opacity, _v.anchor, [500, _v.line as number], _v.mcolor as string, 'fill')
                drawRect(canvas, base, true, _v.position, _v.rotate, _v.scale, _v.opacity, [-200/(canvas.width/100)+_v.anchor[0], _v.anchor[1]], [_v.line as number, 50], _v.jcolor as string, 'fill')
                drawRect(canvas, base, true, _v.position, _v.rotate, _v.scale, _v.opacity, [250/(canvas.width/100)+_v.anchor[0], _v.anchor[1]], [_v.line as number, 50], _v.mcolor as string, 'fill')
                drawRect(canvas, base, true, _v.position, _v.rotate, _v.scale, _v.opacity, [-250/(canvas.width/100)+_v.anchor[0], _v.anchor[1]], [_v.line as number, 50], _v.mcolor as string, 'fill')
                // note drawing
                _v.notes?.forEach((_v2, _i2) => {
                    let _timing:number = (_v2 - timeline) / (240/(_v.bpm as number))
                    _timing = _timing <= 1 && _timing >= 0 ? Easing(_timing, _v.ease as ease) : _timing
                    if(_timing <= 1 && _timing >= -0.1){
                        if(_v.shape == 'rect'){
                            drawRect(canvas, base, true, _v.position, _v.rotate, _v.scale, _v.opacity, [(-200+450*_timing)/(canvas.width/100)+_v.anchor[0], _v.anchor[1]], [50, 50], _v.ncolor as string, _v.drawer as drawer, '', _v.nline as number)
                        } else {
                            drawArc(canvas, base, true, _v.position, _v.rotate, _v.scale, _v.opacity, [(-200+450*_timing)/(canvas.width/100)+_v.anchor[0], _v.anchor[1]], 25, _v.ncolor as string, _v.drawer as drawer, '', _v.nline as number)
                        }
                    }
                })
            } else if(_v.type == 'sprite'){ // sprite drawing
                drawImg(canvas, base, true, _v.position, _v.rotate, _v.scale, _v.opacity, _v.anchor, _v.src as string)
            }
        }
    })
}
