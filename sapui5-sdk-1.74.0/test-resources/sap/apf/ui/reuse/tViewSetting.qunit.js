jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../integration');
jQuery.sap.declare('sap.apf.ui.reuse.tViewSetting');
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.createUiApiAsPromise");
jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
jQuery.sap.require('sap.apf.testhelper.config.representationHelper');
jQuery.sap.require('sap.ui.table.Column');
(function() {
	'use strict';
	var representationHelper,
		oViewSettingsDialog,
		oTableRepresentation;
	function _getSampleData(oGlobalApi) {
		return sap.apf.testhelper.odata.getSampleService(oGlobalApi.oApi, 'sampleData');
	}
	function _getDialogByEmptyTitle() {
		sap.ui.getCore().applyChanges();
		var oExpectedDialog;
		jQuery.each(jQuery('.sapMDialog'), function(name, element) {
			var oDialog = sap.ui.getCore().byId(element.getAttribute("id"));
			if (oDialog.getTitle() === "") {
				oExpectedDialog = oDialog;
			}
		});
		return oExpectedDialog;
	}
	function _destroyViewSettingDialog() {
		var viewSettingDialog = _getDialogByEmptyTitle();
		if (viewSettingDialog !== undefined && viewSettingDialog.isOpen()) {
			viewSettingDialog.destroy();
		}
	}
	function _getSelectedSortItem(oViewSettingDialog) {
		var oSortOption = {};
		var oSelectedSortItem = oViewSettingDialog.getSelectedSortItem();
		oViewSettingDialog.getSortItems().forEach(function(oSortItem) {
			if (oSortItem.getId() === oSelectedSortItem) {
				oSortOption.property = oSortItem.getKey();
				oSortOption.ascending = !oViewSettingDialog.getSortDescending();
			}
		});
		return oSortOption;
	}
	function _createTableRepresentationStub(requiredParameter, isAlternateRepresentation, oGlobalApi) {
		var aProperties = requiredParameter.dimensions.concat(requiredParameter.measures).length ? requiredParameter.dimensions.concat(requiredParameter.measures) : requiredParameter.properties; // read the table properties if available , else Concatenate dimensions & measures
		var aTableColumns = [];
		aProperties.forEach(function(property) {
			var oColumn = new sap.ui.table.Column();
			var customDataForColumn = new sap.ui.core.CustomData({
				value : {
					text : property.fieldName,
					key : property.fieldName
				}
			});
			oColumn.addCustomData(customDataForColumn);
			aTableColumns.push(oColumn);
		});
		var aTableData = _getSampleData(oGlobalApi);
		var oModelForTable = new sap.ui.model.json.JSONModel();
		oModelForTable.setData({
			tableData : aTableData
		});
		var oTable = new sap.ui.table.Table();
		aTableColumns.forEach(function(column) {
			oTable.addColumn(column);
		});
		oTable.setModel(oModelForTable);
		oTable.bindRows("/tableData");
		var oTableRepresentation = {
			getViewSettingDialog : function() {
				return new sap.m.Dialog();
			},
			tableControl : oTable,
			oParameter : {
				isAlternateRepresentation : isAlternateRepresentation
			},
			oPaginationHandler : {
			},
			oApi : {
				getActiveStep : function() {
					return undefined;
				},
				selectionChanged : function() {}
			},
			orderby : requiredParameter.orderby,
			resetPaginationForTable : function(){
				this.resetPaginationCalled = true;
			}
		};
		var oContainer = new sap.ui.layout.VerticalLayout();
		oContainer.addContent(new sap.m.ScrollContainer({
			content : oTableRepresentation.tableControl
		}));
		return oTableRepresentation;
	}
	QUnit.module("View Setting dialog for main table representation and alternate table - with no sort criterium", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(api) {
				that.oGlobalApi = api;
				representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
				var requiredParameter = representationHelper.tableRepresentation();
				requiredParameter.orderby = undefined;
				oTableRepresentation = _createTableRepresentationStub(requiredParameter, true, that.oGlobalApi);
				var oViewSetting = new sap.ui.view({
					id : "idViewSettingForAlternateTableOrderbyNotAvailable",
					type : sap.ui.core.mvc.ViewType.JS,
					viewName : "sap.apf.ui.reuse.view.viewSetting",
					viewData : {
						oTableInstance : oTableRepresentation
					}
				});
				oViewSettingsDialog = oViewSetting.getContent()[0];
				done();
			});
		},
		afterEach : function(assert) {
			sap.ui.getCore().byId("idViewSettingForAlternateTableOrderbyNotAvailable").destroy();
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When orderby is undefined", function(assert) {
		assert.strictEqual(oViewSettingsDialog.getSortItems().length, 3, "then three items available in the sort dialog");
		assert.deepEqual(oViewSettingsDialog.getSelectedSortItem(), null, "then no item is selected as the sort property");
		assert.strictEqual(oViewSettingsDialog.getSortDescending(), false, "then ascending is true by default");
	});
	QUnit.test("When orderby is undefined and set by the view settings dialog", function(assert) {
		//arrange
		var done = assert.async();
		oViewSettingsDialog.open();
		sinon.stub(oTableRepresentation.oApi, 'selectionChanged', selectionChangedStub);
		//act
		oViewSettingsDialog.setSelectedSortItem(oViewSettingsDialog.getSortItems()[0]);//change the sort property
		oViewSettingsDialog.setSortDescending(true);//change the sort order
		var oDialogInstance = _getDialogByEmptyTitle();
		oDialogInstance.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assert
		function selectionChangedStub(sortEvent) {
			var updatedSortProperty = _getSelectedSortItem(oViewSettingsDialog);
			assert.strictEqual(oTableRepresentation.resetPaginationCalled, true, "then resetPaginationForTable was called");
			assert.strictEqual(updatedSortProperty.property, "YearMonth", "then sort property is updated");
			assert.notEqual(updatedSortProperty, undefined, "then old sort property is different than updated sort property");
			assert.strictEqual(updatedSortProperty.ascending, false, "then sort order is updated");
			_destroyViewSettingDialog();
			oTableRepresentation.oApi.selectionChanged.restore();
			done();
		}
	});
	QUnit.test("When orderby is undefined and only the sort order is changed by the view settings dialog", function(assert) {
		var selectionChangedSpy = sinon.spy(oTableRepresentation.oApi, 'selectionChanged');
		oViewSettingsDialog.fireConfirm({
			sortItem: undefined,
			sortDescending: true
		});
		assert.strictEqual(selectionChangedSpy.called, false, "Then selectionChanged not called");
		selectionChangedSpy.restore();
	});
	QUnit.test("When orderby is undefined and set by the view settings dialog and cancel is pressed", function(assert) {
		oViewSettingsDialog.setSelectedSortItem(oViewSettingsDialog.getSortItems()[0]);
		oViewSettingsDialog.setSortDescending(true);
		oViewSettingsDialog.open();
		oViewSettingsDialog.fireCancel();
		sap.ui.getCore().applyChanges();
		assert.deepEqual(oViewSettingsDialog.bIsDestroyed, true, "Then view settings dialog is destroyed");
		assert.strictEqual(oTableRepresentation.oViewSettingsDialog, undefined, "Then reference in table is set to undefined");
	});
	QUnit.module("View Setting dialog for main table representation and alternate table - with one sort criterium", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(api) {
				that.oGlobalApi = api;
				representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
				that.requiredParameter = representationHelper.tableRepresentation();
				that.requiredParameter.orderby = [{
					"ascending" : false,
					"property" : "Revenue"
				}];
				oTableRepresentation = _createTableRepresentationStub(that.requiredParameter, true, that.oGlobalApi);
				var oViewSetting = new sap.ui.view({
					id : "idViewSettingForAlternateTableOrderbyNotAvailable",
					type : sap.ui.core.mvc.ViewType.JS,
					viewName : "sap.apf.ui.reuse.view.viewSetting",
					viewData : {
						oTableInstance : oTableRepresentation
					}
				});
				oViewSettingsDialog = oViewSetting.getContent()[0];
				done();
			});
		},
		afterEach : function(assert) {
			sap.ui.getCore().byId("idViewSettingForAlternateTableOrderbyNotAvailable").destroy();
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When orderby has one sort criterium", function(assert) {
		assert.strictEqual(oViewSettingsDialog.getSortItems().length, 3, "then three items available in the sort dialog");
		assert.strictEqual(oViewSettingsDialog.getSortItems()[2].mProperties.key, "Revenue", "then the property of this item is selected");
		assert.strictEqual(oViewSettingsDialog.getSortDescending(), true, "then the sort order of this item is selected.");
	});
	QUnit.test("When orderby has one sort criterium and is changed by the view settings dialog", function(assert) {
		//arrange
		var done = assert.async();
		oViewSettingsDialog.open(); //open the view setting dialog
		sinon.stub(oTableRepresentation.oApi, 'selectionChanged', selectionChangedStub);
		//act
		oViewSettingsDialog.setSelectedSortItem(oViewSettingsDialog.getSortItems()[0]);//change the sort property
		oViewSettingsDialog.setSortDescending(false);//change the sort order
		var oDialogInstance = _getDialogByEmptyTitle();
		oDialogInstance.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		var that = this;
		function selectionChangedStub(sortEvent) {
			var updatedSortProperty = _getSelectedSortItem(oViewSettingsDialog);
			assert.strictEqual(updatedSortProperty.property, "YearMonth", "then sort property is updated");
			assert.strictEqual(oTableRepresentation.resetPaginationCalled, true, "then resetPaginationForTable was called");
			assert.strictEqual(updatedSortProperty.ascending, true, "then sort order is updated");
			assert.notEqual(updatedSortProperty, that.requiredParameter.orderby[0], "then old sort property is different than updated sort property");
			_destroyViewSettingDialog();
			oTableRepresentation.oApi.selectionChanged.restore();
			done();
		}
	});
    QUnit.test("When orderby has one sort criterium and only the sort order is changed by the view settings dialog", function(assert) {
        var selectionChangedSpy = sinon.spy(oTableRepresentation.oApi, 'selectionChanged');
        oViewSettingsDialog.fireConfirm({
            sortItem: oViewSettingsDialog.getSortItems()[0],
            sortDescending: false
        });
        assert.strictEqual(selectionChangedSpy.called, true, "Then selectionChanged is called");
		assert.strictEqual(oTableRepresentation.resetPaginationCalled, true, "then resetPaginationForTable was called");
        selectionChangedSpy.restore();
    });
	QUnit.module("View Setting dialog for main table representation and alternate table - with more than one sort criterium", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(api) {
				that.oGlobalApi = api;
				representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
				var requiredParameter = representationHelper.tableRepresentation();
				requiredParameter.orderby = [{
					"ascending" : false,
					"property" : "Revenue"
				},
				{
					"ascending" : true,
					"property" : "DaysSalesOutstanding"
				}];
				oTableRepresentation = _createTableRepresentationStub(requiredParameter, true, that.oGlobalApi);
				var oViewSetting = new sap.ui.view({
					id : "idViewSettingForAlternateTableOrderbyNotAvailable",
					type : sap.ui.core.mvc.ViewType.JS,
					viewName : "sap.apf.ui.reuse.view.viewSetting",
					viewData : {
						oTableInstance : oTableRepresentation
					}
				});
				oViewSettingsDialog = oViewSetting.getContent()[0];
				done();
			});
		},
		afterEach : function(assert) {
			sap.ui.getCore().byId("idViewSettingForAlternateTableOrderbyNotAvailable").destroy();
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When orderby has more than one sort criteria", function(assert) {
		assert.strictEqual(oViewSettingsDialog.getSortItems().length, 3, "then three items available in the sort dialog");
		assert.deepEqual(oViewSettingsDialog.getSelectedSortItem(), null, "then no item is selected as the sort property");
		assert.strictEqual(oViewSettingsDialog.getSortDescending(), true, "then sort order of the first sort property is selected.");
	});
	QUnit.test("When orderby has more than one sort criterium and is changed by the view settings dialog", function(assert) {
		//arrange
		var done = assert.async();
		oViewSettingsDialog.open(); //open the view setting dialog
		sinon.stub(oTableRepresentation.oApi, 'selectionChanged', selectionChangedStub);
		//act
		oViewSettingsDialog.setSelectedSortItem(oViewSettingsDialog.getSortItems()[0]);//change the sort property
		oViewSettingsDialog.setSortDescending(false);//change the sort order
		var oDialogInstance = _getDialogByEmptyTitle();
		oDialogInstance.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		function selectionChangedStub(sortEvent) {
			var updatedSortProperty = _getSelectedSortItem(oViewSettingsDialog);
			assert.strictEqual(oTableRepresentation.resetPaginationCalled, true, "then resetPaginationForTable was called");
			assert.strictEqual(updatedSortProperty.property, "YearMonth", "then sort property is updated");
			assert.strictEqual(updatedSortProperty.ascending, true, "then sort order is updated");
			_destroyViewSettingDialog();
			oTableRepresentation.oApi.selectionChanged.restore();
			done();
		}
	});
    QUnit.test("When orderby is undefined and only the sort order is changed by the view settings dialog", function(assert) {
        var selectionChangedSpy = sinon.spy(oTableRepresentation.oApi, 'selectionChanged');
        oViewSettingsDialog.fireConfirm({
            sortItem: undefined,
            sortDescending: false
        });
        assert.strictEqual(selectionChangedSpy.called, false, "Then selectionChanged not called");
        selectionChangedSpy.restore();
    });
    QUnit.module("Multiple View Setting Dialogs", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(api) {
				that.oGlobalApi = api;
				representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
				//Create first table with view setting dialog
				that.requiredParameterOne = representationHelper.tableRepresentation();
				that.requiredParameterOne.orderby = [{
					"ascending" : false,
					"property" : "Revenue"
				}];
				that.oTableRepresentationOne = _createTableRepresentationStub(that.requiredParameterOne, true, that.oGlobalApi);
				var oViewSettingOne = new sap.ui.view({
					id : "idViewSettingForAlternateTableOrderbyNotAvailableOne",
					type : sap.ui.core.mvc.ViewType.JS,
					viewName : "sap.apf.ui.reuse.view.viewSetting",
					viewData : {
						oTableInstance : that.oTableRepresentationOne
					}
				});
				that.oViewSettingDialogOne = oViewSettingOne.getContent()[0];
				that.oTableRepresentationOne.oViewSettingDialog = that.oViewSettingDialogOne;
				//Create first table with view setting dialog
				that.requiredParameterTwo = representationHelper.tableRepresentation();
				that.requiredParameterTwo.orderby = [{
					"ascending" : false,
					"property" : "YearMonth"
				}];
				that.oTableRepresentationTwo = _createTableRepresentationStub(that.requiredParameterTwo, true, that.oGlobalApi);
				var oViewSettingTwo = new sap.ui.view({
					id : "idViewSettingForAlternateTableOrderbyNotAvailableTwo",
					type : sap.ui.core.mvc.ViewType.JS,
					viewName : "sap.apf.ui.reuse.view.viewSetting",
					viewData : {
						oTableInstance : that.oTableRepresentationTwo
					}
				});
				that.oViewSettingDialogTwo = oViewSettingTwo.getContent()[0];
				that.oTableRepresentationTwo.oViewSettingDialog = that.oViewSettingDialogTwo;
				done();
			});
		},
		afterEach : function(assert) {
			sap.ui.getCore().byId("idViewSettingForAlternateTableOrderbyNotAvailableOne").destroy();
			sap.ui.getCore().byId("idViewSettingForAlternateTableOrderbyNotAvailableTwo").destroy();
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("Update path is called when dialog one is switched to same sorting as dialog two", function(assert) {
		// There was a bug that in the _bIsSortoptionChanged function that the current sortoptions were compared with the previous sort options, of the last created ViewSettingsDialog
		//arrange
		var done = assert.async();
		var that = this;
		sinon.stub(that.oTableRepresentationOne.oApi, 'selectionChanged', selectionChangedStub);
		// Set previously stored values in second dialog (open and press ok)
		that.oViewSettingDialogTwo.open();
		var oDialogInstanceTwo = that.oViewSettingDialogTwo._getDialog();
		oDialogInstanceTwo.getBeginButton().firePress();
		//Change the sort options in first dialog to the same as in the second
		that.oViewSettingDialogOne.open();
		//Change sort property and sort order of first table
		that.oViewSettingDialogOne.setSelectedSortItem(that.oViewSettingDialogOne.getSortItems()[0]);
		that.oViewSettingDialogOne.setSortDescending(true);
		var oDialogInstanceOne = that.oViewSettingDialogOne._getDialog();
		oDialogInstanceOne.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		function selectionChangedStub(sortEvent) {
			var updatedSortProperty = _getSelectedSortItem(that.oViewSettingDialogOne);
			var sortPropertyTwo = _getSelectedSortItem(that.oViewSettingDialogTwo);
			assert.ok(true, "then selection changed on table one is called");
			assert.strictEqual(that.oTableRepresentationOne.resetPaginationCalled, true, "then resetPaginationForTable was called");
			assert.strictEqual(updatedSortProperty.property, "YearMonth", "then sort property is updated");
			assert.strictEqual(updatedSortProperty.ascending, false, "then sort order is updated");
			assert.strictEqual(updatedSortProperty.property, sortPropertyTwo.property, "then sort property is identical");
			assert.strictEqual(updatedSortProperty.descending, sortPropertyTwo.descending, "then sort order is identical");
			assert.notEqual(updatedSortProperty, that.requiredParameterOne.orderby[0], "then old sort property is different than updated sort property");
			_destroyViewSettingDialog();
			that.oTableRepresentationOne.oApi.selectionChanged.restore();
			done();
		}
	});
	QUnit.test("When cancel button is pressed on first view settings dialog", function(assert) {
		this.oViewSettingDialogOne.fireCancel();
		assert.ok(this.oViewSettingDialogOne.bIsDestroyed, "Then first view settings dialog destroyed");
		assert.strictEqual(this.oTableRepresentationOne.oViewSettingDialog, undefined, "Then reference to viewSettingsDialog is removed from first table");
		assert.notOk(this.oViewSettingDialogTwo.bIsDestroyed, "Then second view settings dialog is not destroyed");
		assert.strictEqual(this.oTableRepresentationTwo.oViewSettingDialog, this.oViewSettingDialogTwo, "Then reference to viewSettingsDialog still there in second table");
	});
}());