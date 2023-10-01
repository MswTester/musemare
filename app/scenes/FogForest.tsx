'use client'

import { useContext, useEffect, useState } from "react"
import { globalContext } from "../main"
import { toLang } from "../data/lang"
import { exRender } from "../logic/exploreRenderer"
import { useWindowSize } from "usehooks-ts"

export default function Index(){
    const { width, height } = useWindowSize()
    const {lang, setLang} = useContext(globalContext)
    const {scene, setScene} = useContext(globalContext)
    const [brightness, setBrightness] = useState<number>(0)
    const [b_event ,setB_event] = useState<string>('')

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

    return <div style={{filter:`brightness(${brightness})`}} className="Explore">
        {exRender([width, height], lang)}
    </div>
}