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

trupass.listTruPass = function(req, res) {
	var userID = req.params.userID;

	if (userID) {
		ml.getData({
			"_id": ObjectID(userID)
		}, {
			"truPass": 1
		}, function(err, result) {
			if (err) {
				res.send(200, {
					"error": "Something is wrong with your query" + err.message
				});
			} else {
				res.send(200, {
					"ok": "success",
					"truPass": result[0].truPass
				});
			}
		});
	} else {
		res.send(200, {
			"error": "no user was specified"
		});
	}
};

trupass.listTruPassTransaction = function(req, res) {
	var truPassID = req.params.truPassID;

	if (truPassID) {
		ml.getData({
			"truPassTransactionHistory._id": ObjectID(truPassID)
		}, {
			"truPassTransactionHistory": 1
		}, function(err, result) {
			if (err) {
				res.send(200, {
					"error": "Something is wrong with your query" + err.message
				});
			} else {
				res.send(200, {
					"ok": "success return tru pass transactionHistory",
					"truPassTransactionHistory": result[0].truPassTransactionHistory
				});
			}
		});
	} else {
		res.send(200, {
			"error": "no truPass Id was specified"
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

trupass.addTruPassTransaction = function(req, res) {

	var nosql = {
		"truPassTransactionHistory": {
			"_id": ObjectID(),
			"truPassID": req.body.truPassID,
			"amount": req.body.amount,
			"merchant": req.body.merchant,
			"dateCreated": new Date()
		}
	},
		userID = req.body.userID,
		truPassID = req.body.truPassID;

	console.log("check for userID to add trupass");

	if (userID) {
		console.log("adding trupass transactionHistory");

		ml.updateDataArray({
			"_id": ObjectID(userID)
		}, nosql, function(err, result) {
			var o = err ? {
				"error": "problem adding card. " + err.message
			} : {
				"ok": "added card"
			};
			res.send(200, o);
		});
	} else {
		res.send(200, {
			"error": "No userId was specified"
		});
	}
};
trupass.addTruPass = function(req, res) {

	var nosql = {
		"truPass": {
			"_id": ObjectID(),
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

	if (!req.body.parentCard) {
		res.send(200, {
			"error": "a parentCard is needed to created a trupass"
		});
	}
	//register user or get userID
	ml.getData({
		"email": user.email
	}, function(err, item) {
		if (item.length > 0) {
			var userID = item[0]._id;
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
			user.truPass = [nosql.truPass];
			ml.insertData(user, function(err, newUser) {
				if (err) {
					console.warn(err.message);
					res.send(200, {
						"error": "Could not insert user." + err.message
					});
				} else {
					res.send(200, {
						"ok": "added trupass and notification sent to new user",
						"user": newUser
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

app.post("/api/addTruPassTransaction/", trupass.addTruPassTransaction);

app.put("/api/addTruPass/", trupass.addTruPass);

app.put("/api/addCreditCard/", trupass.addCreditCard);

app.get("/api/listCreditCard/:userID", trupass.listCreditCard);

app.get("/api/listTruPass/:userID", trupass.listTruPass);

app.get("/api/listTruPassTransaction/:truPassID", trupass.listTruPassTransaction);

app.listen(app.get("port"), function() {
	console.log("WS proxy listening on port: ", app.get("port"));
});