const express = require('express');
const router = express.Router();
var House = require('../models/house');

router.get('/all', (req,res) => {
    House.find({},'price post-id area',(err,house) =>{
        response={}
        if (err){
            console.log(err);
            response={err:true,data:err}
            res.json(response)
        }
        else{
            response={err:false,data:house}
            res.json(response)
        }
    })
})

router.get('/', (req,res) => {
    params= req.query;
    query = House.find();
    if (params.htype!=undefined && params.htype!=''){
        var htype=params.htype.split(';');
        if(htype.length>1){
            htype.splice(-1,1);
        }
        query.where('house-type').in(htype);
    }
    if(params.province!='' && params.province!=undefined){
        query.where('location.province').equals(params.province);
        if(params.county!='' && params.county!= undefined ){
            query.where('location.county').equals(params.county);
            if(params.ward!='' && params.ward!= undefined ){
                query.where('location.ward').equals(params.ward);
            }
        }
    }
    if(params.transtype!='' && params.transtype!=undefined ){
        query.where('transaction-type').equals(params.transtype);
    }
    if(params.startDate!='' && params.startDate != undefined){
        query.where("post-time.date").gte(new Date(params.startDate));
    }
    if(params.endDate!='' && params.endDate != undefined){
        query.where("post-time.date").lte(new Date(params.endDate));
    }
    query.select('price area');
    query.exec((err,houses) => {
        response={}
        if (err){
            console.log(err);
            response={err:true,data:err}
            res.json(response)
        }
        else{
            var average=0;
            for(var i=0;i<houses.length;i++){
                
                average+=houses[i]['price'];
            }
            average/=houses.length;
            response={err:false,data:houses}
            res.json(response)
        }
    })
})

router.get('/count', (req,res) => {
    params= req.query;
    query = House.count();
    if (params.htype!=undefined && params.htype!=''){
        var htype=params.htype.split(';');
        if(htype.length>1){
            htype.splice(-1,1);
        }
        query.where('house-type').in(htype);
    }
    if(params.province!='' && params.province!=undefined){
        query.where('location.province').equals(params.province);
        if(params.county!='' && params.county!= undefined ){
            query.where('location.county').equals(params.county);
            if(params.ward!='' && params.ward!= undefined ){
                query.where('location.ward').equals(params.ward);
            }
        }
    }
    if(params.transtype!='' && params.transtype!=undefined ){
        query.where('transaction-type').equals(params.transtype);
    }
    if(params.startDate!='' && params.startDate != undefined){
        query.where("post-time.date").gte(new Date(params.startDate));
    }
    if(params.endDate!='' && params.endDate != undefined){
        query.where("post-time.date").lte(new Date(params.endDate));
    }
    query.exec((err,count) => {
        response={}
        if (err){
            console.log(err);
            response={err:true,data:err}
            res.json(response)
        }
        else{
            response={err:false,data:count}
            res.json(response)
        }
    })
})

router.get("/aggregate",(req, res) =>{
    params= req.query;
    query=[];
    groupBy="$location.province";
    if(params.province!='' && params.province!=undefined){
        query.push({"$match":{"location.province":params.province}});
        groupBy="$location.county";
        if(params.county!='' && params.county!= undefined ){
            query.push({"$match":{"location.county":params.county}});
            groupBy = "$location.ward";
        }
    }
    if (params.htype!=undefined && params.htype!=''){
        var htype=params.htype.split(';');
        if(htype.length>1){
            htype.splice(-1,1);
        }
        query.push({"$match":{"house-type":{"$in":htype}}});
    }
    matchDate={};
    hasDate=false;
    if(params.startDate!='' && params.startDate != undefined){
        matchDate['$gte']=new Date(params.startDate);
        hasDate=true;
    }
    if(params.endDate!='' && params.endDate != undefined){
        matchDate['$lte']=new Date(params.endDate);
        hasDate=true;
    }
    if (hasDate==true){
        query.push({"$match":{"post-time.date":matchDate}});
    }

    if(params.transtype!='' && params.transtype!=undefined ){
        
        query.push({"$match":{"transaction-type":params.transtype}});
    }
    query.push({"$group":{"_id":groupBy,"count": {"$sum": 1}}});
    House.aggregate(query,(err,house) => {
        if(err){
            res.json({"err":true,"data":err});
        }
        else{
            res.json({"err":false,"data":house});
        }
    });
});

