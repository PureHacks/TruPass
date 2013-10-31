var express = require("express"),
	cache = require("memory-cache"),
	util = {},
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

util.request = function() {

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
				util.register(nosql);
				break;

			case "login":
				nosql = {
					"email": qs.email,
					"pass": qs.pass
				};
				util.login(nosql);
				break;

			case "updateUser":
				nosql = {
					"firstName": qs.firstName,
					"lastName": qs.lastName,
					"email": qs.email
				};
				util.updateUser(qs.userID, nosql);
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
				util.addCreditCard(qs.userID, nosql);
				break;
			case "listCreditCard":
				util.listCreditCard(qs.userID);
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

				util.addTruPass(user, nosql);
				break;
			case "removeTruPass":

				break;
			case "updateTruPass":
				break;

			case "addTransaction":

				break;
			case "confirmUser":
				util.updateUser(qs.userID, {
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

util.listCreditCard = function(userID) {
	if (userID) {
		ml.getData({
			"_id": ObjectID(userID)
		}, {
			"creditCard": 1
		}, function(err, result) {
			if (err) {
				globalResponse.send(200, {
					"error": "Something is wrong with your query" + err.message
				});
			} else {
				globalResponse.send(200, {
					"ok": "success",
					"creditCards": result[0].creditCard
				});
			}
		});
	}
};

util.addCreditCard = function(userID, nosql) {
	console.log("check for userID to add credit card");
	if (userID) {
		console.log("adding credit card");

		ml.updateDataArray({
			"_id": ObjectID(userID)
		}, nosql, function(err, result) {
			if (err) {
				globalResponse.send(200, {
					"error": "problem adding card. " + err.message
				});
			} else {
				globalResponse.send(200, {
					"ok": "added card"
				});
			}
		});
	} else {
		globalResponse.send(200, {
			"error": "No userId was specified"
		});
	}
};

util.updateUser = function(userID, nosql) {
	if (userID) {
		console.log("updating user");

		ml.updateData({
			"_id": ObjectID(userID)
		}, nosql, function(err, result) {
			if (err) {
				globalResponse.send(200, {
					"error": "problem updating. " + err.message
				});
			} else {
				globalResponse.send(200, {
					"ok": "user updated"
				});
			}
		});
	} else {
		globalResponse.send(200, {
			"error": "please specify existing user email and new email"
		});
	}
};

util.register = function(nosql) {
	console.log("Registering...");
	console.log("Checking for existing user");
	ml.getData({
		"email": nosql.email
	}, function(err, item) {
		if (item.length > 0) {
			globalResponse.send(200, {
				"error": "User already existing"
			});
		} else {
			ml.insertData(nosql, function(err, object) {
				console.log("inserting new user");
				if (err) {
					console.warn(err.message);
					globalResponse.send(200, {
						"error": "Could not insert user." + err.message
					});
				} else {
					console.info("Added new user");
					console.log(object);
					globalResponse.send(200, {
						"ok": "Added new user",
						"userID": object[0]._id
					});
				}
			});
		}
	});
};

util.login = function(nosql) {
	console.log("Loging...");
	console.log(ml);
	ml.getData(nosql, function(err, item) {
		if (err) {
			globalResponse.send(200, {
				"error": err.message
			});
		} else {
			if (item.length < 1) {
				globalResponse.send(200, {
					"error": "Invalid credentials. please try again"
				});
			} else {
				item = item[0];
				delete item.pass;
				globalResponse.send(200, item);
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

app.post("/api/login/", function(req, res) {
	globalRequest = req;
	globalResponse = res;

	nosql = {
		"email": req.body.email,
		"pass": req.body.pass
	};

	util.login(nosql);
});

app.post("/api/register/", function(req, res) {
	globalRequest = req;
	globalResponse = res;

	nosql = {
		"firstName": req.body.firstName,
		"lastName": req.body.lastName,
		"email": req.body.email,
		"pass": req.body.pass,
		"confirmed": false,
		"dateCreated": new Date()
	};

	util.register(nosql);
});

app.post("/api/updateUser/", function(req, res) {
	globalRequest = req;
	globalResponse = res;

	nosql = {
		"firstName": req.body.firstName,
		"lastName": req.body.lastName,
		"email": req.body.email
	};

	util.updateUser(req.body.userID, nosql);
});

app.put("/api/addCreditCard/", function(req, res) {
	globalRequest = req;
	globalResponse = res;

	nosql = {
		"creditCard": {
			"number": req.body.number,
			"nameOnCard": req.body.nameOnCard,
			"expiry": req.body.expiry,
			"ccid": req.body.ccid,
			"limit": req.body.limit
		}
	};

	util.addCreditCard(req.body.userID, nosql);
});

app.get("/api/listCreditCard/:userID", function(req, res) {
	globalRequest = req;
	globalResponse = res;

	util.listCreditCard(req.param.userID);
});

app.get("/api", function(req, res) {

	globalRequest = req;
	globalResponse = res;

	var validTypes = ["login", "register", "updateUser", "confirmUser", "addTruPass", "removeTruPass", "updateTruPass", "listCreditCard", "addCreditCard", "removeCreditCard", "updateCreditCard", "addTransaction"];
	if (validTypes.indexOf(globalRequest.query.method) !== -1) {

		util.request();

	} else {
		globalResponse.send(200, {
			"error": "Please specify a valid type: [" + validTypes + "]"
		});
	}
});

app.listen(app.get("port"), function() {
	console.log("WS proxy listening on port: ", app.get("port"));
});