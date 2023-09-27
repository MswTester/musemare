import { drawer, renderVar } from "../data/types"

export function drawRect(canvas:HTMLCanvasElement, rv:renderVar, baseOffset:boolean, pos:[number, number], rot:number, scale:[number, number], opacity:number, anchor:[number, number], size:[number, number], color:string, drawer:drawer, filter?:string, lineWidth?:number):void{
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.save()
    ctx.beginPath()
    let rx:number = canvas.width/100
    let ry:number = canvas.height/100
    let hx:number = canvas.width/2
    let hy:number = canvas.height/2
    let ox:number = baseOffset ? rv.position[0] : 0
    let oy:number = baseOffset ? rv.position[1] : 0
    let os:number = baseOffset ? rv.scale : 1
    let rpos:[number, number] = [pos[0]-ox, pos[1]-oy]
    let modified_pos:[number, number] = [0, 0]
    modified_pos[0] = (rpos[0] - 50) * Math.cos(rv.rotate*(Math.PI/180)) - (rpos[1] - 50) * Math.sin(rv.rotate*(Math.PI/180)) + 50
    modified_pos[1] = (rpos[0] - 50) * Math.sin(rv.rotate*(Math.PI/180)) + (rpos[1] - 50) * Math.cos(rv.rotate*(Math.PI/180)) + 50
    const mpos = baseOffset ? modified_pos : pos
    ctx.filter = filter || ''
    ctx.translate(rx*mpos[0], ry*mpos[1])
    ctx.translate((hx-(rx*mpos[0]))*-os*2, (hy-(ry*mpos[1]))*-os*2)
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
    let rx:number = canvas.width/100
    let ry:number = canvas.height/100
    let hx:number = canvas.width/2
    let hy:number = canvas.height/2
    let ox:number = baseOffset ? rv.position[0] : 0
    let oy:number = baseOffset ? rv.position[1] : 0
    let os:number = baseOffset ? rv.scale : 1
    let rpos:[number, number] = [pos[0]-ox, pos[1]-oy]
    let modified_pos:[number, number] = [0, 0]
    modified_pos[0] = (rpos[0] - 50) * Math.cos(rv.rotate*(Math.PI/180)) - (rpos[1] - 50) * Math.sin(rv.rotate*(Math.PI/180)) + 50
    modified_pos[1] = (rpos[0] - 50) * Math.sin(rv.rotate*(Math.PI/180)) + (rpos[1] - 50) * Math.cos(rv.rotate*(Math.PI/180)) + 50
    const mpos = baseOffset ? modified_pos : pos
    ctx.filter = filter || ''
    ctx.translate(rx*mpos[0], ry*mpos[1])
    ctx.translate((hx-(rx*mpos[0]))*-os*2, (hy-(ry*mpos[1]))*-os*2)
    ctx.rotate((rv.rotate+rot) * (Math.PI / 180))
    baseOffset ? ctx.scale(rv.scale, rv.scale) : ''
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
        let rx:number = canvas.width/100
        let ry:number = canvas.height/100
        let hx:number = canvas.width/2
        let hy:number = canvas.height/2
        let ox:number = baseOffset ? rv.position[0] : 0
        let oy:number = baseOffset ? rv.position[1] : 0
        let os:number = baseOffset ? rv.scale : 1
        let rpos:[number, number] = [pos[0]-ox, pos[1]-oy]
        let modified_pos:[number, number] = [0, 0]
        modified_pos[0] = (rpos[0] - 50) * Math.cos(rv.rotate*(Math.PI/180)) - (rpos[1] - 50) * Math.sin(rv.rotate*(Math.PI/180)) + 50
        modified_pos[1] = (rpos[0] - 50) * Math.sin(rv.rotate*(Math.PI/180)) + (rpos[1] - 50) * Math.cos(rv.rotate*(Math.PI/180)) + 50
        const mpos = baseOffset ? modified_pos : pos
        ctx.filter = filter || ''
        ctx.translate(rx*mpos[0], ry*mpos[1])
        ctx.translate((hx-(rx*mpos[0]))*-os*2, (hy-(ry*mpos[1]))*-os*2)
        ctx.rotate((rv.rotate+rot) * (Math.PI / 180))
        baseOffset ? ctx.scale(rv.scale, rv.scale) : ''
        ctx.scale(...scale)
        ctx.globalAlpha = opacity
        ctx.drawImage(img, rx*anchor[0]-img.width/2, ry*anchor[1]-img.height/2)
        ctx.closePath()
        ctx.restore()
    // }
}