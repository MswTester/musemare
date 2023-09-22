'use client'

import { useContext } from "react"
import { globalContext } from "../main"

export default function Index(){
    const {scene, setScene} = useContext(globalContext)
    return <div><button onClick={e => setScene(scene+1)}>{scene}hi</button></div>
}