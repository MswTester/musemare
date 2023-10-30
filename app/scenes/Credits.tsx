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

    return <div style={{filter:`brightness(${brightness})`}} className="Credits fullscreen blackbg">
        <div className="credit-list">
            <div className="teampani">{toLang(lang, 'teampani')}</div>
            <div>
                <div className="direct">
                    <div>{toLang(lang, 'design')}</div>
                    <div>{toLang(lang, 'story')}</div>
                    <div>{toLang(lang, 'illustration')}</div>
                    <div>{toLang(lang, 'development')}</div>
                    <div>{toLang(lang, 'audiotrack')}</div>
                    <div>{toLang(lang, 'specialthanks')}</div>
                </div>
                <div>
                    <div>냉장고 문선우 푸른슬라임</div>
                    <div>냉장고 문선우 푸른슬라임</div>
                    <div>냉장고</div>
                    <div>문선우 푸른슬라임</div>
                    <div>BilliumMoto</div>
                    <div>학원쌤</div>
                </div>
            </div>
        </div>
        <div className="goback" onClick={e => endWith('MainMenu')}>{toLang(lang, 'goback')}</div>
    </div>
}