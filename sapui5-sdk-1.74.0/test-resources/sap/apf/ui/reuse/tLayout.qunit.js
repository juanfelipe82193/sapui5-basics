jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../integration');
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.createUiApiAsPromise");
jQuery.sap.require("sap.apf.testhelper.helper");
jQuery.sap.require("sap.apf.testhelper.stub.ajaxStub");
jQuery.sap.require("sap.apf.testhelper.odata.savedPaths");
(function() {
	'use strict';
	function doNothing() {
	}
	var NavigationHandler = function(oInject){

		this.getNavigationTargets = function() {
			var deferred = jQuery.Deferred();
			deferred.resolve({
				global : ["atLeastOneGlobal"],
				stepSpecific : []
			});

			return deferred.promise();
		};
		this.checkMode = function() {
			var deferred = jQuery.Deferred();
			deferred.resolve({
				navigationMode : "forward"
			});
			return deferred.promise();
		};
	};
	
	function getDialog(key, oGlobalApi) {
		sap.ui.getCore().applyChanges();
		var title = oGlobalApi.oCoreApi.getTextNotHtmlEncoded(key);
		var oExpectedDialog;
		jQuery.each(jQuery('.sapMDialog'), function(name, element) {
			var oDialog = sap.ui.getCore().byId(element.getAttribute("id"));
			if (title.indexOf(oDialog.getTitle()) !== -1 && oDialog.getTitle() !== "") { // matching even if text resource missing
				oExpectedDialog = oDialog;
			}
		});
		return oExpectedDialog;
	}
	function pressButtonsOfDialog(dialogId, buttonId, assert, layoutView, continuation) {
		var done = assert.async();
		var dialog = layoutView.byId(dialogId);
		// ensure the async callback afterClose has successfully completed.
		dialog.attachAfterClose(function() {
			sap.ui.getCore().applyChanges();
			continuation({});
			done();
		});
		layoutView.byId(buttonId).firePress();
		sap.ui.getCore().applyChanges();
	}
	//Below stubs and Doubles required for Navigation realted test cases...
	function savePathDouble(savedPathJson) {
		return function(arg1, arg2) {
			var callback;
			if (arg2 instanceof Function) {
				callback = arg2;
			}
			jQuery.getJSON(savedPathJson, function(data) {
				callback(data, {}, undefined);
			});
		};
	}
	function getStepsDouble() {
		return function() {
			return [ "firstStep", "secondStep", "thirdStep" ];
		};
	}
	function readPathsStub(callback) {
		var savedPathJson = "/pathOfNoInterest/savedPaths.json";
		jQuery.getJSON(savedPathJson, function(data) {
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
	}
	// Below Stubs are required for layout functionality test cases
	function getTextEncodedStub(x) {
		return x;
	}
	
	function getNotificationBarStub() {
		var layout = new sap.ui.layout.VerticalLayout();
		layout.getController = function(){
			return {
				showMessage : doNothing
			};
		};
		return layout;
	}
	function getEventCallbackStub(eventType, oGlobalApi) {
		return oGlobalApi.oUiApi.getEventCallback(eventType);
	}
	function getStepContainerStub() {
		return new sap.ui.layout.VerticalLayout();
	}
	function getFacetFilterControlStub() {
		var oControl = new sap.ui.layout.VerticalLayout();
		oControl.getFilterExpression = function() {
			var filterExpresn = [];
			return filterExpresn;
		};
		oControl.resetAllFilters = function() {
			return "";
		};
		return oControl;
	}

	QUnit.module('APF UI Reuse', {
		beforeEach : function(assert) {
			var that = this;
			sap.apf.testhelper.stub.stubJQueryAjax();
			var done = assert.async();
			var inject = {
					beforeStartupCallback : function() {
						sinon.stub(this.getProbe().coreApi, 'getTextNotHtmlEncoded', getTextEncodedStub);
					},
					constructors : {
						NavigationHandler : NavigationHandler
					}
			};
			sap.apf.testhelper.doubles.createUiApiAsPromise(undefined, undefined, inject).done(function(api){
				that.oGlobalApi = api;
				sinon.stub(that.oGlobalApi.oUiApi, 'getNotificationBar', getNotificationBarStub);
				sinon.stub(that.oGlobalApi.oUiApi, 'getStepContainer', getStepContainerStub);
				sinon.stub(that.oGlobalApi.oApi, 'getEventCallback', getEventCallbackStub, that.oGlobalApi);
				sinon.stub(that.oGlobalApi.oUiApi, 'getEventCallback', getEventCallbackStub, that.oGlobalApi);
				that.layoutView = that.oGlobalApi.oUiApi.getLayoutView();
				done();
			});

		},
		afterEach : function() {
			var that = this;
			jQuery.ajax.restore();
			that.oGlobalApi.oCoreApi.getTextNotHtmlEncoded.restore();
			that.oGlobalApi.oUiApi.getNotificationBar.restore();
			that.oGlobalApi.oUiApi.getStepContainer.restore();
			that.oGlobalApi.oApi.getEventCallback.restore();
			that.oGlobalApi.oUiApi.getEventCallback.restore();
			that.oGlobalApi.oCompContainer.destroy();
			if (sap.ui.getCore().byId("stepList")){
				sap.ui.getCore().byId("stepList").destroy();
			}
		}
	});
	QUnit.test('When Layout view is initialized', function(assert) {
		//arrangement
		var spyLayoutView = sinon.spy(this.layoutView, 'onAfterRendering');
		//action
		this.layoutView.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		this.layoutView.byId("applicationView").fireAfterMasterOpen();
		sap.ui.getCore().applyChanges();
		//assert
		assert.ok(this.layoutView, 'Layout View available');
		assert.strictEqual(spyLayoutView.called, true, "Then the layout renrendered successfully");
		assert.strictEqual(this.layoutView.byId("applicationPage").getTitle(), "appName", "Header Text is added to the layout");
		assert.strictEqual(this.layoutView.byId("stepContainer") instanceof sap.m.Page, true, "StepContainer is added to layout");
		assert.strictEqual(this.layoutView.byId("analysisPath") instanceof sap.m.Page, true, "AnalysisPath is added to layout");
		assert.strictEqual(this.layoutView.byId("subHeader") instanceof sap.m.ScrollContainer, true, "SubHeader is added to layout");
		assert.strictEqual(this.layoutView.byId("masterFooter") instanceof sap.m.Bar, true, "MasterFooter is added to layout");
		assert.strictEqual(this.layoutView.byId("detailFooter") instanceof sap.m.Bar, true, "Detail is added to layout");
	});
	QUnit.test('When calling addMasterFooterContentRight', function(assert) {
		//arrangement
		var oLabel = new sap.m.Label({
			text : "Label 1"
		});
		var oLabel2 = new sap.m.Label({
			text : "Label 2"
		});
		//action
		this.layoutView.getController().addMasterFooterContentRight(oLabel);
		this.layoutView.getController().addMasterFooterContentRight(oLabel2);
		sap.ui.getCore().applyChanges();
		var checkContentRight = this.layoutView.byId("masterFooter").getContentRight()[0];
		//assert
		assert.strictEqual(oLabel, checkContentRight, "Then addMasterFooterContentRight() - control added to MasterFooterRight");
		assert.strictEqual(this.layoutView.byId("masterFooter").getContentRight()[1].getIcon(), "sap-icon://overflow", "Content overflow Button Added to Footer in case of multiple contents");
	});
	QUnit.test('When calling addMasterFooterContentLeft', function(assert) {
		//arrangement
		var oLabel = new sap.m.Label({
			text : "Label 1"
		});
		//action
		this.layoutView.getController().addMasterFooterContentLeft(oLabel);
		sap.ui.getCore().applyChanges();
		var checkContentLeft = this.layoutView.byId("masterFooter").getContentLeft()[0];
		//assert
		assert.strictEqual(oLabel, checkContentLeft, "addMasterFooterContentLeft() - control added to MasterFooterLeft");
	});
	QUnit.test('When calling addFacetFiler', function(assert) {
		//action
		this.layoutView.getController().addFacetFilter(getFacetFilterControlStub());
		sap.ui.getCore().applyChanges();
		var subHeaderval = this.layoutView.byId("subHeader");
		var facetfilterval = subHeaderval.getContent();
		//assert
		assert.strictEqual(facetfilterval.length, 1, "Then the facetfilterview has added successfully");
	});
	QUnit.test('When calling showMaster', function(assert) {
		//action
		this.layoutView.getController().showMaster();
		sap.ui.getCore().applyChanges();
		//assert
		assert.strictEqual(this.layoutView.byId("applicationView").isMasterShown(), true, "Then the master page has shown");
	});
	QUnit.test('When calling addDetailFooterContentLeft', function(assert) {
		//arrangement
		var oLabel = new sap.m.Label({
			text : "Label 1"
		});
		//action
		this.layoutView.getController().addDetailFooterContentLeft(oLabel);
		sap.ui.getCore().applyChanges();
		var checkContentLeft = this.layoutView.byId("detailFooter").getContentLeft()[0];
		//assert
		assert.strictEqual(oLabel, checkContentLeft, "Then addDetailFooterContentLeft() - control added to DetailFooterLeft");
	});
	QUnit.test('When calling hideMaster', function(assert) {
		//arrangement - Test for Phone
		sap.ui.Device.system.phone = true;
		sap.ui.getCore().applyChanges();
		//action
		this.layoutView.getController().hideMaster();
		//assert
		var currentPageID = this.layoutView.byId("applicationView").getCurrentDetailPage().getId();
		var detailPageID = this.layoutView.byId("stepContainer").getId();
		assert.strictEqual(currentPageID, detailPageID, "Then Master is hidden and Current Page  in Phone StepContainer Detail Page");
		//cleanup
		sap.ui.Device.system.phone = false;
		sap.ui.getCore().applyChanges();
		//arrangement - Test for tablet
		sap.ui.Device.system.tablet = true;
		sap.ui.getCore().applyChanges();
		//action
		this.layoutView.getController().hideMaster();
		currentPageID = this.layoutView.byId("applicationView").getCurrentDetailPage().getId();
		detailPageID = this.layoutView.byId("stepContainer").getId();
		//assert
		assert.strictEqual(currentPageID, detailPageID, "Then Master is hidden and Current Page  in tablet StepContainer Detail Page");
	});
	QUnit.test('When Adding Open In button(as Enabled)', function(assert) {
		this.layoutView.byId("idOpenInButton").destroy();
		//action
		this.layoutView.getController().addOpenInButton();
		sap.ui.getCore().applyChanges();
		var checkContentRight = this.layoutView.byId("detailFooter").getContentRight()[0];
		//assert
		assert.ok(checkContentRight instanceof sap.m.Button, "Open in button is added to the right side of the footer with a global Navigation Target");
		assert.strictEqual(this.layoutView.getController().openInBtn.getEnabled(), true, "Then the OpenIn Button is enabled");
	});
	QUnit.test('When Adding Open In button AND navigation targets exist', function(assert) {
		this.layoutView.byId("idOpenInButton").destroy();
		//action
		this.layoutView.getController().addOpenInButton();
		sap.ui.getCore().applyChanges();
		var checkContentRight = this.layoutView.byId("detailFooter").getContentRight()[0];
		//assert
		assert.ok(checkContentRight instanceof sap.m.Button, "Open in button is added to the right side of the footer with Navigation Target");
		assert.strictEqual(this.layoutView.getController().openInBtn.getEnabled(), true, "Then the OpenIn Button is Enabled");
	});
	QUnit.test('When Adding Open In button AND NO navigation targets exist', function(assert) {
		this.layoutView.byId("idOpenInButton").destroy();
		var controller = this.layoutView.getController();

		function getEmptyNavigationTargets() {
			return sap.apf.utils.createPromise({
				global : [],
				stepSpecific : []
			});
		}
		//arrangement
		sinon.stub(controller.oNavigationHandler, 'getNavigationTargets', getEmptyNavigationTargets);
		//action
		controller.addOpenInButton();
		sap.ui.getCore().applyChanges();
		var checkContentRight = this.layoutView.byId("detailFooter").getContentRight()[0];
		//assert
		assert.ok(checkContentRight instanceof sap.m.Button, "Open in button is added to the right side of the footer with Navigation Target");
		assert.strictEqual(controller.openInBtn.getEnabled(), false, "Then the OpenIn Button is NOT Enabled");
		controller.oNavigationHandler.getNavigationTargets.restore();
	});
	QUnit.test('when a non-dirty path and navigation to previous page happens', function(assert) {
		// arrange
		var newPathDialog = this.layoutView.byId("idNewDialog");
		var navToPrevPage = sinon.stub(window.history, 'go', doNothing);
		// assert
		assert.strictEqual(newPathDialog, undefined, "then before navigation button press, new dialog is not opened");
		// act
		this.layoutView.byId("applicationPage-navButton").firePress();
		sap.ui.getCore().applyChanges();
		newPathDialog = this.layoutView.byId("idNewDialog");
		// assert
		assert.strictEqual(newPathDialog, undefined, "when navigation button press, new dialog not opened");
		assert.strictEqual(navToPrevPage.calledOnce, true, "then navigates to previous page");
		// cleanups
		navToPrevPage.restore();
	});
	QUnit.test('when a dirty path and navigation to previous page happens,then clicking "Ok" button of new dialog then clicking "Cancel" button of save dialog', function(assert) {
		// arrange
		var that = this;
		var savedPathJson = "/pathOfNoInterest/savedPaths.json";
		sinon.stub(that.oGlobalApi.oCoreApi, 'readPaths', readPathsStub);
		var newPathDialog = that.layoutView.byId("idNewDialog"), saveDialog;
		var analysisPath = that.oGlobalApi.oUiApi.getAnalysisPath();
		var toolBarController = analysisPath.getToolbar().getController();
		var pathName = "analysisPathName";
		analysisPath.oSavedPathName.setTitle(pathName);
		// create spies and stubs
		var spySavePath = sinon.stub(toolBarController.oSerializationMediator, 'savePath', savePathDouble(savedPathJson));
		var navToPrevPage = sinon.stub(window.history, 'go', doNothing);
		sinon.stub(that.oGlobalApi.oCoreApi, 'getSteps', getStepsDouble());
		//var stubReadPath = readPathsStub(savedPathJson, testContext);
		analysisPath.getController().refresh(0);
		sap.ui.getCore().applyChanges();
		// assert
		assert.strictEqual(newPathDialog, undefined, "before navigation button press: Analysis path to save dialog is not opened");
		// act
		that.layoutView.byId("applicationPage-navButton").firePress();
		sap.ui.getCore().applyChanges();
		newPathDialog = that.layoutView.byId("idNewDialog");
		// assert
		assert.ok(newPathDialog, "when navigation Button press: new dialog exist");
		assert.strictEqual(newPathDialog.isOpen(), true, "When navigation Button press: new dialog opened");
		pressButtonsOfDialog("idNewDialog", "idYesButton", assert, that.layoutView, function() {
			saveDialog = getDialog("save-analysis-path", that.oGlobalApi);
			assert.ok(saveDialog, " then save-analysis-path dialog exists");
			assert.strictEqual(saveDialog.isOpen(), true, "then Save dialog opened");
			var done = assert.async();
			saveDialog.getEndButton().firePress();
			sap.ui.getCore().applyChanges();
			saveDialog.attachAfterClose(function() {
				// assert
				saveDialog = getDialog("save-analysis-path", that.oGlobalApi);
				assert.strictEqual(saveDialog, undefined, "then Save dialog does not exist");
				assert.strictEqual(spySavePath.calledOnce, false, "when Cancel, then savePath not called");
				assert.strictEqual(navToPrevPage.calledOnce, false, "then remains in the same page");
				// cleanups
				navToPrevPage.restore();
				done();
			});
		});
		// cleanups
		that.oGlobalApi.oCoreApi.readPaths.restore();
	});
	QUnit.test('when a dirty path and navigation to previous page happens,then clicking "Ok" button of new dialog then clicking "Ok" button of save dialog', function(assert) {
		// arrange
		var that = this;
		var savedPathJson = "/pathOfNoInterest/savedPaths.json";
		var done;
		var newPathDialog = that.layoutView.byId("idNewDialog"), saveDialog;
		var analysisPath = that.oGlobalApi.oUiApi.getAnalysisPath();
		var toolBarController = analysisPath.getToolbar().getController();
		var pathName = "analysisPathName";
		analysisPath.oSavedPathName.setTitle(pathName);
		// create spies and stubs
		var spySavePath = sinon.stub(toolBarController.oSerializationMediator, 'savePath', savePathDouble(savedPathJson));
		var navToPrevPage = sinon.stub(window.history, 'go', doNothing);
		sinon.stub(that.oGlobalApi.oCoreApi, 'getSteps', getStepsDouble());
		sinon.stub(that.oGlobalApi.oCoreApi, 'readPaths', readPathsStub);
		analysisPath.getController().refresh(0);
		sap.ui.getCore().applyChanges();
		// assert
		assert.strictEqual(newPathDialog, undefined, "before navigation button press: Analysis path to save dialog not opened");
		// act
		that.layoutView.byId("applicationPage-navButton").firePress();
		sap.ui.getCore().applyChanges();
		newPathDialog = that.layoutView.byId("idNewDialog");
		// assert
		assert.ok(newPathDialog, "After navigation Button press: new dialog exist");
		assert.strictEqual(newPathDialog.isOpen(), true, "After navigation Button press: new opened");
		pressButtonsOfDialog("idNewDialog", "idYesButton", assert, that.layoutView, function() {
			saveDialog = getDialog("save-analysis-path", that.oGlobalApi);
			assert.ok(saveDialog, "then save-analysis-path dialog exists");
			assert.strictEqual(saveDialog.isOpen(), true, "then Save dialog is in open state");
			done = assert.async();
			saveDialog.getBeginButton().firePress();
			sap.ui.getCore().applyChanges();
			saveDialog.attachAfterClose(function() {
				// assert
				saveDialog = getDialog("save-analysis-path", that.oGlobalApi);
				assert.strictEqual(saveDialog, undefined, "then Save dialog does not exist");
				assert.strictEqual(spySavePath.calledOnce, true, "when ok then savePath called");
				assert.strictEqual(navToPrevPage.calledOnce, true, "then navigated to previous page");
				// cleanups
				navToPrevPage.restore();
				done();
			});
		});
		// cleanups
		that.oGlobalApi.oCoreApi.readPaths.restore();
	});
	QUnit.test('when a dirty path and navigation to previous page happens,then clicking "No" button of new dialog', function(assert) {
		// arrange
		var that = this;
		var newPathDialog = that.layoutView.byId("idNewDialog"), saveAnalysisPathDialog;
		var analysisPath = that.oGlobalApi.oUiApi.getAnalysisPath();
		var navToPrevPage = sinon.stub(window.history, 'go', doNothing);
		sinon.stub(that.oGlobalApi.oCoreApi, 'getSteps', getStepsDouble());
		analysisPath.getController().refresh(0);
		sap.ui.getCore().applyChanges();
		// assert
		assert.strictEqual(newPathDialog, undefined, "Before navigation button press: Analysis path to save dialog not opened");
		// act
		that.layoutView.byId("applicationPage-navButton").firePress();
		sap.ui.getCore().applyChanges();
		newPathDialog = that.layoutView.byId("idNewDialog");
		// assert
		assert.ok(newPathDialog, "After navigation Button press: new dialog exist");
		assert.strictEqual(newPathDialog.isOpen(), true, "After navigation Button press: new dialog opened");
		pressButtonsOfDialog("idNewDialog", "idNoButton", assert, that.layoutView, function() {
			saveAnalysisPathDialog = getDialog("save-analysis-path", that.oGlobalApi);
			//assert
			assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save dialog does not exist");
			assert.strictEqual(navToPrevPage.calledOnce, true, "Navigating to previous page");
		});
		// cleanups
		that.oGlobalApi.oCoreApi.getSteps.restore();
		navToPrevPage.restore();
	});
	QUnit.test('when a dirty path and navigation to previous page happens,then clicking "Cancel" button of new dialog', function(assert) {
		// arrange
		var that = this;
		var newPathDialog = that.layoutView.byId("idNewDialog"), saveAnalysisPathDialog;
		var analysisPath = that.oGlobalApi.oUiApi.getAnalysisPath();
		var navToPrevPage = sinon.stub(window.history, 'go', doNothing);
		sinon.stub(that.oGlobalApi.oCoreApi, 'getSteps', getStepsDouble());
		analysisPath.getController().refresh(0);
		sap.ui.getCore().applyChanges();
		// assert
		assert.strictEqual(newPathDialog, undefined, "Before navigation button press: Analysis path to save dialog not opened");
		// act
		that.layoutView.byId("applicationPage-navButton").firePress();
		sap.ui.getCore().applyChanges();
		newPathDialog = that.layoutView.byId("idNewDialog");
		// assert
		assert.ok(newPathDialog, "After navigation Button press: new dialog exist");
		assert.strictEqual(newPathDialog.isOpen(), true, "After navigation Button press: new dialog opened");
		pressButtonsOfDialog("idNewDialog", "idCancelButton", assert, that.layoutView, function() {
			saveAnalysisPathDialog = getDialog("save-analysis-path", that.oGlobalApi);
			//assert
			assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save dialog does not exist");
			assert.strictEqual(navToPrevPage.calledOnce, false, "Remains in the same page");
		});
		//cleanups
		that.oGlobalApi.oCoreApi.getSteps.restore();
		navToPrevPage.restore();
	});
	QUnit.test("Test, whether id is assigned to the Open In.. Button", function(assert){
		var button = this.layoutView.byId("idOpenInButton");
		assert.ok(button instanceof sap.m.Button, "THEN button can be accessed by id");
	});
})();