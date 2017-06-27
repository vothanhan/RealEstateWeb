mongoose= require('mongoose')

module.exports = mongoose.model('Timevalue',{
    date: Date,
    price: Number,
    count: Number
})