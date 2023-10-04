export type ease = 'linear'|'insine'|'outsine'|'sine'|'inquad'|'outquad'|'quad'|'incubic'|'outcubic'|'cubic'|'inquart'|'outquart'|'quart'|'inquint'|'outquint'|'quint'|'inexpo'|'outexpo'|'expo'|'incirc'|'outcirc'|'circ'|'inback'|'outback'|'back';
export type objEvType = 'position'|'rotate'|'scale'|'opacity'|'anchor'|'bpm'|'ease'|'visible'|'change'|'mcolor'|'jcolor'|'ncolor'|'drawer'|'shape'|'line'|'nline';
export type mainEvType = 'bgcolor'|'filter'|'wiggle'|'position'|'rotate'|'scale';
export type filterType = 'blur'|'dot'|'motionBlur'|'bloom'|'godray'|'convolution'|'glitch'|'grayscale'|'noise'|'pixelate'|'rgbsplit'
export type judge = 'perfect'|'good'|'miss'|'none'
export type drawer = 'fill'|'stroke'

export interface sprite{
    position:[number, number];
    rotation:number;
    scale:[number, number];
    opacity:number;
    anchor:[number, number];
    hitbox:[number, number];
    src:string;
    isGravity:boolean;
    isCollision:boolean;
}

export interface text{
    position:[number, number];
    rotation:number;
    scale:[number, number];
    opacity:number;
    anchor:[number, number];
    content:string;
    color:string;
    weight:string;
}

export interface battleRenderData{
    events:event[];
    objs:obj[];
    backgroundColor:string;
    position:[number, number];
    rotate:number;
    scale:number;
    filters:filter;
}

export interface note{
    stamp:number;
    hit:number;
    judge:judge;
}

export interface filter{
    blur:number;
    dot:number;
    motionBlur:number;
    bloom:number;
    godray:number;
    convolution:number;
    glitch:number;
    grayscale:number;
    noise:number;
    pixelate:number;
    rgbsplit:number;
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
export type eventProps = 'stamp'|'type'|'value'|'duration'|'ease'|'speed'|'smooth'|'filter'

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
    notes?:note[]; // notes
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
    filters:filter;
    endpoint:number;
}
export type levelProps = 'bpm'|'offset'|'song'|'backgroundColor'|'volume'|'events'|'objs'|'endpoint'
