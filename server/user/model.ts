import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type User = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  graduationYear: number;
  lastActive: Date;
  industry: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UserSchema = new Schema({
  // The user's username
  email: {
    type: String,
    required: true
  },
  // The user's password
  password: {
    type: String,
    required: true
  },
  // The user's first name
  firstName: {
    type: String,
    required: true
  },
  // The user's last name
  lastName: {
    type: String,
    required: true
  },
  // The user's graduation year
  graduationYear: {
    type: Number,
    required: true
  },
  // The date that the last user activity was recorded
  lastActive: {
    type: Date,
    required: true
  },
});

// (virtual-population)
// Auto-populate a User.industry with any followings where User._id == Industry.userId
UserSchema.virtual('industry', {
  ref: 'Industry',
  localField: '_id',
  foreignField: 'userId'
});

UserSchema.set('toObject', {virtuals: true});
UserSchema.set('toJSON', {virtuals: true});
const UserModel = model<User>('User', UserSchema);
export default UserModel;
