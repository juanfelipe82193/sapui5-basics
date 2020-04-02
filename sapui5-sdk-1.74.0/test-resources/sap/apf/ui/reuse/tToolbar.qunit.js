/*
 * Copyright(c) 2019 SAP SE
 */

sap.ui.define([
	'sap/apf/testhelper/doubles/createUiApiAsPromise',
	'sap/apf/testhelper/doubles/navigationHandler',
	'sap/apf/testhelper/doubles/messageHandler',
	'sap/apf/testhelper/stub/ajaxStub',
	'sap/ui/thirdparty/sinon'
	], function(createUiApiAsPromise, NavigationHandler, MessageHandler, AjaxStub, sinon) {
	'use strict';
	function doNothing() {
	}
	/**
	 * Executes the continuation in the afterClose event callback
	 * @param {String} key
	 * @param {Object} testContext
	 * @param {Object} assert
	 * @param {Function} continuation
	 */
	function pressOkButtonOfDialog(key, testContext, assert, continuation) {
		var done = assert.async();
		var dialog = getDialogByTitleKey(key, testContext);
		// ensure the async callback afterClose has successfully completed.
		dialog.attachAfterClose(function() {
			continuation({});
			done();
		});
		dialog.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
	}
	/**
	 * Executes the continuation in the afterClose event callback
	 * @param {String} key
	 * @param {Object} testContext
	 * @param {Object} assert
	 * @param {Function} continuation
	 */
	function pressCancelButtonOfDialog(key, testContext, assert, continuation) {
		var done = assert.async();
		var dialog = getDialogByTitleKey(key, testContext);
		// ensure the async callback afterClose has successfully completed.
		dialog.attachAfterClose(function() {
			continuation({});
			done();
		});
		dialog.getEndButton().firePress();
		sap.ui.getCore().applyChanges();
	}
	/**
	 * Executes the continuation in the afterClose event callback
	 * @param {Object} assert
	 * @param {Function} continuation
	 */
	function pressCancelButtonOfDialogByEmptyTitle(assert, continuation) {
		var done = assert.async();
		var dialog = getDialogByEmptyTitle();
		// ensure the async callback afterClose has successfully completed.
		dialog.attachAfterClose(function() {
			continuation({});
			done();
		});
		dialog.getEndButton().firePress();
		sap.ui.getCore().applyChanges();
	}
	/**
	 * @function
	 * @name sap.apf.ui.reuse.tToolbar#pressButtonsOfActionListItem
	 * @param {Object} testContext
	 * @param {Integer} Array index
	 * @description To press the buttons of ActionListItem
	 * */
	function pressButtonsOfActionListItem(testContext, arrayIndex) {
		testContext.toolbar.oActionListItem.getItems()[arrayIndex].firePress();
		sap.ui.getCore().applyChanges();
	}
	function savePathDouble() {
		return function(arg1, arg2, arg3) {
			//var guid;
			//var pathName;
			var callback;
			if (arg2 instanceof Function) {
				//pathName = arg1;
				callback = arg2;
			} else {
				//guid = arg1;
				//pathName = arg2;
				callback = arg3;
			}
			jQuery.getJSON(getSavedPathJSON(), function(data) {
				callback(data, {}, undefined);
			});
		};
	}
	/**
	 * Function to search a dialog based on the title. The title is retrieved via text resource, and therefore language dependent.
	 * No other alternative to find dialogs since unique ID, nor any specific css style class is available.
	 * This is required mainly to distinguish different types of dialogs.
	 * @param {String} key which is resolved by title text or not (not when the text resource is missing), matching is provided for both cases
	 * @param {Object} testContext
	 * @returns {*}
	 */
	function getDialogByTitleKey(key, testContext) {
		sap.ui.getCore().applyChanges();
		var title = testContext.oGlobalApi.oCoreApi.getTextNotHtmlEncoded(key);
		var oExpectedDialog;
		jQuery.each(jQuery('.sapMDialog'), function(name, element) {
			var oDialog = sap.ui.getCore().byId(element.getAttribute("id"));
			//if (oDialog.getTitle() === title) {
			if (title.indexOf(oDialog.getTitle()) !== -1 && oDialog.getTitle() !== "") { // matching even if text resource missing
				oExpectedDialog = oDialog;
			}
		});
		return oExpectedDialog;
	}
	/**
	 * Function to search a dialog based on empty string
	 * @returns {*}
	 */
	function getDialogByEmptyTitle() {
		sap.ui.getCore().applyChanges();
		var oExpectedDialog;
		jQuery.each(jQuery('.sapMDialog'), function(name, element) {
			var oDialog = sap.ui.getCore().byId(element.getAttribute("id"));
			if (oDialog.getTitle() === "") { // empty tile
				oExpectedDialog = oDialog;
			}
		});
		return oExpectedDialog;
	}

	function getSavedPathJSON() {
		return "/pathOfNoInterest/savedPaths.json";
	}

	var MessageHandlerDouble = function () {
		MessageHandler.apply(this, arguments);
		this.supportActivateOnErrorHandlingWithoutAction();
		this.supportSetMessageCallbackWithoutAction();
		this.supportSetLifeTimePhaseWithoutAction();
		this.supportLoadConfigWithoutAction();
		this.supportSetTextResourceHandlerWithoutAction();
		this.supportIsOwnExceptionReturn(false);
		this.raiseOnCheck();
		this.spyPutMessage();
	};
	MessageHandlerDouble.prototype = new MessageHandler();

	function installStubs(testEnv) {
		var api = testEnv.oGlobalApi;
		//Common stubs required throughout this module

		// Stub for AJAX call
		AjaxStub.stubJQueryAjax();

		// To avoid problems with missing metadata, stub this method.
		testEnv.savePathSpy = sinon.stub(api.oCoreApi, "savePath", savePathDouble());

		/*
		 * Stub required to make a dummy path with few steps in order for the save dialog to
		 * appear else another dialog which says "No steps added" will appear
		 */
		sinon.stub(api.oCoreApi, 'getSteps', function() {
			return [ "firstStep", "secondStep", "thirdStep" ];
		});

		/* can be used to specify the path and step limit and already existing paths */
		sinon.stub(api.oCoreApi, 'readPaths', function(callback) {
			jQuery.getJSON(getSavedPathJSON(), function(data) {
				for(var i = 0; i < data.paths.length; i++) {
					data.paths[i].StructuredAnalysisPath = {
							steps : [ 2, 4 ]
					};
				}

				var metadata = {
						getEntityTypeMetadata : function() {
							return (testEnv.metadata && testEnv.metadata(data)) || {};
						}
				};

				callback(data, metadata, undefined);
			});
		});

		/*Required to stub all unnecessary calls from layout controller */
		sinon.stub(api.oUiApi, "getLayoutView", function() {
			var layout = new sap.ui.layout.VerticalLayout();
			layout.getController = function() {
				return {
					addMasterFooterContentLeft : doNothing,
					enableDisableOpenIn : doNothing
				};
			};
			return layout;
		});
	}

	function restoreStubs(testEnv) {
		var api = testEnv.oGlobalApi;

		jQuery.ajax.restore();

		api.oCoreApi.getSteps.restore();
		api.oCoreApi.readPaths.restore();
		api.oCoreApi.savePath.restore();

		api.oUiApi.getLayoutView.restore();
	}

	QUnit.module("[view] Action List Items", {
		beforeEach: function(assert) {
			var self = this;
			var done = assert.async();

			var inject = {
				constructors : {
					NavigationHandler : NavigationHandler
				}
			};

			createUiApiAsPromise(undefined, undefined, inject).done(function(api) {
				self.oGlobalApi = api;
				self.toolbar = api.oUiApi.getAnalysisPath().getToolbar();
				self.controller = self.toolbar.getController();

				installStubs(self);

				done();
			});
		},
		afterEach: function(assert) {
			restoreStubs(this);

			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("when clicking on 'Save'", function(assert) {
		var self = this;
		var savePress = sinon.stub(self.controller, "onSaveAndSaveAsPress", function() {});

		pressButtonsOfActionListItem(self, 2);

		assert.ok(savePress.calledOnce, "then path is saved exactly once");
		assert.deepEqual([false], savePress.args[0], "then Save, not SaveAs, is triggered");

		savePress.restore();
	});
	QUnit.module("Check existence of stable ids", {
		beforeEach: function(assert) {
			var self = this;
			var done = assert.async();

			var inject = {
				constructors : {
					NavigationHandler : NavigationHandler
				}
			};

			createUiApiAsPromise(undefined, undefined, inject).done(function(api) {
				self.api = api;
				self.controller = api.oUiApi.getAnalysisPath().getToolbar().getController();
				done();
			});
		},
		afterEach: function(assert) {
			this.api.oCompContainer.destroy();
		}
	});
	QUnit.test("WHEN stable ids are defined", function(assert){
		assert.expect(12);
		var listWithIdAndTitleKey = [
		 { id : "idAnalysisPathMenuNewAnalysisPath", key : "new"},
		 { id : "idAnalysisPathMenuOpenAnalysisPath", key : "open"},
		 { id : "idAnalysisPathMenuSaveAnalysisPath", key : "save"},
		 { id : "idAnalysisPathMenuSaveAnalysisPathAs", key : "savePathAs"},
		 { id : "idAnalysisPathMenuDeleteAnalysisPath", key : "delete"},
		 { id : "idAnalysisPathMenuPrintAnalysisPath", key : "print"} ];
		listWithIdAndTitleKey.forEach(function(idAndKey){
			var listItem = this.controller.byId(idAndKey.id);
			assert.ok(listItem instanceof sap.m.StandardListItem, "THEN list item with id exists");
			assert.strictEqual(listItem.getTitle(), this.controller.oCoreApi.getTextNotHtmlEncoded(idAndKey.key), "THEN title as expected");
		}.bind(this));
	});
	QUnit.module("[controller] when saving", {
		beforeEach : function(assert) {
			var self = this;

			// Double of UI API
			var done = assert.async();
			var inject = {
					constructors : {
						NavigationHandler : NavigationHandler
					}
			};
			createUiApiAsPromise(undefined, undefined, inject).done(function(api){
				self.oGlobalApi = api;

				// AnalysisPath Needed to access the toolbar.
				var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
				// Premise for the whole test
				self.toolbar = analysisPath.getToolbar();
				self.toolbarController = self.toolbar.getController();
				self.oActionListItem = analysisPath.oActionListItem;

				installStubs(self);
				done();
			});

		},
		afterEach : function(/* assert */) {
			restoreStubs(this);

			// restore the context created as part of UIApi.js double.
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test('given paths upto max limit have been saved and when saving a new path', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		var pathName = "hugo";
		var putMessageSpy = sinon.stub(self.oGlobalApi.oCoreApi, "putMessage", function(){});

		self.metadata = function (data) {
			return {
				maximumNumberOfSteps: 2,
				maxOccurs: data.paths.length
			};
		};

		//  act
		self.toolbarController.onSaveAndSaveAsPress(/* saveAs = */false);
		self.toolbarController.oInput.setValue(pathName);

		// act
		pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
			//assert
			assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessage is called once");
			assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "6014", "then error message with code 6014 (too many paths)");
			//clean up
			putMessageSpy.restore();
		});
	});
	QUnit.test('when saving a new path so that the maximum path limit is exactly met', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		var pathName = "hugo";
		var putMessageSpy = sinon.stub(self.oGlobalApi.oCoreApi, "putMessage", function(){});

		self.metadata = function (data) {
			return {
				maximumNumberOfSteps: 3,
				maxOccurs: data.paths.length + 1
			};
		};

		//  act
		self.toolbarController.onSaveAndSaveAsPress(/* saveAs = */false);
		self.toolbarController.oInput.setValue(pathName);

		// act
		pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
			//assert
			assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessage is called once");
			if (putMessageSpy.calledOnce) {
				assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "6016", "then message with code 6016 (success)");
			}
			//clean up
			putMessageSpy.restore();
		});
	});
	QUnit.test("when metadata do not contain maximum number of paths nor of steps", function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		var pathName = "hugo";
		var putMessageSpy = sinon.stub(self.oGlobalApi.oCoreApi, "putMessage", function(){});

		self.metadata = function (data) {
			return {};
		};

		//  act
		self.toolbarController.onSaveAndSaveAsPress(/* saveAs = */false);
		self.toolbarController.oInput.setValue(pathName);

		// act
		pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
			//assert
			assert.ok(putMessageSpy.calledOnce, "then one message is sent");
			if (putMessageSpy.calledOnce) {
				assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "6016", "then message with code 6016 (success)");
			}
			assert.ok(self.savePathSpy.calledOnce, "then path is saved");
			//clean up
			putMessageSpy.restore();
		});
	});
	QUnit.test('when maximum number of steps exceeded in a path ', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		var pathName = "hugo";
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.stub(self.oGlobalApi.oCoreApi, "putMessage", function(){});

		self.metadata = function (data) {
			return {
				maximumNumberOfSteps : 2,
				maxOccurs : 255
			};
		};

		//  act
		self.toolbarController.onSaveAndSaveAsPress(/* saveAs = */false);
		self.toolbarController.oInput.setValue(pathName);

		// act
		pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
			//assert
			assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
			assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
			assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "6015", "then error message with correct code is logged");
			//clean up
			createMessageObjectSpy.restore();
			putMessageSpy.restore();
		});
	});

	QUnit.module("toolbar - Tests", {
		beforeEach : function(assert) {
			var self = this;
			// Stub for AJAX call
			AjaxStub.stubJQueryAjax();
			// Double of UI API
			var done = assert.async();
			var inject = {
					constructors : {
						NavigationHandler : NavigationHandler,
						MessageHandler : MessageHandlerDouble
					}
			};
			createUiApiAsPromise(undefined, undefined, inject).done(function(api){
				self.oGlobalApi = api;
				self.messageHandler = self.oGlobalApi.oCoreApi.getMessageHandler();

				// AnalysisPath Needed to access the toolbar.
				var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
				// Premise for the whole test

				self.toolbar = analysisPath.getToolbar();
				self.toolbarController = self.toolbar.getController();
				self.oActionListItem = analysisPath.oActionListItem;

				//Common stubs required throughout this module

				// To avoid problems with missing metadata, stub this method.
				self.savePathSpy = sinon.stub(api.oCoreApi, "savePath", savePathDouble());

				/*Required to stub all unnecessary calls from layout controller */
				sinon.stub(self.oGlobalApi.oUiApi, "getLayoutView", function() {
					var layout = new sap.ui.layout.VerticalLayout();
					layout.getController = function() {
						return {
							addMasterFooterContentLeft : doNothing,
							enableDisableOpenIn : doNothing
						};
					};
					return layout;
				});
				/*
				 * Stub required to make a dummy path with few steps in order for the save dialog to
				 * appear else another dialog which says "No steps added" will appear
				 */
				sinon.stub(self.oGlobalApi.oCoreApi, 'getSteps', function() {
					return [ "firstStep", "secondStep", "thirdStep" ];
				});
				/*
				 * Stub required to :
				 * 1) Find from metadata the maximum number of paths  that are allowed to be saved in database ,
				 * 2) Find from metadata the maximum number of steps allowed in a path which has to be saved,
				 * Need this info before saving a path in order to stop saving if either of these exceeds
				 */
				sinon.stub(self.oGlobalApi.oCoreApi, 'readPaths', function(callback) {
					jQuery.getJSON(getSavedPathJSON(), function(data) {
						var metaData, metaDataValue;
						var i;
						for(i = 0; i < data.paths.length; i++) {
							data.paths[i].StructuredAnalysisPath = {
									steps : [ 2, 4 ]
							};
						}
						metaData = {
								getEntityTypeMetadata : function() {
									metaDataValue = {
											maximumNumberOfSteps : 32,
											maxOccurs : 255
									};
									return metaDataValue;
								}
						};
						callback(data, metaData, undefined);
					});
				});
				done();
			});

		},
		afterEach : function(/* assert */) {
			this.oGlobalApi.oUiApi.getLayoutView.restore();
			// This is needed because of jQuery Ajax Stubbing
			jQuery.ajax.restore();
			this.oGlobalApi.oCoreApi.getSteps.restore();
			this.oGlobalApi.oCoreApi.readPaths.restore();
			// restore the context created as part of UIApi.js double.
			this.oGlobalApi.oCompContainer.destroy();

			this.oGlobalApi.oCoreApi.savePath.restore();
		}
	});
	QUnit.test('when initialization', function(assert) {
		assert.ok(this.toolbar, 'then toolbar exists'); //eslint-disable-line no-invalid-this
	});
	/*PATH NAME VALIDATION*/
	QUnit.test('When no name is given in the input control for the path to be saved', function(assert) {
		// act
		this.toolbarController.onSaveAndSaveAsPress();
		this.toolbarController.oInput.setValue("");
		this.toolbarController.oInput.fireLiveChange();
		//assert
		assert.strictEqual( this.toolbarController.oInput.getMaxLength(),100,"then the number of characters allowed in analysis path name is 100");
		assert.strictEqual( this.toolbarController.oInput.getValueState(), "Error", "then error state is set to the input control");
		assert.strictEqual( this.toolbarController.oInput.getShowValueStateMessage(),false,"then no value state message is shown in the input control");
		assert.strictEqual(this.toolbarController.saveDialog.getBeginButton().getEnabled(),false,"then ok button is not enabled in the save dialog");
	});
	QUnit.test('When a valid name is given in the input control for the path to be saved', function(assert) {
		//arrangement
		var pathName = "valid Path Name";
		// act
		this.toolbarController.onSaveAndSaveAsPress();
		this.toolbarController.oInput.setValue(pathName);
		this.toolbarController.oInput.fireLiveChange();
		//assert
		assert.strictEqual( this.toolbarController.oInput.getValueState(), "None", "then no error state is set to the input control");
		assert.strictEqual( this.toolbarController.oInput.getShowValueStateMessage(),false,"then no value state message is shown in the input control");
		assert.strictEqual(this.toolbarController.saveDialog.getBeginButton().getEnabled(),true,"then ok button is enabled in the save dialog");
	});
	QUnit.test('When a name with "*" is given in the input control for the path to be saved', function(assert) {
		//arrangement
		var pathName = "*InvalidPathName";
		// act
		this.toolbarController.onSaveAndSaveAsPress();
		this.toolbarController.oInput.setValue(pathName);
		this.toolbarController.oInput.fireLiveChange();
		//assert
		assert.strictEqual( this.toolbarController.oInput.getValueState(), "Error", "then error state is set to the input control");
		assert.strictEqual( this.toolbarController.oInput.getShowValueStateMessage(),true,"then value state message is shown in the input control");
		assert.strictEqual(this.toolbarController.saveDialog.getBeginButton().getEnabled(),false,"then ok button is not enabled in the save dialog");
	});
	/*NEW SCENARIOS*/
	QUnit.test('given an unsaved path,when clicking "New" button from toolbar,then clicking "Ok" button of new dialog then clicking "Cancel" button of save dialog', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		analysisPath.getController().refresh(0);
		var saveAnalysisPathDialog, newPathDialog;
		//act
		pressButtonsOfActionListItem(self, 0);
		//assert
		var dialog = getDialogByTitleKey("newPath", self); 
		assert.ok(dialog, "then analysis-path-not-saved dialog");
		assert.strictEqual(dialog.getType(),sap.m.DialogType.Message,"Dialog is of message Type");
		//act
		pressOkButtonOfDialog("newPath", self, assert, function() {
			// dialog: analysis path not saved
			// dialog: input name & save
			newPathDialog = getDialogByTitleKey("newPath", self);
			assert.strictEqual(newPathDialog, undefined, "then New Path dialog does not exist");
			saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
			//assert
			assert.ok(saveAnalysisPathDialog, "when ok then save-analysis-path dialog exists");
			assert.strictEqual(saveAnalysisPathDialog.getType(),sap.m.DialogType.Message,"Dialog is of message Type");
			assert.equal(saveAnalysisPathDialog.isOpen(), true, "then Save dialog is in state open");
			//act
			pressCancelButtonOfDialog("save-analysis-path", self, assert, function() {
				saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
				//assert
				assert.strictEqual(self.savePathSpy.called, false, "when cancel then savePath not called");
				assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save dialog does not exist");
			});
		});
	});
	QUnit.test('given an unsaved path,when clicking "New" button from toolbar,then clicking "Ok" button of new dialog then clicking "Ok" button of save dialog', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		analysisPath.getController().refresh(0);
		//create spies and stubs
		var spySuccessToast = sinon.spy(self.toolbarController, "getSuccessToast");
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.stub(self.oGlobalApi.oCoreApi, "putMessage", function(){});
		var spyRefreshCarousel = sinon.stub(self.oGlobalApi.oUiApi.getAnalysisPath().getCarouselView().getController(), 'showStepChartChartAfterUpdate', doNothing);
		var spyStepContainerRerender = sinon.stub(self.oGlobalApi.oUiApi.getStepContainer(), 'rerender', doNothing);
		var spyResetAnalysisPath = sinon.spy(self.toolbarController, "resetAnalysisPath");
		var saveAnalysisPathDialog, newPathDialog;
		//act
		pressButtonsOfActionListItem(self, 0);
		pressOkButtonOfDialog("newPath", self, assert, function() {
			// dialog: analysis path not saved
			// dialog: input name & save
			newPathDialog = getDialogByTitleKey("newPath", self);
			assert.strictEqual(newPathDialog, undefined, "then New Path dialog does not exist");
			saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
			//assert
			assert.ok(saveAnalysisPathDialog, "when ok then save-analysis-path dialog exists");
			assert.equal(saveAnalysisPathDialog.isOpen(), true, "then Save dialog is in state open");
			//act
			pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
				//assert
				saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
				assert.strictEqual(self.savePathSpy.calledOnce, true, "when ok then savePath called");
				assert.strictEqual(spySuccessToast.calledOnce, true, "then save success toast is called");
				assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
				assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
				assert.strictEqual(putMessageSpy.getCall(0).args[0].code, "6016", "then error message with correct code is logged");
				assert.strictEqual(spyRefreshCarousel.calledOnce, true, "then showStepChartChartAfterUpdate called once");
				assert.strictEqual(spyStepContainerRerender.calledOnce, true, "then carousel rerender called once");
				assert.strictEqual(spyResetAnalysisPath.calledOnce, true, "then Path is reset");
				assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save dialog does not exist");
				//cleanup
				createMessageObjectSpy.restore();
				putMessageSpy.restore();
			});
		});
	});
	QUnit.test('given an unsaved path,when clicking "New" button from toolbar,then clicking "No" button of new dialog', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		analysisPath.getController().refresh(0);
		//create stubs
		var spyRefreshCarousel = sinon.stub(self.oGlobalApi.oUiApi.getAnalysisPath().getCarouselView().getController(), 'showStepChartChartAfterUpdate', doNothing);
		var spyStepContainerRerender = sinon.stub(self.oGlobalApi.oUiApi.getStepContainer(), 'rerender', doNothing);
		var spyResetAnalysisPath = sinon.spy(self.toolbarController, "resetAnalysisPath");
		var newPathDialog;
		//act
		pressButtonsOfActionListItem(self, 0);
		pressCancelButtonOfDialog("newPath", self, assert, function() {
			newPathDialog = getDialogByTitleKey("newPath", self);
			assert.strictEqual(newPathDialog, undefined, "then New Path dialog does not exist");
			assert.strictEqual(self.savePathSpy.called, false, "then savePath not called");
			assert.strictEqual(spyRefreshCarousel.calledOnce, true, "then showStepChartChartAfterUpdate called once");
			assert.strictEqual(spyStepContainerRerender.calledOnce, true, "then carousel rerender called once");
			assert.strictEqual(spyResetAnalysisPath.calledOnce, true, "then Path is reset");
		});
	});
	QUnit.test('given a saved path,when clicking "New" button from toolbar', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		//create stubs
		var spyRefreshCarousel = sinon.stub(self.oGlobalApi.oUiApi.getAnalysisPath().getCarouselView().getController(), 'showStepChartChartAfterUpdate', doNothing);
		var spyStepContainerRerender = sinon.stub(self.oGlobalApi.oUiApi.getStepContainer(), 'rerender', doNothing);
		var spyResetAnalysisPath = sinon.spy(self.toolbarController, "resetAnalysisPath");
		//act
		pressButtonsOfActionListItem(self, 0);
		//assert
		assert.equal(analysisPath.oSavedPathName.getTitle(), self.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("unsaved"), "then Path is reseted");
		assert.strictEqual(spyRefreshCarousel.calledOnce, true, "then showStepChartChartAfterUpdate called once");
		assert.strictEqual(spyStepContainerRerender.calledOnce, true, "then carousel rerender called once");
		assert.strictEqual(spyResetAnalysisPath.calledOnce, true, "then Path is reset");
	});
	/*OPEN SCENARIOS*/
	QUnit.test('given an unsaved path,when clicking "Open" button from toolbar,then clicking "Ok" button of new dialog then clicking "Cancel" button of save dialog', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		analysisPath.getController().refresh(0);
		var saveAnalysisPathDialog, newPathDialog;
		//act
		pressButtonsOfActionListItem(self, 1);
		//assert
		assert.ok(getDialogByTitleKey("newPath", self), "then analysis-path-not-saved dialog");
		//act
		pressOkButtonOfDialog("newPath", self, assert, function() {
			newPathDialog = getDialogByTitleKey("newPath", self);
			assert.strictEqual(newPathDialog, undefined, "then New Path dialog does not exist");
			// dialog: analysis path not saved
			// dialog: input name & save
			saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
			//assert
			assert.ok(saveAnalysisPathDialog, "when ok then save-analysis-path dialog exists");
			assert.equal(saveAnalysisPathDialog.isOpen(), true, "then Save dialog is in state open");
			//act
			pressCancelButtonOfDialog("save-analysis-path", self, assert, function() {
				saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
				//assert
				assert.strictEqual(self.savePathSpy.called, false, "when cancel then savePath not called");
				assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save dialog does not exist");
			});
		});
	});
	QUnit.test('given an unsaved path,when clicking "Open" button from toolbar,then clicking "Ok" button of new dialog then clicking "Ok" button of save dialog', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var spySuccessToast = sinon.spy(self.toolbarController, "getSuccessToast");
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.stub(self.oGlobalApi.oCoreApi, "putMessage", function(){});
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		analysisPath.getController().refresh(0);
		var selectPathDialog, newPathDialog, saveAnalysisPathDialog;
		//act
		pressButtonsOfActionListItem(self, 1);
		//assert
		assert.ok(getDialogByTitleKey("newPath", self), "then analysis-path-not-saved dialog");
		pressOkButtonOfDialog("newPath", self, assert, function() {
			newPathDialog = getDialogByTitleKey("newPath", self);
			assert.strictEqual(newPathDialog, undefined, "then New Path dialog does not exist");
			// dialog: analysis path not saved
			// dialog: input name & save
			saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
			//assert
			assert.ok(saveAnalysisPathDialog, "when ok then save-analysis-path dialog exists");
			assert.equal(saveAnalysisPathDialog.isOpen(), true, "then Save dialog is in state open");
			//act
			pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
				//assert
				assert.strictEqual(self.savePathSpy.calledOnce, true, "when ok then savePath called");
				assert.strictEqual(spySuccessToast.calledOnce, true, "then save success toast called");
				assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
				assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
				assert.strictEqual(putMessageSpy.getCall(0).args[0].code, "6016", "then error message with correct code is logged");
				saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
				assert.strictEqual(saveAnalysisPathDialog, undefined, "then save dialog is closed");
				selectPathDialog = getDialogByEmptyTitle();
				assert.ok(selectPathDialog, "then selectPathDialog exists");
				assert.equal(selectPathDialog.isOpen(), true, "then selectPathDialog is in open state");
				pressCancelButtonOfDialogByEmptyTitle(assert, function() {
					selectPathDialog = getDialogByEmptyTitle();
					//assert
					assert.strictEqual(selectPathDialog, undefined, "then 'Select Analysis Path' dialog does not exist");
					//clean up
					createMessageObjectSpy.restore();
					putMessageSpy.restore();
				});
			});
		});
	});
	QUnit.test('given an unsaved path,when clicking "Open" button from toolbar,then clicking "No" button of new dialog', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		analysisPath.getController().refresh(0);
		var selectPathDialog, newPathDialog;
		//create stubs
		var spyRefreshCarousel = sinon.stub(self.oGlobalApi.oUiApi.getAnalysisPath().getCarouselView().getController(), 'showStepChartChartAfterUpdate', doNothing);
		var spyStepContainerRerender = sinon.stub(self.oGlobalApi.oUiApi.getStepContainer(), 'rerender', doNothing);
		var spyResetAnalysisPath = sinon.spy(self.toolbarController, "resetAnalysisPath");
		//act
		pressButtonsOfActionListItem(self, 1);
		//assert
		assert.ok(getDialogByTitleKey("newPath", self), "then analysis-path-not-saved dialog");
		pressCancelButtonOfDialog("newPath", self, assert, function() {
			selectPathDialog = getDialogByEmptyTitle();
			//assert
			assert.strictEqual(self.savePathSpy.called, false, "then savePath not called");
			assert.strictEqual(spyRefreshCarousel.calledOnce, true, "then showStepChartChartAfterUpdate called once");
			assert.strictEqual(spyStepContainerRerender.calledOnce, true, "then rerender Carosel called once");
			assert.strictEqual(spyResetAnalysisPath.calledOnce, true, "then resetAnalysisPath called once");
			assert.ok(selectPathDialog, "then selectPathDialog exists");
			assert.equal(selectPathDialog.isOpen(), true, "then selectPathDialog is in open state");
			newPathDialog = getDialogByTitleKey("newPath", self);
			assert.strictEqual(newPathDialog, undefined, "then New Path dialog has been closed and does not exist");
			pressCancelButtonOfDialogByEmptyTitle(assert, function() {
				selectPathDialog = getDialogByEmptyTitle();
				//assert
				assert.strictEqual(selectPathDialog, undefined, "then 'Select Analysis Path' dialog does not exist");
				//clean up
				self.oGlobalApi.oUiApi.getAnalysisPath().getCarouselView().getController().showStepChartChartAfterUpdate.restore();
				self.oGlobalApi.oUiApi.getStepContainer().rerender.restore();
			});
		});
	});
	QUnit.test('given a saved path,when clicking "Open" button from toolbar', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		var selectPathDialog;
		//act
		pressButtonsOfActionListItem(self, 1);
		selectPathDialog = getDialogByEmptyTitle();
		//assert
		assert.ok(selectPathDialog, "then selectPathDialog exists");
		assert.equal(selectPathDialog.isOpen(), true, "then selectPathDialog is in open state");
		pressCancelButtonOfDialogByEmptyTitle(assert, function() {
			selectPathDialog = getDialogByEmptyTitle();
			//assert
			assert.strictEqual(selectPathDialog, undefined, "then 'Select Analysis Path' dialog does not exist");
		});
	});
	QUnit.test('given a saved path,when clicking "Open" button again from toolbar after closing select path gallery dialog', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		var selectPathDialog;
		//act
		pressButtonsOfActionListItem(self, 1);
		selectPathDialog = getDialogByEmptyTitle();
		//assert
		assert.ok(selectPathDialog, "then selectPathDialog exists");
		assert.notEqual(selectPathDialog.getContent()[0].getModel().getData().GalleryElements.length, 0, "then list of saved path exist in open gallery element");
		assert.equal(selectPathDialog.isOpen(), true, "then selectPathDialog is in open state");
		pressCancelButtonOfDialogByEmptyTitle(assert, function() {
			selectPathDialog = getDialogByEmptyTitle();
			//assert
			assert.strictEqual(selectPathDialog, undefined, "then 'Select Analysis Path' dialog does not exist");
		});
		//act
		pressButtonsOfActionListItem(self, 1);
		selectPathDialog = getDialogByEmptyTitle();
		//assert
		assert.ok(selectPathDialog, "then selectPathDialog exists after pressing the open button again");
		assert.notEqual(selectPathDialog.getContent()[0].getModel().getData().GalleryElements.length, 0, "then list of saved path exist in open gallery element");
		assert.equal(selectPathDialog.isOpen(), true, "then selectPathDialog is in open state");
		pressCancelButtonOfDialogByEmptyTitle(assert, function() {
			selectPathDialog = getDialogByEmptyTitle();
			//assert
			assert.strictEqual(selectPathDialog, undefined, "then 'Select Analysis Path' dialog does not exist");
		});
	});
	QUnit.test('given a saved path,when performing two single clicks on "Open" button from toolbar', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		var selectPathDialogOnFirstClick, selectPathDialogOnSecondClick;
		//act
		pressButtonsOfActionListItem(self, 1);
		selectPathDialogOnFirstClick = getDialogByEmptyTitle();
		//assert
		assert.ok(selectPathDialogOnFirstClick, "then selectPathDialog exists on first click");
		assert.equal(selectPathDialogOnFirstClick.isOpen(), true, "then selectPathDialog is in open state");
		pressButtonsOfActionListItem(self, 1);
		selectPathDialogOnSecondClick = getDialogByEmptyTitle();
		assert.deepEqual(selectPathDialogOnFirstClick, selectPathDialogOnSecondClick, "then only one 'Select Analysis Path' dialog exist after second click");
		pressCancelButtonOfDialogByEmptyTitle(assert, function() {
			selectPathDialogOnFirstClick = getDialogByEmptyTitle();
			//assert
			assert.strictEqual(selectPathDialogOnFirstClick, undefined, "then 'Select Analysis Path' dialog does not exist");
		});
	});
	/*SAVE SCENARIOS*/
	QUnit.test('when clicking "Save" button from toolbar', function(assert) {
		var self = this; //eslint-disable-line no-invalid-this
		// pre-condition
		var saveDialog = getDialogByTitleKey("save-analysis-path", self);
		// assert
		assert.strictEqual(saveDialog, undefined, "Dialog does not exist before");
		// arrangement - Required arrangement for this test already done in setup
		//  act
		self.toolbarController.onSaveAndSaveAsPress(/* saveAs = */false);
		saveDialog = getDialogByTitleKey("save-analysis-path", self);
		// assert
		assert.notStrictEqual(saveDialog, undefined, "then dialog exists");
		assert.equal(saveDialog.isOpen(), true, "then dialog is in state open");
		//close dialog
		pressCancelButtonOfDialog("save-analysis-path", self, assert, function() {
			var saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
			//assert
			assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save dialog does not exist");
		});
	});
	QUnit.test('when clicking "Save" button from toolbar and then button "Ok" button of Save dialog', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		var pathName = "hugo";
		var spySuccessToast = sinon.spy(self.toolbarController, "getSuccessToast");
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.stub(self.oGlobalApi.oCoreApi, "putMessage", function(){});
		//  act
		self.toolbarController.onSaveAndSaveAsPress(/* saveAs = */false);
		self.toolbarController.oInput.setValue(pathName);
		pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
			//assert
			assert.strictEqual(self.savePathSpy.calledOnce, true, "then savePath called once");
			assert.strictEqual(self.savePathSpy.getCall(0).args[0], pathName, "param is pathName");
			assert.ok(self.savePathSpy.getCall(0).args[1] instanceof Function, "param is callback");
			assert.strictEqual(spySuccessToast.calledOnce, true, "then message toast shown");
			assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
			assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
			assert.strictEqual(putMessageSpy.getCall(0).args[0].code, "6016", "then error message with correct code is logged");
			//clean up
			createMessageObjectSpy.restore();
			putMessageSpy.restore();
		});
	});
	QUnit.test('given an already saved path when pressing button "Save" button from the toolbar ', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		var pathName = "TestPath";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		self.toolbarController.analysisPathName = analysisPath.oSavedPathName.getTitle();
		self.toolbarController.guid = "5347CB9377CD1E59E10000000A445B6D";
		// create spies
		var spySuccessToast = sinon.spy(self.toolbarController, "getSuccessToast");
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.stub(self.oGlobalApi.oCoreApi, "putMessage", function(){});
		// act
		self.toolbarController.onSaveAndSaveAsPress(/* saveAs = */false);
		var saveDialog = getDialogByTitleKey("save-analysis-path", self);
		// assert
		assert.strictEqual(saveDialog, undefined, "then dialog does not exist");
		assert.strictEqual(self.savePathSpy.calledOnce, true, "then savePath called once");
		assert.strictEqual(self.savePathSpy.getCall(0).args[0], self.toolbarController.guid, "param is guid");
		assert.strictEqual(self.savePathSpy.getCall(0).args[1], pathName, "param is pathName");
		assert.ok(self.savePathSpy.getCall(0).args[2] instanceof Function, "param is callback");
		assert.strictEqual(spySuccessToast.calledOnce, true, "then message toast shown");
		assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
		assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
		assert.strictEqual(putMessageSpy.getCall(0).args[0].code, "6017", "then error message with correct code is logged");
		//clean up
		createMessageObjectSpy.restore();
		putMessageSpy.restore();
	});

	QUnit.test('given paths upto max limit have been saved and when saving a new path', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		var pathName = "hugo";
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.stub(self.oGlobalApi.oCoreApi, "putMessage", function(){});
		//Restore readPaths stub and restub again to change the max limit of paths
		self.oGlobalApi.oCoreApi.readPaths.restore();
		sinon.stub(self.oGlobalApi.oCoreApi, 'readPaths', function(callback) {
			jQuery.getJSON(getSavedPathJSON(), function(data) {
				var metaData, metaDataValue;
				var i;
				for(i = 0; i < data.paths.length; i++) {
					data.paths[i].StructuredAnalysisPath = {
							steps : [ 2, 4 ]
					};
				}
				metaData = {
						getEntityTypeMetadata : function() {
							metaDataValue = {
									maximumNumberOfSteps : 2,
									maxOccurs : 8
							};
							return metaDataValue;
						}
				};
				callback(data, metaData, undefined);
			});
		});
		//  act
		pressButtonsOfActionListItem(self, 2);
		self.toolbarController.oInput.setValue(pathName);
		//act
		pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
			//assert
			assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
			assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
			assert.strictEqual(putMessageSpy.getCall(0).args[0].code, "6014", "then error message with correct code is logged");
			//clean up
			createMessageObjectSpy.restore();
			putMessageSpy.restore();
		});
	});
	QUnit.test('when Maximum number of steps exceeded in a path ', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		var pathName = "hugo";
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.stub(self.oGlobalApi.oCoreApi, "putMessage", function(){});
		//Restore readPaths stub and restub again to change the max limit of steps
		self.oGlobalApi.oCoreApi.readPaths.restore();
		sinon.stub(self.oGlobalApi.oCoreApi, 'readPaths', function(callback) {
			jQuery.getJSON(getSavedPathJSON(), function(data) {
				var metaData, metaDataValue;
				var i;
				for(i = 0; i < data.paths.length; i++) {
					data.paths[i].StructuredAnalysisPath = {
							steps : [ 2, 4 ]
					};
				}
				metaData = {
						getEntityTypeMetadata : function() {
							metaDataValue = {
									maximumNumberOfSteps : 2,
									maxOccurs : 255
							};
							return metaDataValue;
						}
				};
				callback(data, metaData, undefined);
			});
		});
		//  act
		pressButtonsOfActionListItem(self, 2);
		self.toolbarController.oInput.setValue(pathName);
		//act
		pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
			//assert
			assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
			assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
			assert.strictEqual(putMessageSpy.getCall(0).args[0].code, "6015", "then error message with correct code is logged");
			//clean up
			createMessageObjectSpy.restore();
			putMessageSpy.restore();
		});
	});
	QUnit.test('given when no steps are added and clicking on "Save" button from toolbar', function(assert) {
		//arrangement
		var self = this;//eslint-disable-line no-invalid-this
		//Restore getSteps and restub it again with zero steps
		self.oGlobalApi.oCoreApi.getSteps.restore();
		sinon.stub(self.oGlobalApi.oCoreApi, 'getSteps', function() {
			return [];
		});
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.stub(self.oGlobalApi.oCoreApi, "putMessage", function(){});
		// act
		self.toolbarController.onSaveAndSaveAsPress(/* saveAs = */false);
		//assert
		assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
		assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
		assert.strictEqual(putMessageSpy.getCall(0).args[0].code, "6012", "then error message with correct code is logged");
		//clean up
		createMessageObjectSpy.restore();
		putMessageSpy.restore();
	});
	QUnit.test('when preforming two single clicks on "Save" button from toolbar', function(assert) {
		var self = this; //eslint-disable-line no-invalid-this
		// pre-condition
		var saveDialogOnfirstClick = getDialogByTitleKey("save-analysis-path", self), saveDialogOnSecondClick;
		// assert
		assert.strictEqual(saveDialogOnfirstClick, undefined, "Dialog does not exist before");
		//  act
		self.toolbarController.onSaveAndSaveAsPress(/* saveAs = */false);
		saveDialogOnfirstClick = getDialogByTitleKey("save-analysis-path", self);
		// assert
		assert.notStrictEqual(saveDialogOnfirstClick, undefined, "then dialog exists on fisrt click");
		assert.equal(saveDialogOnfirstClick.isOpen(), true, "then dialog is in state open");
		// act
		self.toolbarController.onSaveAndSaveAsPress(/* saveAs = */false);
		saveDialogOnSecondClick = getDialogByTitleKey("save-analysis-path", self);
		// assert
		assert.deepEqual(saveDialogOnfirstClick, saveDialogOnSecondClick, "then only one 'save' dialog exist after second click");
		//close dialog
		pressCancelButtonOfDialog("save-analysis-path", self, assert, function() {
			var saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
			//assert
			assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save dialog does not exist");
		});
	});

	/*SAVE AS SCENARIOS*/
	QUnit.test('when clicking "Save As" button from toolbar', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		//  act
		pressButtonsOfActionListItem(self, 3);
		var saveDialog = getDialogByTitleKey("save-analysis-path", self);
		// assert
		assert.notStrictEqual(saveDialog, undefined, "then dialog exists");
		assert.equal(saveDialog.isOpen(), true, "then dialog is in state oOpen");
		//clean up
		pressCancelButtonOfDialog("save-analysis-path", self, assert, function() {
			var saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
			assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save dialog does not exist");
		}); // close dialog
	});
	QUnit.test('when clicking "Save As" button from toolbar and then clicking "Ok" button of Save As dialog ', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		var pathName = "hugo";
		// create spies
		var spySuccessToast = sinon.spy(self.toolbarController, "getSuccessToast");
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.stub(self.oGlobalApi.oCoreApi, "putMessage", function(){});
		//  act
		pressButtonsOfActionListItem(self, 3);
		// act
		self.toolbarController.oInput.setValue(pathName);
		pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
			//assert
			assert.strictEqual(self.savePathSpy.calledOnce, true, "then savePath called once");
			assert.strictEqual(self.savePathSpy.getCall(0).args[0], pathName, "param is pathName");
			assert.ok(self.savePathSpy.getCall(0).args[1] instanceof Function, "param is callback");
			assert.strictEqual(spySuccessToast.calledOnce, true, "then message toast shown");
			assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
			assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
			assert.strictEqual(putMessageSpy.getCall(0).args[0].code, "6016", "then error message with correct code is logged");
			//clean up
			createMessageObjectSpy.restore();
			putMessageSpy.restore();
		});
	});
	QUnit.test('given already saved path, when clicking "Save As" button from toolbar and then clicking "No" button of "Overwrite AnalysisPath" dialog ', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		var pathName = "TestPath";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		self.toolbarController.analysisPathName = analysisPath.oSavedPathName.getTitle();
		self.toolbarController.guid = "5347CB9377CD1E59E10000000A445B6D";
		// create spies
		var spySuccessToast = sinon.spy(self.toolbarController, "getSuccessToast");
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.stub(self.oGlobalApi.oCoreApi, "putMessage", function(){});
		// act
		pressButtonsOfActionListItem(self, 3);
		pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
			var overwritePathDialog = getDialogByTitleKey("caution", self);
			//assert
			assert.ok(overwritePathDialog, "when ok then overwrite Ananlysis path dialog exists");
			assert.equal(overwritePathDialog.isOpen(), true, "then overwrite AnanlysisPath dialog is in state open");
			//act
			pressCancelButtonOfDialog("caution", self, assert, function() {
				var saveDialog = getDialogByTitleKey("save-analysis-path", self);
				var sDifferentPathName = "newPath";
				saveDialog.getContent()[0].setValue(sDifferentPathName);
				pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
					//assert
					assert.strictEqual(self.savePathSpy.calledOnce, true, "then savePath called once");
					assert.strictEqual(self.savePathSpy.getCall(0).args[0], sDifferentPathName, "param is pathName");
					assert.ok(self.savePathSpy.getCall(0).args[1] instanceof Function, "param is callback");
					assert.strictEqual(spySuccessToast.calledOnce, true, "then message toast shown");
					assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
					assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
					assert.strictEqual(putMessageSpy.getCall(0).args[0].code, "6016", "then error message with correct code is logged");
					//clean up
					createMessageObjectSpy.restore();
					putMessageSpy.restore();
				});
			});
		});
	});
	QUnit.test('given already saved path, when clicking "Save As" button from toolbar and then clicking "Yes" button of "Overwrite AnalysisPath" dialog ', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		var pathName = "TestPath";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		self.toolbarController.analysisPathName = analysisPath.oSavedPathName.getTitle();
		self.toolbarController.guid = "5347CB9377CD1E59E10000000A445B6D";
		// create spies
		var spySuccessToast = sinon.spy(self.toolbarController, "getSuccessToast");
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.stub(self.oGlobalApi.oCoreApi, "putMessage", function(){});
		// act
		pressButtonsOfActionListItem(self, 3);
		pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
			var overwritePathDialog = getDialogByTitleKey("caution", self);
			//assert
			//assert
			assert.ok(overwritePathDialog, "when ok then overwrite Ananlysis path dialog exists");
			assert.strictEqual(overwritePathDialog.getType(),sap.m.DialogType.Message,"Dialog is of message Type");
			assert.equal(overwritePathDialog.isOpen(), true, "then overwrite Ananlysis path is in state open");
			pressOkButtonOfDialog("caution", self, assert, function() {
				//assert
				assert.strictEqual(self.savePathSpy.calledOnce, true, "then savePath called once");
				assert.strictEqual(self.savePathSpy.getCall(0).args[0], self.toolbarController.guid, "param is guid");
				assert.strictEqual(self.savePathSpy.getCall(0).args[1], pathName, "param is pathName");
				assert.ok(self.savePathSpy.getCall(0).args[2] instanceof Function, "param is callback");
				assert.strictEqual(spySuccessToast.calledOnce, true, "then message toast shown");
				assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
				assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
				assert.strictEqual(putMessageSpy.getCall(0).args[0].code, "6017", "then error message with correct code is logged");
				//clean up
				createMessageObjectSpy.restore();
				putMessageSpy.restore();
			});
		});
	});
	QUnit.test('given when no steps are added and clicking on "Save As" button from toolbar', function(assert) {
		//arrangement
		var self = this;//eslint-disable-line no-invalid-this
		//Restore getSteps and restub it again with zero steps
		self.oGlobalApi.oCoreApi.getSteps.restore();
		sinon.stub(self.oGlobalApi.oCoreApi, 'getSteps', function() {
			return [];
		});
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.stub(self.oGlobalApi.oCoreApi, "putMessage", function(){});
		// act
		pressButtonsOfActionListItem(self, 3);
		//assert
		assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
		assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
		assert.strictEqual(putMessageSpy.getCall(0).args[0].code, "6012", "then error message with correct code is logged");
		//clean up
		createMessageObjectSpy.restore();
		putMessageSpy.restore();
	});
	QUnit.test('when preforming two single clicks on "Save As" button from toolbar', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		//  act
		pressButtonsOfActionListItem(self, 3);
		var saveAsDialogOnfirstClick = getDialogByTitleKey("save-analysis-path", self), saveAsDialogOnSecondClick;
		// assert
		assert.notStrictEqual(saveAsDialogOnfirstClick, undefined, "then 'save As' dialog exists on first click");
		assert.equal(saveAsDialogOnfirstClick.isOpen(), true, "then dialog is in state Open");
		// act
		pressButtonsOfActionListItem(self, 3);
		saveAsDialogOnSecondClick = getDialogByTitleKey("save-analysis-path", self);
		// assert
		assert.deepEqual(saveAsDialogOnfirstClick, saveAsDialogOnSecondClick, "then only one 'save As' dialog exist after second click");
		//clean up
		pressCancelButtonOfDialog("save-analysis-path", self, assert, function() {
			var saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
			assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save As dialog does not exist");
		}); // close dialog
	});
	/*DELETE ANALYSISPATH */
	QUnit.test('given a saved/unsaved path,when clicking "Delete" button from toolbar', function(assert) {
		//arrangement
		var done = assert.async();
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		//act
		pressButtonsOfActionListItem(self, 4);
		var selectPathDialog = self.toolbarController.oPathGalleryDialog["deleteAnalysisPath"].getContent()[0];
		//assert
		assert.ok(selectPathDialog, "then selectPathDialog exists");
		assert.equal(selectPathDialog.isOpen(), true, "then selectPathDialog is in open state");
		selectPathDialog.attachAfterClose(function() {
			//assert
			assert.strictEqual(selectPathDialog.isOpen(), null, "then 'Select Analysis Path' dialog does not exist");
			assert.strictEqual(self.toolbarController.oPathGalleryDialog["deleteAnalysisPath"].bIsDestroyed, true, "Delete analysis path view is destroyed");
			done();
		});
		selectPathDialog.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
	});
	QUnit.test('When calling destroy function', function(assert) {
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		//act
		pressButtonsOfActionListItem(this, 4);
		var selectPathDialog = self.toolbarController.oPathGalleryDialog["deleteAnalysisPath"].getContent()[0];
		selectPathDialog.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//action
		this.toolbarController.apfDestroy();
		//assert
		assert.strictEqual(this.toolbarController.oPrintHelper, undefined, "Then oPrintHelper is destroyed");
		assert.strictEqual(this.toolbarController.saveDialog, undefined, "Then saveDialog is destroyed");
		assert.strictEqual(this.toolbarController.newOpenDialog, undefined, "Then OpenDialog is destroyed");
		assert.strictEqual(this.toolbarController.newDialog, undefined, "Then NewDialog is destroyed");
		assert.strictEqual(this.toolbarController.confirmDialog, undefined, "Then ConfirmationDialog is destroyed");
		assert.strictEqual(this.toolbarController.noPathAddedDialog, undefined, "Then NoPathAddedDialog is destroyed");
	});
});
