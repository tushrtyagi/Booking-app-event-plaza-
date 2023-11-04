const Event = require('../../models/event');
const User = require('../../models/user');

const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find().populate('creator');
        return events.map(event => {
          let data=event.toObject();
          return {
            ...data,
            _id: data._id,
            creator: {
              ...data.creator,
              _id: data.creator._id
            }
          };
        });
        // return transformEvent(event);
        // let data = event.toObject();
        // return{ _id:data._id , ...data }
  
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const creatorId = req.userId;
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: creatorId
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = result.toObject();
      const creator = await User.findById(creatorId);

      if (!creator) {
        throw new Error('User not found.');
      }
      // creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};