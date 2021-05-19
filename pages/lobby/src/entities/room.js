class Attendee{
    constructor({id, img, username}){
        this.id = id;
        this.img = img;
        this.username = username;
    }
}
export class Room{
    constructor({id, topic, subTopic,roomLink, attendeesCount, speakersCount, featuredAttendees, owner}){
        this.id = id
        this.topic = topic
        this.subTopic = subTopic || 'Semana JS Expert 4.0'
        this.roomLink = roomLink
        this.attendeesCount = attendeesCount
        this.speakersCount = speakersCount
        this.featuredAttendees = featuredAttendees?.map(a => new Attendee(a))
        this.owner = new Attendee(owner)
    }
}