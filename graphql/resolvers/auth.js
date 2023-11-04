const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const{events}=require("./merge")
const jwt = require('jsonwebtoken');



module.exports = {
    
    users: async () => {
        try {

            const users = await User.find()
            return users.map(user => {
                let data = user.toObject();

                return {
                    ...data,
                    _id: data._id.toString(),
                    // createdEvents:data.createdEvents.map(event=>event.toObject())
                };

            });
        }
        catch (err) {
            throw err;
        }
        // try {
        //     const events = await Event.find();
        //     return events.map(event => {
        //       let data = event.toObject();
        //       return {id:event._id, ...data}
        //     })
        //   } catch (err) {
        //     throw err;
        //   }
    },
    
   
    createUser: async args => {
        // console.log("Hi");
        try {
            const existingUser = await User.findOne({ email: args.userInput.email })
            if (existingUser) {
                throw new Error('User exists already.')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save();
            let data= result.toObject();
            return { ...data, password: null, _id:data._id.toString() };
        }
        catch (err) {
            throw err;
        }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
          throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
          throw new Error('Password is incorrect!');
        }

    //  const token =jwt.sign({userId:user.id,email:user.email},"somesupersecretkey")


        const token = jwt.sign(
          { userId: user._id.toString(), email: user.email },
          'somesupersecretkey',
          {
            expiresIn: '1h'
          }
        );
        return { userId: user._id.toString(), token: token, tokenExpiration: 1 };
      },


      checkEmailExists: async ( { email }) => {
        const user = await User.findOne({ email });
        return !!user;
      },
   
};