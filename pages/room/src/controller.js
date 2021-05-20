import { constants } from '../../_shared/constants.js';
import { Attendee } from './entities/attendee.js';

export class RoomController {
  constructor({ socketBuilder, roomInfo, view, peerBuilder, roomService }) {
    this.socketBuilder = socketBuilder;
    this.roomInfo = roomInfo;
    this.socket = {};
    this.view = view;
    this.peerBuilder = peerBuilder;
    this.roomService = roomService;
  }

  static async initialize(deps) {
    return new RoomController(deps)._initialize();
  }

  async _initialize() {
    this._setupViewEvents();
    this.roomService.init()
    this.socket = this._setupSocket();
    this.roomService.setCurrentPeer(await this._setupWebRTC());
  }

  activateUserFeatures(){
    const currentUser = this.roomService.getCurrentUser()
    this.view.showUserFeatures(currentUser.isSpeaker)
  }

  _setupViewEvents() {
    this.view.updateUserImage(this.roomInfo.user);
    this.view.updateRoomTopic(this.roomInfo.room);
  }

  _setupSocket() {
    return this.socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .setOnRoomUpdated(this.onRoomUpdated())
      .setOnUserProfileUpgrade(this.onUserProfileUpgrade())
      .build();
  }

  async _setupWebRTC() {
    return this.peerBuilder
      .setOnError(this.onPeerError())
      .setOnConnectionOpened(this.onPeerConnectionOpened())
      .setOnCallReceived(this.onCallReceived())
      .setOnStreamReceived(this.onStreamReceived())
      .setOnCallClose(this.onCallClose())
      .build();
  }

    onCallError(){
        return (call, error)=>{
             console.log('error', error)
             const peerId = call.peer;
             this.roomService.disconnectPeer({peerId})
           }
    }

    onStreamReceived(){
      return (call, stream)=>{
             const callerId = call.peer;
             const {isCurrentId} = this.roomService.addReceivedPeer(call)
              this.view.renderAudioElement({
                  callerId,
                  stream,
                  isCurrentId
              })
      }
    }

    onCallClose(){
      return (call)=>{
            const peerId = call.peer;
            this.roomService.disconnectPeer({peerId})
      }
    }

    onCallReceived(){
      return async(call)=>{
             const stream = this.roomService.getCurrentStream()
             console.log(stream)
             console.log('answering',call)
             call.answer(stream)
      }
    }

  onPeerError() {
    return (e) => {
      console.log( e);
    };
  }

  onPeerConnectionOpened() {
    return (peer) => {
      console.log('peer', peer);
      this.roomInfo.user.peerId = peer.id;
      this.socket.emit(constants.events.JOIN_ROOM, this.roomInfo);
    };
  }

  onUserProfileUpgrade() {
    return (data) => {
      const attendee = new Attendee(data);
      this.roomService.updateUserPermission(attendee)
      if (attendee.isSpeaker) {
        this.view.addAttendeeOnGrid(attendee, true);
      }
      this.activateUserFeatures()
    };
  }

  onRoomUpdated() {
    return (data) => {
      const users = data.map((item) => new Attendee(item));
      this.view.updateAttendeesOnGrid(users);
      this.roomService.updateCurrentUserProfile(users);
      this.activateUserFeatures()
      console.log('room list!', users);
    };
  }

  onUserDisconnected() {
    return (data) => {
      const attendee = new Attendee(data);
      console.log(`${attendee.username} disconnected!`);
      this.view.removeItemFromGrid(attendee.id);
      const peerId = attendee.peer;
      this.roomService.disconnectPeer({peerId})
    };
  }

  onUserConnected() {
    return (user) => {
      this.view.addAttendeeOnGrid(user);
      //vamos ligar!!
      console.log("onUserConnected")
      this.roomService.callNewUser(user)
    };
  }
}
