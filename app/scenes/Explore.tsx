'use client'

import { useContext, useEffect, useState } from "react"
import { globalConfig, globalContext } from "../main"
import { toLang } from "../data/lang"
import { execute, exRender } from "../logic/exploreEngine"
import { useInterval, useWindowSize } from "usehooks-ts"
import { Msprite, camera, eventName, exevent, mevent, player, text } from "../data/types"
import { copy, MsArrToRsArr } from "../data/utils"
import { maps } from "../data/map"

export default function Index(){
    const { width, height } = useWindowSize()
    const {lang, setLang} = useContext(globalContext)
    const {scene, setScene} = useContext(globalContext)
    const {env, setEnv} = useContext(globalContext)
    const {exploreCode, setExploreCode} = useContext(globalContext)
    const [brightness, setBrightness] = useState<number>(0)
    const [b_event, setB_event] = useState<string>('')

    // ingame state
    const [start, setStart] = useState<boolean>(false)
    const [inputs, setInputs] = useState<string[]>([])
    const [event, setEvent] = useState<exevent[]>([])
    const [sprites, setSprites] = useState<Msprite[]>([])
    const [texts, setTexts] = useState<text[]>([])
    const [gravity, setGravity] = useState<number>(globalConfig['defaultGravity'])
    const [ground, setGround] = useState<number>(globalConfig['defaultGround'])
    const [canControl, setCanControl] = useState<boolean>(true)
    const [player, setPlayer] = useState<player>(globalConfig['defaultPlayer'])
    const [camera, setCamera] = useState<camera>(globalConfig['defaultCamera'])
    const [backgroundColor, setBackgroundColor] = useState<string>(globalConfig['black'])

    const endWith = (str:string) => {
        setB_event(str)
    }

    useEffect(() => {
        if(b_event != ''){
            let t = 1
            let loop = setInterval(() => {
                t -= 0.02
                setBrightness(t)
                if(t <= 0) {
                    clearInterval(loop)
                    setScene(b_event)
                }
            }, 1)
        }
    }, [b_event])

    useEffect(() => {
        let t = 0
        let loop = setInterval(() => {
            t += 0.02
            setBrightness(t)
            if(t >= 1) clearInterval(loop)
        }, 1)

        let _map = maps[exploreCode]
        
        setStart(true)
    
        return () => clearInterval(loop)
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
        const _ar = execute(lang, sprites, gravity, inputs, event, env, player, camera, ground)
        setSprites(_ar[0])
        setPlayer(_ar[1])
        setCamera(_ar[2])
    }, start ? 10 : null)

    const sendEvent = (eventName:eventName) => {
        player.events.forEach((_v, _i) => {
            if(_v.eventName == eventName){
                // eval(_v.target)
            }
        })
        sprites.forEach((_v, _i) => {
            _v.events.forEach((_v2, _i2) => {
                if(_v2.eventName == eventName){
                    // eval(_v2.script)
                }
            })
        })
    }

    return <div style={{filter:`brightness(${brightness})`}} className="Explore">
        {exRender([width, height], lang, MsArrToRsArr(sprites), texts, player, camera, backgroundColor, true)}
    </div>
}