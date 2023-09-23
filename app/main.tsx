'use client'

import { createContext, useEffect, useState } from "react"
import MainMenu from './scenes/MainMenu'
import Intro from './scenes/Intro'

// 글로벌 설정
export const globalConfig:{[key:string]:any} = {
    startScene:'MainMenu',
    defaultLang:'en-US',
}

export const globalContext = createContext<any>({})

export default function Index(){
    // 글로벌 state 변수 선언
    const [lang, setLang] = useState<string>(globalConfig['defaultLang'])
    const [scene, setScene] = useState<string>(globalConfig['startScene'])
    const [load, setLoad] = useState<boolean>(false)

    useEffect(() => {
        setLang(navigator.language)
        setLoad(true)
    }, [])

    return <globalContext.Provider value={{
        // 글로벌 state 변수 업로드
        scene, setScene,
        lang, setLang,
    }}>
        {
            // scene 불러오기
            load && (
            scene == 'Intro' ? <Intro /> :
            scene == 'MainMenu' ? <MainMenu /> :
            scene == 'das' ? <MainMenu /> :
            <></>)
        }
    </globalContext.Provider>
}