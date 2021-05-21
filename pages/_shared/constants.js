export const constants = {
    socketUrl: '192.168.3.109:3000',
    socketNamespaces:{
        room: 'room',
        lobby: 'lobby',
    },
    peerConfig: Object.values({
        id: undefined,
       // config:{
            // port:9000,
            // host: 'localhost',
            // path: '/'
      //  }
    }),
    events:{
        USER_CONNECTED: 'userConnection',
        USER_DISCONNECTED: 'userDisconnection',
        JOIN_ROOM: 'joinRoom',
        LOBBY_UPDATED: 'lobbyUpdated',
        UPGRADE_USER_PERMISSION: 'upgradeUserPermission',
        SPEAK_REQUEST: 'speakRequest',
        SPEAK_ANSWER: 'speakAnswer',
    },
    pages:{
        lobby: '/pages/lobby',
        login: '/pages/login',
    }
}