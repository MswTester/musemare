import { FC, ReactNode } from 'react'
import { Container, Graphics, Sprite, Stage, Text } from "@pixi/react"
import { camera, env, exevent, Msprite, player, Rsprite, text } from "../data/types"
import { Empty, checkCollision, copy, getPos, initCollidedPosition, parseHex, playerToMsprite } from "../data/utils"
import * as PIXI from 'pixi.js'

export const exRender = (stageSize:[number, number], lang:string, sprites:Rsprite[], texts:text[], player:player, camera:camera, backgroundColor:string, showHitbox?:boolean) => {
    return <Stage width={stageSize[0]} height={stageSize[1]} options={{backgroundColor:parseHex(backgroundColor)}}>
        <Container pivot={[camera.position[0], camera.position[1]]} x={stageSize[0]/2} y={stageSize[1]/2} scale={camera.scale} rotation={camera.rotation*Math.PI/180}>
            {sprites.map((_v, _i) => (
                <Empty key={_i}>
                    <Sprite image={_v.src || "assets"} position={_v.position} rotation={_v.rotation*Math.PI/180} width={_v.width} height={_v.height} alpha={_v.opacity} anchor={_v.anchor.map(v => (v+50)/100) as [number]}></Sprite>
                    {showHitbox && _v.showHitbox && <Graphics draw={g => {
                        g.clear()
                        g.lineStyle(1, 0x00ff00)
                        g.drawRect(_v.position[0] - _v.width * _v.anchor[0], _v.position[1] - _v.height * _v.anchor[1], _v.width, _v.height)
                    }}/>}
                </Empty>
            ))}
            {texts.map((_v, _i) => (
                <Text key={_i} text={_v.content} style={new PIXI.TextStyle({align:'center', fontFamily:'Impact', fontSize:20, fontWeight:_v.weight as PIXI.TextStyleFontWeight, fill:parseHex(_v.color), fontStyle:'normal'})}
                position={_v.position} rotation={_v.rotation*Math.PI/180} scale={_v.scale} alpha={_v.opacity} pivot={[_v.anchor[0]*5+230, _v.anchor[1]*0.5+50]}/>
            ))}
            <Sprite image={(player.src) || "assets"} position={player.position} rotation={player.rotation*Math.PI/180} width={player.width} height={player.height} alpha={player.opacity} anchor={player.anchor.map(v => (v+50)/100) as [number]}></Sprite>
            {showHitbox && player.showHitbox && <Graphics draw={g => {
                g.clear()
                g.lineStyle(1, 0x00ff00)
                g.drawRect(player.position[0] - player.width * player.anchor[0], player.position[1] - player.height * player.anchor[1], player.width, player.height)
            }}/>}
        </Container>
    </Stage>
}

export const execute = (lang:string, sprites:Msprite[], gravity:number, inputs:string[], activeEvents:exevent[], env:env, player:player, camera:camera, ground:number):[Msprite[], player, camera, exevent[]] => {
    let _sprites:Msprite[] = copy(sprites)
    let _player:player = copy(player)
    let _camera:camera = copy(camera)
    let _events:exevent[] = copy(activeEvents)

    // player movement
    if(!_player.isGround){
        _player.dposition[1] += gravity
    }
    if(!_player.isGround && _player.position[1] + _player.anchor[1] * _player.height >= ground){
        _player.dposition[1] = 0
        _player.position[1] = ground - _player.anchor[1] * _player.height
        _player.isGround = true
    }
    if(inputs.includes(env.keys.playerJump) && _player.isGround){
        _player.dposition[1] = -10
        _player.isGround = false
    }

    let _move = _player.isRun ? 5 : 3
    _player.isSneak = inputs.includes(env.keys.playerSneak)
    _player.isRun = inputs.includes(env.keys.playerRun)
    _player.dposition[0] = inputs.includes(env.keys.playerLeft) ? -_move :
    inputs.includes(env.keys.playerRight) ? _move : 0

    let _newSpr:Msprite = initCollidedPosition(playerToMsprite(_player), _sprites)
    _player.position[0] = _newSpr.position[0]
    _player.position[1] = _newSpr.position[1]
    _player.dposition[0] = _newSpr.dposition[0]
    _player.dposition[1] = _newSpr.dposition[1]
    _player.isGround = _newSpr.isGround

    // player animation
    
    _sprites.forEach((_v, _i) => {
        // sprite movement
        if(_sprites[_i].isGravity){
            if(!_sprites[_i].isGround){_sprites[_i].dposition[1] += gravity}
            if(!_sprites[_i].isGround && _sprites[_i].position[1] + _sprites[_i].anchor[1] * _sprites[_i].height >= ground){
                _sprites[_i].dposition[1] = 0
                _sprites[_i].position[1] = ground - _sprites[_i].anchor[1] * _sprites[_i].height
                _sprites[_i].isGround = true
            }
        }
        let _ars:Msprite[] = copy(_sprites)
        _ars.splice(_i, 1)
        _ars.push(playerToMsprite(_player))
        
        let _newSpr:Msprite = initCollidedPosition(_sprites[_i], _ars)
        _sprites[_i].position[0] = _newSpr.position[0]
        _sprites[_i].position[1] = _newSpr.position[1]
        _sprites[_i].dposition[0] = _newSpr.dposition[0]
        _sprites[_i].dposition[1] = _newSpr.dposition[1]
        _sprites[_i].isGround = _newSpr.isGround
    })
    
    let _ars:Msprite[] = copy(_sprites)
    _ars.push(playerToMsprite(_player))

    // camera movement
    _ars.forEach((_v, _i) => {
        if(_ars[_i].tags.includes(camera.follow)){
            _camera.position[0] = _ars[_i].position[0]
            _camera.position[1] = _ars[_i].position[1]
        }
    })
    return [_sprites, _player, _camera, _events]
}
