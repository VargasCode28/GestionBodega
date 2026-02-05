import mongoose from 'mongoose'

const loanSchema = new mongoose.Schema({
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tool: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tool'
    },
    loanDate: {
        type: Date,
        default: Date.now
    },
    returnDate: Date,
    status: {
        type: String,
        enum: ['BORROWED', 'RETURNED'],
        default: 'BORROWED'
    }
})

export default mongoose.model('Loan', loanSchema)
