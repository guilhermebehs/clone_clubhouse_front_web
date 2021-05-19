import { constants } from "./constants.js";

export class SocketBuilder{
   
    constructor({socketUrl, namespace}){
        this.socketUrl = `${socketUrl}/${namespace}`;
        this.onUserConnected = ()=>{}
        this.onUserDisconnected = ()=>{}
        this.onRoomUpdated = ()=>{}
        this.onUserProfileUpgrade = ()=>{}
    }

    setOnUserConnected(fn){
        this.onUserConnected = fn;
        return this;
    }
    
    setOnUserDisconnected(fn){
        this.onUserDisconnected = fn;
        return this;
    }

    setOnRoomUpdated(fn){
        this.onRoomUpdated = fn;
        return this;
    }

    setOnUserProfileUpgrade(fn){
        this.onUserProfileUpgrade = fn;
        return this;
    }

    build(){
        const socket = globalThis.io.connect(this.socketUrl, {
            withCredentials: false,
        })
        socket.on('connect', ()=> console.log('conectei!!!'))
        socket.on(constants.events.USER_CONNECTED, this.onUserConnected )
        socket.on(constants.events.USER_DISCONNECTED, this.onUserDisconnected)
        socket.on(constants.events.LOBBY_UPDATED, this.onRoomUpdated)
        socket.on(constants.events.UPGRADE_USER_PERMISSION, this.onUserProfileUpgrade)
        return socket;
    }
}