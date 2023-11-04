// const DataLoader = require('dataloader');
const Event=require("../../models/event")
const User=require("../../models/user")
const{ dateToString}=require('../../helpers/date')




const events = async eventIds => {
    try {

        const events = await Event.find({ _id: { $in: eventIds } })
        return events.map(event => {
            return transformEvent(event)
        });


    }

    catch (err) {
        throw err;
    }
}




const user = async userId => {
    try {
        const user = await User.findById(userId)

        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)

        }
    }
    catch (err) {
        throw err;
    }
};

const singleEvent= async eventId=>{
    try{
        const event = await Event.findById(eventId)
        // return {
        //     ...event,
        //     _id: event._id.toString(),
        //     date: dateToString(event.date),
        //     creator: user.bind(this, event.creator)
        // };
        return transformEvent(event)

    } catch(error){
        throw error
    }
}

const transformEvent=event=>{
    console.log(event);
    return {
        ...event,
        _id: event._id.toString(),
        date: dateToString(event.date),
        creator: user.bind(this, event.creator)
    };
 
 }

const transformBooking=booking=>{
    let data =booking.toObject();
    return {
        ...data,
        _id:data._id.toString(),
        // user:user.bind(this ,data.user),
        user:data.user,
        // event:singleEvent.bind(this,data.event),
        event:data.event,
        // event:data.event.toObject(),
        createdAt:(data.createdAt).toString(),
        updatedAt:(data.updatedAt).toString(),

    }
}
// exports.user=user;
exports.events=events;
// exports.singleEvent=singleEvent;

exports.transformBooking=transformBooking
exports.transformEvent=transformEvent;