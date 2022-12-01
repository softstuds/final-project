import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a TimeBlock
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for TimeBlock on the backend
export type TimeBlock = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  owner: Types.ObjectId;
  requester: Types.ObjectId;
  start: Date;
  accepted: boolean;
  met: boolean;
};

export type PopulatedTimeBlock = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  owner: User;
  requester: User;
  start: Date;
  accepted: boolean;
  met: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// TimeBlocks stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const TimeBlockSchema = new Schema<TimeBlock>({
  // The owner's userId
  owner: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The requester's userId
  requester: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  // The start time of the 1hr-long time block
  start: {
    type: Date,
    required: true
  },
  // Whether the time block has been accepted by the owner
  accepted: {
    type: Boolean,
    required: false,
    default: false
  },
  // Whether the accepted meeting has actually met
  met: {
    type: Boolean,
    required: false,
    default: null
  }
});

const TimeBlockModel = model<TimeBlock>('TimeBlock', TimeBlockSchema);
export default TimeBlockModel;
