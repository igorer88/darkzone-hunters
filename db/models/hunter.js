'use strict';

const mongoose = require('mongoose');

let hunterSchema = new mongoose.Schema({
  user: mongoose.ObjectId,
  locked: Boolean,
  level: {
    type: Number,
    min: 0
  }
});

hunterSchema.methods.showInfo = function(){
  if (this._id){
    console.log(`
      _id: ${this._id},
      user: ${this.user},
      locked: ${this.locked},
      level: ${this.level}
      `
    )
  }
}

hunterSchema.methods.savedStatus = function(){
  if (this._id){
    console.log(`
      The Hunter with the _id: ${this._id} with the level: ${this.level},
      and locked: ${this.locked} has been saved.
      `)
  }
}

const Hunter = mongoose.model('Hunter', hunterSchema);

module.exports = Hunter;
