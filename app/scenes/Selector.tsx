'use client'

import { useContext, useEffect, useState } from "react"
import { globalContext, globalConfig } from "../main"
import { toLang } from "../data/lang"
import { levels } from "../data/level"

export default function Index(){
    const {lang, setLang} = useContext(globalContext)
    const {scene, setScene} = useContext(globalContext)
    const {battleCode, setBattleCode} = useContext(globalContext)
    const {afterBattleScene, setAfterBattleScene} = useContext(globalContext)
    const [brightness, setBrightness] = useState<number>(0)
    const [b_event ,setB_event] = useState<string>('')
    const [selected, setSelected] = useState<string>('')

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

    return <div style={{filter:`brightness(${brightness})`}} className="Selector fullscreen blackbg">
        {!selected ? (globalConfig['mapList'] as string[]).map((v, i) => (
            <div key={i} onClick={e => setSelected(v)}>{toLang(lang, v)}</div>
        )):
        <>{(globalConfig['levelList'] as string[][])[(globalConfig['mapList'] as string[]).indexOf(selected)].map((v, i) => (
            <div key={i} onClick={e => {
                setBattleCode(v)
                endWith('Battle')
                setAfterBattleScene('Selector')
            }}>{toLang(lang, v)}</div>
        ))}
        <div onClick={e => setSelected('')}>{toLang(lang, 'goback')}</div></>}
        <div className="goback" onClick={e => endWith('MainMenu')}>{toLang(lang, 'goback')}</div>
    </div>
}