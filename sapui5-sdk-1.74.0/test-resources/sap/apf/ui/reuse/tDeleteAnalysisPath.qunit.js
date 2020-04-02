
sap.ui.define([
	"sap/apf/testhelper/doubles/createUiApiAsPromise",
	'sap/apf/testhelper/odata/savedPaths',
	"sap/apf/testhelper/doubles/UiInstance",
	'sap/ui/thirdparty/sinon',
	'sap/ui/thirdparty/sinon-qunit'
], function(createUiApiAsPromise, SavedPaths, UiInstance, sinon, _sinonQunit) {
	'use strict';

	function pressDeleteItem(itemId) {
		sap.ui.getCore().byId(jQuery(".sapMLIBIconDel")[itemId].getAttribute("id")).firePress();
		sap.ui.getCore().applyChanges();
	}
	function pressOkButtonOfDialog(dialog, assert, continuation) {
		var done = assert.async();
		// ensure the async callback afterClose has successfully completed.
		dialog.attachAfterClose(function() {
			continuation({});
			done();
		});
		dialog.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
	}
	function pressCancelButtonOfDialog(dialog, assert, continuation) {
		var done = assert.async();
		// ensure the async callback afterClose has successfully completed.
		dialog.attachAfterClose(function() {
			continuation({});
			done();
		});
		dialog.getEndButton().firePress();
		sap.ui.getCore().applyChanges();
	}
	function pressCloseButtonOfDialog(dialog, assert, continuation) {
		var done = assert.async();
		// ensure the async callback afterClose has successfully completed.
		dialog.attachAfterClose(function() {
			continuation({});
			done();
		});
		dialog.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
	}
	function getFormattedDate(utcDate) {
		var numberPattern = /\d+/g;
		var timeStamp = parseInt(utcDate.match(numberPattern)[0], 10);
		var date = ((new Date(timeStamp)).toString()).split(' ');
		var formatteddate = date[1] + "-" + date[2] + "-" + date[3];
		return formatteddate;
	}
	//Here are stubs required for Test case
	function doNothing() {
	}
	function getLayoutViewStub() {
		var layout = new sap.ui.layout.VerticalLayout();
		layout.getController = getLayoutControllerStub;
		return layout;
	}
	function getLayoutControllerStub() {
		return {
			setFilter : function(param) {
				return param;
			},
			setMasterTitle : doNothing,
			setDetailTitle : doNothing,
			setMasterHeaderButton : doNothing,
			addMasterFooterContentLeft : doNothing,
			detailTitleRemoveAllContent : doNothing,
			enableDisableOpenIn : doNothing
		};
	}
	function deleteListItemDouble(oResponse, metaData, oMessageObject) {
		return function(guid, callback) {
			callback(oResponse, metaData, oMessageObject);
		};
	}
	function readAllPathsDouble(oResponse, metaData, oMessageObject) {
		return function(callback) {
			callback(oResponse, metaData, oMessageObject);
		};
	}
	QUnit.module("Delete Analysis Path Unit Tests", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			var testContext = this;
			createUiApiAsPromise().done(function(api){
				that.oGlobalApi = api;
				var oInject;
				var getDataForPathGallery = function(data) {
					var galleryData = data.paths;
					for( var i in galleryData) {
						galleryData[i].StructuredAnalysisPath = galleryData[i].StructuredAnalysisPath;
						var noOfSteps = galleryData[i].StructuredAnalysisPath.steps.length;
						var dateToShow = getFormattedDate(galleryData[i].LastChangeUTCDateTime);
						galleryData[i].guid = galleryData[i].AnalysisPath;
						galleryData[i].title = galleryData[i].AnalysisPathName;
						galleryData[i].StructuredAnalysisPath.noOfSteps = noOfSteps;
						galleryData[i].description = dateToShow + "  -   (" + that.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("no-of-steps", [ noOfSteps ]) + ")";
						galleryData[i].summary = galleryData[i].AnalysisPathName + "- (" + dateToShow + ") - (" + that.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("no-of-steps", [ noOfSteps ]) + ")";
					}
					var jsonData = {
						GalleryElements : galleryData
					};
					oInject = {
						uiApi : that.oGlobalApi.oUiApi,
						oCoreApi : that.oGlobalApi.oCoreApi,
						oContext : that.oGlobalApi.oContext,
						oSerializationMediator : that.oGlobalApi.oSerializationMediator
					};
					testContext.oPathGalleryWithDelete = new sap.ui.view({
						type : sap.ui.core.mvc.ViewType.JS,
						viewName : "sap.apf.ui.reuse.view.deleteAnalysisPath",
						viewData : {
							oInject : oInject,
							jsonData : jsonData
						}
					});
				};
				var aSavedPaths = SavedPaths.getSavedPaths();
				getDataForPathGallery(aSavedPaths);
				sinon.stub(that.oGlobalApi.oUiApi, "getLayoutView", getLayoutViewStub);
				that.stub_putMessage = sinon.stub(oInject.oCoreApi, "putMessage", function(){});
				done();
			});
		},
		getDeleteAnalysisPathDialog : function() {
			return this.oPathGalleryWithDelete.getContent()[0];
		},
		afterEach : function() {
			this.stub_putMessage.restore();
			this.oGlobalApi.oCompContainer.destroy();
			this.oGlobalApi.oUiApi.getLayoutView.restore();
		}
	});
	QUnit.test("when calling openPathGallery function which opens dialog with delete mode ", function(assert) {
		//arrangement
		var jsonData = this.oPathGalleryWithDelete.getViewData().jsonData;
		var dateToShow = getFormattedDate(jsonData.GalleryElements[0].LastChangeUTCDateTime);
		var noOfSteps = jsonData.GalleryElements[0].StructuredAnalysisPath.steps.length;
		var totalPath = jsonData.GalleryElements.length;
		var description = dateToShow + "  -   (" + this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("no-of-steps", [ noOfSteps ]) + ")";
		//action
		this.oPathGalleryWithDelete.getController().openPathGallery();
		sap.ui.getCore().applyChanges();
		var selectAnalysisPathDialog = this.getDeleteAnalysisPathDialog();
		var dialogPathlength = selectAnalysisPathDialog.getContent()[0].getItems().length;
		var analysisPathName = selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle();
		var descriptionOnUi = selectAnalysisPathDialog.getContent()[0].getItems()[0].getDescription();
		//assert
		assert.strictEqual(selectAnalysisPathDialog.isOpen(), true, "then Dialog for deleteing path is opened on ui");
		assert.strictEqual(totalPath, dialogPathlength, "then Number of paths shown in Path gallery are same as those saved ");
		assert.strictEqual(jsonData.GalleryElements[0].AnalysisPathName, analysisPathName, "then Path Name to be deleted is 'TestPath1'");
		assert.strictEqual(description, descriptionOnUi, "then Description in path Gallery with delete mode on UI is same as saved description");
		assert.strictEqual(selectAnalysisPathDialog.hasStyleClass("sapUiSizeCompact"), true, "then Select Analysis Path Gallery has the correct style class");
		//cleanup
		pressCloseButtonOfDialog(this.getDeleteAnalysisPathDialog(), assert, doNothing);
	});
	QUnit.test("when triggering delete icon and 'No' is pressed on Delete Analysis Path Dialog", function(assert) {
		//arrangement
		this.oPathGalleryWithDelete.getController().openPathGallery();
		sap.ui.getCore().applyChanges();
		//action
		pressDeleteItem(0);

		var delDialog = this.oPathGalleryWithDelete.getController().delConfirmDialog;
		//assert
		assert.ok(delDialog, "then Delete Analysis Path dialog exists");
		assert.strictEqual(delDialog.isOpen(), true, "then Delete Analysis Path dialog is open");
		pressCancelButtonOfDialog(delDialog, assert, function() {
			var delDialog = this.oPathGalleryWithDelete.getController().delConfirmDialog;
			assert.strictEqual(delDialog.isOpen(), null, "then Delete Analysis Path dialog is closed");
		}.bind(this));
		// cleanup
		pressCloseButtonOfDialog(this.getDeleteAnalysisPathDialog(), assert, doNothing);
	});
	QUnit.test("when deleting a saved path from the path gallery(Successful UI callback - delete and read success callbacks", function(assert) {
		//arrangement
		var that = this;
		this.oPathGalleryWithDelete.getController().openPathGallery();
		sap.ui.getCore().applyChanges();
		var selectAnalysisPathDialog = this.getDeleteAnalysisPathDialog();
		var pathName = selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle();
		var pathGUID = this.oPathGalleryWithDelete.oViewData.jsonData.GalleryElements[0].guid;
		var spyDelete = sinon.stub(that.oGlobalApi.oSerializationMediator, 'deletePath', deleteListItemDouble({}, {}));
		var oResponseForReadPath = {
			paths : [ 1, 2, 3 ]
		};
		var spyRead = sinon.stub(that.oGlobalApi.oCoreApi, 'readPaths', readAllPathsDouble(oResponseForReadPath, {}));
		//action
		pressDeleteItem(0);
		//assert
		var delDialog = this.oPathGalleryWithDelete.getController().delConfirmDialog;
		pressOkButtonOfDialog(delDialog, assert, function() {
			assert.strictEqual(spyDelete.calledOnce, true, "Then deletePath is called");
			assert.strictEqual(spyDelete.calledWith(pathGUID), true, "Then deletePath is called with correct GUID");
			assert.strictEqual(spyRead.calledOnce, true, "Then readPath is called");
			assert.notEqual(selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle(), pathName, "Then Path has been deleted from the UI");
			assert.strictEqual(that.stub_putMessage.calledOnce, false, "Then Message Object is not present");
		});
		//cleanup
		that.oGlobalApi.oSerializationMediator.deletePath.restore();
		that.oGlobalApi.oCoreApi.readPaths.restore();
		pressCloseButtonOfDialog(this.getDeleteAnalysisPathDialog(), assert, doNothing);
	});
	QUnit.test("when deleting a saved path from the path gallery(Unsuccessful UI callback - Failure of delete callback - oResponse not of type object", function(assert) {
		//arrangement
		var that = this;
		this.oPathGalleryWithDelete.getController().openPathGallery();
		sap.ui.getCore().applyChanges();
		var selectAnalysisPathDialog = this.getDeleteAnalysisPathDialog();
		var pathName = selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle();
		var pathGUID = this.oPathGalleryWithDelete.oViewData.jsonData.GalleryElements[0].guid;
		var spyDelete = sinon.stub(that.oGlobalApi.oSerializationMediator, 'deletePath', deleteListItemDouble("", {}));
		var spyRead = sinon.stub(that.oGlobalApi.oCoreApi, 'readPaths', readAllPathsDouble({}, {}));
		//action
		pressDeleteItem(0);
		//assert
		var delDialog = this.oPathGalleryWithDelete.getController().delConfirmDialog;
		pressOkButtonOfDialog(delDialog, assert, function() {
			assert.strictEqual(spyDelete.calledOnce, true, "Then deletePath is called");
			assert.strictEqual(spyDelete.calledWith(pathGUID), true, "Then deletePath is called with correct GUID");
			assert.strictEqual(spyRead.calledOnce, false, "Then readPath is not called");
			assert.strictEqual(selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle(), pathName, "Then Path has not been deleted from the UI");
			assert.strictEqual(that.stub_putMessage.calledOnce, true, "Then Message Object is present");
		});
		//cleanup
		that.oGlobalApi.oSerializationMediator.deletePath.restore();
		that.oGlobalApi.oCoreApi.readPaths.restore();
		that.oGlobalApi.oCoreApi.putMessage.restore();
		pressCloseButtonOfDialog(this.getDeleteAnalysisPathDialog(), assert, doNothing);
	});
	QUnit.test("when deleting a saved path from the path gallery(Unsuccessful UI callback - Failure of delete callback - oMessageObject is present", function(assert) {
		//arrangement
		var that = this;
		this.oPathGalleryWithDelete.getController().openPathGallery();
		sap.ui.getCore().applyChanges();
		var selectAnalysisPathDialog = this.getDeleteAnalysisPathDialog();
		var pathName = selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle();
		var oMessageObject = that.oGlobalApi.oCoreApi.createMessageObject({
			code : "6009",
			aParameters : [ "delete", pathName ]
		});
		var oResponseForReadPath = {
			paths : [ 1, 2, 3 ]
		};
		var pathGUID = this.oPathGalleryWithDelete.oViewData.jsonData.GalleryElements[0].guid;
		var spyDelete = sinon.stub(that.oGlobalApi.oSerializationMediator, 'deletePath', deleteListItemDouble({}, {}, oMessageObject));
		var spyRead = sinon.stub(that.oGlobalApi.oCoreApi, 'readPaths', readAllPathsDouble(oResponseForReadPath, {}));
		//action
		pressDeleteItem(0);
		//assert
		var delDialog = this.oPathGalleryWithDelete.getController().delConfirmDialog;
		pressOkButtonOfDialog(delDialog, assert, function() {
			assert.strictEqual(spyDelete.calledOnce, true, "Then deletePath is called");
			assert.strictEqual(spyDelete.calledWith(pathGUID), true, "Then deletePath is called with correct GUID");
			assert.strictEqual(spyRead.calledOnce, false, "Then readPath is not called");
			assert.strictEqual(selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle(), pathName, "Then Path has not been deleted from the UI");
			assert.strictEqual(that.stub_putMessage.called, true, "Then Message Object is also put on the console");
		});
		//cleanup
		that.oGlobalApi.oSerializationMediator.deletePath.restore();
		that.oGlobalApi.oCoreApi.readPaths.restore();
		pressCloseButtonOfDialog(this.getDeleteAnalysisPathDialog(), assert, doNothing);
	});
	QUnit.test("when deleting a saved path from the path gallery(Unsuccessful UI callback - Failure of read callback - - oResponse not of type object", function(assert) {
		//arrangement
		var that = this;
		this.oPathGalleryWithDelete.getController().openPathGallery();
		sap.ui.getCore().applyChanges();
		var selectAnalysisPathDialog = this.getDeleteAnalysisPathDialog();
		var pathName = selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle();
		var pathGUID = this.oPathGalleryWithDelete.oViewData.jsonData.GalleryElements[0].guid;
		var spyDelete = sinon.stub(that.oGlobalApi.oSerializationMediator, 'deletePath', deleteListItemDouble({}, {}));
		var spyRead = sinon.stub(that.oGlobalApi.oCoreApi, 'readPaths', readAllPathsDouble("", {}));
		//action
		pressDeleteItem(0);
		//assert
		var delDialog = this.oPathGalleryWithDelete.getController().delConfirmDialog;
		pressOkButtonOfDialog(delDialog, assert, function() {
			assert.strictEqual(spyDelete.calledOnce, true, "Then deletePath is called");
			assert.strictEqual(spyDelete.calledWith(pathGUID), true, "Then deletePath is called with correct GUID");
			assert.strictEqual(spyRead.calledOnce, true, "Then readPath is not called");
			assert.notEqual(selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle(), pathName, "Then Path has been deleted from the UI");
			assert.strictEqual(that.stub_putMessage.calledOnce, true, "Then Message Object is also present");
		});
		//cleanup
		that.oGlobalApi.oSerializationMediator.deletePath.restore();
		that.oGlobalApi.oCoreApi.readPaths.restore();
		pressCloseButtonOfDialog(this.getDeleteAnalysisPathDialog(), assert, doNothing);
	});
	QUnit.test("when deleting a saved path from the path gallery(Unsuccessful UI callback - Failure of read callback - - oMessage Object present", function(assert) {
		//arrangement
		var that = this;
		this.oPathGalleryWithDelete.getController().openPathGallery();
		sap.ui.getCore().applyChanges();
		var selectAnalysisPathDialog = this.getDeleteAnalysisPathDialog();
		var pathName = selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle();
		var oMessageObject = that.oGlobalApi.oCoreApi.createMessageObject({
			code : "6005",
			aParameters : [ pathName ]
		});
		var pathGUID = this.oPathGalleryWithDelete.oViewData.jsonData.GalleryElements[0].guid;
		var spyDelete = sinon.stub(that.oGlobalApi.oSerializationMediator, 'deletePath', deleteListItemDouble({}, {}));
		var spyRead = sinon.stub(that.oGlobalApi.oCoreApi, 'readPaths', readAllPathsDouble("", {}, oMessageObject));
		//action
		pressDeleteItem(0);
		//assert
		var delDialog = this.oPathGalleryWithDelete.getController().delConfirmDialog;
		pressOkButtonOfDialog(delDialog, assert, function() {
			assert.strictEqual(spyDelete.calledOnce, true, "Then deletePath is called");
			assert.strictEqual(spyDelete.calledWith(pathGUID), true, "Then deletePath is called with correct GUID");
			assert.strictEqual(spyRead.calledOnce, true, "Then readPath is not called");
			assert.notEqual(selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle(), pathName, "Then Path has been deleted from the UI");
			assert.strictEqual(that.stub_putMessage.called, true, "Then Message Object is also present");
		});
		//cleanup
		that.oGlobalApi.oSerializationMediator.deletePath.restore();
		that.oGlobalApi.oCoreApi.readPaths.restore();
		pressCloseButtonOfDialog(this.getDeleteAnalysisPathDialog(), assert, doNothing);
	});
	QUnit.test("When current opened path is deleted)", function(assert) {
		//arrangement
		var that = this;
		this.oPathGalleryWithDelete.getController().openPathGallery();
		sap.ui.getCore().applyChanges();
		var selectAnalysisPathDialog = this.getDeleteAnalysisPathDialog();
		var pathName = selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle();
		var analysisPath = that.oGlobalApi.oUiApi.getAnalysisPath();
		var toolbarController = analysisPath.getToolbar().getController();
		analysisPath.oSavedPathName.setTitle(pathName);

		var pathGUID = this.oPathGalleryWithDelete.oViewData.jsonData.GalleryElements[0].guid;
		var spyDelete = sinon.stub(that.oGlobalApi.oSerializationMediator, 'deletePath', deleteListItemDouble({}, {}));
		var spyResetAnalysisPath = sinon.spy(toolbarController, 'resetAnalysisPath');
		var oResponseForReadPath = {
			paths : [ 1, 2, 3 ]
		};
		var spyRead = sinon.stub(that.oGlobalApi.oCoreApi, 'readPaths', readAllPathsDouble(oResponseForReadPath, {}));
		//action
		pressDeleteItem(0);
		//assert
		var delDialog = this.oPathGalleryWithDelete.getController().delConfirmDialog;
		pressOkButtonOfDialog(delDialog, assert, function() {
			assert.strictEqual(spyDelete.calledOnce, true, "Then deletePath is called");
			assert.strictEqual(spyDelete.calledWith(pathGUID), true, "Then deletePath is called with correct GUID");
			assert.strictEqual(spyRead.calledOnce, true, "Then readPath is called");
			assert.notEqual(selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle(), pathName, "Then Path has been deleted from the UI");
			assert.strictEqual(that.stub_putMessage.calledOnce, false, "Then Message Object is not present");
			assert.strictEqual(that.oGlobalApi.oUiApi.getAnalysisPath().oSavedPathName.getTitle(), "Unnamed Analysis Path", "Current opened path deleted");
			assert.strictEqual(spyResetAnalysisPath.calledOnce, true, "Then Analysis Path has been reset");
		});
		//cleanup
		that.oGlobalApi.oSerializationMediator.deletePath.restore();
		that.oGlobalApi.oCoreApi.readPaths.restore();
		pressCloseButtonOfDialog(this.getDeleteAnalysisPathDialog(), assert, doNothing);
	});
	QUnit.test("When clicking on Cancel button of delete analysis path Dialog", function(assert) {
		//arrange
		this.oPathGalleryWithDelete.getController().openPathGallery();
		sap.ui.getCore().applyChanges();
		//action
		pressCloseButtonOfDialog(this.getDeleteAnalysisPathDialog(), assert, function(){
			assert.strictEqual(this.oPathGalleryWithDelete.bIsDestroyed, true, "then view is destroyed");
		}.bind(this));
	});
	QUnit.module("Delete Analysis Path controller", {
		beforeEach : function() {
			this.deleteAnalysisPathView = sap.ui.view({
				viewName : "sap.apf.ui.reuse.view.deleteAnalysisPath",
				type : sap.ui.core.mvc.ViewType.JS,
				viewData : {
					oInject : {
						oCoreApi : {
							getTextNotHtmlEncoded : function(textKey, aParameters){
								var text = textKey;
								if(aParameters){
									aParameters.forEach(function(parameter){
										text = text + ", " + parameter;
									});
								}
								return text;
							}
						}
					}
				}
			});
			this.deleteAnalysisPathController = this.deleteAnalysisPathView.getController();
		}
	});
	QUnit.test("openConfirmDelDialog with { sign", function(assert) {
		this.deleteAnalysisPathController.openConfirmDelDialog({
			sPathName : "{test"
		});
		var dialog = this.deleteAnalysisPathController.delConfirmDialog;
		assert.strictEqual(dialog.getContent()[0].getText(), "do-you-want-to-delete-analysis-path, '{test'", "Delete Confirmation Dialog has correct text");
		dialog.destroy();
	});
});