const express = require('express');
const router = express.Router();
var TimeValue = require('../models/timevalues');


router.get("/", (req,res) =>{
    TimeValue.find({},(err,times) => {
        var response={};
        if(err){
            console.log(err)
            response={err: true, data: err};
            res.json(response);
        }
        else{
            times.sort(function(a,b){
                return a['date']<b['date'];
            })
            response= {err:false, data: times};
            res.json(response);
        }
    })
})

module.exports = router;