router.get("/htypepercent", (req, res) =>{
    params= req.query;
    query=[];
    if(params.province!='' && params.province!=undefined){
        query.push({"$match":{"location.province":params.province}});
        groupBy="$location.county";
        if(params.county!='' && params.county!= undefined ){
            query.push({"$match":{"location.county":params.county}});
            groupBy = "$location.ward";
        }
    }

    matchDate={};
    hasDate=false;
    if(params.startDate!='' && params.startDate != undefined){
        matchDate['$gte']=new Date(params.startDate);
        hasDate=true;
    }
    if(params.endDate!='' && params.endDate != undefined){
        matchDate['$lte']=new Date(params.endDate);
        hasDate=true;
    }
    if (hasDate==true){
        query.push({"$match":{"post-time.date":matchDate}});
    }

    if(params.transtype!='' && params.transtype!=undefined ){
        
        query.push({"$match":{"transaction-type":params.transtype}});
    }
    query.push({"$group":{"_id":"$house-type","count": {"$sum": 1}}});
    House.aggregate(query,(err,house) => {
        if(err){
            res.json({"err":true,"data":err});
        }
        else{
            res.json({"err":false,"data":house});
        }
    });
})

router.get('/countpost',(req,res) => {
    params= req.query;
    query=[];
    groupBy="$post-time.date";
    if(params.province!='' && params.province!=undefined){
        query.push({"$match":{"location.province":params.province}});
        if(params.county!='' && params.county!= undefined ){
            query.push({"$match":{"location.county":params.county}});
        }
    }
    if (params.htype!=undefined && params.htype!=''){
        var htype=params.htype.split(';');
        if(htype.length>1){
            htype.splice(-1,1);
        }
        query.push({"$match":{"house-type":{"$in":htype}}});
    }
    if (params.website!=undefined && params.website !=''){
        var website=params.website.split(';');
        if(website.length>1){
            website.splice(-1,1);
        }
        query.push({"$match":{"website":{"$in":website}}});
    }
    matchDate={};
    hasDate=false;
    if(params.startDate!='' && params.startDate != undefined){
        matchDate['$gte']=new Date(params.startDate);
        hasDate=true;
    }
    if(params.endDate!='' && params.endDate != undefined){
        matchDate['$lte']=new Date(params.endDate);
        hasDate=true;
    }
    if (hasDate==true){
        query.push({"$match":{"post-time.date":matchDate}});
    }
    if(params.transtype!='' && params.transtype!=undefined ){
        query.push({"$match":{"transaction-type":params.transtype}});
    }
    query.push({"$group":{"_id":groupBy,"count": {"$sum": 1}}});
    House.aggregate(query,(err,house) => {
        if(err){
            res.json({"err":true,"data":err});
        }
        else{

            res.json({"err":false,"data":house});
        }
    });

})

