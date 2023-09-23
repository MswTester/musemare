const langs:{[key:string]:{[key:string]:string}} = {
    '':{
        'ko':'',
        'en':'',
    },
    'new game':{
        'ko':'새 게임',
        'en':'New Game',
    },
    'continue':{
        'ko':'이어하기',
        'en':'Continue',
    },
    'settings':{
        'ko':'설정',
        'en':'Settings',
    },
}

export function toLang(lang:string, data:string){
    return langs[data][lang.replace(/-\w+/, '')]
}
