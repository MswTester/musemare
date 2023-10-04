'use client'

import { useContext, useEffect, useState } from "react"
import { globalContext } from "../main"
import { toLang } from "../data/lang"
import { execute, exRender } from "../logic/exploreEngine"
import { useInterval, useWindowSize } from "usehooks-ts"
import { Msprite, text } from "../data/types"
import { copy, MsArrToRsArr } from "../data/utils"

export default function Index(){
    const { width, height } = useWindowSize()
    const {lang, setLang} = useContext(globalContext)
    const {scene, setScene} = useContext(globalContext)
    const {env, setEnv} = useContext(globalContext)
    const [brightness, setBrightness] = useState<number>(0)
    const [b_event, setB_event] = useState<string>('')
    const [inputs, setInputs] = useState<string[]>([])
    const [sprites, setSprites] = useState<Msprite[]>([])
    const [texts, setTexts] = useState<text[]>([])
    const [gravity, setGravity] = useState<number>(1)
    const [canControl, setCanControl] = useState<boolean>(true)

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
        _ar.push(key)
        setInputs(_ar)
    }
    const remInput = (key:string) => {
        let _ar:string[] = copy(inputs)
        let _i:number = _ar.indexOf(key)
        _i != -1 ? _ar.splice(_i, 1) : false
        setInputs(_ar)
    }
    useInterval(() => {
        execute(lang, sprites, gravity, inputs, env)
    }, 1)

    return <div style={{filter:`brightness(${brightness})`}} className="Explore">
        {exRender([width, height], lang, MsArrToRsArr(sprites), texts)}
    </div>
}