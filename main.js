const express = require("express")
const app = express()
const mustache = require("mustache-express")
const session = require("express-session")
const url = require("url")
const bodyParser = require("body-parser")
const users = require("./users")
app.engine("mustache", mustache())
app.set("view engine", "mustache")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
  extended: false
}))

let sesh = {
  secret: "TYLERSSECRETKEY",
  cookie: {},
  saveUninitialized: true,
  resave: true
}
//get means im getting data
//post means im sending data
app.use(session(sesh))
//getting data from index
app.get("/", function(req, res, next) {
  //setting session to false so I can change to true when I get a user
  req.session.authorized = false
  res.redirect("/login")
})
//getting the login url page so that you can render the login page
//actually RENDERING me to the page
app.get("/login", function(req, res, next) {
  res.render("login")
})

//posting data to /authorized
app.post("/authorized", function(req, res, next) {

  const username = req.body.username
  const password = req.body.password
  // empty variable so i can use later
  let user
  for (let i = 0; i < users.length; i++) {
    //users[i].username = "name at each index"    users[i].password = "password at each index"
    //and asked if it is === (equal to) username and password
    if (users[i].username === username && users[i].password === password) {
      //user is now the authorized username and password
      user = users[i]
    }
  }

  if (user) {
    req.session.user = user
    //now we have a user
    req.session.authorized = true
    //redirect to /index
    res.redirect("/index")
  } else {
    //if password is incorrect or unauthorized go back to login
    res.render("login", {
      message: "incorrect username or password"
    })

  }
})

app.get("/index", function(req, res, next) {
  res.render("index")
})


app.listen(3000, function() {
  console.log("we in it!")
})
