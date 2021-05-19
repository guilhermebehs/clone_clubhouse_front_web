import { constants } from "../../_shared/constants.js";
import { LobbyController } from "./controller.js";
import { LobbySocketBuilder } from "./util/lobbySocketBuilder.js";
import { View } from "./view.js";


const user = {
    img: 'https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-runner-512.png',
    username: 'Erick Wendel'+ Date.now()
}

const socketBuilder = new LobbySocketBuilder({
    socketUrl: constants.socketUrl,
    namespace: constants.socketNamespaces.lobby,
})

const dependencies = {
    socketBuilder,
    view: View,
    user,
}

await LobbyController.initialize(dependencies)