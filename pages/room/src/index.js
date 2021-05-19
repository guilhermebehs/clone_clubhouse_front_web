import { constants } from "../../_shared/constants.js"
import { RoomSocketBuilder } from "../util/roomSocket.js"
import { RoomController } from "./controller.js"
import { View } from "./view.js"

const urlParams = new URLSearchParams(window.location.search);
const keys = ['id', 'topic']
const urlData =keys.map((key)=> [key,urlParams.get(key)])

const socketBuilder = new RoomSocketBuilder({
    socketUrl: constants.socketUrl,
    namespace: constants.socketNamespaces.room,
})

const user = {
    img: 'https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-runner-512.png',
    username: 'Erick Wendel'+ Date.now()
}

const roomInfo = {
    room:{...Object.fromEntries(urlData)},
    user,
}

const dependencies = {
    view: View,
    socketBuilder,
    roomInfo
}
await RoomController.initialize(dependencies);



