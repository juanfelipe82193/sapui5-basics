/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery, sinon*/
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.modeler.core.elementContainer");
jQuery.sap.require("sap.apf.modeler.core.representation");
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("sap.apf.modeler.core.configurationObjects");
jQuery.sap.require("sap.apf.core.constants");
(function() {
	'use strict';
	var displayOptions = sap.apf.core.constants.representationMetadata.labelDisplayOptions;
	var measureDisplayOptions = sap.apf.core.constants.representationMetadata.measureDisplayOptions;
	var keyHugo = "hugo", keyMara = "mara";
	var keyText4711 = "keyText-4711", keyText42 = "keyText-42", kind42 = "kind-42", kind33 = "kind-33";
	QUnit.module("Representation all-in-one", {
		beforeEach : function() {
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.inject = {
				instances : {
					messageHandler : this.messageHandler
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					ElementContainer : sap.apf.modeler.core.ElementContainer,
					Representation : sap.apf.modeler.core.Representation
				}
			};
		}
	});
	QUnit.test("Create & getId", function(assert) {
		var obj = new this.inject.constructors.Representation("xyz", this.inject);
		assert.ok(obj, "WHEN Create one representation THEN returns ID'ed instance");
		assert.equal(obj.getId(), "xyz");
	});
	QUnit.test("Representation thumbnail texts", function(assert) {
		var representation = new this.inject.constructors.Representation("xyz", this.inject);
		representation.setLeftUpperCornerTextKey(keyText42);
		assert.equal(representation.getLeftUpperCornerTextKey(), keyText42, 'WHEN set left upper THEN left upper returned');
		representation.setRightUpperCornerTextKey(keyText42);
		assert.equal(representation.getRightUpperCornerTextKey(), keyText42, 'WHEN set right upper THEN right upper returned');
		representation.setLeftLowerCornerTextKey(keyText42);
		assert.equal(representation.getLeftLowerCornerTextKey(), keyText42, 'WHEN set left lower upper THEN left lower returned');
		representation.setRightLowerCornerTextKey(keyText42);
		assert.equal(representation.getRightLowerCornerTextKey(), keyText42, 'WHEN set right lower THEN right lower returned');
	});
	QUnit.test("AddDimension & constructor", function(assert) {
		var representation = new this.inject.constructors.Representation("xyz", this.inject);
		var id = representation.addDimension(keyHugo);
		assert.equal(id, keyHugo, "WHEN addDimension THEN returns given id");
		assert.equal(representation.getDimensions()[0], id, "WHEN getDimension THEN returns given instance");
		assert.equal(representation.getDimensionTextLabelKey(id), undefined, "WHEN constructor defaulted THEN getDimensionTextLabelKey returns undefined");
		assert.equal(representation.getDimensionKind(keyHugo), undefined, "WHEN getDimensionKind THEN default is set");
		assert.equal(representation.getMeasureKind(keyHugo), undefined, "WHEN getMeasureKind THEN default is set");
	});
	QUnit.test("Dimension and its members", function(assert) {
		var representation = new this.inject.constructors.Representation("xyz", this.inject);
		var id = representation.addDimension(keyHugo, keyText4711);
		assert.equal(id, keyHugo, "WHEN addDimension THEN returns given id");
		assert.equal(representation.getDimensions()[0], keyHugo, "WHEN getDimension THEN returns given instance");
		assert.equal(representation.getDimensionTextLabelKey(id), keyText4711, "WHEN getDimensionTextLabelKey THEN returns text key");
		assert.equal(representation.getDimensionKind(id), undefined, "WHEN getDimensionKind THEN default is undefined");
		representation.setDimensionKind(id, kind42);
		assert.equal(representation.getDimensionKind(id), kind42, "WHEN setDimensionKind THEN getDimensionKind returns set value");
		assert.equal(representation.getMeasureTextLabelKey(keyHugo), undefined, "WHEN getMeasureTextLabelKey on invalid key THEN returns undefined");
		assert.equal(representation.getDimensionTextLabelKey(keyMara), undefined, "WHEN getDimensionTextLabelKey on invalid key THEN returns undefined");
		assert.equal(representation.getDimensionKind(keyMara), undefined, "WHEN getDimensionKind on invalid key THEN returns default undefined");
		assert.equal(representation.getOrderbySpecifications().length, 0, "WHEN initial THEN getOrderbySpecifications is empty");
	});
	QUnit.test("AddMeasure constructor", function(assert) {
		var measure = new this.inject.constructors.Representation("xyz", this.inject);
		measure.addDimension(keyHugo, keyText4711, false);
		var id = measure.addMeasure(keyMara);
		assert.equal(id, keyMara, "WHEN addDimension THEN returns given id");
		assert.equal(measure.getMeasureTextLabelKey(keyMara), undefined, "WHEN getMeasureTextLabelKey THEN returns default");
		assert.equal(measure.getMeasureTextLabelKey(keyHugo), undefined, "WHEN getMeasureTextLabelKey on invalid key THEN returns undefined");
	});
	QUnit.test("Measure and its members", function(assert) {
		var measure = new this.inject.constructors.Representation("xyz", this.inject);
		measure.addMeasure(keyMara);
		measure.setMeasureTextLabelKey(keyMara, keyText42);
		assert.equal(measure.getMeasures()[0], keyMara, "WHEN getMeasures THEN returned object has correct getId()");
		assert.equal(measure.getMeasureTextLabelKey(keyMara), keyText42, "WHEN setMeasureTextLabelKey(x) THEN getMeasureTextLabelKey returns x");
		assert.equal(measure.getMeasureKind(keyMara), undefined, "WHEN getMeasureKind THEN default is undefined");
		measure.setMeasureTextLabelKey(keyMara, keyText4711);
		assert.equal(measure.getMeasureTextLabelKey(keyMara), keyText4711, "WHEN setMeasureTextLabelKey(x) overwrites THEN getMeasureTextLabelKey returns x");
		measure.setMeasureKind(keyMara, kind33);
		assert.equal(measure.getMeasureKind(keyMara), kind33, "WHEN setMeasureKind THEN getMeasureKind returns set value");
		var idDouble = measure.addMeasure(keyMara);
		assert.equal(idDouble, null, "double creation does not overwrite");
		assert.equal(measure.getMeasureTextLabelKey(keyMara), keyText4711, "WHEN addMeasure twice THEN does not overwrite");
		assert.equal(measure.getMeasureKind(keyMara), kind33, "WHEN addMeasure twice THEN does not overwrite");
	});
	QUnit.test("Measurekind backward compatibility (yAxis = yAxis1)", function(assert) {
		var measure = new this.inject.constructors.Representation("xyz", this.inject);
		measure.addMeasure("key");
		measure.setMeasureKind("key", "yAxis1");
		assert.equal(measure.getMeasureKind("key"), "yAxis", "yAxis1 should be returned as yAxis");
		// There are configurations which have measures as yAxis1 - this however was changed to yAxis, so yAxis1 has to be returned as yAxis
	});
	QUnit.test("AddMeasure called many times", function(assert) {
		var measure = new this.inject.constructors.Representation("xyz", this.inject);
		measure.addMeasure(keyMara);
		assert.equal(measure.getMeasures().length, 1, "WHEN addMeasure THEN getMeasures.length increases");
		measure.addMeasure(keyHugo);
		assert.equal(measure.getMeasures().length, 2, "WHEN addMeasure THEN getMeasures.length increases");
		var idDouble = measure.addMeasure(keyMara);
		assert.equal(idDouble, null, "double creation does not overwrite");
		assert.equal(measure.getMeasures().length, 2, "WHEN addMeasure on existing THEN getMeasures.length not increased");
		measure.removeMeasure(keyMara);
		assert.equal(measure.getMeasures().length, 1, "WHEN removeMeasure on existing THEN getMeasures.length decreased");
		measure.removeMeasure(keyMara);
		assert.equal(measure.getMeasures().length, 1, "WHEN removeMeasure on non-existing THEN getMeasures.length remains");
		measure.addMeasure(keyMara);
		assert.equal(measure.getMeasures().length, 2, "WHEN addMeasure again on same element THEN getMeasures.length increases");
	});
	QUnit.test("Add & get property", function(assert) {
		var propertyName;
		var representation = new this.inject.constructors.Representation("xyz", this.inject);
		assert.deepEqual(representation.getProperties(), [], 'Empty array returned if no properties set');
		propertyName = representation.addProperty('propertyName');
		assert.equal(propertyName, 'propertyName', 'Externally provided property name returned');
		assert.equal(representation.getProperties()[0], 'propertyName', "Returns property name that has been set");
		representation.addProperty('propertyNameOne', 'labelKey');
		assert.equal(representation.getProperties()[1], 'propertyNameOne', "Returns property name that has been set");
		assert.equal(representation.getPropertyTextLabelKey('propertyNameOne'),'labelKey');
	});
	QUnit.test("Remove properties", function(assert) {
		var representation = new this.inject.constructors.Representation("xyz", this.inject);
		representation.addProperty('propertyOne', 'labelKey');
		representation.setPropertyKind('propertyOne', 'kind');
		representation.removeProperty('propertyOne');
		assert.deepEqual(representation.getProperties(), [], 'Empty array returned if no properties set');
		assert.equal(representation.getPropertyTextLabelKey('propertyOne'), undefined, 'PropertyTextLabelKey is undefined');
		assert.equal(representation.getPropertyKind('propertyOne'), undefined, 'PropertyKind is undefined');
	});
	QUnit.test("Set & Get propertyTextLabelKey", function(assert){
		var representation = new this.inject.constructors.Representation("xyz", this.inject);
		representation.addProperty('propertyOne');
		representation.setPropertyTextLabelKey('propertyOne', 'labelKey');
		assert.equal(representation.getPropertyTextLabelKey('propertyOne'),'labelKey','set labelKey is returned');
	});
	QUnit.test("Set & Get hierarchyProperty & textLabelKey & display option", function(assert){
		var representation = new this.inject.constructors.Representation("xyz", this.inject);
		representation.setHierarchyProperty('hierarchyProperty');
		representation.setHierarchyPropertyTextLabelKey('textKey');
		representation.setHierarchyPropertyLabelDisplayOption('Text');
		assert.equal(representation.getHierarchyProperty(), "hierarchyProperty", "HierarchyProperty returned");
		assert.equal(representation.getHierarchyPropertyTextLabelKey(), "textKey", "HierarchyPropertyTextLabelKey returned");
		assert.equal(representation.getHierarchyPropertyLabelDisplayOption(), "Text", "HierarchyPropertyLabelDisplayOption returned");
		representation.setHierarchyProperty('hierarchyProperty2');
		assert.equal(representation.getHierarchyPropertyTextLabelKey(), undefined, "HierarchyPropertyTextLabelKey is resetted when hierarchyProperty is changed");
		assert.equal(representation.getHierarchyPropertyLabelDisplayOption(), undefined, "HierarchyPropertyLabelDisplayOption returned");
	});
	QUnit.test("Set & Get propertyKind", function(assert){
		var representation = new this.inject.constructors.Representation("xyz", this.inject);
		representation.addProperty('propertyOne');
		representation.setPropertyKind('propertyOne', 'kind');
		assert.equal(representation.getPropertyKind('propertyOne'),'kind','set kind is returned');
	});
	QUnit.test("width", function(assert) {
		var representation = new this.inject.constructors.Representation("xyz", this.inject);
		representation.setWidthProperty(keyHugo, keyText4711);
		assert.equal(representation.getWidthProperties()[keyHugo], keyText4711, "WHEN setWidthProperty(x) THEN getWidthProperties returns x");
		representation.setWidthProperty(keyHugo, keyText42);
		assert.equal(representation.getWidthProperties()[keyHugo], keyText42, "WHEN setWidthProperty(x) overwrite THEN getWidthProperties returns x");
	});
	QUnit.test("orderby", function(assert) {
		var representation = new this.inject.constructors.Representation("xyz", this.inject);
		representation.addOrderbySpec(keyHugo, true);
		assert.equal(representation.getOrderbySpecifications()[0].property, keyHugo, "WHEN addOrderbySpec THEN getOrderbySpecifications returns propertyName");
		assert.equal(representation.getOrderbySpecifications()[0].ascending, true, "WHEN addOrderbySpec THEN getOrderbySpecifications returns ascending");
		representation.addOrderbySpec(keyMara, false);
		assert.equal(representation.getOrderbySpecifications()[1].property, keyMara, "WHEN addOrderbySpec THEN getOrderbySpecifications returns propertyName");
		assert.equal(representation.getOrderbySpecifications()[1].ascending, false, "WHEN addOrderbySpec THEN getOrderbySpecifications returns ascending");
	});
	QUnit.test("topN", function(assert) {
		var representation = new this.inject.constructors.Representation("xyz", this.inject);
		assert.equal(representation.getTopN(), undefined, "WHEN no top N is set, then getTopN returns undefined");
		representation.setTopN(42);
		assert.equal(representation.getTopN(), 42, "WHEN no top N is set, then getTopN returns this value");
	});
	QUnit.test("displayOption for dimensions", function(assert){
		var representation = new this.inject.constructors.Representation("xyz", this.inject);
		assert.equal(representation.getLabelDisplayOption(keyHugo), undefined, "initial displayOption is undefined");

		representation.setLabelDisplayOption(keyHugo, displayOptions.TEXT);
		assert.equal(representation.getLabelDisplayOption(keyHugo), undefined, "undefined displayOption for non-dimension property");

		representation.addDimension(keyHugo);
		representation.setLabelDisplayOption(keyHugo, displayOptions.TEXT);
		assert.equal(representation.getLabelDisplayOption(keyHugo, keyText4711), displayOptions.TEXT, "correct displayOption returned");

		representation.removeDimension(keyHugo);
		assert.equal(representation.getLabelDisplayOption(keyHugo), undefined, "undefined displayOption for non-dimension property");
	});
	QUnit.test("displayOption for measures", function(assert){
		var representation = new this.inject.constructors.Representation("xyz", this.inject);
		assert.equal(representation.getMeasureDisplayOption(keyHugo), undefined, "initial displayOption is undefined");

		representation.setMeasureDisplayOption(keyHugo, measureDisplayOptions.LINE);
		assert.equal(representation.getMeasureDisplayOption(keyHugo), undefined, "undefined displayOption for not defined property");

		representation.addMeasure(keyHugo);
		representation.setMeasureDisplayOption(keyHugo, measureDisplayOptions.LINE);
		assert.equal(representation.getMeasureDisplayOption(keyHugo, keyText4711), measureDisplayOptions.LINE, "correct displayOption returned");

		representation.removeMeasure(keyHugo);
		assert.equal(representation.getMeasureDisplayOption(keyHugo), undefined, "undefined displayOption for non-dimension property");
	});
	QUnit.test("Copy representation", function(assert) {
		var representation = new this.inject.constructors.Representation("xyz", this.inject);
		var newIdForCopy = "newIdForCopy";
		var copiedRepresentation = representation.copy();
		assert.equal(copiedRepresentation.getId(), representation.getId(), "Copied representation has same Id");
		representation.setLeftUpperCornerTextKey(keyText42);
		representation.setRightUpperCornerTextKey(keyText42);
		representation.setLeftLowerCornerTextKey(keyText42);
		representation.setRightLowerCornerTextKey(keyText42);
		var dimId1 = representation.addDimension(keyHugo, keyText4711);
		representation.addProperty('PropertyOne');
		representation.setDimensionKind(dimId1, kind42);
		representation.setWidthProperty(keyHugo, keyText4711);
		representation.addOrderbySpec(keyHugo, true);
		representation.addOrderbySpec(keyMara, false);
		representation.setLabelDisplayOption(keyHugo, displayOptions.TEXT);
		representation.setHierarchyProperty("hierarchyProperty");
		representation.setHierarchyPropertyTextLabelKey("key");
		representation.setHierarchyPropertyLabelDisplayOption("Text");
		representation.addMeasure(keyMara, keyText42);
		representation.setMeasureDisplayOption(keyMara, measureDisplayOptions.LINE);
		copiedRepresentation = representation.copy(newIdForCopy);
		assert.equal(copiedRepresentation.getId(), newIdForCopy, "Copied representation has the new Id");
		assert.equal(copiedRepresentation.getLeftUpperCornerTextKey(), keyText42, 'WHEN set left upper THEN left upper returned');
		assert.equal(copiedRepresentation.getRightUpperCornerTextKey(), keyText42, 'WHEN set right upper THEN right upper returned');
		assert.equal(copiedRepresentation.getRightLowerCornerTextKey(), keyText42, 'WHEN set right lower THEN right lower returned');
		assert.equal(copiedRepresentation.getDimensions()[0], dimId1, "WHEN getDimension THEN returns given instance");
		assert.equal(copiedRepresentation.getDimensionTextLabelKey(dimId1), keyText4711, "WHEN getDimensionTextLabelKey THEN returns text key");
		assert.equal(copiedRepresentation.getMeasureKind(keyHugo), undefined, "WHEN getMeasureKind THEN default is set");
		assert.equal(copiedRepresentation.getDimensionKind(dimId1), kind42, "WHEN setDimensionKind THEN getDimensionKind returns set value");
		assert.equal(copiedRepresentation.getProperties()[0], 'PropertyOne', "Property has been copied");
		assert.equal(copiedRepresentation.getWidthProperties()[keyHugo], keyText4711, "WHEN setWidthProperty(x) THEN getWidthProperties returns x");
		assert.equal(copiedRepresentation.getOrderbySpecifications()[0].property, keyHugo, "WHEN addOrderbySpec THEN getOrderbySpecifications returns propertyName");
		assert.equal(copiedRepresentation.getOrderbySpecifications()[0].ascending, true, "WHEN addOrderbySpec THEN getOrderbySpecifications returns ascending");
		assert.equal(copiedRepresentation.getOrderbySpecifications()[1].property, keyMara, "WHEN addOrderbySpec THEN getOrderbySpecifications returns propertyName");
		assert.equal(copiedRepresentation.getOrderbySpecifications()[1].ascending, false, "WHEN addOrderbySpec THEN getOrderbySpecifications returns ascending");
		assert.equal(copiedRepresentation.getLabelDisplayOption(keyHugo), displayOptions.TEXT, "WHEN setLabelDisplayOptions THEN getLabelDisplayOptions returns TEXT");
		assert.equal(copiedRepresentation.getHierarchyProperty(), representation.getHierarchyProperty(), "HierarchyProperty copied");
		assert.equal(copiedRepresentation.getHierarchyPropertyTextLabelKey(), representation.getHierarchyPropertyTextLabelKey(), "HierarchyPropertyTextLabelKey copied");
		assert.equal(copiedRepresentation.getHierarchyPropertyLabelDisplayOption(), representation.getHierarchyPropertyLabelDisplayOption(), "HierarchyPropertyLabelDisplayOption copied");
		assert.equal(copiedRepresentation.getMeasures()[0], keyMara, "WHEN getMeasures THEN returns given instance");
		assert.equal(copiedRepresentation.getMeasureDisplayOption(keyMara), measureDisplayOptions.LINE, "WHEN setMeasureDisplayOptions THEN getMeasureDisplayOptions returns LINE");
	});
}());