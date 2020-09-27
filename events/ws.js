'use strict';

const mongoose = require('mongoose');
const Hunter = require('../db/models/hunter');

const getFriendsEvent = async (payload) => {
  let errorMessage = false;
  const user = JSON.parse(payload); // Parsing the payload

  if (mongoose.isValidObjectId(user[0]._id.$oid)) {
    const friends = user[0].friends.map(({$oid}) => $oid); // Flattening the Friends' array

    if (mongoose.isValidObjectId(user[0].hunterSelected.$oid)) {
      const _id = user[0].hunterSelected.$oid; // Getting users' selected hunter
      const hunter = await Hunter.findById({_id}).exec(); // Getting the selected hunter

      if (hunter) {  // If users' selected hunter is found
        const minLevel = hunter.level-10; // Setting minLevel search param
        const maxLevel = hunter.level+10; // Setting maxLevel search param

        let friendsHunters = await Hunter.find({})  // Finding the hunters
          .where('user').in(friends)
          .where('level').gt(minLevel).lt(maxLevel)
          .where('locked').equals(false)
          .limit(10);

        if (friendsHunters.length === 0) {  // If the query did not match any result return error
          errorMessage = `Friends' hunters did not match search query.`;
          console.error(errorMessage);
          return errorMessage;
        }
        return friendsHunters;
      } else {       // If the query did not match any result return error
        errorMessage = `User's selected hunter not found.`;
        console.error(errorMessage);
        return errorMessage;
      }
    } else {
      errorMessage = `Not valid hunter _id.`;
      console.error(errorMessage);
      return errorMessage;
    }
  } else {
    errorMessage = `Not valid user _id.`;
    console.error(errorMessage);
    return errorMessage;
  }
};

const getRandomEvent = async (payload) => {
  console.log(payload);
};

module.exports = {
  getFriends: getFriendsEvent,
  getRandom: getRandomEvent
};
