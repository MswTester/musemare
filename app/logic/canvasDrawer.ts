import { drawer } from "../data/types"

export function drawRect(canvas:HTMLCanvasElement, pos:[number, number], rot:number, scale:[number, number], opacity:number, anchor:[number, number], size:[number, number], color:string, drawer:drawer, lineWidth?:number, filter?:string):void{
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.save()
    ctx.beginPath()
    let rx = canvas.width/100
    let ry = canvas.height/100
    ctx.filter = filter || ''
    ctx.scale(...scale)
    ctx.translate(rx*pos[0], ry*pos[1])
    ctx.rotate(rot * (Math.PI / 180))
    ctx.globalAlpha = opacity
    ctx.rect(rx*anchor[0]-size[0]/2, ry*anchor[1]-size[1]/2, size[0], size[1])
    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth || 1
    drawer == 'fill' ? ctx.fill() : ctx.stroke()
    ctx.closePath()
    ctx.restore()
}

export function drawArc(canvas:HTMLCanvasElement, pos:[number, number], rot:number, scale:[number, number], opacity:number, anchor:[number, number], radius:number, color:string, drawer:drawer, lineWidth?:number, filter?:string):void{
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.save()
    ctx.beginPath()
    let rx = canvas.width/100
    let ry = canvas.height/100
    ctx.filter = filter || ''
    ctx.rotate(rot * (Math.PI / 180))
    ctx.scale(...scale)
    ctx.translate(rx*pos[0], ry*pos[1])
    ctx.globalAlpha = opacity
    ctx.arc(rx*anchor[0], ry*anchor[1], radius, 0, 2*Math.PI)
    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth || 1
    drawer == 'fill' ? ctx.fill() : ctx.stroke()
    ctx.closePath()
    ctx.restore()
}
