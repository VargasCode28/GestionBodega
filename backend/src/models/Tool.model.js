import mongoose from 'mongoose'


const toolSchema = new mongoose.Schema({
    name: String,
    description: String,
    code: String,

    status: {
        type: String,
        enum: ['AVAILABLE', 'BORROWED'],
        default: 'AVAILABLE'
    }
}, { timestamps: true})

export default mongoose.model('Tool', toolSchema)
