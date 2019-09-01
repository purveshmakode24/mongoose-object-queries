var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
// var bodyParser = require('body-parser');
//
// var app = express();
// app.use( bodyParser.json() );       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//     extended: true
// }));

var personSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
});


var personModel = mongoose.model("personModel", personSchema);


/* GET home page. */
router.get('/', function (req, res, next) {

    //Dummy data (data when you have no database connected)
    var postTableModel = [
        {
            id: '1',
            name: 'post1',
        },
        {
            id: '2',
            name: 'post2',
        },
        {
            id: '3',
            name: 'post3',
        },
        {
            id: '4',
            name: 'post4',
        }
    ];

    personModel.find({}, (err, persons) => {
        if (err)
            res.json(err)
        else {
            // for(var i=0; i<persons.length; i++){
            //     var count = i;
            //
            // }
            let context = {
                'post': postTableModel,
                'persons': persons,
                'persons_count': persons.length,
                'title': 'Mongoose query object: Operations'
            };
            // console.log(persons);
            console.log(persons.length);
            res.render('index', context);
        }
    });


});


router.post('/submit', (req, res, next) => {
    // let name = req.body.firstname; //get data from template
    console.log(req.body.firstname);
    var myData = new personModel({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
    });
    // console.log(myData);
    myData.save((err, doc) => {
        if (err)
            console.log(err);
        else {
            console.log("Successfully inserted!");
            res.redirect('/');
        }
    });

});

router.post('/delete', (req, res, next) => {
    let person_to_delete = req.body.person_to_delete;
    console.log(person_to_delete);
    personModel.deleteOne({_id: person_to_delete}, (err, result) => {
        if (err)
            console.log(err);
        else {
            console.log('data Deleted!');
            res.redirect('/');
        }
    });

});

router.post('/update', (req, res, next) => {
    let toupdateidobj = req.body.person_id_to_update;
    let updatefirstname = req.body.updatefirstname;
    let updatelastname = req.body.updatelastname;
    console.log(toupdateidobj);
    console.log(updatefirstname);
    console.log(updatelastname);
    personModel.findOneAndUpdate({_id: toupdateidobj}, {firstName:updatefirstname, lastName:updatelastname},(err, result)=>{
        if(err)
            console.log(err);
        else{
            console.log('Data Updated!');
            res.redirect('/');
        }
    })
});

module.exports = router;
