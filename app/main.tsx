'use client'

import { createContext, useEffect, useState } from "react"
import MainMenu from './scenes/MainMenu'
import Intro from './scenes/Intro'
import Settings from './scenes/Settings'
import Credits from './scenes/Credits'
import Battle from './scenes/Battle'
import Explore from './scenes/Explore'
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
        playerRun:'ShiftLeft',
        playerSneak:'ControlLeft',
        interaction:'KeyF',
        escape:'Escape',
    }},
    startExploreCode:'FogForest',
    defaultPlayer:{
        position:[0,0],
        rotation:0,
        width:100, height:120,
        opacity:1,
        anchor:[0.5, 0.5],
        src:'assets/character/test/test1.png',
        jumpSrc:'',
        sneakSrc:'',
        sneakWalkSrc:[''],
        walkSrc:[''],
        runSrc:[''],
        dposition:[0, 0],
        isSneak:false,
        isRun:false,
        isGround:false,
        hitbox:[1, 1],
        events:[],
        tags:["player"],
    },
    defaultCamera:{
        position:[0,0],
        rotation:0,
        scale:1,
        follow:'',
    },
    defaultGravity:0.3,
    defaultGround:300,
    black:'#000000',
    white:'#ffffff',
}

export const globalContext = createContext<any>({})

export default function Index(){
    // 글로벌 state 변수 선언
    const [lang, setLang] = useState<string>(globalConfig['defaultLang'])
    const [scene, setScene] = useState<string>(globalConfig['startScene'])
    const [battleCode, setBattleCode] = useState<string>(globalConfig['testBattleCode'])
    const [afterBattleScene, setAfterBattleScene] = useState<string>(globalConfig['startScene'])
    const [exploreCode, setExploreCode] = useState<string>(globalConfig['startExploreCode'])
    const [env, setEnv] = useState<env>(globalConfig['defaultEnv'])
    const [load, setLoad] = useState<boolean>(false)

    useEffect(() => {
        setLang(navigator.language ?? globalConfig['defaultLang'])
        setLoad(true)

        if(localStorage.getItem('env')){
            setEnv(JSON.parse(localStorage.getItem('env')!) as env)
        } else {
            localStorage.setItem('env', JSON.stringify(globalConfig['defaultEnv']))
        }
    }, [])

    return <globalContext.Provider value={{
        // 글로벌 state 변수 업로드
        scene, setScene,
        lang, setLang,
        battleCode, setBattleCode,
        exploreCode, setExploreCode,
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
            scene == 'Explore' ? <Explore /> :
            <></>)
        }
    </globalContext.Provider>
}