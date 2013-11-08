'use strict';

var api = (function($) {
	var request: function(_args) {
		if (typeof _arg === "object") {
			return $.ajax({
				url: "/api/" + _args.method + "/" + _args.endpoint,
				data: _args.data,
				dataType: "json"
			});
		} else {
			return null;
		}
	};

	return {
		login: function(data) {
			return request({
				method: "POST",
				endpoint: "login",
				data: data
			});
		},
		register: function(data) {
			return request({
				method: "POST",
				endpoint: "register",
				data: data
			});
		},
		update: function(data) {
			return request({
				method: "POST",
				endpoint: "updateUser",
				data: data
			});
		},
		confirm: function(data) {
			return request({
				method: "POST",
				endpoint: "confirmUser",
				data: data
			});
		},
		addTransaction: function(data) {
			return request({
				method: "POST",
				endpoint: "addTruPassTransaction",
				data: data
			});
		},
		addTruPass: function(data) {
			return request({
				method: "PUT",
				endpoint: "addTruPass",
				data: data
			});
		},
		addCreditCard: function(card) {
			return request({
				method: "PUT",
				endpoint: "addCreditCard",
				data: card
			});
		},
		cards: function(data) {
			return request({
				method: "GET",
				endpoint: "listCreditCard",
				data: data
			});
		},
		trupasses: function(data) {
			return request({
				method: "GET",
				endpoint: "listTruPass",
				data: data
			});
		},
		transactions: function(data) {
			return request({
				method: "GET",
				endpoint: "listTruPassTransaction",
				data: data
			});
		}
	};
})(window.jQuery || {});