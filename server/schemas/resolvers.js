const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User} = require('../models');


const resolvers = {
Query: {
me: async (context) => {
    if(context.user) {const userData = await User.findOne({})
    .select('-__v -password')
    .populate('books')
    return userData;
    }throw new AuthenticationError('Not logged in')
    },
},
Mutation: {
    User: async (parent, args) => {
    const user = await User.create(args);
    const token = signToken(user);
          return {token, user};
},
login: async (parent, {email, password}) => {
    const user = await User.findOne({email});

    if(!user) {
throw new AuthenticationError('Incorrect info');
}
const correctPw = await user.isCorrectPassword(password);

    if(!correctPw) {
    throw new AuthenticationError('Incorrect info');
}
const token = signToken(user);
return {token, user};
},
saveBook: async (context) => {
    if (context.user) {
        const updatedUser =  await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: args.input } },
        { new: true }
);
    return updatedUser;
}
          throw new AuthenticationError('You must be logged in!');
},
removeBook: async (context) => {
    if(context.user) {
    const updatedUser = await User.findOneAndUpdate(
    { _id: context.user._id },
    { $pull: { savedBooks: { bookId: args.bookId } } },
    { new: true }
);
return updatedUser;
}
throw new AuthenticationError('You must be logged in!');
    }}
};

module.exports = resolvers;