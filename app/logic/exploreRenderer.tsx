import { Sprite, Stage, Text } from "@pixi/react"
import { sprite, text } from "../data/types"
import { getPos, parseHex } from "../data/utils"
import PIXI, {} from 'pixi.js'

export const exRender = (stageSize:[number, number], lang:string, sprites:sprite[], texts:text[]) => {
    return <Stage width={stageSize[0]} height={stageSize[1]}>
        {sprites.map((_v, _i) => (
            <Sprite key={_i} image={_v.src || "assets"} position={getPos(_v.position, stageSize)} rotation={_v.rotation*Math.PI/180} scale={_v.scale} alpha={_v.opacity} anchor={_v.anchor.map(v => (v+50)/100) as [number]}></Sprite>
        ))}
        {texts.map((_v, _i) => (
            <Text key={_i} text={_v.content} style={new PIXI.TextStyle({align:'center', fontFamily:'Impact', fontSize:20, fontWeight:_v.weight as PIXI.TextStyleFontWeight, fill:parseHex(_v.color), fontStyle:'normal'})}
            position={getPos(_v.position, stageSize)} rotation={_v.rotation*Math.PI/180} scale={_v.scale} alpha={_v.opacity} pivot={[_v.anchor[0]*5+230, _v.anchor[1]*0.5+50]}/>
        ))}
    </Stage>
}