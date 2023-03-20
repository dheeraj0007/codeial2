const User = require('../models/user');
const fs = require('fs');
// const path = require('path');
const cloudinary = require('../utils/cloudinary');
const uploadImage = require('../utils/cloudinary');

module.exports.home = function (req, res) {
    return res.render('users', {
        title: "user"
    });
}

module.exports.profile = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        return res.render('user_profile', {
            title: "User profile",
            profile_user: user,
        });
    })
}


// function faltu() {
// if (req.user.id == req.params.id) {
//     User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
//         return res.redirect('back');
//     })
// }
// else {
//     return res.status(401).send('Unauthorized');
// }
// }

// function faltu2(){
//     User.uploadedAvatar(req, res, function (err) {
//         if (err) {
//             console.log("**** Multer Error *****", err);
//         }
//         console.log(req.file);
//         user.name = req.body.name;
//         user.email = req.body.email;
//         if (req.file) {

//             if (user.avatar) {
//                 fs.unlinkSync(path.join(__dirname, '..', user.avatar));
//             }

//             // this is saving the path of the uploaded file into the avatar field in the user
//             user.avatar = User.avatarPath + '/' + req.file.filename;
//         }
//         user.save();
//         return res.redirect('back');
//     })
// }


module.exports.update = async function (req, res) {
    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            const result = await uploadImage(req);
            user.name = req.body.name;
            user.email = req.body.email;
            user.avatar = result.secure_url;
            await user.save();
            return res.redirect('back');
        } catch (err) {
            console.log("Error ", err);
            return res.redirect('back');
        }
    }
    else {
        return res.status(401).send('Unauthorized');

    }
}

module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up",
    });
}

// render the sign in page
module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In",
    });
}

// get the sign up data
module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            console.log("Error in finding user in signing up");
            return;
        }
        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) {
                    console.log("Error in creating user while signing up");
                    return;
                }
                return res.redirect('/users/sign-in');
            });
        }
        else {
            return res.redirect('/users/sign-in');
        }
    })
}

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function (req, res, next) {
    req.flash('success', 'Logged out Successfully');
    req.logout(function (err) {
        if (err) { return next(err) };
        return res.redirect('/');
    });
}