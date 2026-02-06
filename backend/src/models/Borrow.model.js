import mongoose from 'mongoose'

const borrowSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  tool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tool'
  },

  status: {
    type: String,
    enum: ['BORROWED', 'RETURNED'],
    default: 'BORROWED'
  },

  borrowedAt: {
    type: Date,
    default: Date.now
  },

  returnedAt: Date

}, { timestamps: true })

export default mongoose.model('Borrow', borrowSchema)
