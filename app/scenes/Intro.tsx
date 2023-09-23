'use client'

import { useContext } from "react"
import { globalContext } from "../main"

export default function Index(){
    const {scene, setScene} = useContext(globalContext)
    return <video className="Intro-vid fullscreen" autoPlay={true} controls={false}
    src="" onEnded={setScene('MainMenu')}></video>
}