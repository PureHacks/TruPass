var express = require("express"),
	cache = require("memory-cache"),
	util = {},
	app = express(),
	qstring = require("querystring"),
	extend = require("xtend"),
	MongoClient = require("mongodb").MongoClient,
	format = require("util").format,
	globalResponse,
	globalRequest,
	ObjectID = require('mongodb').ObjectID,
	uri = 'mongodb://heroku_app18393746:1mhabliftdatf6sl9sen2ltaob@ds047448.mongolab.com:47448/heroku_app18393746';

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
}

util.listCreditCard = function(userID) {
	if (userID) {
		util.getData({
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
}

util.addCreditCard = function(userID, nosql) {
	console.log("check for userID to add credit card");
	if (userID) {
		console.log("adding credit card");

		util.updateDataArray({
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
}

util.updateUser = function(userID, nosql) {
	if (userID) {
		console.log("updating user");

		util.updateData({
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
}

util.register = function(nosql) {
	console.log("Registering...");
	console.log("Checking for existing user");
	util.getData({
		"email": nosql.email
	}, function(err, item) {
		if (item.length > 0) {
			globalResponse.send(200, {
				"error": "User already existing"
			});
		} else {
			util.insertData(nosql, function(err, object) {
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
}

util.login = function(nosql) {
	console.log("Loging...");
	util.getData(nosql, function(err, item) {
		if (item.length < 1) {
			globalResponse.send(200, {
				"error": "no user found" + err.message
			});
		} else {
			item = item[0];
			delete item.pass;
			globalResponse.send(200, item);
		}
	});
}

util.updateData = function(selector, nosql, callback) {
	var mongodb = require('mongodb');
	mongodb.MongoClient.connect(uri, {
		server: {
			auto_reconnect: true
		}
	}, function(err, db) {
		db.collection('user', function(err, db) {
			db.update(selector, {
				$set: nosql
			}, {
				upsert: false,
				w: 1
			}, callback);
		});
	});
}

util.updateDataArray = function(selector, nosql, callback) {
	var mongodb = require('mongodb');
	mongodb.MongoClient.connect(uri, {
		server: {
			auto_reconnect: true
		}
	}, function(err, db) {
		db.collection('user', function(err, db) {
			db.update(selector, {
				$addToSet: nosql
			}, {
				upsert: false,
				w: 1
			}, callback);
		});
	});
}

util.insertData = function(nosql, callback) {
	var mongodb = require('mongodb');
	mongodb.MongoClient.connect(uri, {
		server: {
			auto_reconnect: true
		}
	}, function(err, db) {
		var collection = new mongodb.Collection(db, 'user');

		collection.insert(nosql, {
			safe: true
		}, callback);
	});
}

util.getData = function() {

	var args = Array.prototype.slice.call(arguments, 0),
		hasCallback = typeof args[args.length - 1] === 'function',
		hasWeirdCallback = typeof args[0] === 'function',
		callback = hasCallback ? args.pop() : (hasWeirdCallback ? args.shift() : null),
		len = args.length,
		selector = len >= 1 ? args[0] : {}, fields = len >= 2 ? args[1] : {};

	var mongodb = require('mongodb');
	mongodb.MongoClient.connect(uri, {
		server: {
			auto_reconnect: true
		}
	}, function(err, db) {
		if (err) return callback(err);

		db.collection('user', function(err, collection) {
			if (err) return callback(err);
			console.log("inside getData");
			console.log(selector);
			collection.find(selector, fields).toArray(callback);
		});
	});
}

app.configure(function() {
	app.set("port", process.env.PORT || 5000);
	app.use(express.logger());
	app.use(express.compress());
	app.set("views", __dirname + "/views");
	app.set("view engine", "ejs");
	app.use(express.static(__dirname + '/public'));
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