router.get('/trendprice', (req,res) => {
    params= req.query;
    query = House.find();
    if (params.htype!=undefined && params.htype!=''){
        var htype=params.htype.split(';');
        if(htype.length>1){
            htype.splice(-1,1);
        }
        query.where('house-type').in(htype);
    }
    if(params.province!='' && params.province!=undefined){
        query.where('location.province').equals(params.province);
        if(params.county!='' && params.county!= undefined ){
            query.where('location.county').equals(params.county);
            if(params.ward!='' && params.ward!= undefined ){
                query.where('location.ward').equals(params.ward);
            }
        }
    }
    if(params.startDate!='' && params.startDate != undefined){
        query.where("post-time.date").gte(new Date(params.startDate));
    }
    if(params.endDate!='' && params.endDate != undefined){
        query.where("post-time.date").lte(new Date(params.endDate));
    }
    if(params.transtype!='' && params.transtype!=undefined ){
        query.where('transaction-type').equals(params.transtype);
    }
    query.select("post-time.date price");
    query.exec((err, houses) =>{
        response= {};
        if(err){
            response = {"err":true, "data":err};
            console.log(err);
            res.json(response);
        }
        else{
            data=[]

            for(var i =0; i<houses.length;i++){
                item = houses[i].toObject();
                have_value=check_array(data,item['post-time']['date']);
                if (have_value<0){
                    data.push({"date":item['post-time']['date'],"count":1,"list":[item['price']],"total":item['price']});
                }
                else{
                    data[have_value]['list'].push(item['price']);
                    data[have_value]['total']+=item['price'];
                    data[have_value]['count']+=1;

                }
            }
            data.sort(function(a,b){
                return a['date'].getTime()-b['date'].getTime();
            })
            for( var i =0 ;i<data.length; i++ ) {
                data[i]['dateString']=('0' + data[i]['date'].getUTCDate()).slice(-2) + '-' + 
                                  ('0' + (data[i]['date'].getUTCMonth()+1)).slice(-2) + '-' + data[i]['date'].getUTCFullYear();
            }
            response = {'err': false, "data": data};
            res.json(response);
        }
    });
})

function check_array(array, value){
    for(var i=0; i< array.length; i++){
        if(array[i]['date'].getDate()==value.getDate() && array[i]['date'].getMonth()==value.getMonth() && array[i]['date'].getYear()==value.getYear()){
            return i;
        }
    }
    return -1
}

