var express = require("express"),
	cache = require("memory-cache"),
	util = {},
	app = express(),
	qstring = require("querystring"),
	extend = require("xtend"),
	MongoClient = require("mongodb").MongoClient,
	format = require("util").format,
	globalResponse,
	globalRequest;

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

			case "addTruPass":

				break;
			case "removeTruPass":

				break;
			case "updateTruPass":
				break;
			case "addCreditCard":
				break;
			case "removeCreditCard":
				break;
			case "updateCreditCard":
				break;
			case "addTransaction":

			default:
				globalResponse.send(200, {
					"error": "An error"
				});
				break;
		}
	}
}

util.updateUser = function(userID, nosql) {
	var ObjectID = require('mongodb').ObjectID;
	if (userID) {
		console.log("updating user");

		util.updateData({
			"_id": ObjectID(userID)
		}, nosql, function(err, result) {
			if (err) {
				globalResponse.send(200, {
					"error": "problem updating"
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
						"error": "Could not insert user"
					});
				} else {
					console.info("Added new user");
					globalResponse.send(200, {
						"ok": "Added new user"
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
				"error": "no user found"
			});
		} else {
			globalResponse.send(200, item);
		}
	});
}

util.updateData = function(selector, nosql, callback) {
	var mongo = require('mongodb'),
		Server = mongo.Server,
		Db = mongo.Db;
	var server = new Server('localhost', 27017, {
		auto_reconnect: true
	});
	var db = new Db('test', server);
	// Establish connection to db
	db.open(function(err, db) {

		// Get a collection
		db.collection('user', function(err, db) {

			// Update the document using an upsert operation, ensuring creation if it does not exist
			db.update(selector, {
				$set: nosql
			}, {
				upsert: false,
				w: 1
			}, callback);
		});
	});
}

util.insertData = function(nosql, callback) {
	var mongodb = require('mongodb');
	var server = new mongodb.Server("127.0.0.1", 27017, {});
	new mongodb.Db('test', server, {}).open(function(error, client) {
		if (error) throw error;

		var collection = new mongodb.Collection(client, 'user');

		collection.insert(nosql, {
			safe: true
		}, callback);
	});
}

util.getData = function(nosql, callback) {
	var mongo = require('mongodb'),
		Server = mongo.Server,
		Db = mongo.Db;
	var server = new Server('localhost', 27017, {
		auto_reconnect: true
	});
	var db = new Db('test', server);

	db.open(function(err, db) {
		if (err) return callback(err);

		db.collection('user', function(err, collection) {
			if (err) return callback(err);
			console.log("inside getData");
			console.log(nosql);
			collection.find(nosql).toArray(callback);
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

	var validTypes = ["login", "register", "updateUser", "addTruPass", "removeTruPass", "updateTruPass", "addCreditCard", "removeCreditCard", "updateCreditCard", "addTransaction"];
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