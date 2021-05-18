import { constants } from "../../_shared/constants.js"
import { RoomSocketBuilder } from "../util/roomSocket.js"

const socketBuilder = new RoomSocketBuilder({
    socketUrl: constants.socketUrl,
    namespace: constants.socketNamespaces.room,
})

const socket = socketBuilder
             .setOnUserConnected((user)=> console.log("user connected", user))
             .setOnUserDisconnected((user)=> console.log("user disconnected", user))
             .setOnRoomUpdated((room)=> console.log('room list', room))
             .build()

const room = {
    id: '0001',
    topic: 'JS Expert bora lá'
}

const user = {
    img: 'https://www.iconfinder.com/icons/3430607/avatar_female_person_profile_runner_woman_icon',
    username: 'Erick Wendel'+ Date.now()
}


socket.emit(constants.events.JOIN_ROOM, {user, room}) 
