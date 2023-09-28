import { drawer, ease, filter, filterType, judge, level, note, renderVar } from "../data/types"
import { Easing, calcEventColor, calcEventValue, copy, enableFilters} from "../data/utils"

// rendering 함수 내보내기
export function render(timeline:number, renderVar:renderVar, hits:number[]){
    let base:renderVar = copy(renderVar)

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

    let _noteArr:{stamp:number;hit:number;judge:judge;pointer:number[];bpmd:number;}[] = []
    base.objs.forEach((v, i) => {
        if(v.type == 'chart'){
            v.notes?.forEach((v2, i2) => {
                _noteArr.push({stamp:v2.stamp, hit:v2.hit, judge:v2.judge, pointer:[i, i2], bpmd:60/(v.bpm as number)})
            })
        }
    })
    _noteArr.sort((_a, _b) => _a.stamp - _b.stamp)

    let _h:number[] = copy(hits)
    _h.sort((a, b) => b - a)
    _noteArr.forEach((v, i) => {
        let _of:number = 0.4/v.bpmd
        _of = _of + (_of - 1)/20
        let _gj:number = (v.bpmd*3/5)*_of
        let _pj:number = (v.bpmd*1/5)*_of
        let _mj:number = (v.bpmd)*_of
        let _delIdx:number = -1
        let _cd = timeline - v.stamp >= _gj
        _h.forEach((v2, i2) => {
            let _j:number = Math.abs(v2 - v.stamp)
            if(_j <= _pj){
                (base.objs[v.pointer[0]].notes as note[])[v.pointer[1]].judge = 'perfect';
            } else if(_j < _gj){
                (base.objs[v.pointer[0]].notes as note[])[v.pointer[1]].judge = 'good';
            } else if(_j <= _mj){
                (base.objs[v.pointer[0]].notes as note[])[v.pointer[1]].judge = 'miss'
            }
            if(_j <= _mj){
                (base.objs[v.pointer[0]].notes as note[])[v.pointer[1]].hit = v2;
                _delIdx = i2
            }
        })
        if(_delIdx != -1){
            _h.splice(_delIdx, 1)
        } else if(_cd){
            (base.objs[v.pointer[0]].notes as note[])[v.pointer[1]].judge = 'miss';
            (base.objs[v.pointer[0]].notes as note[])[v.pointer[1]].hit = v.stamp + _gj;
        }
    })

    return base
}
