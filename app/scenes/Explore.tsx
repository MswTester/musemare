'use client'

import { useContext, useEffect, useState } from "react"
import { globalConfig, globalContext } from "../main"
import { toLang } from "../data/lang"
import { execute, exRender } from "../logic/exploreEngine"
import { useInterval, useWindowSize } from "usehooks-ts"
import { Msprite, camera, eventName, player, text } from "../data/types"
import { copy, MsArrToRsArr } from "../data/utils"

export default function Index(){
    const { width, height } = useWindowSize()
    const {lang, setLang} = useContext(globalContext)
    const {scene, setScene} = useContext(globalContext)
    const {env, setEnv} = useContext(globalContext)
    const [brightness, setBrightness] = useState<number>(0)
    const [start, setStart] = useState<boolean>(false)
    const [b_event, setB_event] = useState<string>('')
    const [inputs, setInputs] = useState<string[]>([])
    const [sprites, setSprites] = useState<Msprite[]>([
        {position:[500, 550], rotation:0, src:'assets/character/test/test1.png', width:100, height:100, opacity:1, anchor:[0.5, 0.5], dposition:[0, 0], isGravity:false, isCollision:true, isGround:false, hitbox:[1, 1], events:[], tags:['test']},
    ])
    const [texts, setTexts] = useState<text[]>([])
    const [gravity, setGravity] = useState<number>(0.5)
    const [canControl, setCanControl] = useState<boolean>(true)
    const [player, setPlayer] = useState<player>(globalConfig['defaultPlayer'])
    const [camera, setCamera] = useState<camera>(globalConfig['defaultCamera'])

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
        const _ar = execute(lang, sprites, gravity, inputs, env, player, camera)
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

    return <div style={{filter:`brightness(${brightness})`}} className="Explore">
        {exRender([width, height], lang, MsArrToRsArr(sprites), texts, player, camera)}
    </div>
}