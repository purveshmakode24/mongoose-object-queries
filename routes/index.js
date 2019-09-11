var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var flash = require('express-flash-messages');
var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const {check, validationResult} = require('express-validator');
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

//global var messages
var errs = [];
var flash_success = [];

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

    var json = '{ "name":"Krunal", "age":25, "city":"Rajkot", "degree": "BE"}'; //Json string form (Cant access object unless we parse it .)

    var pjson = JSON.parse(json); // json objects form

    // console.log(json);
    // console.log(pjson);

    personModel.find({}, (err, persons) => {
        if (err)
            res.json(err);
        else {

            let context = {
                'post': postTableModel,
                'persons': persons,
                'persons_count': persons.length,
                'title': 'Mongoose query object: Operations',
                // 'success': success,
                'err': errs,
                'success': flash_success,
                // 'err': req.session.errors,
                // 'success':req.session.success,
            };
            // console.log(persons);
            // console.log(req.session.errors);
            console.log(persons.length);
            // console.log(pe);
            res.render('index', context);
            // req.session.errors = null;
            errs = [];  //need to clear array message at every request
            flash_success = []; // --//--
        }
    });


});

// router.get('/submit', (req, res, next) => {
//     res.redirect('/');
// });


router.post('/',
    [check('firstname').not().isEmpty().withMessage('This field is required.').isLength({
        min:3,
        max: 12
    }).withMessage('First Name with min 3 and max 12 characters is required.').custom(value =>{
        return personModel.findOne({firstName:value}).then(user => {
            if (user) {
                return Promise.reject('This field already in use');
            }
        })
    }),
        check('lastname').not().isEmpty().withMessage('This field is required.').isLength({min:3, max: 12}).withMessage('Last Name with min 3 and max 12 characters is required.').custom(value =>{
            return personModel.findOne({lastName:value}).then(user => {
                if (user) {
                    return Promise.reject('This field already in use');
                }
            })
        })],
    (req, res, next) => {

        // req.check('firstname', 'First name is required').isNotEmpty();
        // req.check('lastname', 'Last name is required').isNotEmpty();

        var firstname = req.body.firstname;
        var lastname = req.body.lastname;

        // var errors =req.validationErrors();

        const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(422).json({ errors: errors.array() });
        // }
        console.log(errors);



        if (!errors.isEmpty()) {
            errs.push(errors.mapped());
            // console.log(req.session.errors);
            // res.redirect('/');
            console.log(errs);
            // res.redirect('/');//<--------------------------------- INCLUDE IT(if u want validaion errors without rendering input value field) OR

            personModel.find({}, (err, persons) => {
                if (err)
                    res.json(err);
                else {

                    let context = {
                        // 'post': postTableModel,
                        'persons': persons,
                        'persons_count': persons.length,
                        'title': 'Mongoose query object: Operations',
                        // 'success': success,
                        'err': errs,
                        // 'success': flash_success,
                        // 'err': req.session.errors,
                        // 'success':req.session.success,
                        'post_firstname': firstname,
                        'post_lastname' : lastname,
                    };
                    // console.log(persons);
                    // console.log(req.session.errors);
                    console.log(persons.length);
                    // console.log(pe);
                    res.render('index', context);
                    // req.session.errors = null;
                    errs = [];  //need to clear array message at every request
                    // flash_success = []; // --//--
                }
            });
            // include above =>>>>if u want validaion errors with rendering input value fields
            //=-------------------------------------------------------------------------<//

            // req.session.success=false;

        } else {

            // req.session.success=true;

            var myData = new personModel({
                firstName: req.body.firstname,
                lastName: req.body.lastname,
            });
            // console.log(myData);

            myData.save((err, doc) => {
                if (err) {
                    console.log(err);
                    // if (!firstname || !lastname) {
                    //     errors.push({message: "Please Enter the Fields"});
                    // }

                    // if (!lastname) {
                    //     errors.push({message2: "Please Enter your Last Name"});
                    // }

                }
                else {
                    console.log("Successfully inserted!");
                    // success.push({message3: "Data Successfully Added!"});
                    // req.flash('success_message','Successfully Added');
                    // req.flash('success', 'Data has been Added Successfully');
                    flash_success.push({message: "Data has been successfully Added!"});
                    res.redirect('/');
                }
            });
        }

    });

router.post('/delete', (req, res, next) => {
    let person_to_delete = req.body.person_to_delete;
    console.log(person_to_delete);
    personModel.deleteOne({_id: person_to_delete}, (err, result) => {
        if (err)
            console.log(err);
        else {
            console.log('data Deleted!');
            flash_success.push({message: "Data has been Deleted!"});
            res.redirect('/');
        }
    });

});

router.post('/update/:id/:firstName/:lastName/', [check('updatefirstname').custom((value,{req})=>{
    return personModel.findOne({firstName:value}).then(user=>{
        if(user) {
            if (req.params.firstName !== req.body.updatefirstname) {
                return Promise.reject('First Name already in use');
            }
        }
    })
}),
    check('updatelastname').custom((value, {req})=>{
        return personModel.findOne({lastName:value}).then(user=>{
            if(user) {
                if (req.params.lastName !== req.body.updatelastname) {
                    return Promise.reject('Last Name already in use');
                }
            }
        })
    })
], (req, res, next)=> {
    // let toupdateidobj = req.body.person_id_to_update;

    const errors = validationResult(req);

    if (!errors.isEmpty()){
         errs.push(errors.mapped());
         console.log(errs);
         // console.log(errs[0][0]['msg']);

         res.redirect('/');
    }else {
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
                flash_success.push({message: "Data Successfully Updated!"});
                res.redirect('/');
            }
        })
    }

});

module.exports = router;
