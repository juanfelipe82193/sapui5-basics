/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function(){
	'use strict';

	sap.ui.define([
		"sap/ui/comp/smartfield/SmartLabel",
		"sap/ui/comp/smartfield/SmartField",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/BindingMode",
		"sap/m/Input"
		],
		function(
				SmartLabel,
				SmartField,
				JSONModel,
				BindingMode,
				Input
		) {

		var oProperty = {
			"property": {
				"com.sap.vocabularies.Common.v1.Label" : {
					"String": "Document Number"
				},
				"com.sap.vocabularies.Common.v1.QuickInfo" : {
					"String": "Accounting Document Number"
				}
			}
		};


		QUnit.test("Shall be instantiable", function(assert) {
			this.oSmartLabel = new SmartLabel();
			assert.ok(this.oSmartLabel);

			this.oSmartLabel.destroy();
			this.oSmartLabel = null;
		});

		QUnit.test("createSmartLabelControl", function(assert) {
			this.oSmartLabel = new SmartLabel();
			var oField = {
				getComputedTextLabel: function() { return "Document Number"; },
				getVisible : function() { return true; },
				getMandatory: function() { return true; },
				getTextLabel: function() { return null; },
				getTooltipLabel: function() { return null; },
				getDataProperty: function() { return oProperty; },
				getBindingInfo: function() { return null; },
				getEditable: function() { return true; },
				getContextEditable: function() { return true; },
				getId: function() { return "me"; }
			};

			sinon.stub(this.oSmartLabel, "_getField").returns(oField);
			this.oSmartLabel.setLabelFor(oField);

			assert.equal(this.oSmartLabel.getText(), "Document Number");
			assert.equal(this.oSmartLabel.getTooltip(), "Accounting Document Number");

			this.oSmartLabel.destroy();
			this.oSmartLabel = null;
		});

		QUnit.test("SmartLabel isRequired returns SmartFields mandatory", function(assert) {
			this.oSmartLabel = new SmartLabel();
			var oSmartField = new SmartField({
				mandatory: true
			});

			this.oSmartLabel.setLabelFor(oSmartField);
			assert.ok(this.oSmartLabel.isRequired(), "SmartLabel isRequred is true, so SmartLabel is rendered as required");
			oSmartField.setMandatory(false);
			assert.notOk(this.oSmartLabel.isRequired(), "SmartLabel isRequred is false, so SmartLabel is rendered as not required");
			oSmartField.destroy();

			this.oSmartLabel.destroy();
			this.oSmartLabel = null;
		});

		QUnit.test("getSmartLabel with binding", function(assert) {
			this.oSmartLabel = new SmartLabel();
			var oSmartField = new SmartField({
				textLabel: "{/textLabel}",
				tooltipLabel : "{/tooltipLabel}"
			});

			oSmartField.setMandatory(true);
			var oModel = new JSONModel({
				textLabel: "A",
				tooltipLabel: "B"
			});
			oModel.setDefaultBindingMode(BindingMode.TwoWay);
			oSmartField.setModel(oModel);

			this.oSmartLabel.setLabelFor(oSmartField);
			this.oSmartLabel.setModel(oModel);

			assert.ok(this.oSmartLabel.setRequired());

			oSmartField.fireInitialise();

			oModel.getData().textLabel = "LABEL";
			oModel.getData().tooltipLabel = "TOOLTIP";
			oModel.updateBindings(true);

			assert.equal(oSmartField.getTextLabel(), "LABEL");
			assert.equal(oSmartField.getTooltipLabel(), "TOOLTIP");
			assert.equal(this.oSmartLabel.getText(), oSmartField.getTextLabel());
			assert.equal(this.oSmartLabel.getTooltip(), oSmartField.getTooltipLabel());

			this.oSmartLabel.setText("TEST");
			oSmartField.destroy();

			this.oSmartLabel.destroy();
			this.oSmartLabel = null;
		});

		// BCP: 1770012147
		QUnit.test("it should react on visibility changes of the SmartField control regardless of the" +
				"binding mode being used", function(assert) {

			this.oSmartLabel = new SmartLabel();

			// system under test
			var oSmartField = new SmartField({
				visible: true
			});

			// arrange
			this.oSmartLabel.setLabelFor(oSmartField);

			// act
			oSmartField.setVisible(false);

			// assert
			assert.strictEqual(this.oSmartLabel.getVisible(), false);

			// cleanup
			oSmartField.destroy();

			this.oSmartLabel.destroy();
			this.oSmartLabel = null;
		});

		// BCP: 1770012147
		QUnit.test("it should react on visibility changes of the SmartField control regardless of the binding mode" +
				"being used", function(assert) {

			this.oSmartLabel = new SmartLabel();

			// system under test
			var oSmartField = new SmartField({
				visible: false
			});

			// arrange
			this.oSmartLabel.setLabelFor(oSmartField);

			// act
			oSmartField.setVisible(true);

			// assert
			assert.strictEqual(this.oSmartLabel.getVisible(), true);

			// cleanup
			oSmartField.destroy();

			this.oSmartLabel.destroy();
			this.oSmartLabel = null;
		});

		QUnit.test("it should react on visibility changes of the last associated control", function(assert) {

			this.oSmartLabel = new SmartLabel();

			// system under test
			var oSmartField1 = new SmartField({
				visible: false
			});
			var oSmartField2 = new SmartField({
				visible: false
			});

			// act
			this.oSmartLabel.setLabelFor(oSmartField1);

			// assert
			assert.strictEqual(this.oSmartLabel.getLabelFor(), oSmartField1.getId());

			// act
			this.oSmartLabel.setLabelFor(oSmartField2);

			// assert
			assert.strictEqual(this.oSmartLabel.getLabelFor(), oSmartField2.getId());

			// act
			oSmartField2.setVisible(true);

			// assert
			assert.strictEqual(this.oSmartLabel.getVisible(), true);

			// cleanup
			oSmartField1.destroy();
			oSmartField2.destroy();

			this.oSmartLabel.destroy();
			this.oSmartLabel = null;
		});

		// BCP: 1880303379
		QUnit.test("it should react on visibility changes of the SmartField control even if the control is NOT " +
				"initially rendered", function(assert) {

			var oSmartLabel = new SmartLabel();

			// arrange
			var FIELD_ID = "loremIpsumID";
			oSmartLabel.setLabelFor(FIELD_ID);

			// system under test
			var oSmartField = new SmartField(FIELD_ID, {
				visible: true
			});

			// arrange
			oSmartLabel.placeAt("qunit-fixture");
			oSmartField.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			// act
			oSmartField.setVisible(false);

			// assert
			assert.strictEqual(oSmartLabel.getVisible(), false);

			// cleanup
			oSmartField.destroy();

			oSmartLabel.destroy();
		});

		QUnit.test('it should detach the "visibleChanged" handler', function(assert) {

			this.oSmartLabel = new SmartLabel();

			// system under test
			var oSmartField = new SmartField({
				visible: false
			});

			// arrange
			this.oSmartLabel.setLabelFor(oSmartField);

			// act
			this.oSmartLabel.setLabelFor(null);

			// assert
			assert.strictEqual(this.oSmartLabel.getLabelFor(), null);
			assert.strictEqual(oSmartField.hasListeners("visibleChanged"), false);

			// cleanup
			oSmartField.destroy();

			this.oSmartLabel.destroy();
			this.oSmartLabel = null;
		});

		QUnit.test('it should detach the "visibleChanged" handler after destroy', function(assert) {

			this.oSmartLabel = new SmartLabel();

			// system under test
			var oSmartField = new SmartField({
				visible: false
			});

			// arrange
			this.oSmartLabel.setLabelFor(oSmartField);

			// act
			this.oSmartLabel.destroy();

			// assert
			assert.strictEqual(oSmartField.hasListeners("visibleChanged"), false);

			// cleanup
			oSmartField.destroy();

			this.oSmartLabel.destroy();
			this.oSmartLabel = null;
		});

		QUnit.test("method setLabelFor as object", function(assert) {
			this.oSmartLabel = new SmartLabel();
			var oSmartField = new SmartField();
			sinon.stub(this.oSmartLabel, "_setLabelFor");
			this.oSmartLabel.setLabelFor(oSmartField);
			assert.strictEqual(this.oSmartLabel.getLabelFor(), oSmartField.getId());
			assert.ok(this.oSmartLabel._sSmartFieldId === oSmartField.getId());
			assert.ok(this.oSmartLabel._setLabelFor.called);
			oSmartField.destroy();

			this.oSmartLabel.destroy();
			this.oSmartLabel = null;
		});

		QUnit.test("method setLabelFor as string", function(assert) {
			this.oSmartLabel = new SmartLabel();
			sinon.stub(this.oSmartLabel, "_setLabelFor");
			this.oSmartLabel.setLabelFor("SOME ID");
			assert.ok(this.oSmartLabel._sSmartFieldId);
			assert.ok(this.oSmartLabel._setLabelFor.called);

			this.oSmartLabel.destroy();
			this.oSmartLabel = null;
		});

		QUnit.test("method onBeforeRendering", function(assert) {
			this.oSmartLabel = new SmartLabel();
			var oSmartField = new SmartField();
			sinon.stub(this.oSmartLabel, "_setLabelFor");
			this.oSmartLabel._sSmartFieldId = oSmartField.getId();
			this.oSmartLabel.onBeforeRendering();

			assert.ok(this.oSmartLabel._getField() === oSmartField);
			assert.ok(this.oSmartLabel._setLabelFor.called);
			oSmartField.destroy();

			this.oSmartLabel.destroy();
			this.oSmartLabel = null;
		});

		QUnit.test("method updateLabelFor", function(assert) {

			this.oSmartLabel = new SmartLabel();

			var oField0 = new Input();
			var oField1 = new Input();
			var oField2 = new Input();

			var aControls = [oField0, oField1, oField2];

			this.oSmartLabel.updateLabelFor(aControls);

			var aLabelledBy1 = oField1.getAriaLabelledBy();
			var aLabelledBy2 = oField2.getAriaLabelledBy();
			var sField0Id = this.oSmartLabel.getLabelFor();

			assert.equal(1, aLabelledBy1.length);
			assert.equal(1, aLabelledBy2.length);
			assert.equal(sField0Id, oField0.getId());
			assert.deepEqual(aLabelledBy1, aLabelledBy2);
			assert.equal(this.oSmartLabel.getId(), aLabelledBy2[0]);

			this.oSmartLabel.destroy();
			this.oSmartLabel = null;
		});

		QUnit.test("method delay updateLabelFor", function(assert) {

			this.oSmartLabel = new SmartLabel();

			var oSmartField = new SmartField({
				textLabel: "{/textLabel}",
				tooltipLabel : "{/tooltipLabel}",
				mandatory: true
			});

			sinon.spy(this.oSmartLabel, "_lateUpdateLabelFor");
			sinon.spy(this.oSmartLabel, "_delayUpdateLabelFor");
			sinon.spy(this.oSmartLabel, "updateLabelFor");

			this.oSmartLabel.setLabelFor(oSmartField);
			this.oSmartLabel.onBeforeRendering();

			assert.ok(this.oSmartLabel._lateUpdateLabelFor.called);
			assert.ok(this.oSmartLabel._delayUpdateLabelFor.called);
			assert.ok(!this.oSmartLabel.updateLabelFor.calledOnce);

			oSmartField.fireInnerControlsCreated([]);

			assert.ok(this.oSmartLabel.updateLabelFor.calledOnce);
			oSmartField.destroy();

			this.oSmartLabel.destroy();
			this.oSmartLabel = null;
		});

		// BCP: 1780400550
		QUnit.test('updateAriaLabeledBy method should update the "ariaLabelledBy" association and avoid' +
				'duplicates', function(assert) {

			this.oSmartLabel = new SmartLabel();

			// arrange
			var oInput = new Input();
			var aControls = [oInput];

			// act
			this.oSmartLabel.updateAriaLabeledBy(aControls);
			this.oSmartLabel.updateAriaLabeledBy(aControls);

			// assert
			assert.strictEqual(oInput.getAriaLabelledBy().length, 1);
			assert.strictEqual(oInput.getAriaLabelledBy()[0], this.oSmartLabel.getId());

			// cleanup
			oInput.destroy();

			this.oSmartLabel.destroy();
			this.oSmartLabel = null;
		});

		QUnit.test("method _setProperty for 'text' attribute", function(assert) {
			this.oSmartLabel = new SmartLabel();
			sinon.spy(this.oSmartLabel, "setText");
			this.oSmartLabel._setProperty(this.oSmartLabel, "text", "HUGO");
			this.oSmartLabel._setProperty(this.oSmartLabel, "text", "EMIL");

			assert.equal(this.oSmartLabel.getText(), "HUGO");
			assert.ok(this.oSmartLabel.setText.calledOnce);

			this.oSmartLabel.destroy();
			this.oSmartLabel = null;
		});

		QUnit.test("it should have certain marker interfaces (aligned with the sap.m.Label control)", function(assert) {

			// system under test
			var oSmartLabel = new SmartLabel();

			// arrange
			var aInterfaces = oSmartLabel.getMetadata().getInterfaces();

			// assert
			assert.ok(aInterfaces.indexOf("sap.m.IHyphenation") !== -1);
			assert.ok(aInterfaces.indexOf("sap.m.IOverflowToolbarContent") !== -1);
			assert.ok(aInterfaces.indexOf("sap.ui.core.IShrinkable") !== -1);
			assert.ok(aInterfaces.indexOf("sap.ui.core.Label") !== -1);

			// cleanup
			oSmartLabel.destroy();
		});

		QUnit.start();

	});
});
