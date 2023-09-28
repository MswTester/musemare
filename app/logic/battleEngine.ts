import { drawer, ease, filter, filterType, level, renderVar } from "../data/types"
import { Easing, calcEventColor, calcEventValue, enableFilters} from "../data/utils"

// rendering 함수 내보내기
export function render(timeline:number, renderVar:renderVar){
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
            } else if(v.type == 'rotate'){base.rotate = calcEventValue(timeline, v.stamp, 60/(v.duration as number), base.rotate, +v.value, v.ease)
            } else if(v.type == 'scale'){base.scale = calcEventValue(timeline, v.stamp, 60/(v.duration as number), base.scale, +v.value, v.ease)
            } else if(v.type == 'position'){
                base.position[0] = calcEventValue(timeline, v.stamp, 60/(v.duration as number), base.position[0], +v.value[0], v.ease)
                base.position[1] = calcEventValue(timeline, v.stamp, 60/(v.duration as number), base.position[1], +v.value[1], v.ease)
            } else if(v.type == 'filter'){
                let _f:filterType = v.filter as filterType
                if(enableFilters.includes(_f)) return base.filters[_f] = v.value != 0 ? 1 : 0
                base.filters[_f] = calcEventValue(timeline, v.stamp, 60/(v.duration as number), base.filters[_f], (+v.value)/100, v.ease)
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

    return base
}
