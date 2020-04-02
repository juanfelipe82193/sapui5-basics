(function(){
	"use strict";
	jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
	jQuery.sap.require('sap.apf.testhelper.helper');
	jQuery.sap.require("sap.ui.model.resource.ResourceModel");
	function getTitleOfCustomItem(item){
		return item.getContent()[0].getItems()[0].getItems()[0].getText();
	}
	function getDescriptionOfCustomItem(item){
		return item.getContent()[0].getItems()[0].getItems()[1].getText();
	}
	function getWarningIcon(item){
		return item.getContent()[0].getItems()[1].getItems()[0];
	}
	function getInfoIcon(item){
		return item.getContent()[0].getItems()[1].getItems()[1];
	}
	function commonSetup(context, data){
		context.oCoreApi = {
			getTextNotHtmlEncoded : function(oLabel, aParameters){
				if(aParameters){
					return oLabel + "," + aParameters.join(",");
				}
				return "t:" + oLabel;
			}
		};
		context.oUiApi = {
			getAnalysisPath : function() {
				return {
					getController : function(){
						return {
							navigateToStep: function(index){
								context.navigationIndex = index;
							}
						};
					}
				};
			}
		};
		context.filterDialogView = new sap.ui.xmlview({
				viewName : "sap.apf.ui.reuse.view.pathFilterDisplay",
				viewData : {
					pathFilterInformation: data,
					oCoreApi: context.oCoreApi,
					oUiApi: context.oUiApi
				},
				id: "pathFilterDisplay"
			});
		context.filterDialog = context.filterDialogView.getContent()[0];
		context.filterDialog.open();
		context.navContainer = context.filterDialog.getContent()[0];
		sap.ui.getCore().applyChanges();
	}
	function attachAssertsOnClose(assert, context){
		var done = assert.async();
		context.filterDialog.attachAfterClose(function(){
			assert.notOk(context.filterDialog.isOpen(), "Dialog is closed");
			assert.strictEqual(context.filterDialog.bIsDestroyed, true, "Dialog is destroyed");
			assert.strictEqual(context.filterDialogView.bIsDestroyed, true, "View is destroyed");
			done();
		});
	}
	QUnit.module("Basic Interaction",{
		beforeEach: function(){
			this.modelData = [{
				text: "StepTitle1",
				selectablePropertyLabel : "Property1Label",
				filterValues: [{
					text: "Step-1-Value1"
				},{
					text: "Step-1-Value2"
				}],
				stepIndex : 0
			},{
				text: "StepTitle2",
				selectablePropertyLabel : "Property2Label",
				filterValues: [{
					text: "Step-2-Value1"
				},{
					text: "Step-2-Value2"
				}],
				stepIndex : 1
			},{
				text: "StepWithNoSelectionPossible",
				stepIndex : 2
			},{
				text: "Searchable Step",
				filterValues: [{
					text: "Searchable Key"
				},{
					text: "Other key"
				}],
				stepIndex : 3
			},{
				text: "StepWithoutSelection",
				selectablePropertyLabel: "PropertyLabel",
				stepIndex : 4
			}];
			commonSetup(this, this.modelData);
		},
		afterEach: function(){
			this.filterDialog.destroy();
			this.filterDialogView.destroy();
		}
	});
	QUnit.test("Dialog instantiation", function(assert){
		attachAssertsOnClose(assert, this);
		assert.strictEqual(this.filterDialog.getContentWidth(),jQuery(window).height() * 0.6 + "px", "Correct content width");
		assert.strictEqual(this.filterDialog.getContentHeight(),jQuery(window).height() * 0.6 + "px", "Correct content height");
		if (sap.ui.Device.system.desktop) {
			assert.strictEqual(this.filterDialog.hasStyleClass("sapUiSizeCompact"), true, "Compact style class set on Desktop");
		}
		assert.strictEqual(this.filterDialog.isOpen(), true, "Dialog is open");
		assert.strictEqual(this.filterDialog.getShowHeader(), false, "Header is deactivated for Dialog");
		assert.strictEqual(this.filterDialog.getResizable(), true, "Dialog is resizable");
		assert.strictEqual(this.filterDialog.getDraggable(), true, "Dialog is resizable");

		var navigateButton = this.filterDialog.getBeginButton();
		assert.strictEqual(navigateButton.getText(), "t:closeAndNavigate", "Correct text on navigate button is available");
		assert.strictEqual(navigateButton.getVisible(), false, "Navigate button is invisible");

		var closeButton = this.filterDialog.getEndButton();
		assert.strictEqual(closeButton.getText(), "t:close", "Correct Text key on close button is available");
		closeButton.firePress();
	});
	QUnit.test("Step Overview", function(assert){
		var currentPage = this.navContainer.getCurrentPage();
		assert.strictEqual(currentPage.getTitle(), "t:pathFilterDisplay-SelectedFilters", "Correct title key for step page");
		var list = currentPage.getContent()[0];
		assert.ok(currentPage.getId().indexOf("stepPage") > 0, "Correct initial page displayed in navContainer");
		assert.strictEqual(list.getItems().length, this.modelData.length, "Correct amount of items displayed on Overview page");
		var firstItem = list.getItems()[0];
		assert.strictEqual(getTitleOfCustomItem(firstItem), "StepTitle1", "Correct first item title");
		assert.strictEqual(firstItem.getType(), "Navigation", "Correct item type");
	});
	QUnit.test("Step Overview - Step with selections", function(assert){
		var currentPage = this.navContainer.getCurrentPage();
		var list = currentPage.getContent()[0];
		var firstItem = list.getItems()[0];
		assert.strictEqual(getTitleOfCustomItem(firstItem), "StepTitle1", "Correct first item title");
		assert.strictEqual(firstItem.getType(), "Navigation", "Correct item type");
		assert.strictEqual(getDescriptionOfCustomItem(firstItem), "Property1Label, amountSelected,2", "Correct description (PropertyLabel, text,parameterFortext");
	});
	QUnit.test("Step Overview - Step with no selection possible", function(assert){
		var currentPage = this.navContainer.getCurrentPage();
		var list = currentPage.getContent()[0];
		var firstItem = list.getItems()[2];
		assert.strictEqual(getTitleOfCustomItem(firstItem), "StepWithNoSelectionPossible", "Correct item");
		assert.strictEqual(getDescriptionOfCustomItem(firstItem), "t:noSelectionPossible", "Correct description");
	});
	QUnit.test("Step Overview - Step with no selection", function(assert){
		var currentPage = this.navContainer.getCurrentPage();
		var list = currentPage.getContent()[0];
		var firstItem = list.getItems()[4];
		assert.strictEqual(getTitleOfCustomItem(firstItem), "StepWithoutSelection", "Correct item");
		assert.strictEqual(getDescriptionOfCustomItem(firstItem), "PropertyLabel, t:nothingSelected", "Correct description");
	});
	QUnit.test("Search on Step Overview", function(assert){
		var currentPage = this.navContainer.getCurrentPage();
		var searchField = currentPage.getSubHeader().getContentLeft()[0];
		assert.ok(searchField, "Search field is available");
		var stepList = currentPage.getContent()[0];
		var initialLength = stepList.getItems().length;
		searchField.fireLiveChange({
			newValue : "Searchable"
		});
		assert.strictEqual(stepList.getItems().length, 1, "One item found from search");
		assert.strictEqual(getTitleOfCustomItem(stepList.getItems()[0]), "Searchable Step", "Correct step found");
		searchField.fireLiveChange({
			newValue : ""
		});
		assert.strictEqual(stepList.getItems().length, initialLength, "All items are available again");
	});
	QUnit.test("Search on Filter Values", function(assert){
		var stepPage = this.navContainer.getCurrentPage();
		var stepList = stepPage.getContent()[0];
		var firstItem = stepList.getItems()[3]; // Go in Searchable step
		assert.strictEqual(getTitleOfCustomItem(firstItem), "Searchable Step", "Correct item selected");
		firstItem.firePress();
		var currentPage = this.navContainer.getCurrentPage();
		var filterValuesList = currentPage.getContent()[0];
		var initialLength = filterValuesList.getItems().length;
		var searchField = currentPage.getSubHeader().getContentLeft()[0];
		assert.ok(searchField, "Search field is available");
		searchField.fireLiveChange({
			newValue : "Searchable"
		});
		assert.strictEqual(filterValuesList.getItems().length, 1, "One item found from search");
		assert.strictEqual(filterValuesList.getItems()[0].getTitle(), "Searchable Key", "Correct Filter Value found");
		searchField.fireLiveChange({
			newValue : ""
		});
		assert.strictEqual(filterValuesList.getItems().length, initialLength, "All items are available again");
	});
	QUnit.test("Navigate to filter values for first step", function(assert){
		var stepPage = this.navContainer.getCurrentPage();
		var stepList = stepPage.getContent()[0];
		var firstItem = stepList.getItems()[0];
		firstItem.firePress();
		var currentPage = this.navContainer.getCurrentPage();
		assert.ok(currentPage.getId().indexOf("filterValuesPage") > 0, "Navigated to filterValuesPage");
		assert.strictEqual(currentPage.getTitle(), "StepTitle1", "Correct Title for filter Values page");
		var filterValuesList = currentPage.getContent()[0];
		assert.strictEqual(filterValuesList.getItems().length, 2, "2 filter values displayed");
		assert.strictEqual(filterValuesList.getItems()[0].getTitle(), "Step-1-Value1", "Correct first item title");
		assert.strictEqual(filterValuesList.getItems()[1].getTitle(), "Step-1-Value2", "Correct second item title");
	});
	QUnit.test("Navigate to filter values for second step", function(assert){
		var stepPage = this.navContainer.getCurrentPage();
		var stepList = stepPage.getContent()[0];
		var secondItem = stepList.getItems()[1];
		secondItem.firePress();
		var currentPage = this.navContainer.getCurrentPage();
		assert.ok(currentPage.getId().indexOf("filterValuesPage") > 0, "Navigated to filterValuesPage");
		assert.strictEqual(currentPage.getTitle(), "StepTitle2", "Correct Title for filter Values page");
		var filterValuesList = currentPage.getContent()[0];
		assert.strictEqual(filterValuesList.getItems().length, 2, "2 filter values displayed");
		assert.strictEqual(filterValuesList.getItems()[0].getTitle(), "Step-2-Value1", "Correct first item title");
		assert.strictEqual(filterValuesList.getItems()[1].getTitle(), "Step-2-Value2", "Correct second item title");
	});
	QUnit.test("Back navigation on filter values page", function (assert){
		var done = assert.async();
		var counter = 1;
		var stepPage = this.navContainer.getCurrentPage();
		var navigateButton = this.filterDialog.getBeginButton();
		this.navContainer.attachAfterNavigate(function(){
			if (counter === 1){
				assert.ok(this.navContainer.getCurrentPage().sId.indexOf("filterValuesPage") > -1, "Navigated to fitler values page");
				assert.strictEqual(navigateButton.getVisible(), true, "Navigate button is visible on filter Values page");
				var filterValuesPage = this.navContainer.getCurrentPage();
				assert.ok(filterValuesPage.getShowNavButton(), "NavButton is shown");
				filterValuesPage.fireNavButtonPress();
			} else if(counter === 2){
				assert.strictEqual(this.navContainer.getCurrentPage().sId, stepPage.sId, "Navigated back to step page");
				assert.strictEqual(navigateButton.getVisible(), false, "Navigate button is invisible on step page");
				done();
			} else {
				assert.ok(false, "A third navigation shouldn't happen");
			}
			counter++;
		}.bind(this));
		var stepList = stepPage.getContent()[0];
		var firstItem = stepList.getItems()[0];
		firstItem.firePress();
	});
	QUnit.test("Close Dialog with close buttondialog", function(assert) {
		var closeButton = this.filterDialog.getEndButton();
		attachAssertsOnClose(assert, this);
		closeButton.firePress();
	});
	QUnit.test("Close Dialog with escape button", function(assert) {
		attachAssertsOnClose(assert, this);
		this.filterDialog.close();
	});
	QUnit.test("Navigate button on 2nd step", function(assert){
		attachAssertsOnClose(assert, this);
		//arrange
		var stepPage = this.navContainer.getCurrentPage();
		var stepList = stepPage.getContent()[0];
		var secondItem = stepList.getItems()[1];
		secondItem.firePress();
		var currentPage = this.navContainer.getCurrentPage();
		assert.ok(currentPage.getId().indexOf("filterValuesPage") > 0, "Navigated to filterValuesPage");
		//act
		var navigateButton = this.filterDialog.getBeginButton();
		navigateButton.firePress();
		assert.strictEqual(this.navigationIndex, 1, "Correct index handed over to navigateToStep function");
	});
	QUnit.test("Navigate button on 3rd step", function(assert){
		attachAssertsOnClose(assert, this);
		//arrange
		var stepPage = this.navContainer.getCurrentPage();
		var stepList = stepPage.getContent()[0];
		var thirdItem = stepList.getItems()[2];
		thirdItem.firePress();
		var currentPage = this.navContainer.getCurrentPage();
		assert.ok(currentPage.getId().indexOf("filterValuesPage") > 0, "Navigated to filterValuesPage");
		//act
		var navigateButton = this.filterDialog.getBeginButton();
		navigateButton.firePress();
		assert.strictEqual(this.navigationIndex, 2, "Correct index handed over to navigateToStep function");
	});
	QUnit.module("Warning and Information Icon",{
		beforeEach: function(){
			var modelData = [{
				text: "StepWithoutIcons",
				warningIcon: false,
				infoIcon: false
			}, {
				text: "StepWithWarning",
				warningIcon: true,
				warningText: "warningText",
				infoIcon: false
			}, {
				text: "StepWithInfo",
				warningIcon: false,
				infoIcon: true,
				infoText: "infoText"
			}, {
				text: "StepWithBothIcons",
				warningIcon: true,
				warningText: "warningText",
				infoIcon: true,
				infoText: "infoText"
			}];
			commonSetup(this, modelData);
		},
		afterEach: function(){
			this.filterDialog.destroy();
			this.filterDialogView.destroy();
		}
	});
	QUnit.test("Step without icons", function(assert) {
		var currentPage = this.navContainer.getCurrentPage();
		var list = currentPage.getContent()[0];
		var item = list.getItems()[0];
		assert.strictEqual(getWarningIcon(item).getVisible(), false, "Warning Icon not visible");
		assert.strictEqual(getInfoIcon(item).getVisible(), false, "Info Icon not visible");
	});
	QUnit.test("Step with warning icon", function(assert) {
		var currentPage = this.navContainer.getCurrentPage();
		var list = currentPage.getContent()[0];
		var item = list.getItems()[1];
		assert.strictEqual(getWarningIcon(item).getVisible(), true, "Warning Icon visible");
		assert.strictEqual(getWarningIcon(item).getTooltip(), "warningText", "Warning Icon has correct tooltip");
		assert.strictEqual(getInfoIcon(item).getVisible(), false, "Info Icon not visible");
	});
	QUnit.test("Step with info icon", function(assert) {
		var currentPage = this.navContainer.getCurrentPage();
		var list = currentPage.getContent()[0];
		var item = list.getItems()[2];
		assert.strictEqual(getWarningIcon(item).getVisible(), false, "Warning Icon not visible");
		assert.strictEqual(getInfoIcon(item).getVisible(), true, "Info Icon visible");
		assert.strictEqual(getInfoIcon(item).getTooltip(), "infoText", "Info Icon has correct tooltip");
	});
	QUnit.test("Step with both icons", function(assert) {
		var currentPage = this.navContainer.getCurrentPage();
		var list = currentPage.getContent()[0];
		var item = list.getItems()[3];
		assert.strictEqual(getWarningIcon(item).getVisible(), true, "Warning Icon visible");
		assert.strictEqual(getWarningIcon(item).getTooltip(), "warningText", "Warning Icon has correct tooltip");
		assert.strictEqual(getInfoIcon(item).getVisible(), true, "Info Icon visible");
		assert.strictEqual(getInfoIcon(item).getTooltip(), "infoText", "Info Icon has correct tooltip");
	});
})();