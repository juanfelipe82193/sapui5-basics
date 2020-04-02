/* global QUnit */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/smartfield/AnnotationHelper"
	],
	function(
			AnnotationHelper
	) {
	"use strict";

	QUnit.module("sap.ui.comp.smartfield.AnnotationHelper", {
		beforeEach: function() {
			this.oMetaData = new AnnotationHelper();
		},
		afterEach: function() {
			this.oMetaData.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oMetaData);
	});

	QUnit.test("_getObject", function(assert) {
		var oObject;
		var oProp = {
				"property": {
					"name": "Supplier",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcSupplier",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
					"sap:field-control": "UxFcSupplier",
					"sap:sortable": "false",
					"com.sap.vocabularies.Common.v1.Text": {
						"Path": "SupplierName"
					},
					"com.sap.vocabularies.Common.v1.SemanticObject": {
						"String": "Supplier"
					},
					"com.sap.vocabularies.Common.v1.Masked": {
						"Bool": "true"
					}
				},
				"typePath": "Supplier"
		};

		oObject = this.oMetaData._getObject("com.sap.vocabularies.Common.v1.Text/Path", oProp.property);
		assert.equal(oObject, "SupplierName");

		oObject = this.oMetaData._getObject("com.sap.vocabularies.Common.v1.SemanticObject/String", oProp.property);
		assert.equal(oObject, "Supplier");

		oObject = this.oMetaData._getObject("com.sap.vocabularies.Common.v1.Semantic/String", oProp.property);
		assert.equal(!oObject, true);

		oObject = this.oMetaData._getObject("com.sap.vocabularies.Common.v1.SemanticObject/Strong", oProp.property);
		assert.equal(!oObject, true);

		oObject = this.oMetaData._getObject("p1/p2/p3/p4", oProp.property);
		assert.equal(!oObject, true);

		oObject = this.oMetaData._getObject("com.sap.vocabularies.Common.v1.Masked/Bool", oProp.property);
		assert.equal(!!oObject, true);
	});

	QUnit.test("getText", function(assert) {
		var oObject;
		var oProp = {
				"property": {
					"name": "Supplier",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcSupplier",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
					"sap:field-control": "UxFcSupplier",
					"sap:sortable": "false",
					"com.sap.vocabularies.Common.v1.Text": {
						"Path": "SupplierName"
					},
					"com.sap.vocabularies.Common.v1.SemanticObject": {
						"String": "Supplier"
					}
				},
				"typePath": "Supplier"
		};

		oObject = this.oMetaData.getText(oProp.property);
		assert.equal(oObject, "SupplierName");
	});

	QUnit.test("getQuickInfo", function(assert) {
		var oObject;
		var oProp = {
				"property": {
					"name": "Supplier",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "10",
					"extensions": [{
						"name": "field-control",
						"value": "UxFcSupplier",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
					"sap:field-control": "UxFcSupplier",
					"sap:sortable": "false",
					"com.sap.vocabularies.Common.v1.QuickInfo": {
						"String": "Supplier Name"
					},
					"com.sap.vocabularies.Common.v1.SemanticObject": {
						"String": "Supplier"
					}
				},
				"typePath": "Supplier"
		};

		oObject = this.oMetaData.getQuickInfo(oProp.property);
		assert.equal(oObject, "Supplier Name");
	});

	QUnit.test("getUnit", function(assert) {
		var oObject;
		var oProp = {
				"property": {
					"name": "GrossAmount",
					"type": "Edm.Decimal",
					"precision": "16",
					"scale": "3",
					"extensions": [{
						"name": "unit",
						"value": "CurrencyCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Gross Amt.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
					"sap:unit": "CurrencyCode",
					"sap:label": "Gross Amt.",
					"sap:creatable": "false",
					"sap:updatable": "false",
					"Org.OData.Measures.V1.ISOCurrency": {
						"Path": "CurrencyCode"
					}
				},
				"typePath": "GrossAmount"
		};

		oObject = this.oMetaData.getUnit(oProp.property);
		assert.equal(oObject, "CurrencyCode");
	});

	QUnit.test("isCurrency", function(assert) {
		var oObject;
		var oProp = {
				"property": {
					"name": "GrossAmount",
					"type": "Edm.Decimal",
					"precision": "16",
					"scale": "3",
					"extensions": [{
						"name": "unit",
						"value": "CurrencyCode",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "label",
						"value": "Gross Amt.",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
					"sap:unit": "CurrencyCode",
					"sap:label": "Gross Amt.",
					"sap:creatable": "false",
					"sap:updatable": "false",
					"Org.OData.Measures.V1.ISOCurrency": {
						"Path": "CurrencyCode"
					}
				},
				"typePath": "GrossAmount"
		};

		oObject = this.oMetaData.isCurrency(oProp.property);
		assert.equal(oObject, true);
	});

	// BCP: 1980277852
	QUnit.test("isCurrency (test case 2)", function(assert) {
		var oEdmProperty = {
			"name": "Amount",
			"type": "Edm.Decimal",
			"precision": "11",
			"scale": "3",
			"nullable": "false",
			"Org.OData.Measures.V1.ISOCurrency": {
				"Path": "RecCurr"
			}
		};

		assert.ok(this.oMetaData.isCurrency(oEdmProperty));
	});

	QUnit.test("isUpperCase", function(assert) {
		var oObject;
		var oProp = {
				"property": {
					"name": "Description",
					"type": "Edm.String",
					"extensions": [{
						"name": "label",
						"value": "Time Stamp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
					"sap:label": "Time Stamp",
					"sap:creatable": "false",
					"sap:updatable": "false",
					"com.sap.vocabularies.Common.v1.IsUpperCase": {
						"Bool": "true"
					}
				},
				"typePath": "CreatedAt"
		};

		oObject = this.oMetaData.isUpperCase(oProp.property);
		assert.equal(oObject, true);
	});

	QUnit.test("isMasked", function(assert) {
		var oProperty, oResult;

		oProperty = {
				"property": {
					"name": "CreatedAt",
					"type": "Edm.DateTime",
					"precision": "7",
					"extensions": [{
						"name": "label",
						"value": "Time Stamp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
					"sap:label": "Time Stamp",
					"sap:creatable": "false",
					"sap:updatable": "false",
					"com.sap.vocabularies.Common.v1.Masked": {
						"Bool": "true"
					}
				},
				"typePath": "CreatedAt"
		};

		oResult = this.oMetaData.isMasked(oProperty.property);
		assert.equal(oResult, true);
	});

	QUnit.test("Multiline", function(assert) {
		var oProperty, oResult;

		oProperty = {
				"property": {
					"name": "CreatedAt",
					"type": "Edm.DateTime",
					"precision": "7",
					"extensions": [{
						"name": "label",
						"value": "Time Stamp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
					"sap:label": "Time Stamp",
					"sap:creatable": "false",
					"sap:updatable": "false",
					"com.sap.vocabularies.UI.v1.MultiLineText": {
						"Bool": "true"
					}
				},
				"typePath": "CreatedAt"
		};

		oResult = this.oMetaData.isMultiLineText(oProperty.property);
		assert.equal(oResult, true);
	});

	QUnit.test("getLabel", function(assert) {
		var oObject;
		var oProp = {
				"property": {
					"name": "Description",
					"type": "Edm.String",
					"extensions": [{
						"name": "label",
						"value": "Time Stamp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
					"sap:creatable": "false",
					"sap:updatable": "false",
					"com.sap.vocabularies.Common.v1.Label": {
						"String": "My Test Label"
					}
				},
				"typePath": "CreatedAt"
		};

		oObject = this.oMetaData.getLabel(oProp.property);
		assert.equal(oObject, "My Test Label");
	});

	QUnit.test("canUpdateEntitySet", function(assert) {
		var oEntitySet, oResult;

		oEntitySet = {
				"name": "POHeaders",
				"entityType": "MM_PUR_PO_MAINTAIN.POHeader",
				"extensions": [{
					"name": "searchable",
					"value": "true",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:searchable": "true",
				"sap:content-version": "1",
				"Org.OData.Capabilities.V1.UpdateRestrictions": {
					"Updatable": {
						"Bool": "false"
					}
				}
		};

		oResult = this.oMetaData.canUpdateEntitySet(oEntitySet);
		assert.equal(oResult, false);
	});

	QUnit.test("getUpdateEntitySetPath", function(assert) {
		var oEntitySet, oResult;

		oEntitySet = {
				"name": "POHeaders",
				"entityType": "MM_PUR_PO_MAINTAIN.POHeader",
				"extensions": [{
					"name": "searchable",
					"value": "true",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:searchable": "true",
				"sap:content-version": "1",
				"Org.OData.Capabilities.V1.UpdateRestrictions": {
					"Updatable": {
						"Path": "false"
					}
				}
		};

		oResult = this.oMetaData.getUpdateEntitySetPath(oEntitySet);
		assert.equal(oResult, "false");
	});

	QUnit.test("canUpdateProperty", function(assert) {
		var oProperty, oResult;

		oProperty = {
				"property": {
					"name": "CreatedAt",
					"type": "Edm.DateTime",
					"precision": "7",
					"extensions": [{
						"name": "label",
						"value": "Time Stamp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
					"sap:label": "Time Stamp",
					"sap:creatable": "false",
					"sap:updatable": "false",
					"Org.OData.Core.V1.Computed": {
						"Bool": "true"
					}
				},
				"typePath": "CreatedAt"
		};

		oResult = this.oMetaData.canUpdateProperty(oProperty.property);
		assert.equal(oResult, false);
	});

	QUnit.test("canUpdatePropertyStatic - field control", function(assert) {
		var oProperty, oResult;

		oProperty = {
				"name": "CreatedAt",
				"type": "Edm.DateTime",
				"precision": "7",
				"extensions": [{
					"name": "label",
					"value": "Time Stamp",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Time Stamp",
				"sap:creatable": "false",
				"com.sap.vocabularies.Common.v1.FieldControl": {
					"EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly"
				}
		};

		oResult = this.oMetaData.canUpdateProperty(oProperty);
		assert.equal(oResult, false);
	});

	QUnit.test("canCreateEntitySet", function(assert) {
		var oEntitySet, oResult;

		oEntitySet = {
				"name": "POHeaders",
				"entityType": "MM_PUR_PO_MAINTAIN.POHeader",
				"extensions": [{
					"name": "searchable",
					"value": "true",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:searchable": "true",
				"sap:content-version": "1",
				"Org.OData.Capabilities.V1.InsertRestrictions": {
					"Insertable": {
						"Bool": "false"
					}
				}
		};

		oResult = this.oMetaData.canCreateEntitySet(oEntitySet);
		assert.equal(oResult, false);
	});

	QUnit.test("canCreateProperty", function(assert) {
		var oProperty, oResult;

		oProperty = {
				"property": {
					"name": "CreatedAt",
					"type": "Edm.DateTime",
					"precision": "7",
					"extensions": [{
						"name": "label",
						"value": "Time Stamp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
					"sap:label": "Time Stamp",
					"sap:creatable": "true",
					"sap:updatable": "false",
					"Org.OData.Core.V1.Immutable": {
						"Bool": "true"
					}
				},
				"typePath": "CreatedAt"
		};

		oResult = this.oMetaData.canCreateProperty(oProperty.property);
		assert.equal(oResult, true);

		oProperty = {
				"property": {
					"name": "CreatedAt",
					"type": "Edm.DateTime",
					"precision": "7",
					"extensions": [{
						"name": "label",
						"value": "Time Stamp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "true",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
					"sap:label": "Time Stamp",
					"Org.OData.Core.V1.Immutable": {
						"Bool": "true"
					}
				},
				"typePath": "CreatedAt"
		};

		oResult = this.oMetaData.canCreateProperty(oProperty.property);
		assert.equal(oResult, true);

		oProperty = {
				"property": {
					"name": "CreatedAt",
					"type": "Edm.DateTime",
					"precision": "7",
					"extensions": [{
						"name": "label",
						"value": "Time Stamp",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "updatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
					"sap:label": "Time Stamp",
					"Org.OData.Core.V1.Computed": {
						"Bool": "true"
					}
				},
				"typePath": "CreatedAt"
		};

		oResult = this.oMetaData.canCreateProperty(oProperty.property);
		assert.equal(oResult, false);

		oResult = this.oMetaData.canCreateProperty({});
		assert.equal(oResult, true);
	});

	QUnit.test("getFieldControlPath", function(assert) {
		var oProperty, oResult;

		oProperty = {
				"name": "CreatedAt",
				"type": "Edm.DateTime",
				"com.sap.vocabularies.Common.v1.FieldControl": {
					"Path": "CreatedAt_FieldControl"
				}
		};

		oResult = this.oMetaData.getFieldControlPath(oProperty);
		assert.equal(oResult, "CreatedAt_FieldControl");
	});

	QUnit.test("getVisible", function(assert) {
		var oProperty, oResult;

		oProperty = {
				"name": "CreatedAt",
				"type": "Edm.DateTime",
				"precision": "7",
				"sap:label": "Time Stamp",
				"sap:creatable": "false",
				"com.sap.vocabularies.Common.v1.FieldControl": {
					"EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
				}
		};

		// field control statically set to hidden.
		oResult = this.oMetaData.getVisible(oProperty);
		assert.equal(oResult, "false");

		//UI hidden is evaluated
		delete oProperty["com.sap.vocabularies.Common.v1.FieldControl"];
		oProperty["com.sap.vocabularies.UI.v1.Hidden"] = { "Bool": "true" };
		oResult = this.oMetaData.getVisible(oProperty);
		assert.equal(oResult, "false");

		// sap visible now lifted v4 annotation win
		oProperty["sap:visible"] = "true";
		oResult = this.oMetaData.getVisible(oProperty);
		assert.equal(oResult, "false"); //visible is still false

		// default is "true"
		delete oProperty["sap:visible"];
		delete oProperty["com.sap.vocabularies.UI.v1.Hidden"];
		oResult = this.oMetaData.getVisible(oProperty);
		assert.equal(oResult, "true");

		//in case sap:visible was false by default
		oProperty["sap:visible"] = "false";
		oProperty["com.sap.vocabularies.Common.v1.FieldControl"] = { "EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Hidden" };
		oProperty["com.sap.vocabularies.UI.v1.Hidden"] = "true";
		oResult = this.oMetaData.getVisible(oProperty);
		assert.equal(oResult, "false");
	});

	QUnit.test("isStaticMandatory", function(assert) {

		var oResult;
		var oProperty = {
				"com.sap.vocabularies.Common.v1.FieldControl": {
					"EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
				}
		};

		oResult = this.oMetaData.isStaticMandatory(oProperty);
		assert.equal(oResult, true);
	});

	QUnit.test("getTextArrangement on entity type", function(assert) {
		var oProperty, oEntityType, sResult;

		oProperty = { };

		oEntityType = {
				"com.sap.vocabularies.UI.v1.TextArrangement" :  { EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"}
		};

		sResult = this.oMetaData.getTextArrangement(oProperty, oEntityType);
		assert.equal(sResult, "descriptionAndId");

		oEntityType = {
				"com.sap.vocabularies.UI.v1.TextArrangement" :  { EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"}
		};

		sResult = this.oMetaData.getTextArrangement(oProperty, oEntityType);
		assert.equal(sResult, "idAndDescription");
	});

	QUnit.test("getTextArrangement on property", function(assert) {
		var oEntityType, sResult;

		var oPropertySeparate = {
				"com.sap.vocabularies.Common.v1.Text" :  {
					"com.sap.vocabularies.UI.v1.TextArrangement" :  { EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate"}
				}
		};

		oEntityType = {
				"com.sap.vocabularies.UI.v1.TextArrangement" :  { EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"}
		};

		sResult = this.oMetaData.getTextArrangement(oPropertySeparate, oEntityType);
		assert.equal(sResult, "idOnly");

		var oPropertyDescr = {
				"com.sap.vocabularies.Common.v1.Text" :  {
					"com.sap.vocabularies.UI.v1.TextArrangement" :  { EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"}
				}
		};

		sResult = this.oMetaData.getTextArrangement(oPropertyDescr, oEntityType);
		assert.equal(sResult, "descriptionOnly");

		var oPropertyDescrId = {
				"com.sap.vocabularies.Common.v1.Text" :  {
					"com.sap.vocabularies.UI.v1.TextArrangement" :  { EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"}
				}
		};
		sResult = this.oMetaData.getTextArrangement(oPropertyDescrId, oEntityType);
		assert.equal(sResult, "descriptionAndId");

		var oPropertyIdDescr = {
				"com.sap.vocabularies.Common.v1.Text" :  {
					"com.sap.vocabularies.UI.v1.TextArrangement" :  { EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"}
				}
		};
			sResult = this.oMetaData.getTextArrangement(oPropertyIdDescr, oEntityType);
			assert.equal(sResult, "idAndDescription");
	});

	QUnit.test("Shall be destructible", function(assert) {
		this.oMetaData.destroy();
		assert.ok(this.oMetaData);
		assert.equal(this.oMetaData._oModel, null);
	});

	QUnit.start();

});
