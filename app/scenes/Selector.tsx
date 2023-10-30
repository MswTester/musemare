'use client'

import { useContext, useEffect, useState } from "react"
import { globalContext, globalConfig } from "../main"
import { toLang } from "../data/lang"
import { levels } from "../data/level"
import { useInterval } from "usehooks-ts"

export default function Index(){
    const {lang, setLang} = useContext(globalContext)
    const {scene, setScene} = useContext(globalContext)
    const {battleCode, setBattleCode} = useContext(globalContext)
    const {afterBattleScene, setAfterBattleScene} = useContext(globalContext)
    const [brightness, setBrightness] = useState<number>(0)
    const [b_event ,setB_event] = useState<string>('')
    const [selected, setSelected] = useState<string>('')
    const [levelList, setLevelList] = useState<number[][]>([[-1,-1,-1],[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]])
    const [rainbowColor, setRainbowColor] = useState<string>('#000000')

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

        const clearList = localStorage.getItem('clearLevelList')
        if(clearList == null) localStorage.setItem('clearLevelList', JSON.stringify([[-1,-1,-1],[-1,-1,-1],[-1,-1,-1],[-1,-1,-1],-1]))
        const clearLevelList:number[][] = JSON.parse(localStorage.getItem('clearLevelList') as string)
        setLevelList(clearLevelList)
        return () => clearInterval(loop)
    }, [])

    useInterval(() => {
        // slow rainbow
        let t = (Date.now() / 3000) % 1
        let r = Math.round(Math.sin(t * 2 * Math.PI) * 127 + 128)
        let g = Math.round(Math.sin(t * 2 * Math.PI + 2 * Math.PI / 3) * 127 + 128)
        let b = Math.round(Math.sin(t * 2 * Math.PI + 4 * Math.PI / 3) * 127 + 128)
        setRainbowColor(`rgb(${r},${g},${b})`)
    }, 10)

    return <div style={{filter:`brightness(${brightness})`}} className="Selector fullscreen blackbg">
        {!selected ? <>{(globalConfig['mapList'] as string[]).map((v, i) => (
            <div className={i > 0 ? levelList[i-1][2] < 0.9 ? 'disabled' : '' : ''} key={i} onClick={e => {
                if(i > 0 && levelList[i-1][2] < 0.9) return;
                setSelected(v)
            }}>{toLang(lang, v)}</div>
        ))} {levelList[3][2] >= 0.9 && <div style={{borderColor:rainbowColor, color:rainbowColor}} onClick={e => {
            setBattleCode('ending')
            endWith('Battle')
            setAfterBattleScene('Selector')
        }}>{toLang(lang, 'ending')}</div>}</>:
        <>{(globalConfig['levelList'] as string[][])[(globalConfig['mapList'] as string[]).indexOf(selected)].map((v, i) => (
            <div className={''} key={i} onClick={e => {
                setBattleCode(v)
                endWith('Battle')
                setAfterBattleScene('Selector')
            }}>{toLang(lang, v)}</div>
        ))}
        <div onClick={e => setSelected('')}>{toLang(lang, 'goback')}</div></>}
        <div className="goback" onClick={e => endWith('MainMenu')}>{toLang(lang, 'goback')}</div>
    </div>
}