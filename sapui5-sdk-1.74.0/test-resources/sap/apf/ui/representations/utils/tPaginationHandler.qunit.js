jQuery.sap.registerModulePath('sap.apf.testhelper', '../../../testhelper');
jQuery.sap.require('sap.apf.ui.representations.RepresentationInterfaceProxy');
jQuery.sap.declare('test.sap.apf.ui.representations.utils.tPaginationHandler');
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.createUiApiAsPromise");
jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
jQuery.sap.require('sap.apf.testhelper.config.representationHelper');
jQuery.sap.require("sap.apf.ui.representations.utils.paginationHandler");
jQuery.sap.require("sap.apf.ui.representations.table");
(function() {
	'use strict';
	var representationHelper,
		oTableRepresentation,
		mainContent;
	function _getsampleMetadata() {
		return {
			getPropertyMetadata : representationHelper.setPropertyMetadataStub.call()
		};
	}
	function _getSampleData(oGlobalApi) {
		return sap.apf.testhelper.odata.getSampleService(oGlobalApi.oApi, 'sampleData');
	}
	//place the table on the DOM to perform the selection event
	function _placeTableAt(oDataTableScrollContainer) {
		var divToPlaceTable = document.createElement("div");
		divToPlaceTable.setAttribute('id', 'contentOfTable');
		divToPlaceTable.setAttribute('width', '1000px');
		document.body.appendChild(divToPlaceTable);
		oDataTableScrollContainer.placeAt("contentOfTable");
		sap.ui.getCore().applyChanges();
	}
	//fire the pagination
	function _firePagination(tableInstance) {
		tableInstance.setFirstVisibleRow(100);
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
	QUnit.module("Pagination Handler Tests of Paging Options", {});
	QUnit.test("When topN is defined for the table and it is lesser than the number of record in one page", function(assert) {
		//arrange
		var oPaginationHandler = new sap.apf.ui.representations.utils.PaginationHandler();
		var topN = 50;
		var expectedPagingOption = { // define the expected paging option
			inlineCount : false,
			top : 50,
			skip : 0
		};
		//act
		var oPagingOption = oPaginationHandler.getPagingOption(topN); // get the paging option
		//assert
		assert.deepEqual(oPagingOption, expectedPagingOption, "Then the top value should be the value which has been configured as the topN");
	});
	QUnit.test("When topN is defined for the table and it is greater than the number of data records in one page", function(assert) {
		//arrange
		var oPaginationHandler = new sap.apf.ui.representations.utils.PaginationHandler();
		
		var topN = 200;
		var expectedPagingOption = { // define the expected paging option
			inlineCount : false,
			top : 200,
			skip : 0
		};
		//act
		var oPagingOption = oPaginationHandler.getPagingOption(topN);// get the paging option
		var skip = oPaginationHandler.getPagingOption().skip;
		//assert
		assert.deepEqual(oPagingOption, expectedPagingOption, "Then the top value should be the value which is configured as top N for the table, number of records defined for one page must be ignored ");
		assert.strictEqual(skip, expectedPagingOption.skip, "Then the data to be skipped is returned correctly : " + skip);
	});
	QUnit.test("When topN is defined for the table and data is being fetched for the first time", function(assert) {
		//arrange
		var oPaginationHandler = new sap.apf.ui.representations.utils.PaginationHandler();
		
		var topN = 100;
		var expectedPagingOption = { // define the expected paging option
			inlineCount : false,
			top : 100,
			skip : 0
		};
		//act
		var oPagingOption = oPaginationHandler.getPagingOption(topN); // get the paging option
		//assert
		assert.deepEqual(oPagingOption, expectedPagingOption, "Then the top value should be the value which has been configured as the topN");
	});
	QUnit.test("When reset paging option is called", function(assert) {
		//arrange
		var oPaginationHandler = new sap.apf.ui.representations.utils.PaginationHandler();
		
		var expectedPagingOption = { // define the expected paging option
			inlineCount : true,
			top : 100,
			skip : 0
		};
		//act
		oPaginationHandler.resetPaginationOption(); // reset the paging option
		var oPagingOption = oPaginationHandler.getPagingOption(); // get the paging option
		//assert
		assert.deepEqual(oPagingOption, expectedPagingOption, "Then the paging option is reset to default");
	});
	QUnit.module("Pagination Handler Tests- When pagination is triggered", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(api) {
				that.oGlobalApi = api;
				representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
				var requiredParameter = representationHelper.representationDataWithDimension();
				var interfaceProxy = new sap.apf.ui.representations.RepresentationInterfaceProxy(that.oGlobalApi.oCoreApi, that.oGlobalApi.oUiApi);
				oTableRepresentation = new sap.apf.ui.representations.table(interfaceProxy, requiredParameter);
				oTableRepresentation.setData(_getSampleData(that.oGlobalApi).slice(0, 100), _getsampleMetadata(),
					_getSampleData(that.oGlobalApi).length);
				mainContent = oTableRepresentation.getMainContent("Table With Filter", 100, 100);
				var getActiveStepStub = function() {
					this.getSelectedRepresentation = function() {
						return {
							bIsAlternateView : false
						};
					};
					return undefined;
				};
				sinon.stub(oTableRepresentation.oApi, "getActiveStep", getActiveStepStub);
				done();
			});
		},
		afterEach : function(assert) {
			mainContent.destroy();
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When the pagination is triggered on the table and orderby is not changed", function(assert) {
		//arrange
		var done = assert.async();
		var pagingOption, oRequestOption;
		var spyMarkSelectionInTable = sinon.spy(oTableRepresentation, "markSelectionInTable");
		var spyOnResetPagination = sinon.spy(oTableRepresentation, "resetPaginationForTable");
		var updatePathStub = sinon.stub(oTableRepresentation.oApi, 'updatePath', updatePath);
		_placeTableAt(mainContent);
		//act
		oTableRepresentation.oPaginationHandler.attachPaginationOnTable(oTableRepresentation); // attach the pagination event
		pagingOption = oTableRepresentation.oPaginationHandler.getPagingOption();
		//assert
		assert.strictEqual(pagingOption.top, 100, "Then Top in 100 intially");
		assert.strictEqual(pagingOption.skip, 0, "Then skip in 0 intially");
		//asserts are placed inside the stub because there is no event which is available on the scroll container after scroll is finished
		_firePagination(oTableRepresentation.tableControl);
		function updatePath(fnStepProcessedCallback) {
			setTimeout(function(){ // put response in a timeout so we can check if the update path was called only once
				fnStepProcessedCallback();
				assert.strictEqual(updatePathStub.callCount, 1, "Update path only called once");
				assert.strictEqual(spyOnResetPagination.calledOnce, false, "then resetPaginationOption is not called for the table request");
				assert.strictEqual(spyMarkSelectionInTable.called, true, "then spyMarkSelectionInTable is called when sort property is changed");
				oRequestOption = oTableRepresentation.getRequestOptions();
				pagingOption = oTableRepresentation.oPaginationHandler.getPagingOption();
				assert.deepEqual(oRequestOption.orderby, [], "then correct orderby is set to the request option on table");
				assert.deepEqual(oRequestOption.paging, pagingOption, "then correct paging is set to the request option on table");
				assert.equal(pagingOption.top, 99, "Then top value is updated and 99 values are fetched");
				assert.notEqual(pagingOption.top, 0, "Then top value is not zero");
				assert.notEqual(pagingOption.skip, 10, "Then skip value is updated");
				updatePathStub.restore();
				oTableRepresentation.oApi.getActiveStep.restore();
				document.body.removeChild(document.getElementById('contentOfTable'));
				oTableRepresentation.destroy();
				spyOnResetPagination.restore();
				done();
			}, 50);
		}
	});
	QUnit.test("When the pagination is triggered on the table and orderby is changed", function(assert) {
		//arrange
		var done = assert.async();
		var pagingOption, oRequestOption;
		var pagingDone;
		var spyOnResetPagination = sinon.spy(oTableRepresentation, "resetPaginationForTable");
		_placeTableAt(mainContent);
		var oExpectedSortOption = {
			ascending : true,
			property : "DaysSalesOutstanding"
		};
		sinon.stub(oTableRepresentation.oApi, 'updatePath', updatePathStub);
		sinon.stub(oTableRepresentation.oApi, 'selectionChanged', selectionChangedStub);
		//act
		oTableRepresentation.oPaginationHandler.attachPaginationOnTable(oTableRepresentation); // attach the pagination event
		pagingOption = oTableRepresentation.oPaginationHandler.getPagingOption();
		assert.strictEqual(pagingOption.top, 100, "Then Top is 100 intially");
		assert.strictEqual(pagingOption.skip, 0, "Then skip is 0 intially");
		_firePagination(oTableRepresentation.tableControl);
		sap.ui.getCore().applyChanges();
		//assert
		function updatePathStub(){
			if(!pagingDone){
				pagingDone = true;
				pagingOption = oTableRepresentation.oPaginationHandler.getPagingOption();
				assert.strictEqual(pagingOption.top, 99, "Then Top is 99 after paging");
				assert.strictEqual(pagingOption.skip, 100, "Then skip is 100 after paging");
				var oViewSettingsDialog = oTableRepresentation.getViewSettingDialog();
				oViewSettingsDialog.open();
				oViewSettingsDialog.setSelectedSortItem(oViewSettingsDialog.getSortItems()[1]);//change the sort property
				var oDialogInstance = _getDialogByEmptyTitle();
				oDialogInstance.getBeginButton().firePress();
				sap.ui.getCore().applyChanges();
			}
		}
		function selectionChangedStub(sortEvent) {
			oRequestOption = oTableRepresentation.getRequestOptions();
			pagingOption = oTableRepresentation.oPaginationHandler.getPagingOption();
			assert.strictEqual(spyOnResetPagination.calledOnce, true, "then resetPaginationOption is called");
			assert.deepEqual(oRequestOption.orderby, [ oExpectedSortOption ], "then correct orderby is set to the request option on table");
			assert.deepEqual(oRequestOption.paging, pagingOption, "then correct paging is set to the request option on table");
			assert.equal(pagingOption.top, 100, "Then top value is reset");
			assert.equal(pagingOption.skip, 0, "Then skip value is reset");
			_destroyViewSettingDialog();
			oTableRepresentation.oApi.selectionChanged.restore();
			oTableRepresentation.oApi.getActiveStep.restore();
			document.body.removeChild(document.getElementById('contentOfTable'));
			oTableRepresentation.destroy();
			spyOnResetPagination.restore();
			done();
		}
	});
})();
