'use client'

import { useContext, useEffect, useState } from "react"
import { Msprite, camera, env, eventName, map, player, text } from "../data/types"
import { globalConfig, globalContext } from "../main"
import { useInterval, useWindowSize } from "usehooks-ts"
import { exRender, execute } from "../logic/exploreEngine"
import { MsArrToRsArr, copy } from "../data/utils"
import { defaultConfig } from "next/dist/server/config-shared"

export default function Page(){
    const { width, height } = useWindowSize()
    const {lang, setLang} = useContext(globalContext)
    const [env, setEnv] = useState<env>({keys:{
        playerLeft:'KeyA',
        playerRight:'KeyD',
        playerJump:'Space',
        playerRun:'ShiftLeft',
        playerSneak:'ControlLeft',
        interaction:'KeyF',
        escape:'Escape',
    }})
    const [focusing, setFocusing] = useState<number>(-1)

    const [start, setStart] = useState<boolean>(false)
    const [inputs, setInputs] = useState<string[]>([])
    const [sprites, setSprites] = useState<Msprite[]>([])
    const [texts, setTexts] = useState<text[]>([])
    const [gravity, setGravity] = useState<number>(0.3)
    const [canControl, setCanControl] = useState<boolean>(true)
    const [player, setPlayer] = useState<player>(globalConfig['defaultPlayer'])
    const [camera, setCamera] = useState<camera>(globalConfig['defaultCamera'])
    const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff')
    const [ground, setGround] = useState<number>(500)

    useEffect(() => {
        setStart(true)
    }, [])

    useEffect(() => {
        const keydown = (e:KeyboardEvent) => {addInput(e.code)}
        const keyup = (e:KeyboardEvent) => {remInput(e.code)}
        document.addEventListener('keydown', keydown)
        document.addEventListener('keyup', keyup)
        return () => {
            document.removeEventListener('keydown', keydown)
            document.removeEventListener('keyup', keyup)
        }
    }, [inputs])

    const addInput = (key:string) => {
        let _ar:string[] = copy(inputs)
        if(!_ar.includes(key)) _ar.push(key)
        sendEvent('keydown')
        setInputs(_ar)
    }
    const remInput = (key:string) => {
        let _ar:string[] = copy(inputs)
        let _i:number = _ar.indexOf(key)
        _i != -1 ? _ar.splice(_i, 1) : null
        sendEvent('keyup')
        setInputs(_ar)
    }

    useInterval(() => {
        const _ar = execute(lang, sprites, gravity, inputs, env, player, camera, ground)
        setSprites(_ar[0])
        setPlayer(_ar[1])
        setCamera(_ar[2])
    }, start ? 10 : null)

    const sendEvent = (eventName:eventName) => {
        player.events.forEach((_v, _i) => {
            if(_v.eventName == eventName){
                eval(_v.script)
            }
        })
        sprites.forEach((_v, _i) => {
            _v.events.forEach((_v2, _i2) => {
                if(_v2.eventName == eventName){
                    eval(_v2.script)
                }
            })
        })
    }
    const openLevel = () => {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        fileInput.click()
    
        fileInput.addEventListener('change', (e) => {
            const selectedFile = (fileInput.files as FileList)[0];

            if (selectedFile) {
                const reader = new FileReader();

                reader.onload = (event) => {
                    const map = JSON.parse(event.target?.result as string) as map;

                    // statement 적용
                    setCamera(map.camera)
                    setGravity(map.gravity)
                    setPlayer(map.player)
                    setSprites(map.sprites)
                    setTexts(map.texts)
                    setBackgroundColor(map.backgroundColor)
                    setGround(map.ground)
                };

                reader.readAsText(selectedFile);
            }
        });
    }

    const exportLevel = () => {
        const _a = document.createElement('a') as HTMLAnchorElement
        let _map:map = {backgroundColor, camera, gravity, ground, player, sprites, texts}
        _a.download = 'map.json'
        let _blob = new Blob([JSON.stringify(_map)], {type:'application/json'})
        _a.href = URL.createObjectURL(_blob)
        _a.click()
    }

    return <div className="MapEditor">
        <div>
            <div>
                <button onClick={() => {openLevel()}}>Open Map</button>
                <button onClick={() => {exportLevel()}}>Save Map</button>
            </div>
            <div>
                <label>Gravity</label>
                <input type="number" value={gravity} onChange={(e) => {setGravity(Number(e.target.value))}} />
            </div>
            <div>
                <label>BackgroundColor</label>
                <input type="color" value={backgroundColor} onChange={(e) => {setBackgroundColor(e.target.value)}} />
            </div>
            <div>
                <label>Ground</label>
                <input type="number" value={ground} onChange={(e) => {setGround(Number(e.target.value))}} />
            </div>
            <hr />
            <div>
                <label>Position</label>
                <input type="number" value={camera.position[0]} onChange={(e) => {setCamera({position:[Number(e.target.value), camera.position[1]], rotation:camera.rotation, scale:camera.scale, follow:camera.follow})}} />
                <input type="number" value={camera.position[1]} onChange={(e) => {setCamera({position:[camera.position[0], Number(e.target.value)], rotation:camera.rotation, scale:camera.scale, follow:camera.follow})}} />
            </div>
            <div>
                <label>Rotation</label>
                <input type="number" value={camera.position[0]} onChange={(e) => {setCamera({position:camera.position, rotation:Number(e.target.value), scale:camera.scale, follow:camera.follow})}} />
            </div>
            <div>
                <label>Scale</label>
                <input type="number" value={camera.position[0]} onChange={(e) => {setCamera({position:camera.position, rotation:camera.rotation, scale:Number(e.target.value), follow:camera.follow})}} />
            </div>
            <div>
                <label>Follow</label>
                <input type="text" value={camera.follow} onChange={(e) => {setCamera({position:camera.position, rotation:camera.rotation, scale:camera.scale, follow:e.target.value})}} />
            </div>
            <hr />
            <div className={focusing == -1 ? "select" : ""} onClick={e => {setFocusing(-1)}}>player</div>
            {sprites.map((_v, _i) => (
                <div onClick={e => {setFocusing(_i)}} key={_i} className={focusing == _i ? "select" : ""}>
                    {_v.tags.join(' ')}
                </div>
            ))}
        </div>
        {exRender([width*0.6, height], lang, MsArrToRsArr(sprites), texts, player, camera, backgroundColor, true)}
        <div></div>
        <input type="file" name="" id="fileInput" style={{display:'none'}} />
    </div>
}