sap.ui.define(
	["sap/suite/ui/generic/template/lib/CRUDManager",
	 "sap/suite/ui/generic/template/lib/CommonUtils", "sap/m/MessageToast", "sap/ui/base/Event", "sap/ui/model/json/JSONModel", "sap/ui/model/resource/ResourceModel" ],
	function (CRUDManager,
			CommonUtils, MessageToast, Event, JSONModel, ResourceModel) {
		"use strict";

		module("CRUD Manager deleteEntities", {
			beforeEach : function () {

				this.aPathToBeDeleted = [];

				// Mock objects necessary for the class under test
				var oController = {
				};
				var oServices = {
					oTransactionController: {
						deleteEntities: function (aEntities) {
							var aDeleteResults = [];
							return new Promise(function (resolve, reject) {
								resolve(aDeleteResults);
							});
						}
					},
					oApplication: {
						prepareDeletion: Function.prototype
					}
				};
				var oCommonUtils = {};

				// Stubs
				this.stubMessageModelGetData = sinon.stub(sap.ui.model.message.MessageModel.prototype, "getData", function () {
					var aODataMessages = [];
					for (var i=0; i < this.aPathToBeDeleted.length; i++) {
						if (this.aPathToBeDeleted[i].indexOf("error") > -1) {
							aODataMessages.push({
								path: this.aPathToBeDeleted[i],
								getTarget: function () {
									return this.path;
								},
								getType: function () {
									return this.type;
								}
							});
						}
					}
					return aODataMessages;

				}.bind(this));

				this.cut_CRUDManager = new CRUDManager(oCommonUtils, oController, oServices);

			},
			afterEach : function() {
				this.stubMessageModelGetData.restore();
			}
		});


		// Tests for opening the Delete dialog
		test("deleteEnties with all success -> returns []", function (assert) {
			var done = assert.async();

			this.aPathToBeDeleted = ["/success/01"];

			// execute test
			this.cut_CRUDManager.deleteEntities(this.aPathToBeDeleted).then(function (aFailedPath) {
				equal(aFailedPath.length, 0, "All delete operations are successful; deleteEntities returned an empty array");
				done();
			}.bind(this));
		});

		test("deleteEnties with all error -> returns [paths]", function (assert) {
			var done = assert.async();

			this.aPathToBeDeleted = ["/error/01"];

			// execute test
			this.cut_CRUDManager.deleteEntities(this.aPathToBeDeleted).then(function (aFailedPath) {

				equal(aFailedPath.length, 1, "All delete operations have failed; deleteEntities returned an array with one item");
				equal(aFailedPath[0], "/error/01", "The correct path is returned");
				done();
			}.bind(this));
		});

		test("deleteEnties with 1 success and 1 error -> returns [01,02]", function (assert) {
			var done = assert.async();

			this.aPathToBeDeleted = ["/success/01", "/error/01", "/error/02"];

			// execute test
			this.cut_CRUDManager.deleteEntities(this.aPathToBeDeleted).then(function (aFailedPath) {

				equal(aFailedPath.length, 2, "2 delete operations have failed; deleteEntities returned an array with 2 item");
				equal(aFailedPath[0], "/error/01", "The correct path is returned");
				equal(aFailedPath[1], "/error/02", "The correct path is returned");
				done();
			}.bind(this));
		});

});
