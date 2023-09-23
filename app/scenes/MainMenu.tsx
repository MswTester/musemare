'use client'

import { useContext } from "react"
import { globalContext } from "../main"
import { toLang } from "../data/lang"

export default function Index(){
    const {lang, setLang} = useContext(globalContext)
    const {scene, setScene} = useContext(globalContext)

    const buttonInput = (str:string) => {
        console.log(str)
    }
    return <div className="MainMenu fullscreen">
        <img src="assets/logo/title.png" alt="" />
        <div className="menu">
            {['new game', 'continue', 'settings'].map((v, i) => (
                <div key={i} onClick={e => buttonInput(v)}>{toLang(lang, v)}</div>
            ))}
        </div>
    </div>
}