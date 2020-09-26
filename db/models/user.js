'use strict';

const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  name: String
});

userSchema.methods.showInfo = function(){
  if (this.id){
    console.log(`
      _id: ${this._id},
      name: ${this.name},
      `
    )
  }
}

userSchema.methods.savedStatus = function(){
  if (this._id){
    console.log(`
      The User with the id: ${this._id} with the name: ${this.name},
      has been saved.
      `)
  }
}

const User = mongoose.model('User', userSchema);

module.exports = User;
