import { constants } from "../../_shared/constants.js";
import { Room } from "./entities/room.js";
import { getTemplate } from "./templates/lobbyItem.js";

const roomGrid = document.getElementById('roomGrid');
const btnCreateRoomWithTopic = document.getElementById('btnCreateRoomWithTopic');
const btnCreateRoomWithoutTopic = document.getElementById('btnCreateRoomWithoutTopic');
const txtTopic = document.getElementById('txtTopic');


export class View{
    
    static cleanRoomList(){
        roomGrid.innerHTML = '';
    }

    static redirectToRoom(topic = ''){
        //gerar unique id
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2)
        window.location = View.generateRoomLink(uniqueId, topic)
    }

    static configureCreateRoomButton(){

        btnCreateRoomWithoutTopic.addEventListener('click', ()=>{
            View.redirectToRoom()
        })

        btnCreateRoomWithTopic.addEventListener('click', ()=>{
               const topic = txtTopic.value
               View.redirectToRoom(topic)
        })
          
    }
  
    static generateRoomLink(id, topic){
        return `./../room/index.html?id=${id}&topic=${topic}`
    }

    static updateRoomList(rooms){
        View.cleanRoomList()

        rooms.forEach(room =>{
            const params = new Room({
                ...room,
                roomLink: View.generateRoomLink(room.id,room.topic)
              })
            const htmlTemplate = getTemplate(params)
            roomGrid.innerHTML += htmlTemplate;
        })
    }

    static updateUserImage({img, username}){
        imgUser.src = img;
        imgUser.alt = username;
    }

    static redirectToLogin(){
        window.location = constants.pages.login
    }

}