/*** List Report Assertions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals", "sap/ui/test/matchers/AggregationFilled",
	 "sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaResourceBundle", "sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaModel", "sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest", "sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaDataStore"],

	function (PropertyStrictEquals, AggregationFilled, OpaResourceBundle, OpaModel, OpaManifest, OpaDataStore) {

	return function (prefix, viewName, viewNamespace, entityType, entitySet) {

		function matchInSubTree(oControl, fnMatch) {
			if (fnMatch(oControl)) { return true; }
			var oAggregations = oControl.getMetadata().getAllAggregations();
			for ( var sAggregation in oAggregations) {
				if (oAggregations[sAggregation].multiple && oControl.getAggregation(sAggregation)
						&& oControl.getAggregation(sAggregation).some(function(oItem) {
							return matchInSubTree(oItem, fnMatch);
						})) { return true; }
			};
			return false;
		}

		return {
			/************************************************
			 RENDERING ASSERTIONS
			*************************************************/
			thePageShouldBeOpened: function() {
				var sId = prefix + "listReport";
				return this.waitFor({
					id: sId,
					autoWait: true,
					success: function() {
						ok(true, "The List Report has been reached, using control id: " + sId);
					},
					errorMessage: "The List Report has NOT been reached, using control id: " + sId
				});
			},
			// check if the filter bar is rendered correctly:
			// i. find the filter bar & match against the property "enableBasicSearch" and aggregation "controlConfiguration"
			// ii. for each controlConfiguration get the key and check against the term "com.sap.vocabularies.UI.v1.SelectionFields" for the entity type
			theFilterBarIsRenderedCorrectly: function() {
				return this.waitFor({
					id: prefix + "listReportFilter",
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: [
						new PropertyStrictEquals({
							name: "enableBasicSearch",
							value: !(entitySet["sap:searchable"] === 'false')
						}),
						new AggregationFilled({
							name: "controlConfiguration"
						})
					],
					success: function(oControl) {
						ok(true, "The Smart Filter Bar has basic search enabled");

						// check the control configurations
						var oSmartFilterBar = oControl;
						var aSelectionField = entityType["com.sap.vocabularies.UI.v1.SelectionFields"];
						var iExpectedControlConfigurations = aSelectionField.length + 2; // EditState and CustomPriceFilter selection fields.
						var aConfiguration = oSmartFilterBar.getAggregation("controlConfiguration").filter(function(oConfiguration) {
							var sKey = oConfiguration.getProperty("key");
							// check the selection fields
							for (var i = 0; i < aSelectionField.length; i++) {
								if (sKey === aSelectionField[i].PropertyPath.replace('/', '.')) {
									return true;
								}
							}
							return (sKey === "EditState" || sKey === "CustomPriceFilter" /*breakout*/);
						});

						equal(aConfiguration.length, iExpectedControlConfigurations, "The Smart Filter Bar has " + iExpectedControlConfigurations + " control configurations");

						// ToDo: deepEqual does show different content - WHY ???
						//deepEqual(aConfiguration, oSmartFilterBar.getAggregation("controlConfiguration"), "The Smart Filter Bar has the correct control configurations");
					},
					errorMessage: "The Smart Filter Bar is not rendered correctly"
				});
			},

			// check if "Editing Status" filter is correct when draft is enabled:
			// i. find the "Editing Status" filter and check that each value in the dropdown against the i18n
			theFilterSelectionFieldWhenDraftIsEnabledIsRenderedCorrectly: function() {
				return this.waitFor({
					id: prefix + "editStateFilter",
					success: function(oControl) {
						var aItems = oControl.getAggregation("items");
						equal(aItems.length, 5, "When draft is enabled, the combobox for the 'Editing Status' filter selection field has the correct number of items");
						equal(aItems[0].getText(), "All","1st item in the Editing Status Combobox is correct"); //OpaResourceBundle.template.ListReport.getProperty("ALL_OBJECTS")
						equal(aItems[1].getText(), "Own Draft","2nd item in the Editing Status Combobox is correct"); //OpaResourceBundle.template.ListReport.getProperty("DRAFT_OBJECT_FILTER")
						equal(aItems[2].getText(), "Locked by Another User","3rd item in the Editing Status Combobox is correct"); //OpaResourceBundle.template.ListReport.getProperty("LOCKED_OBJECT_FILTER")
						equal(aItems[3].getText(), "Unsaved Changes by Another User","4th item in the Editing Status Combobox is correct"); //OpaResourceBundle.template.ListReport.getProperty("UNSAVED_CHANGES_FILTER")
						equal(aItems[4].getText(), "Unchanged","5th item in the Editing Status Combobox is correct"); //OpaResourceBundle.template.ListReport.getProperty("UNCHANGED")
					},
					errorMessage: "When draft is enabled, the combobox for the 'Editing Status' filter selection field is not rendered correctly"
				});
			},

			// check if "Price" filter is correct:
			// i. find the "Price" filter and check that each value in the dropdown against the i18n
			theFilterSelectionFieldWhenForABreakoutIsRenderedCorrectly: function() {
				return this.waitFor({
					id: prefix + "CustomPriceFilter-combobox",
					success: function(oControl) {

						var aItems = oControl.getAggregation("items");
						equal(aItems.length, 4, "The combobox for the 'Price' breakout filter selection field has the correct number of items");
						equal(aItems[0].getText(), OpaResourceBundle.demokit.stta_manage_products.ListReport.getProperty("xtit.Price_0-100"),"1st item in the Price Combobox is correct");
						equal(aItems[1].getText(), OpaResourceBundle.demokit.stta_manage_products.ListReport.getProperty("xtit.Price_100-500"),"2nd item in the Price Combobox is correct");
						equal(aItems[2].getText(), OpaResourceBundle.demokit.stta_manage_products.ListReport.getProperty("xtit.Price_500-1000"),"3rd item in the Price Combobox is correct");
						equal(aItems[3].getText(), OpaResourceBundle.demokit.stta_manage_products.ListReport.getProperty("xtit.Price_GE1000"),"4th item in the Price Combobox is correct");
					},
					errorMessage: "The combobox for the 'Price' filter breakout selection field is not rendered correctly"
				});
			},

			// check if the Smart Table is rendered correctly:
			// i. find the Smart Table by its id
			// ii. check each column name against the annotations
			theSmartTableIsRenderedCorrectly: function() {
				return this.waitFor({
					id: prefix + "listReport",
					viewName: viewName,
					viewNamespace: viewNamespace,
					success: function(oControl) {
						var oTable = oControl.getTable();
						var aColumn = oTable.getColumns();
						var iColumnCount = 0;

						// columns from annotations
						var aAnnotationColumn = entityType["com.sap.vocabularies.UI.v1.LineItem"].filter(function(oRecord){
							return (oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataField" ||
							oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" ||
							oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation" ||
							((oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" || oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") && oRecord.Inline));
						});

						for(var i = 0; i < aAnnotationColumn.length; i++) {
							if ( ((aAnnotationColumn[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction") || (aAnnotationColumn[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation")) && (aAnnotationColumn[i].Inline.Bool === "false") ){
								iColumnCount++;
								continue;
							}

							var sExpectedLabel = "";
							if (aAnnotationColumn[i].RecordType === "com.sap.vocabularies.UI.v1.DataField" &&
								!(aAnnotationColumn[i].Label && aAnnotationColumn[i].Label.String)) { //if a label is directly specified it has to be used
								sExpectedLabel = OpaModel.getEntityProperty(entityType, aAnnotationColumn[i].Value.Path)["com.sap.vocabularies.Common.v1.Label"].String;
							} else {
								sExpectedLabel = aAnnotationColumn[i].Label.String;
								if (sExpectedLabel.search("@i18n") > -1) {
									sExpectedLabel = sExpectedLabel.substring(7,sExpectedLabel.length-1);
									sExpectedLabel = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty(sExpectedLabel)
								}
							}

							var sActualLabel = aColumn[i-iColumnCount].getHeader().getText();
							equal(sActualLabel, sExpectedLabel, "The label " + sActualLabel + " is correctly displayed");
						}

						// columns from breakouts
						var sExpectedBreakoutColumnLabel = OpaResourceBundle.demokit.stta_manage_products.ListReport.getProperty("xfld.BreakoutColumn");
						equal(aColumn[aColumn.length-1].getHeader().getText(), sExpectedBreakoutColumnLabel, "The breakout column is correctly displayed");

					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			},

			// check if the Smart Table contains the micro charts:
			// i. find the Smart Table by its id
			// ii. check each column against the annotations
			theSmartTableContainsMicroCharts: function() {
				// if test is running on FF then multiple Smart Micro Charts are not rendered correctly. Only one of each type (e.g. Area, Bullet) of Smart Micro Chart is rendered and the rest cause an error.
				// needs further investigation
				if (sap.ui.Device.browser.firefox) {
					ok(true, "Firefox detected - TEST 'All Columns annotated for micro charts render micro charts' SKIPPED. Reason: issue with rendering mutliple Smart Micro Charts in FF.");
					return this;
				}
				return this.waitFor({
					id: prefix + "responsiveTable",
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: [
								new AggregationFilled({
									name: "items"
								})
							],
					success: function(oControl) {
						var aItems = oControl.getItems();

						// columns from annotations
						var aAnnotationColumns = entityType["com.sap.vocabularies.UI.v1.LineItem"].filter(function(oRecord){
							return (oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataField" ||
							oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" ||
							((oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" || oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") && oRecord.Inline));
						});

						var iAnnotatedChartColumns = 0;
						var iRenderedChartColumns = 0;
						var aFirstRowCells =  aItems[0].getCells();
						var oCellItem;
						var sAnnotationPath;

						for(var i = 0; i < aAnnotationColumns.length; i++) {
							if (aAnnotationColumns[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
								sAnnotationPath =  aAnnotationColumns[i].Target.AnnotationPath;
								if (sAnnotationPath.indexOf('com.sap.vocabularies.UI.v1.Chart') >= 0){
									iAnnotatedChartColumns++;
									oCellItem = aFirstRowCells[i+1].getItems()[0];  //aFirstRowCells index changed to "i+1" because after semantically connected fields example, the position of Chart in aFirstRowCells and aAnnotationColumns is different
									if(oCellItem.getChartType()){
										iRenderedChartColumns++;
									}
								}
							}
						}

						equal(iAnnotatedChartColumns, iRenderedChartColumns, "All Columns annotated for micro charts render micro charts");

					},
					errorMessage: "Not all Columns that are annotated for micro charts render micro charts"
				});
			},


			theSmartTableContainsRatingIndicator: function() {
				return this.waitFor({
					id: prefix + "responsiveTable",
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: [
								new AggregationFilled({
									name: "items"
								})
							],
					success: function(oControl) {
						assert.ok(matchInSubTree(oControl, function(oControl) {
							return oControl.getMetadata().getName() === "sap.m.RatingIndicator";
						}), "Rating Indicator found");
//						assert.equal("sap.m.RatingIndicator",oControl.getItems()[0].getCells()[8].getItems()[0].getMetadata().getElementName(),"The Rating Indicator is rendered correctly")

					},
					errorMessage: "Rating Indicator is not rendered correctly."
				});
			},

			theSmartTableContainsProgressIndicator: function() {
				return this.waitFor({
					id: prefix + "responsiveTable",
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: [
								new AggregationFilled({
									name: "items"
								})
							],
					success: function(oControl) {
						assert.ok(matchInSubTree(oControl, function(oControl) {
							return oControl.getMetadata().getName() === "sap.m.ProgressIndicator";
						}), "Progress Indicator found");
//						assert.equal("sap.m.ProgressIndicator",oControl.getItems()[0].getCells()[9].getItems()[0].getMetadata().getElementName(),"The Progress Indicator is rendered correctly")
					},
					errorMessage: "Progress Indicator is not rendered correctly."
				});
			},

			// check if the Object Marker in the Smart Table contains user information for locked objects or objects with unsaved changes:
			// i. find the Smart Table by its id
			// ii. check for draft and locked or unsaved changes
			// iii. if it contains entries check object marker for user info
			theObjectMarkerContainsUserInfo: function() {
				return this.waitFor({
					id: prefix + "responsiveTable",
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: [
								new AggregationFilled({
									name: "items"
								})
							],
					success: function(oControl) {
						var aItems = oControl.getItems();
						var oDraft, oLockedOrUnsaved, sErrorMessage = "", sDraftAdditional;

						for (var i = 0; i < aItems.length; i++){
							//don't check image column or others but only ProductForEdit
							if (!aItems[i] &&
								!aItems[i].getCells() &&
								!aItems[i].getCells()[1] &&
								!aItems[i].getCells()[1].getItems){
								continue;
							}
							var oProductForEditColumn = aItems[i].getCells()[1].getItems()[2].getType ? aItems[i].getCells()[1].getItems()[2] : aItems[i].getCells()[1].getItems()[3];
							if (oProductForEditColumn && (oProductForEditColumn.getType() === "Unsaved" || oProductForEditColumn.getType() === "Locked")){
								oLockedOrUnsaved = aItems[i];
							}
							if (oProductForEditColumn && oProductForEditColumn.getType() === "Draft"){
								oDraft = aItems[i];
							}
							if(oDraft && oLockedOrUnsaved){
								break;
							}
						}
						if(oLockedOrUnsaved){
						//Locked objects oder objects with unsaved changes should display either the full user name or the user id, this means AdditionalInfo for the ObjectMarker should be set
							sDraftAdditional = oLockedOrUnsaved.getCells()[1].getItems()[2].getAdditionalInfo ? oLockedOrUnsaved.getCells()[1].getItems()[2].getAdditionalInfo() : oLockedOrUnsaved.getCells()[1].getItems()[3].getAdditionalInfo();
							if(sDraftAdditional !== undefined && sDraftAdditional !== ""){
								ok(true, "User information is shown for locked items or items with unsaved changes.");
							} else {
								ok(false, "User information is not shown for locked items or items with unsaved changes.");
							}
						} else {
							ok(true, "No object with status locked or unsaved changes found");
						}

						if(oDraft){
							//own drafts should not display either the full user name or the user id, this means AdditionalInfo for the ObjectMarker should not be set
							sDraftAdditional = oLockedOrUnsaved.getCells()[1].getItems()[2].getAdditionalInfo ? oLockedOrUnsaved.getCells()[1].getItems()[2].getAdditionalInfo() : oLockedOrUnsaved.getCells()[1].getItems()[3].getAdditionalInfo();
							if(sDraftAdditional !== undefined && sDraftAdditional !== ""){
								ok(true, "User information is not shown for own drafts.");
							} else {
								ok(false, "User information is shown for own drafts.");
							}
						} else {

							ok(true, "No object with status draft found");
						}
					},
					errorMessage: "Draft additional information is not displayed properly."
				});
			},

			//Check and validate row highlight functionality in smart table.
			checkRowHighlight: function(){
				return this.waitFor({
					id: prefix + "responsiveTable",
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: [
								new AggregationFilled({
									name: "items"
								})
							],
					success: function(oControl) {
						var aItems = oControl.getItems();
						var sCriticality;
						for (var i = 0; i < aItems.length; i++){
							if (aItems.length != 0 && aItems[i] != undefined)
							    {
								var oRowContext = aItems[i].getBindingContext();
								var sHighlight = aItems[i].mProperties.highlight;
								var oModel = aItems[i].getModel()
								var oMetaModel = oModel.getMetaModel();
								var oControl = oControl.getParent();
								var oEntitySet = oMetaModel.getODataEntitySet(oControl.getEntitySet());
								var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
								var oCriticalityAnnotation = oEntityType["com.sap.vocabularies.UI.v1.LineItem@com.sap.vocabularies.UI.v1.Criticality"];
								var isActiveEntity  = oRowContext.getObject("IsActiveEntity");
								var hasActiveEntity = oRowContext.getObject("HasActiveEntity");
								if (isActiveEntity === false && hasActiveEntity === false){
									sCriticality = "Information";
								}
								else if(oCriticalityAnnotation && oCriticalityAnnotation.Path){
									var sCriticalityPath = oCriticalityAnnotation.Path ;
									if (oRowContext) {
										var sRowCriticalityValue = oRowContext.getObject(sCriticalityPath);
										if (sRowCriticalityValue) {
											switch (sRowCriticalityValue.toString()) {
												case "0":
												sCriticality = "None"; break;
												case "1":
												sCriticality = "Error"; break;
												case "2":
												sCriticality = "Warning"; break;
												case "3":
												sCriticality = "Success"; break;
											}
										} else {
											sCriticality = "None";
										}
									}
								}
								if(sHighlight === sCriticality){
									assert.ok(true, "Row highlight is working fine");
									break;
								}
								else{
									assert.ok(false, "Row highlight is not found");
									break;
								}
							}
							else{
								assert.ok(false, "Rows are not rendered");
								break;
							}
						}
					},
					errorMessage: "Information is not displayed properly."
				});
			},

			// check if the Object Marker in the Smart Table contains user information for locked objects or objects with unsaved changes:
			// i. find the Smart Table by its id
			// ii. Check if Default Title is shown or not.
			checkDefaultTitle: function() {
				return this.waitFor({
					id: prefix + "responsiveTable",
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: [
								new AggregationFilled({
									name: "items"
								})
							],
					success: function(oControl) {
						var aItems = oControl.getItems();
						var sdefaultTitle = "<em>&lt;Unnamed&#x20;Object&gt;</em>";
						for (var i = 0; i < aItems.length; i++){
							//don't check image column or others but only Product
							if (!aItems[i] ||
							    !aItems[i].getCells() ||
							    !aItems[i].getCells()[1] ||
						            !aItems[i].getCells()[1].getItems){
							    continue;
							  }
							else if(aItems[i].getCells()[1].getItems()[1].getHtmlText() === sdefaultTitle){
								assert.ok(true, "Default Tile is found");
								break;
							}
							else{
								assert.ok(false, "Default Tile is not found");
							}
						}
					},
					errorMessage: "Information is not displayed properly."
				});
			},

			// check if the Custom Toolbar (e.g. "Copy with new Supplier (Ext)", "Delete", etc...) in the Smart Table is rendered correctly:
			// i. find the toolbar by its control type and match against the property "design"
			// ii. get all "sap.m.Button" and match the button's text against the annotations or manifest
			// iii. get all "sap.m.OverflowToolbarButton" and check the text
			theCustomToolbarForTheSmartTableIsRenderedCorrectly: function() {
				return this.waitFor({
					controlType: "sap.m.OverflowToolbar",
					matchers: [
						new PropertyStrictEquals({
							name: "design",
							value: "Transparent"
						})
					],
					success: function(aControl) {
						ok(true, "The OverflowToolbar has its design set to 'Transparent'");

						var iButtonIndex = 0;

						var aButton = aControl[0].getContent().filter(function(oControl) {
							return oControl.getMetadata().getName() === "sap.m.Button";
						});

						var mProductBreakoutActions = OpaManifest.demokit["sample.stta.manage.products"]
							.getProperty("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/sap.suite.ui.generic.template.ListReport.view.ListReport/sap.ui.generic.app/STTA_C_MP_Product/Actions/");

						for (var sAction in mProductBreakoutActions) {
							if (!mProductBreakoutActions[sAction].determining && !mProductBreakoutActions[sAction].global) {
								equal(aButton[iButtonIndex].getText(), mProductBreakoutActions[sAction].text, "The " + mProductBreakoutActions[sAction].text + " button is rendered correctly");
								iButtonIndex++;
							}
						}

						// buttons from annotations
						var aExpectedButton = entityType["com.sap.vocabularies.UI.v1.LineItem"].filter(function(oRecord){
							return ((oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" || oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") && !oRecord.Inline && !oRecord.Determining);
						});
						for (var i = 0; i < aExpectedButton.length; i++) {
							equal(aButton[iButtonIndex + i].getText(), aExpectedButton[i].Label.String, "The " + aExpectedButton[i].Label.String + " button is rendered correctly");
						}

						// button for variant management
						var aSmartVariantManagement = aControl[0].getContent().filter(function(oControl) {
							return oControl.getMetadata().getName() === "sap.ui.comp.smartvariants.SmartVariantManagement";
						});
						ok(aSmartVariantManagement.length === 0, "The Variant is rendered correctly");

						// button for settings
						var aOverflowToolbarButton = aControl[0].getContent().filter(function(oControl) {
							return oControl.getMetadata().getName() === "sap.m.OverflowToolbarButton";
						});

						// For Fiori 3, the button is changed to sap.m.button with text 'Create'. Below test fails
						// when it runs on Fiori 3. This test has to be adapted when Fiori 3 switch is removed.
						// equal(aOverflowToolbarButton[0].getText(), "Create New Product", "The Create New Product button is rendered correctly");
					},
					errorMessage: "The Smart Table Toolbar is not rendered correctly"
				});
			},

			// check if the responsive table inside the Smart Table is rendered correctly:
			// i. find the table by matching against the properties "fixedLayout", "growing", "growingScrollToLoad", "growingThreshold",
			// ii. check the table's mode against the manifest
			theResponsiveTableInsideTheSmartTableIsRenderedCorrrectly: function() {
				var aMatchers = [
					new PropertyStrictEquals({
						name: "fixedLayout",
						value: false
					}),
					new PropertyStrictEquals({
						name: "growing",
						value: true
					}),
					new PropertyStrictEquals({
						name: "growingScrollToLoad",
						value: true
					}),
					new PropertyStrictEquals({
						name: "growingThreshold",
						value: 25
					})
				];
				var fnSuccess = function(oControl) {
					ok(true, "The Responsive Table inside the Smart Table has rendered correctly");

					var sMode = OpaManifest.demokit["sample.stta.manage.products"].getProperty("/sap.ui.generic.app/pages/0/component/settings/multiSelect") ? "MultiSelect" : "Single";
					equal(oControl.getMode(), sMode, "The Responsive Table's Mode is correct");
				};

				return this.waitForResponsiveTableInListReport(aMatchers, fnSuccess);
			},

			// check if the responsive table inside the Smart Table has items:
			// i. find the table by matching against the property "items"
			// ii. check the table has the correctly # of items
			theResponsiveTableIsFilledWithItems: function(iItems, sTabId) {
				var aMatchers = [
					new AggregationFilled({
						name: "items"
					})
				];
				var fnSuccess = function(oControl) {
					var actualItems = oControl.getItems();
					equal(actualItems.length, iItems, "All the items are present in the table");
				};

				return this.waitForResponsiveTableInListReport(aMatchers, fnSuccess, sTabId);
			},

			// check if the responsive table header (e.g. "Products (150)") has the right number of items:
			// i. find the table header using its id and match against the text
			theResponsiveTableHeaderHastheCorrectNumberOfItems: function(iNumberOfItems) {
				var sExpectedText = entityType["com.sap.vocabularies.UI.v1.HeaderInfo"].TypeNamePlural.String + " ({*})";
				sExpectedText = (iNumberOfItems) ? sExpectedText.replace("{*}", iNumberOfItems) : sExpectedText.replace("{*}", "0");

				return this.waitFor({
					id: prefix + "listReport-header",
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: [
						new PropertyStrictEquals({
							name: "text",
							value: sExpectedText
						})
					],
					success: function(oControl) {
						ok(true, "The table has the right number of items: " + iNumberOfItems);
					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			},

			// check if the responsive table has the correct items:
			// i. find the table by matching against the property "items"
			theResponsiveTableContainsTheCorrectItems: function(mSelection) {
				var aMatchers = [
					new AggregationFilled({
						name: "items"
					})
				];
				var fnSuccess = function(oControl) {
					var actualItems = oControl.getItems();

					for(var i = 0; i < actualItems.length; i++) {
						var bValid = true;
						var oContext = actualItems[i].getBindingContext();
						var oObject = oContext.getObject(oContext.sPath);

						for(var propertyName in mSelection) {
							switch (propertyName) {
								case "EditingStatus":
									// Editing Status: 0-All 1-Own Draft 2-Locked by Another User 3-Unsaved Changes by Another User 4-No Changes
									switch(mSelection[propertyName]) {
										case 0:
											break;
										case 1:
											// if (!oObject["DraftAdministrativeData"] || oObject["DraftAdministrativeData"] === null ) {
											if (!oObject["DraftAdministrativeData"]) {
												bValid = false;
											}
											break;
										default:
											break;
									}
									break;
								case "Supplier":
									if (oObject.to_Supplier.__ref.indexOf(mSelection[propertyName]) < 0) {
										bValid = false;
										ok(false, "Item [" + i + "] does not have the property '" + propertyName + "' = " + mSelection[propertyName]);
									}
									break;
								default:
									if(oObject[propertyName] != mSelection[propertyName]) {
										bValid = false;
										ok(false, "Item [" + i + "] has property '" + propertyName + "' = " + oObject[propertyName] + " instead of " + mSelection[propertyName]);
									}
									break;
							}
						}
						ok(bValid, "Item [" + i + "] meets the Filter selection criteria");
					}
				};

				return this.waitForResponsiveTableInListReport(aMatchers, fnSuccess);
			},

			// check that the page contains the correct determining actions:
			// i. find the page by the controlType
			// ii. check the determining actions buttons text against the annotations
			thePageShouldContainTheCorrectDeterminingActions: function() {
				return this.waitFor({
					controlType: "sap.f.DynamicPage",
					viewName: viewName,
					viewNamespace: viewNamespace,
					success: function (listReportPage) {
						var aButton, aIdentificationAnnotations, aActionTextsThatAppear = [], aActionTextThatShouldAppear = [];

						// get the custom actions text from the manifest
						oManifestJSONModel = OpaManifest.demokit["sample.stta.manage.products"];
						mCustomActions = oManifestJSONModel.getProperty("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/sap.suite.ui.generic.template.ListReport.view.ListReport/sap.ui.generic.app/STTA_C_MP_Product/Actions/");
						for (var customAction in mCustomActions) {
							if (mCustomActions.hasOwnProperty(customAction)) {
								if (mCustomActions[customAction].determining && !mCustomActions[customAction].global) {
									aActionTextThatShouldAppear.push(mCustomActions[customAction].text);
								}
							}
						}

						// get the action buttons' text from the object footer
						aButton = listReportPage[0].getFooter().getContent();
						for (var i = 0; i < aButton.length; i++) {
							if (aButton[i].getMetadata().getName() === "sap.m.Button") {
								aActionTextsThatAppear.push(aButton[i].getText());
							}
						}

						// get the annotated actions text from the metamodel
						aLineItemAnnotations = entityType["com.sap.vocabularies.UI.v1.LineItem"];
						for (var i = 0; i < aLineItemAnnotations.length; i++) {
							if ((aLineItemAnnotations[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" || aLineItemAnnotations[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") &&
									aLineItemAnnotations[i].Determining && aLineItemAnnotations[i].Determining.Bool === "true") {
								aActionTextThatShouldAppear.push(aLineItemAnnotations[i].Label.String);
							}
						}

						// compare the actions' text that should appear vs. the actions' text that actually appear
						for (var i = 0; i < aActionTextThatShouldAppear.length; i++) {
							for (var j =0; j < aActionTextsThatAppear.length; j++) {
								if (aActionTextsThatAppear[i] === aActionTextThatShouldAppear[i]) {
									ok(true, "Determining Action '" + aActionTextThatShouldAppear[i] + "' is rendered correctly.");
									break;
								}
								else if (j === aActionTextsThatAppear.length - 1) {
									ok(false, "Determining Action '" + aActionTextThatShouldAppear[i] + "' is not rendered correctly.");
								}
							}
						}
					},
					errorMessage: "The Determining Actions in the List Report Footer are not rendered correctly"
				});
			},

			// check the settings actions button
			theSmartTableHasASettingsButton: function() {
				var SettingsButton = null;
				return this.waitFor({
					controlType: "sap.m.Button",
					check: function(aButtons) {
						return aButtons.filter(function(oButton) {
							if (oButton.getIcon() !== "sap-icon://action-settings") {
								return false;
							}
							SettingsButton = oButton;
							return true;
						});
					},
					success: function() {
						QUnit.ok(true, "The page has a setting button.");
					},
					errorMessage: "The page has no setting button."
				});
			},

			// check the settings actions button
			theSmartTableHasASettingsButtonDialogOpen: function() {
				return this.waitFor({
					controlType: "sap.m.Title",
					matchers: new sap.ui.test.matchers.PropertyStrictEquals({
						name: "text",
						value: "View Settings"
					}),
					success: function(oTitle) {
						QUnit.ok(true, "Setting Dialog opened with a title");
					},
					errorMessage: "Setting Dialog not opened with a title."
				});
			},

			/************************************************
			 DELETE ASSERTIONS
			*************************************************/
			// check if the deleted item from the Object Page is no longer in the Smart Table on the List Report:
			// i. find the table by matching against the property "items"
			// ii. get the stored item from the OpaDataStore and check if this item is in the table
			theItemDeletedFromTheObjectPageIsNotInTheTable: function () {
				var aMatchers = [
					new AggregationFilled({
						name: "items"
					})
				];
				var fnSuccess = function (oTable) {
					var oSelectedItem = OpaDataStore.getData("selectedItem");
					(oTable.indexOfItem(oSelectedItem) === -1) ? ok(true, "Item was successfully deleted from the Object Page") :
						notOk(true, "Item was not successfully deleted from the Object Page");
					OpaDataStore.clearData();
				};
				return this.waitForResponsiveTableInListReport(aMatchers, fnSuccess);
			},

			// check if the deleted items are no longer in the Smart Table:
			// i. find the table by matching against the property "items"
			// ii. get the stored items from the OpaDataStore and check if items in the table should be deleted or not
			theItemsInTheTableAreDeletedOrNot: function (bDeleted) {
				var aMatchers = [
					new AggregationFilled({
						name: "items"
					}),
					function (oTable) {
						var aSelectedItems = OpaDataStore.getData("selectedItems");
						for (var i = 0; i < aSelectedItems.length; i++) {
							var sDraftStatus = aSelectedItems[i].draftStatus || "any";
							var iIndexOfItemInTable = oTable.indexOfItem(aSelectedItems[i].item);

							if (bDeleted) {
								if (iIndexOfItemInTable === -1) {
									return true;
								} else {
									return false;
								}

							} else {
								if (iIndexOfItemInTable !== -1) {
									return true;
								} else {
									return false;
								}
							}

						}
						OpaDataStore.clearData();
					}
				];
				var fnSuccess = function (oTable) {
					var sText = "";
					if (!bDeleted) {
						sText = "not ";
					}
					ok(true, "The item(s) in the Table have " + sText + "been successfully be deleted.");
				};
				return this.waitForResponsiveTableInListReport(aMatchers, fnSuccess);
			},

			// check the "enabled" property of the Delete button by:
			// i. finding the delete button by id
			// ii. check that the button's property "enabled" matches what is passed to the function
			theDeleteButtonShouldBeEnabled: function (bEnabled, sMessage) {
				return this.waitFor({
					id: prefix + "deleteEntry",
					autoWait: false,
					success: function (oDeleteButton) {
						ok(oDeleteButton.getEnabled() === bEnabled, sMessage);
					},
					errorMessage: "The Delete button was not found"
				});
			},

			theSearchFieldInTheLRTableToolbarVisible: function () {
				return this.waitFor({
						controlType: "sap.m.SearchField",
						viewName: viewName,
						viewNamespace: viewNamespace,
						id: prefix + "Table::Toolbar::SearchField",
						success: function() {
							//oControl.setValue(sValue);
							//oControl.fireSearch();
							ok(true, "Table has search field in toolbar");
						},
						//actions: new Press(),
						errorMessage: "Search field not found"
					});
				},

			/************************************************
			 NAVIGATION ASSERTIONS
			 *************************************************/
			// check if the smart table is in the same state as before:
			// i. find the table by matching against the property "items"
			// ii. get the stored items from the OpaDataStore and check if items in the table are the same
			theTableIsInTheSameStateAsBefore: function() {
				var aMatchers = [
					new AggregationFilled({
						name: "items"
					})
				];
				var fnSuccess = function(oControl) {
					var expectedItems = OpaDataStore.getData("tableItems");
					var actualItems = oControl.getItems();
					deepEqual(actualItems, expectedItems, "The items in the table are the same as before");
				};

				return this.waitForResponsiveTableInListReport(aMatchers, fnSuccess);
			},

			/************************************************
			 UTILITY FUNCTIONS
			*************************************************/
			// ListReport common assertion function
			waitForResponsiveTableInListReport: function(aMatchers, fnSuccess, sTabId) {
				return this.waitFor({
					id: prefix + "responsiveTable" + (sTabId ? "-" + sTabId : ""),
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: aMatchers,
					success: fnSuccess,
					errorMessage: "The Responsive Table is not rendered correctly"
				});
			},

			// check the settings actions button
			theSmartTableHasViewSettingsDialogOpen: function (dialogTitle) {
				return this.waitFor({
					controlType: "sap.m.P13nDialog",
					matchers: new sap.ui.test.matchers.PropertyStrictEquals({
						name: "title",
						value: dialogTitle
					}),
					success: function (oTitle) {
						QUnit.ok(true, "Sorting Dialog opened with a title");
					},
					errorMessage: "Sorting Dialog not opened with a title."
				});
			},
			//OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty(sExpectedLabel)

			theCriticalActionConfirmationPopUpMessageIsCorrect: function () {
				return this.waitFor({
					controlType: "sap.m.Dialog",

					success: function (oContent) {
						var sActualText = oContent[0].mAggregations.content[0].mProperties.text;
						var sExpectedText = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("ACTION_CONFIRM|STTA_C_MP_ProductActivation");
						assert.equal(sActualText, sExpectedText, "Correct Critical Action Confirmation Pop Up is seen");

					},
					errorMessage: "Incorrect Critical Action Confirmation Pop Up is seen"
					});
			},

			theResponsivetableHasColumnsWithPopinDisplay: function (sPopinDisplay) {
				return this.waitFor({
					id: prefix + "responsiveTable",
					check: function(oTable) {
						for (var i=0;i<=oTable.getColumns().length-1;i++) {
							if (oTable.getColumns()[i].getPopinDisplay() === sPopinDisplay) {
								return true;
							}
						}
						return false;
					},
					success: function() {
						QUnit.ok(true, "The sap.m.Table has columns with PopinDisplay as "+sPopinDisplay);
					},
					errorMessage: "The sap.m.Table has columns with incorrect PopinDisplay"
				});

			},

			theButtonWithIdInControlTypeIsNotVisible: function(sButtonId, sControlType) {
				var aButtons = null;
				var bButtonVisibility = false;
				return this.waitFor({
					controlType: sControlType,
					success: function(oControl) {
						aButtons = oControl[0].getContent();
						for (var i=0; i < aButtons.length; i++ ) {
							if (aButtons[i].sId === sButtonId) {
								bButtonVisibility = true;
								break;
							}
						}
						if (bButtonVisibility) {
							notOk(bButtonVisibility, "Button with id: "+ sButtonId.split("--")[1] + " is available");
						}
						else {
							notOk(bButtonVisibility, "Button with id: " + sButtonId.split("--")[1] + " is not available");
						}
					},
					errorMessage: "The " + sControlType + " could not be rendered correctly."
				});
			},

			theSmartTableContainsAvatarImageIcon: function() {
				return this.waitFor({
					id: "__avatar0-__clone0",
					controlType: "sap.f.Avatar",
					success: function (oAvatar) {
						assert.equal(oAvatar.getDisplayShape(),"Square", "The Icon display shape is Square");
						assert.equal(oAvatar.getDisplaySize(),"S", "The Icon image display size is Small");
						assert.equal(oAvatar.getSrc(),"", "The image url is empty");
					},
					errorMessage: "The Avatar image icon not displayed properly"
				});

			}
		}
	};
});
