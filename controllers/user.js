const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require("../auth"); 

module.exports = {
    checkEmailExists: (req, res) => {
        if (req.body.email.includes("@")) {
            return User.find({ email : req.body.email })
            .then(result => {
                if (result.length > 0) {
                    return res.status(409).send({ message: "Duplicate email found" });
                } else {
                    return res.status(200).send({ message: "No duplicate email found" });
                };
            })
            .catch(error => errorHandler(error, req, res));
        } else {
            res.status(400).send({ message: "Email invalid" });
        }
    },

    registerUser: async (req, res) => {
        if(!req.body.email.includes("@")){
            return res.status(400).send({message: 'Invalid Email format'});
        } else {
            let newUser = new User({
                email : req.body.email,
                username : req.body.username,
                password : bcrypt.hashSync(req.body.password, 10)
            })

            return newUser.save()
            .then((result) => res.status(201).send({message: "Registered Successfully"}))
            .catch(error => auth.errorHandler(error, req, res))
        }
    },

    loginUser: (req, res) => {
        if(!req.body.email.includes("@")){
            return res.status(400).send({message: "Invalid Email format"});
        }
        return User.findOne({ email : req.body.email })
        .then(result => {    
            if(result == null){
                return res.status(404).send(false);
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                if (isPasswordCorrect) {
                    return res.status(200).send({ access : auth.createAccessToken(result)});
                } else {
                    return res.status(401).send(false);
                }

            }

        })
        .catch(error => auth.errorHandler(error, req, res))
    },

    getDetails: (req,res) => {
        return User.findById(req.user.id)
        .then(user => {
            if(!user){
                return res.status(403).send({ message: 'User not found' });
            } else {
                user.password = "";
                const userObj = user.toObject();
                delete userObj.password;
                
                
                return res.status(200).send(userObj);
            }  
        })
        .catch(error => errorHandler(error, req, res));
    },
}