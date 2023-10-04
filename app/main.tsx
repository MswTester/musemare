'use client'

import { createContext, useEffect, useState } from "react"
import MainMenu from './scenes/MainMenu'
import Intro from './scenes/Intro'
import Settings from './scenes/Settings'
import Credits from './scenes/Credits'
import Battle from './scenes/Battle'
import FogForest from './scenes/FogForest'
import { env } from "./data/types"

// 글로벌 설정
export const globalConfig:{[key:string]:any} = {
    startScene:'MainMenu',
    defaultLang:'en-US',
    testBattleCode:'test',
    defaultEnv:{keys:{
        playerLeft:'KeyA',
        playerRight:'KeyD',
        playerJump:'Space',
        playerSneak:'ControlLeft',
        interaction:'KeyF',
        escape:'Escape',
    }},
}

export const globalContext = createContext<any>({})

export default function Index(){
    // 글로벌 state 변수 선언
    const [lang, setLang] = useState<string>(globalConfig['defaultLang'])
    const [scene, setScene] = useState<string>(globalConfig['startScene'])
    const [battleCode, setBattleCode] = useState<string>(globalConfig['testBattleCode'])
    const [afterBattleScene, setAfterBattleScene] = useState<string>(globalConfig['startScene'])
    const [env, setEnv] = useState<env>(globalConfig['defaultEnv'])
    const [load, setLoad] = useState<boolean>(false)

    useEffect(() => {
        setLang(navigator.language)
        setLoad(true)
    }, [])

    return <globalContext.Provider value={{
        // 글로벌 state 변수 업로드
        scene, setScene,
        lang, setLang,
        battleCode, setBattleCode,
        afterBattleScene, setAfterBattleScene,
        env, setEnv,
    }}>
        {
            // scene 불러오기
            load && (
            scene == 'Intro' ? <Intro /> :
            scene == 'MainMenu' ? <MainMenu /> :
            scene == 'Settings' ? <Settings /> :
            scene == 'Credits' ? <Credits /> :
            scene == 'Battle' ? <Battle /> :
            scene == 'FogForest' ? <FogForest /> :
            <></>)
        }
    </globalContext.Provider>
}