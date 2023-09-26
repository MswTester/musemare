import { ease } from "./types";

export function isInRange(me:number, range:number, tar:number){
    return tar - range < me && me < tar + range
}

function easeInSine(x: number): number {
    return 1 - Math.cos((x * Math.PI) / 2);
}

function easeOutSine(x: number): number {
    return Math.sin((x * Math.PI) / 2);
}

function easeInOutSine(x: number): number {
    return -(Math.cos(Math.PI * x) - 1) / 2;
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

export function Easing(n:number, ease:ease):number{
    switch(ease){
        case 'linear':
            return n
        case 'insine':
            return easeInSine(n)
        case 'outsine':
            return easeOutSine(n)
        case 'sine':
            return easeInOutSine(n)
    }
    return 1
}