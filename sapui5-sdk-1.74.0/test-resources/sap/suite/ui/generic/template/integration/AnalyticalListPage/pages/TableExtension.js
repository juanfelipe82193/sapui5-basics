/*global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/suite/ui/generic/template/integration/AnalyticalListPage/pages/Common",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/matchers/PropertyStrictEquals"
], function(Opa5, Common, AggregationLengthEquals, AggregationFilled, Properties, PropertyStrictEquals) {

	"use strict";

	Opa5.createPageObjects({
		onTheTable: {
			baseClass: Common,
			actions: {
				iSelectSettingInP13nDialog: function(sSetting) {
					var bSuccess = false;
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: sSetting
						}),
						success: function(aButton) {
							if (aButton[0]) {
								bSuccess = true;
								aButton[0].firePress();
							}
							QUnit.ok(bSuccess, sSetting + " has been seleced in p13n dialog");
						},
						errorMessage: sSetting + " has NOT been seleced in p13n dialog"
					});
				},
				iClickComboBox: function() {
					var bSuccess = false;
					return this.waitFor({
						controlType: "sap.m.ComboBox",
						searchOpenDialogs: true,
						success: function(aInput) {
							if (aInput[0]) {
								aInput[0].open();
								bSuccess = true;
							}
							QUnit.ok(bSuccess, "Dropdown to select property is open");
						},
						errorMessage: "Dropdown to select property is open"
					});
				},
				iSelectProperty: function(sProperty) {
					var bSuccess = false, oItem, aList;
					return this.waitFor({
						controlType: "sap.m.Popover",
						searchOpenDialogs: true,
						check: function(aPopover) {
							if (aPopover[0]) {
								aList = aPopover[0].getContent()[0];
								var aItems = aList.getItems();
								for (var i in aItems) {
									if (aItems[i].getTitle() === sProperty) {
										oItem = aItems[i];
										oItem.setSelected(true);
										bSuccess = true;
										break;
									}
								}
							}
							return bSuccess;
						},
						success: function() {
							if (oItem) {
								aList.fireSelectionChange({
									listItem : oItem,
									listItems : [oItem],
									selected : true,
									selectAll : false
								});
							}
							QUnit.ok(bSuccess, "Propery selected");
						},
						errorMessage: "Propery not selected"
					});
				},
				iAddColumnFromP13nDialog: function(sText) {
					var bSuccess = false, oCheckBox;
					return this.waitFor({
						controlType:"sap.m.CheckBox",
						searchOpenDialogs: true,
						check: function(aCheckBox) {
							//i starts from 1 since first checkbox is different
							for(var i=1; i<aCheckBox.length; i++) {
								if(aCheckBox[i].getParent().getCells()[0].getText()===sText) {
									aCheckBox[i].setSelected(!aCheckBox[i].getSelected());
									oCheckBox = aCheckBox[i];
									bSuccess = true;
								}
							}
							return bSuccess;
						},
						success: function() {
							oCheckBox.fireSelect({selected : oCheckBox.getSelected()});
							QUnit.ok(true, "Selected "+sText+" in table p13n dialog");
						},
						errorMessage: "Failed to select column in p13n dialog"
					});
				},
				iSelectARow: function() {
					return this.waitFor({
						controlType: "sap.ui.table.AnalyticalTable",
						success: function(aTable) {
							var table = aTable[0];
							var oSelectionPlugin = table.getPlugins().filter(function(oPlugin) {
									return oPlugin.isA("sap.ui.table.plugins.SelectionPlugin");
								})[0];
							(oSelectionPlugin || table).setSelectionInterval(0, 0);
							QUnit.ok(true, "Row selected");
						},
						errorMessage: "Row not selected"
					});
				},
				iClickOnLineItemWithSmartLink: function(fieldName) {
					var bSuccess = false, oLinkItem;
					return this.waitFor({
						controlType: "sap.m.Link",
						check: function(aLink) {
							aLink.forEach( function(oLink) {
								if (oLink.getText() === fieldName) {
									bSuccess = true;
									oLinkItem = oLink;
								}
							});
							return bSuccess;
						},
						success: function() {
							oLinkItem.firePress();
							QUnit.ok(bSuccess, "Line Item with smart link pressed");
						},
						errorMessage: "Smart Link not present for the line item"
					});
				},
				iClearSelection: function() {
					return this.waitFor({
						controlType: "sap.ui.table.AnalyticalTable",
						success: function(aTable) {
							var oSelectionPlugin = aTable[0].getPlugins().filter(function(oPlugin) {
									return oPlugin.isA("sap.ui.table.plugins.SelectionPlugin");
								})[0];
							(oSelectionPlugin || aTable[0]).clearSelection();
							QUnit.ok(true, "Row deselected");
						},
						errorMessage: "Row not deselected"
					});
				},
				iClickOnColumnHeader : function (sColumn) {
					var oColumnSelectable;
					return this.waitFor({
						controlType: "sap.ui.table.Column",
						check : function (aColumns) {
							for (var i = 0; i < aColumns.length; i++) {
								if (aColumns[i].sId.indexOf(sColumn) !== -1) {
									oColumnSelectable = aColumns[i];
									return true;
								}
							}
							return false;
						},
						success: function () {
							//TODO : explore if any public method is available
							oColumnSelectable._openMenu();
						},
						errorMessage: "The column "+ sColumn +"is not available"
					});
				},
				// generic function to select menu items of the column header
				iSelectColumnMenuItem : function (sColumn, sItemText) {
					var oMenuItem;
					return this.waitFor({
						controlType: "sap.ui.table.Column",
						check : function (aColumns) {
							for (var i = 0; i < aColumns.length; i++) {
								// match column and check if open then identify the menu item for selection
								if (aColumns[i].sId.indexOf(sColumn) !== -1 && aColumns[i].getMenu().bOpen) {
									var aMenuItems = aColumns[i].getMenu().getItems();
									for (var j = 0; j < aMenuItems.length; j++) {
										if (aMenuItems[j].getText() === sItemText) {
											oMenuItem = aMenuItems[j];
											return true;
										}
									}
								}
							}
							return false;
						},
						success: function () {
							oMenuItem.fireSelect();
						},
						errorMessage: "The column "+ sColumn +"is not available"
					});
				},
				iEnterFilterValue: function(sInput) {
					return this.waitFor({
						controlType: "sap.m.Input",
						success: function (oInput) {
							for (var i=0; i < oInput.length; i++) {
						        oInput[i].setValue(sInput);
								QUnit.ok(true, "Table Column Header clicked")
								break;
							}
						},
						errorMessage: "Table Column Header is not clicked"
					});
				},
				iSeeColumnWithIBN: function(columnName) {
					return this.waitFor({
						controlType: "sap.m.Table",
						check: function(aTable) {
							var aColumns = aTable[0].getColumns();
							for (var i = 0; i < aColumns.length; i++) {
								if (aColumns[i].getHeader().getText() === columnName) {
									return true;
								}
							}
							return false;
						},
						success: function () {
							QUnit.ok(true, "Table column With IBN is present")
						},
						errorMessage: "Table column With IBN is not present"
					});
				},
				iClickTheDataFieldButton: function(buttonName) {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: buttonName
						}),
						success: function(aButton) {
							aButton[0].firePress();
							QUnit.ok(true, "IBN executed");
						}
					});
				},
				iSelectRowInTable: function() {
					return this.waitFor({
						controlType: "sap.m.CheckBox",
						success: function(aCheckBox) {
							aCheckBox[1].fireSelect({
								selected: true
							});
							QUnit.ok(true, "Row selected");
						}
					});
				}
			},
			assertions: {
				iSeeColumnWithName: function(columnName) {
					return this.waitFor({
						id: "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--table-"+columnName,
						success: function () {
							QUnit.ok(true, "Table column "+columnName+" is present")
						},
						errorMessage: "Table column "+columnName+" is not present"
					});
				},
				iSeeMultipleActionsInAColumn: function() {
					return this.waitFor({
						controlType: "sap.m.Table",
						check: function(aTable) {
							var iColWithActions;
							aTable[0].getColumns().forEach(function(oCol, i) {
								if (oCol.getId().indexOf("ActionGroupTest") > -1) {
									iColWithActions = i;
								}
							});
							if (iColWithActions) {
								var oCell = aTable[0].getItems()[0].getCells()[iColWithActions];
								var oCellItems = oCell.getItems();
								var bMultipleActions = oCellItems[0].getMetadata()._sClassName === "sap.m.Button" && oCellItems[1].getMetadata()._sClassName === "sap.m.Button"
								return bMultipleActions;
							}
							return false;
						},
						success: function () {
							QUnit.ok(true, "Table column with multiple actions is present")
						},
						errorMessage: "Table column multiple actions is not present"
					});
				},
				checkControlTypeInColumn: function(sControlType) {
					return this.waitFor({
						controlType: "sap.m.Table",
						check: function(aTable) {
							var sColumnIdString = sControlType === "sap.f.Avatar" ? "ProductPictureURL" : "GrossSalesRevenueBulletChart"
							var iColWithActions;
							aTable[0].getColumns().forEach(function(oCol, i) {
								if (oCol.getId().indexOf(sColumnIdString) > -1) {
									iColWithActions = i;
								}
							});
							if (iColWithActions !== undefined && iColWithActions >= 0) {
								var oCell = aTable[0].getItems()[0].getCells()[iColWithActions];
								var bIsControlPresent;
								if (sControlType.indexOf("SmartMicroChart") > -1) {
									bIsControlPresent = oCell.getItems()[0].getMetadata()._sClassName === sControlType;
								}
								else {
									bIsControlPresent = oCell.getMetadata()._sClassName === sControlType;
								}								
								return bIsControlPresent;
							}
							return false;
						},
						success: function () {
							QUnit.ok(true, "Table column with "+sControlType+" is present")
						},
						errorMessage: "Table column "+sControlType+" is not present"
					});
				},

				checkIndicatorControlsInACol: function(sColumnIdString) {
					//sap.m.RatingIndicator, sap.m.ProgressIndicator
					return this.waitFor({
						controlType: "sap.ui.table.AnalyticalTable",
						check: function(aTable) {							
							var iColWithControls;
							aTable[0].getColumns().forEach(function(oCol, i) {
								if (oCol.getId().indexOf(sColumnIdString) > -1) {
									iColWithControls = i;
								}
							});
							if (iColWithControls !== undefined && iColWithControls >= 0) {
								var oCell = aTable[0].getRows()[0].getCells()[iColWithControls];
								var bIsControlPresent = oCell.getItems()[0].getMetadata()._sClassName === "sap.m.RatingIndicator" && oCell.getItems()[1].getMetadata()._sClassName === "sap.m.ProgressIndicator";															
								return bIsControlPresent;
							}
							return false;
						},
						success: function () {
							QUnit.ok(true, "Table column with Rating and Progress indicaors are present")
						},
						errorMessage: "Table column with Rating and Progress indicators are not present"
					});
				},

				checkAbsenceOfActionButton: function(sName, sView, bEnabled) {
					return this.waitFor({
						controlType: "sap.m.Button",
						visible: !!bEnabled,
						check: function(aButton) {
							for (var i in aButton) {
								var oButton = aButton[i];
								if (oButton.getText() === sName && oButton.getParent().getId().search(sView) > -1) {
									return false;
								}
							}
							return true;
						},
						success: function() {
							QUnit.ok(true, "The button is not present in the view " + sView);
						},
						errorMessage: "The button is present in the view " + sView
					});
				},
				checkActionButton: function(sName, bIsRequired) {
					return this.waitFor({
						controlType: "sap.m.Button",
						visible: (bIsRequired === undefined) ? true : bIsRequired,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: sName
						}),
						success: function(oButton1) {
							//the
							if (oButton1.length === 1 && oButton1[0].getParent().getId().search("TableToolbar") > -1) {
								QUnit.ok(true, "The page has a " + sName + " button.");
							} else {
								QUnit.notOk(true, "The app has multiple action buttons of name " + sName + " or is not present in the table toolbar");
							}
						},
						errorMessage: "The page has no " + sName + " button."
					});
				},
				/**
				* This function to check whether component apears on screen or not
				* @param {string} label text for the function
				* @param {string} type component type
				* @param {string} props Properties by which you want to identify the component
				* @param {string} sNameSpace Namespace of your application
				* @param {string} sComponent Component id that is holding your component
				* @param {string} sEntitySet name of the entityset
				*/

				iShouldSeeTheComponent: function(label, type, props, settings,sNameSpace,sComponent,sEntitySet) {
					var checkId;
					var checkStyleClass;
					var sAbsId = sNameSpace + "::" + sComponent + "::" + sEntitySet + "--"
					var waitForConfig = {
						controlType: type,
						check: function(comps) {
							for (var i = 0; i < comps.length; i++) {
								var comp = comps[i];
								if (checkId && comp.getId) {
									if (comp.getId() == checkId || comp.getId() == sAbsId + checkId) { // some IDs are namespaced
										return true;
									}

									continue;
								}

								if (checkStyleClass && comp.hasStyleClass) {
									for (var j = 0; j < checkStyleClass.length; j++) {
										if (comp.hasStyleClass(checkStyleClass)) {
											return true;
										}
									}

									continue;
								}

								if (comp.getVisible && comp.getVisible()) {
									return true;
								}
							}

							return false;
						},
						// timeout: 22,
						timeout: 70,
						success: function() {
							QUnit.ok(true, "The table has the " + label + ".");
						},
						errorMessage: "Can't see the " + label + "."
					};

					if(props) {
						waitForConfig.matchers = [];
						for (var name in props) {
							if ( name == 'id') {
								checkId = props[name];
								continue;
							}

							if (name == 'styleClass') {
								checkStyleClass = props[name];
								continue;
							}

							waitForConfig.matchers.push(
								new PropertyStrictEquals({
									name: name,
									value: props[name]
								})
							);
						}
					}

					if (settings) {
						for (var name in settings) {
							waitForConfig[name] = settings[name];
						}
					}

					return this.waitFor(waitForConfig);
				},
				//Checks for different table type present in the ALP application.
				checkTableType : function(label, control) {
					return this.waitFor({
						controlType: control,
						success: function(ctrls) {
							QUnit.ok(true, "Its a "+label);
						},
						errorMessage: "The page doesn't have " + label + "control."
					});
				},
				checkQuickViewCard: function(aCardText) {
					var bSuccess = false;
					return this.waitFor({
						controlType: "sap.ui.layout.form.Form",
						searchOpenDialogs: true,
						check: function(aForm) {
							if (aForm[0]) {
								var matchedCardContentCount = 0;
								var aQuickViewCardContents = aForm[0].getFormContainers()[0].getFormElements();
								aQuickViewCardContents.forEach(function(oCardContent) {
									for (var i = 0; i < aCardText.length; i++) {
										if (oCardContent.getLabel().getText() === aCardText[i]) {
											matchedCardContentCount++;
										}
									}
								});
								if (aCardText.length === matchedCardContentCount) {
									bSuccess = true;
								}
							}
							return bSuccess;
						},
						success: function() {
							QUnit.ok(bSuccess,"Quick View Card displays field set via annotations");
						},
						errorMessage: "Quick View Card does not display correct fields"
					});
				},
				iClickDataFieldWithIBN: function(linkName) {
					var bSuccess = false,
					oIBNLink;
					return this.waitFor({
						controlType: "sap.m.Link",
						check: function(aLink) {
							aLink.forEach(function (oLink) {
								if (oLink.getText() === linkName) {
									oIBNLink = oLink;
									bSuccess = true;
								}
							});
							return bSuccess;
						},
						success: function() {
							oIBNLink.firePress();
							QUnit.ok(bSuccess, "Line Item with smart link pressed");
						},
						errorMessage: "Smart Link not present for the line item"
					});
				},
				iCheckIfColumnTemplateIsRenderedAsLink: function(sPropertyName) {
					return this.waitFor({
						controlType: "sap.ui.table.AnalyticalTable",
						autoWait:true,
						timeout: 30,
						check: function(aTable) {
							var aColumns = aTable[0].getColumns();
							var oPropertyColumn;
							for (var i = 0; i < aColumns.length; i++) {
								if (aColumns[i].getLeadingProperty() === sPropertyName) {
									oPropertyColumn = aColumns[i];
									break;
								}
							}
							var bPropertyRenderedAsLink = oPropertyColumn.getTemplate().isA("sap.ui.comp.navpopover.SmartLink");
							return bPropertyRenderedAsLink;
						},
						success: function() {
							QUnit.ok(true, "Column property is rendered as Smart Link");
						},
						errorMessage: "Column property is not rendered as Smart Link"
					});
				},
				iCheckGroupHeaderOnTable: function(sGroupHeaderName) {
					return this.waitFor({
						controlType: "sap.ui.table.AnalyticalTable",
						autoWait:true,
						timeout: 30,
						success: function(aTable) {
							var oGroups = aTable[0].getGroupedColumns();
							if (sGroupHeaderName) {
								if (oGroups && oGroups.filter(function(oGroup) { return oGroup.indexOf(sGroupHeaderName) > -1; }).length) {	
									QUnit.ok(true, "Group header found");
								} else {
									QUnit.ok(false, "Group header NOT found");
								}
							} else if (oGroups && !oGroups.length) {
								QUnit.ok(true, "Group header not found");
							}
						},
						errorMessage: "Group header not found"
					});
				}
			}
		}
	});
});
