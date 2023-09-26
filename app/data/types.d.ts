export type ease = 'linear'|'insine'|'outsine'|'sine';
export type objEvType = 'transform'|'rotate'|'scale'|'opacity'|'anchor'|'speed'|'ease'|'visible'|'change';
export type mainEvType = 'volume'|'bgcolor'|'filter'|'wiggle';

export type drawer = 'fill'|'stroke'
export type renderVar = {
    events:event[];
    objs:obj[];
    backgroundColor:string;
    volume:number;
}

export interface event{
    stamp:number;
    type:mainEvType;
    value?:any;
    duration?:number;
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
    notes?:number[]; // notes' timestamps(s)
    src?:string;
    position:number[];
    rotate:number;
    scale:number[];
    opacity:number;
    anchor:number[];
    events:objEvent[];
    ease?:ease;
}
export type objProps = 'type'|'bpm'|'notes'|'src'|'position'|'rotate'|'scale'|'opacity'|'anchor'|'events'|'ease'

export interface level{
    bpm:number;
    offset:number;
    song:string;
    backgroundColor:string;
    volume:number;
    events:event[];
    objs:obj[];
    endpoint:number;
}
export type levelProps = 'bpm'|'offset'|'song'|'backgroundColor'|'volume'|'events'|'objs'|'endpoint'
