var express = require("express"),
	cache = require("memory-cache"),
	trupass = {},
	app = express(),
	qstring = require("querystring"),
	extend = require("xtend"),
	format = require("util").format,
	globalResponse,
	globalRequest,
	ObjectID = require('mongodb').ObjectID,
	uri = 'mongodb://heroku_app18393746:1mhabliftdatf6sl9sen2ltaob@ds047448.mongolab.com:47448/heroku_app18393746';

var ml = require("mongolink");
ml.uri = uri;

trupass.request = function() {

	if (globalRequest) {
		var nosql,
			qs = globalRequest.query;

		console.log(qs.method + " method called\n");

		switch (qs.method) {
			case "register":
				nosql = {
					"firstName": qs.firstName,
					"lastName": qs.lastName,
					"email": qs.email,
					"pass": qs.pass,
					"confirmed": false,
					"dateCreated": new Date()
				};
				trupass.register(nosql);
				break;

			case "login":
				nosql = {
					"email": qs.email,
					"pass": qs.pass
				};
				trupass.login(nosql);
				break;

			case "updateUser":
				nosql = {
					"firstName": qs.firstName,
					"lastName": qs.lastName,
					"email": qs.email
				};
				trupass.updateUser(qs.userID, nosql);
				break;

			case "addCreditCard":
				nosql = {
					"creditCard": {
						"number": qs.number,
						"nameOnCard": qs.nameOnCard,
						"expiry": qs.expiry,
						"ccid": qs.ccid,
						"limit": qs.limit
					}
				};
				trupass.addCreditCard(qs.userID, nosql);
				break;
			case "listCreditCard":
				trupass.listCreditCard(qs.userID);
				break;

			case "removeCreditCard":
				break;
			case "updateCreditCard":
				break;
			case "addTruPass":
				nosql = {
					"limit": qs.limit,
					"balance": qs.limit,
					"userID": null,
					"parentCard": qs.parentCard,
					"preAuthId": null,
					"type": qs.type
				};

				var user = {
					"email": qs.email,
					"firstName": qs.fistName,
					"lastName": qs.lastName
				};

				trupass.addTruPass(user, nosql);
				break;
			case "removeTruPass":

				break;
			case "updateTruPass":
				break;

			case "addTransaction":

				break;
			case "confirmUser":
				trupass.updateUser(qs.userID, {
					"confirmed": true
				});
				break;
			default:
				globalResponse.send(200, {
					"error": "An error"
				});
				break;
		}
	}
};

trupass.listCreditCard = function(req, res) {
	var userID = req.params.userID;

	if (userID) {
		ml.getData({
			"_id": ObjectID(userID)
		}, {
			"creditCard": 1
		}, function(err, result) {
			if (err) {
				res.send(200, {
					"error": "Something is wrong with your query" + err.message
				});
			} else {
				res.send(200, {
					"ok": "success",
					"creditCards": result[0].creditCard
				});
			}
		});
	} else {
		res.send(200, {
			"error": "no user was specified"
		});
	}
};

trupass.addCreditCard = function(req, res) {

	var nosql = {
		"creditCard": {
			"number": req.body.number,
			"nameOnCard": req.body.nameOnCard,
			"expiry": req.body.expiry,
			"ccid": req.body.ccid,
			"limit": req.body.limit
		}
	},
		userID = req.body.userID;

	console.log("check for userID to add credit card");

	if (userID) {
		console.log("adding credit card");

		ml.updateDataArray({
			"_id": ObjectID(userID)
		}, nosql, function(err, result) {
			if (err) {
				res.send(200, {
					"error": "problem adding card. " + err.message
				});
			} else {
				res.send(200, {
					"ok": "added card"
				});
			}
		});
	} else {
		res.send(200, {
			"error": "No userId was specified"
		});
	}
};

