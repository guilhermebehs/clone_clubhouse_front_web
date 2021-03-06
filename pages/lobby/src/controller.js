export class LobbyController {
  constructor({ socketBuilder, user, view }) {
    this.socketBuilder = socketBuilder;
    this.user = user;
    this.view = view;
  }

  static initialize(deps) {
    return new LobbyController(deps)._init();
  }

  _setupViewEvents() {
    this.view.updateUserImage(this.user);
    this.view.configureCreateRoomButton();
  }

  async _init() {
    this._setupViewEvents();
    this.socket = this._setupSocket();
  }

  _setupSocket() {
    return this.socketBuilder.setOnLobbyUpdated(this.onLobbyUpdated()).build();
  }

  onLobbyUpdated() {
    return (rooms) => {
      this.view.updateRoomList(rooms);
    };
  }
}
