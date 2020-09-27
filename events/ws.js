'use strict';

const mongoose = require('mongoose');
const Hunter = require('../db/models/hunter');

const getFriendsEvent = async (payload) => {
  let errorMessage = '';
  const user = JSON.parse(payload); // Parsing the payload

  if (mongoose.isValidObjectId(user[0]._id.$oid)) {   // Validating user's id
    const friends = user[0].friends.map(({$oid}) => $oid); // Flattening the Friends' array

    if (mongoose.isValidObjectId(user[0].hunterSelected.$oid)) {  // Validating hunters's id
      const _id = user[0].hunterSelected.$oid; // Getting users' selected hunter
      const hunter = await Hunter.findById({_id}); // Getting the selected hunter

      if (hunter) {  // If users' selected hunter is found
        const minLevel = hunter.level-10; // Setting minLevel search param
        const maxLevel = hunter.level+10; // Setting maxLevel search param

        const friendsHunters = await Hunter.find({})  // Finding the hunters
          .where('user').in(friends)
          .where('level').gte(minLevel).lte(maxLevel)
          .where('locked').equals(false)
          .limit(10);

        if (friendsHunters.length === 0) {  // If the query did not match any result return error
          errorMessage = `Friends' hunters did not match search query.`;
          console.error(`App > ${errorMessage}`);
          return errorMessage;
        }
        console.log(`App > Returning friends' hunters.`)
        return friendsHunters;    // If everything's ok, return friends' hunters

      } else {       // If the query did not match any result return error
        errorMessage = `User's selected hunter not found.`;
        console.error(`App > ${errorMessage}`);
        return errorMessage;
      }
    } else {        // If the hunter oid is not valid return error
      errorMessage = `Not valid hunter _id.`;
      console.error(`App > ${errorMessage}`);
      return errorMessage;
    }
  } else {          // If the user oid is not valid return error
    errorMessage = `Not valid user _id.`;
    console.error(`App > ${errorMessage}`);
    return errorMessage;
  }
};

const getRandomEvent = async (payload) => {
  let errorMessage = '';
  const user = JSON.parse(payload); // Parsing the payload

  if (mongoose.isValidObjectId(user[0]._id.$oid)) { // Validating user's id
    const _id = user[0].hunterSelected.$oid; // Getting users' selected hunter
    if (mongoose.isValidObjectId(user[0].hunterSelected.$oid)) {  // Validating hunter's id
      const hunter = await Hunter.findById({_id}); // Getting the selected hunter

      if (hunter) {
        const minLevel = hunter.level-10; // Setting minLevel search param
        const maxLevel = hunter.level+10; // Setting maxLevel search param
        let random = 0;

        await Hunter.countDocuments().exec(async (err, count) => {
          random = Math.floor(Math.random() * count); // Get a random entry
        });
        const randomHunters = await Hunter.find()
          .skip(random)                                 // Skiping those random entries
          .where('level').gte(minLevel).lte(maxLevel)
          .where('locked').equals(false)
          .limit(10);
        if (randomHunters.length === 0) {  // If the query did not match any result return error
          errorMessage = `Random' hunters did not match search query.`;
          console.error(`App > ${errorMessage}`);
          return errorMessage;
        }
        console.log('App > Returning random hunters.')
        return randomHunters;     // If everything's ok, return random hunters

      } else {       // If the query did not match any result return error
        errorMessage = `User's selected hunter not found.`;
        console.error(`App > ${errorMessage}`);
        return errorMessage;
      }
    } else {        // If the hunter's oid is not valid return error
      errorMessage = `Not valid hunter _id.`;
      console.error(`App > ${errorMessage}`);
      return errorMessage;
    }
  } else {        // If the user's oid is not valid return error
    errorMessage = `Not valid user _id.`;
    console.error(`App > ${errorMessage}`);
    return errorMessage;
  }
};

module.exports = {
  getFriends: getFriendsEvent,
  getRandom: getRandomEvent
};
