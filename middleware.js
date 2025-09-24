module.exports.isloggedin = (req, res, next) => {
    console.log(req);
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect('/login');
    }
    next();
}