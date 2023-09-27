import { ease } from "./types";

export function isInRange(me:number, range:number, tar:number){
    return tar - range < me && me < tar + range
}

function easeInSine(x: number): number {return 1 - Math.cos((x * Math.PI) / 2);}
function easeOutSine(x: number): number {return Math.sin((x * Math.PI) / 2);}
function easeInOutSine(x: number): number {return -(Math.cos(Math.PI * x) - 1) / 2;}
function easeInQuad(x: number): number {return x * x;}
function easeOutQuad(x: number): number {return 1 - (1 - x) * (1 - x);}
function easeInOutQuad(x: number): number {return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;}
function easeInCubic(x: number): number {return x * x * x;}
function easeOutCubic(x: number): number {return 1 - Math.pow(1 - x, 3);}
function easeInOutCubic(x: number): number {return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;}
function easeInQuart(x: number): number {return x * x * x * x;}
function easeOutQuart(x: number): number {return 1 - Math.pow(1 - x, 4);}
function easeInOutQuart(x: number): number {return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;}
function easeInQuint(x: number): number {return x * x * x * x * x;}
function easeOutQuint(x: number): number {return 1 - Math.pow(1 - x, 5);}
function easeInOutQuint(x: number): number {return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;}
function easeInExpo(x: number): number {return x === 0 ? 0 : Math.pow(2, 10 * x - 10);}
function easeOutExpo(x: number): number {return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);}
function easeInOutExpo(x: number): number {return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;}
function easeInCirc(x: number): number {return 1 - Math.sqrt(1 - Math.pow(x, 2));}
function easeOutCirc(x: number): number {return Math.sqrt(1 - Math.pow(x - 1, 2));}
function easeInOutCirc(x: number): number {return x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;}
function easeInBack(x: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * x * x * x - c1 * x * x;
}
function easeOutBack(x: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
function easeInOutBack(x: number): number {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return x < 0.5 ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2 : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}

export function hexToRgb(hex:string):number[] {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
    ] : [0, 0, 0];
}

export function componentToHex(c:number):string {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r:number, g:number, b:number):string {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function copy(data:any):any{
    return JSON.parse(JSON.stringify(data))
}

export function Easing(n:number, ease:ease):number{
    switch(ease){
        case 'linear': return n
        case 'insine': return easeInSine(n)
        case 'outsine': return easeOutSine(n)
        case 'sine': return easeInOutSine(n)
        case 'inquad': return easeInQuad(n)
        case 'outquad': return easeOutQuad(n)
        case 'quad': return easeInOutQuad(n)
        case 'incubic': return easeInCubic(n)
        case 'outcubic': return easeOutCubic(n)
        case 'cubic': return easeInOutCubic(n)
        case 'inquart': return easeInQuart(n)
        case 'outquart': return easeOutQuart(n)
        case 'quart': return easeInOutQuart(n)
        case 'inquint': return easeInQuint(n)
        case 'outquint': return easeOutQuint(n)
        case 'quint': return easeInOutQuint(n)
        case 'inexpo': return easeInExpo(n)
        case 'outexpo': return easeOutExpo(n)
        case 'expo': return easeInOutExpo(n)
        case 'incirc': return easeInCirc(n)
        case 'outcirc': return easeOutCirc(n)
        case 'circ': return easeInOutCirc(n)
        case 'inback': return easeInBack(n)
        case 'outback': return easeOutBack(n)
        case 'back': return easeInOutBack(n)
    }
}

export function calcEventValue(timeline:number, stamp:number, duration:number, start:number, end:number, ease?:ease){
    if(timeline >= stamp + +(duration)){return end}
    else {
        let _per:number = Easing((timeline - stamp) / +(duration), ease || 'linear')
        return start + _per*(end - start)
    }
}

export function calcEventColor(timeline:number, stamp:number, duration:number, start:string, end:string, ease?:ease){
    if(timeline >= stamp + +(duration)){return end}
    else {
        let _per:number = Easing((timeline - stamp) / +(duration), ease || 'linear')
        let _bs = hexToRgb(start)
        let _nw = hexToRgb(end);
        let _rs = _bs.map((_v, _i) => {
            return _v + Math.round(_per * (_nw[_i] - _v))
        })
        return rgbToHex(_rs[0], _rs[1], _rs[2])
    }
}

export function getPos(_pos:[number, number], _stage:[number, number]):[number]{
    return _pos.map((v:number, i:number) => (v-50)/100*_stage[i]) as [number]
}

export function parseHex(hex:string){
    return parseInt(hex.replace('#', ''), 16)
}