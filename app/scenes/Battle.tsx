'use client'

import { useContext, useEffect, useState } from "react"
import { globalContext } from "../main"
import { toLang } from "../data/lang"
import { useInterval } from "usehooks-ts"
import { battleEngine } from "../logic/battleEngine"
import { levels } from "../data/level"
import { copy, lvlToRendata } from "../data/utils"

const playKeys = ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Semicolon', 'Quote', 'Comma', 'Period', 'Slash', 'BracketLeft', 'BracketRight', 'Backslash', 'Equal', 'Minus', 'Digit0', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Space', 'ControlLeft', 'AltLeft', 'ControlRight', 'ContextMenu', 'AltRight', 'Enter', 'Backspace', 'Backquote', 'Tab', 'ShiftLeft', 'RightLeft', 'CapsLock', 'Numpad0', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4', 'Numpad5', 'Numpad6', 'Numpad7', 'Numpad8', 'Numpad9', 'NumpadDecimal', 'NumLock', 'NumpadEnter', 'NumpadSubtract', 'NumpadAdd', 'NumpadMultiply', 'NumpadDivide', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

export default function Index(){
    const {lang, setLang} = useContext(globalContext)
    const {scene, setScene} = useContext(globalContext)
    const {battleCode, setBattleCode} = useContext(globalContext)
    const {afterBattleScene, setAfterBattleScene} = useContext(globalContext)
    const [brightness, setBrightness] = useState<number>(0)
    const [b_event ,setB_event] = useState<string>('')
    const [timeline, setTimeline] = useState<number>(0)
    const [hits, setHits] = useState<number[]>([])
    const [stageSize, setStageSize] = useState<[number, number]>([0, 0])

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
        const audio = document.querySelector('audio') as HTMLAudioElement

        audio.volume = levels[battleCode].volume

        function resizeCanvas(){
            setStageSize([innerWidth, innerHeight])
        }
        window.onresize = resizeCanvas
        resizeCanvas()

        let t = 0
        let loop = setInterval(() => {
            t += 0.02
            setBrightness(t)
            if(t >= 1) clearInterval(loop)
        }, 1)
    }, [])

    useInterval(() => {
        if(timeline >= levels[battleCode].endpoint){
            endWith(afterBattleScene)
        }
        setTimeline(document.querySelector('audio')?.currentTime as number)
    }, 1)

    useEffect(() => {
        const keydown = (e:KeyboardEvent) => {
            if(playKeys.includes(e.code)){
                let _ar:number[] = copy(hits)
                _ar.push(timeline)
                setHits(_ar)
            }
        }
        document.addEventListener('keydown', keydown)
        return () => {
            document.removeEventListener('keydown', keydown)
        }
    }, [timeline, hits])

    return <div style={{filter:`brightness(${brightness})`}} className="Battle">
        <audio src={levels[battleCode].song} autoPlay={true}></audio>
        {battleEngine(timeline, hits, stageSize, lvlToRendata(levels[battleCode]), true)}
    </div>
}