const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
   
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
  
    try {
      const bookings = await Booking.find({user:req.userId}).populate('event').populate('user');
      
      const filteredBookings = bookings.filter(booking => booking.event);

      return filteredBookings.map(booking => {
        let data = booking.toObject();
        return {
          ...data,
          _id:data._id.toString(),
          user:data.user,
          event:data.event,
          createdAt:(data.createdAt).toString(),
          updatedAt:(data.updatedAt).toString(),
      }
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
   
    if (!fetchedEvent) {
      throw new Error('Event not found!');
    }

    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = booking.event.toObject()
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};