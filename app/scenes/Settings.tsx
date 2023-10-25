'use client'

import { useContext, useEffect, useState } from "react"
import { globalContext } from "../main"
import { toLang } from "../data/lang"

export default function Index(){
    const {lang, setLang} = useContext(globalContext)
    const {scene, setScene} = useContext(globalContext)
    const [brightness, setBrightness] = useState<number>(0)
    const [b_event ,setB_event] = useState<string>('')
    const [settingMenu, setSettingMenu] = useState<string>('general')

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

        return () => clearInterval(loop)
    }, [])

    return <div style={{filter:`brightness(${brightness})`}} className="Settings fullscreen blackbg">
        <div className="container">
            <div className="menu">
                {['general', 'video', 'audio', 'controls'].map((v, i) => (
                    <div onClick={e => setSettingMenu(v)} className={v == settingMenu ? 'active' : ''}
                    key={i}>{toLang(lang, v)}</div>
                ))}
            </div>
            <div className="options">
                <div>sometinh:true</div>
            </div>
        </div>
        <div className="goback" onClick={e => endWith('MainMenu')}>{toLang(lang, 'goback')}</div>
    </div>
}