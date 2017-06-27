mongoose= require('mongoose')

module.exports = mongoose.model('House',{
    price: Number,
    area: Number,
    'house-type': String,
    location:{
        province: String,
        county: String,
        ward: String,
    },
    'transaction-type': String
})