/* global QUnit sinon */

QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/providers/ControlProvider", "sap/ui/comp/odata/MetadataAnalyser", "sap/ui/comp/odata/CriticalityMetadata"

], function(ControlProvider, MetadataAnalyser, CriticalityMetadata) {
	"use strict";

	QUnit.module("sap.ui.comp.providers.ControlProvider", {
		beforeEach: function() {
			this.oControlProvider = new ControlProvider({
				processDataFieldDefault: true,
				metadataAnalyser: new MetadataAnalyser(),
				useUTCDateTime: true
			});
		},
		afterEach: function() {
			this.oControlProvider.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oControlProvider);
	});

	QUnit.test("Shall contain an instance of metadata analyser", function(assert) {
		assert.ok(this.oControlProvider._oMetadataAnalyser);
		assert.strictEqual(this.oControlProvider._oMetadataAnalyser instanceof MetadataAnalyser, true);
	});

	QUnit.test("Shall return the view metadata with Text as default template for field", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({});
		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Text"), true);
	});

	QUnit.test("Shall return the view metadata with Input as template for editable field", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({}, true);
		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Input"), true);
	});

	QUnit.test("Shall return the view metadata with DatePicker as template for date format field", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.DateTime",
			displayFormat: "Date"
		}, true);
		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.DatePicker"), true);

		var oValueBindingInfo = oFieldViewMetadata.template.getBindingInfo("value");
		assert.ok(oValueBindingInfo);
		assert.ok(oValueBindingInfo.type.isA("sap.ui.model.odata.type.DateTime"));
	});

	QUnit.test("Shall return the view metadata with UTC true in format options", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.DateTime"
		}, true);
		assert.ok(oFieldViewMetadata);
		assert.strictEqual(oFieldViewMetadata.modelType.oFormatOptions.UTC, true);
	});

	QUnit.test("Shall return the view metadata with DatePicker as template for IsCalendarDate field", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			isCalendarDate: true
		}, true);
		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.DatePicker"), true);
	});

	QUnit.test("Shall return the view metadata with right aligned Text as template for IsCalendarDate field", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			"com.sap.vocabularies.Common.v1.IsCalendarDate": {
				Bool: "true"
			}
		});
		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Text"), true);
		assert.equal(oFieldViewMetadata.align, "Right");
	});

	QUnit.test("Shall return the view metadata with right aligned Text as template for Calendar/FiscalYear annotated field", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			"com.sap.vocabularies.Common.v1.IsFiscalYear": {
				Bool: "true"
			}
		});
		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Text"), true);
		assert.equal(oFieldViewMetadata.align, "Right");
	});

	QUnit.test("Shall return the view metadata with right aligned Input control as template for Calendar/FiscalYear annotated field", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			"com.sap.vocabularies.Common.v1.IsFiscalYear": {
				Bool: "true"
			}
		}, true);
		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Input"), true);
		assert.equal(oFieldViewMetadata.template.getTextAlign(), "Right");
		assert.equal(oFieldViewMetadata.align, "Right");
	});

	QUnit.test("Shall return the view metadata with HBox as default template for Measure fields", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.Decimal",
			isMeasureField: true,
			unit: "bar"
		});
		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.HBox"), true);
	});

	QUnit.test("Shall return the view metadata with Text as default template for Measure fields without unit", function(assert) {
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.Decimal",
			isMeasureField: true
		});
		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Text"), true);
	});

	QUnit.test("Shall return the view metadata with Link as default template for IsEmailAddress and IsPhoneNumber annotations", function(assert) {
		// isEmailAddress
		var oFieldViewMetadataEmail = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			isEmailAddress: true
		});
		assert.ok(oFieldViewMetadataEmail);
		assert.equal(oFieldViewMetadataEmail.template.isA("sap.m.Link"), true, "Email address would be rendered as a link");

		// isPhoneNumber
		var oFieldViewMetadataPhone = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			isPhoneNumber: true
		});
		assert.ok(oFieldViewMetadataPhone);
		assert.equal(oFieldViewMetadataPhone.template.isA("sap.m.Link"), true, "Phone number would be rendered as a link");
	});

	QUnit.test("Shall return the view metadata with ObjectIdentifier as default template for fields with SemanticKey", function(assert) {
		var fSpy = this.spy(MetadataAnalyser, "resolveEditableFieldFor");
		assert.ok(fSpy.notCalled);

		// setup necessary properties
		this.oControlProvider._oSemanticKeyAnnotation = {
			semanticKeyFields: [
				"Product"
			]
		};
		this.oControlProvider._isMobileTable = true;

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "Product",
			type: "Edm.Decimal",
			unit: "UnitFieldPath"
		});

		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.ObjectIdentifier"), true);

		assert.ok(fSpy.notCalled); //no need to check "EditableFieldFor"
	});

	QUnit.test("Shall return the view metadata with ObjectIdentifier as default template for fields with SemanticKey (via EditableFieldFor)", function(assert) {
		var fSpy = this.spy(MetadataAnalyser, "resolveEditableFieldFor");
		assert.ok(fSpy.notCalled);

		this.oControlProvider._oSemanticKeyAnnotation = {
			semanticKeyFields: [
				"Product"
			]
		};
		this.oControlProvider._isMobileTable = true;

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.Decimal",
			description: "DescPath",
			// Dummy EditableFieldFor annotation pointing to some property
			"com.sap.vocabularies.Common.v1.EditableFieldFor": {
				PropertyPath: "Product"
			}
		});

		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.ObjectIdentifier"), true);

		assert.ok(fSpy.calledOnce);
	});

	QUnit.test("Shall return the view metadata with Link as default template for fields with URLInfo (via DataFieldDefault)", function(assert) {
		var fSpy = sinon.spy(this.oControlProvider._oMetadataAnalyser, "updateDataFieldDefault");
		assert.ok(fSpy.notCalled);

		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"notFoo"
			]
		};

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			// Dummy DataFieldWithURL --> URLInfo in UI.DataFieldDefault
			"com.sap.vocabularies.UI.v1.DataFieldDefault": {
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
				Label: "Label for foo",
				Url: {
					Path: "bar"
				}
			}
		});

		assert.ok(oFieldViewMetadata);
		assert.deepEqual(oFieldViewMetadata.urlInfo, {
			urlPath: "bar"
		});
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Link"), true);
		assert.ok(fSpy.calledOnce);
	});

	QUnit.test("Shall return the view metadata with ObjectStatus as default template for fields with Criticality (via DataFieldDefault)", function(assert) {
		var fSpy = sinon.spy(this.oControlProvider._oMetadataAnalyser, "updateDataFieldDefault");
		assert.ok(fSpy.notCalled);

		this.oControlProvider._oLineItemAnnotation = {};

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.Decimal",
			unit: "UnitFieldPath",
			// Dummy DataFieldWithURL --> CriticalityIno in UI.DataFieldDefault
			"com.sap.vocabularies.UI.v1.DataFieldDefault": {
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Label: "Label for foo",
				Criticality: {
					EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/Critical"
				},
				CriticalityRepresentation: {
					EnumMember: "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon"
				}
			}
		});

		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.ObjectStatus"), true);

		assert.ok(fSpy.calledOnce);
	});

	QUnit.test("Shall ignore DataFieldDefault when processing is disabled", function(assert) {
		var fSpy = sinon.spy(this.oControlProvider._oMetadataAnalyser, "updateDataFieldDefault");
		assert.ok(fSpy.notCalled);

		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"notFoo"
			]
		};

		assert.ok(this.oControlProvider._bProcessDataFieldDefault);

		this.oControlProvider._bProcessDataFieldDefault = false;

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			// Dummy DataFieldWithURL --> URLInfo in UI.DataFieldDefault
			"com.sap.vocabularies.UI.v1.DataFieldDefault": {
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
				Label: "Label for foo",
				Url: {
					Path: "bar"
				}
			}
		});

		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.urlInfo, undefined);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Text"), true);
		assert.ok(fSpy.notCalled);
	});

	QUnit.test("Shall return the view metadata with Link as default template for fields with URLInfo (regardless of table type)", function(assert) {
		var fSpy = sinon.spy(this.oControlProvider._oMetadataAnalyser, "updateDataFieldDefault");
		assert.ok(fSpy.notCalled);
		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"foo"
			]
		};
		// Dummy DataFieldWithURL --> URLInfo in UI.LineItem
		this.oControlProvider._oLineItemAnnotation.urlInfo = {
			"foo": {
				urlPath: "bar"
			}
		};

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			// Dummy DataFieldWithURL --> URLInfo in UI.DataFieldDefault
			"com.sap.vocabularies.UI.v1.DataFieldDefault": {
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
				Label: "Label for foo",
				Url: {
					Path: "NewPath"
				}
			}
		});

		assert.ok(oFieldViewMetadata);
		assert.deepEqual(oFieldViewMetadata.urlInfo, {
			urlPath: "bar"
		});
		assert.notEqual(oFieldViewMetadata.urlInfo.urlPath, "NewPath");
		assert.equal(oFieldViewMetadata.template.isA("sap.m.Link"), true);

		assert.ok(fSpy.notCalled);
	});

	QUnit.test("Shall return the view metadata with ObjectStatus as default template for fields with Criticality (regardless of table type)", function(assert) {

		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"foo"
			]
		};
		// Dummy DataField --> Criticality in UI.LineItem
		this.oControlProvider._oLineItemAnnotation.criticality = {
			"foo": {
				criticalityRepresentationType: "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon",
				criticalityType: "com.sap.vocabularies.UI.v1.CriticalityType/Critical"
			}
		};

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String"
		});

		assert.ok(oFieldViewMetadata);
		assert.equal(oFieldViewMetadata.template.isA("sap.m.ObjectStatus"), true);
	});

	QUnit.test("Shall return the view metadata with ObjectStatus as default template for fields with Criticality (regardless of table type), considering displayBehaviour", function(assert) {
		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"foo"
			]
		};
		this.oControlProvider._bEnableDescriptions = true;
		// Dummy DataField --> Criticality in UI.LineItem
		this.oControlProvider._oLineItemAnnotation.criticality = {
			"foo": {
				criticalityRepresentationType: "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon",
				criticalityType: "com.sap.vocabularies.UI.v1.CriticalityType/Critical"
			}
		};

		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String",
			description: "desc",
			displayBehaviour: "descriptionAndId"
		});

		assert.ok(oFieldViewMetadata);
		var oControl = oFieldViewMetadata.template;
		assert.equal(oControl.isA("sap.m.ObjectStatus"), true);

		// Descrition and displayBehaviour present --> Binding/info exists accordingly
		var oTextBindingInfo = oControl.getBindingInfo("text");
		assert.ok(oTextBindingInfo);
		assert.ok(oTextBindingInfo.formatter);
		assert.equal(oTextBindingInfo.parts.length, 2);
		assert.equal(oTextBindingInfo.parts[1].path, "desc");
	});

	QUnit.test("Criticality info (Both Static) -  shall be considered while creating ObjectStatusControl", function(assert) {
		this.oControlProvider._isMobileTable = true;
		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"foo"
			]
		};
		// With criticalityRepresentationType set to "WithoutIcon"
		this.oControlProvider._oLineItemAnnotation.criticality = {
			"foo": {
				criticalityRepresentationType: "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon",
				criticalityType: "com.sap.vocabularies.UI.v1.CriticalityType/Neutral"
			}
		};
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String"
		});
		assert.ok(oFieldViewMetadata);
		var oControl = oFieldViewMetadata.template;
		assert.equal(oControl.isA("sap.m.ObjectStatus"), true);

		// Static Criticality and Icon --> No binding/info exists
		assert.equal(oControl.getBindingInfo("state"), undefined);
		assert.equal(oControl.getBindingInfo("icon"), undefined);

		// Check Static Values
		assert.equal(oControl.getState(), "None");
		assert.equal(oControl.getIcon(), "");

		// Without criticalityRepresentationType enum --> default
		this.oControlProvider._oLineItemAnnotation.criticality = {
			"foo": {
				criticalityType: "com.sap.vocabularies.UI.v1.CriticalityType/Positive"
			}
		};
		oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String"
		});
		assert.ok(oFieldViewMetadata);
		oControl = oFieldViewMetadata.template;
		assert.equal(oControl.isA("sap.m.ObjectStatus"), true);

		// Static Criticality and Icon --> No binding/info exists
		assert.equal(oControl.getBindingInfo("state"), undefined);
		assert.equal(oControl.getBindingInfo("icon"), undefined);

		// Check Static Values
		assert.equal(oControl.getState(), "Success");
		assert.equal(oControl.getIcon(), "sap-icon://status-positive");
		assert.equal(oFieldViewMetadata.criticality, undefined);
		assert.equal(oFieldViewMetadata.criticalityRepresentation, undefined);
	});

	QUnit.test("Criticality info (only CriticalityType Static) -  shall be considered while creating ObjectStatusControl", function(assert) {
		this.oControlProvider._isMobileTable = true;
		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"foo"
			]
		};
		// With criticalityRepresentation pointing to a Path
		this.oControlProvider._oLineItemAnnotation.criticality = {
			"foo": {
				criticalityRepresentationPath: "PathToSomeField",
				criticalityType: "com.sap.vocabularies.UI.v1.CriticalityType/Neutral"
			}
		};
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String"
		});
		assert.ok(oFieldViewMetadata);
		var oControl = oFieldViewMetadata.template;
		assert.equal(oControl.isA("sap.m.ObjectStatus"), true);

		// Static Criticality --> No binding/info exists
		assert.equal(oControl.getBindingInfo("state"), undefined);
		assert.equal(oControl.getState(), "None");

		// Dynamic Value for Icon with value path and formatter
		var oIconBindingInfo = oControl.getBindingInfo("icon");
		assert.ok(oIconBindingInfo);
		assert.equal(oIconBindingInfo.parts.length, 1);
		assert.equal(oIconBindingInfo.parts[0].path, "PathToSomeField");
		var fIconFormatter = oIconBindingInfo.formatter;
		assert.ok(fIconFormatter);
		// returns icon for static criticality for any field value
		assert.equal(fIconFormatter("com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithIcon"), "sap-icon://status-inactive");
		assert.equal(fIconFormatter(), "sap-icon://status-inactive");

		// returns no-icon only when value is "WithoutIcon"
		assert.equal(fIconFormatter("com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon"), undefined);

		assert.equal(oFieldViewMetadata.criticality, undefined);
		assert.equal(oFieldViewMetadata.criticalityRepresentation, "PathToSomeField");
	});

	QUnit.test("Criticality info (only CriticalityRepresentationType Static) -  shall be considered while creating ObjectStatusControl", function(assert) {
		this.oControlProvider._isMobileTable = true;
		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"foo"
			]
		};
		// With criticality pointing to a Path && criticalityRepresentationType set to "WithoutIcon"
		this.oControlProvider._oLineItemAnnotation.criticality = {
			"foo": {
				criticalityRepresentationType: "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon",
				path: "PathToSomeCriticalityField"
			}
		};
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String"
		});
		assert.ok(oFieldViewMetadata);
		var oControl = oFieldViewMetadata.template;
		assert.equal(oControl.isA("sap.m.ObjectStatus"), true);

		// Dynamic Criticality but WithoutIcon --> No binding/info exists for icon
		assert.equal(oControl.getBindingInfo("icon"), undefined);
		assert.equal(oControl.getIcon(), "");

		// Dynamic Value for State with value path and formatter
		var oStateBindingInfo = oControl.getBindingInfo("state");
		assert.ok(oStateBindingInfo);
		assert.equal(oStateBindingInfo.parts.length, 1);
		assert.equal(oStateBindingInfo.parts[0].path, "PathToSomeCriticalityField");
		var fStateFormatter = oStateBindingInfo.formatter;
		assert.ok(fStateFormatter);
		// returns state based on the value/enum member name
		assert.equal(fStateFormatter(1), "Error");
		assert.equal(fStateFormatter("com.sap.vocabularies.UI.v1.CriticalityType/Critical"), "Warning");

		// returns nothing for invalid/unknown values
		assert.equal(fStateFormatter("foo"), undefined);
		assert.equal(fStateFormatter(), undefined);

		// Test With Icon
		delete this.oControlProvider._oLineItemAnnotation.criticality["foo"].criticalityRepresentationType;
		oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String"
		});
		assert.ok(oFieldViewMetadata);
		oControl = oFieldViewMetadata.template;
		assert.equal(oControl.isA("sap.m.ObjectStatus"), true);

		// Dynamic Criticality and icon --> Binding/info exists for icon
		var oIconBindingInfo = oControl.getBindingInfo("icon");
		assert.ok(oIconBindingInfo);
		assert.equal(oIconBindingInfo.parts.length, 1);
		assert.equal(oIconBindingInfo.parts[0].path, "PathToSomeCriticalityField");
		var fIconFormatter = oIconBindingInfo.formatter;
		assert.equal(fIconFormatter, CriticalityMetadata.getCriticalityIcon);
		// returns icon based on Criticality field value
		assert.equal(fIconFormatter(1), "sap-icon://status-negative");
		assert.equal(fIconFormatter("com.sap.vocabularies.UI.v1.CriticalityType/Critical"), "sap-icon://status-critical");

		// returns nothing for invalid/unknown values
		assert.equal(fIconFormatter("foo"), undefined);
		assert.equal(fIconFormatter(), undefined);

		assert.equal(oFieldViewMetadata.criticality, "PathToSomeCriticalityField");
		assert.equal(oFieldViewMetadata.criticalityRepresentation, undefined);
	});

	QUnit.test("Criticality info (both Dynamic Paths) -  shall be considered while creating ObjectStatusControl", function(assert) {
		this.oControlProvider._isMobileTable = true;
		this.oControlProvider._oLineItemAnnotation = {
			fields: [
				"foo"
			]
		};
		// With criticality pointing to a Path && criticalityRepresentationType set to "WithoutIcon"
		this.oControlProvider._oLineItemAnnotation.criticality = {
			"foo": {
				criticalityRepresentationPath: "PathToSomeField",
				path: "PathToSomeCriticalityField"
			}
		};
		var oFieldViewMetadata = this.oControlProvider.getFieldViewMetadata({
			name: "foo",
			type: "Edm.String"
		});
		assert.ok(oFieldViewMetadata);
		var oControl = oFieldViewMetadata.template;
		assert.equal(oControl.isA("sap.m.ObjectStatus"), true);

		// Dynamic Criticality and icon --> Binding/info exists for icon
		var oIconBindingInfo = oControl.getBindingInfo("icon");
		assert.ok(oIconBindingInfo);
		assert.equal(oIconBindingInfo.parts.length, 2);
		assert.equal(oIconBindingInfo.parts[0].path, "PathToSomeCriticalityField");
		assert.equal(oIconBindingInfo.parts[1].path, "PathToSomeField");
		var fIconFormatter = oIconBindingInfo.formatter;

		// returns icon based on Criticality field value
		assert.equal(fIconFormatter(1), "sap-icon://status-negative");
		assert.equal(fIconFormatter("com.sap.vocabularies.UI.v1.CriticalityType/Critical", "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithIcon"), "sap-icon://status-critical");

		// returns nothing for icon based on Criticality field value when WithoutIcon is explicitly specified
		assert.equal(fIconFormatter(2, "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon"), undefined);
		assert.equal(fIconFormatter("com.sap.vocabularies.UI.v1.CriticalityType/Critical", "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon"), undefined);

		// returns nothing for invalid/unknown values regardless of whether "WithoutIcon" is explicitly specified
		assert.equal(fIconFormatter("foo"), undefined);
		assert.equal(fIconFormatter(1, "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon"), undefined);
		assert.equal(fIconFormatter(), undefined);

		// Dynamic Value for State with value path and formatter
		var oStateBindingInfo = oControl.getBindingInfo("state");
		assert.ok(oStateBindingInfo);
		assert.equal(oStateBindingInfo.parts.length, 1);
		assert.equal(oStateBindingInfo.parts[0].path, "PathToSomeCriticalityField");
		var fStateFormatter = oStateBindingInfo.formatter;
		assert.ok(fStateFormatter);
		// returns state based on the value/enum member name
		assert.equal(fStateFormatter(1), "Error");
		assert.equal(fStateFormatter("com.sap.vocabularies.UI.v1.CriticalityType/Critical"), "Warning");

		// returns nothing for invalid/unknown values
		assert.equal(fStateFormatter("foo"), undefined);
		assert.equal(fStateFormatter(), undefined);

		assert.equal(oFieldViewMetadata.criticality, "PathToSomeCriticalityField");
		assert.equal(oFieldViewMetadata.criticalityRepresentation, "PathToSomeField");
	});

	QUnit.test("Destroy", function(assert) {
		assert.equal(this.oControlProvider.bIsDestroyed, undefined);
		this.oControlProvider.destroy();
		assert.equal(this.oControlProvider._oMetadataAnalyser, null);
		assert.equal(this.oControlProvider._aTableViewMetadata, null);
		assert.strictEqual(this.oControlProvider.bIsDestroyed, true);
	});

	QUnit.start();
});
