'use client'

import { useContext, useEffect, useState } from "react"
import { globalContext } from "../main"
import { toLang } from "../data/lang"

export default function Index(){
    const {afterBattleScene, setAfterBattleScene} = useContext(globalContext)
    const {battleCode, setBattleCode} = useContext(globalContext)
    const {scene, setScene} = useContext(globalContext)
    const {lang, setLang} = useContext(globalContext)
    const [canSkip, setCanSkip] = useState<boolean>(false)
    const [brightness, setBrightness] = useState<number>(1)
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
        setTimeout(() => {
            setCanSkip(true)
            window.addEventListener('keydown', e => {
                if(e.code == 'KeyF'){
                    endWith('Explore')
                    // endWith('Battle')
                    // setBattleCode('moai')
                    // setAfterBattleScene('FogForest')
                }
            })
        }, 2000);
    }, [])

    return <div style={{filter:`brightness(${brightness})`}} className="Intro">
        <video className="Intro-vid" onEnded={e => setScene('Battle')} autoPlay={true} controls={false}
        src="assets/video/testvid.mp4" muted={true}></video>
        {canSkip && <div className="skip">{toLang(lang, 'press skip')}</div>}
    </div>
}