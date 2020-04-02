/*globals QUnit*/

QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/designtime/smartform/GroupElement.designtime",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/layout/form/ResponsiveLayout",
	"sap/ui/layout/ResponsiveFlowLayoutData",
	"sap/ui/layout/VerticalLayout",
	"sap/ui/fl/registry/ChangeRegistry",
	"sap/ui/rta/plugin/Remove",
	"sap/ui/rta/command/CommandFactory",
	"sap/ui/dt/DesignTime",
	"sap/ui/dt/OverlayRegistry"
],
function(
	GroupElementDesignTimeMetadata,
	SmartField,
	GroupElement,
	Group,
	SmartForm,
	ResponsiveLayout,
	ResponsiveFlowLayoutData,
	VerticalLayout,
	ChangeRegistry,
	RemovePlugin,
	CommandFactory,
	DesignTime,
	OverlayRegistry
) {
	'use strict';

	if (window.blanket){
		window.blanket.options("sap-ui-cover-only", "[sap/ui/comp]");
	}

	QUnit.start();

	QUnit.module("Given the GroupElement DesignTime Metadata", {

	});

	QUnit.test("Action checks", function (assert) {
		var GEMetadata = GroupElementDesignTimeMetadata;
		assert.ok(GEMetadata.actions.remove && GEMetadata.actions.remove.changeType, "GroupElement designtime metadata include remove action");
		assert.ok(GEMetadata.actions.reveal && GEMetadata.actions.reveal.changeType, "GroupElement designtime metadata include reveal action");
		assert.ok(GEMetadata.actions.rename && GEMetadata.actions.rename.changeType, "GroupElement designtime metadata include rename action");
		assert.ok(GEMetadata.actions.combine && GEMetadata.actions.combine.changeType, "GroupElement designtime metadata include combine action");
		assert.ok(GEMetadata.actions.split && GEMetadata.actions.split.changeType, "GroupElement designtime metadata include split action");
	});

	QUnit.test('when checking if actions should be propagated for a button element', function (assert) {
		var oElement = {
			getMetadata : function(){
				return {
					getName : function(){
						return "sap.m.Button";
					}

				};
			}
		};

		assert.equal(
			GroupElementDesignTimeMetadata.aggregations.elements.propagateMetadata(oElement).actions,
			null,
			'then no actions are available'
		);
	});

	QUnit.test('when checking if actions should be propagated for a SmartLink element (outside of a SmartField)', function (assert) {
		var oElement = {
			getMetadata : function(){
				return {
					getName : function(){
						return "sap.ui.comp.navpopover.SmartLink";
					}

				};
			}
		};

		assert.equal(
			GroupElementDesignTimeMetadata.aggregations.elements.propagateMetadata(oElement),
			undefined,
			'then the actions will be propagated (no restriction is returned)'
		);
	});

	QUnit.test('when checking if actions should be propagated for a SmartLink element inside a SmartField', function (assert) {
		var oElement = {
			getMetadata : function(){
				return {
					getName : function(){
						return "sap.ui.comp.smartfield.SmartField";
					}

				};
			},
			getSemanticObjectController : function() {
				return true;
			}
		};

		assert.equal(
			GroupElementDesignTimeMetadata.aggregations.elements.propagateMetadata(oElement),
			undefined,
			'then the actions will be propagated (no restriction is returned)'
		);
	});

	QUnit.module("UseHorizontalLayout at designtime", {
		beforeEach: function(assert) {
			var done = assert.async();

			this.oSmartField01 = new SmartField("smartField01", {
				contextEditable: true,
				value: "smartField01-value",
				textLabel: "smartField01-label"
			});
			this.oSmartField02 = new SmartField("smartField02", {
				contextEditable: true,
				value: "smartField02-value",
				textLabel: "smartField02-label"
			});
			this.oGroupElement01 = new GroupElement("groupElement01", {
				label: "groupElement01",
				elements: [this.oSmartField01, this.oSmartField02]
			});
			this.oGroup01 = new Group("group01", {
				label: "group01",
				groupElements: [this.oGroupElement01]
			});
			this.oSmartForm01 = new SmartForm("smartForm01", {
				title: "smartForm01-title",
				tooltip: "smartForm01-tooltip",
				editable: true,
				flexEnabled: false,
				useHorizontalLayout: true,
				groups:[this.oGroup01]
			});
			this.oVerticalLayout = new VerticalLayout("layout01", {
				content : [this.oSmartForm01]
			}).placeAt("qunit-fixture");

			sap.ui.getCore().applyChanges();

			var oChangeRegistry = ChangeRegistry.getInstance();
			oChangeRegistry.registerControlsForChanges({
				"sap.ui.comp.smartform.GroupElement" : {
					"hideControl" : "default"
				},
				"sap.ui.comp.smartfield.SmartField" : {
					"hideControl" : "default"
				},
				"sap.m.FlexBox" : {
					"hideControl" : "default"
				}
			});

			this.oRemovePlugin = new RemovePlugin({
				commandFactory : new CommandFactory()
			});

			this.oDesignTime = new DesignTime({
				rootElements: [this.oVerticalLayout],
				plugins: [this.oRemovePlugin]
			});

			this.oDesignTime.attachEventOnce("synced", function() {
				this.oSmartField01Overlay = OverlayRegistry.getOverlay(this.oSmartField01);
				this.oGroupElement01Overlay = OverlayRegistry.getOverlay(this.oGroupElement01);
				done();
			}.bind(this));
		},
		afterEach: function(assert) {
			this.oVerticalLayout.destroy();
			this.oDesignTime.destroy();
		}
	});

	QUnit.test("when check for editable", function(assert) {
		var oFirstFieldsAggregationOverlay = this.oGroupElement01Overlay.getChildren()[0],
			oFirstFieldsElementOverlay = oFirstFieldsAggregationOverlay.getChildren()[0];
		assert.ok(this.oGroupElement01Overlay.isEditable(), "then GroupElement overlay should be editable");
		assert.notOk(this.oSmartField01Overlay.isEditable(), "then included SmartField overlay shouldn't be editable");
		assert.notOk(oFirstFieldsElementOverlay.isEditable(), "included SmartField overlay shouldn't be editable");
	});

	QUnit.test("when check for ignore fields with flexbox example", function(assert) {
		var oFirstFieldsElement = this.oGroupElement01.getFields()[0];
		assert.ok(oFirstFieldsElement instanceof sap.m.FlexBox, "then GroupElement first fields aggregation is a FlexBox");
		assert.strictEqual(OverlayRegistry.getOverlay(oFirstFieldsElement), undefined, "then there is not FlexBox overlay available");
	});
});