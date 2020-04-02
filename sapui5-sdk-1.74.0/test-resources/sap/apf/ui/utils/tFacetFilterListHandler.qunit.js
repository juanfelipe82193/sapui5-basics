/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.declare('sap.apf.ui.utils.tFacetFilterListHandler');
jQuery.sap.require('sap.apf.ui.utils.facetFilterListHandler');
(function() {
	'use strict';
	function doNothing() {
	}
	//Start filter functions for start date filter
	function getLabelForStartDate() {
		return {
			"type" : "label",
			"kind" : "text",
			"key" : "StartDate"
		};
	}
	function getPropertyNameForStartDate() {
		return "StartDate";
	}
	function getMetadataForStartDate() {
		var oDeferredMetadata = jQuery.Deferred();
		var oPropertyMetadata = {
			"name" : "StartDate",
			"dataType" : {
				"type" : "Edm.String",
				"maxLength" : "8"
			},
			"label" : "Start Date",
			"aggregation-role" : "dimension",
			"isCalendarDate" : "true"
		};
		oDeferredMetadata.resolve(oPropertyMetadata);
		return oDeferredMetadata.promise();
	}
	function getValuesForStartDate() {
		var oDeferredValues = jQuery.Deferred();
		var aFilterValues = [ {
			"StartDate" : "20000101"
		}, {
			"StartDate" : "20000201"
		} ];
		oDeferredValues.resolve(aFilterValues);
		return oDeferredValues.promise();
	}
	function commonSetup(context){
		//Stub for getSelectedValues() start date filter
		var getSelectedValuesStub = sinon.stub();
		//Deferred object for getSelectedValues() for start date filter
		var oDeferredSelectedValues1 = jQuery.Deferred();
		var aSelectedFilterValues1 = [ "20000101" ];
		context.oNewPromiseForStartDateSelectedValues = jQuery.Deferred();
		oDeferredSelectedValues1.resolve(aSelectedFilterValues1, context.oNewPromiseForStartDateSelectedValues.promise());
		//Different values returned based on the call count
		getSelectedValuesStub.onFirstCall().returns(oDeferredSelectedValues1.promise());
		//oCoreApi stub
		context.createMessageObjectSpy = sinon.spy();
		context.putMessageSpy = sinon.spy();
		var oCoreApi = {
			getTextNotHtmlEncoded : function(textObject){return textObject.key;},
			createMessageObject : context.createMessageObjectSpy,
			putMessage: context.putMessageSpy
		};
		//oUiApi stub
		var oUiApi = {
			getEventCallback : doNothing,
			getCustomFormatExit : doNothing,
			selectionChanged : doNothing
		};
		//Start filter and its functions
		context.oConfiguredFilter = {
			getLabel : getLabelForStartDate,
			getPropertyName : getPropertyNameForStartDate,
			getAliasNameIfExistsElsePropertyName : doNothing,
			getMetadata : getMetadataForStartDate,
			getValues : getValuesForStartDate,
			getSelectedValues : getSelectedValuesStub,
			setSelectedValues : sinon.spy(),
			isMultiSelection: function(){
				return context.multiSelection || false;
			},
			hasValueHelpRequest : function(){
				return context.hasValueHelpRequest || false;
			}
		};
		context.ffListHandler = new sap.apf.ui.utils.FacetFilterListHandler(oCoreApi, oUiApi, context.oConfiguredFilter);
	}
	QUnit.module("CreateFacetFilterList", {
		beforeEach : function() {
			commonSetup(this);
		}
	});
	QUnit.test("List has correct properties", function(assert){
		var facetFilterList = this.ffListHandler.createFacetFilterList();
		assert.strictEqual(facetFilterList.getTitle(), "StartDate", "Title is correct");
		assert.strictEqual(facetFilterList.getKey(), "StartDate", "Key is correct");
		assert.strictEqual(facetFilterList.getMultiSelect(), false, "List is not multiselect");
		assert.strictEqual(facetFilterList.getGrowing(), true, "List is growable");
	});
	QUnit.test("List is multiselect", function(assert){
		this.multiSelection = true;
		var facetFilterList = this.ffListHandler.createFacetFilterList();
		assert.strictEqual(facetFilterList.getMultiSelect(), true, "List is multiselect");
	});
	QUnit.module("ModelHandling", {
		beforeEach : function() {
			commonSetup(this);
		}
	});
	QUnit.test("Get Facet Filter List data", function(assert) {
		//act
		var oFacetFilterListDataPromise = this.ffListHandler.getFacetFilterListData();
		oFacetFilterListDataPromise.then(function(aFilterValues, sSelectProperty, oPropertyMetadata) {
			//arrangement
			var	aExpectedValues = [ {
					"StartDate" : "20000101"
				}, {
					"StartDate" : "20000201"
				} ];
			//assert
			assert.deepEqual(aFilterValues, aExpectedValues, "then filter values returned as expected");
			assert.strictEqual(sSelectProperty, "StartDate", "then selectProperty returned as expected");
		});
	});
	QUnit.test("Get selected facet filter list values", function(assert) {
		//act
		var oSelectedValueDataPromise = this.ffListHandler.getSelectedFFValues();
		oSelectedValueDataPromise.then(function(oValues) {
			//arrangement
			var oExpectedValues = {
				aSelectedFilterValues : [ "20000101" ],
				oFilterRestrictionPropagationPromiseForSelectedValues : this.oNewPromiseForStartDateSelectedValues.promise()
			};
			//assert
			assert.deepEqual(oValues, oExpectedValues, "then selected filter values data and new promise returned as expected");
		}.bind(this));
	});
	QUnit.test("Set selected values on filter", function(assert) {
		//arrangement
		var aSelectedFilterValues = [ "20000201" , "20000102"];
		//act
		this.ffListHandler.setSelectedFFValues(aSelectedFilterValues);
		//assert
		assert.equal(this.oConfiguredFilter.setSelectedValues.calledOnce, true, "then setSelectedValues is called once");
		assert.deepEqual(this.oConfiguredFilter.setSelectedValues.getCall(0).args[0], aSelectedFilterValues, "then setSelectedValues is called with selectedFilterValues");
	});
	QUnit.module("Get Values at startup", {
		beforeEach : function() {
			commonSetup(this);
			var that = this;
			this.getValuesCounter = 0;
			this.getSelectedValuesCounter = 0;
			this.oConfiguredFilter.getValues = function(){
				that.getValuesCounter++;
				that.getValuesPromise = jQuery.Deferred();
				return that.getValuesPromise;
			};
			this.oConfiguredFilter.getSelectedValues = function(){
				that.getSelectedValuesCounter++;
				that.getSelectedValuesPromise = jQuery.Deferred();
				return that.getSelectedValuesPromise;
			};
			this.oConfiguredFilter.getMetadata = function(){
				return jQuery.Deferred().resolve({});
			};
		}
	});
	QUnit.test("Facet Filter List that has no value help request configured and no selected values", function (assert) {
		this.hasValueHelpRequest = false;
		var facetFilterList = this.ffListHandler.createFacetFilterList();
		assert.strictEqual(this.getValuesCounter, 1 , "GetValues called once");
		assert.strictEqual(this.getSelectedValuesCounter, 1 , "GetSelectedValues called once");
		this.getValuesPromise.resolve([{
			StartDate: "ValueA"
		},{
			StartDate: "ValueB"
		}]);
		this.getSelectedValuesPromise.resolve([], jQuery.Deferred());
		assert.strictEqual(this.getValuesCounter, 1 , "GetValues not called when selected values is resolved");
		facetFilterList.fireListOpen();
		assert.strictEqual(facetFilterList.getBusy(), true , "FacetFilterList is set to busy");
		assert.strictEqual(this.getValuesCounter, 2 , "GetValues called when list is opened");
		this.getValuesPromise.resolve([{
			StartDate: "ValueA"
		},{
			StartDate: "ValueB"
		}]);
		assert.strictEqual(facetFilterList.getBusy(), false , "FacetFilterList is not busy anymore");
		assert.strictEqual(facetFilterList.getItems().length, 2 , "FacetFilterList has two items");
		assert.strictEqual(facetFilterList.getSelectedItems().length, 0 , "FacetFilterList has no selected item");
	});
	QUnit.test("Facet Filter List that has no value help request configured and selected values", function (assert) {
		this.hasValueHelpRequest = false;
		var facetFilterList = this.ffListHandler.createFacetFilterList();
		assert.strictEqual(this.getValuesCounter, 1 , "GetValues called once");
		assert.strictEqual(this.getSelectedValuesCounter, 1 , "GetSelectedValues called once");
		this.getValuesPromise.resolve([{
			StartDate: "ValueA"
		},{
			StartDate: "ValueB"
		}]);
		this.getSelectedValuesPromise.resolve(["ValueA"], jQuery.Deferred());
		assert.strictEqual(this.getValuesCounter, 2 , "GetValues called when selected values is resolved");
		this.getValuesPromise.resolve([{
			StartDate: "ValueA"
		},{
			StartDate: "ValueB"
		}]);
		facetFilterList.fireListOpen();
		assert.strictEqual(this.getValuesCounter, 3 , "GetValues called when list is opened");
		this.getValuesPromise.resolve([{
			StartDate: "ValueA"
		},{
			StartDate: "ValueB"
		}]);
		assert.strictEqual(facetFilterList.getItems().length, 2 , "FacetFilterList has two items");
		assert.strictEqual(facetFilterList.getSelectedItems().length, 1 , "FacetFilterList has one selected item");
	});
	QUnit.test("Facet Filter List that has a value help request configured and no selected values", function (assert) {
		this.hasValueHelpRequest = true;
		var facetFilterList = this.ffListHandler.createFacetFilterList();
		assert.strictEqual(this.getValuesCounter, 0 , "GetValues not called");
		assert.strictEqual(this.getSelectedValuesCounter, 1 , "GetSelectedValues called once");
		this.getSelectedValuesPromise.resolve([], jQuery.Deferred());
		assert.strictEqual(this.getValuesCounter, 0 , "GetValues not called when selected values is resolved");
		facetFilterList.fireListOpen();
		assert.strictEqual(this.getValuesCounter, 1 , "GetValues called when opening the list");
		this.getValuesPromise.resolve([{
			StartDate: "ValueA"
		},{
			StartDate: "ValueB"
		}]);
		assert.strictEqual(facetFilterList.getItems().length, 2 , "FacetFilterList has two items");
		assert.strictEqual(facetFilterList.getSelectedItems().length, 0 , "FacetFilterList has no selected item");
	});
	QUnit.test("Facet Filter List that has a value help request configured and  selected values", function (assert) {
		this.hasValueHelpRequest = true;
		var facetFilterList = this.ffListHandler.createFacetFilterList();
		assert.strictEqual(this.getValuesCounter, 0 , "GetValues not called");
		assert.strictEqual(this.getSelectedValuesCounter, 1 , "GetSelectedValues called once");
		this.getSelectedValuesPromise.resolve(["ValueA"], jQuery.Deferred());
		assert.strictEqual(this.getValuesCounter, 1 , "GetValues called when selected values is resolved");
		this.getValuesPromise.resolve([{
			StartDate: "ValueA"
		},{
			StartDate: "ValueB"
		}]);
		facetFilterList.fireListOpen();
		assert.strictEqual(this.getValuesCounter, 2 , "GetValues called when opening the list");
		this.getValuesPromise.resolve([{
			StartDate: "ValueA"
		},{
			StartDate: "ValueB"
		}]);
		assert.strictEqual(facetFilterList.getItems().length, 2 , "FacetFilterList has two items");
		assert.strictEqual(facetFilterList.getSelectedItems().length, 1 , "FacetFilterList has one selected item");
	});
	QUnit.test("Given a Facet Filter List that has no value help request, when promise resolved with empty value list", function (assert) {
		this.hasValueHelpRequest = false;
		var facetFilterList = this.ffListHandler.createFacetFilterList();
		assert.strictEqual(this.getValuesCounter, 1 , "GetValues is called to determine if list should be shown");
		assert.strictEqual(this.getSelectedValuesCounter, 1 , "GetSelectedValues is called to register promise chain");
		this.getValuesPromise.resolve([]);
		assert.strictEqual(facetFilterList.getItems().length, 0 , "FacetFilterList has no items");
		assert.strictEqual(facetFilterList.getActive(), false , "FacetFilterList is inactive");
		assert.strictEqual(this.createMessageObjectSpy.callCount, 1, "CreateMessageObject Called");
		assert.strictEqual(this.createMessageObjectSpy.getCall(0).args[0].code, "6010", "CreateMessageObject Called with correct messageCode");
		assert.strictEqual(this.createMessageObjectSpy.getCall(0).args[0].aParameters[0], "StartDate", "CreateMessageObject Called with correct parameter");
		assert.strictEqual(this.putMessageSpy.callCount, 1, "PutMessage called");
	});
	QUnit.module("Facet Filter onListOpen", {
		beforeEach : function() {
			commonSetup(this);
			var that = this;
			this.getValuesCounter = 0;
			this.getSelectedValuesCounter = 0;
			this.oConfiguredFilter.getValues = function(){
				that.getValuesCounter++;
				that.getValuesPromise = jQuery.Deferred();
				return that.getValuesPromise;
			};
			this.oConfiguredFilter.getSelectedValues = function(){
				that.getSelectedValuesCounter++;
				that.getSelectedValuesPromise = jQuery.Deferred();
				return that.getSelectedValuesPromise;
			};
			this.oConfiguredFilter.getMetadata = function(){
				return jQuery.Deferred().resolve({});
			};
		}
	});
	QUnit.test("Given a facetFilterList with two values, when get values is resolved with no values", function (assert) {
		//Arrangement
		this.hasValueHelpRequest = true;
		var facetFilterList = this.ffListHandler.createFacetFilterList();
		facetFilterList.fireListOpen();
		this.getValuesPromise.resolve([{
			StartDate: "ValueA"
		},{
			StartDate: "ValueB"
		}]);
		assert.strictEqual(this.getValuesCounter, 1 , "GetValues called when opening the list");
		assert.strictEqual(facetFilterList.getItems().length, 2 , "FacetFilterList has two items");

		//act
		facetFilterList.fireListOpen();
		this.getValuesPromise.resolve([]);
		assert.strictEqual(this.getValuesCounter, 2 , "GetValues called when opening the list");
		assert.strictEqual(facetFilterList.getItems().length, 0 , "FacetFilterList has no items");
	});
	QUnit.test("Facet Filter with integer values", function(assert) {
		this.hasValueHelpRequest = true;
		var facetFilterList = this.ffListHandler.createFacetFilterList();
		var secondSelectedValues = jQuery.Deferred();
		this.getSelectedValuesPromise.resolve([2013], secondSelectedValues);
		assert.strictEqual(this.getValuesCounter, 1, "Get Values was called");
		this.getValuesPromise.resolve([{
			StartDate : 2014
		},{
			StartDate : 2013
		}]);
		assert.deepEqual(facetFilterList.getSelectedKeys(), {"2013" : "2013"}, "Correct Date is initially selected");
		facetFilterList.fireListOpen();
		assert.strictEqual(this.getValuesCounter, 2, "Get Values was called");
		this.getValuesPromise.resolve([{
			StartDate : 2014
		},{
			StartDate : 2013
		}]);
		assert.deepEqual(facetFilterList.getSelectedKeys(), {"2013" : "2013"}, "After opening the list, the selected values are still correct");
		this.oConfiguredFilter.setSelectedValues = function(values){
			var thirdSelectedValues = jQuery.Deferred();
			secondSelectedValues.resolve(values, thirdSelectedValues);
		};
		facetFilterList.fireListClose();
		assert.strictEqual(this.getValuesCounter, 3, "Get Values was called");
		this.getValuesPromise.resolve([{
			StartDate : 2014
		},{
			StartDate : 2013
		}]);
		assert.deepEqual(facetFilterList.getSelectedKeys(), {"2013" : "2013"}, "After closing the list the correct date is still selected");
	});
	QUnit.test("Facet Filter with integer values and changing the selection", function(assert) {
		this.hasValueHelpRequest = true;
		var facetFilterList = this.ffListHandler.createFacetFilterList();
		var secondSelectedValues = jQuery.Deferred();
		this.getSelectedValuesPromise.resolve([2013], secondSelectedValues);
		assert.strictEqual(this.getValuesCounter, 1, "Get Values was called");
		this.getValuesPromise.resolve([{
			StartDate : 2014
		},{
			StartDate : 2013
		}]);
		assert.deepEqual(facetFilterList.getSelectedKeys(), {"2013" : "2013"}, "Correct Date is initially selected");
		facetFilterList.fireListOpen();
		assert.strictEqual(this.getValuesCounter, 2, "Get Values was called");
		this.getValuesPromise.resolve([{
			StartDate : 2014
		},{
			StartDate : 2013
		}]);
		assert.deepEqual(facetFilterList.getSelectedKeys(), {"2013" : "2013"}, "After opening the list the correct date is still selected");
		this.oConfiguredFilter.setSelectedValues = function(values){
			var thirdSelectedValues = jQuery.Deferred();
			secondSelectedValues.resolve(values, thirdSelectedValues);
		};
		facetFilterList.setSelectedKeys({"2014" : "2014"});
		facetFilterList.fireListClose();
		assert.strictEqual(this.getValuesCounter, 3, "Get Values was called");
		this.getValuesPromise.resolve([{
			StartDate : 2014
		},{
			StartDate : 2013
		}]);
		assert.deepEqual(facetFilterList.getSelectedKeys(), {"2014" : "2014"}, "After closing the list the new date is selected");
	});
}());
