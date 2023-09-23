interface event{
    stamp:number;
    type:string;
    value?:number;
    duration?:number;
}

interface sprite{
    src:string;
    x:number;
    y:number;
}

export interface level{
    bpm:number;
    offset:number;
    song:string;
    backgroundColor:string;
    volume:number;
    events:event[];
    sprites:sprite[];
    endpoint:number;
}
