# MeanPic
MeanPic is a web application developed using the MEAN Stack where users can manage their pictures in cards.

### Technology Stack

*Server-side:*

* NodeJS
* Express (consign, body-parser)
* MongoDB (mongoose)
* Token-Based Authentication (jsonwebtoken)

*Client-side:*

* AngularJS 1.x (route, resource, cookies, animate)
* Browserify
* Grunt
* Materialize CSS Framework

## How to run this application

### Setting the database
Accessing the MongoDB client:
```
mongo
use meanpic
```
Creating the users collection
```
db.createCollection("usuarios")
```

Add a new user
```
db.usuarios.insert({login: 'your-name', senha: 'password'});
```

### Running locally

Open the command line and follow the commands bellow:
```
git clone https://github.com/erickbogarin/mean-pic.git
cd mean-pic
node install
node start
```

Go to localhost:3000/ to see the app
