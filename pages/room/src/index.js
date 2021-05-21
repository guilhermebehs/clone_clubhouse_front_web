import { constants } from "../../_shared/constants.js"
import { Media } from "../../_shared/media.js";
import { PeerBuilder } from "../../_shared/peerBuilder.js";
import { UserDb } from "../../_shared/userDb.js";
import { RoomService } from "../service.js";
import { RoomSocketBuilder } from "../util/roomSocket.js"
import { RoomController } from "./controller.js"
import { View } from "./view.js"


const user = UserDb.get()
if(!Object.keys(user).length)
    View.redirectToLogin()

const urlParams = new URLSearchParams(window.location.search);
const keys = ['id', 'topic']
const urlData =keys.map((key)=> [key,urlParams.get(key)])




const socketBuilder = new RoomSocketBuilder({
    socketUrl: constants.socketUrl,
    namespace: constants.socketNamespaces.room,
})

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




