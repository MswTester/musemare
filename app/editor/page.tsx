'use client'

import { ContextType, useEffect, useState } from "react"
import { isInRange } from "../data/utils"
import { obj, event, level, objEvent, mainEvType, eventProps, objEventProps } from "../data/types"
import { drawRect } from "../logic/canvasDrawer"
import { render } from "../logic/battleEngine"

const dragRange = 6

export default function Page(){
    const [lang, setLang] = useState<string>('en-US')
    // ui settings
    const [underbarLine, setUnderbarLine] = useState<number>(30)
    const [mainsetLine, setMainsetLine] = useState<number>(20)
    const [eventsetLine, setEventsetLine] = useState<number>(20)
    const [objLine, setObjLine] = useState<number>(20)
    const [condset, setCondset] = useState<number[]>([0, 0])
    const [rowScroll, setRowScroll] = useState<number>(0)

    // default settings
    const [bpm, setBpm] = useState<number>(100)
    const [offset, setOffset] = useState<number>(0)
    const [song, setSong] = useState<string>('')
    const [BackgroundColor, setBackgroundColor] = useState<string>('#000000')
    const [volume, setVolume] = useState<number>(100)
    const [endpoint, setEndpoint] = useState<number>(90)
    const [events, setEvents] = useState<event[]>([])
    const [objs, setObjs] = useState<obj[]>([])

    // env settings
    const [grid, setGrid] = useState<number>(4)
    const [playing, setPlaying] = useState<boolean>(false)
    const [zoom, setZoom] = useState<number>(100)
    const [timeline, setTimeline] = useState<number>(0)
    const [gridLine, setGridLine] = useState<number[]>([])
    const [sel, setSel] = useState<'chart'|'sprite'>('chart')
    const [focusEvent, setFocusEvent] = useState<[number, number]>([-1, 0]) // 0 = main | other = obj's idx, index
    const [focusNote, setFocusNote] = useState<[number, number]>([-1, 0]) // obj's idx, index
    const [focusObj, setFocusObj] = useState<number>(0)
    const [focusing, setFocusing] = useState<number>(0) // 0 = obj, 1 = event, 2 = note
    const [evClipboard, setEvClipboard] = useState<event|objEvent>()

    let v_playing:boolean = false, v_zoom:number = 100, v_timeline = 0
    
    let ubl = 30
    let msl = 20
    let esl = 20
    let obl = 20
    let Dragging = ''
    let cont_dragging = false
    let scrow_dragging = false
    
    useEffect(() => {
        setLang(navigator.language)
        setCondset([innerWidth, innerHeight])

        const canvas = document.querySelector('canvas') as HTMLCanvasElement
        
        function resizeCanvas(){
            setCondset([innerWidth, innerHeight])
            canvas.width = innerWidth / 100 * (100 - msl - esl)
            canvas.height = innerHeight / 100 * (100 - ubl)
        }
        window.onresize = resizeCanvas
        resizeCanvas()

        function keydown(e:KeyboardEvent){
            if(e.altKey){
                e.preventDefault()
            }
        }
        function mouseup(e:MouseEvent){
            Dragging = ''
        }
        function mousedown(e:MouseEvent){
            if(isInRange(e.clientY, dragRange, innerHeight / 100 * (100-ubl))){
                Dragging = 'underbar'
            } else if(isInRange(e.clientX, dragRange, innerWidth / 100 * (msl)) && e.clientY < (innerHeight / 100 * (100-ubl))){
                Dragging = 'mainset'
            } else if(isInRange(e.clientX, dragRange, innerWidth / 100 * (100-esl)) && e.clientY < (innerHeight / 100 * (100-ubl))){
                Dragging = 'eventset'
            } else if(isInRange(e.clientX, dragRange, innerWidth / 100 * (obl)) && e.clientY > (innerHeight / 100 * (100-ubl))){
                Dragging = 'objs'
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
        
        function wheel(e:WheelEvent){
            if(e.altKey){
                v_zoom -= (v_zoom/8)*(e.deltaY / 100)
                v_zoom < 1 && (v_zoom = 1)
                setZoom(v_zoom)
            }
        }
        const contextmenu = (e:Event) => {
            e.preventDefault()
        }
        
        document.addEventListener('wheel', wheel)
        document.addEventListener('contextmenu', contextmenu)
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mousedown', mousedown)
        document.addEventListener('mouseup', mouseup)
        document.addEventListener('keydown', keydown)
        return () => {
            document.removeEventListener('wheel', wheel)
            document.removeEventListener('contextmenu', contextmenu)
            document.removeEventListener('mousemove', mousemove)
            document.removeEventListener('mousedown', mousedown)
            document.removeEventListener('mouseup', mouseup)
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
        setRowScroll(0)
        v_setTimeline(0)
        setEvents([])
        setObjs([])
        v_playing = false
        v_zoom = 0
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
                    setObjs(level.objs)
                    setEvents(level.events)
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
        const scrowbar = document.querySelector('.scrollbar-row > div') as HTMLDivElement

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
                let res:number = (endpoint * (e.clientX-rowScroll - innerWidth/100*objLine) / (innerWidth/100*(100-objLine)))/(zoom/100)
                if(e.shiftKey){
                    let rz = 5-Math.round(zoom/100)
                    let f = (2**(rz < 1 ? 1 : rz))
                    let gap = (gridLine[1] - gridLine[0]) * f
                    res = Math.round(res / gap) * gap
                }
                v_setTimeline(res < 0 ? 0 : res > endpoint ? endpoint : res)
            } else if(scrow_dragging) {
                // scroll logic
            }
        }
        function mouseup(e:MouseEvent){
            cont_dragging = false
            scrow_dragging = false
        }
        function controls_mousedown(e:MouseEvent){
            if(!Dragging){
                cont_dragging = true
                Dragging = ''
                mousemove(e)
            }
        }
        function scrowbar_mousedown(e:MouseEvent){
            if(!Dragging){
                scrow_dragging = true
                Dragging = ''
                mousemove(e)
            }
        }
        const keydown = (e:KeyboardEvent) => {
            let isNumlock = e.getModifierState('NumLock')
            // console.log(e.code)
            if(e.code == 'Space'){
                playLevel()
            } else if(e.code == 'Home' || (e.code == 'Numpad7' && !isNumlock)){
                v_setTimeline(0)
            } else if(e.code == 'End' || (e.code == 'Numpad1' && !isNumlock)){
                v_setTimeline(endpoint)
            } else if(e.code == 'Backquote'){
                setRowScroll(0)
            }
        }
        scrowbar.addEventListener('mousedown', scrowbar_mousedown)
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
    }, [endpoint, playing, offset, objLine, zoom, gridLine, rowScroll])

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
        arr.push(endpoint)
        setGridLine(arr)
    }, [bpm, grid, endpoint])

    useEffect(() => {
        const ev = document.querySelector('.timeline') as HTMLDivElement
        function wheelev(e:WheelEvent){
            if(!e.altKey){
                let res = rowScroll-e.deltaY
                setRowScroll(res > 0 ? 0 : res)
            }
        }
        ev.addEventListener('wheel', wheelev)
        return () => {
            ev.removeEventListener('wheel', wheelev)
        }
    }, [rowScroll])

    
    const addObj = () => {
        let _arr:obj[] = JSON.parse(JSON.stringify(objs))
        let _obj:obj = {anchor:[0, 0],events:[],opacity:1,position:[50, 50],rotate:0,scale:[1, 1],type:sel}
        if(sel == "chart"){
            _obj['bpm'] = bpm
            _obj['ease'] = 'linear'
            _obj['notes'] = []
        } else if(sel == "sprite"){
            _obj['src'] = ''
        }
        _arr.push(_obj)
        setObjs(_arr)
    }

    const remObj = (_i:number) => {
        let _arr:obj[] = JSON.parse(JSON.stringify(objs))
        _arr.splice(_i, 1)
        setObjs(_arr)
    }
    
    const addEv = (_opt?:event) => {
        let _arr:event[] = JSON.parse(JSON.stringify(events))
        let _d = _opt
        _d ? _d.stamp = timeline : _d
        _arr.push(_d || {stamp:timeline, type:'volume', value:100, duration:60/bpm, ease:'linear', smooth:true, speed:10})
        _arr = _arr.sort((_a, _b) => _a.stamp - _b.stamp)
        setEvents(_arr)
    }
    
    const remEv = (_idx:number) => {
        let _arr:event[] = JSON.parse(JSON.stringify(events))
        _arr.splice(_idx, 1)
        _arr = _arr.sort((_a, _b) => _a.stamp - _b.stamp)
        setEvents(_arr)
    }
    
    const addObjEv = (_i:number, _opt?:objEvent) => {
        let _arr:obj[] = JSON.parse(JSON.stringify(objs))
        let _d = _opt
        _d ? _d.stamp = timeline : _d
        _arr[_i].events.push(_d || {stamp:timeline, type:'transform', value:[50, 50], ease:'linear', duration:60/bpm})
        _arr[_i].events = _arr[_i].events.sort((_a, _b) => _a.stamp - _b.stamp)
        setObjs(_arr)
    }

    const remObjEv = (_oi:number, _i:number) => {
        let _arr:obj[] = JSON.parse(JSON.stringify(objs))
        _arr[_oi].events.splice(_i, 1)
        _arr[_oi].events = _arr[_oi].events.sort((_a, _b) => _a.stamp - _b.stamp)
        setObjs(_arr)
    }
    
    const addChartNote = (_i:number) => {
        let _arr:obj[] = JSON.parse(JSON.stringify(objs))
        _arr[_i].notes?.push(timeline)
        _arr[_i].notes = _arr[_i].notes?.sort((_a, _b) => _a - _b)
        setObjs(_arr)
    }

    const remChartNote = (_oi:number, _i:number) => {
        let _arr:obj[] = JSON.parse(JSON.stringify(objs))
        _arr[_oi].notes?.splice(_i, 1)
        _arr[_oi].notes = _arr[_oi].notes?.sort((_a, _b) => _a - _b)
        setObjs(_arr)
    }

    const setObjProperty = (_i:number, _type:string, _v:any) => {
        let _arr:obj[] = JSON.parse(JSON.stringify(objs))
        if(_type == 'position'){
            _arr[_i].position[_v[0]] = _v[1]
        } else if(_type == 'rotate'){
            _arr[_i].rotate = _v
        } else if(_type == 'scale'){
            _arr[_i].scale[_v[0]] = _v[1]
        } else if(_type == 'opacity'){
            _arr[_i].opacity = _v
        } else if(_type == 'anchor'){
            _arr[_i].anchor[_v[0]] = _v[1]
        } else {
            _arr[_i][_type as 'bpm'|'src'|'ease'] = _v
        }
        setObjs(_arr)
    }

    const setEv = (_i:number, _t:eventProps, _v:any):void => {
        let _arr:event[] = JSON.parse(JSON.stringify(events))
        _t == 'type' ? _v == 'bgcolor' ? _arr[_i].value = '#000000' : _arr[_i].value = 100 : ''
        _arr[_i][_t] = _t == 'value' ? Number.isNaN(+_v) ? _v : +_v : _v
        setEvents(_arr)
    }

    const setObjEv = (_oi:number, _i:number, _t:objEventProps, _v:any):void => {
        let _arr:obj[] = JSON.parse(JSON.stringify(objs))
        if(_t == 'type'){
            _arr[_oi].events[_i].value =
            ['rotate', 'opacity'].includes(_v) ? 0 :
            _v == 'speed' ? 100 :
            _v == 'change' ? '' :
            ['transform', 'scale', 'anchor'].includes(_v) ? [0, 0] :
            _v == 'ease' ? 'linear' :
            _v == 'visible' || ''
        }
        _arr[_oi].events[_i][_t] = _v
        setObjs(_arr)
    }

    // 오브젝트 및 이벤트 선택 & 삭제 & 해제 & 수정
    useEffect(() => {
        function keydown(e:KeyboardEvent){
            // 옵젝 & 이벤트 삭제
            if(e.code == 'Delete'){
                if(focusing == 0){
                    if(focusObj != 0){
                        remObj(focusObj-1)
                        setFocusObj(0)
                    }
                } else if(focusing == 1){
                    if(focusEvent[0] == 0){
                        remEv(focusEvent[1])
                        setFocusEvent([-1, 0])
                    } else if(focusEvent[0] > 0){
                        remObjEv(focusEvent[0]-1, focusEvent[1])
                        setFocusEvent([-1, 0])
                    }
                } else if(focusing == 2 && focusNote[0] != -1){
                    remChartNote(...focusNote)
                    setFocusNote([-1, 0])
                }
            } else if(e.code == 'ArrowLeft' || e.code == 'ArrowRight'){
                if(focusing == 1 && focusEvent[0] > -1){
                    let _evLen:number = focusEvent[0] == 0 ? events.length : objs[focusEvent[0]-1].events.length
                    let _idx:number = focusEvent[1]
                    _idx += e.code == 'ArrowLeft' ? -1 : 1
                    _idx = _idx < 0 ? 0 : _idx+1 > _evLen ? _evLen-1 : _idx
                    setFocusEvent([focusEvent[0], _idx])
                } else if(focusing == 2 && focusNote[0] > -1){
                    let _ntLen:number = objs[focusNote[0]].notes?.length || 0
                    let _idx:number = focusNote[1]
                    _idx += e.code == 'ArrowLeft' ? -1 : 1
                    _idx = _idx < 0 ? 0 : _idx+1 > _ntLen ? _ntLen-1 : _idx
                    setFocusNote([focusNote[0], _idx])
                }
            } else if((e.code == 'KeyC' || e.code == 'KeyX') && e.ctrlKey){
                let cb:event | objEvent = JSON.parse(JSON.stringify(focusEvent[0] == 0 ? events[focusEvent[1]] : objs[focusEvent[0]-1].events[focusEvent[1]]))
                if(e.code == 'KeyX') {
                    focusEvent[0] == 0 ? remEv(focusEvent[1]) : remObjEv(focusEvent[0]-1, focusEvent[1])
                    setFocusEvent([-1, 0])
                }
                setEvClipboard(cb)
        } else if(e.code == 'KeyV' && e.ctrlKey){
                let isCbMainEv:boolean = (evClipboard as event).speed == undefined ? false : true
                focusObj == 0 ? isCbMainEv && addEv(evClipboard as event) : !isCbMainEv && addObjEv(focusObj-1, evClipboard as objEvent)
            }
        }

        document.addEventListener('keydown', keydown)
        return () => {
            document.removeEventListener('keydown', keydown)
        }
    }, [events, objs, focusEvent, focusObj, focusNote, focusing, evClipboard, timeline])

    useEffect(() => {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement
        const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D
        if(ctx && canvas){
            render(canvas, timeline, {events, objs, backgroundColor:BackgroundColor, volume})
        }
    }, [events, objs, timeline, BackgroundColor, volume])


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
                <hr />
                {
                    focusObj == 0 ? <>
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
                    </>:<>
                        <div>Position<input type="number" name="" id="" value={objs[focusObj-1].position[0]} onChange={e => setObjProperty(focusObj-1, 'position', [0, +e.target.value])}/>
                        <input type="number" name="" id="" value={objs[focusObj-1].position[1]} onChange={e => setObjProperty(focusObj-1, 'position', [1, +e.target.value])}/></div>
                        <div>Rotate<input type="number" name="" id="" value={objs[focusObj-1].rotate} onChange={e => setObjProperty(focusObj-1, 'rotate', +e.target.value)}/></div>
                        <div>Scale<input type="number" name="" id="" value={objs[focusObj-1].scale[0]} onChange={e => setObjProperty(focusObj-1, 'scale', [0, +e.target.value])}/>
                        <input type="number" name="" id="" value={objs[focusObj-1].scale[1]} onChange={e => setObjProperty(focusObj-1, 'scale', [1, +e.target.value])}/></div>
                        <div>Opacity<input type="number" name="" id="" value={objs[focusObj-1].opacity} onChange={e => setObjProperty(focusObj-1, 'opacity', +e.target.value)}/></div>
                        <div>Anchor<input type="number" name="" id="" value={objs[focusObj-1].anchor[0]} onChange={e => setObjProperty(focusObj-1, 'anchor', [0, +e.target.value])}/>
                        <input type="number" name="" id="" value={objs[focusObj-1].anchor[1]} onChange={e => setObjProperty(focusObj-1, 'anchor', [1, +e.target.value])}/></div>
                        {objs[focusObj-1].type == 'chart' && <div>BPM<input type="number" name="" id="" value={objs[focusObj-1].bpm}
                        onChange={e => setObjProperty(focusObj-1, 'bpm', +e.target.value)}/></div>}
                        {objs[focusObj-1].type == 'chart' && <div>Ease <select name="" id="" value={objs[focusObj-1].ease}
                        onChange={e => setObjProperty(focusObj-1, 'ease', e.target.value)}>
                            <option value="linear">Linear</option>
                            <option value="insine">In-Sine</option>
                            <option value="outsine">Out-Sine</option>
                            <option value="sine">Sine</option>
                        </select></div>}
                        {objs[focusObj-1].type == 'sprite' && <div>Src<input type="text" name="" id="" value={objs[focusObj-1].src}
                        onChange={e => setObjProperty(focusObj-1, 'src', e.target.value)}/></div>}
                    </>
                }
            </div>
            <div style={{width:`${100-mainsetLine-eventsetLine}%`}} className="scene"><canvas style={{backgroundColor:BackgroundColor}}></canvas></div>
            <div style={{width:`${eventsetLine}%`}} className="eventset">
                {focusEvent[0] == 0 ? <>
                    <div>TimeStamp<input type="text" name="" id="" value={events[focusEvent[1]].stamp} onChange={e => setEv(focusEvent[1], 'stamp', +e.target.value)}/></div>
                    <div>Type<select name="" id="" value={events[focusEvent[1]].type} onChange={e => setEv(focusEvent[1], 'type', e.target.value)}>
                        <option value="volume">Volume</option>
                        <option value="bgcolor">BackgroundColor</option>
                        <option value="filter">Filter</option>
                        <option value="wiggle">Wiggle</option>
                    </select></div>
                    {['volume', 'filter', 'wiggle'].includes(events[focusEvent[1]].type) && <div>Value<input type="text" name="" id=""
                    value={events[focusEvent[1]].value} onChange={e => setEv(focusEvent[1], 'value', e.target.value)}/></div>}
                    {['bgcolor'].includes(events[focusEvent[1]].type) && <div>Value<input type="color" name="" id=""
                    value={events[focusEvent[1]].value} onChange={e => setEv(focusEvent[1], 'value', e.target.value)}/></div>}
                    {['volume', 'filter', 'bgcolor', 'wiggle'].includes(events[focusEvent[1]].type) && <div>Duration<input type="number" name="" id=""
                    value={events[focusEvent[1]].duration} onChange={e => setEv(focusEvent[1], 'duration', e.target.value)}/></div>}
                    {['wiggle'].includes(events[focusEvent[1]].type) && <div>Wiggle Speed<input type="number" name="" id=""
                    value={events[focusEvent[1]].speed} onChange={e => setEv(focusEvent[1], 'speed', e.target.value)}/></div>}
                    {['wiggle'].includes(events[focusEvent[1]].type) && <div>Wiggle Smooth End<input type="checkbox" name="" id=""
                    checked={events[focusEvent[1]].smooth} onChange={e => setEv(focusEvent[1], 'smooth', e.target.checked)}/></div>}
                </>:
                focusEvent[0] > 0 ? <>
                    <div>TimeStamp<input type="text" name="" id="" value={objs[focusEvent[0]-1].events[focusEvent[1]].stamp} onChange={e => setObjEv(focusEvent[0]-1, focusEvent[1], 'stamp', +e.target.value)}/></div>
                    <div>Type<select name="" id="" value={objs[focusEvent[0]-1].events[focusEvent[1]].type} onChange={e => setObjEv(focusEvent[0]-1, focusEvent[1], 'type', e.target.value)}>
                        <option value="transform">Transform</option>
                        <option value="rotate">Rotate</option>
                        <option value="scale">Scale</option>
                        <option value="opacity">Opacity</option>
                        <option value="anchor">Anchor</option>
                        {objs[focusEvent[0]-1].type == 'chart' && <option value="speed">BPM</option>}
                        {objs[focusEvent[0]-1].type == 'chart' && <option value="ease">Ease</option>}
                        <option value="visible">Visible</option>
                        {objs[focusEvent[0]-1].type == 'sprite' && <option value="change">Change Image</option>}
                    </select></div>
                    {['transform', 'rotate', 'scale', 'opacity', 'anchor', 'speed'].includes(objs[focusEvent[0]-1].events[focusEvent[1]].type) && <div>Duration<input type="number" name="" id=""
                    value={objs[focusEvent[0]-1].events[focusEvent[1]].duration} onChange={e => setObjEv(focusEvent[0]-1, focusEvent[1], 'duration', e.target.value)}/></div>}
                    {['transform', 'rotate', 'scale', 'opacity', 'anchor', 'speed'].includes(objs[focusEvent[0]-1].events[focusEvent[1]].type) && <div>Ease<select name="" id=""
                    value={objs[focusEvent[0]-1].events[focusEvent[1]].ease} onChange={e => setObjEv(focusEvent[0]-1, focusEvent[1], 'ease', e.target.value)}>
                        <option value="linear">Linear</option>
                        <option value="insine">In-Sine</option>
                        <option value="outsine">Out-Sine</option>
                        <option value="sine">Sine</option>
                    </select></div>}
                    {['rotate', 'opacity', 'speed', 'change'].includes(objs[focusEvent[0]-1].events[focusEvent[1]].type) ? <div>Value<input type="text" name="" id=""
                    value={objs[focusEvent[0]-1].events[focusEvent[1]].value} onChange={e => setObjEv(focusEvent[0]-1, focusEvent[1], 'value', e.target.value)}/></div>:
                    ['transform', 'scale', 'anchor'].includes(objs[focusEvent[0]-1].events[focusEvent[1]].type) ? <div>Value<input type="number" name="" id=""
                    value={objs[focusEvent[0]-1].events[focusEvent[1]].value[0]} onChange={e => setObjEv(focusEvent[0]-1, focusEvent[1], 'value', [+e.target.value, objs[focusEvent[0]-1].events[focusEvent[1]].value[1]])}/>
                    <input type="number" name="" id="" value={objs[focusEvent[0]-1].events[focusEvent[1]].value[1]} onChange={e => setObjEv(focusEvent[0]-1, focusEvent[1], 'value', [objs[focusEvent[0]-1].events[focusEvent[1]].value[0], +e.target.value])}/></div>:
                    ['ease'].includes(objs[focusEvent[0]-1].events[focusEvent[1]].type) ? <div>EaseType<select name="" id="" value={objs[focusEvent[0]-1].events[focusEvent[1]].ease} onChange={e => setObjEv(focusEvent[0]-1, focusEvent[1], 'ease', e.target.value)}>
                        <option value="linear">Linear</option>
                        <option value="insine">In-Sine</option>
                        <option value="outsine">Out-Sine</option>
                        <option value="sine">Sine</option>
                    </select></div>:
                    ['visible'].includes(objs[focusEvent[0]-1].events[focusEvent[1]].type) && <div>Visible<input type="checkbox" name="" id=""
                    checked={objs[focusEvent[0]-1].events[focusEvent[1]].value} onChange={e => setObjEv(focusEvent[0]-1, focusEvent[1], 'value', e.target.checked)}/></div>
                    }
                </>:<></>}
            </div>
        </div>
        <div style={{height:`${underbarLine}%`}} className="underbar">
            <div style={{width:`${objLine}%`}} className="objs">
                <div className="description">Objects {timeline.toFixed(3)}
                    <div className="right">
                    <select name="" id="" value={sel} onChange={e => setSel(e.target.value as 'chart'|'sprite')}>
                        <option value="chart">Chart</option>
                        <option value="sprite">Sprite</option>
                    </select>
                    <button onClick={e => addObj()}>+</button></div>
                </div>
                <div className={focusObj == 0 ? 'selected' : ''} onClick={e => {setFocusObj(0);setFocusing(0)}}>Main<button onClick={e => addEv()}>Add Event</button></div>
                {objs.map((v, i) => (
                    <div key={i} className={focusObj == i+1 ? 'selected' : ''} onClick={e => {setFocusObj(i+1);setFocusing(0)}}>{`Obj${i+1}`}
                    {v.type == 'chart' && <button onClick={e => addChartNote(i)}>Add Note</button>}
                    <button onClick={e => addObjEv(i)}>Add Event</button></div>
                ))}
            </div>
            <div style={{width:`${100-objLine}%`}} className="timeline">
                <div className="controls">
                    <div style={{marginLeft:`${(condset[0] /100 * (100-objLine) * timeline / endpoint)*(zoom/100) + rowScroll - 11}px`}} className="timelineGrab"></div>
                </div>
                <div className="overlay">
                    {gridLine.map((v, i) => (
                        (condset[0] /100 * (100-objLine) * v / endpoint)*(zoom/100) + rowScroll >= 0 && (
                        i == 0 ? <div key={i} style={{marginLeft:`${rowScroll}px`}} className="grid start"></div> :
                        i+1 == gridLine.length ? <div key={i} style={{marginLeft:`${(condset[0] /100 * (100-objLine))*(zoom/100) + rowScroll}px`}} className="grid end"></div> :
                        i % (2**(5-Math.round(zoom/100) < 1 ? 1 : 5-Math.round(zoom/100))) == 0 &&
                        <div style={{marginLeft:`${(condset[0] /100 * (100-objLine) * v / endpoint)*(zoom/100) + rowScroll}px`}}
                        className={i % (grid*(2**(5-Math.round(zoom/100) < 1 ? 1 : 5-Math.round(zoom/100)))) == 0 ? 'grid' : 'grid m'} key={i}></div>)
                    ))}
                    <div className="bar" style={{marginLeft:`${(condset[0] /100 * (100-objLine) * timeline / endpoint)*(zoom/100) + rowScroll}px`}}></div>
                </div>
                <div className="events">
                    <div>
                        {events.map((v, i) => (
                            (condset[0] /100 * (100-objLine) * v.stamp / endpoint)*(zoom/100) + rowScroll >= 0 &&
                            <div key={i} style={{marginLeft:`${(condset[0] /100 * (100-objLine) * v.stamp / endpoint)*(zoom/100) + rowScroll - 8}px`}}
                            className={`box ${focusEvent[0] == 0 && focusEvent[1] == i ? 'selected' : ''}`}
                            onClick={e => {setFocusEvent([0, i]);setFocusing(1)}}></div>
                            ))}
                    </div>
                    {objs.map((v, i) => (
                        <div key={i} style={{marginTop:`${(i+1)*25.5}px`}}>
                            {v.events.map((v2, i2) => (
                                (condset[0] /100 * (100-objLine) * v2.stamp / endpoint)*(zoom/100) + rowScroll >= 0 &&
                                <div key={i2} style={{marginLeft:`${(condset[0] /100 * (100-objLine) * v2.stamp / endpoint)*(zoom/100) + rowScroll - 8}px`}}
                                className={`box ${focusEvent[0] == i+1 && focusEvent[1] == i2 ? 'selected' : ''}`}
                                onClick={e => {setFocusEvent([i+1, i2]);setFocusing(1)}}></div>
                            ))}
                            {v.type == 'chart' ? v.notes?.map((v2, i2) => (
                                (condset[0] /100 * (100-objLine) * v2 / endpoint)*(zoom/100) + rowScroll >= 0 &&
                                <div key={i2} style={{marginLeft:`${(condset[0] /100 * (100-objLine) * v2 / endpoint)*(zoom/100) + rowScroll - 8}px`}}
                                className={`note ${focusNote[0] == i && focusNote[1] == i2 ? 'selected' : ''}`}
                                onClick={e => {setFocusNote([i, i2]);setFocusing(2)}}></div>
                            )) : <></>}
                        </div>
                    ))}
                </div>
                <div className="scrollbar-row" style={{width:`${100-objLine}%`}}><div
                style={{width:`${(condset[0] /100 * (100-objLine)) /(zoom/100)}px`,
                marginLeft:`${((condset[0] /100 * (100-objLine))-(condset[0] /100 * (100-objLine)/(zoom/100)))*(-rowScroll)/((condset[0] /100 * (100-objLine)) * (zoom/100) - (condset[0] /100 * (100-objLine)))}px`}}></div></div>
            </div>
        </div>
        <input type="file" name="" id="fileInput" style={{display:'none'}} />
        <audio src={song} style={{display:'none'}}></audio>
    </div>
}