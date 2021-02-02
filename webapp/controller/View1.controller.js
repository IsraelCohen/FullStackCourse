sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ushell/services/UserInfo"
], function(Controller, JSONModel, Filter, UserInfo) {
	"use strict";

	return Controller.extend("IsraelFinalExam.controller.View1", {
		onInit: function() {
			var oModel = new JSONModel({
				Address: {},
				Profiles: []
			});

			this.getView().setModel(oModel, "Json");
		},

		crossAppNavigate: function() {
			
			if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("UserInfo")) {
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
				var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
					target: {
						semanticObject: "ZISRAEL2",
						action: "manage"
					}
				})) || ""; // generate the Hash to display a Supplier
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: hash
					}
				}); // navigate
			}
		},

		getAdress: function(username) {
			return new Promise(function(resolve, reject) {

				var oDataModel = this.getOwnerComponent().getModel("OData");
				var key = oDataModel.createKey("/AddressSet", {
					Username: username
				});

				oDataModel.read(key, {
					success: function(data) {
						resolve(data);
					}
				});
			}.bind(this));
		},

		getProfiles: function(username) {
			// var that = this;
			return new Promise(function(resolve, reject) {
				var oDataModel = this.getOwnerComponent().getModel("OData");
				var aFiltar = [new Filter('Username', 'EQ', username)];

				oDataModel.read('/ProfileSet', {
					filters: aFiltar,
					success: function(data) {

						resolve(data.results);
					}
				});
			}.bind(this));
		},

		loadStuff: function() {
			debugger;
			var sUserId;

			if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("UserInfo")) {
				sUserId = sap.ushell.Container.getService("UserInfo").getId();
			} else {
				sUserId = 'ALTERNO02';
			}

			sap.ui.core.BusyIndicator.show();
			this.getAdress(sUserId).then(function(dataResolved) {
				this.getView().getModel("Json").setProperty("/Address", dataResolved);

				this.getProfiles(sUserId).then(function(dataReturned) {
					this.getView().getModel("Json").setProperty("/Profiles", dataReturned);

					sap.ui.core.BusyIndicator.hide();

				}.bind(this));
			}.bind(this));
		}

	});
});