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
    'credits':{
        'ko':'크레딧',
        'en':'Credits',
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
    'teampani':{
        'ko':'팀파니 (TeamPani)',
        'en':'TeamPani',
    },
    'design':{
        'ko':'기획',
        'en':'Design',
    },
    'illustration':{
        'ko':'그림',
        'en':'Illustration',
    },
    'development':{
        'ko':'개발',
        'en':'Development',
    },
    'specialthanks':{
        'ko':'고마운 분들',
        'en':'Special Thanks',
    },
    'story':{
        'ko':'스토리',
        'en':'Story',
    },
    'audiotrack':{
        'ko':'오디오 트랙',
        'en':'Audio Track',
    },
    'fogforest':{
        'ko':'안개숲',
        'en':'Fog Forest',
    },
    'gloomcave':{
        'ko':'어둠동굴',
        'en':'Gloom Cave',
    },
    'jungle':{
        'ko':'정글',
        'en':'Jungle',
    },
    'wasteland':{
        'ko':'황무지',
        'en':'Wasteland',
    },
    'test':{
        'ko':'테스트',
        'en':'Test',
    },
    'moai':{
        'ko':'모아이',
        'en':'Moai',
    },
    'dogbite':{
        'ko':'개물림',
        'en':'Dog Bite',
    },
    'ending':{
        'ko':'엔딩',
        'en':'Ending',
    },
}

export function toLang(lang:string, data:string){
    return langs[data][lang.replace(/-\w+/, '')]
}
