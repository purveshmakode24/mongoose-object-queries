var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var flash = require('express-flash-messages');
// var bodyParser = require('body-parser');
//
// var app = express();
// app.use( bodyParser.json() );       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//     extended: true
// }));

var personSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
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
                'title': 'Mongoose query object: Operations',
                // 'success': success,
                // 'errors': errors,
            };
            // console.log(persons);
            console.log(persons.length);
            res.render('index', context);
        }
    });


});

router.get('/submit', (req,res,next)=>{
    res.redirect('/');
});


router.post('/submit', (req, res, next) => {
    // let name = req.body.firstname; //get data from template
    var errors = [];
    var success = [];
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var myData = new personModel({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
    });
    // console.log(myData);

    myData.save((err, doc) => {
        if (err) {
            // console.log(err);
            if (!firstname || !lastname) {
                errors.push({message: "Please Enter the Fields"});
            }

            // if (!lastname) {
            //     errors.push({message2: "Please Enter your Last Name"});
            // }

            console.log(errors);
            personModel.find({}, (err, persons) => {
                if (err)
                    res.json(err);
                else {
                    let context = {
                        'persons': persons,
                        'persons_count': persons.length,
                        'title': 'Mongoose query object: Operations',
                        'errors': errors,
                    };
                    // console.log(persons);
                    console.log(persons.length);
                    res.render('index', context);
                }
            });
        }
        else {
            console.log("Successfully inserted!");
            success.push({message3: "Data Successfully Added!"});
            // req.flash('success_message','Successfully Added');
            console.log(success);
            personModel.find({}, (err, persons) => {
                if (err)
                    res.json(err);
                else {
                    let context = {
                        'persons': persons,
                        'persons_count': persons.length,
                        'title': 'Mongoose query object: Operations',
                        'success': success,
                    };
                    // console.log(persons);
                    console.log(persons.length);
                    res.render('index', context);
                }
            });
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

router.post('/update/:id', (req, res, next) => {
    // let toupdateidobj = req.body.person_id_to_update;
    let toupdateidobj = req.params.id;
    console.log(toupdateidobj);
    let updatefirstname = req.body.updatefirstname;
    let updatelastname = req.body.updatelastname;
    console.log(updatefirstname);
    console.log(updatelastname);
    personModel.findOneAndUpdate({_id: toupdateidobj}, {
        firstName: updatefirstname,
        lastName: updatelastname
    }, (err, result) => {
        if (err)
            console.log(err);
        else {
            console.log('Data Updated!');

            res.redirect('/');
        }
    })
});

module.exports = router;
