sap.ui.define([
	"sap/viz/ui5/controls/VizFrame",
	"sap/suite/ui/commons/ChartContainerContent",
	"sap/m/SelectionDetails",
	"sap/ui/core/Control",
	"sap/ui/base/Interface",
	"sap/ui/core/Item",
	"sap/m/SelectionDetailsItem",
	"sap/m/SelectionDetailsActionLevel"
], function (VizFrame, ChartContainerContent, SelectionDetails, Control, Interface, Item, SelectionDetailsItem, SelectionDetailsActionLevel) {
	// This function deletes cached information within VizFrame about themes and rendering.
	// We are not testing the VizFrame rendering part. We only need the VizFrame for testing ChartContainer Logic.
	// To avoid failing tests, we stub the function to avoid empty caches.
	sinon.stub(VizFrame.prototype, "_clearVariables");

	QUnit.module("ChartContainerContent Properties", {
		beforeEach: function () {
			var oVizFrame3 = new VizFrame({
				'width': '600px',
				'height': '300px',
				'vizType': 'bar',
				'uiConfig': {
					'applicationSet': 'fiori'
				},
				'vizProperties': {
					'plotArea': {
						'dataLabel': {
							'visible': 'true',
							'formatString': "#,##0.00"
						}
					}
				}
			});
			this.oChartContainerContent = new ChartContainerContent({
				icon: "sap-icon://bubble-chart",
				title: "vizFrame Bubble Chart Sample",
				content: oVizFrame3
			});
			this.oChartContainerContent.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChartContainerContent.destroy();
			this.oChartContainerContent = null;
		}
	});

	QUnit.test("'exit' method destroys sap.m.SelectionDetails instance", function (assert) {
		//Arrange
		var oSpy = sinon.spy(this.oChartContainerContent._oSelectionDetails, "destroy");
		//Act
		this.oChartContainerContent.destroy();
		//Assert
		assert.ok(oSpy.called, "'destroy' method on SelectionDetails called");
	});

	QUnit.test("ChartContainerContent Default Property Values", function (assert) {
		assert.equal(this.oChartContainerContent.getIcon(), "sap-icon://bubble-chart", "chartContainerContent has icon");
		assert.equal(this.oChartContainerContent.getTitle(), "vizFrame Bubble Chart Sample", "chartContainerContent has title");
		assert.ok(this.oChartContainerContent.getContent(0) instanceof VizFrame, "Should be an instance of new sap.viz.ui5.controls.VizFrame");
		var sVizType = 'bar';
		assert.equal(this.oChartContainerContent.getContent(0).getVizType(), sVizType, "viz type should be bar");
	});

	QUnit.module("The '_selectionDetailsItemFactory' method and its registration", {
		beforeEach: function () {
			this.oSpy = sinon.spy(SelectionDetails.prototype, "registerSelectionDetailsItemFactory");
			this.oContent = new ChartContainerContent();
		},
		afterEach: function () {
			this.oSpy.restore();
			this.oSpy = null;
			this.oContent.destroy();
			this.oContent = null;
		}
	});

	QUnit.test("Factory function registered on initialization of ChartContainer", function (assert) {
		// Arrange
		var fnFactory = ChartContainerContent._selectionDetailsItemFactory;
		// Assert
		assert.deepEqual(this.oSpy.getCall(0).args[0], fnFactory, "'registerSelectionDetailsItemFactory' method of SelectionDetails was called with correct argument");
	});

	QUnit.test("The '_selectionDetailsItemFactory' constructs items correctly", function (assert) {
		// Arrange
		var aDisplayData = [
			{
				id: "ProductCategory",
				label: "Product Category",
				type: "Dimension",
				unbound: false,
				unit: "",
				value: "Laptop"
			}, {
				id: "Price",
				label: "Price",
				type: "Measure",
				unbound: false,
				unit: "EUR",
				value: "939,00"
			}
		];
		// Act
		var oResult = ChartContainerContent._selectionDetailsItemFactory(aDisplayData);
		// Assert
		assert.deepEqual(oResult.getLines()[0].getLabel(), aDisplayData[0].label, "The dimension line of the created item has correct label");
		assert.deepEqual(oResult.getLines()[0].getValue(), aDisplayData[0].value, "The dimension line of the created item has correct value");
		assert.deepEqual(oResult.getLines()[0].getUnit(), aDisplayData[0].unit, "The dimension line of the created item has correct unit");
		assert.deepEqual(oResult.getLines()[1].getLabel(), aDisplayData[1].label, "The measure line of the created item has correct label");
		assert.deepEqual(oResult.getLines()[1].getValue(), aDisplayData[1].value, "The measure line of the created item has correct value");
		assert.deepEqual(oResult.getLines()[1].getUnit(), aDisplayData[1].unit, "The measure line of the created item has correct unit");
	});

	QUnit.module("Private methods", {
		beforeEach: function () {
			this.oContent = new ChartContainerContent();
		},
		afterEach: function () {
			this.oContent.destroy();
			this.oContent = null;
		}
	});

	QUnit.test("The '_getSelectionDetails' method when content is VizFrame", function (assert) {
		// Arrange
		var oVizFrame = new VizFrame();
		this.oContent.setContent(oVizFrame);
		// Act
		sap.ui.getCore().applyChanges();
		// Assert
		assert.equal(this.oContent._getSelectionDetails().getMetadata().getName(), "sap.m.SelectionDetails", "_getSelectionDetails returns SelectionDetails instance");
	});

	QUnit.test("The '_getSelectionDetails' method when content is not VizFrame", function (assert) {
		// Arrange
		var oControl = new Control();
		this.oContent.setContent(oControl);
		// Act
		sap.ui.getCore().applyChanges();
		// Assert
		assert.notOk(this.oContent._getSelectionDetails(), "_getSelectionDetails returns null if the content is not VizFrame");
	});

	QUnit.module("Public methods", {
		beforeEach: function () {
			this.oContent = new ChartContainerContent();
		},
		afterEach: function () {
			this.oContent.destroy();
			this.oContent = null;
		}
	});

	QUnit.test("The 'getSelectionDetails' method", function (assert) {
		// Assert
		assert.ok(this.oContent.getSelectionDetails() instanceof Interface, "getSelectionDetails always returns SelectionDetails facade");
	});

	QUnit.module("Registering and deregistering for the '_selectionDetails' event", {
		beforeEach: function () {
			this.oContent = new ChartContainerContent().placeAt("qunit-fixture");
		},
		afterEach: function () {
			this.oContent.destroy();
			this.oContent = null;
		}
	});

	QUnit.test("Registering and deregistering for the '_selectionDetails' event", function (assert) {
		//Arrange
		this.oVizFrame = new VizFrame();
		this.oContent.setContent(this.oVizFrame);
		var oDetachSpy = sinon.spy(this.oContent._oSelectionDetails, "detachSelectionHandler");
		var oAttachSpy = sinon.spy(this.oContent._oSelectionDetails, "attachSelectionHandler");
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.deepEqual(oDetachSpy.getCall(0).args[0], "_selectionDetails", "'detachSelectionHandler' method of Selection Details was called");
		assert.deepEqual(oAttachSpy.getCall(0).args[0], "_selectionDetails", "'attachSelectionHandler' method of Selection Details was called");
		assert.deepEqual(oAttachSpy.getCall(0).args[1], this.oVizFrame, "'attachSelectionHandler' method of Selection Details was called with correct argument");
	});

	QUnit.test("Registering and deregistering for the '_selectionDetails' event, if no content is in ChartContainerContent", function (assert) {
		//Arrange
		var oDetachSpy = sinon.spy(this.oContent._oSelectionDetails, "detachSelectionHandler");
		var oAttachSpy = sinon.spy(this.oContent._oSelectionDetails, "attachSelectionHandler");
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.deepEqual(oDetachSpy.callCount, 1, "'detachSelectionHandler' method of Selection Details was called");
		assert.deepEqual(oAttachSpy.callCount, 0, "'attachSelectionHandler' method of Selection Details was not called");
	});

	QUnit.module("Attaching / detaching of events returns facade", {
		beforeEach: function () {
			var oContentContent = new Control();
			oContentContent.getMetadata().getName = function () {
				return "sap.viz.ui5.controls.VizFrame";
			};
			this.oContent = new ChartContainerContent({
				content: [oContentContent]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oContent.destroy();
			this.oContent = null;
		}
	});

	QUnit.test("Only callback method attached", function (assert) {
		var oSelectionDetailsFacade = this.oContent.getSelectionDetails(),
			oSelectionDetails = this.oContent._getSelectionDetails();
		//Arrange
		oSelectionDetailsFacade.attachBeforeOpen(onBeforeOpen);
		//Act
		oSelectionDetails.fireBeforeOpen();

		//Assert
		function onBeforeOpen(oEvent) {
			assert.deepEqual(oEvent.getSource(), oSelectionDetailsFacade, "Event method 'getSource' returned SelectionDetailsFacade");
			assert.deepEqual(this, oSelectionDetailsFacade, "Event callback context is SelectionDetailsFacade");
		}
	});

	QUnit.test("Callback method with data", function (assert) {
		var oSelectionDetailsFacade = this.oContent.getSelectionDetails(),
			oSelectionDetails = this.oContent._getSelectionDetails();
		//Arrange
		oSelectionDetailsFacade.attachBeforeOpen("someData", onBeforeOpen);
		//Act
		oSelectionDetails.fireBeforeOpen();

		//Assert
		function onBeforeOpen(oEvent, oData) {
			assert.deepEqual(oEvent.getSource(), oSelectionDetailsFacade, "Event method 'getSource' returned SelectionDetailsFacade");
			assert.deepEqual(this, oSelectionDetailsFacade, "Event callback context is SelectionDetailsFacade");
			assert.equal(oData, "someData", "Optional 'oData' parameter is passed through");
		}
	});

	QUnit.test("Callback method with data and listener", function (assert) {
		var oSelectionDetailsFacade = this.oContent.getSelectionDetails(),
			oSelectionDetails = this.oContent._getSelectionDetails(),
			oCustomContext = {
				member: "otto4711"
			};
		//Arrange
		oSelectionDetailsFacade.attachBeforeOpen("someData", onBeforeOpen, oCustomContext);
		//Act
		oSelectionDetails.fireBeforeOpen();

		//Assert
		function onBeforeOpen(oEvent, oData) {
			assert.deepEqual(oEvent.getSource(), oSelectionDetailsFacade, "Event method 'getSource' returned SelectionDetailsFacade");
			assert.deepEqual(this, oCustomContext, "Event callback context is custom context");
			assert.equal(oData, "someData", "Optional 'oData' parameter is passed through");
		}
	});

	QUnit.test("Callback method and listener", function (assert) {
		var oSelectionDetailsFacade = this.oContent.getSelectionDetails(),
			oSelectionDetails = this.oContent._getSelectionDetails(),
			oCustomContext = {
				member: "otto4711"
			};
		//Arrange
		oSelectionDetailsFacade.attachBeforeOpen(onBeforeOpen, oCustomContext);
		//Act
		oSelectionDetails.fireBeforeOpen();

		//Assert
		function onBeforeOpen(oEvent, oData) {
			assert.deepEqual(oEvent.getSource(), oSelectionDetailsFacade, "Event method 'getSource' returned SelectionDetailsFacade");
			assert.deepEqual(this, oCustomContext, "Event callback context is custom context");
		}
	});

	QUnit.test("Event 'actionPress' exposes item's facades", function (assert) {
		var oSelectionDetails = this.oContent._getSelectionDetails(),
			oAction = new Item(),
			oItem = new SelectionDetailsItem({
				actions: [oAction]
			}),
			oItemFacade = oItem.getFacade();
		sap.ui.getCore().applyChanges();
		//Arrange
		this.oContent.getSelectionDetails().attachActionPress(onActionPress);
		//Act
		oSelectionDetails.fireActionPress({
			action: oAction,
			items: [oItem, oItem.clone()],
			level: SelectionDetailsActionLevel.Item
		});

		//Assert
		function onActionPress(oEvent) {
			var aItems = oEvent.getParameter("items");
			for (var i = 0; i < aItems.length; i++) {
				assert.deepEqual(aItems[i], oItemFacade, "Facade is returned");
			}
		}
	});

	QUnit.test("Event 'navigate' exposes item facade", function (assert) {
		var oSelectionDetails = this.oContent._getSelectionDetails(),
			oItem = new SelectionDetailsItem(),
			oItemFacade = oItem.getFacade();
		sap.ui.getCore().applyChanges();
		//Arrange
		this.oContent.getSelectionDetails().attachNavigate(onNavigate);
		//Act
		oSelectionDetails.fireNavigate({
			item: oItem
		});

		//Assert
		function onNavigate(oEvent) {
			assert.deepEqual(oEvent.getParameter("item"), oItemFacade, "Facade is returned");
		}
	});

	QUnit.test("Protected core event '_change' exposes instance", function (assert) {
		var oSelectionDetails = this.oContent._getSelectionDetails();
		//Arrange
		this.oContent.getSelectionDetails();
		oSelectionDetails.attachEvent("_change", onChange);
		//Act
		oSelectionDetails.fireEvent("_change");

		//Assert
		function onChange(oEvent) {
			assert.deepEqual(oEvent.getSource(), oSelectionDetails, "Instance is returned");
		}
	});

	QUnit.test("Check proxy event list", function (assert) {
		var oChartContainerContent = ChartContainerContent;
		//Assert
		assert.equal(oChartContainerContent._aProxyEvent.indexOf("beforeOpen"), 0, "Event 'beforeOpen' is part of the event list");
		assert.equal(oChartContainerContent._aProxyEvent.indexOf("beforeClose"), 1, "Event 'beforeClose' is part of the event list");
		assert.equal(oChartContainerContent._aProxyEvent.indexOf("navigate"), 2, "Event 'navigate' is part of the event list");
		assert.equal(oChartContainerContent._aProxyEvent.indexOf("actionPress"), 3, "Event 'actionPress' is part of the event list");
	});
});
