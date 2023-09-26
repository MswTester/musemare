export function drawRect(canavs:HTMLCanvasElement, ctx:CanvasRenderingContext2D, pos:[number, number], rot:number, scale:[number, number], opacity:number, anchor:[number, number]):void{
    ctx.save()
    ctx.beginPath()
    let rx = canavs.width/100
    let ry = canavs.height/100
    ctx.rotate(rot * (Math.PI / 180))
    ctx.scale(...scale)
    ctx.translate(rx*anchor[0], ry*anchor[1])
    ctx.globalAlpha = opacity
    ctx.rect(rx*pos[0], ry*pos[1], 1, 1)
    ctx.fill()
    ctx.closePath()
    ctx.restore()
}

export function drawChart(){
    
}