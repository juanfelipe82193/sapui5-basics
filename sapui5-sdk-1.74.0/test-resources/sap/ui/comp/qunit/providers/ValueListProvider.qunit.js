/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/providers/ValueListProvider",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/MultiInput",
	"sap/m/MultiComboBox",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/library"
], function(ValueListProvider, Text, Input, MultiInput, MultiComboBox, ODataModel, SmartField, library) {
	"use strict";

	var DisplayBehaviour = library.smartfilterbar.DisplayBehaviour;

	QUnit.module("sap.ui.comp.providers.ValueListProvider", {
		beforeEach: function() {
			this.oAnnotation = {valueListEntitySetName:"Chuck",keyField:"TheKey",descriptionField:"Desc",keys:["TheKey"],valueListFields:[{name:"TheKey"},{name:"Desc"}]};
			this.oModel = sinon.createStubInstance(ODataModel);
			this.oValueListProvider = new ValueListProvider({control: sinon.createStubInstance(MultiComboBox), aggregation:"items",annotation:this.oAnnotation,model:this.oModel,typeAheadEnabled:false});
		},
		afterEach: function() {
			this.oValueListProvider.destroy();
			this.oValueListProvider = null;
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oValueListProvider);
	});

	QUnit.test("Shall have an instance of oDataModel", function(assert) {
		assert.ok(this.oValueListProvider.oODataModel);
	});

	QUnit.test("Shall call addEventDelegate onInitialise of drop downs", function(assert) {
		assert.strictEqual(this.oValueListProvider.oControl.addEventDelegate.calledOnce,true);
	});

	QUnit.test("Shall call bindAggrgation/_fetchData once control is rendered", function(assert) {
		var oDelegate;
		sinon.spy(this.oValueListProvider,"_fetchData");
		oDelegate = this.oValueListProvider.oControl.addEventDelegate.args[0][0];
		oDelegate.onAfterRendering.call(this.oValueListProvider);
		assert.strictEqual(this.oValueListProvider.oControl.bindAggregation.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._fetchData.calledOnce,true);
		assert.strictEqual(this.oValueListProvider.oControl.removeEventDelegate.calledOnce,true);
	});

	QUnit.test("Shall create sorter for id based DDLBs", function(assert) {
		assert.ok(!this.oValueListProvider._oSorter);

		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.idOnly;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(this.oValueListProvider._oSorter);
		assert.strictEqual(this.oValueListProvider._oSorter.sPath,this.oValueListProvider.sKey);

		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.descriptionOnly;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(this.oValueListProvider._oSorter);
		assert.strictEqual(this.oValueListProvider._oSorter.sPath,this.oValueListProvider.sDescription);
	});

	QUnit.test("Shall not create sorter for id based DDLBs but one for Description", function(assert) {
		this.oValueListProvider.oPrimaryValueListAnnotation.valueListFields[0].sortable = false;
		this.oValueListProvider.oPrimaryValueListAnnotation.valueListFields[1].sortable = true;

		assert.ok(!this.oValueListProvider._oSorter);

		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.idOnly;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(!this.oValueListProvider._oSorter);

		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.descriptionOnly;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(this.oValueListProvider._oSorter);
		assert.strictEqual(this.oValueListProvider._oSorter.sPath,this.oValueListProvider.sDescription);
	});

	QUnit.test("Shall not create sorter for id nor description based DDLBs", function(assert) {
		this.oValueListProvider.oPrimaryValueListAnnotation.valueListFields[0].sortable = false;
		this.oValueListProvider.oPrimaryValueListAnnotation.valueListFields[1].sortable = false;

		assert.ok(!this.oValueListProvider._oSorter);

		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.idOnly;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(!this.oValueListProvider._oSorter);

		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.descriptionOnly;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(!this.oValueListProvider._oSorter);
	});

	QUnit.test("it should destroy the item template", function(assert) {

		// arrange
		this.oValueListProvider._createDropDownTemplate();
		var oTemplateDestroySpy = sinon.spy(this.oValueListProvider._oTemplate, "destroy");

		// act
		this.oValueListProvider.destroy();

		// assert
		assert.strictEqual(oTemplateDestroySpy.callCount, 1);
		assert.strictEqual(this.oValueListProvider._oTemplate, null);
	});

	QUnit.module("sap.ui.comp.providers.ValueListProvider (typeAhead)", {
		beforeEach: function() {
			this.oAnnotation = {valueListEntitySetName:"Chuck",keyField:"TheKey",descriptionField:"Desc",keys:["TheKey"],valueListFields:[{name:"TheKey"},{name:"Desc"}]};
			this.oModel = sinon.createStubInstance(ODataModel);
			this.oValueListProvider = new ValueListProvider({control: sinon.createStubInstance(MultiInput), aggregation:"suggestionItems", annotation:this.oAnnotation, model:this.oModel, typeAheadEnabled:true});
		},
		afterEach: function() {
			this.oValueListProvider.destroy();
			this.oValueListProvider = null;
			delete this.oAnnotation;
			this.oModel.destroy();
			this.oModel = null;
		}
	});

	QUnit.test("Shall call attachSuggest once on initialise if type Ahead is enabled", function(assert) {
		assert.strictEqual(this.oValueListProvider.oControl.attachSuggest.calledOnce,true);
	});

	QUnit.test("suggest shall trigger _fetchData", function(assert) {
		var fSuggest = null,oEvent = {getParameter:sinon.stub(), getSource: sinon.stub()}, sInput = "test";
		oEvent.getParameter.returns(sInput);
		oEvent.getSource.returns(this.oValueListProvider.oControl);
		assert.strictEqual(this.oValueListProvider.oControl.attachSuggest.calledOnce,true);
		sinon.spy(this.oValueListProvider,"_fetchData");
		fSuggest = this.oValueListProvider.oControl.attachSuggest.args[0][0];
		//Trigger Suggest
		fSuggest(oEvent);

		assert.strictEqual(this.oValueListProvider._fetchData.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._fetchData.calledWith(sInput),true);
	});

	QUnit.test("_fetchData shall use the Search Text and Search-focus if basic search and type ahead is enabled", function(assert) {
		this.oValueListProvider.bSupportBasicSearch = true;
		this.oValueListProvider._fetchData("SomeSearchText");
		var args = this.oValueListProvider.oControl.bindAggregation.args[0];
		var custom = args[1].parameters["custom"];
		assert.strictEqual(custom["search"],"SomeSearchText");
		assert.strictEqual(custom["search-focus"],"TheKey");
	});

	QUnit.test("Search Text shall be converted to UpperCase according to displayFormat", function(assert) {
		this.oValueListProvider.bSupportBasicSearch = true;
		this.oValueListProvider.sDisplayFormat = "UpperCase";
		this.oValueListProvider._fetchData("UpperCase");
		var args = this.oValueListProvider.oControl.bindAggregation.args[0];
		var custom = args[1].parameters["custom"];
		assert.strictEqual(custom["search"],"UPPERCASE");
		assert.strictEqual(custom["search-focus"],"TheKey");
	});

	QUnit.test("Search Text with maxLength", function(assert) {
		sinon.spy(this.oValueListProvider,"_truncateSearchText");

		this.oValueListProvider.bSupportBasicSearch = false;
		this.oValueListProvider._fieldViewMetadata = {};
		this.oValueListProvider._fieldViewMetadata.maxLength = "1";
		this.oValueListProvider._fetchData("123");

		assert.strictEqual(this.oValueListProvider._truncateSearchText.calledOnce,true, "_truncateSearchText called once");
		assert.strictEqual(this.oValueListProvider._truncateSearchText.returned("1"),true, "_truncateSearchText returned truncated value '1'");
	});

	QUnit.test("MultiInput - addValidator shall trigger select and create token via asyncCallback with the suggestionRow", function(assert) {
		var fValidate = null, fAsyncCallback = sinon.stub(),
			oMockRow = {TheKey:"key",Desc:"description"},
			getObjectStub = sinon.stub().returns(oMockRow),
			oSuggestionRow = {
				getBindingContext: function () {
					return {
						getObject: getObjectStub
					};
				}
			},
			sInput = "foo";

		assert.strictEqual(this.oValueListProvider.oControl.addValidator.calledOnce,true);
		fValidate  = this.oValueListProvider.oControl.addValidator.args[0][0];
		sinon.spy(this.oValueListProvider,"_calculateAndSetFilterOutputData");
		assert.strictEqual(getObjectStub.calledOnce,false, "data of the row is not retrieved initially");

		//Trigger the validation
		fValidate({suggestionObject: oSuggestionRow, text: sInput, asyncCallback: fAsyncCallback});

		assert.strictEqual(getObjectStub.calledOnce,true, "data of the row is retrieved");
		assert.strictEqual(this.oValueListProvider.oODataModel.read.calledOnce,false, "no oData request is made");
		assert.strictEqual(this.oValueListProvider._calculateAndSetFilterOutputData.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._calculateAndSetFilterOutputData.calledWith([oMockRow]),true);
		assert.strictEqual(fAsyncCallback.calledOnce,true);
		//assert.strictEqual(this.oValueListProvider.oControl.setValue.calledOnce,true);
		//assert.strictEqual(this.oValueListProvider.oControl.setValue.calledWith(""),true);
	});

	QUnit.test("MultiInput - addValidator shall trigger backend validation and create token (via asyncCallback) with typed in text if no suggestionRow is present", function(assert) {
		var fValidate = null, fAsyncCallback = sinon.stub(), oSuggestionRow = null, sInput = "foo";
		var oMockRow = {TheKey:"key",Desc:"description"};
		var oBackendRequest = null;
		assert.strictEqual(this.oValueListProvider.oControl.addValidator.calledOnce,true);
		fValidate  = this.oValueListProvider.oControl.addValidator.args[0][0];
		sinon.stub(this.oValueListProvider,"_calculateAndSetFilterOutputData");
		sinon.stub(this.oValueListProvider,"_calculateFilterInputData");
		//Trigger the validation
		fValidate({suggestionObject: oSuggestionRow, text: sInput, asyncCallback: fAsyncCallback});
		assert.strictEqual(this.oValueListProvider.oODataModel.getData.calledOnce,false);
		assert.strictEqual(this.oValueListProvider.oODataModel.read.calledOnce,true);
		assert.strictEqual(this.oValueListProvider.oControl.__bValidatingToken,true);

		oBackendRequest = this.oValueListProvider.oODataModel.read.args[0][1];

		//Tigger success call
		oBackendRequest.success({results:[oMockRow]},{});

		assert.strictEqual(this.oValueListProvider._calculateAndSetFilterOutputData.calledWith([oMockRow]),true);
		assert.strictEqual(fAsyncCallback.calledOnce,true);
		//assert.strictEqual(this.oValueListProvider.oControl.setValue.calledOnce,true);
		//assert.strictEqual(this.oValueListProvider.oControl.setValue.calledWith(""),true);
		assert.strictEqual(this.oValueListProvider.oControl.__bValidatingToken,undefined);
	});

	QUnit.module("sap.ui.comp.providers.ValueListProvider (typeAhead - single Input)", {
		beforeEach: function() {
			this.oAnnotation = {valueListEntitySetName:"Chuck",keyField:"TheKey",descriptionField:"Desc",keys:["TheKey"],valueListFields:[{name:"TheKey"},{name:"Desc"}]};
			this.oModel = sinon.createStubInstance(ODataModel);
			this.oValueListProvider = new ValueListProvider({control: sinon.createStubInstance(Input), aggregation:"suggestionItems", annotation:this.oAnnotation, model:this.oModel, typeAheadEnabled:true});
		},
		afterEach: function() {
			this.oValueListProvider.destroy();
			this.oValueListProvider = null;
		}
	});

	QUnit.test("Input - attachSuggestionItemSelected shall trigger select and set Key as value of Input", function(assert) {
		var oMockRow = {TheKey:"key",Desc:"description"};
		var getObjectStub = sinon.stub().returns(oMockRow);
		var getBindingContextStub = sinon.stub().returns({
			getObject: getObjectStub
		});
		var oSelectedRow = { getBindingContext: getBindingContextStub };
		var fSuggestionItemSelected = null, oEvent = { getParameter:sinon.stub().returns(oSelectedRow) };


		assert.strictEqual(this.oValueListProvider.oControl.attachSuggestionItemSelected.calledOnce,true);
		fSuggestionItemSelected  = this.oValueListProvider.oControl.attachSuggestionItemSelected.args[0][0];
		sinon.spy(this.oValueListProvider,"_calculateAndSetFilterOutputData");

		//Trigger the selection
		fSuggestionItemSelected.call(this.oValueListProvider, oEvent);

		assert.strictEqual(getBindingContextStub.calledOnce,true);
		assert.strictEqual(getObjectStub.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._calculateAndSetFilterOutputData.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._calculateAndSetFilterOutputData.calledWith([oMockRow]),true);
		assert.strictEqual(this.oValueListProvider.oControl.setValue.calledOnce,true);
		assert.strictEqual(this.oValueListProvider.oControl.setValue.calledWith("key"),true);
		assert.strictEqual(this.oValueListProvider.oControl.fireChange.calledOnce,true);
		assert.strictEqual(this.oValueListProvider.oControl.fireChange.calledWith({value:"key", validated: true}),true);
	});

	// BCP 1770487494
	QUnit.test("it should unbind the suggestionItems aggregation when the provided control is removed from the control tree", function(assert) {

		// arrange
		var oSmartField = new SmartField();
		var oInput = new Input();
		var oText = new Text();
		var sAggregation = "suggestionItems";
		oSmartField.setContent(oInput);

		// system under test
		this.oValueListProvider = new ValueListProvider({
			control: oInput,
			aggregation: sAggregation,
			annotation: this.oAnnotation,
			model: this.oModel,
			typeAheadEnabled: true
		});

		// act: simulate an user interaction with the text input control, the ValueListProvider class bind the
		// aggregation on the suggest event handler of the text input control
		oInput.fireSuggest({
			suggestValue: "foo"
		});

		// change the SmartField's content aggregation (this usually occurs when the inner controls are toggled)
		oSmartField.setContent(oText);

		// assert
		assert.strictEqual(oInput.isBound(sAggregation), false);

		// cleanup
		oSmartField.destroy();
		oInput.destroy();
		oText.destroy();
	});

	QUnit.test("it should not unbind the suggestionItems aggregation", function(assert) {

		// arrange
		var oSmartField = new SmartField();
		var oInput = new Input();
		var sAggregation = "suggestionItems";
		oSmartField.setContent(oInput);

		// system under test
		this.oValueListProvider = new ValueListProvider({
			control: oInput,
			aggregation: sAggregation,
			annotation: this.oAnnotation,
			model: this.oModel,
			typeAheadEnabled: true
		});

		// act: simulate an user interaction with the text input control, the ValueListProvider class bind the
		// aggregation on the suggest event handler of the text input control
		oInput.fireSuggest({
			suggestValue: "foo"
		});

		// change the SmartField's content aggregation (this usually occurs when the inner controls are toggled)
		oSmartField.setContent(oInput);

		// assert
		assert.strictEqual(oInput.isBound(sAggregation), true);

		// cleanup
		oSmartField.destroy();
		oInput.destroy();
	});

	QUnit.module("Recommendations", {
		beforeEach: function () {
			this.oMockInput  = new Input();
			this.oVLP = new ValueListProvider({
				control: this.oMockInput
			});
		},
		afterEach: function () {
			this.oVLP.destroy();
			this.oMockInput.destroy();
		}
	});

	QUnit.test("_addRecommendationsToGroup should loop through all passed items in the array and add to them additional 'order' field with value 10", function (assert) {
		// Arrange
		var ORDER_NUMBER_FOR_RECOMMENDATIONS = 10,
			aRecommendations = [{ name: "First Recommendation" }, { name: "Second Recommendation" }];

		// Act
		var oResult = this.oVLP._addRecommendationsToGroup(aRecommendations);

		// Assert
		assert.equal(oResult[0].order, ORDER_NUMBER_FOR_RECOMMENDATIONS, "an order field with value 10 is added to the first recommendation");
		assert.equal(oResult[1].order, ORDER_NUMBER_FOR_RECOMMENDATIONS, "an order field with value 10 is added to the second recommendation");
	});

	QUnit.test("_addSuggestionsToGroup should loop through all passed items in the array and add to them additional 'order' field with value 30", function (assert) {
		// Arrange
		var ORDER_NUMBER_FOR_SUGGESTIONS = 30,
			aSuggestions = [{ name: "First Suggestion" }, { name: "Second Suggestion" }];

		// Act
		var oResult = this.oVLP._addSuggestionsToGroup(aSuggestions);

		// Assert
		assert.equal(oResult[0].order, ORDER_NUMBER_FOR_SUGGESTIONS, "an order field with value 10 is added to the first suggestion");
		assert.equal(oResult[1].order, ORDER_NUMBER_FOR_SUGGESTIONS, "an order field with value 10 is added to the second suggestion");
	});

	QUnit.test("_groupHeaderFactory should return correct group item for fixed and not fixed values scenario", function (assert) {
		// Arrange
		var oFieldMetadataWithFixedValues = { fixed: true };
		var oFieldMetadata = { fixed: false };
		var oIsValueListWithFixedValuesStub = this.stub(this.oVLP, "_isValueListWithFixedValues");
		oIsValueListWithFixedValuesStub.withArgs(oFieldMetadataWithFixedValues).returns(true);
		oIsValueListWithFixedValuesStub.withArgs(oFieldMetadata).returns(false);

		// Act & Assert
		this.oVLP._fieldViewMetadata = oFieldMetadataWithFixedValues;
		var oControl = this.oVLP._groupHeaderFactory({});
		assert.equal(oControl.getMetadata().getName(), "sap.ui.core.SeparatorItem", "group headers should be SeparatorItem in case of combobox scenario");

		// Act & Assert
		this.oVLP._fieldViewMetadata = oFieldMetadata;
		var oControl = this.oVLP._groupHeaderFactory({});
		assert.equal(oControl.getMetadata().getName(), "sap.m.GroupHeaderListItem", "group headers should be GroupHeaderListItem in case of input scenario");

		// Cleanup
		oIsValueListWithFixedValuesStub.restore();
	});

	QUnit.test("_getGroupHeaderTitle should return right titles for different groups", function (assert) {
		// Arrange
		var ORDER_NUMBER_FOR_RECOMMENDATIONS = 10,
			ORDER_NUMBER_FOR_SUGGESTIONS = 30,
			sOthersTitle = "Others",
			sRecommendationsTitle = "Recommendations",
			oRBGetTextStub = this.stub();
		oRBGetTextStub.withArgs("VALUELIST_OTHERS_TITLE").returns(sOthersTitle);
		oRBGetTextStub.withArgs("VALUELIST_RECOMMENDATIONS_TITLE").returns(sRecommendationsTitle);
		this.oVLP._oResourceBundle = { getText: oRBGetTextStub };

		// Act & Assert
		var sResult = this.oVLP._getGroupHeaderTitle(ORDER_NUMBER_FOR_RECOMMENDATIONS);
		assert.equal(sResult, sRecommendationsTitle, "Group Header title for recommendations should be equal to " + sRecommendationsTitle);

		// Act & Assert
		var sResult = this.oVLP._getGroupHeaderTitle(ORDER_NUMBER_FOR_SUGGESTIONS);
		assert.equal(sResult, sOthersTitle, "Group Header title for suggestions should be equal to " + sOthersTitle);
	});

	QUnit.test("_getGroupHeaderSorter should return a sap.ui.model.Sorter with path equal to 'order' and group function that extract 'order' property from the context", function (assert) {
		// Arrange
		var ORDER_NUMBER_FOR_RECOMMENDATIONS = 10,
			sOrderPropertyPath = "order",
			oContextStub = {
				getProperty: this.stub().returns(ORDER_NUMBER_FOR_RECOMMENDATIONS)
			};

		// Act
		var oSorter = this.oVLP._getGroupHeaderSorter();

		// Assert
		assert.equal(oSorter.getMetadata().getName(), "sap.ui.model.Sorter", "sorter should be sap.ui.model.Sorter");
		assert.equal(oSorter.sPath, sOrderPropertyPath, "sorter property name should be 'order'");
		assert.equal(oSorter.fnGroup(oContextStub), ORDER_NUMBER_FOR_RECOMMENDATIONS, "group function should extract the order property from the context");
	});

	QUnit.test("_getDistinctSuggestions should return only unique entries from an array", function (assert) {
		// Arrange
		var oItem1 = { name: "item1" },
			oItem2 = { name: "item2" },
			oItem3 = { name: "item3" },
			aExpected = [oItem1, oItem2, oItem3],
			aTestArray = [oItem1, oItem2, oItem1, oItem2, oItem3, oItem3, oItem3];
		this.oVLP.sKey = "name";

		// Act
		var aResult = this.oVLP._getDistinctSuggestions(aTestArray);

		// Assert
		assert.deepEqual(aResult, aExpected, "returned array should have only distinct values");
	});

	QUnit.test("_resolveRecommendationListAnnotationData should add visible columns to the recommendations cols and select arrays", function (assert) {
		// Arrange
		var oVisibleField = { name: "Visible Field", visible: true },
			oInvisibleField = { name: "Invisible Field", visible: false },
			oRecommendationAnnotation = {
				fieldsToDisplay: [oVisibleField, oInvisibleField]
			};

		// Act
		this.oVLP._resolveRecommendationListAnnotationData(oRecommendationAnnotation);

		// Assert
		assert.equal(this.oVLP._aRecommendationCols.length, 1, "one column config should be added");
		assert.equal(this.oVLP.aRecommendationSelect.length, 1, "one select field should be added");
		assert.equal(this.oVLP._aRecommendationCols[0].template, oVisibleField.name, "column template should be equal to the field name");
		assert.equal(this.oVLP.aRecommendationSelect[0], oVisibleField.name, "select should be equal to the field name");
	});

	QUnit.test("_shouldHaveRecommendations should return true if recommendations is enabled through a flag in the ValueListProvider and there is RecommendationList annotation", function(assert) {
		// Arrange
		this.oVLP._bRecommendationListEnabled = true;
		var oHasRecommendationListAnnotation = this.stub(this.oVLP, "_hasRecommendationListAnnotation");

		// Act & Arrange
		oHasRecommendationListAnnotation.returns(true);
		assert.ok(this.oVLP._shouldHaveRecommendations(), "should return true");

		// Act & Arrange
		oHasRecommendationListAnnotation.returns(false);
		assert.notOk(this.oVLP._shouldHaveRecommendations(), "should return false");

		// Cleanup
		oHasRecommendationListAnnotation.restore();
	});

	QUnit.test("_hasRecommendationListAnnotation should return if RecommendationList annotation is provided to a property", function(assert) {
		// Arrange
		this.oVLP._fieldViewMetadata = { "com.sap.vocabularies.UI.v1.RecommendationList": "added" };

		// Act & Assert
		assert.ok(this.oVLP._hasRecommendationListAnnotation(), "the property has a RecommendationList Annotation");

		// Arrange
		this.oVLP._fieldViewMetadata = { };

		// Act & Assert
		assert.notOk(this.oVLP._hasRecommendationListAnnotation(), "the property does not have a RecommendationList Annotation");
	});

	QUnit.test("_getRecommendationListAnnotation should return and enrich the RecommendationList Annotation", function (assert) {
		// Arrange
		var sFieldName = "EPM_REF_APPS_PROD_MAN_SRV.Product/CurrencyCode",
			oAnnotation = { name: "Annotation" },
			oEnrichedAnnotation = { name: "EnrichedAnnotation" },
				oMetadataAnalyser = {
					_getRecommendationListAnnotation: this.stub().returns(oAnnotation),
					_enrichRecommendationListAnnotation: this.stub().returns(oEnrichedAnnotation)
				};
		this.oVLP._sFullyQualifiedFieldName = sFieldName;
		this.oVLP._oMetadataAnalyser = oMetadataAnalyser;

		// Act
		var oResult = this.oVLP._getRecommendationListAnnotation();

		// Assert
		assert.equal(oResult, oEnrichedAnnotation, "returned value should be equal the enriched annotation");
		assert.equal(oMetadataAnalyser._getRecommendationListAnnotation.callCount, 1, "_getRecommendationListAnnotation should be called once");
		assert.equal(oMetadataAnalyser._enrichRecommendationListAnnotation.callCount, 1, "_enrichRecommendationListAnnotation should be called once");
		assert.equal(oMetadataAnalyser._getRecommendationListAnnotation.args[0][0], sFieldName, "_getRecommendationListAnnotation should be called with " + sFieldName);
		assert.equal(oMetadataAnalyser._enrichRecommendationListAnnotation.args[0][0], oAnnotation, "_enrichRecommendationListAnnotation should be called with the annotation");
	});

	QUnit.test("_isValueListWithFixedValues should return true if fixed-values are used for ValueList annotation", function (assert) {
		// Arrange & Act & Assert
		this.oVLP._fieldViewMetadata = { "com.sap.vocabularies.Common.v1.ValueListWithFixedValues": { "Bool": "true" } };
		var bResult = this.oVLP._isValueListWithFixedValues();
		assert.ok(bResult, "should return true");

		// Arrange & Act & Assert
		this.oVLP._fieldViewMetadata = { "sap:value-list": "fixed-values" };
		var bResult = this.oVLP._isValueListWithFixedValues();
		assert.ok(bResult, "should return true");

		// Arrange & Act & Assert
		this.oVLP._fieldViewMetadata = { };
		var bResult = this.oVLP._isValueListWithFixedValues();
		assert.notOk(bResult, "should return false");
	});

	QUnit.test("_isNotRecommendationItemSelected should return true if selected item is from recommendations group and false otherwise", function (assert) {
		// Arrange
		var oFindSuggestionItemGroupStub = this.stub(this.oVLP, "_findSuggestionItemGroup");

		// Act & Assert
		oFindSuggestionItemGroupStub.returns(10); // 10 - Recommendations Group
		var bResult = this.oVLP._isNotRecommendationItemSelected();
		assert.notOk(bResult, "item that is selected is from recommendation group");

		// Act & Assert
		oFindSuggestionItemGroupStub.returns(30); // 30 - Others Group
		var bResult = this.oVLP._isNotRecommendationItemSelected();
		assert.ok(bResult, "item that is selected is not from recommendation group");

		// Cleanup
		oFindSuggestionItemGroupStub.restore();
	});

	QUnit.test("_getSuggestionsModelName should return undefined in case of ValueList annotation and 'list' in case of both ValueList and RecommendationList", function (assert) {
		// Arrange
		var oShouldHaveRecommendationsStub = this.stub(this.oVLP, "_shouldHaveRecommendations");

		// Act & Assert
		oShouldHaveRecommendationsStub.returns(true);
		var sResult = this.oVLP._getSuggestionsModelName();
		assert.equal(sResult, "list", "model path should be equal to 'list'");

		// Act & Assert
		oShouldHaveRecommendationsStub.returns(false);
		var sResult = this.oVLP._getSuggestionsModelName();
		assert.equal(sResult, undefined, "model path should be equal to 'undefined'");

		// Cleanup
		oShouldHaveRecommendationsStub.restore();
	});

	QUnit.test("_resolveSuggestionBindingPath should add the model path if any", function (assert) {
		// Arrange
		var sPath = "CurrencyCode",
			oGetSuggestionsModelName = this.stub(this.oVLP, "_getSuggestionsModelName");

		// Act & Assert
		oGetSuggestionsModelName.returns("list");
		var sResult = this.oVLP._resolveSuggestionBindingPath(sPath);
		assert.equal(sResult, "list>" + sPath);

		// Act & Assert
		oGetSuggestionsModelName.returns();
		var sResult = this.oVLP._resolveSuggestionBindingPath(sPath);
		assert.equal(sResult, sPath);

		// Cleanup
		oGetSuggestionsModelName.restore();
	});


	QUnit.module("Internal functions", {
		beforeEach: function () {
			this.oMockInput  = new Input();
			this.oVLP = new ValueListProvider({
				control: this.oMockInput
			});
		},
		afterEach: function () {
			this.oVLP.destroy();
			this.oMockInput.destroy();
		}
	});

	QUnit.test("_handleSelect - validation of single input fields", function (assert) {
		// Arrange
		var oAttachMethodSpy = sinon.spy(this.oMockInput, "attachChange"),
			oValidateFunctionSpy = sinon.spy(this.oVLP, "_validateStringSingleWithValueList");

		// Arrange - mock field metadata and context
		this.oVLP._fieldViewMetadata = {
			hasValueListAnnotation: true
		};
		this.oVLP.sContext = "SmartFilterBar";

		// Act - call method
		this.oVLP._handleSelect();

		// Assert
		assert.strictEqual(oAttachMethodSpy.callCount, 1, "Change handler attached to input control");

		// Act - trigger validation event
		this.oMockInput.fireChange({
			text: "Some text"
		});

		// Assert
		assert.strictEqual(oValidateFunctionSpy.callCount, 1, "Validation is called when control change event is fired");

		// Cleanup
		oValidateFunctionSpy.restore();
		oAttachMethodSpy.restore();
	});

	QUnit.test("_validateStringSingleWithValueList", function (assert) {
		// Arrange
		var oMockEvent = {
				bValidated: true,
				sValue: "some text",
				getParameter: function (sName) {
					return sName === "validated" ? this.bValidated : this.sValue;
				}
			},
			oValidateFunctionSpy = sinon.stub(this.oVLP, "_validateInput");

		// Act - call with {validated: true, value: 'some text'}
		this.oVLP._validateStringSingleWithValueList(oMockEvent);

		// Assert
		assert.strictEqual(oValidateFunctionSpy.callCount, 0,
			"_validateInput should not be called in case event data is {validated: true, value: 'some text'}");

		// Arrange
		oMockEvent.bValidated = false;
		oMockEvent.sValue = "";

		// Act
		this.oVLP._validateStringSingleWithValueList(oMockEvent);

		// Assert
		assert.strictEqual(oValidateFunctionSpy.callCount, 0,
			"_validateInput should not be called in case event data is {validated: false, value: ''}");

		// Arrange - run method with event which value parameter is undefined
		oMockEvent.bValidated = false;
		oMockEvent.sValue = undefined;

		// Act
		this.oVLP._validateStringSingleWithValueList(oMockEvent);

		// Assert
		assert.strictEqual(oValidateFunctionSpy.callCount, 0,
			"_validateInput should not be called in this case}");

		// Arrange
		oMockEvent.bValidated = false;
		oMockEvent.sValue = "Some text";

		// Act
		this.oVLP._validateStringSingleWithValueList(oMockEvent);

		// Assert
		assert.strictEqual(oValidateFunctionSpy.callCount, 1,
			"_validateInput should be called in case event data is {validated: false, value: 'Some text'}");

		// Cleanup
		oValidateFunctionSpy.restore();
	});

	QUnit.test("_handleRowSelect does not throw exception if '{' is part of the key of some tokens", function (assert) {
		// Arrange
		var oDataModelRowStub = {
			key: "not{escaped{key",
			desc: "not{escaped{desc"
		},
			oFnCallbackStub = this.stub();
		this.oVLP.oControl = new MultiInput();
		this.oVLP.sKey = "key";
		this.oVLP.sDescription = "desc";

		// Act
		this.oVLP._handleRowSelect(oDataModelRowStub, oFnCallbackStub);

		// Assert
		assert.ok(true, "no exception is thrown");
	});

	QUnit.test("_sortRecommendations sort the provided recommendations by their 'rank' property", function (assert) {
		// Arrange
		var aRecommendations = [{ rank: 1 }, { rank: 3 }, { rank: 3.3 }, { rank: 3.5 }, { rank: 2 }],
			aExpected = [{ rank: 3.5 }, { rank: 3.3 }, { rank: 3 }, { rank: 2 }, { rank: 1 }];
		this.oVLP._oRecommendationListAnnotation = {
			rankProperty: "rank"
		};

		// Act
		var aResult = aRecommendations.sort(this.oVLP._sortRecommendations.bind(this.oVLP));

		// Assert
		assert.deepEqual(aExpected, aResult, "recommendations should be sorted descending by rank property");
	});

	QUnit.start();

});
