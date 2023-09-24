'use client'

import { useContext, useEffect, useState } from "react"
import { globalContext } from "../main"
import { toLang } from "../data/lang"

export default function Index(){
    const {lang, setLang} = useContext(globalContext)
    const {scene, setScene} = useContext(globalContext)
    const [blur, setBlur] = useState<number>(0)
    const [brightness, setBrightness] = useState<number>(0)
    const [b_event ,setB_event] = useState<string>('')

    const buttonInput = (str:string) => {
        if(b_event == ''){
            str == 'credits' ? endWith('Credits') :
            str == 'settings' ? endWith('Settings') :
            str == 'new game' ? endWith('Intro') :
            str == 'continue' && '' // continue play
        }
    }
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

    return <div style={{filter:`blur(${blur}px) brightness(${brightness})`}}
    className="MainMenu fullscreen blackbg">
        <img src="assets/ui/title.svg" alt="" />
        <div className="menu">
            {['new game', 'continue', 'settings', 'credits'].map((v, i) => (
                <div key={i} onClick={e => buttonInput(v)}>{toLang(lang, v)}</div>
            ))}
        </div>
    </div>
}