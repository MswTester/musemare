'use client'

import { createContext, useState } from "react"
import MainMenu from './scenes/MainMenu'

export const globalContext = createContext<any>({})

export default function Index(){
    const [scene, setScene] = useState<string>('')
    return <globalContext.Provider value={{
        scene, setScene,
    }}>
        <MainMenu />
    </globalContext.Provider>
}