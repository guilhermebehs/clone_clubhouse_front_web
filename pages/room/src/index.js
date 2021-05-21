import { constants } from "../../_shared/constants.js"
import { Media } from "../../_shared/media.js";
import { PeerBuilder } from "../../_shared/peerBuilder.js";
import { RoomService } from "../service.js";
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

const peerBuilder = new PeerBuilder({peerConfig:constants.peerConfig})
const roomService = new RoomService({media: Media})

const dependencies = {
    view: View,
    socketBuilder,
    roomInfo,
    peerBuilder,
    roomService,
}
await RoomController
           .initialize(dependencies)
           .catch(error => alert(error.message))




