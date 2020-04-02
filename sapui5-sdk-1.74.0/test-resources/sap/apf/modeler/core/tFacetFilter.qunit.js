/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.modeler.core.facetFilter");
jQuery.sap.require("sap.apf.modeler.core.elementContainer");
jQuery.sap.require("sap.apf.modeler.core.configurationObjects");
(function() {
	'use strict';
	QUnit.module("M FacetFilter Class GIVEN inject", {
		beforeEach : function() {
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.inject = {
				instances : {
					messageHandler : this.messageHandler
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					FacetFilter : sap.apf.modeler.core.FacetFilter,
					ElementContainer : sap.apf.modeler.core.ElementContainer
				}
			};
			this.service = "hugo-service";
			this.entitySet = "hugo-view";
			this.requestForValueHelp = {
				service : "hugo-service",
				entitySet : "entitySet1"
			};
			this.requestForFilterResolution = {
				service : "hugo-service",
				entitySet : "entitySet1"
			};
			this.facetFilter = new sap.apf.modeler.core.FacetFilter("FacetFilterKey", this.inject);
		}
	});
	QUnit.test("Create facet filter and get ID", function(assert) {
		assert.ok(this.facetFilter, "Creation successful");
		assert.equal(this.facetFilter.getId(), "FacetFilterKey");
	});
	QUnit.test("Get/Set property", function(assert) {
		this.facetFilter.setProperty("property");
		assert.equal(this.facetFilter.getProperty(), "property", "Correct property set and get");
	});
	QUnit.test("Get/Set alias", function(assert) {
		this.facetFilter.setAlias("alias");
		assert.equal(this.facetFilter.getAlias(), "alias", "Correct alias set and get");
	});
	QUnit.test("Get/Set useSameRequestForValueHelpAndFilterResolution", function(assert) {
		this.facetFilter.setUseSameRequestForValueHelpAndFilterResolution(false);
		assert.equal(this.facetFilter.getUseSameRequestForValueHelpAndFilterResolution(), false, "Correct values for set and get");
	});
	QUnit.test("WHEN set useSameRequestForValueHelpAndFilterResolution to true", function(assert) {
		this.facetFilter.setServiceOfValueHelp("serviceValueHelp");
		this.facetFilter.setEntitySetOfValueHelp("entitySetValueHelp");
		this.facetFilter.setServiceOfFilterResolution("serviceFilterResolution");
		this.facetFilter.setEntitySetOfFilterResolution("entitySetFilterResolution");
		this.facetFilter.addSelectPropertyOfFilterResolution("selectProperty3");
		this.facetFilter.addSelectPropertyOfFilterResolution("selectProperty4");
		this.facetFilter.addSelectPropertyOfValueHelp("selectProperty1");
		this.facetFilter.addSelectPropertyOfValueHelp("selectProperty2");
		assert.equal(this.facetFilter.getServiceOfFilterResolution(), "serviceFilterResolution", "THEN the own service is used");
		assert.equal(this.facetFilter.getEntitySetOfFilterResolution(), "entitySetFilterResolution", "THEN the own entity set  is used");
		assert.deepEqual(this.facetFilter.getSelectPropertiesOfFilterResolution(), [ "selectProperty3", "selectProperty4" ], "THEN the own select properties are used");
		this.facetFilter.setUseSameRequestForValueHelpAndFilterResolution(true);
		assert.equal(this.facetFilter.getServiceOfFilterResolution(), "serviceValueHelp", "THEN the service of value help is used");
		assert.equal(this.facetFilter.getEntitySetOfFilterResolution(), "entitySetValueHelp", "THEN the entity set of value help is used");
		assert.deepEqual(this.facetFilter.getSelectPropertiesOfFilterResolution(), [ "selectProperty1", "selectProperty2" ], "THEN the select properties of value help request are used");
		this.facetFilter.setServiceOfValueHelp("newServiceValueHelp");
		assert.equal(this.facetFilter.getServiceOfFilterResolution(), "newServiceValueHelp", "THEN the updated  service of value help is used");
		this.facetFilter.setEntitySetOfValueHelp("newEntitySet");
		assert.equal(this.facetFilter.getEntitySetOfFilterResolution(), "newEntitySet", "THEN the updated  entity set of value help is used");
		this.facetFilter.removeSelectPropertyOfValueHelp("selectProperty1");
		assert.deepEqual(this.facetFilter.getSelectPropertiesOfFilterResolution(), [ "selectProperty2" ], "THEN the same select property of filter resolution request help also has been removed");
		this.facetFilter.addSelectPropertyOfValueHelp("newSelectProperty");
		assert.deepEqual(this.facetFilter.getSelectPropertiesOfFilterResolution(), [ "selectProperty2", "newSelectProperty" ], "THEN the same select property of filter resolution request help also has been added");
		this.facetFilter.removeSelectPropertyOfFilterResolution("selectProperty2");
		assert.deepEqual(this.facetFilter.getSelectPropertiesOfFilterResolution(), [ "selectProperty2", "newSelectProperty" ], "THEN the remove operation on the filter resolution request does not apply");
		this.facetFilter.setEntitySetOfFilterResolution("newEntitySetForFilterResolution");
		assert.equal(this.facetFilter.getEntitySetOfFilterResolution(), "newEntitySet", "THEN only the updated entity set of value help is used");
		this.facetFilter.setServiceOfFilterResolution("newServiceForFilterResolution");
		assert.equal(this.facetFilter.getServiceOfFilterResolution(), "newServiceValueHelp", "THEN only the updated service of value help is used");
	});
	QUnit.test("Get/Set labelKey", function(assert) {
		this.facetFilter.setLabelKey("labelKey");
		assert.equal(this.facetFilter.getLabelKey(), "labelKey", "Correct labelKey set and get");
	});
	QUnit.test("Get/Set/Remove automaticSelection", function(assert) {
		assert.equal(this.facetFilter.getAutomaticSelection(), undefined, "THEN automatic selection is not on per default");
		this.facetFilter.setAutomaticSelection(false);
		assert.equal(this.facetFilter.getAutomaticSelection(), false, "THEN automatic selection can be set to false");
		this.facetFilter.setAutomaticSelection(true);
		assert.equal(this.facetFilter.getAutomaticSelection(), true, "THEN automatic selection can be switched to on again");
	});
	QUnit.test("WHEN supplying wrong values for setting automaticSelection", function(assert) {
		assert.throws(function() {
			this.facetFilter.setAutomaticSelection("true");
		}, "THEN check method is called");
	});
	QUnit.test("WHEN Setting preselection function", function(assert) {
		this.facetFilter.setAutomaticSelection(true);
		assert.equal(this.facetFilter.getAutomaticSelection(), true, "THEN automatic selection is on");
		this.facetFilter.setPreselectionFunction("preselectionFunction");
		assert.equal(this.facetFilter.getAutomaticSelection(), false, "THEN automatic selection is set to false");
	});
	QUnit.test("WHEN Setting preselection defaults", function(assert) {
		this.facetFilter.setAutomaticSelection(true);
		assert.equal(this.facetFilter.getAutomaticSelection(), true, "THEN automatic selection is on");
		this.facetFilter.setPreselectionDefaults([ "preselectionDefault1", "preselectionDefault2" ]);
		assert.equal(this.facetFilter.getAutomaticSelection(), false, "THEN automatic selection is set to false");
	});
	QUnit.test("Get/Set/Remove preselectionFunction", function(assert) {
		this.facetFilter.setPreselectionFunction("preselectionFunction");
		assert.equal(this.facetFilter.getPreselectionFunction(), "preselectionFunction", "Correct preselectionFunction set and get");
		this.facetFilter.removePreselectionFunction();
		assert.equal(this.facetFilter.getPreselectionFunction(), undefined, "Preselction function removed");
	});
	QUnit.test("Get/Set/Remove preselectionDefaults", function(assert) {
		this.facetFilter.setPreselectionDefaults([ "preselectionDefault1", "preselectionDefault2" ]);
		assert.deepEqual(this.facetFilter.getPreselectionDefaults(), [ "preselectionDefault1", "preselectionDefault2" ], "Correct preselectionDefaults set and get");
		this.facetFilter.removePreselectionDefaults();
		assert.deepEqual(this.facetFilter.getPreselectionDefaults(), [], "Preselection defaults removed");
	});
	QUnit.test('Get value list if nothing was set', function(assert) {
		assert.deepEqual(this.facetFilter.getValueList(), [] , 'Returns empty array if nothing has been set before');
	});
	QUnit.test('Get value list after values were set', function(assert) {
		this.facetFilter.setValueList(['LValue1', 'LValue2', 'LValue3']);
		assert.deepEqual(this.facetFilter.getValueList(), ['LValue1', 'LValue2', 'LValue3'] , 'Previously set list values returned');
	});
	QUnit.test('Set value list stores internally a copy of its parameter', function(assert) {
		var listValues = ['LValue1', 'LValue2', 'LValue3'];
		this.facetFilter.setValueList(listValues);
		listValues.push('LValue4');
		assert.notEqual(this.facetFilter.getValueList(), listValues , 'Different array instance returned than the one that has been set');
		assert.notDeepEqual(this.facetFilter.getValueList(), listValues , 'Changing array after values have been set does not influence stored values');
	});
	QUnit.test('Get value list returns a copy of internally stored value', function(assert) {
		var returnedListValues;
		var listValues = ['LValue1', 'LValue2', 'LValue3'];
		this.facetFilter.setValueList(listValues);
		returnedListValues = this.facetFilter.getValueList();
		returnedListValues.push('LValue4');
		assert.deepEqual(this.facetFilter.getValueList(), listValues , 'Changing returnde array reference does not influence internally stored values');
	});
	QUnit.test('Calling set with an empty array removes all previously set values', function(assert) {
		this.facetFilter.setValueList(['LValue1', 'LValue2', 'LValue3']);
		this.facetFilter.setValueList([]);
		assert.deepEqual(this.facetFilter.getValueList(),  [], 'Get returns empty array set was called with an empty array');
	});
	QUnit.test('Value list to be set is discarded when not in proper format', function(assert) {
		var initialValueList = ['LValue1', 'LValue2'];
		this.facetFilter.setValueList(initialValueList);
		
		this.facetFilter.setValueList('LValue1');
		assert.deepEqual(this.facetFilter.getValueList(),  initialValueList, 'Get returns last valid value if set was called with string directly');
		this.facetFilter.setValueList(['LValue1', 42]);
		assert.deepEqual(this.facetFilter.getValueList(),  initialValueList, 'Get returns last valid value if array that was set does not contain strings only');
		this.facetFilter.setValueList(['LValue1', ['LValue2', 'LValue3']]);
		assert.deepEqual(this.facetFilter.getValueList(),  initialValueList, 'Get returns last valid value if array that was set is not flat');
	});
	QUnit.test("Activate/Deactivate multi selection", function(assert) {
		assert.equal(this.facetFilter.isMultiSelection(), false, "Default multiselection is false");
		this.facetFilter.setMultiSelection(true);
		assert.equal(this.facetFilter.isMultiSelection(), true, "Multiselection set true");
	});
	QUnit.test('Visibility of new instance', function(assert) {
	    assert.strictEqual(this.facetFilter.isVisible(), true, 'Without manipulation new instances are visible');
	});
	QUnit.test('Set invisible', function(assert) {
	    this.facetFilter.setInvisible();
	    assert.strictEqual(this.facetFilter.isVisible(), false, 'Boolean value indicating invisibilty');
	});
	QUnit.test('Multiple toggles of visibility', function(assert) {
	    this.facetFilter.setVisible();
	    this.facetFilter.setInvisible();
	    this.facetFilter.setInvisible();
	    assert.strictEqual(this.facetFilter.isVisible(), false, 'Temporarily invisible');
	    this.facetFilter.setVisible();
	    this.facetFilter.setVisible();
	    assert.strictEqual(this.facetFilter.isVisible(), true, 'Last toggle results in indicating visibilty');
	});
	QUnit.test("Get/Set service and entity set for value help", function(assert) {
		this.facetFilter.setServiceOfValueHelp("service");
		this.facetFilter.setEntitySetOfValueHelp("entitySet");
		assert.equal(this.facetFilter.getServiceOfValueHelp(), "service", "Service of value help request received");
		assert.equal(this.facetFilter.getEntitySetOfValueHelp(), "entitySet", "Entity set of value help request received");
	});
	QUnit.test("Get/Set service and entity set for filter resolution", function(assert) {
		this.facetFilter.setServiceOfFilterResolution("service");
		this.facetFilter.setEntitySetOfFilterResolution("entitySet");
		assert.equal(this.facetFilter.getServiceOfFilterResolution(), "service", "Service of filter resolution request received");
		assert.equal(this.facetFilter.getEntitySetOfFilterResolution(), "entitySet", "Entity set of filter resolution request received");
	});
	QUnit.test("Add 2 selectProperties to request for filter resolution and remove 1", function(assert) {
		this.facetFilter.addSelectPropertyOfFilterResolution("selectProperty3");
		this.facetFilter.addSelectPropertyOfFilterResolution("selectProperty4");
		assert.equal(this.facetFilter.getSelectPropertiesOfFilterResolution().length, 2, "2 selectProperties added to filter resolution");
		assert.notEqual(this.facetFilter.getSelectPropertiesOfFilterResolution().indexOf("selectProperty3"), -1, "contained");
		assert.notEqual(this.facetFilter.getSelectPropertiesOfFilterResolution().indexOf("selectProperty4"), -1, "contained");
		this.facetFilter.removeSelectPropertyOfFilterResolution("selectProperty3");
		assert.equal(this.facetFilter.getSelectPropertiesOfFilterResolution().length, 1, "1 selectProperty removed from filter resolution request");
		assert.equal(this.facetFilter.getSelectPropertiesOfFilterResolution().indexOf("selectProperty3"), -1, "not contained");
		assert.notEqual(this.facetFilter.getSelectPropertiesOfFilterResolution().indexOf("selectProperty4"), -1, "contained");
	});
	QUnit.test("Add 2 selectProperties to request for value help and remove 1", function(assert) {
		this.facetFilter.addSelectPropertyOfValueHelp("selectProperty1");
		this.facetFilter.addSelectPropertyOfValueHelp("selectProperty2");
		assert.equal(this.facetFilter.getSelectPropertiesOfValueHelp().length, 2, "2 selectProperties added to value help request");
		assert.notEqual(this.facetFilter.getSelectPropertiesOfValueHelp().indexOf("selectProperty1"), -1, "contained");
		assert.notEqual(this.facetFilter.getSelectPropertiesOfValueHelp().indexOf("selectProperty2"), -1, "contained");
		this.facetFilter.removeSelectPropertyOfValueHelp("selectProperty1");
		assert.equal(this.facetFilter.getSelectPropertiesOfValueHelp().length, 1, "1 selectProperty removed from value help request");
		assert.equal(this.facetFilter.getSelectPropertiesOfValueHelp().indexOf("selectProperty1"), -1, "not contained");
		assert.notEqual(this.facetFilter.getSelectPropertiesOfValueHelp().indexOf("selectProperty2"), -1, "contained");
	});
	QUnit.test("Properties in copied facet filter", function(assert) {
		var copiedFacetFilter = this.facetFilter.copy();
		function setupFilterForCopy(facetFilter) {
			facetFilter.setProperty("property");
			facetFilter.setAlias("alias");
			facetFilter.setLabelKey("labelKey");
			facetFilter.setPreselectionFunction("preselectionFunction");
			facetFilter.setPreselectionDefaults(["preselectionDefault1", "preselectionDefault2"]);
			facetFilter.setValueList(["LValue1", "LValue2"]);
			facetFilter.setMultiSelection(true);
			facetFilter.setServiceOfValueHelp("service");
			facetFilter.setEntitySetOfValueHelp("entitySet");
			facetFilter.setServiceOfFilterResolution("service");
			facetFilter.setEntitySetOfFilterResolution("entitySet");
			facetFilter.addSelectPropertyOfFilterResolution("selectProperty3");
			facetFilter.addSelectPropertyOfFilterResolution("selectProperty4");
			facetFilter.addSelectPropertyOfValueHelp("selectProperty1");
			facetFilter.addSelectPropertyOfValueHelp("selectProperty2");
			facetFilter.setUseSameRequestForValueHelpAndFilterResolution(false);
		}
		assert.equal(copiedFacetFilter.getId(), this.facetFilter.getId(), "Copied facet filter has same Id");
		setupFilterForCopy(this.facetFilter);
		var newIdForCopy = "newIdForCopy";
		copiedFacetFilter = this.facetFilter.copy(newIdForCopy);
		assert.equal(copiedFacetFilter.getId(), newIdForCopy, "Copied facet filter has the new Id");
		assert.equal(copiedFacetFilter.getProperty(), "property", "Correct property set and get");
		assert.equal(copiedFacetFilter.getLabelKey(), "labelKey", "Correct labelKey set and get");
		assert.equal(copiedFacetFilter.getPreselectionFunction(), undefined, "Correct preselectionFunction are undefined, because we have preselection defaults set");
		assert.deepEqual(copiedFacetFilter.getPreselectionDefaults(), ["preselectionDefault1", "preselectionDefault2"], "Correct preselectionDefaults set and get");
		assert.deepEqual(copiedFacetFilter.getValueList(), ["LValue1", "LValue2"], "Correct list values set");
		assert.equal(copiedFacetFilter.isMultiSelection(), true, "Multiselection set true");
		assert.equal(copiedFacetFilter.getServiceOfValueHelp(), "service", "Service of value help request received");
		assert.equal(copiedFacetFilter.getEntitySetOfValueHelp(), "entitySet", "Entity set of value help request received");
		assert.equal(copiedFacetFilter.getServiceOfFilterResolution(), "service", "Service of filter resolution request received");
		assert.equal(copiedFacetFilter.getEntitySetOfFilterResolution(), "entitySet", "Entity set of filter resolution request received");
		assert.equal(copiedFacetFilter.getSelectPropertiesOfFilterResolution().length, 2, "2 selectProperties added to filter resolution");
		assert.notEqual(copiedFacetFilter.getSelectPropertiesOfFilterResolution().indexOf("selectProperty3"), -1, "contained");
		assert.notEqual(copiedFacetFilter.getSelectPropertiesOfFilterResolution().indexOf("selectProperty4"), -1, "contained");
		assert.equal(copiedFacetFilter.getSelectPropertiesOfValueHelp().length, 2, "2 selectProperties added to value help request");
		assert.notEqual(copiedFacetFilter.getSelectPropertiesOfValueHelp().indexOf("selectProperty1"), -1, "contained");
		assert.notEqual(copiedFacetFilter.getSelectPropertiesOfValueHelp().indexOf("selectProperty2"), -1, "contained");
		assert.equal(copiedFacetFilter.getAutomaticSelection(), false, "THEN the automatic selection is not set");
		assert.strictEqual(copiedFacetFilter.isVisible(), true, 'Correct visibility state set');
	});
	QUnit.test("Default values in copied facet filter", function(assert) {
		var newIdForCopy = "newIdForCopy";
		this.facetFilter.setAutomaticSelection(true);
		this.facetFilter.setInvisible();
		var copiedFacetFilter = this.facetFilter.copy(newIdForCopy);
		assert.equal(copiedFacetFilter.getAutomaticSelection(), true, "THEN the automatic selection is set");
		assert.equal(copiedFacetFilter.getPreselectionFunction(), undefined, "Correct preselectionFunction set and get");
		assert.deepEqual(copiedFacetFilter.getPreselectionDefaults(), [], "Correct preselection default values");
		assert.strictEqual(copiedFacetFilter.isVisible(), false, 'Correct visibility state set');
	});
	QUnit.module("Default option 'none'", {
		beforeEach : function() {
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.inject = {
				instances : {
					messageHandler : this.messageHandler
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					FacetFilter : sap.apf.modeler.core.FacetFilter,
					ElementContainer : sap.apf.modeler.core.ElementContainer
				}
			};
			this.facetFilter = new sap.apf.modeler.core.FacetFilter("FacetFilterKey", this.inject);
		}
	});
	QUnit.test("Set and Get none option", function(assert) {
		assert.equal(this.facetFilter.getNoneSelection(), true, "None selection set to true per default");
		this.facetFilter.setNoneSelection(false);
		assert.equal(this.facetFilter.getNoneSelection(), false, "None selection set to false");
		this.facetFilter.setNoneSelection(true);
		assert.equal(this.facetFilter.getNoneSelection(), true, "None selection set to true");
	});
	QUnit.test("Setting and overwriting automatic selection", function(assert) {
		this.facetFilter.setAutomaticSelection(true);
		assert.equal(this.facetFilter.getNoneSelection(), false, "None selection set to false when automatic selection is set to true");
		this.facetFilter.setNoneSelection(true);
		assert.equal(this.facetFilter.getAutomaticSelection(), false, "Automatic selection set to false when none selection");
	});
	QUnit.test("Setting and overwriting preselection defaults", function(assert) {
		this.facetFilter.setPreselectionDefaults(["value1"]);
		assert.equal(this.facetFilter.getNoneSelection(), false, "None selection set to false when preselectionDefaults are set");
		this.facetFilter.setNoneSelection(true);
		assert.deepEqual(this.facetFilter.getPreselectionDefaults(), [], "PreselectionDefaults removed when none selection");
	});
	QUnit.test("Setting and overwriting preselection function", function(assert) {
		this.facetFilter.setPreselectionFunction("value1");
		assert.equal(this.facetFilter.getNoneSelection(), false, "None selection set to false when preselectionDefaults are set");
		this.facetFilter.setNoneSelection(true);
		assert.equal(this.facetFilter.getPreselectionFunction(), undefined, "PreselectionDefaults removed when none selection");
	});
	QUnit.test("Copy", function(assert) {
		this.facetFilter.setNoneSelection(false);
		assert.equal(this.facetFilter.getNoneSelection(), false, "None selection false in original");
		var copy = this.facetFilter.copy();
		assert.equal(copy.getNoneSelection(), false, "None selection false in copy");
	});
	
}());
