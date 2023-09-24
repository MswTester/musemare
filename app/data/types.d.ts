type ease = 'linear'|'insine'|'outsine'|'sine'

export interface event{
    stamp:number;
    type:'volume'|'bgcolor'|'filter'|'wiggle';
    value?:any;
    duration?:number;
}

export interface objEvent{
    stamp:number;
    type:'transform'|'rotate'|'scale'|'opacity'|'anchor'|'speed'|'ease'|'visible';
    value?:any;
    duration?:number;
    ease?:ease;
}

export interface obj{
    type:'chart'|'sprite';
    bpm?:number; // speed bpm
    notes?:number[]; // notes' timestamps(s)
    src?:string;
    position:number[];
    rotate:number;
    scale:number;
    opacity:number;
    anchor:number[];
    events:objEvent[];
    ease?:ease;
}

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
