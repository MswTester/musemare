export type ease = 'linear'|'insine'|'outsine'|'sine'|'inquad'|'outquad'|'quad'|'incubic'|'outcubic'|'cubic'|'inquart'|'outquart'|'quart'|'inquint'|'outquint'|'quint'|'inexpo'|'outexpo'|'expo'|'incirc'|'outcirc'|'circ'|'inback'|'outback'|'back';
export type objEvType = 'position'|'rotate'|'scale'|'opacity'|'anchor'|'bpm'|'ease'|'visible'|'change'|'mcolor'|'jcolor'|'ncolor'|'drawer'|'shape'|'line'|'nline';
export type mainEvType = 'bgcolor'|'filter'|'wiggle'|'position'|'rotate'|'scale';
export type filterType = 'blur'|'dot'|'motionblur'

export type drawer = 'fill'|'stroke'
export type renderVar = {
    events:event[];
    objs:obj[];
    backgroundColor:string;
    position:[number, number];
    rotate:number;
    scale:number;
}
/*
blur (강도) 딱 블러 그정도
dot (강도) 별거없음
motion blur ([x범위, y범위], 진한정도) 동적 모션블러로 전환 필요
bloom (강도) 얼불블룸 딱 그정도
godray ({lacun:빛쪼개지는정도0-5, paral:한곳에서 빛나올지false, gain:뚜렷한정도0-1}) 맵전체 차지하는 범위중 되는걸로;
convolution ([x, y], w, h) x,y둘다 0-1이 적당. w, h로 늘어지는 범위조정
glitch (options) 별거없음
grayscale () 흑백
noise (noise:0-1, seed:0-1) 노이즈
pixelate (size:[x, y]) 픽셀화
rgbsplit ([x, y], [x, y], [x, y]) 색수차 rgb넣는데 다 따로해야됨
*/
export interface filter{
    blur:number;
}

export interface event{
    stamp:number;
    type:mainEvType;
    value?:any;
    duration?:number;
    filter?:filterType;
    smooth?:boolean;
    ease?:ease;
    speed?:number;
}
export type eventProps = 'stamp'|'type'|'value'|'duration'|'ease'|'speed'|'smooth'

export interface objEvent{
    stamp:number;
    type:objEvType
    value?:any;
    duration?:number;
    ease?:ease;
}
export type objEventProps = 'stamp'|'type'|'value'|'duration'|'ease'

export interface obj{
    type:'chart'|'sprite';
    bpm?:number; // speed bpm
    notes?:number[]; // notes' timeStamps(s)
    src?:string; // sprite's img src
    position:[number, number];
    rotate:number;
    scale:[number, number];
    opacity:number;
    anchor:[number, number];
    events:objEvent[];
    ease?:ease; // note down easing
    visible:boolean;
    mcolor?:string; // chart color
    jcolor?:string; // chart judge block color
    ncolor?:string; // chart note color
    drawer?:drawer; // note's drawer
    shape?:string; // note's shape
    line?:number; // chart's line width
    nline?:number; // chart's stroke note width
}
export type objProps = 'type'|'bpm'|'notes'|'src'|'position'|'rotate'|'scale'|'opacity'|'anchor'|'events'|'ease'

export interface level{
    bpm:number;
    offset:number;
    song:string;
    backgroundColor:string;
    volume:number;
    events:event[];
    position:[number, number];
    rotate:number;
    scale:number;
    objs:obj[];
    endpoint:number;
}
export type levelProps = 'bpm'|'offset'|'song'|'backgroundColor'|'volume'|'events'|'objs'|'endpoint'
