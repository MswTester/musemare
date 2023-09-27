import { drawer, renderVar } from "../data/types"

export function drawRect(canvas:HTMLCanvasElement, rv:renderVar, baseOffset:boolean, pos:[number, number], rot:number, scale:[number, number], opacity:number, anchor:[number, number], size:[number, number], color:string, drawer:drawer, filter?:string, lineWidth?:number):void{
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.save()
    ctx.beginPath()
    let rx:number = canvas.width/100
    let ry:number = canvas.height/100
    let hx:number = canvas.width/2
    let hy:number = canvas.height/2
    let ox:number = baseOffset ? rx*rv.position[0] : 0
    let oy:number = baseOffset ? ry*rv.position[1] : 0
    let os:number = baseOffset ? rv.scale : 1

    let modified_pos:[number, number] = [0, 0]
    modified_pos[0] = (pos[0] - 50) * Math.cos(rv.rotate*(Math.PI/180)) - (pos[1] - 50) * Math.sin(rv.rotate*(Math.PI/180)) + 50
    modified_pos[1] = (pos[0] - 50) * Math.sin(rv.rotate*(Math.PI/180)) + (pos[1] - 50) * Math.cos(rv.rotate*(Math.PI/180)) + 50
    console.log(pos, modified_pos)
    ctx.filter = filter || ''
    const mpos = baseOffset ? modified_pos : pos
    ctx.translate(rx*mpos[0]-ox, ry*mpos[1]-oy)
    ctx.translate((hx-(rx*mpos[0]-ox))*-os, (hy-(ry*mpos[1]-oy))*-os)
    ctx.rotate((rv.rotate+rot) * (Math.PI / 180))
    baseOffset ? ctx.scale(rv.scale, rv.scale) : ''
    ctx.scale(...scale)
    ctx.globalAlpha = opacity
    ctx.rect(rx*anchor[0]-size[0]/2, ry*anchor[1]-size[1]/2, size[0], size[1])
    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth || 1
    drawer == 'fill' ? ctx.fill() : ctx.stroke()
    ctx.closePath()
    ctx.restore()
}


export function drawArc(canvas:HTMLCanvasElement, rv:renderVar, baseOffset:boolean, pos:[number, number], rot:number, scale:[number, number], opacity:number, anchor:[number, number], radius:number, color:string, drawer:drawer, filter?:string, lineWidth?:number):void{
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.save()
    ctx.beginPath()
    let rx = canvas.width/100
    let ry = canvas.height/100
    ctx.filter = filter || ''
    ctx.translate(rx*pos[0], ry*pos[1])
    ctx.rotate(rot * (Math.PI / 180))
    ctx.scale(...scale)
    ctx.globalAlpha = opacity
    ctx.arc(rx*anchor[0], ry*anchor[1], radius, 0, 2*Math.PI)
    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth || 1
    drawer == 'fill' ? ctx.fill() : ctx.stroke()
    ctx.closePath()
    ctx.restore()
}

export function drawImg(canvas:HTMLCanvasElement, rv:renderVar, baseOffset:boolean, pos:[number, number], rot:number, scale:[number, number], opacity:number, anchor:[number, number], src:string, filter?:string):void{
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const img = new Image()
    img.src = src
    // img.onload = () => {
        ctx.save()
        ctx.beginPath()
        let rx = canvas.width/100
        let ry = canvas.height/100
        ctx.filter = filter || ''
        ctx.translate(rx*pos[0], ry*pos[1])
        ctx.rotate(rot * (Math.PI / 180))
        ctx.scale(...scale)
        ctx.globalAlpha = opacity
        ctx.drawImage(img, rx*anchor[0], ry*anchor[1], 100, 100)
        ctx.closePath()
        ctx.restore()
    // }
}