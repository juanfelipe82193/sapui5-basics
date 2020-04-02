/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tRequestOptions');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.modeler.ui.controller.requestOptions');
(function() {
	'use strict';
	QUnit.module("test injectable value help: injection present", {
		beforeEach : function() {
			var that = this;
			this.spyGenericExit = sinon.spy();
			this.oTextReader = {};
			this.getCalatogServiceUri = function() {};
			this.oCoreApi = {
				getGenericExit : function(name) {
					return that.spyGenericExit;
				}
			};
			this.oController = new sap.ui.controller("sap.apf.modeler.ui.controller.requestOptions");
			this.oController.getView = function() {
				return {
					getViewData : function() {
						return {
							oTextReader : that.oTextReader,
							getCalatogServiceUri : that.getCalatogServiceUri,
							oCoreApi : that.oCoreApi
						};
					}
				};
			};
		},
		afterEach : function() {

		}
	});
	QUnit.test("handle show value help request", function(assert) {
		var parent = {};
		this.oController.handleShowValueHelpRequest({
			getSource : function() {
				return parent;
			}
		});
		assert.ok(this.spyGenericExit.calledOnce, "getGenericExit is called once");
		assert.strictEqual(this.spyGenericExit.firstCall.args[0].oTextReader, this.oTextReader, "getGenericExit is called with the text reader");
		assert.strictEqual(this.spyGenericExit.firstCall.args[0].parentControl, parent, "getGenericExit is called with the parent control");
		assert.strictEqual(this.spyGenericExit.firstCall.args[0].getCalatogServiceUri, this.getCalatogServiceUri, "getGenericExit is called with the catalog service uri");
		assert.strictEqual(this.spyGenericExit.firstCall.args[1], this.oCoreApi, "getGenericExit is called with the core api");
		assert.strictEqual(this.spyGenericExit.firstCall.args[2], this.oController, "getGenericExit is called with the controller");
	});

	QUnit.module("test injectable value help: injection not present", {
		beforeEach : function() {
			var that = this;
			this.orgView = sap.ui.view;
			this.spyView = sinon.spy();
			sap.ui.view = this.spyView;
			this.oTextReader = {};
			this.getCalatogServiceUri = function() {};
			this.oCoreApi = {
				getGenericExit : function(name) {
					return undefined;
				}
			};
			this.oController = new sap.ui.controller("sap.apf.modeler.ui.controller.requestOptions");
			this.oController.getView = function() {
				return {
					getViewData : function() {
						return {
							oTextReader : that.oTextReader,
							getCalatogServiceUri : that.getCalatogServiceUri,
							oCoreApi : that.oCoreApi
						};
					}
				};
			};
		},
		afterEach : function() {
			sap.ui.view = this.orgView;
		}
	});
	QUnit.test("handle show value help request", function(assert) {
		var parent = {};
		this.oController.handleShowValueHelpRequest({
			getSource : function() {
				return parent;
			}
		});
		assert.ok(this.spyView.calledOnce, "sap.ui.view is called once");
		assert.strictEqual(this.spyView.firstCall.args[0].viewData.oTextReader, this.oTextReader, "sap.ui.view is called with the text reader in the view data");
		assert.strictEqual(this.spyView.firstCall.args[0].viewData.parentControl, parent, "sap.ui.view is called with the parent control in the view data");
		assert.strictEqual(this.spyView.firstCall.args[0].viewData.getCalatogServiceUri, this.getCalatogServiceUri, "sap.ui.view is called with the catalog service uri in the view data");
		assert.strictEqual(this.spyView.firstCall.args[0].viewName, "sap.apf.modeler.ui.view.catalogService", "sap.ui.view is called to show the catalog service view");
	});
}());
