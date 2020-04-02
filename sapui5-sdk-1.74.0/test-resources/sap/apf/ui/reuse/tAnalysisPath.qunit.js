/*global sap,jQuery sinon, OData */

sap.ui.define([
	'sap/apf/testhelper/stub/ajaxStub',
	'sap/apf/testhelper/stub/textResourceHandlerStub',
	'sap/apf/testhelper/doubles/UiInstance',
	'sap/apf/testhelper/doubles/createUiApiAsPromise',
	'sap/apf/testhelper/doubles/coreApi',
	'sap/apf/testhelper/doubles/messageHandler',
	'sap/apf/testhelper/doubles/sessionHandlerStubbedAjax',
	'sap/apf/testhelper/doubles/request',
	'sap/apf/testhelper/doubles/metadata',
	'sap/apf/testhelper/doubles/Representation',
	'sap/apf/testhelper/doubles/navigationHandler',
	'sap/ui/thirdparty/sinon',
	'sap/ui/thirdparty/sinon-qunit'
	], function(AjaxStub, TextResourceHandlerStub,
				UiInstance, createUiApiAsPromise, CoreApi, MessageHandler, SessionHandlerStubbedAjax,
				Request, Metadata, Representation, NavigationHandler,
				sinon, _sinonQunit) {
	"use strict";
	QUnit.module("Availability Tests For Analysis Path and Popover Menu", {
		beforeEach : function(assert) {
			var done = assert.async();
			this.spy = {};
			var context = this;
			TextResourceHandlerStub.setup(this);
			AjaxStub.stubJQueryAjax();

			var inject = {
					constructors : {
						Metadata : Metadata,
						Request : Request,
						NavigationHandler : NavigationHandler,
						SessionHandler : SessionHandlerStubbedAjax
					}
			};
			createUiApiAsPromise("comp", undefined, inject).done(function(api){
				var that = this;
				this.oGlobalApi = api;
				this.oStep = this.oGlobalApi.oCoreApi.createStep(
					this.oGlobalApi.oCoreApi.getStepTemplates()[2].id,
					function(assert) {},
					this.oGlobalApi.oCoreApi.getStepTemplates()[2].getRepresentationInfo()[0].representationId
				);
				this.oGlobalApi.oCoreApi.setActiveStep(this.oGlobalApi.oCoreApi.getSteps()[0]);
				this.nIndex = this.oGlobalApi.oCoreApi.getSteps().indexOf(this.oStep);
				this.bStepChanged = true;
				this._spyGetLayoutView = function() {
					this.layout = new sap.ui.layout.VerticalLayout();
					this.layout.getController = function() {
						return {
							resetAllFilters : function(param) {
								return param;
							},
							setMasterTitle : function() {
								return null;
							},
							setDetailTitle : function() {
								return null;
							},
							setMasterHeaderButton : function() {
								return null;
							},
							addMasterFooterContentLeft : function() {
								return null;
							},
							detailTitleRemoveAllContent : function() {
								return null;
							},
							enableDisableOpenIn : function() {
								that.enableDisableOpenInCalled = true;
							}
						};
					};
					return this.layout;
				};
				this.analysisPath = this.oGlobalApi.oUiApi.getAnalysisPath();
				this.analysisPathController = this.analysisPath.getController();
				this.oActionListItem = this.analysisPath.oActionListItem;
				this.oGlobalApi.oUiApi.getAnalysisPath().getController().refreshAnalysisPath();
				context.spy.getLayoutView = sinon.stub(this.oGlobalApi.oUiApi, 'getLayoutView', this._spyGetLayoutView);
				context.spy.createCarouselContent = sinon.stub(this.oGlobalApi.oUiApi.getAnalysisPath().getCarouselView(), 'createCarouselContent', function(param) {
					return param;
				});
				context.spy.setActiveStep = sinon.spy(this.oGlobalApi.oCoreApi, "setActiveStep");
				context.spy.getStepContainer = sinon.spy(this.oGlobalApi.oUiApi, 'getStepContainer');
				context.spy.drawStepContent = sinon.spy(this.oGlobalApi.oUiApi.getStepContainer().getController(), 'drawStepContent');
				context.spy.drawMainChart = sinon.spy(this.analysisPathController, 'drawMainChart');
				done();
			}.bind(this));
		},
		afterEach : function() {
			var that = this;
			jQuery.ajax.restore();
			Object.keys(that.spy).forEach(function (name) {
				that.spy[name].restore();
			});
			TextResourceHandlerStub.teardown();
			this.oGlobalApi.oCoreApi.removeStep(this.oGlobalApi.oCoreApi.getSteps()[0], function(assert) {
			});
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("Path name and dirty state of initial path", function(assert) {
		assert.strictEqual(this.analysisPath.oSavedPathName.getTitle(), "Unnamed Analysis Path", "The Analysis Path name has the correct title");
		assert.strictEqual(this.analysisPath.oSavedPathName.getTitle().indexOf("*"), -1, "Name of a new Analysis Path does not have a *");
		var bStarInName = (this.analysisPath.oSavedPathName.getTitle().indexOf("*") !== -1);
		assert.strictEqual(this.oGlobalApi.oCoreApi.isDirty(), bStarInName, "Dirty state and * match for a new analysis path");
	});
	QUnit.test("API availability in Analysis Path Controller", function(assert) {
		assert.ok(typeof this.analysisPathController.refresh === "function", "Refresh API available on the analysis path controller");
		assert.ok(typeof this.analysisPathController.refreshAnalysisPath === "function", "Refresh Carousel API available on the analysis path controller");
		assert.ok(typeof this.analysisPathController.drawMainChart === "function", "Draw mail chart API available on the analysis path controller");
		//assert.ok(typeof this.analysisPathController.drawThumbnail === "function", "Draw Thumbnail API available on the analysis path controller");
		assert.ok(typeof this.analysisPathController.callBackForUpdatePath === "function", "Callback for update path API available on the analysis path controller");
		assert.ok(typeof this.analysisPathController.callBackForUpdatePathAndSetLastStepAsActive === "function", "callBackForUpdatePathAndSetLastStepAsActive API available on the analysis path controller");
	});
	QUnit.test('refresh() test', function(assert) {
		this.analysisPathController.refresh(0);
		assert.ok(typeof this.analysisPathController.refresh === "function", "refresh() called");
	});
	QUnit.test('refresh() test with second step being the active step', function(assert) {
		this.oStep1 = this.oGlobalApi.oCoreApi.createStep(this.oGlobalApi.oCoreApi.getStepTemplates()[2].id, function(assert) {
		}, this.oGlobalApi.oCoreApi.getStepTemplates()[2].getRepresentationInfo()[0].representationId);// creating a step
		this.oGlobalApi.oCoreApi.setActiveStep(this.oGlobalApi.oCoreApi.getSteps()[1]);
	//act
		this.analysisPathController.refresh(0);
	//check
		assert.ok(typeof this.analysisPathController.refresh === "function", "refresh() called");
		this.oGlobalApi.oCoreApi.removeStep(this.oGlobalApi.oCoreApi.getSteps()[0], function(assert) {
		});
	});
	QUnit.test('When calling navigateToStep', function(assert) {
		// prove that Carousel.changeActiveStep is called
		assert.expect(2);
	//arrange
		this.oStep1 = this.oGlobalApi.oCoreApi.createStep(this.oGlobalApi.oCoreApi.getStepTemplates()[0].id,
			function(assert) {},
			this.oGlobalApi.oCoreApi.getStepTemplates()[0].getRepresentationInfo()[0].representationId);// creating a step
		var carousel = this.analysisPathController.getView().getCarouselView().getController();
		this.spy.changeActiveStep = sinon.stub(carousel, "changeActiveStep", function(){
			return "debug";
		});
		this.analysisPathController.refreshAnalysisPath();
	//act
		this.analysisPathController.navigateToStep(1);
	//check
		assert.strictEqual(this.spy.changeActiveStep.callCount, 1, "THEN changeActiveStep called which will then call core.setActiveStep");
		assert.strictEqual(this.spy.changeActiveStep.getCall(0).args[0], 1, "AND it is the 1st step ");
	});
	QUnit.test('When calling updateCurrentStep() for the active step', function(assert) {
		assert.expect(3);
		//prep
		//this.spy.drawThumbnail = sinon.stub(this.analysisPathController, "drawThumbnail", function(){});
		this.spy.getMainContent = sinon.stub(this.oStep.getSelectedRepresentation(), "getMainContent");
		//act
		this.analysisPathController.updateCurrentStep(this.oStep, this.nIndex, this.bStepChanged);
		//check
		assert.strictEqual(this.spy.drawMainChart.callCount, 1, "THEN main chart gets visualized");
		assert.strictEqual(this.spy.drawStepContent.callCount, 1, "THEN main chart gets visualized");
		assert.strictEqual(this.spy.getMainContent.callCount, 1, "THEN the main chart is set by this method of the representation");
	});
	QUnit.test('When calling updateCurrentStep() for an inactive step', function(assert) {
		assert.expect(3);
		//prep
		//this.spy.drawThumbnail = sinon.stub(this.analysisPathController, "drawThumbnail", function(){});
		//act
		this.analysisPathController.updateCurrentStep(this.oStep, 1, this.bStepChanged);
		//check
		assert.strictEqual(this.spy.drawMainChart.callCount, 0, "THEN main chart gets recomputed");
		assert.strictEqual(this.spy.drawStepContent.callCount, 0, "THEN main chart gets not again visualized");
		assert.strictEqual(this.oStep.getSelectedRepresentation().chart, undefined, "AND the main chart is not set in the representation");
		assert.strictEqual(this.spy.getMainContent.callCount, 0, "THEN the main chart is not set by this method");
	});
	QUnit.test('Given an open path situation - When calling updateCurrentStep()', function(assert) {
	//prep
		this.oGlobalApi.oUiApi.getAnalysisPath().getController().isOpenPath = true;
		//this.spy.drawThumbnail = sinon.stub(this.analysisPathController, "drawThumbnail", function(){});
	//act
		this.analysisPathController.updateCurrentStep(this.oStep, this.nIndex, this.bStepChanged);
	//check
		assert.strictEqual(this.spy.drawStepContent.callCount, 1, "drawStepContent() has been called from updateCurrentStep");
	});
	QUnit.test("Availability of menu popover in the analysis path", function(assert) {
		var oActionListPopover = this.analysisPath.oActionListPopover;
		var listItems = this.oActionListItem.getContent()[0].getItems();
		assert.ok(oActionListPopover, "Menu Popover available");
		assert.equal(listItems.length, 6, "Six actions available in menu popover");
		assert.equal(listItems[0].getTitle(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("new"), "New button available");
		assert.equal(listItems[1].getTitle(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("open"), "Open button available");
		assert.equal(listItems[2].getTitle(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("save"), "Save button available");
		assert.equal(listItems[3].getTitle(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("savePathAs"), "Save As button available");
		assert.equal(listItems[4].getTitle(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("delete"), "Delete button available");
		assert.equal(listItems[5].getTitle(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("print"), "Print button available");
	});
	QUnit.test("WHEN retrieving menu popover by its Stable ID", function(assert){
		var popover = this.analysisPath.byId("idAnalysisPathMenuPopOver");
		assert.strictEqual(popover, this.analysisPath.oActionListPopover, "THEN popover is found");
	});
	QUnit.test('Set path title for new clean path', function(assert) {
		this.analysisPathController.setPathTitle();
		assert.strictEqual(this.analysisPath.oSavedPathName.getTitle(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded('unsaved'), 'Language dependent default title without asterisk');
	});
	QUnit.test('Set path title for unsaved dirty path', function(assert) {
		this.oGlobalApi.oCoreApi.setDirtyState(true);
		this.analysisPathController.setPathTitle();
		assert.strictEqual(this.analysisPath.oSavedPathName.getTitle(), '*' + this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded('unsaved'), 'Asterisk indicates dirty path with language dependent default title');
	});
	QUnit.test('Set path title for a saved or opened path', function(assert) {
		this.oGlobalApi.oCoreApi.setPathName("User's Delight");
		this.analysisPathController.setPathTitle();
		assert.strictEqual(this.analysisPath.oSavedPathName.getTitle(), "User's Delight", 'Previously set path name returned displayed as clean path');
	});
	QUnit.test('Set path title for a saved or opened dirty path', function(assert) {
		this.oGlobalApi.oCoreApi.setPathName("User's Delight");
		this.oGlobalApi.oCoreApi.setDirtyState(true);
		this.analysisPathController.setPathTitle();
		assert.strictEqual(this.analysisPath.oSavedPathName.getTitle(), "*User's Delight", 'Previously set path name prefixed with asterisk as indicator for dirty path');
	});
	QUnit.test('When calling destroy function', function(assert) {
		//arrangements
		this.spy.toolbarDestroy = sinon.spy(this.analysisPath.getToolbar().getController(), "apfDestroy");
		this.spy.carouselDestroy = sinon.spy(this.analysisPath.getCarouselView().getController(), "apfDestroy");
		//action
		this.analysisPath.getController().apfDestroy();
		//assert
		assert.ok(this.spy.toolbarDestroy.calledOnce, "apfDestroy() in toolbar controller has been called");
		assert.ok(this.spy.carouselDestroy.calledOnce, "apfDestroy() in carousel controller has been called");
	});
});