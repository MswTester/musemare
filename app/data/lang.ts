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
    'goback':{
        'ko':'뒤로가기',
        'en':'Back',
    },
    'general':{
        'ko':'일반',
        'en':'General',
    },
    'video':{
        'ko':'비디오',
        'en':'Video',
    },
    'controls':{
        'ko':'조작키',
        'en':'Controls',
    },
    'audio':{
        'ko':'오디오',
        'en':'Audio',
    },
    'press skip':{
        'ko':'[F]키를 눌러 스킵',
        'en':'Press [F] key to skip',
    },
}

export function toLang(lang:string, data:string){
    return langs[data][lang.replace(/-\w+/, '')]
}
