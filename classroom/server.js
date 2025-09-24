const express = require('express');//import express
const app = express();//create express app
const cookieParser = require('cookie-parser');//to parse cookies
const { name } = require('ejs');//template engine
const session = require('express-session');//session management
var flash = require('connect-flash');//to display flash messages
const path = require('path');//to handle file and directory paths

//session configuration
const sessionOptions = {
    secret: "mysecretstring",
    resave: false,
    saveUninitialized: true,
};

//setting up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//middleware
app.use(session(sessionOptions));
app.use(flash());

//middleware to make flash messages available in all templates
app.use((req, res, next) => {
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('error');
    next();
});

//routes
app.get('/register', (req, res) => {
    let { name = 'anonymous' } = req.query;
    req.session.name = name;
    if (name === 'anonymous') {
        req.flash('error', 'User not found');
    } else {
        req.flash('success', 'user registerd successfully');
    }
    res.redirect('/hello');
});

//route to display flash messages
app.get('/hello', (req, res) => {
    res.render('page.ejs', { name: req.session.name });
});

// app.get('/reqcount', (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// });

// app.get('/test', (req, res) => {
//     res.send('Test successful');
// });



//Learning Cookies

// app.use(cookieParser());

// app.get('/greet', (req, res) => {
//     let { name = 'Anonymous' } = req.cookies;
//     res.send(`hi, ${name}`);
// });

// app.get('/getcookies', (req, res) => {
//     res.cookie('greet', "namaste");
//     res.send('send you some cookie');
// });

// app.get('/', (req, res) => {
//     console.dir(req.cookies);
//     res.send('Hi, I am root!');
// })


app.listen(3001, () => {
    console.log("Server is running on 3001");
})