trupass.addTruPass = function(req, res) {

	var nosql = {
		"trupass": {
			"limit": req.body.limit,
			"balance": req.body.limit,
			"parentCard": req.body.parentCard,
			"preAuthId": null,
			"type": req.body.type
		}
	},
		user = {
			"firstName": req.body.firstName,
			"lastName": req.body.lastName,
			"email": req.body.email,
			"pass": null,
			"confirmed": false,
			"dateCreated": new Date(),
			"requireNewPassword": true
		};

	//register user or get userID
	ml.getData({
		"email": user.email
	}, function(err, item) {
		if (item.length > 0) {
			var userID = item[0]._id;
			console.log("userId = ");
			console.log(userID);
			if (userID) {
				console.log("trupass");
				ml.updateDataArray({
					"_id": userID
				}, nosql, function(err, result) {
					if (err) {
						res.send(200, {
							"error": "problem adding trupass. " + err.message
						});
					} else {
						res.send(200, {
							"ok": "added trupass"
						});
					}
				});
			} else {
				res.send(200, {
					"error": "No userId was specified"
				});
			}
		} else {
			user.trupass = [nosql.trupass];
			ml.insertData(user, function(err, newUser) {
				if (err) {
					console.warn(err.message);
					res.send(200, {
						"error": "Could not insert user." + err.message
					});
				} else {
					res.send(200, {
						"ok": "added trupass and notification sent to new user"
					});
				}
			});
		}
	});
};

trupass.confirmUser = function(req, res) {
	trupass.updateUser(req.body.userID, {
		"confirmed": true
	});
};

trupass.updateUser = function(req, res) {

	var nosql = {
		"firstName": req.body.firstName,
		"lastName": req.body.lastName,
		"email": req.body.email
	},
		userID = req.body.userID;

	if (userID) {
		console.log("updating user");

		ml.updateData({
			"_id": ObjectID(userID)
		}, nosql, function(err, result) {
			if (err) {
				res.send(200, {
					"error": "problem updating. " + err.message
				});
			} else {
				res.send(200, {
					"ok": "user updated"
				});
			}
		});
	} else {
		res.send(200, {
			"error": "please specify existing user email and new email"
		});
	}
};

trupass.register = function(req, res) {

	var nosql = {
		"firstName": req.body.firstName,
		"lastName": req.body.lastName,
		"email": req.body.email,
		"pass": req.body.pass,
		"confirmed": false,
		"dateCreated": new Date()
	};

	ml.getData({
		"email": nosql.email
	}, function(err, item) {
		if (item.length > 0) {
			res.send(200, {
				"error": "User already existing"
			});
		} else {
			ml.insertData(nosql, function(err, object) {
				console.log("inserting new user");
				if (err) {
					console.warn(err.message);
					res.send(200, {
						"error": "Could not insert user." + err.message
					});
				} else {
					console.info("Added new user");
					res.send(200, {
						"ok": "Added new user",
						"userID": object[0]._id
					});
				}
			});
		}
	});
};

trupass.login = function(req, res) {

	var nosql = {
		"email": req.body.email,
		"pass": req.body.pass
	};

	console.log("Loging...");
	console.log(ml);
	ml.getData(nosql, function(err, item) {
		if (err) {
			res.send(200, {
				"error": err.message
			});
		} else {
			if (item.length < 1) {
				res.send(200, {
					"error": "Invalid credentials. please try again"
				});
			} else {
				item = item[0];
				delete item.pass;
				res.send(200, item);
			}
		}
	});
};


app.configure(function() {
	app.set("port", process.env.PORT || 5000);
	app.use(express.logger());
	app.use(express.compress());
	app.set("views", __dirname + "/views");
	app.set("view engine", "ejs");
	app.use(express.static(__dirname + '/public'));
	app.use(express.bodyParser());
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.send(500, '<h1>OH FUDGE!</h1>');
});

app.post("/api/login/", trupass.login);

app.post("/api/register/", trupass.register);

app.post("/api/updateUser/", trupass.updateUser);

app.post("/api/confirmUser/", trupass.confirmUser);

app.post("/api/addTruPass/", trupass.addTruPass);

app.put("/api/addCreditCard/", trupass.addCreditCard);

app.get("/api/listCreditCard/:userID", trupass.listCreditCard);

app.get("/api", function(req, res) {

	globalRequest = req;
	globalResponse = res;

	var validTypes = ["login", "register", "updateUser", "confirmUser", "addTruPass", "removeTruPass", "updateTruPass", "listCreditCard", "addCreditCard", "removeCreditCard", "updateCreditCard", "addTransaction"];
	if (validTypes.indexOf(globalRequest.query.method) !== -1) {

		trupass.request();

	} else {
		globalResponse.send(200, {
			"error": "Please specify a valid type: [" + validTypes + "]"
		});
	}
});

app.listen(app.get("port"), function() {
	console.log("WS proxy listening on port: ", app.get("port"));
});