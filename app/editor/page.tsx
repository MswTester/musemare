'use client'

import { useEffect, useState } from "react"
import { isInRange } from "../data/utils"
import { level } from "../data/types"

const dragRange = 6

export default function Page(){
    const [lang, setLang] = useState<string>('en-US')
    const [underbarLine, setUnderbarLine] = useState<number>(30)
    const [mainsetLine, setMainsetLine] = useState<number>(20)
    const [eventsetLine, setEventsetLine] = useState<number>(20)
    const [objLine, setObjLine] = useState<number>(20)
    const [condset, setCondset] = useState<number[]>([0, 0])
    // default settings
    const [bpm, setBpm] = useState<number>(100)
    const [offset, setOffset] = useState<number>(0)
    const [song, setSong] = useState<string>('')
    const [BackgroundColor, setBackgroundColor] = useState<string>('#000000')
    const [volume, setVolume] = useState<number>(100)
    const [endpoint, setEndpoint] = useState<number>(90)
    
    // env settings
    const [grid, setGrid] = useState<number>(4)
    const [playing, setPlaying] = useState<boolean>(false)
    const [zoom, setZoom] = useState<number>(100)
    const [timeline, setTimeline] = useState<number>(0)
    const [gridLine, setGridLine] = useState<number[]>([])
    
    let v_playing:boolean = false, v_zoom:number = 100, v_timeline = 0
    
    let ubl = 30
    let msl = 20
    let esl = 20
    let obl = 20
    let Dragging = ''
    let cont_dragging = false
    
    useEffect(() => {
        setLang(navigator.language)
        setCondset([innerWidth, innerHeight])
        
        // canvas
        const canvas = document.querySelector('canvas') as HTMLCanvasElement
        const ctx = canvas.getContext('2d')
        
        function resizeCanvas(){
            setCondset([innerWidth, innerHeight])
            canvas.width = innerWidth / 100 * (100 - msl - esl)
            canvas.height = innerHeight / 100 * (100 - ubl)
        }
        window.onresize = resizeCanvas
        resizeCanvas()
        
        function loop(){
            if(ctx){
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.fillStyle = 'red'
                ctx.fillRect(100, 100, 20, 20)
            }
            requestAnimationFrame(loop)
        }
        loop()

        function keydown(e:KeyboardEvent){
            if(e.altKey){
                e.preventDefault()
            }
        }
        function wheel(e:WheelEvent){
            if(e.altKey){
                v_zoom += e.deltaY / 100
                v_zoom < 1 && (v_zoom = 1)
                setZoom(v_zoom)
            }
        }
        function mouseup(e:MouseEvent){
            Dragging = ''
        }
        function mousedown(e:MouseEvent){
            if(isInRange(e.clientY, dragRange, innerHeight / 100 * (100-ubl))){
                Dragging = 'underbar'
                cont_dragging = false
            } else if(isInRange(e.clientX, dragRange, innerWidth / 100 * (msl)) && e.clientY < (innerHeight / 100 * (100-ubl))){
                Dragging = 'mainset'
                cont_dragging = false
            } else if(isInRange(e.clientX, dragRange, innerWidth / 100 * (100-esl)) && e.clientY < (innerHeight / 100 * (100-ubl))){
                Dragging = 'eventset'
                cont_dragging = false
            } else if(isInRange(e.clientX, dragRange, innerWidth / 100 * (obl)) && e.clientY > (innerHeight / 100 * (100-ubl))){
                Dragging = 'objs'
                cont_dragging = false
            }
        }
        function mousemove(e:MouseEvent){
            if(Dragging){
                switch(Dragging){
                    case 'underbar':
                        ubl = 100 - (100 * e.clientY / innerHeight)
                        setUnderbarLine(ubl)
                        break;
                    case 'mainset':
                        msl = (100 * e.clientX / innerWidth)
                        setMainsetLine(msl)
                        break;
                        case 'eventset':
                        esl = 100 - (100 * e.clientX / innerWidth)
                        setEventsetLine(esl)
                        break;
                    case 'objs':
                        obl = (100 * e.clientX / innerWidth)
                        setObjLine(obl)
                        break;
                }
                resizeCanvas()
            } else {
                if(isInRange(e.clientY, dragRange, innerHeight / 100 * (100-ubl))){
                    document.body.style.cursor = 'n-resize'
                } else if(isInRange(e.clientX, dragRange, innerWidth / 100 * (msl)) && e.clientY < (innerHeight / 100 * (100-ubl))){
                    document.body.style.cursor = 'e-resize'
                } else if(isInRange(e.clientX, dragRange, innerWidth / 100 * (100-esl)) && e.clientY < (innerHeight / 100 * (100-ubl))){
                    document.body.style.cursor = 'e-resize'
                } else if(isInRange(e.clientX, dragRange, innerWidth / 100 * (obl)) && e.clientY > (innerHeight / 100 * (100-ubl))){
                    document.body.style.cursor = 'e-resize'
                } else {
                    document.body.style.cursor = 'unset'
                }
            }
        }
        
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mousedown', mousedown)
        document.addEventListener('mouseup', mouseup)
        document.addEventListener('wheel', wheel)
        document.addEventListener('keydown', keydown)
        return () => {
            document.removeEventListener('mousemove', mousemove)
            document.removeEventListener('mousedown', mousedown)
            document.removeEventListener('mouseup', mouseup)
            document.removeEventListener('wheel', wheel)
            document.removeEventListener('keydown', keydown)
        }
    }, [])
    
    const reset = () => {
        setGrid(4)
        setBpm(100)
        setSong("")
        setOffset(0)
        setBackgroundColor("#000000")
        setVolume(100)
        setEndpoint(90)
        setPlaying(false)
        setZoom(100)
    }

    const openLevel = () => {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        fileInput.click()
    
        fileInput.addEventListener('change', (e) => {
            const selectedFile = (fileInput.files as FileList)[0];

            if (selectedFile) {
                const reader = new FileReader();

                reader.onload = (event) => {
                    const level = JSON.parse(event.target?.result as string) as level;
                    console.log(level);

                    // statement 적용
                    setBpm(level.bpm)
                    setOffset(level.offset)
                    setSong(level.song)
                    setBackgroundColor(level.backgroundColor)
                    setVolume(level.volume)
                    setEndpoint(level.endpoint)
                };

                reader.readAsText(selectedFile);
            }
        });
    }

    const exportLevel = () => {

    }

    async function playLevel (){
        const audio = document.querySelector('audio') as HTMLAudioElement
        v_playing = playing
        if(v_playing){
            audio.pause()
            v_playing = false
            setPlaying(v_playing)
        } else {
            await audio.play()
            v_playing = true
            setPlaying(v_playing)
        }
    }

    const v_setTimeline = (e:number) => {
        const audio = document.querySelector('audio') as HTMLAudioElement
        v_timeline = e
        audio.currentTime = v_timeline+offset
        setTimeline(v_timeline)
    }

    useEffect(() => {
        const controls = document.querySelector('.controls') as HTMLDivElement

        const checkEnd = setInterval(() => {
            const audio = document.querySelector('audio') as HTMLAudioElement
            v_timeline = audio.currentTime - offset
            setTimeline(v_timeline)
            if(v_timeline > endpoint){
                audio.pause()
                audio.currentTime = offset
                v_playing = false
                setPlaying(v_playing)
            }
        }, 1)
        function mousemove(e:MouseEvent){
            if(cont_dragging){
                let res = endpoint * (e.clientX - innerWidth/100*obl) / (innerWidth/100*(100-obl))
                v_setTimeline(res < 0 ? 0 : res > endpoint ? endpoint : res)
            }
        }
        function mouseup(e:MouseEvent){
            cont_dragging = false
        }
        function controls_mousedown(e:MouseEvent){
            if(!Dragging){
                cont_dragging = true
                Dragging = ''
                mousemove(e)
            }
        }
        const keydown = (e:KeyboardEvent) => {
            if(e.code == 'Space'){
                playLevel()
            } else if(e.code == 'Home'){
                v_setTimeline(0)
            } else if(e.code == 'End'){
                v_setTimeline(endpoint)
            }
        }
        controls.addEventListener('mousedown', controls_mousedown)
        document.addEventListener('mouseup', mouseup)
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('keydown', keydown)
        return () => {
            clearInterval(checkEnd)
            document.removeEventListener('keydown', keydown)
            controls.removeEventListener('mousedown', controls_mousedown)
            document.removeEventListener('mouseup', mouseup)
            document.removeEventListener('mousemove', mousemove)
        }
    }, [endpoint, playing, offset])

    useEffect(() => {
        const audio = document.querySelector('audio') as HTMLAudioElement
        audio.volume = volume/100
    }, [volume])

    useEffect(() => {
        let c = (60/bpm/grid)
        let arr = []
        for(let i = 0; i < Math.floor(endpoint/c); i++){
            arr.push(i*c)
        }
        setGridLine(arr)
    }, [bpm, grid, endpoint])

    return <div className="Editor">
        <div style={{height:`${100-underbarLine}%`}} className="workspace">
            <div style={{width:`${mainsetLine}%`}} className="mainset">
                <div>
                    <button onClick={e => reset()}>New</button>
                    <button onClick={e => openLevel()}>Open</button>
                    <button onClick={e => exportLevel()}>Export</button>
                </div>
                <div>
                    <button onClick={e => v_setTimeline(0)}>Home</button>
                    <button className="playlevel" onClick={e => playLevel()}>{playing ? 'Stop' : 'Play'}</button>
                    <button onClick={e => v_setTimeline(endpoint)}>End</button>
                </div>
                <div>Grid<input type="text" name="" id="" value={grid} onChange={e => setGrid(+e.target.value)} /></div>
                <div>BPM<input type="text" name="" id="" value={bpm} onChange={e => setBpm(+e.target.value)} /></div>
                <div>Offsets<input type="text" name="" id="" value={offset} onChange={e => setOffset(+e.target.value)} /></div>
                <div>Song<input type="text" name="" id="" value={song} onChange={e => setSong(e.target.value)} /></div>
                <div>BackgroundColor<input type="color" name="" id="" value={BackgroundColor} onChange={e => setBackgroundColor(e.target.value)}/></div>
                <div>Volume<input type="text" name="" id="" value={volume} onChange={e => setVolume(+e.target.value)}/></div>
                <div>Endpoint<input type="text" name="" id="" value={`${Math.floor(endpoint/60)}:${endpoint%60}`}
                onChange={e => {
                    let time:number[] = e.target.value.split(':').map(v => +v)
                    setEndpoint((time[0]*60 + time[1]))
                }}/></div>
            </div>
            <div style={{width:`${100-mainsetLine-eventsetLine}%`}} className="scene"><canvas></canvas></div>
            <div style={{width:`${eventsetLine}%`}} className="eventset">this is eventset</div>
        </div>
        <div style={{height:`${underbarLine}%`}} className="underbar">
            <div style={{width:`${objLine}%`}} className="objs">
                <div className="description">Objects</div>
            </div>
            <div style={{width:`${100-objLine}%`}} className="timeline">
                <div className="controls">
                    <div style={{marginLeft:`${condset[0] /100 * (100-objLine) * timeline / endpoint - 11}px`}} className="timelineGrab"></div>
                </div>
                <div className="overlay">
                    {gridLine.map((v, i) => (
                        <div style={{marginLeft:`${condset[0] /100 * (100-objLine) * v / endpoint}px`}}
                        className={i % grid == 0 ? 'grid' : 'grid m'} key={i}></div>
                    ))}
                    <div className="bar" style={{marginLeft:`${condset[0] /100 * (100-objLine) * timeline / endpoint}px`}}></div>
                </div>
                <div className="events">
                    <div>eventline</div>
                </div>
            </div>
        </div>
        <input type="file" name="" id="fileInput" style={{display:'none'}} />
        <audio src={song} style={{display:'none'}}></audio>
    </div>
}