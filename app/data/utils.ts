export function isInRange(me:number, range:number, tar:number){
    return tar - range < me && me < tar + range
}