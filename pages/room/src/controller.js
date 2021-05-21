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
    this.view.configureClapButton(this.onClapPressed());
    this.view.configureLeaveButton();
    this.view.configureOnMicActivatedButton(this.onMicActivatedButton())
    this.view.updateUserImage(this.roomInfo.user);
    this.view.updateRoomTopic(this.roomInfo.room);
  }

  onMicActivatedButton(){
    return async()=>{
      await this.roomService.toggleAudioActivate()
    }
}

  onClapPressed(){
      return ()=>{
        this.socket.emit(constants.events.SPEAK_REQUEST, this.roomInfo.user)
      }
  }

  _setupSocket() {
    return this.socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .setOnRoomUpdated(this.onRoomUpdated())
      .setOnUserProfileUpgrade(this.onUserProfileUpgrade())
      .setOnSpeakRequested(this.onSpeakRequested())
      .build();
  }

  onSpeakRequested() {
    return (data) => {
      const attendee = new Attendee(data)
      const result = prompt(`${attendee.username} pediu para falar!, aceitar 1 sim, 0 não`)
      this.socket.emit(constants.events.SPEAK_ANSWER, {answer: !!Number(result), user:attendee})
    }
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
             const stream = await this.roomService.getCurrentStream()
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
      this.roomInfo.user.peerId = peer.id;
      this.socket.emit(constants.events.JOIN_ROOM, this.roomInfo);
    };
  }

  onUserProfileUpgrade() {
    return (data) => {
      const attendee = new Attendee(data);
      if (attendee.isSpeaker) {
        this.roomService.updateUserPermission(attendee)
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
    };
  }

  onUserDisconnected() {
    return (data) => {
      const attendee = new Attendee(data);
      this.view.removeItemFromGrid(attendee.id);
      const peerId = attendee.peer;
      this.roomService.disconnectPeer({peerId})
    };
  }

  onUserConnected() {
    return (user) => {
      this.view.addAttendeeOnGrid(user);
      //vamos ligar!!
      this.roomService.callNewUser(user)
    };
  }
}
