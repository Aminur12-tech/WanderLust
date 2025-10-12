const User = require('../models/user.js');

module.exports.getsignup = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.postSignup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) => {
            if (err) return next(err);

        })
        req.flash("success", "Successfully Registered");
        res.redirect('/login');
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


module.exports.getLogin = (req, res) => {
    res.render('users/login.ejs');
};


module.exports.postLogin = async (req, res) => {
    req.flash("success", "Welcome to Wanderlust! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
};
