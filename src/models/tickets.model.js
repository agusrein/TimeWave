const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchase: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: true
    }
})
const ticketsModel = mongoose.model('tickets', ticketSchema);
module.exports = ticketsModel;