router.get('/average', (req,res) => {
    params= req.query;
    query = House.find();
    if (params.htype!=undefined && params.htype!=''){
        var htype=params.htype.split(';');
        if(htype.length>1){
            htype.splice(-1,1);
        }
        query.where('house-type').in(htype);
    }
    if(params.province!='' && params.province!=undefined){
        query.where('location.province').equals(params.province);
        // if(params.county!='' && params.county!= undefined ){
        //     query.where('location.county').equals(params.county);
        //     if(params.ward!='' && params.ward!= undefined ){
        //         query.where('location.ward').equals(params.ward);
        //     }
        // }
    }
    if(params.startDate!='' && params.startDate != undefined){
        query.where("post-time.date").gte(new Date(params.startDate));
    }
    if(params.endDate!='' && params.endDate != undefined){
        query.where("post-time.date").lte(new Date(params.endDate));
    }
    if(params.transtype!='' && params.transtype!=undefined ){
        query.where('transaction-type').equals(params.transtype);
    }
    query.select('price location');
    query.sort('price');
    query.exec((err,houses) => {
        response={}

        if (err){
            console.log(err);
            response={err:true,data:err}
            res.json(response)
        }
        else{
            var countyList= {};
            var countyAtt = {};
            for( var i =0;i < houses.length;i++){
                county=houses[i]['location']['county']

                if(!countyList.hasOwnProperty(county)){
                    countyAtt[county]={"mean":houses[i]['price']}
                    countyList[county]=[houses[i]['price']]
                }
                else{
                    countyList[county].push(houses[i]['price']);
                    countyAtt[county]['mean'] += houses[i]['price'];
                }
            }
            countyNames=Object.keys(countyAtt);
            for(var i=0; i<countyNames.length; i++){
                county=countyNames[i];
                if(!countyAtt.hasOwnProperty(county)){
                    continue
                }
                house_array=countyList[county];
                var median=0;
                var firstQuartile = 0;
                var thirdQuartile = 0;
                var minimum = house_array[0];
                var maximum = house_array[house_array.length-1];
                if (house_array.length == 0){
                    countyAtt[county]['median'] = 0;
                    countyAtt[county]['mean'] = 0;
                    countyAtt[county]['firstQuartile'] = firstQuartile;
                    countyAtt[county]['thirdQuartile'] = thirdQuartile;
                    countyAtt[county]['maximum'] = 0;
                    countyAtt[county]['minimum'] = 0;
                    continue
                }
                else if (house_array.length==1){
                    countyAtt[county]['median'] = house_array[0];
                    countyAtt[county]['mean'] = house_array[0];
                    countyAtt[county]['firstQuartile'] = house_array[0];
                    countyAtt[county]['thirdQuartile'] = house_array[0];
                    countyAtt[county]['maximum'] = house_array[0];
                    countyAtt[county]['minimum'] = house_array[0];
                    continue
                }
                if(house_array.length%2==0){
                    median=(house_array[house_array.length/2-1]+house_array[house_array.length/2])/2
                }
                else{
                    median = house_array[parseInt(house_array.length/2)];
                }
                var halfLength=parseInt(house_array.length/2);
                if(halfLength%2 == 0){
                    firstQuartile = (house_array[halfLength/2-1]+house_array[halfLength/2])/2;
                    thirdQuartile = (house_array[parseInt(halfLength*3/2)-1]+house_array[parseInt(halfLength*3/2)])/2;

                }
                else{
                    firstQuartile = house_array[Math.floor(halfLength/2)];
                    thirdQuartile = house_array[Math.floor(halfLength/2)+halfLength];
                }
                countyAtt[county]['median'] = median;
                countyAtt[county]['mean'] /= countyList[county].length;
                countyAtt[county]['firstQuartile'] = firstQuartile;
                countyAtt[county]['thirdQuartile'] = thirdQuartile;
                countyAtt[county]['maximum'] = maximum;
                countyAtt[county]['minimum'] = minimum;
                
            }
            // average=0;
            // median=houses[parseInt(houses.length/2)]
            // min=0
            // if (houses.length>0){
            //     min=houses[0]['price'];
            // }
            
            // max=0;
            // if (median != undefined){
            //     median=median['price'];
            // }
            // else{
            //     median=0;
            // }
            // for( var i = 0; i<houses.length;i++){
            //     average += houses[i]['price'];
            //     max = max < houses[i]['price'] ? houses[i]['price'] : max;
            //     min = min > houses[i]['price'] ? houses[i]['price'] : min;
            // }
            // average/=houses.length;
            // response={err:false,data:{ "median": median,"min":min,"max":max,"mean": average}}
            response = {err:false, data: countyAtt}
            res.json(response)
        }
    })
})

router.get('/countmenu', (req,res) =>{
    params= req.query;
    query=[];
    groupBy="$"+params.groupBy;
    if(params.province!='' && params.province!=undefined){
        query.push({"$match":{"location.province":params.province}});
        groupBy="$location.county";
        if(params.county!='' && params.county!= undefined ){
            query.push({"$match":{"location.county":params.county}});
            groupBy = "$location.ward";
        }
    }
    if (params.htype!=undefined && params.htype!=''){
        var htype=params.htype.split(';');
        if(htype.length>1){
            htype.splice(-1,1);
        }
        query.push({"$match":{"house-type":{"$in":htype}}});
    }
    matchDate={};
    hasDate=false;
    if(params.startDate!='' && params.startDate != undefined){
        matchDate['$gte']=new Date(params.startDate);
        hasDate=true;
    }
    if(params.endDate!='' && params.endDate != undefined){
        matchDate['$lte']=new Date(params.endDate);
        hasDate=true;
    }
    if (hasDate==true){
        query.push({"$match":{"post-time.date":matchDate}});
    }

    if(params.transtype!='' && params.transtype!=undefined ){
        
        query.push({"$match":{"transaction-type":params.transtype}});
    }
    query.push({"$group":{"_id":groupBy,"count": {"$sum": 1}}});
    House.aggregate(query,(err,house) => {
        if(err){
            res.json({"err":true,"data":err});

        }
        else{
            res.json({"err":false,"data":house});
        }
    });
})

module.exports = router;