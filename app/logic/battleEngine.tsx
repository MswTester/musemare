import { drawer, ease, filterType, judge, note, obj, battleRenderData } from "../data/types"
import { Easing, calcEventColor, calcEventValue, copy, enableFilters, getPos, parseHex} from "../data/utils"
import { Stage, Container, Sprite, Graphics, Text } from "@pixi/react"
import * as PIXI from 'pixi.js'
import { DotFilter, BloomFilter, GlitchFilter, GodrayFilter, GrayscaleFilter, MotionBlurFilter, PixelateFilter, ConvolutionFilter, RGBSplitFilter } from 'pixi-filters'
import { toLang } from "../data/lang"

// chart pixi drawer
const chartDraw = (g:PIXI.Graphics, v:obj, _tl:number) => {
    let _mc:string = v.mcolor as string
    let _jc:string = v.jcolor as string
    let _nc:string = v.ncolor as string
    let _d:drawer = v.drawer as drawer
    let _sh:string = v.shape as string
    let _l:number = v.line as number
    let _nl:number = v.nline as number
    g.clear();
    g.beginFill(parseHex(_mc))
    g.drawRect(-250+(_l/2), 1-(_l/2), 500, _l)
    g.drawRect(-250+(_l/2), -25, _l, 50)
    g.drawRect(250-(_l/2), -25, _l, 50)
    g.endFill()
    g.beginFill(parseHex(_jc))
    g.drawRect(-200+(_l/2), -25, _l, 50)
    g.endFill()
    v.notes?.forEach((v2, i2) => {
        if(v2.judge == 'none'){
            let _timing:number = (v2.stamp - _tl) / (240/(v.bpm as number))
            _timing = _timing <= 1 && _timing >= 0 ? Easing(_timing, v.ease as ease) : _timing
            if(_timing <= 1 && _timing >= -0.1){
                let _x = -200+450*_timing + _l
                _d == 'stroke' ? g.lineStyle(_nl, parseHex(_nc)) : g.beginFill(parseHex(_nc))
                _sh == 'arc' ? g.drawCircle(_x, 0, 25) : g.drawRect(_x-25, -25, 50, 50)
                _d == 'fill' ? g.endFill() : false
            }
        }
    })
}

// filter 만드는 함수
const createFilter = (renderData:battleRenderData, timeline:number) => {
    let _arr:PIXI.Filter[] = []
    renderData.filters.blur != 0 ? _arr.push(new PIXI.BlurFilter(renderData.filters.blur)) : false
    renderData.filters.dot != 0 ? _arr.push(new DotFilter(renderData.filters.dot)) : false
    renderData.filters.motionBlur != 0 ? _arr.push(new MotionBlurFilter([10, 10], renderData.filters.motionBlur*5)) : false
    renderData.filters.bloom != 0 ? _arr.push(new BloomFilter(renderData.filters.bloom*2)) : false
    renderData.filters.godray != 0 ? _arr.push(new GodrayFilter({gain:renderData.filters.godray})) : false
    renderData.filters.convolution != 0 ? _arr.push(new ConvolutionFilter([renderData.filters.convolution, renderData.filters.convolution])) : false
    let _gr = renderData.filters.glitch * 5
    let _gopt = {red:[_gr, _gr], blue:[_gr/2, -_gr/2], green:[-_gr, -_gr]}
    renderData.filters.glitch != 0 ? _arr.push(new GlitchFilter(_gopt)) : false
    renderData.filters.grayscale != 0 ? _arr.push(new GrayscaleFilter()) : false
    renderData.filters.noise != 0 ? _arr.push(new PIXI.NoiseFilter(renderData.filters.noise, timeline%1)) : false
    renderData.filters.pixelate != 0 ? _arr.push(new PixelateFilter(renderData.filters.pixelate*10)) : false
    let _rr = renderData.filters.rgbsplit * 5
    renderData.filters.rgbsplit != 0 ? _arr.push(new RGBSplitFilter([_rr, _rr], [_rr/2, -_rr/2], [-_rr, -_rr])) : false
    return _arr
}

// 판정 텍스트 업로드 함수
const InitJudges = (_o:obj, ki:number, timeline:number, stageSize:[number, number]) => {
    let _idx:number = -1
    _o.type == 'chart' && _o.visible && _o.notes?.forEach((v2, i2) => {
        if(v2.judge !== 'none') _idx = i2
    })
    if(_idx != -1){
        let _j:judge = (_o.notes as note[])[_idx].judge
        let _f:number = _j == 'perfect' ? 0x33ff00 : _j == 'good' ? 0xdddd00 : 0xdd0000
        return timeline - (_o.notes as note[])[_idx].hit < 0.5 ? <Text key={ki} text={_j.toUpperCase()} style={new PIXI.TextStyle({align:'center', fontFamily:'Impact', fontSize:20, fontWeight:'400', fill:_f, fontStyle:'normal'})}
        position={getPos(_o.position, stageSize)} rotation={_o.rotate*Math.PI/180} scale={_o.scale} alpha={_o.opacity} pivot={[_o.anchor[0]*5+230, _o.anchor[1]*0.5+50]}/> : <></>
    } else {
        return <></>
    }
}

// rendering 함수 내보내기
export const battleEngine = (timeline:number, hits:number[], stageSize:[number, number], renderData:battleRenderData, playing?:boolean) => {
    let base:battleRenderData = copy(renderData)

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
        _of = 1 + ((_of - 1)/2)
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

    const globalSize = Math.max(stageSize[0], stageSize[1])/1000
    return <Stage width={stageSize[0]} height={stageSize[1]} options={{backgroundColor:parseHex(base.backgroundColor)}}>
        <Sprite image={"assets/object/square/square1.png"} width={stageSize[0]} height={stageSize[1]} tint={parseHex(base.backgroundColor)}></Sprite>
        <Container filters={createFilter(base, timeline) as PIXI.Filter[]} pivot={[base.position[0]/100*stageSize[0], base.position[1]/100*stageSize[1]]} x={stageSize[0]/2} y={stageSize[1]/2} scale={base.scale} rotation={base.rotate*Math.PI/180}>
            {base.objs.map((v, i) => (
                v.type == 'sprite' && v.visible ? <Sprite key={i} image={v.src || "assets"} position={getPos(v.position, stageSize)} rotation={v.rotate*Math.PI/180} scale={[v.scale[0]*globalSize, v.scale[1]*globalSize]} alpha={v.opacity} anchor={v.anchor.map(v => (v+50)/100) as [number]}></Sprite>:
                v.type == 'chart' && v.visible && <Graphics key={i} draw={g => chartDraw(g, v, timeline)} position={getPos(v.position, stageSize)} rotation={v.rotate*Math.PI/180} scale={[v.scale[0]*globalSize, v.scale[1]*globalSize]} alpha={v.opacity} pivot={[v.anchor[0]*5, v.anchor[1]*0.5]}/>
            ))}
            {playing && base.objs.map((v, i) => (
                InitJudges(v, i, timeline, stageSize)
            ))}
        </Container>
    </Stage>
}
