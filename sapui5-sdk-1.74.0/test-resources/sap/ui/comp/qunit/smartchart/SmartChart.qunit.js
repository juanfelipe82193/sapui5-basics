/* globals QUnit sinon */

QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/library", "sap/ui/fl/library" // Needed to be loaded earlier... TODO: Check the details and improve on fl side

], function(compLibrary, flLibrary // Needed to be loaded earlier... TODO: Check the details and improve on fl side

) {
	"use strict";

	sap.ui.require([
		"sap/ui/comp/smartchart/SmartChart", "sap/ui/comp/providers/ChartProvider", "sap/ui/comp/smartvariants/SmartVariantManagement", "sap/ui/comp/smartvariants/PersonalizableInfo", "sap/ui/model/Model", "sap/chart/Chart", "sap/m/OverflowToolbar", "sap/m/List", "sap/m/StandardListItem", "sap/ui/comp/smartfilterbar/SmartFilterBar", "sap/ui/comp/navpopover/NavigationPopoverHandler", "sap/m/SelectionDetails", "sap/ui/base/ManagedObject", "sap/chart/data/Dimension", "sap/m/Breadcrumbs", "sap/ui/comp/personalization/Controller", "sap/m/Table", "sap/m/Text", "sap/m/OverflowToolbarButton", "sap/m/Button", "sap/m/ToolbarSeparator", "sap/m/ToolbarSpacer", "sap/ui/core/CustomData", "sap/chart/data/Measure", "sap/ui/comp/navpopover/SemanticObjectController", "sap/ui/comp/util/FullScreenUtil", "sap/ui/model/json/JSONModel", "sap/ui/model/Context", "sap/m/SearchField", "sap/m/ResponsivePopover", "sap/m/Bar", "sap/base/Log", "sap/ui/Device"

	], function(SmartChart, ChartProvider, SmartVariantManagement, PersonalizableInfo, Model, Chart, OverflowToolbar, List, StandardListItem, SmartFilterBar, NavigationPopoverHandler, SelectionDetails, ManagedObject, Dimension, Breadcrumbs, PersoController, Table, Text, OverflowToolbarButton, Button, ToolbarSeparator, ToolbarSpacer, CustomData, Measure, SemanticObjectController, FullScreenUtil, JSONModel, Context, SearchField, ResponsivePopover, Bar, Log, Device

	) {
		QUnit.module("sap.ui.comp.smartchart.SmartChart", {
			beforeEach: function() {
				this.oSmartChart = new SmartChart();
				this.oSmartChart.setEnableAutoBinding(true);
				this.oSmartChart.setUseVariantManagement(false);
				this.oSmartChart.setUseChartPersonalisation(false);
			},
			afterEach: function() {
				this.oSmartChart.destroy();
				this.oSmartChart = null;
			}
		});

		QUnit.test("Shall be instantiable", function(assert) {
			assert.ok(this.oSmartChart);
		});

		QUnit.test("Shall have entitySet property", function(assert) {
			this.oSmartChart.setEntitySet("foo");
			assert.strictEqual(this.oSmartChart.getEntitySet(), "foo");
		});

		QUnit.test("Shall have useVariantManagement property", function(assert) {
			this.oSmartChart._createVariantManagementControl = function() {
			};
			this.oSmartChart.setUseVariantManagement(true);
			assert.ok(this.oSmartChart.getUseVariantManagement());

			this.oSmartChart.setUseVariantManagement(false);
			assert.ok(!this.oSmartChart.getUseVariantManagement());
		});

		QUnit.test("Shall pass the entity set to the ChartProvider", function(assert) {
			var sEntitySet = "COMPANYSet";
			this.oSmartChart.setEntitySet(sEntitySet);

			sinon.stub(this.oSmartChart, "getModel").returns(new Model());

			sinon.stub(ChartProvider.prototype, "_intialiseMetadata");

			this.oSmartChart._createChartProvider();

			assert.ok(this.oSmartChart._oChartProvider);
			assert.strictEqual(this.oSmartChart._oChartProvider.sEntitySet, sEntitySet);
			ChartProvider.prototype._intialiseMetadata.restore();
		});

		QUnit.test("Shall trigger initialiseMetadata and call _createChartProvider when entitySet and model are both set", function(assert) {

			var done = assert.async();

			var sEntitySet = "COMPANYSet", oModel = new Model();

			sinon.stub(this.oSmartChart, "getModel").returns(oModel);

			sinon.stub(ChartProvider.prototype, "getChartViewMetadata").returns({
				fields: []
			});

			sinon.stub(sap.chart.Chart.prototype, "bindData").callsFake(function() {
				//restore when bindData stub was called as beforeRebindChart would be too early.
				sap.chart.Chart.prototype.bindData.restore();
			});

			sinon.spy(this.oSmartChart, "_initialiseMetadata");
			sinon.spy(this.oSmartChart, "_createChartProvider");
			sinon.spy(this.oSmartChart, "_listenToSmartFilter");
			sinon.spy(this.oSmartChart, "_createChart");
			sinon.spy(this.oSmartChart, "fireInitialise");

			this.oSmartChart.attachBeforeRebindChart(function() {
				assert.strictEqual(this.oSmartChart._oChartProvider.sEntitySet, sEntitySet);
				assert.strictEqual(this.oSmartChart._oChartProvider._oParentODataModel, oModel);

				assert.ok(this.oSmartChart._initialiseMetadata.called);
				assert.ok(this.oSmartChart._createChartProvider.called);
				assert.ok(this.oSmartChart._listenToSmartFilter.calledOnce);
				assert.ok(this.oSmartChart._createChart.calledOnce);
				assert.ok(this.oSmartChart.fireInitialise.calledOnce);
				assert.strictEqual(this.oSmartChart.bIsInitialised, true);

				done();

				ChartProvider.prototype.getChartViewMetadata.restore();

			}.bind(this));

			this.oSmartChart.setEntitySet(sEntitySet);
			this.oSmartChart.setModel(oModel);

		});

		QUnit.test("Shall trigger fireToggleFullScreen", function(assert) {

			var done = assert.async();
			var sEntitySet = "COMPANYSet", oModel = new Model();

			sinon.stub(this.oSmartChart, "getModel").returns(oModel);

			sinon.stub(ChartProvider.prototype, "getChartViewMetadata").returns({
				fields: []
			});

			sinon.spy(this.oSmartChart, "fireFullScreenToggled");

			sinon.stub(sap.chart.Chart.prototype, "bindData").callsFake(function() {
				//restore when bindData stub was called as beforeRebindChart would be too early.
				sap.chart.Chart.prototype.bindData.restore();
			});

			this.oSmartChart.attachBeforeRebindChart(function() {
				this.oSmartChart.oFullScreenButton.firePress();

				assert.ok(this.oSmartChart.fireFullScreenToggled.calledOnce);

				done();

				ChartProvider.prototype.getChartViewMetadata.restore();

			}.bind(this));

			this.oSmartChart.setEntitySet(sEntitySet);
			this.oSmartChart.setModel(oModel);
		});

		//TODO: Needs to be re-written for new details handling, which affects the toolbar content
		/*QUnit.test("_createToolbar and _createToolbarContent shall create toolbars", function() {

			this.oSmartChart._createToolbar();
			this.oSmartChart.setUseChartPersonalisation(false);
			this.oSmartChart.setUseVariantManagement(false);
			this.oSmartChart.setShowDrillButtons(false);
			this.oSmartChart.setShowZoomButtons(false);
			this.oSmartChart.setShowLegendButton(false);
			this.oSmartChart.setShowSemanticNavigationButton(false);
			this.oSmartChart.bIsInitialised = true;

			this.oSmartChart._oChart = {
				  getChartType: function(sType) {},
				  attachSelectData: function(oEvent) {},
				  attachDeselectData: function(oEvent) {}
			};

			this.oSmartChart._createToolbarContent();
			// Space Open ChartType Droll+ Drill- Legend Zoom+ Zoom- Perso Max/Min
			//   X         X         X      X      X      X    X            X
			assert.equal(this.oSmartChart._oToolbar.getContent().length, 8);
			assert.ok(!this.oSmartChart._oDrillUpButton.getVisible());
			assert.ok(!this.oSmartChart._oDrillDownButton.getVisible());
			assert.ok(!this.oSmartChart._oZoomInButton.getVisible());
			assert.ok(!this.oSmartChart._oZoomOutButton.getVisible());
			assert.ok(!this.oSmartChart._oLegendButton.getVisible());


			this.oSmartChart._oToolbar.destroy();
			this.oSmartChart._oToolbar = null;

			this.oSmartChart._oButtonChart1.destroy();
			this.oSmartChart._oButtonChart2.destroy();
			this.oSmartChart._oButtonChart3.destroy();
			this.oSmartChart._oButtonChart4.destroy();
			this.oSmartChart._oButtonChart5.destroy();

			this.oSmartChart._createToolbar();

			this.oSmartChart.setHeader("Test Chart");
			this.oSmartChart.setUseChartPersonalisation(true);
			this.oSmartChart.setUseVariantManagement(true);
			this.oSmartChart.setShowDrillButtons(true);
			this.oSmartChart.setShowZoomButtons(true);
			this.oSmartChart.setShowLegendButton(true);
			this.oSmartChart.setShowSemanticNavigationButton(true);
			this.oSmartChart.setShowFullScreenButton(true);


			// Header Separator Open Spacer ChartType Droll+ Drill- Legend Zoom+  Zoom- Perso  Max/Min
			//   X              X     X        X       X      X      X      X      X     X    	 X
			this.oSmartChart._createToolbarContent();
			assert.equal(this.oSmartChart._oToolbar.getContent().length, 11);
			assert.ok(this.oSmartChart._oDrillUpButton.getVisible());
			assert.ok(this.oSmartChart._oDrillDownButton.getVisible());
			assert.ok(this.oSmartChart._oZoomInButton.getVisible());
			assert.ok(this.oSmartChart._oZoomOutButton.getVisible());
			assert.ok(this.oSmartChart._oLegendButton.getVisible());
			assert.ok(this.oSmartChart.oFullScreenButton.getVisible());

		});*/

		//NEW
		QUnit.test("test _getVariantManagementControl with id", function(assert) {

			//Arrange
			var oSmartVariantId = "oSmartVariantManagement";
			var oSmartVariantManagement = new SmartVariantManagement(oSmartVariantId, {});

			//Act
			var testVariantManagement = this.oSmartChart._getVariantManagementControl(oSmartVariantId);

			//Assert
			assert.strictEqual(testVariantManagement, oSmartVariantManagement, "Variant Management correctly retreived by id");
			oSmartVariantManagement.destroy();

		});

		QUnit.test("test _getVariantManagementControl with variant management control", function(assert) {

			//Arrange
			var oSmartVariantId = "oSmartVariantManagement";
			var oSmartVariantManagement = new SmartVariantManagement(oSmartVariantId, {});

			//Act
			var testVariantManagement = this.oSmartChart._getVariantManagementControl(oSmartVariantManagement);

			//Assert
			assert.strictEqual(testVariantManagement, oSmartVariantManagement, "Variant Management correctly retreived by with control itself");
			oSmartVariantManagement.destroy();
		});

		QUnit.test("test _getVariantManagementControl with wrong instance type", function(assert) {

			//Arrange
			var oWrongInstance = {};

			//Act
			var testVariantManagement = this.oSmartChart._getVariantManagementControl(oWrongInstance);

			//Assert
			assert.strictEqual(testVariantManagement, null, "Wrong instance type correctly returns null");

		});

		/*QUnit.test("Shall attach orientation and resize handler if device is no desktop", function (assert) {

			//Arrange
			sinon.spy(Device.orientation, "attachHandler");
			sinon.spy(Device.resize, "attachHandler");
			Device.system.desktop = false;

			//Re-run the setup to reflect the changes above
			//TODO: Is there a cleaner solution available?
			QUnit.config.modules[0].hooks.beforeEach();

			//Assert
			assert.ok(Device.orientation.attachHandler.calledOnce, "Orientation handler called once");
			assert.ok(Device.resize.attachHandler.calledOnce, "Resize handler called once");

			//Clean
			Device.system.desktop = true;
			Device.orientation.attachHandler.restore();
			Device.resize.attachHandler.restore();

			QUnit.config.modules[0].hooks.afterEach();
		});*/

		QUnit.test("_updateInResultDimensions", function(assert) {
			//Arrange
			this.oSmartChart._oChart = new Chart();
			this.oSmartChart._oChart.setInResultDimensions([
				"requestField2", "requestField3", "requestField5"
			]);
			var oSpySetInResultDimensions = sinon.stub(this.oSmartChart._oChart, "setInResultDimensions");

			sinon.stub(this.oSmartChart, "getRequestAtLeastFields").callsFake(function() {
				return "requestField1,requestField2,requestField3";
			});

			this.oSmartChart._aAlwaysSelect = [
				"requestField1", "requestField4"
			];

			//Act
			this.oSmartChart._updateInResultDimensions();

			//Assert
			var aUniqueInResultFields = [
				"requestField1", "requestField2", "requestField3", "requestField4", "requestField5"
			];
			assert.deepEqual(oSpySetInResultDimensions.getCall(0).args[0], aUniqueInResultFields, "InResultDimensions were set with the correct unique fields");

			//Clean
			this.oSmartChart._oChart.setInResultDimensions.restore();
			this.oSmartChart._oChart.destroy();
			this.oSmartChart.getRequestAtLeastFields.restore();
		});

		//Test new Details functionality

		QUnit.test("_addDetailsButton", function(assert) {
			//Arrange
			this.oSmartChart._oChart = new Chart();
			this.oSmartChart._oToolbar = new OverflowToolbar();

			sinon.spy(this.oSmartChart._oToolbar, "addContent");

			//Act
			this.oSmartChart._addDetailsButton();

			//Assert
			assert.ok(this.oSmartChart._oToolbar.addContent.calledTwice, "selectionDetails control and drillDown text button were added to toolbar content");
			assert.equal(this.oSmartChart._oToolbar.getContent()[0].getMetadata().getElementName(), "sap.m.SelectionDetails", "Selection details was set to to toolbar correctly");
			assert.equal(this.oSmartChart._oToolbar.getContent()[1].getMetadata().getElementName(), "sap.m.Button", "DrillDown button was set to to toolbar correctly");

			//Clean
			this.oSmartChart._oChart.destroy();
			this.oSmartChart._oToolbar.destroy();
			this.oSmartChart._oToolbar.addContent.restore();
		});

		QUnit.test("check initial state on selectionDetails popover", function(assert) {
			//Arrange
			this.oSmartChart._oToolbar = new OverflowToolbar();
			this.oSmartChart._oSelectionDetails = new SelectionDetails();

			//Act
			this.oSmartChart._addDetailsButton();

			//Assert
			assert.ok(!this.oSmartChart._oSelectionDetails.isOpen(), "details popover was closed initially");

			//Clean
			this.oSmartChart._oSelectionDetails.destroy();
			this.oSmartChart._oToolbar.destroy();
		});

		QUnit.test("_semanticObjectListForDetails", function(assert) {

			assert.expect(1);

			var done = assert.async();

			//Arrange
			this.oSmartChart._oChart = new Chart();

			var aSemanticObjects = [
				{
					name: "Name",
					fieldLabel: "LabelName",
					"com.sap.vocabularies.Common.v1.SemanticObject": {
						String: "demokit_smartlink_example_01_SemanticObjectName"
					}
				}, {
					name: "Price",
					fieldLabel: "LabelPrice",
					"com.sap.vocabularies.Common.v1.SemanticObject": {
						String: "demokit_smartlink_example_01_SemanticObjectPrice"
					}
				}, {
					name: "Category",
					fieldLabel: "LabelCategory",
					"com.sap.vocabularies.Common.v1.SemanticObject": {
						String: "demokit_smartlink_example_01_SemanticObjectCategory"
					}
				}
			];

			sinon.stub(SemanticObjectController, "getDistinctSemanticObjects").callsFake(function() {

				var oPromise = new Promise(function(resolve) {
					var oSemObjects = {
						demokit_smartlink_example_01_SemanticObjectName: {},
						demokit_smartlink_example_01_SemanticObjectPrice: {},
						demokit_smartlink_example_01_SemanticObjectCategory: {}
					};

					return resolve(oSemObjects);
				});

				return oPromise;
			});

			// to fill globals for List fake navigation
			sinon.stub(this.oSmartChart, "_setSemanticObjectsContext").callsFake(function() {
				return aSemanticObjects;
			});
			this.oSmartChart._oSelectionDetails = {
				navTo: function() {
				}
			};
			this.oSmartChart._navigateToSemanticObjectDetails({
				getParameter: function() {
					return {
						getBindingContext: function() {
						}
					};
				}
			});
			this.oSmartChart._setSemanticObjectsContext.restore();
			delete this.oSmartChart._oSelectionDetails;

			//Act
			var oSemanticObjectList = this.oSmartChart._semanticObjectListForDetails(aSemanticObjects);

			window.setTimeout(function() {
				//Assert
				assert.equal(oSemanticObjectList.getItems().length, 3, "SemanticObjectList contains the right amount of itmens based on the availbe semantic objects.");

				//Clean Up
				SemanticObjectController.getDistinctSemanticObjects.restore();

				done();
			});
		});

		QUnit.test("_navigateToSemanticObjectDetails", function(assert) {

			var done = assert.async();
			var iGlobalCallCount = 0;

			//Arrange
			this.oSmartChart._oChart = new Chart();
			this.oSmartChart._oSemanticNavHandler = new NavigationPopoverHandler();
			this.oSmartChart._oSelectionDetails = new SelectionDetails();
			this.oSmartChart._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");

			var aSemanticObjects = [
				{
					name: "NameSemObj1",
					fieldLabel: "LabelSemObj1",
					"com.sap.vocabularies.Common.v1.SemanticObject": {
						String: "SemanticObjectSemObj1"
					}
				}
			];

			var oEvent = {
				getSource: function() {
					return new ManagedObject();
				},
				getParameter: function() {
					return new StandardListItem();
				}
			};

			var oBindingContext = {
				id: "aBindingContext",
				getObject: function() {
					return {
						name: "testName",
						id: "testId"
					};
				},
				getPath: function() {
					return "/anyPath";
				}
			};
			sinon.stub(this.oSmartChart._oChart, "getBinding").callsFake(function() {
				return {
					getContextByIndex: function(rowNumber) {
						return oBindingContext;
					}
				};
			});

			var oStubSetSemanticObjectsContext = sinon.stub(this.oSmartChart, "_setSemanticObjectsContext").callsFake(function() {
				return aSemanticObjects;
			});

			var oSelectionDetailsStub = sinon.stub(this.oSmartChart._oSelectionDetails, "navTo").callsFake(function() {
				iGlobalCallCount++;

				// Assert 1
				if (iGlobalCallCount == 2) {
					assert.ok("Navigation to semantic objects was called correctly (namely: twice");
					assert.equal(oStubSetSemanticObjectsContext.callCount, 3, "setSemanticObjectsContext was called correctly");
					this.oSmartChart._setSemanticObjectsContext.restore();
					this.oSmartChart._oSelectionDetails.navTo.restore();
					this.oSmartChart._semanticObjectListForDetails.restore();
					this.oSmartChart._oSelectionDetails.destroy();
					this.oSmartChart._oSemanticNavHandler.destroy();
					oSelectionDetailsStub.restore();
					done();
				}
			}.bind(this));

			//Act 1
			this.oSmartChart._navigateToSemanticObjectDetails(oEvent);

			//Arrange 2
			aSemanticObjects = [
				{
					name: "semObj1",
					fieldLabel: "semObj1"
				}, {
					name: "semObj2",
					label: "semObj2"
				}, {
					name: "semObj3",
					label: "semObj3"
				}
			];

			var oSpySemanticObjectListForDetails = sinon.spy(this.oSmartChart, "_semanticObjectListForDetails");

			//Act 2
			this.oSmartChart._navigateToSemanticObjectDetails(oEvent);

			//Assert 2
			assert.ok(oSpySemanticObjectListForDetails.calledWith(this.oSmartChart._setSemanticObjectsContext(oEvent)), "semanticObjectListForDetails was called with the correct params");
		});

		function assyncBreadcrumbsTest(assert, fnTest) {
			if (sap.ui.require("sap/m/Breadcrumbs") && sap.ui.require("sap/m/Link") && this.oSmartChart._oDrillBreadcrumbs) {
				fnTest.call(this, assert);
			} else {
				var fnDone = assert.async();
				sap.ui.require([
					"sap/m/Breadcrumbs", "sap/m/Link"
				], function() {
					fnTest.call(this, assert);
					fnDone();
				}.bind(this));
			}
		}

		function updateDrillBreadcrumbs(assert) {
			//Arrange
			var oDim1 = new Dimension({
				name: "FirstDim",
				label: "FirstDim"
			});
			var oDim2 = new Dimension({
				name: "SecondDim",
				label: "SecondDim"
			});
			var oDim3 = new Dimension({
				name: "ThirdDim",
				label: "ThirdDim"
			});
			var oDim4 = new Dimension({
				name: "FourthDim",
				label: "FourthDim"
			});

			var aDimensions = [
				oDim1, oDim2, oDim3, oDim4
			];

			var aVisibleDimensions = [
				"FirstDim", "SecondDim", "ThirdDim", "FourthDim"
			];

			this.oSmartChart._oChart = new Chart({
				visibleDimensions: aVisibleDimensions,
				dimensions: aDimensions
			});
			this.oSmartChart._oDrillBreadcrumbs = new Breadcrumbs();

			var oSpyGetDimensionsByName = sinon.spy(this.oSmartChart._oChart, "getDimensionByName");
			var oSpyAddLink = sinon.spy(this.oSmartChart._oDrillBreadcrumbs, "addLink");

			//Act
			this.oSmartChart._updateDrillBreadcrumbs();

			//Assert
			assert.equal(oSpyGetDimensionsByName.callCount, 8, ""); //each time we check for existing value before proceeding, so multiply callcount by 2 ( for each stack level of drill-stack)!
			assert.equal(oSpyAddLink.callCount, 3, "");
			assert.equal(this.oSmartChart._oDrillBreadcrumbs.getCurrentLocationText(), "FourthDim", "Fourth dimension was correclty set as currentLocationText in Breadcrumbs control");

			//check the texts
			var aLink = this.oSmartChart._oDrillBreadcrumbs.getLinks();
			assert.equal(aLink[0].getText(), "FirstDim", "The texts are correct");
			assert.equal(aLink[1].getText(), "SecondDim", "The texts are correct");
			assert.equal(aLink[2].getText(), "ThirdDim", "The texts are correct");

			//Arrange
			var aNewResult = [
				"FirstDim", "SecondDim"
			];

			//Act
			aLink[1].firePress();

			//Assert
			assert.ok(jQuery(aNewResult).not(this.oSmartChart._oChart.getVisibleDimensions()).length === 0 && jQuery(this.oSmartChart._oChart.getVisibleDimensions()).not(aNewResult).length === 0, "Pressing the Breadcrumbs link successfully updated the visible dimenions of the inner chart");
			assert.equal(this.oSmartChart._oDrillBreadcrumbs.getCurrentLocationText(), "SecondDim", "Next dimension was correclty set as currentLocationText in Breadcrumbs control after pressing a breadcrumb link");

			//Clean
			oDim1.destroy();
			oDim2.destroy();
			oDim3.destroy();
			this.oSmartChart._oChart.destroy();
			this.oSmartChart._oDrillBreadcrumbs.destroy();
			this.oSmartChart._oChart.getDimensionByName.restore();
			this.oSmartChart._oDrillBreadcrumbs.addLink.restore();
		}

		QUnit.test("_updateDrillBreadcrumbs", function(assert) {
			// load breadcrumb modules
			sinon.stub(this.oSmartChart, "getShowDrillBreadcrumbs").returns(true);
			this.oSmartChart._addDrillBreadcrumbs();
			this.oSmartChart.getShowDrillBreadcrumbs.restore();

			assyncBreadcrumbsTest.call(this, assert, updateDrillBreadcrumbs);
		});

		function addDrillBreadcrumbs(assert) {
			//Assert
			assert.equal(this.oSmartChart._oDrillBreadcrumbs.getMetadata().getName(), "sap.m.Breadcrumbs", "Breadcrumbs instance was successfully created");
			assert.equal(this.oSmartChart.getItems()[1], this.oSmartChart._oDrillBreadcrumbs, "Breadcrumbs control was successfully set below the toolbar control");
			assert.ok(this.oSmartChart._updateDrillBreadcrumbs.calledOnce, "_updateDrillBreadcrumbs was successfully called ");

			//Arrange
			this.oSmartChart._updateDrillBreadcrumbs.reset();

			//Act
			this.oSmartChart._oChart.fireDrilledUp();
			this.oSmartChart._oChart.fireDrilledDown();

			//Assert
			assert.equal(this.oSmartChart._updateDrillBreadcrumbs.callCount, 2, "Event handlers for drilling up and down of the inner chart instance successfully fired the _updateDrillBreadcrumbs function");

			//Clean
			this.oSmartChart._oToolbar.destroy();
			this.oSmartChart._oChart.destroy();
			this.oSmartChart._updateDrillBreadcrumbs.restore();
			this.oSmartChart.getShowDrillBreadcrumbs.restore();
		}

		QUnit.test("_addDrillBreadcrumbs", function(assert) {

			sinon.stub(this.oSmartChart, "getShowDrillBreadcrumbs").returns(true);

			//Arrange
			this.oSmartChart._oToolbar = new OverflowToolbar();
			this.oSmartChart._oChart = new Chart();

			sinon.stub(this.oSmartChart, "_updateDrillBreadcrumbs");

			//Act
			this.oSmartChart._createToolbar();
			this.oSmartChart._addDrillBreadcrumbs();

			assyncBreadcrumbsTest.call(this, assert, addDrillBreadcrumbs);
		});

		QUnit.test("_createPopover", function(assert) {

			//Arrange
			this.oSmartChart._oChart = new Chart();
			var fnDone = assert.async();

			sap.ui.require([
				"sap/viz/ui5/controls/Popover"
			], function(Popover) {
				var oStubConnect = sinon.stub(Popover.prototype, "connect");

				//Act
				this.oSmartChart._createPopover();

				//Assert
				assert.equal(this.oSmartChart._oPopover.getMetadata().getName(), "sap.viz.ui5.controls.Popover", "Popover was successfully created");
				assert.ok(oStubConnect.calledWith(this.oSmartChart._oChart.getVizUid()), "Connection of oPopover was successfully called");

				//Clean
				this.oSmartChart._oChart.destroy();
				Popover.prototype.connect.restore();
				fnDone();
			}.bind(this));
		});

		QUnit.test("_setBehaviorTypeForDataSelection", function(assert) {
			//Arrange
			this.oSmartChart._oChart = new Chart();
			var bShowDetailsBtn = true;

			sinon.stub(this.oSmartChart, "getShowDetailsButton").callsFake(function() {
				return bShowDetailsBtn;
			});

			//Act
			this.oSmartChart._setBehaviorTypeForDataSelection();

			//Assert
			var sBehaviorType = this.oSmartChart._oChart.getVizProperties().interaction.behaviorType;
			assert.equal(sBehaviorType, "noHoverBehavior", "Behavior type if inner chart was correctly set to noHoverBehavior");

			//Clean
			this.oSmartChart._oChart.destroy();

			//Arrange
			bShowDetailsBtn = false;
			this.oSmartChart._oChart = new Chart();

			//Act
			this.oSmartChart._setBehaviorTypeForDataSelection();

			//Assert
			sBehaviorType = this.oSmartChart._oChart.getVizProperties().interaction.behaviorType;
			assert.equal(sBehaviorType, undefined, "Behavior type if inner chart was correctly set to noHoverBehavior");

			//Clean
			this.oSmartChart._oChart.destroy();
			this.oSmartChart.getShowDetailsButton.restore();
		});

		QUnit.test("_variantSaved", function(assert) {

			//Arrange
			this.oSmartChart._oPersController = new PersoController({
				table: new Table()
			});
			this.oSmartChart._oCurrentVariant = {};

			var oStubSetPersoData = sinon.stub(PersoController.prototype, "setPersonalizationData");

			//Act
			this.oSmartChart._variantSaved();

			//Assert
			assert.ok(oStubSetPersoData.calledWith(this.oSmartChart._oCurrentVariant), "setPersonalizationData was called with correct variant");

			//Clean
			PersoController.prototype.setPersonalizationData.restore();
			this.oSmartChart._oPersController.destroy();
			this.oSmartChart._oCurrentVariant = null;
		});

		QUnit.test("_variantAfterSave", function(assert) {

			//Arrange
			var oStubFireAfterVariantSave = sinon.stub(this.oSmartChart, "fireAfterVariantSave");
			sinon.stub(this.oSmartChart, "getCurrentVariantId").callsFake(function() {
				return "testVariantId";
			});
			//Act
			this.oSmartChart._variantAfterSave();

			//Assert
			assert.ok(oStubFireAfterVariantSave.calledWith({
				currentVariantId: "testVariantId"
			}), "fireVaraintAfterSave was called with the correct variantId");

			//Clean
			this.oSmartChart.fireAfterVariantSave.restore();
			this.oSmartChart.getCurrentVariantId.restore();
		});

		QUnit.test("setToolbar", function(assert) {

			//Arrange
			var oSpyRemoveItem = sinon.spy(this.oSmartChart, "removeItem");

			var oInitialToolbar = new OverflowToolbar("initialToolbar");
			var oAnotherToolbar = new OverflowToolbar("anotherToolbar");
			this.oSmartChart._oToolbar = oInitialToolbar;

			//Act
			this.oSmartChart.setToolbar(oAnotherToolbar);

			//Assert
			assert.ok(oSpyRemoveItem.calledWith(oInitialToolbar), "Already set toolbar was successfully removed");
			assert.equal(this.oSmartChart._oToolbar, oAnotherToolbar, "The new toolbar was successfully set to the smartChart instance");
			assert.equal(this.oSmartChart._bUpdateToolbar, true, "Flag for updated toolbar was successfully set to true");

			//Clean
			this.oSmartChart.removeItem.restore();
			oInitialToolbar.destroy();
			oAnotherToolbar.destroy();
			this.oSmartChart._oToolbar.destroy();
		});

		QUnit.test("getToolbar", function(assert) {

			//Arrange
			this.oSmartChart._oToolbar = new OverflowToolbar("oToolbar");

			//Act
			var oToolbar = this.oSmartChart.getToolbar();

			//Assert
			assert.strictEqual(oToolbar, this.oSmartChart._oToolbar, "Getter successfully returned the toolbar instance");

			//Clean
			this.oSmartChart._oToolbar.destroy();

		});

		QUnit.test("setShowToolbar", function(assert) {

			var oInitialToolbar = new OverflowToolbar("initialToolbar");
			//Spy visibility of inner toolbar
			var oSpySetVisible = sinon.spy(oInitialToolbar, "setVisible");

			this.oSmartChart._oToolbar = oInitialToolbar;

			var bShowToolbar = true;
			//set the toolbar visibility
			this.oSmartChart.setShowToolbar(bShowToolbar);
			assert.ok(oSpySetVisible.calledWith(bShowToolbar), "Visibility of toolbar is changed");
			assert.equal(this.oSmartChart.getShowToolbar(), bShowToolbar, "Toolbar visibility set");

			bShowToolbar = false;
			//set the toolbar visibility
			this.oSmartChart.setShowToolbar(bShowToolbar);
			assert.ok(oSpySetVisible.calledWith(bShowToolbar), "Visibility of toolbar is changed");
			assert.equal(this.oSmartChart.getShowToolbar(), bShowToolbar, "Toolbar visibility set");

			var oAnotherToolbar = new OverflowToolbar("anotherToolbar");
			//Spy visibility of new inner toolbar
			oSpySetVisible = sinon.spy(oAnotherToolbar, "setVisible");
			//Act
			this.oSmartChart.setToolbar(oAnotherToolbar);
			assert.ok(oSpySetVisible.calledWith(this.oSmartChart.getShowToolbar()), "Visibility of toolbar is changed");

			//Clean
			oInitialToolbar.destroy();
			oAnotherToolbar.destroy();
			this.oSmartChart._oToolbar.destroy();
		});

		QUnit.test("setToolbarStyle", function(assert) {

			var oInitialToolbar = new OverflowToolbar("initialToolbar");
			//Spy visibility of inner toolbar
			var oSpySetVisible = sinon.spy(oInitialToolbar, "setStyle");

			this.oSmartChart._oToolbar = oInitialToolbar;

			var sToolbarStyle = "Standard";
			//set the toolbar visibility
			this.oSmartChart.setToolbarStyle(sToolbarStyle);
			assert.ok(oSpySetVisible.calledWith(sToolbarStyle), "Style of toolbar is changed");
			assert.equal(this.oSmartChart.getToolbarStyle(), sToolbarStyle, "Toolbar style set");

			sToolbarStyle = "Clear";
			//set the toolbar visibility
			this.oSmartChart.setToolbarStyle(sToolbarStyle);
			assert.ok(oSpySetVisible.calledWith(sToolbarStyle), "Style of toolbar is changed");
			assert.equal(this.oSmartChart.getToolbarStyle(), sToolbarStyle, "Toolbar style set");

			var oAnotherToolbar = new OverflowToolbar("anotherToolbar");
			//Spy visibility of new inner toolbar
			oSpySetVisible = sinon.spy(oAnotherToolbar, "setStyle");
			//Act
			this.oSmartChart.setToolbar(oAnotherToolbar);
			assert.ok(oSpySetVisible.calledWith(this.oSmartChart.getToolbarStyle()), "Style of toolbar is changed");

			//Clean
			oInitialToolbar.destroy();
			oAnotherToolbar.destroy();
			this.oSmartChart._oToolbar.destroy();
		});

		QUnit.test("_refreshHeaderText", function(assert) {

			//Arrange
			this.oSmartChart._bUpdateToolbar = false;

			//Act
			this.oSmartChart._refreshHeaderText();

			//Assert
			assert.equal(this.oSmartChart._bUpdateToolbar, true, "Flag for updated toolbar was successfully changed to true");

			//Arrange
			this.oSmartChart._bUpdateToolbar = false;
			this.oSmartChart._headerText = new Text();
			this.oSmartChart.setHeader("ThisIsAHeaderText");

			//Act
			this.oSmartChart._refreshHeaderText();

			//Assert
			assert.equal(this.oSmartChart._headerText.getText(), this.oSmartChart.getHeader(), "The header text was successfully set into the header instance");
			assert.equal(this.oSmartChart._bUpdateToolbar, false, "Flag was not changed in this case, which is correct");

			//Clean
			this.oSmartChart._headerText.destroy();
			this.oSmartChart.setHeader("");

		});

		QUnit.test("_toggleZoomButtonEnablement", function(assert) {

			//Arrange
			this.oSmartChart._oChart = new Chart();
			this.oSmartChart._oZoomInButton = new OverflowToolbarButton();
			this.oSmartChart._oZoomOutButton = new OverflowToolbarButton();
			var oSpyZoomOutBtn = sinon.spy(this.oSmartChart._oZoomOutButton, "setEnabled");
			var oSpyZoomInBtn = sinon.spy(this.oSmartChart._oZoomInButton, "setEnabled");

			var iZoomInfo;
			sinon.stub(this.oSmartChart._oChart, "_getZoomInfo").callsFake(function() {
				return {
					currentZoomLevel: iZoomInfo
				};
			});

			//Act
			this.oSmartChart._toggleZoomButtonEnablement();

			//Assert
			assert.equal(oSpyZoomOutBtn.callCount, 0, "zoomOut button successfully disabled");
			assert.equal(oSpyZoomInBtn.callCount, 0, "zoomIn button successfully stays enabled");

			//Clean
			this.oSmartChart._oZoomOutButton.setEnabled.restore();
			this.oSmartChart._oZoomInButton.setEnabled.restore();

			//Arrange
			iZoomInfo = null;

			//Act
			this.oSmartChart._toggleZoomButtonEnablement();

			//Assert
			assert.ok(!this.oSmartChart._oZoomOutButton.getEnabled(), "zoomOut button successfully disabled");
			assert.ok(!this.oSmartChart._oZoomInButton.getEnabled(), "zoomIn button successfully disabled");

			//Arrange
			iZoomInfo = 0; //all the way zoomed out

			//Act
			this.oSmartChart._toggleZoomButtonEnablement();

			//Assert
			assert.ok(!this.oSmartChart._oZoomOutButton.getEnabled(), "zoomOut button successfully disabled");
			assert.ok(this.oSmartChart._oZoomInButton.getEnabled(), "zoomIn button successfully stays enabled");

			//Arrange
			iZoomInfo = 0.9;//zoomed in between

			//Act
			this.oSmartChart._toggleZoomButtonEnablement();

			//Assert
			assert.ok(this.oSmartChart._oZoomInButton.getEnabled(), "zoomIn button successfully stays enabled");
			assert.ok(this.oSmartChart._oZoomOutButton.getEnabled(), "zoomOut button successfully stays enabled");

			//Arrange
			iZoomInfo = 1; //all the way zoomed in

			//Act
			this.oSmartChart._toggleZoomButtonEnablement();

			//Assert
			assert.ok(!this.oSmartChart._oZoomInButton.getEnabled(), "zoomIn button successfully disabled");
			assert.ok(this.oSmartChart._oZoomOutButton.getEnabled(), "zoomOut button successfully stays enabled");

			//Clean
			this.oSmartChart._oChart._getZoomInfo.restore();
			this.oSmartChart._oZoomInButton.destroy();
			this.oSmartChart._oZoomOutButton.destroy();
		});

		QUnit.test("setShowChartTypeSelectionButton", function(assert) {
			//Arrange
			//this.oSmartChart._oChart = new Chart();
			var bFlag = true;
			this.oSmartChart._oChartTypeButton = new OverflowToolbarButton({
				visible: !bFlag
			});

			//Act
			this.oSmartChart.setShowChartTypeSelectionButton(bFlag);

			//Assert
			assert.equal(this.oSmartChart.getProperty("showChartTypeSelectionButton"), bFlag, "Property showChartTypeSelectionButton was successfully set.");
			assert.equal(this.oSmartChart._oChartTypeButton.getVisible(), bFlag, "oChartTypeButton was successfully set visible");

			//Clean
			this.oSmartChart._oChartTypeButton.destroy();
		});

		QUnit.test("setShowDetailsButton", function(assert) {
			//Arrange
			var bFlag = true;
			this.oSmartChart._oChart = new Chart();
			this.oSmartChart._oSelectionDetails = new SelectionDetails({
				visible: false
			});

			//Act
			this.oSmartChart.setShowDetailsButton(bFlag);

			//Assert
			assert.equal(this.oSmartChart.getProperty("showDetailsButton"), bFlag, "Property showDetailsButton was successfully set.");
			assert.equal(this.oSmartChart._oSelectionDetails.getVisible(), bFlag, "oSelectionDetails was successfully set visible");

			//Act
			this.oSmartChart.setShowDetailsButton(!bFlag);

			//Assert
			assert.equal(this.oSmartChart.getProperty("showDetailsButton"), !bFlag, "Property showDetailsButton was successfully set.");
			assert.equal(this.oSmartChart._oSelectionDetails.getVisible(), !bFlag, "oSelectionDetails was successfully set invisible");

			//Clean
			this.oSmartChart._oSelectionDetails.destroy();
			this.oSmartChart._oChart.destroy();

		});

		QUnit.test("setShowDrillBreadcrumbs", function(assert) {
			//Arrange
			var bFlag = true;
			this.oSmartChart._oDrillBreadcrumbs = new Breadcrumbs({
				visible: !bFlag
			});
			this.oSmartChart._headerText = new Text({
				visible: bFlag
			});
			this.oSmartChart._oDrillUpButton = new Button({
				visible: bFlag
			});
			this.oSmartChart._oSeparator = new ToolbarSeparator({
				visible: bFlag
			});
			sinon.stub(this.oSmartChart, "_addHeaderToToolbar");

			//Act
			this.oSmartChart.setShowDrillBreadcrumbs(bFlag);

			//Assert
			assert.equal(this.oSmartChart._oDrillBreadcrumbs.getVisible(), bFlag, "Breadcrumbs controll successfully set to visible");
			assert.equal(this.oSmartChart._oDrillUpButton.getVisible(), !bFlag, "DrillUpButton successfully set to invisible");

			//Clean
			this.oSmartChart._oDrillBreadcrumbs.destroy();
			this.oSmartChart._headerText.destroy();
			this.oSmartChart._oDrillUpButton.destroy();
			this.oSmartChart._oSeparator.destroy();
			this.oSmartChart._addHeaderToToolbar.restore();

		});

		QUnit.test("showOverlay", function(assert) {
			//Arrange
			var bShowOverlay = true;
			this.oSmartChart._oChart = new Chart();

			var fnRenderOverlay = sinon.spy(this.oSmartChart, "_renderOverlay");
			var fnShowOverlay = sinon.spy(this.oSmartChart, "_showOverlay");

			//Act
			this.oSmartChart.showOverlay(bShowOverlay);

			//Assert
			assert.ok(fnShowOverlay.calledWith(bShowOverlay), "Private _showOverlay was called with correct parameter");
			assert.ok(fnRenderOverlay.calledWith(bShowOverlay), "Private _renderOverlay was called with correct parameter");

			//Clean Up
			fnRenderOverlay.restore();
			fnShowOverlay.restore();
		});

		/*QUnit.test("_adjustHeight", function(assert){
			//Arrange
			var fnDone = assert.async();
			var fnAdjustHeight = sinon.spy(this.oSmartChart, "_adjustHeight");
			this.oSmartChart._bMetadataIsInitialised = true;

			//Act
			this.oSmartChart.getChart().fireRenderComplete();

			//Assert
			window.setTimeout(function () {
				//Assert
				assert.ok(fnAdjustHeight.calledOnce, "_adjustHeight correctly called after renderComplete of inner chart");
				//Clean Up
				fnDone();
			});
		});*/

		QUnit.test("test inner chart height setting", function(assert) {

			//Arrange
			this.oSmartChart._oChart = new Chart();

			//Act
			//Test if 100% height on inner chart was set correctly, when height was defined on SmartChart
			this.oSmartChart.setHeight("1000px");
			this.oSmartChart._createChart();

			//Assert
			assert.equal(this.oSmartChart._oChart.getHeight(), "100%", "Inner chart height correctly set to 100%");

			//Clean
			this.oSmartChart._oChart.destroy();

			//Arrange
			this.oSmartChart = new SmartChart();
			this.oSmartChart._oChart = new Chart();

			//Act
			//Test if default height was set correctly when no height is set on SmartChart
			this.oSmartChart._createChart();

			//Assert
			assert.equal(this.oSmartChart._oChart.getHeight(), "480px", "Inner chart height correctly set to vizFrame default of 480px");

			//Clean
			this.oSmartChart._oChart.destroy();

		});

		QUnit.test("setShowZoomButtons", function(assert) {

			//Arrange
			var bFlag = true;
			this.oSmartChart._oZoomInButton = new Button({
				visible: !bFlag
			});
			this.oSmartChart._oZoomOutButton = new Button({
				visible: !bFlag
			});
			this.oSmartChart.setProperty("showZoomButtons", !bFlag);

			//Act
			this.oSmartChart.setShowZoomButtons(bFlag);

			//Assert
			assert.equal(this.oSmartChart._oZoomInButton.getVisible(), bFlag, "zoomInButton successfully set to true");
			assert.equal(this.oSmartChart._oZoomOutButton.getVisible(), bFlag, "zoomOutButton successfully set to true");
			assert.equal(this.oSmartChart.getProperty("showZoomButtons"), bFlag, "Property for zoom buttons successfully set to true");

			//Clean
			this.oSmartChart._oZoomInButton.destroy();
			this.oSmartChart._oZoomOutButton.destroy();
		});

		QUnit.test("setLegendVisible", function(assert) {

			//Arrange
			var bFlag = true;
			var oStubSetLegendVisible = sinon.stub(this.oSmartChart, "_setLegendVisible");
			this.oSmartChart.setProperty("legendVisible", !bFlag);

			//Act
			this.oSmartChart.setLegendVisible(bFlag);

			//Assert
			assert.equal(this.oSmartChart.getProperty("legendVisible"), bFlag, "Property for legend visiblity was successfully set tot true");
			assert.ok(oStubSetLegendVisible.calledWith(bFlag), "setLegendVisible was successfully called with true");

			//Clean
			this.oSmartChart._setLegendVisible.restore();

		});

		QUnit.test("_setLegendVisible", function(assert) {

			//Arrange
			var bFlag = true;
			this.oSmartChart._oChart = new Chart();
			var vizFrame = this.oSmartChart._oChart.getAggregation("_vizFrame");
			vizFrame.setLegendVisible(!bFlag);

			//Act
			this.oSmartChart._setLegendVisible(bFlag);

			assert.equal(vizFrame.getVizProperties().legend.visible, bFlag, "Visiblity of legend successfully changed in viz frame of inner chart control");

			//Clean
			this.oSmartChart._oChart.destroy();
		});

		QUnit.test("_getVizFrame", function(assert) {

			//Arrange
			this.oSmartChart._oChart = new Chart();

			//Act
			var vizFrame = this.oSmartChart._getVizFrame();

			//Assert
			assert.equal(vizFrame, this.oSmartChart._oChart.getAggregation("_vizFrame"), "Successfully returned the inner charts viz frame");

			//Clean
			this.oSmartChart._oChart.destroy();
		});

		QUnit.test("showLegendButton", function(assert) {

			//Arrange
			var bFlag = true;
			this.oSmartChart._oLegendButton = new Button({
				visible: !bFlag
			});
			this.oSmartChart.setProperty("showLegendButton", !bFlag);

			//Act
			this.oSmartChart.setShowLegendButton(bFlag);

			//Assert
			assert.equal(this.oSmartChart.getProperty("showLegendButton"), bFlag, "showLegendButton property successfully set to true");
			assert.equal(this.oSmartChart._oLegendButton.getVisible(), bFlag, "Visibility of legendButton successfully set to true");

			//Clean
			this.oSmartChart._oLegendButton.destroy();
		});

		QUnit.test("setShowSemanticNavigationButton", function(assert) {

			//Arrange
			var bFlag = true;
			this.oSmartChart.setProperty("showSemanticNavigationButton", !bFlag);
			this.oSmartChart._oSemanticalNavButton = new Button({
				visible: !bFlag
			});

			//Act
			this.oSmartChart.setShowSemanticNavigationButton(bFlag);

			//Assert
			assert.ok(this.oSmartChart.getProperty("showSemanticNavigationButton"), bFlag, "Property showSemanticNavigationButton successfully set to true");
			assert.equal(this.oSmartChart._oSemanticalNavButton.getVisible(), bFlag, "Visibility of semanticalNavButton successfully set to true");

			//Clean
			this.oSmartChart._oSemanticalNavButton.destroy();
			this.oSmartChart._oSemanticalNavButton = null;

			//Arrange
			var oStubAddSemanticNavigationButton = sinon.stub(this.oSmartChart, "_addSemanticNavigationButton");

			//Act
			this.oSmartChart.setShowSemanticNavigationButton(bFlag);

			//Assert
			assert.ok(oStubAddSemanticNavigationButton.calledOnce, "Private _addSemanticNavigationButton successfully called");

			//Clean
			this.oSmartChart._addSemanticNavigationButton.restore();

		});

		QUnit.test("_addSemanticNavigationButton", function(assert) {

			//Arrange
			this.oSmartChart.setProperty("showSemanticNavigationButton", true);

			this.oSmartChart._oSemanticNavHandler = new NavigationPopoverHandler();

			this.oSmartChart._oToolbar = new OverflowToolbar();
			this.oSmartChart._oChart = new Chart();

			var oSemanticObjectController = new SemanticObjectController();

			var oStubGetSemanticObjectController = sinon.stub(this.oSmartChart, "getSemanticObjectController").callsFake(function() {

				return oSemanticObjectController;
			});

			var oStubIndexOfSpaceOnToolbar = sinon.stub(this.oSmartChart, "_indexOfSpacerOnToolbar").callsFake(function() {
				return 1;
			});
			var oStubInsertContent = sinon.stub(this.oSmartChart._oToolbar, "insertContent");

			var oStubSetSemanticObjectController = sinon.stub(NavigationPopoverHandler.prototype, "setSemanticObjectController");

			//Act
			this.oSmartChart._addSemanticNavigationButton();

			//Assert
			assert.equal(this.oSmartChart._oSemanticalNavButton.getMetadata().getName(), "sap.m.Button", "semanticalNavigationButton was successfully created");
			assert.ok(oStubGetSemanticObjectController.calledOnce, "Getter for semantic object controller was successfully called");
			assert.ok(oStubSetSemanticObjectController.calledWith(oSemanticObjectController), "setSemanticObjectController of navigation handler successfully called with the correct semantic object cotroller instance");
			assert.ok(oStubIndexOfSpaceOnToolbar.calledOnce, "Index of spacer on toolbar was successfully retreived");
			assert.ok(oStubInsertContent.calledWith(this.oSmartChart._oSemanticalNavButton, this.oSmartChart._indexOfSpacerOnToolbar() + 1), "Content was successfully inserted into toolbar of smartChart");

			//Arrange
			var aSemanticObjects = [
				{
					id: "semanticObject1",
					"com.sap.vocabularies.Common.v1.SemanticObject": {
						String: "SemanticObjectSemObj1"
					}
				}
			];
			var oStubSetSelectionDataPointHandling = sinon.stub(this.oSmartChart, "_setSelectionDataPointHandling").callsFake(function() {
				return aSemanticObjects;
			});
			var oStubSetSemanticObject = sinon.stub(NavigationPopoverHandler.prototype, "setSemanticObject");
			var oStubOpenPopover = sinon.stub(NavigationPopoverHandler.prototype, "openPopover");

			//Act
			this.oSmartChart._oChart.fireDeselectData();
			this.oSmartChart._oChart.fireSelectData();
			this.oSmartChart._oSemanticalNavButton.firePress();

			//Assert
			assert.equal(oStubSetSelectionDataPointHandling.callCount, 2, "setSelectionDataPointHandling was correctly called during select and deselect of data");
			assert.ok(oStubSetSemanticObject.calledOnce, "setSemanticObject was correctly called");
			assert.ok(oStubOpenPopover.calledOnce, "openPopover of nav handler was correctly called");

			//Arrange

			aSemanticObjects.push({
				id: "semanticObject2"
			});
			oStubSetSemanticObject.reset();
			oStubOpenPopover.reset();

			var oStubSemanticObjectList = sinon.stub(this.oSmartChart, "_semanticObjectList");

			//Act
			this.oSmartChart._oChart.fireDeselectData();
			this.oSmartChart._oChart.fireSelectData();
			this.oSmartChart._oSemanticalNavButton.firePress();

			//Assert
			assert.ok(oStubSemanticObjectList.calledOnce);
			assert.equal(oStubSetSemanticObject.callCount, 0);
			assert.equal(oStubOpenPopover.callCount, 0);

			//Clean
			this.oSmartChart._oSemanticNavHandler.destroy();
			this.oSmartChart._oToolbar.destroy();
			this.oSmartChart._oChart.destroy();
			oSemanticObjectController.destroy();
			this.oSmartChart.getSemanticObjectController.restore();
			this.oSmartChart._indexOfSpacerOnToolbar.restore();
			this.oSmartChart._oToolbar.insertContent.restore();
			NavigationPopoverHandler.prototype.setSemanticObjectController.restore();
			this.oSmartChart._setSelectionDataPointHandling.restore();
			NavigationPopoverHandler.prototype.setSemanticObject.restore();
			NavigationPopoverHandler.prototype.openPopover.restore();
			this.oSmartChart._semanticObjectList.restore();
		});

		QUnit.test("_setSelectionDataPointHandling", function(assert) {

			//Arrange
			var oNavHandler = new NavigationPopoverHandler();
			var aSemanticObjects = [
				{
					id: "oSemObject"
				}
			];

			this.oSmartChart._oSemanticalNavButton = new Button({
				enabled: false
			});

			sinon.stub(this.oSmartChart, "_setSelectionDataPoint").callsFake(function() {
				return aSemanticObjects;
			});
			//Act
			var aSemanticObjectsResult = this.oSmartChart._setSelectionDataPointHandling(oNavHandler);

			//Assert
			assert.equal(this.oSmartChart._oSemanticalNavButton.getEnabled(), true, "semantical navigation button successfully enabled");
			assert.equal(aSemanticObjectsResult, aSemanticObjects, "Correct semantic object array returned");

			//Arrange
			aSemanticObjects = null;

			//Act
			this.oSmartChart._setSelectionDataPointHandling(oNavHandler);

			//Assert
			assert.equal(this.oSmartChart._oSemanticalNavButton.getEnabled(), false, "semantical navigation button successfully disabled");

			//Clean
			oNavHandler.destroy();
			this.oSmartChart._oSemanticalNavButton.destroy();
			this.oSmartChart._setSelectionDataPoint.restore();

		});

		QUnit.test("_setSemanticObjectsContext", function(assert) {

			//Arrange
			var oSelectionControl = new ManagedObject();

			var oBindingContext = {
				id: "aBindingContext",
				getObject: function() {
					return {
						name: "testName",
						id: "testId"
					};
				}
			};

			sinon.stub(oSelectionControl, "getBindingContext").callsFake(function() {
				return oBindingContext;
			});

			var oEvent = {
				getParameter: function() {
					return oSelectionControl;
				}
			};

			var aSemanticObjects = [
				{
					id: "oSemObject"
				}
			];

			var oStubDetermineSemanticObjects = sinon.stub(this.oSmartChart, "_determineSemanticObjectsforDetailsPopover").callsFake(function() {
				return aSemanticObjects;
			});

			this.oSmartChart._oSemanticNavHandler = new NavigationPopoverHandler();

			//Act
			var sSemanticObjectsResult = this.oSmartChart._setSemanticObjectsContext(oEvent);

			//Assert
			assert.ok(oStubDetermineSemanticObjects.calledWith(oBindingContext.getObject(), oBindingContext), "determineSemanticObjects called with correct odata context and data object");
			assert.equal(sSemanticObjectsResult, aSemanticObjects, "Correct semantic objects array returned");

			//Clean
			oSelectionControl.destroy();
			oSelectionControl.getBindingContext.restore();
			this.oSmartChart._determineSemanticObjectsforDetailsPopover.restore();
			this.oSmartChart._oSemanticNavHandler.destroy();
		});

		QUnit.test("_setSelectionDataPoint", function(assert) {

			//Arrange
			var oContext = new Context();
			var oContextObject = {
				id: "oTestContextObject"
			};

			this.oSmartChart._oChart = new Chart();
			this.oSmartChart._oSemanticNavHandler = new NavigationPopoverHandler();
			this.oSmartChart._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");
			this.oSmartChart._aDetailsEntries = [];
			this.oSmartChart._oDetailsModel = new JSONModel({
				items: this.oSmartChart._aDetailsEntries
			});

			var oStubGetSelectedDataPoints = sinon.stub(this.oSmartChart._oChart, "getSelectedDataPoints").callsFake(function() {
				return {
					dataPoints: [
						{
							context: oContext
						}
					]
				};
			});

			var oStubGetObject = sinon.stub(oContext, "getObject").callsFake(function() {
				return oContextObject;
			});

			var oStubSetBindingContext = sinon.stub(this.oSmartChart._oSemanticNavHandler, "setBindingContext");

			var aSemanticObjects = [
				{
					id: "oSemObject"
				}
			];

			var oStubDetermineSemanticObjects = sinon.stub(this.oSmartChart, "_determineSemanticObjects").callsFake(function() {
				return aSemanticObjects;
			});

			//Act
			var aSemanticObjectsResult = this.oSmartChart._setSelectionDataPoint(this.oSmartChart._oSemanticNavHandler);

			//Assert
			assert.ok(oStubGetSelectedDataPoints.calledOnce, "getSelectedDatapoints correctly called once");
			assert.ok(oStubDetermineSemanticObjects.calledWith(oContext.getObject(), oContext), "determineSemanticObjects called with correct odata context and data object");
			assert.ok(oStubSetBindingContext.calledWith(oContext), "Binding context of nav handler set with correct data context");
			assert.equal(aSemanticObjectsResult, aSemanticObjects, "semantic object array correctly returned");

			//Clean
			this.oSmartChart._oChart.getSelectedDataPoints.restore();
			oStubGetObject.reset();
			oStubGetObject.returns(oContextObject);

			//Arrange
			oStubGetSelectedDataPoints = sinon.stub(this.oSmartChart._oChart, "getSelectedDataPoints").callsFake(function() {
				return {
					dataPoints: [
						{
							context: oContext
						}, {
							context: oContext
						}
					]
				};
			});

			var aDataContext = [
				oContextObject, oContextObject
			];

			var oStubCondensBansedOnSameValue = sinon.stub(this.oSmartChart, "_condensBasedOnSameValue");

			//Act
			aSemanticObjectsResult = this.oSmartChart._setSelectionDataPoint(this.oSmartChart._oSemanticNavHandler);

			//Assert
			assert.equal(oStubGetObject.callCount, 2, "getObject of data context is called twice, which is correct");
			assert.ok(oStubCondensBansedOnSameValue.calledWith(aDataContext), "condensBasedOnSameValue called with correct params");
			assert.ok(oStubSetBindingContext.calledWith(this.oSmartChart._oChart.getSelectedDataPoints().dataPoints[1].context), "");

			//Clean

			this.oSmartChart._oChart.getSelectedDataPoints.restore();

			//Arrange
			oStubGetSelectedDataPoints = sinon.stub(this.oSmartChart._oChart, "getSelectedDataPoints").callsFake(function() {
				return {
					dataPoints: []
				};
			});

			//Act
			aSemanticObjectsResult = this.oSmartChart._setSelectionDataPoint(this.oSmartChart._oSemanticNavHandler);

			//Assert
			assert.equal(aSemanticObjectsResult, null, "Correctly returned null when no semantic objects are found");

			//Clean
			this.oSmartChart._oChart.destroy();
			this.oSmartChart._oSemanticNavHandler.destroy();
			oContext.destroy();
			this.oSmartChart._oDetailsModel.destroy();
			oContext.getObject.restore();
			this.oSmartChart._oChart.getSelectedDataPoints.restore();
			this.oSmartChart._oSemanticNavHandler.setBindingContext.restore();
			this.oSmartChart._determineSemanticObjects.restore();
		});

		QUnit.test("_condensBasedOnSameValue", function(assert) {

			//Arrange
			var aSemanticObjects = [
				{
					name: "semObj1",
					fieldLabel: "semObj1"
				}, {
					name: "semObj2",
					fieldLabel: "semObj2"
				}, {
					name: "semObj3",
					fieldLabel: "semObj3"
				}
			];

			var aData = [
				{}, {}
			];

			sinon.stub(this.oSmartChart, "_determineSemanticObjects").callsFake(function() {
				return aSemanticObjects;
			});

			sinon.stub(this.oSmartChart, "_bAllValuesAreEqual").callsFake(function() {
				return true;
			});

			//Act
			var aSemObj = this.oSmartChart._condensBasedOnSameValue(aData);

			//Assert
			assert.ok(jQuery(aSemObj).not(aSemanticObjects).length === 0 && jQuery(aSemanticObjects).not(aSemObj).length === 0, "Returned corred arra of semantic objects");

			//Clean
			this.oSmartChart._determineSemanticObjects.restore();
			this.oSmartChart._bAllValuesAreEqual.restore();
		});

		QUnit.test("_bAllValuesAreEqual", function(assert) {

			//Arrange
			var aData = [
				{
					name: "semObj1",
					fieldLabel: "semObj1"
				}, {
					name: "semObj1",
					fieldLabel: "semObj2"
				}
			];

			var sFieldName = "name";

			//Act
			var bIsEqual = this.oSmartChart._bAllValuesAreEqual(aData, sFieldName);

			//Assert
			assert.equal(bIsEqual, true, "Correctly returned true when all values are equal");

			//Arrange
			sFieldName = "fieldLabel";

			//Act
			bIsEqual = this.oSmartChart._bAllValuesAreEqual(aData, sFieldName);

			//Assert
			assert.equal(bIsEqual, false, "Correctly returned false when not all values are equal");

		});

		QUnit.test("_semanticObjectList", function(assert) {

			//Arrange
			this.oSmartChart._oChart = new Chart();
			this.oSmartChart._oSemanticalNavButton = new Button();

			this.oSmartChart._oSemanticNavHandler = new NavigationPopoverHandler();
			sinon.spy(this.oSmartChart._oSemanticNavHandler, "setSemanticObject");

			var aSemanticObjects = [
				{
					name: "semObj1",
					fieldLabel: "semObj1"
				}, {
					name: "semObj2",
					fieldLabel: "semObj2"
				}, {
					name: "semObj3",
					fieldLabel: "semObj3"
				}
			];

			var oStubAddItem = sinon.stub(List.prototype, "addItem");
			var oStubData = sinon.stub(StandardListItem.prototype, "data");

			var oStubAddContent = sinon.stub(ResponsivePopover.prototype, "addContent");
			var oStubOpenBy = sinon.stub(ResponsivePopover.prototype, "openBy");

			//Act
			this.oSmartChart._semanticObjectList(aSemanticObjects, this.oSmartChart._oSemanticNavHandler);

			//Assert
			assert.equal(oStubAddItem.callCount, 3, "");
			assert.equal(oStubData.callCount, 6, "");//fieldName and semObj data
			assert.ok(oStubAddContent.calledOnce, "");
			assert.ok(oStubOpenBy.calledWith(this.oSmartChart._oSemanticalNavButton));

			//Clean
			this.oSmartChart._oChart.destroy();
			this.oSmartChart._oSemanticalNavButton.destroy();
			this.oSmartChart._oSemanticNavHandler.destroy();
			this.oSmartChart._oSemanticNavHandler.setSemanticObject.restore();
			List.prototype.addItem.restore();
			StandardListItem.prototype.data.restore();
			ResponsivePopover.prototype.addContent.restore();
			ResponsivePopover.prototype.openBy.restore();

		});

		QUnit.test("_determineSemanticObjects", function(assert) {

			//Arrange
			var mData = {
				id: "one",
				name: "two",
				count: "three"
			};

			var oDataContext = {};

			var oField = {
				isDimension: true,
				isSemanticObject: true,
				fieldLabel: "testFieldLabel"
			};

			sinon.stub(this.oSmartChart, "_getField").callsFake(function() {
				return oField;
			});

			//Act
			var aSemanticObjects = this.oSmartChart._determineSemanticObjects(mData, oDataContext);
			var aSemObjectResult = [
				oField, oField, oField
			];

			//Assert
			assert.ok(jQuery(aSemanticObjects).not(aSemObjectResult).length === 0 && jQuery(aSemObjectResult).not(aSemanticObjects).length === 0, "Returned corred array of semantic objects");

		});

		QUnit.test("_getDrillStackDimensions", function(assert) {

			//Arrange
			this.oSmartChart._oChart = new Chart();

			var aStackLevel1 = {
				dimension: [
					"Customer", "Currency"
				]
			};
			var aStackLevel2 = {
				dimension: [
					"Customer", "Currency", "Status", "Supplier"
				]
			};
			var aStackLevel3 = {
				dimension: [
					"City"
				]
			};
			var aStackLevel4 = {
				dimension: [
					"Age", "Unit"
				]
			};
			var aDrillStack = [
				aStackLevel1, aStackLevel2, aStackLevel3, aStackLevel4
			];

			sinon.stub(this.oSmartChart._oChart, "getDrillStack").callsFake(function() {

				return aDrillStack;
			});

			//Act
			var aDrillStackDimensions = this.oSmartChart._getDrillStackDimensions();

			//Assert
			var aReturnVal = [
				"Customer", "Currency", "Status", "Supplier", "City", "Age", "Unit"
			];
			assert.deepEqual(aDrillStackDimensions, aReturnVal, "Correct unique dimensions returned.");

		});

		QUnit.test("_drillDown", function(assert) {

			//Arrange
			var oSpyAttachLiveChange = sinon.spy(SearchField.prototype, "attachLiveChange");
			var oSpyAddContentRight = sinon.spy(Bar.prototype, "addContentRight");
			var oSpyAddContent = sinon.spy(ResponsivePopover.prototype, "addContent");

			var oStubGetFieldTooltip = sinon.stub(this.oSmartChart, "_getFieldTooltip").callsFake(function() {
				return "testToolTip";
			});

			//Metadata fields
			this.oSmartChart._oChartProvider = {
				getViewField: function(sName) {
					return {
						name: "dummy",
						filterable: true
					};
				}
			};

			var oDim1 = new Dimension({
				name: "FirstDim",
				label: "FirstDim"
			});
			var oDim2 = new Dimension({
				name: "SecondDim",
				label: "SecondDim"
			});
			var oDim3 = new Dimension({
				name: "ThirdDim",
				label: "ThirdDim"
			});
			var aDimensions = [
				oDim1, oDim2, oDim3
			];

			var oStubGetSortedDimensions = sinon.stub(this.oSmartChart, "_getSortedDimensions").callsFake(function() {
				return aDimensions;
			});

			this.oSmartChart._oChart = new Chart({
				dimensions: aDimensions
			});

			var oStubOpenBy = sinon.stub(ResponsivePopover.prototype, "openBy");

			var oEvent = {
				getSource: function() {
					return new Button();
				}
			};

			//Act
			this.oSmartChart._drillDown(oEvent);

			//Assert
			assert.ok(oSpyAttachLiveChange.calledOnce, "AttachLiveChange of searchField correctyl called");
			assert.ok(oSpyAddContentRight.calledOnce, "AddContentRight of bar correctly called");
			if (!Device.system.phone && !Device.system.tablet) {
				assert.equal(oSpyAddContent.callCount, 2, "addContent of popover correctly called");
			}
			assert.equal(oStubGetFieldTooltip.callCount, 3, "getTooltip was corretly called " + aDimensions.length + " times");
			assert.ok(oStubGetSortedDimensions.calledOnce, "_getSortedDimensions was correctly called");
			assert.ok(oStubOpenBy.calledOnce, "openBy of popover was correctly called");

			//Clean
			SearchField.prototype.attachLiveChange.restore();
			Bar.prototype.addContentRight.restore();
			ResponsivePopover.prototype.addContent.restore();
			this.oSmartChart._getFieldTooltip.restore();
			this.oSmartChart._getSortedDimensions.restore();
			ResponsivePopover.prototype.openBy.restore();
			this.oSmartChart._oChart.destroy();
		});

		QUnit.test("_displayChartTypes", function(assert) {

			//Arrange
			this.oSmartChart._oChart = new Chart();
			this.oSmartChart._bAvailableChartListIsOpen = false;

			var oEvent = {
				getSource: function() {
					return new Button();
				}
			};

			var oSpyAttachLiveChange = sinon.spy(SearchField.prototype, "attachLiveChange");
			var oSpyAddContentRight = sinon.spy(Bar.prototype, "addContentRight");
			var oSpyAddContent = sinon.spy(ResponsivePopover.prototype, "addContent");
			var oSpyAttachAfterClose = sinon.spy(ResponsivePopover.prototype, "attachAfterClose");
			var oSpySetModel = sinon.spy(ResponsivePopover.prototype, "setModel");
			var oStubOpenBy = sinon.stub(ResponsivePopover.prototype, "openBy");

			var oModel = new JSONModel();
			sinon.stub(this.oSmartChart, "getModel").callsFake(function() {
				return oModel;
			});

			//Act
			this.oSmartChart._displayChartTypes(oEvent);

			//Assert
			assert.equal(this.oSmartChart._bAvailableChartListIsOpen, true, "");
			assert.ok(oSpyAttachLiveChange.calledOnce, "");
			assert.ok(oSpyAddContentRight.calledOnce, "");
			if (!Device.system.phone && !Device.system.tablet) {
				assert.equal(oSpyAddContent.callCount, 2, "");
			}
			assert.ok(oSpyAttachAfterClose.calledOnce, "");
			assert.ok(oSpySetModel.calledOnce, "");
			assert.ok(oSpySetModel.calledWith(oModel, "$smartChartTypes"));
			assert.ok(oStubOpenBy.calledOnce);

			//Clean
			this.oSmartChart._oChart.destroy();
			SearchField.prototype.attachLiveChange.restore();
			Bar.prototype.addContentRight.restore();
			ResponsivePopover.prototype.addContent.restore();
			ResponsivePopover.prototype.attachAfterClose.restore();
			ResponsivePopover.prototype.setModel.restore();
			ResponsivePopover.prototype.openBy.restore();
		});

		QUnit.test("_rerenderControlInFullscreen", function(assert) {

			//Arrange
			this.oSmartChart._oChart = new Chart();
			this.oSmartChart.bFullScreen = true;
			this.oSmartChart._oFullScreenUtil = {
				cleanUpFullScreen: function() {
				}
			};

			var oSetLayoutDataSpy = new sinon.spy(this.oSmartChart._oChart, "setLayoutData");
			var oInvalidateSpy = new sinon.spy(this.oSmartChart, "invalidate");

			//Act
			this.oSmartChart._rerenderControlInFullscreen();

			//Assert
			assert.ok(oSetLayoutDataSpy.calledOnce, "setLayoutData correctly called once");
			assert.ok(oInvalidateSpy.calledOnce, "Inner chart correctly invalidated");

			assert.equal(this.oSmartChart._oChart.getLayoutData().getProperty("baseSize"), "100%", "setLayoutData correctly called with value 100%");
			assert.ok(oInvalidateSpy.calledWith(this.oSmartChart.getChart()), "invalidate correctly called with inner chart as param");

			//Clean
			this.oSmartChart._oChart.setLayoutData.restore();
			this.oSmartChart.invalidate.restore();
			this.oSmartChart.bFullScreen = null;
			this.oSmartChart._oFullScreenUtil = null;
			this.oSmartChart._oChart.destroy();
		});

		QUnit.test("_toggleFullScreen", function(assert) {

			//Arrange
			var bFlag = true;
			this.oSmartChart._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");
			this.oSmartChart.bFullScreen = null;
			this.oSmartChart._oFullScreenUtil = null;
			this.oSmartChart.oFullScreenButton = new Button();

			var oStubToggleFullScreen = sinon.stub(FullScreenUtil, "toggleFullScreen");

			//Act
			this.oSmartChart._toggleFullScreen(bFlag);

			//Assert
			assert.equal(this.oSmartChart.bFullScreen, bFlag, "Boolean successfully set into instance");
			assert.ok(this.oSmartChart._oFullScreenUtil, "FullScreenUtil was successfully created");
			assert.ok(oStubToggleFullScreen.calledWith(this.oSmartChart, this.oSmartChart.bFullScreen), "toggleFullScreen of FullScreenUtil successfully called with correct params");
			assert.equal(this.oSmartChart.oFullScreenButton.getTooltip(), this.oSmartChart._oRb.getText("CHART_MINIMIZEBTN_TOOLTIP"), "Correct Minimize tooltip set in full screen button");
			assert.equal(this.oSmartChart.oFullScreenButton.getText(), this.oSmartChart._oRb.getText("CHART_MINIMIZEBTN_TEXT"), "Correct Minimize text set in full screen button");
			assert.equal(this.oSmartChart.oFullScreenButton.getIcon(), "sap-icon://exit-full-screen", "Correct icon set in full screen button");

			//Clean
			oStubToggleFullScreen.reset();

			//Arrange
			bFlag = false;

			//Act
			this.oSmartChart._toggleFullScreen(bFlag);

			//Arrange
			assert.equal(this.oSmartChart.bFullScreen, bFlag, "Boolean successfully set into instance");
			assert.ok(oStubToggleFullScreen.calledWith(this.oSmartChart, this.oSmartChart.bFullScreen), "toggleFullScreen of FullScreenUtil successfully called with correct params");
			assert.equal(this.oSmartChart.oFullScreenButton.getTooltip(), this.oSmartChart._oRb.getText("CHART_MAXIMIZEBTN_TOOLTIP"), "Correct Maximize tooltip set in full screen button");
			assert.equal(this.oSmartChart.oFullScreenButton.getText(), this.oSmartChart._oRb.getText("CHART_MAXIMIZEBTN_TEXT"), "Correct Maximize text set in full screen button");
			assert.equal(this.oSmartChart.oFullScreenButton.getIcon(), "sap-icon://full-screen", "Correct icon set in full screen button");

			//Clean
			this.oSmartChart.oFullScreenButton.destroy();
			this.oSmartChart.oFullScreenButton = null;
			oStubToggleFullScreen.reset();

			//Act
			this.oSmartChart._toggleFullScreen(bFlag);

			//Assert
			assert.equal(oStubToggleFullScreen.callCount, 0, "Correctly returned from function when no fullscreen button inscance existed");

			//Clean
			FullScreenUtil.toggleFullScreen.restore();
			this.oSmartChart._oFullScreenUtil = null;
			this.oSmartChart.bFullScreen = null;
		});

		QUnit.test("test header text features", function(assert) {
			this.oSmartChart.setUseChartPersonalisation(false);
			this.oSmartChart.setUseVariantManagement(false);
			this.oSmartChart.bIsInitialised = true;

			var sHeaderText = "myTestHeader";
			this.oSmartChart.setHeader(sHeaderText);
			assert.equal(this.oSmartChart.getHeader(), sHeaderText, "header text has to be equal");
		});

		QUnit.test("test apply and fetch variant", function(assert) {
			var oTestVariant = {}, bChartReseted;
			this.oSmartChart._oSmartFilter = {
				detachSearch: function() {
				},
				detachFilterChange: function() {
				},
				detachCancel: function() {
				}
			};
			this.oSmartChart._oChart = {
				setShowOverlay: function() {
				},
				setBusy: function() {
				}
			};

			this.oSmartChart._oPersController = {
				resetPersonalization: function() {
					bChartReseted = true;
				},
				setPersonalizationData: function() {
					//foo
				}
			};

			sinon.stub(this.oSmartChart, "_renderOverlay");

			this.oSmartChart.applyVariant(oTestVariant);
			var oResultVariant = this.oSmartChart.fetchVariant();
			assert.equal(oResultVariant, oTestVariant, "applied variant has to equal fetched variant");

			this.oSmartChart.applyVariant("STANDARD");
			oResultVariant = this.oSmartChart.fetchVariant();
			assert.deepEqual(oResultVariant, {}, "applied STANDARD variant should return empty variant");
			assert.ok(bChartReseted, "applying STANDARD variant should reset chart");
		});

		QUnit.test("test apply for application standard", function(assert) {
			var oTestVariant = {
				foo: "bar"
			};
			this.oSmartChart._oSmartFilter = {
				detachSearch: function() {
				},
				detachFilterChange: function() {
				},
				detachCancel: function() {
				}
			};
			this.oSmartChart._oChart = {
				setShowOverlay: function() {
				},
				setBusy: function() {
				}
			};

			this.oSmartChart._oPersController = {
				resetPersonalization: function() {
				},
				setPersonalizationData: function() {
					//foo
				}
			};

			sinon.stub(this.oSmartChart, "_renderOverlay");

			this.oSmartChart.applyVariant(oTestVariant, "STANDARD");
			var oResultVariant = this.oSmartChart.fetchVariant();
			assert.equal(oResultVariant, oTestVariant, "applied application standard variant has to equal fetched variant");

			this.oSmartChart.applyVariant({});
			oResultVariant = this.oSmartChart.fetchVariant();
			assert.deepEqual(oResultVariant, {}, "applied any variant should return that variant and not merge application variant");
		});

		QUnit.test("test add Spacer", function(assert) {
			this.oSmartChart._createToolbar();
			this.oSmartChart._addSpacerToToolbar();

			assert.equal(this.oSmartChart._oToolbar.getContent().length, 1, "one item has to be added to the toolbar");
			assert.ok(this.oSmartChart._oToolbar.getContent()[0] instanceof ToolbarSpacer, "ToolbarSpacer has to be added to toolbar");
		});

		QUnit.test("test _getChangeStatus", function(assert) {
			var returnedChangeStatus = this.oSmartChart._getChangeStatus();
			assert.equal(returnedChangeStatus, compLibrary.personalization.ChangeType.ModelChanged, "change status has to be correct");

			returnedChangeStatus = this.oSmartChart._getChangeStatus({
				sort: compLibrary.personalization.ChangeType.Unchanged,
				filter: compLibrary.personalization.ChangeType.Unchanged,
				columns: compLibrary.personalization.ChangeType.Unchanged,
				group: compLibrary.personalization.ChangeType.Unchanged
			});
			assert.equal(returnedChangeStatus, compLibrary.personalization.ChangeType.Unchanged, "change status has to be correct");

			returnedChangeStatus = this.oSmartChart._getChangeStatus({
				sort: compLibrary.personalization.ChangeType.Unchanged,
				filter: compLibrary.personalization.ChangeType.Unchanged,
				dimeasure: compLibrary.personalization.ChangeType.TableChanged,
				group: compLibrary.personalization.ChangeType.Unchanged
			});
			assert.equal(returnedChangeStatus, compLibrary.personalization.ChangeType.TableChanged, "change status has to be correct");

			returnedChangeStatus = this.oSmartChart._getChangeStatus({
				sort: compLibrary.personalization.ChangeType.Unchanged,
				filter: compLibrary.personalization.ChangeType.Unchanged,
				dimeasure: compLibrary.personalization.ChangeType.TableChanged,
				group: compLibrary.personalization.ChangeType.ModelChanged
			});
			assert.equal(returnedChangeStatus, compLibrary.personalization.ChangeType.ModelChanged, "change status has to be correct");

		});

		QUnit.test("_fireChartDataChanged", function(assert) {
			//Arrange
			this.oSmartChart._oChart = new Chart();
			var oChangeStatus = {
				dimeasure: "Unchanged",
				filter: "Unchanged",
				sort: "Unchanged"
			};
			var fChartDataChangedStub = sinon.stub(this.oSmartChart, "fireChartDataChanged");

			//Act
			this.oSmartChart._fireChartDataChanged(oChangeStatus);

			//Assert
			var oChangeTypes = {
				changeTypes: {
					dimeasure: false,
					filter: false,
					sort: false
				}
			};

			assert.ok(fChartDataChangedStub.calledWith(oChangeTypes), "chartDataChanged event fired with correct data");

			//Arrange
			oChangeStatus = {
				dimeasure: "TableChanged",
				filter: "Unchanged",
				sort: "ModelChanged"
			};
			//Act
			this.oSmartChart._fireChartDataChanged(oChangeStatus);
			//Assert
			oChangeTypes = {
				changeTypes: {
					dimeasure: true,
					filter: false,
					sort: true
				}
			};

			assert.ok(fChartDataChangedStub.calledWith(oChangeTypes), "chartDataChanged event fired with correct data");

			//Arrange
			oChangeStatus = {
				dimeasure: "Unchanged",
				filter: "ModelChanged",
				sort: "ModelChanged"
			};
			//Act
			this.oSmartChart._fireChartDataChanged(oChangeStatus);
			//Assert
			oChangeTypes = {
				changeTypes: {
					dimeasure: false,
					filter: true,
					sort: true
				}
			};

			assert.ok(fChartDataChangedStub.calledWith(oChangeTypes), "chartDataChanged event fired with correct data");

			//Arrange
			oChangeStatus = {
				dimeasure: "TableChanged",
				filter: "ModelChanged",
				sort: "ModelChanged"
			};
			//Act
			this.oSmartChart._fireChartDataChanged(oChangeStatus);
			//Assert
			oChangeTypes = {
				changeTypes: {
					dimeasure: true,
					filter: true,
					sort: true
				}
			};

			assert.ok(fChartDataChangedStub.calledWith(oChangeTypes), "chartDataChanged event fired with correct data");

			//Clean
			this.oSmartChart._oChart.destroy();
			this.oSmartChart.fireChartDataChanged.restore();

		});

		QUnit.test("test _persistPersonalization", function(assert) {
			var sVariantKey;
			var oFinalParams;
			this.oSmartChart._oVariantManagement = {
				getCurrentVariantId: function() {
					return sVariantKey;
				},
				fireSave: function(oParams) {
					oFinalParams = oParams;
				},
				detachInitialise: function() {
				},
				detachAfterSave: function() {
				},
				detachSave: function() {
				},
				isPageVariant: function() {
				}
			};

			sVariantKey = null;
			this.oSmartChart._persistPersonalisation();
			assert.deepEqual(oFinalParams, {
				name: "Personalisation",
				implicit: true,
				global: false,
				overwrite: false,
				key: null,
				def: true
			}, "fire save has to be called with correct parameters");

			sVariantKey = "123";
			this.oSmartChart._persistPersonalisation();
			assert.deepEqual(oFinalParams, {
				name: "Personalisation",
				implicit: true,
				global: false,
				overwrite: true,
				key: "123",
				def: true
			}, "fire save has to be called with correct parameters");
		});

		QUnit.test("test _createVariantManagementControl", function(assert) {
			this.oSmartChart.setUseVariantManagement(true);
			this.oSmartChart.setPersistencyKey("foo");

			var oPersInfoSpy = sinon.spy(PersonalizableInfo.prototype, "setControl");

			this.oSmartChart._createVariantManagementControl();

			assert.ok(oPersInfoSpy.called, "A new PersonalizableInfo sets the smart chart as control");
			var oPersInfo = oPersInfoSpy.getCall(0).thisValue;
			var oControl = oPersInfo.getControl();
			assert.equal(this.oSmartChart._oVariantManagement.getPersonalizableControls()[0].getType(), "chart", "PersonalizableInfo.type has to be set correctly");
			assert.equal(this.oSmartChart._oVariantManagement.getPersonalizableControls()[0].getKeyName(), "persistencyKey", "PersonalizableInfo.keyName has to be set correctly");
			assert.ok(oControl === this.oSmartChart.getId(), "PersonalizableInfo Control has to be set to SmartChart");

			assert.equal(this.oSmartChart._oVariantManagement.getShowShare(), true, "SmartVariantManagement has to be instantiated correctly - showShare");
			assert.ok(this.oSmartChart._oVariantManagement.getPersonalizableControls()[0] === oPersInfo, "SmartVariantManagement has to be instantiated correctly - personalizableControls");

			this.oSmartChart._oVariantManagement._initialize({}, this.oSmartChart._oVariantManagement._getControlWrapper(sap.ui.getCore().byId(oControl)));
			assert.equal(this.oSmartChart._oCurrentVariant, "STANDARD", "current variant has to be initialized");

			PersonalizableInfo.prototype.setControl.restore();
		});

		QUnit.test("test_getChart function", function(assert) {
			var oDummy = {};
			this.oSmartChart._oChart = oDummy;

			assert.equal(this.oSmartChart.getChart(), oDummy);
		});

		QUnit.test("test _addSeparatorToToolbar function", function(assert) {
			var oInsertedObject = null;
			var iInsertIndex = -1;
			var sExistingHeight, sHeight;
			this.oSmartChart.setHeader("Dummy");
			this.oSmartChart.setUseVariantManagement(true);
			this.oSmartChart._oToolbar = {
				getHeight: function() {
					return sExistingHeight;
				},
				setHeight: function(sSetHeight) {
					sHeight = sSetHeight;
				},
				insertContent: function(oObject, iIndex) {
					iInsertIndex = iIndex;
					oInsertedObject = oObject;
				}
			};

			this.oSmartChart._oVariantManagement = {
				isPageVariant: function() {
					return false;
				}
			};

			this.oSmartChart._addSeparatorToToolbar();
			assert.ok(oInsertedObject instanceof ToolbarSeparator, "object instanceof ToolbarSeparator should have been added");
			assert.equal(iInsertIndex, 0, "separator should be inserted at index 0");

			assert.equal(sHeight, "auto", "default height shall be auto, if nothing is set");

			this.oSmartChart._oVariantManagement = null;
		});

		QUnit.test("test _addVariantManagementToToolbar  function", function(assert) {
			var oDummyVariantManagement = {
				isPageVariant: function() {
					return false;
				},
				detachInitialise: function() {
				},
				detachAfterSave: function() {
				},
				detachSave: function() {
				}
			};
			var oInsertedObject = null;
			var iInsertIndex = -1;
			this.oSmartChart._oVariantManagement = oDummyVariantManagement;

			this.oSmartChart.setUseVariantManagement(true);
			this.oSmartChart._oToolbar = {
				insertContent: function(oObject, iIndex) {
					iInsertIndex = iIndex;
					oInsertedObject = oObject;
				}
			};

			this.oSmartChart._addVariantManagementToToolbar(true);
			assert.equal(oInsertedObject, oDummyVariantManagement, "variant management object should have been inserted");
			assert.equal(iInsertIndex, 0, "variant management should be inserted at index 0");
		});

		QUnit.test("test _addPersonalisationToToolbar function", function(assert) {
			var bDialogOpen = false;

			this.oSmartChart._oPersController = {
				openDialog: function() {
					bDialogOpen = true;
				}
			};

			var oAddedToToolbar = null;

			this.oSmartChart.setUseChartPersonalisation(true);
			this.oSmartChart._oToolbar = {
				addContent: function(oObject) {
					oAddedToToolbar = oObject;
				}
			};

			this.oSmartChart._addPersonalisationToToolbar();
			assert.ok(oAddedToToolbar instanceof Button);

			oAddedToToolbar.firePress();
			assert.ok(bDialogOpen);
		});

		QUnit.test("test reBindChart function", function(assert) {
			var oBindingParameters = null;
			var bBeforeRebindCalled = false;
			var bPreventBinding;

			this.oSmartChart._oChart = new Chart();
			this.oSmartChart._oChartViewMetadata = {};

			var fBindStub = sinon.stub(this.oSmartChart._oChart, "bindData");

			this.oSmartChart.attachBeforeRebindChart(function(oParams) {
				bBeforeRebindCalled = true;
				oParams.getParameter("bindingParams").preventChartBind = bPreventBinding;
				oParams.getParameter("bindingParams").parameters["select"] = [
					"foo"
				];
				oParams.getParameter("bindingParams").length = 5;
			});

			this.oSmartChart._oChartProvider = {
				getMaxItems: function() {
					return -1;
				}
			};

			bPreventBinding = true;
			this.oSmartChart.rebindChart();

			assert.ok(bBeforeRebindCalled, "before rebind has to be called");
			assert.ok(!this.oSmartChart._bIsChartBound, "chart has to be unbound because of prevent binding");
			assert.ok(!this.oSmartChart._oChart.getBusy(), "internal chart has to set busy flag to false because of prevent binding");

			bPreventBinding = false;
			this.oSmartChart.rebindChart();

			assert.ok(this.oSmartChart._bIsChartBound, "chart has to be bound");
			assert.ok(this.oSmartChart._oChart.getBusy(), "internal chart has to set busy flag");

			assert.ok(fBindStub.calledOnce, "binding triggered on the internal chart");

			oBindingParameters = fBindStub.args[0][0];

			assert.ok(oBindingParameters, "binding parameters are set");

			//TODO: Temporary disabled due to failing voter related to:
			//Change in RoleMapper.js
			//Bring back after fix has been provided.

			//oBindingParameters.events.dataReceived();
			//assert.ok(!this.oSmartChart._oChart.getBusy(), "internal chart busy flag reseted");

		});

		QUnit.test("test CurrentVariantId property", function(assert) {
			sinon.stub(Log, "error");
			this.oSmartChart.setCurrentVariantId("dummy");

			assert.ok(Log.error.calledOnce, "variantManagement not in place, error should have been logged");

			var bGetterCalled = false;
			var bSetterCalled = false;
			var sSetVariantId = null;

			var sVariantId = "MyVariantId";

			this.oSmartChart._oVariantManagement = {
				getCurrentVariantId: function() {
					bGetterCalled = true;
					return sSetVariantId;
				},
				setCurrentVariantId: function(sId) {
					bSetterCalled = true;
					sSetVariantId = sId;
				},
				detachInitialise: function() {
				},
				detachAfterSave: function() {
				},
				detachSave: function() {
				},
				isPageVariant: function() {
				}
			};

			this.oSmartChart.setCurrentVariantId(sVariantId);

			assert.ok(bSetterCalled, "setter has to be called on internal variantmanagement");
			assert.equal(sSetVariantId, sVariantId, "set variant id has to be correct");

			var sReturnedId = this.oSmartChart.getCurrentVariantId();
			assert.ok(bGetterCalled, "Getter has to be called on internal variantmanagement");
			assert.equal(sReturnedId, sVariantId, "get variant id has to be correct");

			//Clean up
			Log.error.restore();
		});

		QUnit.test("test _createContent function with perso data", function(assert) {
			//Arrange
			this.oSmartChart._oChart = new Chart();
			this.oSmartChart._oChartViewMetadata = {
				fields: [
					{
						name: "A_DIMENSION",
						isDimension: true,
						isMeasure: false,
						additionalProperty: {},
						sortable: true,
						filterable: true,
						filterType: "",
						maxLength: 1,
						precision: 1,
						scale: 1,
						role: "",
						aggregationRole: ""
					}, {
						name: "A_MEASURE",
						isDimension: false,
						isMeasure: true,
						additionalProperty: {},
						sortable: true,
						filterable: true,
						filterType: "",
						maxLength: 1,
						precision: 1,
						scale: 1,
						role: "",
						aggregationRole: ""
					}, {
						name: "A_FILTER",
						isDimension: false,
						isMeasure: false,
						additionalProperty: {},
						sortable: false,
						filterable: true,
						filterType: "",
						maxLength: 1,
						precision: 1,
						scale: 1,
						role: "",
						aggregationRole: ""
					}, {
						name: "B_FILTER",
						isDimension: false,
						isMeasure: false,
						additionalProperty: {},
						sortable: true,
						filterable: false,
						filterType: "",
						maxLength: 1,
						precision: 1,
						scale: 1,
						role: "",
						aggregationRole: ""
					}
				]
			};
			//Act
			this.oSmartChart._createContent();
			//Assert
			var aDimensions = this.oSmartChart._oChart.getDimensions();
			assert.ok(aDimensions);
			assert.ok(aDimensions.length, 1);
			assert.ok(aDimensions[0].data("p13nData"));

			var aMeasures = this.oSmartChart._oChart.getMeasures();
			assert.ok(aMeasures);
			assert.ok(aMeasures.length, 1);
			assert.ok(aMeasures[0].data("p13nData"));

			var aData = this.oSmartChart._oChart.data("p13nData");
			assert.ok(aData);
			assert.ok(aData.length, 2);

			//Test for TimeDimension instances

			//Arrange
			this.oSmartChart._oChart = new Chart();
			this.oSmartChart._oChartViewMetadata = {
				fields: [
					{
						name: "A_DIMENSION",
						isDimension: true,
						isTimeDimension: true,
						timeUnitType: "Date",
						isMeasure: false,
						additionalProperty: {},
						sortable: true,
						filterable: true,
						filterType: "",
						maxLength: 1,
						precision: 1,
						scale: 1,
						role: "",
						aggregationRole: ""
					}, {
						name: "B_DIMENSION",
						isDimension: true,
						isTimeDimension: true,
						timeUnitType: "yearmonthday",
						isMeasure: false,
						additionalProperty: {},
						sortable: true,
						filterable: true,
						filterType: "",
						maxLength: 1,
						precision: 1,
						scale: 1,
						role: "",
						aggregationRole: ""
					}, {
						name: "C_DIMENSION",
						isDimension: true,
						isTimeDimension: false,
						timeUnitType: undefined,
						isMeasure: false,
						additionalProperty: {},
						sortable: true,
						filterable: true,
						filterType: "",
						maxLength: 1,
						precision: 1,
						scale: 1,
						role: "",
						aggregationRole: ""
					}, {
						name: "A_MEASURE",
						isDimension: false,
						isMeasure: true,
						additionalProperty: {},
						sortable: true,
						filterable: true,
						filterType: "",
						maxLength: 1,
						precision: 1,
						scale: 1,
						role: "",
						aggregationRole: ""
					}, {
						name: "A_FILTER",
						isDimension: false,
						isMeasure: false,
						additionalProperty: {},
						sortable: false,
						filterable: true,
						filterType: "",
						maxLength: 1,
						precision: 1,
						scale: 1,
						role: "",
						aggregationRole: ""
					}, {
						name: "B_FILTER",
						isDimension: false,
						isMeasure: false,
						additionalProperty: {},
						sortable: true,
						filterable: false,
						filterType: "",
						maxLength: 1,
						precision: 1,
						scale: 1,
						role: "",
						aggregationRole: ""
					}
				]
			};

			//Act
			this.oSmartChart._createContent();

			//Assert
			aDimensions = this.oSmartChart._oChart.getDimensions();
			assert.ok(aDimensions);
			assert.ok(aDimensions.length, 3);

			var oTimeDimA = this.oSmartChart._oChart.getDimensionByName("A_DIMENSION");
			assert.strictEqual(oTimeDimA.getMetadata().getElementName(), "sap.chart.data.TimeDimension", "TimeDimension A successfully created");
			assert.strictEqual(oTimeDimA.getTimeUnit(), "Date", "TimeUnitType of TimeDimension A sucessfully set");

			var oTimeDimB = this.oSmartChart._oChart.getDimensionByName("B_DIMENSION");
			assert.strictEqual(oTimeDimB.getMetadata().getElementName(), "sap.chart.data.TimeDimension", "TimeDimension B successfully created");
			assert.strictEqual(oTimeDimB.getTimeUnit(), "yearmonthday", "TimeUnitType of TimeDimension B successfully set");

			var oDimC = this.oSmartChart._oChart.getDimensionByName("C_DIMENSION");
			assert.strictEqual(oDimC.getMetadata().getElementName(), "sap.chart.data.Dimension", "Dimension C successfully created");
			assert.strictEqual(oDimC.getTimeUnit, undefined, "TimeUnitType of Dimension C successfully undefined");

			//Clean
			this.oSmartChart._oChart.destroy();
		});

		QUnit.test("test _createContent function with custom dimension and measure", function(assert) {

			//Custom dimensions and measures
			var oCustomDimension = new Dimension({
				label: "CustomDimension",
				name: "A_DIMENSION",
				/*customData:{
					p13nData:'\{"columnKey":"A_DIMENSIONS", "aggregationRole":"dimension"\}'
				}*/
				customData: new CustomData({
					key: "p13nData",
					value: {
						"columnKey": "A_DIMENSION",
						"aggregationRole": "dimension"
					}
				})
			});
			var oCustomMeasure = new Measure({
				label: "CustomMeasure",
				name: "A_MEASURE",
				customData: new CustomData({
					key: "p13nData",
					value: {
						"columnKey": "A_MEASURE",
						"aggregationRole": "measure"
					}
				})
			});
			//Add custom instances to inner chart
			this.oSmartChart._oChart = new Chart({
				dimensions: [
					oCustomDimension
				],
				measures: [
					oCustomMeasure
				]
			});

			this.oSmartChart._oChartViewMetadata = {
				fields: [
					{
						name: "A_DIMENSION",
						isDimension: true,
						isMeasure: false,
						additionalProperty: {},
						sortable: true,
						filterable: true,
						filterType: "",
						maxLength: 1,
						precision: 1,
						scale: 1,
						role: "",
						aggregationRole: ""
					}, {
						name: "A_MEASURE",
						isDimension: false,
						isMeasure: true,
						additionalProperty: {},
						sortable: true,
						filterable: true,
						filterType: "",
						maxLength: 1,
						precision: 1,
						scale: 1,
						role: "",
						aggregationRole: ""
					}, {
						name: "A_FILTER",
						isDimension: false,
						isMeasure: false,
						additionalProperty: {},
						sortable: false,
						filterable: true,
						filterType: "",
						maxLength: 1,
						precision: 1,
						scale: 1,
						role: "",
						aggregationRole: ""
					}, {
						name: "B_FILTER",
						isDimension: false,
						isMeasure: false,
						additionalProperty: {},
						sortable: true,
						filterable: false,
						filterType: "",
						maxLength: 1,
						precision: 1,
						scale: 1,
						role: "",
						aggregationRole: ""
					}
				]
			};

			this.oSmartChart._createContent();

			var aDimensions = this.oSmartChart._oChart.getDimensions();
			assert.equal(aDimensions[0].getLabel(), oCustomDimension.getLabel(), "CustomDimension successfully used instead of creating new one out of _oChartViewMetadata");
			assert.ok(aDimensions.length, 1, "Only Custom dimension was used");
			assert.ok(aDimensions[0].data("p13nData"));

			var aMeasures = this.oSmartChart._oChart.getMeasures();
			assert.ok(aMeasures[0].getLabel(), oCustomMeasure.getLabel(), "CustomMeasure successfully used instead of creating new one out of _oChartViewMetadata");
			assert.ok(aMeasures.length, 1, "Only custom measure was used");
			assert.ok(aMeasures[0].data("p13nData"));

			var aData = this.oSmartChart._oChart.data("p13nData");
			assert.ok(aData, "P13n data successfully set on chart instance");
			assert.ok(aData.length, 2, "P13n data of chart instance has correct length");
			assert.equal(aData[0].columnKey, "A_FILTER", "Filter A successfully set");
			assert.equal(aData[1].columnKey, "B_FILTER", "Filter B successfully set");
		});

		QUnit.test("test _setIgnoreFromPersonalisationToSettings function", function(assert) {

			this.oSmartChart.setIgnoreFromPersonalisation("a,b,c,d");

			var oResult = this.oSmartChart._setIgnoreFromPersonalisationToSettings(null);
			var oExpected = {
				dimeasure: {
					ignoreColumnKeys: [
						"a", "b", "c", "d"
					]
				},
				filter: {
					ignoreColumnKeys: [
						"a", "b", "c", "d"
					]
				},
				sort: {
					ignoreColumnKeys: [
						"a", "b", "c", "d"
					]
				}
			};

			assert.deepEqual(oResult, oExpected, "settings have to be correct with empty settings");

			oResult = this.oSmartChart._setIgnoreFromPersonalisationToSettings({
				filter: {
					dummy: "Test"
				},
				dimeasure: {
					dummy: "Test"
				}
			});
			oExpected = {
				dimeasure: {
					dummy: "Test",
					ignoreColumnKeys: [
						"a", "b", "c", "d"
					]
				},
				filter: {
					dummy: "Test",
					ignoreColumnKeys: [
						"a", "b", "c", "d"
					]
				},
				sort: {
					ignoreColumnKeys: [
						"a", "b", "c", "d"
					]
				}
			};

			assert.deepEqual(oResult, oExpected, "settings have to be correct with prefilled settings");
		});

		QUnit.test("test _getAvailableChartTypes function", function(assert) {
			var oReturn, aChartTypes;
			var oReturnNull = {
				available: [
					{
						chart: 'bar'
					}, {
						chart: 'bubble'
					}, {
						chart: 'bullet'
					}, {
						chart: 'column'
					}
				]
			};
			var oReturnOne = {
				available: [
					{
						chart: 'bar'
					}, {
						chart: 'bubble'
					}, {
						chart: 'bullet'
					}, {
						chart: 'column'
					}, {
						chart: 'dual_bar'
					}
				]
			};

			var oChart = {
				getAvailableChartTypes: function() {
					return (oReturn);
				}
			};

			sinon.stub(this.oSmartChart, "_getChartTypes").returns({
				bar: "Bar",
				bubble: "Bubble",
				bullet: "Bullet",
				column: "Column",
				dual_bar: "Dual Bar"
			});

			this.oSmartChart.setIgnoredChartTypes("bar, bubble, bullet, column");

			this.oSmartChart._oChart = oChart;

			oReturn = oReturnNull;
			aChartTypes = this.oSmartChart._getAvailableChartTypes();
			assert.ok(aChartTypes);
			assert.deepEqual(aChartTypes.length, 0);

			oReturn = oReturnOne;
			aChartTypes = this.oSmartChart._getAvailableChartTypes();
			assert.ok(aChartTypes);
			assert.deepEqual(aChartTypes.length, 1);
			assert.deepEqual(aChartTypes[0].key, "dual_bar");

			this.oSmartChart.setIgnoredChartTypes("");
			aChartTypes = this.oSmartChart._getAvailableChartTypes();
			assert.ok(aChartTypes);
			assert.deepEqual(aChartTypes.length, 5);

		});

		QUnit.test("test _getAllChartTypes function", function(assert) {
			var aChartTypes;

			sinon.stub(this.oSmartChart, "_getChartTypes").returns({
				bar: "Bar",
				bubble: "Bubble",
				bullet: "Bullet",
				column: "Column",
				dual_bar: "Dual Bar"
			});

			aChartTypes = this.oSmartChart._getAllChartTypes();
			assert.ok(aChartTypes);

			var maxLength = aChartTypes.length;

			this.oSmartChart.setIgnoredChartTypes("bar, bubble, bullet, column");
			aChartTypes = this.oSmartChart._getAllChartTypes();
			assert.ok(aChartTypes);
			assert.deepEqual(aChartTypes.length, maxLength - 4);

			this.oSmartChart.setIgnoredChartTypes("bar");
			aChartTypes = this.oSmartChart._getAllChartTypes();
			assert.ok(aChartTypes);
			assert.deepEqual(aChartTypes.length, maxLength - 1);

		});

		QUnit.test("_toggleMeasureUnitBinding", function(assert) {

			//Arrange
			var sChartType = "100_stacked_bar";
			var aMeasures = [];

			//Measures
			var oMeasure1 = new Measure({
				name: "measure1",
				label: "measure 1",
				unitBinding: "Euro"
			});
			var oMeasure2 = new Measure({
				name: "measure2",
				label: "measure 2",
				unitBinding: "Dollar"
			});
			var oMeasure3 = new Measure({
				name: "measure3",
				label: "measure 3",
				unitBinding: "Pieces"
			});
			var oMeasure4 = new Measure({
				name: "measure5",
				label: "measure 3",
				unitBinding: "Persons"
			});//with no metadata field

			aMeasures.push(oMeasure1, oMeasure2, oMeasure3, oMeasure4);

			//Metadata fields
			this.oSmartChart._oChartProvider = {
				_aODataFieldMetadata: []
			};

			var oField1 = {
				"name": "measure1",
				"Org.OData.Measures.V1.ISOCurrency": {
					Path: "Euro"
				}
			};
			var oField2 = {
				"name": "measure2",
				"Org.OData.Measures.V1.ISOCurrency": {
					Path: "Dollar"
				}
			};
			var oField3 = {
				"name": "measure3",
				"Org.OData.Measures.V1.ISOCurrency": {
					Path: "Pieces"
				}
			};
			var oField4 = {
				"name": "measure4",
				"Org.OData.Measures.V1.ISOCurrency": {
					Path: "Groups"
				}
			};//with no measure instance

			this.oSmartChart._oChartProvider._aODataFieldMetadata.push(oField1, oField2, oField3, oField4);

			//Act
			//Set percentage chart type and check for deleted unit bindings
			this.oSmartChart._toggleMeasureUnitBinding(sChartType, aMeasures);

			//Assert
			assert.equal(oMeasure1.getUnitBinding(), undefined, "Unit binding 1 was successfully deleted");
			assert.equal(oMeasure2.getUnitBinding(), undefined, "Unit binding 2 was successfully deleted");
			assert.equal(oMeasure3.getUnitBinding(), undefined, "Unit binding 3 was successfully deleted");
			assert.equal(oMeasure4.getUnitBinding(), undefined, "Unit binding 4 was successfully deleted");

			//Arrange
			sChartType = "bar";

			//Act
			//Set bar chart type and check for restored unit bindings
			this.oSmartChart._toggleMeasureUnitBinding(sChartType, aMeasures);

			//Assert
			assert.equal(oMeasure1.getUnitBinding(), "Euro", "Unit binding 1 was successfully restored from metadata");
			assert.equal(oMeasure2.getUnitBinding(), "Dollar", "Unit binding 2 was successfully restored from metadata");
			assert.equal(oMeasure3.getUnitBinding(), "Pieces", "Unit binding 3 was successfully restored from metadata");
			assert.equal(oMeasure4.getUnitBinding(), undefined, "Unit binding 4 successfully still undefined as it has no meta field");

			oMeasure1.destroy();
			oMeasure2.destroy();
			oMeasure3.destroy();
			oMeasure4.destroy();
		});

		QUnit.test("Destroy", function(assert) {
			var bChartProviderDestroyed = false;
			var bPersControllerDestroyed = false;
			var bVariantManagementDestroyed = false;
			this.oSmartChart._oChartProvider = {
				destroy: function() {
					bChartProviderDestroyed = true;
				}
			};

			this.oSmartChart._oPersController = {
				destroy: function() {
					bPersControllerDestroyed = true;
				}
			};

			this.oSmartChart._oVariantManagement = {
				destroy: function() {
					bVariantManagementDestroyed = true;
				},
				isPageVariant: function() {
					return false;
				},
				detachInitialise: function() {
				},
				detachAfterSave: function() {
				},
				detachSave: function() {
				}
			};

			assert.equal(this.oSmartChart.bIsDestroyed, undefined);
			this.oSmartChart.destroy();
			assert.equal(this.oSmartChart._oChartProvider, null);
			assert.equal(this.oSmartChart._aChartViewMetadata, null);
			assert.strictEqual(this.oSmartChart.bIsDestroyed, true);
			assert.ok(bChartProviderDestroyed, "chart provider has to be destroyed");
			assert.ok(bPersControllerDestroyed, "pers controller has to be destroyed");
			assert.ok(bVariantManagementDestroyed, "variant management has to be destroyed");
		});

		QUnit.test("test _getSortedDimensions function", function(assert) {

			function Dim(sLabel) {
				this._sLabel = sLabel;
			}

			Dim.prototype.getLabel = function() {
				return this._sLabel;
			};

			var aLabels = [
				new Dim("Gamma"), new Dim("Beta"), new Dim("Omega"), new Dim("Alpha")
			];

			var oChart = {
				getDimensions: function() {
					return (aLabels);
				}
			};

			this.oSmartChart._oChart = oChart;
			var aSortedDim = this.oSmartChart._getSortedDimensions();
			assert.ok(aSortedDim);
			assert.strictEqual(aSortedDim[0].getLabel(), "Alpha");
			assert.strictEqual(aSortedDim[1].getLabel(), "Beta");
			assert.strictEqual(aSortedDim[2].getLabel(), "Gamma");
			assert.strictEqual(aSortedDim[3].getLabel(), "Omega");

		});

		QUnit.test("test _createChartTypeButton", function(assert) {
			var oChart = {
				getAvailableChartTypes: function() {
					return ({});
				},
				getChartType: function() {
					return {};
				}
			};

			sinon.stub(this.oSmartChart, "_getChartTypes").returns({
				bar: "Bar"
			});

			this.oSmartChart._oChart = oChart;
			var oChartTypeButton = this.oSmartChart._createChartTypeButton();

			assert.ok(oChartTypeButton);

		});

		QUnit.test("setShowDimensionsTitle", function(assert) {
			var oActual, oExpected = {
				"categoryAxis": {
					"title": {
						"visible": true
					}
				}
			};
			//create a mock chart
			var oChart = {
				setVizProperties: function(oVizProperties) {
					oActual = oVizProperties;
				}
			};

			this.oSmartChart._oChart = oChart;

			//check visibility true
			oExpected.categoryAxis.title.visible = true;

			this.oSmartChart.setShowDimensionsTitle(true);
			assert.deepEqual(oActual, oExpected, "The viz properties are set as expected");
			assert.equal(this.oSmartChart.getShowDimensionsTitle(), true, "The visibility of the dimensions title changed");

			//check visibility false
			oExpected.categoryAxis.title.visible = false;

			this.oSmartChart.setShowDimensionsTitle(false);
			assert.deepEqual(oActual, oExpected, "The viz properties are set as expected");
			assert.equal(this.oSmartChart.getShowDimensionsTitle(), false, "The visibility of the dimensions title changed");
		});

		QUnit.test("setShowMeasuresTitle", function(assert) {
			var oActual, oExpected = {
				"valueAxis": {
					"title": {
						"visible": true
					}
				}
			};
			//create a mock chart
			var oChart = {
				setVizProperties: function(oVizProperties) {
					oActual = oVizProperties;
				}
			};

			this.oSmartChart._oChart = oChart;

			//check visibility true
			oExpected.valueAxis.title.visible = true;

			this.oSmartChart.setShowMeasuresTitle(true);
			assert.deepEqual(oActual, oExpected, "The viz properties are set as expected");
			assert.equal(this.oSmartChart.getShowMeasuresTitle(), true, "The visibility of the measures title changed");

			//check visibility false
			oExpected.valueAxis.title.visible = false;

			this.oSmartChart.setShowMeasuresTitle(false);
			assert.deepEqual(oActual, oExpected, "The viz properties are set as expected");
			assert.equal(this.oSmartChart.getShowMeasuresTitle(), false, "The visibility of the measures title changed");
		});

		QUnit.module("sap.ui.comp.smartchart.SmartChart: default", {
			beforeEach: function() {
				this.oSmartChart = new SmartChart();
			},
			afterEach: function() {
				this.oSmartChart.destroy();
			}
		});

		QUnit.test("UiState", function(assert) {
			assert.ok(this.oSmartChart.getUiState());
		});

		QUnit.test("test noData property", function(assert) {
			var oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");

			assert.equal(this.oSmartChart.getNoData(), oRb.getText("CHART_NO_DATA_WITHOUT_FILTERBAR"), "The initial text for the noData property is correct in case there is no filterbar");

			var oSmartFilter = new SmartFilterBar({
				id: 'filter'
			});
			sinon.stub(this.oSmartChart, "getSmartFilterId").returns('filter');
			sinon.stub(this.oSmartChart, "_findControl").withArgs('filter').returns(oSmartFilter);

			this.oSmartChart.setNoData(undefined);//Reset the no data to defaul
			assert.equal(this.oSmartChart.getNoData(), oRb.getText("CHART_NO_DATA"), "The initial text for the noData property is correct in case there is a filterbar");

			this.oSmartChart._listenToSmartFilter();
			assert.equal(this.oSmartChart.getNoData(), oRb.getText("CHART_NO_RESULTS"), "After attaching to the search of the filter the text is correct");

			//Clean Up
			oSmartFilter.destroy();
		});

		QUnit.test("Test async NoData construct", function(assert) {
			//Arrange
			this.oSmartChart.setEnableAutoBinding(false);
			this.oSmartChart._oChartViewMetadata = {};

			var fCreateTempNoData = sinon.spy(this.oSmartChart, "_createTempNoData");

			//Act
			this.oSmartChart._checkAndTriggerBinding();

			//Assert
			assert.ok(fCreateTempNoData.calledOnce, "_createTempNoData function was called once");
			assert.ok(this.oSmartChart._oNoDataStruct, "temporary NoData structure has been created");
			assert.ok(this.oSmartChart._oNoDataStruct == this.oSmartChart.getItems()[0], "NoData construct successfully set within SmartChart's aggregation");

			//Arrange
			//Test the destruction of the NoData construct, once an inner chart gets created.
			var fnDone = assert.async();

			var fNoDataDestroy = sinon.spy(this.oSmartChart._oNoDataStruct, "destroy");

			this.oSmartChart._oChartProvider = {
				getMaxItems: function() {
					return -1;
				},
				getChartViewMetadata: function() {
					return {};
				}
			};

			var fStubInitialiseInnerChart = sinon.stub(this.oSmartChart, "_initialiseInnerChart").callsFake(function() {
				//We only need these two calls of the original function for testing the NoData
				//For simplicity reasons we don't call the original _intialiseInnerChart
				this.oSmartChart._createChart();
				this.oSmartChart.fireInitialise();
			}.bind(this));

			//Async Assert
			this.oSmartChart.attachInitialise(function() {
				//Assert
				assert.ok(fNoDataDestroy.calledOnce, "destroy was successfully called on NoData instance");
				assert.ok(this.oSmartChart._oNoDataStruct, undefined, "NoData instance is undefined");
				assert.ok(fStubInitialiseInnerChart.calledOnce, "_initialiseInnerChart function was called once");

				fnDone();

			}.bind(this));

			//Act
			this.oSmartChart._reBindChart();
		});

		QUnit.test("test NoData construct in cases where inner chart exists", function(assert) {
			//Arrange
			//Test in cases where an inner chart was already existing
			//Could be placed from outside or when attachInitialise is used by applications
			this.oSmartChart._oChart = new Chart();
			this.oSmartChart._oChartViewMetadata = {};
			var fCreateTempNoData = sinon.spy(this.oSmartChart, "_createTempNoData");
			//Act
			this.oSmartChart._checkAndTriggerBinding();
			//Assert
			assert.strictEqual(fCreateTempNoData.callCount, 0, "_createTempNoData function correctly never has been called");
			assert.ok(!this.oSmartChart._oNoDataStruct, "temporary NoData structure hasn't been created");
		});

		QUnit.test("test events in beforeRebindChart", function(assert) {
			var oBindingParameters = null;
			var mParameters = {
				"data": [],
				"foo": "bar"
			};
			var oEvent = {
				getParameter: function(sParam) {
					return mParameters[sParam];
				},
				getParameters: function() {
					return mParameters;
				}
			};

			this.oSmartChart._oChart = new Chart();
			this.oSmartChart._oChartViewMetadata = {};

			var fBindStub = sinon.stub(this.oSmartChart._oChart, "bindData");
			var fDataReceivedSpy = sinon.stub(this.oSmartChart, "fireDataReceived");
			var fChangeSpy = sinon.spy(this.oSmartChart, "_onDataLoadComplete");
			var fExternalDataRequestedSpy = sinon.stub();
			var fExternalDataReceivedSpy = sinon.stub();

			// Register events parameter - externally!
			this.oSmartChart.attachBeforeRebindChart(function(oEvt) {
				var mBindingParams = oEvt.getParameter("bindingParams");
				mBindingParams.events["dataRequested"] = fExternalDataRequestedSpy;
				mBindingParams.events["dataReceived"] = fExternalDataReceivedSpy;
			});

			this.oSmartChart._oChartProvider = {
				getMaxItems: function() {
					return -1;
				}
			};

			this.oSmartChart.rebindChart();

			//busy handling will now be done by the table internally
			assert.ok(fBindStub.calledOnce, "binding triggered on the internal table");

			oBindingParameters = fBindStub.args[0][0];

			assert.ok(oBindingParameters, "binding parameters are set");

			oBindingParameters.events.dataRequested(oEvent);

			// external
			assert.ok(fExternalDataRequestedSpy.calledOnce, "external dataRequested event was triggered due to binding event");
			assert.ok(fExternalDataRequestedSpy.calledWith(oEvent), "external dataRequested event was triggered due to binding event");

			oBindingParameters.events.dataReceived(oEvent);

			// internal
			assert.ok(fDataReceivedSpy.calledOnce, "dataReceived event was triggered due to binding event");
			// external
			assert.ok(fExternalDataReceivedSpy.calledOnce, "dataReceived event was triggered due to binding event");

			//Reset spy before simulating muliple binding events
			fDataReceivedSpy.reset();
			fExternalDataRequestedSpy.reset();
			fExternalDataReceivedSpy.reset();

			//Simulate 3 binding data request/response calls (e.g. paging)
			oBindingParameters.events.dataRequested(oEvent);
			oBindingParameters.events.dataReceived(oEvent);

			oBindingParameters.events.dataRequested(oEvent);
			oBindingParameters.events.dataReceived(oEvent);

			oBindingParameters.events.dataRequested(oEvent);
			oBindingParameters.events.dataReceived(oEvent);

			//event should be fired accordingly
			// internal
			assert.equal(fDataReceivedSpy.callCount, 3, "dataReceived event was triggered 3 times due to binding event");
			// external
			assert.equal(fExternalDataRequestedSpy.callCount, 3, "external dataRequested event was triggered 3 times due to binding event");
			assert.equal(fExternalDataReceivedSpy.callCount, 3, "external dataReceived event was triggered 3 times due to binding event");

			//Reset spy before simulating __simulateAsyncAnalyticalBinding binding events
			fDataReceivedSpy.reset();
			fExternalDataRequestedSpy.reset();
			fExternalDataReceivedSpy.reset();

			//Simulate 2 AnalyticalBinding data request/response calls, first one with __simulateAsyncAnalyticalBinding set
			mParameters["__simulateAsyncAnalyticalBinding"] = true;
			oBindingParameters.events.dataRequested(oEvent);
			oBindingParameters.events.dataReceived(oEvent);
			delete mParameters["__simulateAsyncAnalyticalBinding"];
			oBindingParameters.events.dataRequested(oEvent);
			oBindingParameters.events.dataReceived(oEvent);

			// internal
			assert.ok(fDataReceivedSpy.calledOnce, "dataReceived event was triggered just once due to binding event (__simulateAsyncAnalyticalBinding call was ignored)");

			// external
			assert.ok(fExternalDataRequestedSpy.calledTwice, "external dataRequested event was triggered twice due to binding event");
			assert.ok(fExternalDataReceivedSpy.calledTwice, "external dataReceived event was triggered twice due to binding event (__simulateAsyncAnalyticalBinding call was NOT ignored)");

			// Binding change event test
			fChangeSpy.reset();
			assert.ok(fChangeSpy.notCalled);
			oBindingParameters.events.change(oEvent);
			assert.ok(fChangeSpy.calledOnce);

		});

		QUnit.module("test filter rebind functionality", {
			beforeEach: function() {
				this.oSmartChart = new SmartChart();
				this.oSmartChart._oChart = new Chart();
				this.oSmartChart._oChartViewMetadata = {};

				this.oSmartChart._oChartProvider = {
					getMaxItems: function() {
						return -1;
					}
				};
			},
			afterEach: function() {
				this.oSmartChart._oChart.destroy();
				this.oSmartChart.destroy();
				this.oSmartChart = null;
			}
		});

		QUnit.test("Filter Handling - empty include", function(assert) {
			this.oSmartChart._oChart.bindData = function(oData) {
				//empty exclude filter
				var oFilter = oData.filters[0];
				assert.equal(oFilter.sPath, "EMPTY", "The second filter is for filtering as empty");
				assert.equal(oFilter.sOperator, "EQ", "The operator is equal");
				assert.equal(oFilter.oValue1, "", "Empty is translated to the empty string");
				assert.equal(oFilter.oValue2, undefined, "Second value is not set");
			};

			this.oSmartChart._oCurrentVariant = {
				filter: {
					filterItems: [
						{
							value1: undefined,
							value2: undefined,
							columnKey: "EMPTY",
							operation: "Empty",
							exclude: false
						}
					]
				}
			};

			this.oSmartChart.rebindChart();
		});

		QUnit.test("Filter Handling - empty exclude", function(assert) {
			this.oSmartChart._oChart.bindData = function(oData) {
				//empty exclude filter
				var oFilter = oData.filters[0].aFilters[0];//Exclude filters are all put in one filter
				assert.equal(oFilter.sPath, "EXL_EMPTY", "The first filter is for the exclude empty");
				assert.equal(oFilter.sOperator, "NE", "The operator is not equal");
				assert.equal(oFilter.oValue1, "", "Empty is translated to the empty string");
				assert.equal(oFilter.oValue2, undefined, "Second value is not set");
			};

			this.oSmartChart._oCurrentVariant = {
				filter: {
					filterItems: [
						{
							value1: undefined,
							value2: undefined,
							columnKey: "EXL_EMPTY",
							operation: "Empty",
							exclude: true
						}
					]
				}
			};

			this.oSmartChart.rebindChart();
		});

		QUnit.start();
	});
});
