define("zen.rt.components.contextmenu/resources/js/contextmenu_handler", [ "sap/zen/basehandler" ],	function(BaseHandler) {
	"use strict";

	var ContextMenuHandler = function() {
		"use strict";

		BaseHandler.apply(this, arguments);

		var dispatcher = BaseHandler.dispatcher;

		var that = this;

		function init(oControl, oControlProperties) {
			
			var fDetermineClickedElement = function(iClientX, iClientY) {
				var aDisabledElements = [];
				var i;
				var oJqElement = $(document.elementFromPoint(iClientX, iClientY));
				
				var oJqClosest = oJqElement.closest(".zenControl");
				var sId = oJqClosest.attr("id");
				var oControl = dispatcher.getControlForId(sId);
				if (oControl && oControl.zenControlType === "xtable") {
					sId = oJqElement.attr("id");
					while (sId && sId.indexOf("droparea") > -1) {
						aDisabledElements.push(oJqElement);
						oJqElement.css("display", "none");
						oJqElement = $(document.elementFromPoint(iClientX, iClientY));
						sId = oJqElement.attr("id");
					}
					for (i = 0; i < aDisabledElements.length; i++) {
						aDisabledElements[i].css("display", "block");
					}
				}
				
				return oJqElement;
			};

			var fHandleClick = function(e) {
				var oDomClickedElement, oDomClickedComponent, oClickedUI5Component;

				if (!e.ctrlKey) {
					dispatcher.cancelDragDropOperation();
					
					// Assumption: there is only one context menu in an application
					that.clientX = e.clientX;
					that.clientY = e.clientY;

					oDomClickedElement = fDetermineClickedElement(e.clientX, e.clientY);

					if ($.browser.msie && document.msElementsFromPoint !== undefined) {
						var aZOrderElements = document.msElementsFromPoint(e.clientX, e.clientY);
						var oZenControl, oJqZOrderElement;

						for (var i = 0; i < aZOrderElements.length; i++) {
							oJqZOrderElement = $(aZOrderElements[i]);
							oZenControl = dispatcher.getControlForId(oJqZOrderElement.attr("id"));
							if (oZenControl) {
								oClickedUI5Component = sap.ui.getCore().byId(oZenControl.getId());
								break;
							}
						}
					} else {
						oDomClickedComponent = oDomClickedElement.closest(".zenControl");
						oClickedUI5Component = sap.ui.getCore().byId(oDomClickedComponent.attr("id"));
					}

					if (oClickedUI5Component) {
						var aHandlers = dispatcher.getHandlers(oClickedUI5Component.zenControlType);
						if (aHandlers && aHandlers[0]) {
							var oHandler = aHandlers[0];
							var fContextMenuAction = oHandler.getContextMenuAction(
									oControlProperties.contextmenuid, oClickedUI5Component, oDomClickedElement);
							if (!fContextMenuAction) {
								// do nothing
							} else {
								if (e) {
									if (e.preventDefault) {
										e.preventDefault();
									}
									if (e.stopPropagation) {
										e.stopPropagation();
									}
									if (e.cancelBubble) {
										e.cancelBubble = true;
									}
								}

								fContextMenuAction();
							}
						}
					}
				}
			}

			if (!sap.zen.designmode) {
				// Attach click handler
				var jqDocument = $(document);
				jqDocument.unbind('contextmenu');
				jqDocument.bind('contextmenu', fHandleClick);
			}
		}

		this.create = function(oChainedControl, oControlProperties) {
			var id = oControlProperties["id"];

			var oControl = this.createButton(id);
			init(oControl, oControlProperties);
			oControl.setVisible(false);

			return oControl;
		};

		this.update = function(oControl, oControlProperties) {
			if (!sap.zen.designmode && oControlProperties !== undefined) {

				// update may also be called when not actually invoked, e. g. when
				// a variable screen is invoked from the app and all components
				// on the page get updated
				if (!oControlProperties.entries) {
					return;
				}

				var aAllowedSemanticSources = [];

				if (oControlProperties.navigation) {
					if (oControlProperties.navigation.allowed_semantic_sources) {
						var i = 0;
						var iLength = oControlProperties.navigation.allowed_semantic_sources.length;
						if (iLength && iLength > 0) {
							for (i = 0; i < iLength; i++) {
								aAllowedSemanticSources
										.push(oControlProperties.navigation.allowed_semantic_sources[i].entry.semanticname);
							}
						}
					}
				}

				var oMenuItemToDialogJsonMap = {};

				var sCssClass;
				if (oControlProperties.cssclass && oControlProperties.cssclass !== "") {
					sCssClass = oControlProperties.cssclass;
				}

				var fOnOkDropDown = function(oDdBox) {
					that.oDialogResult[oDdBox.getId()] = oDdBox.getSelectedKey();
				}

				var fOnOkCheckBox = function(oCheckBox) {
					that.oDialogResult[oCheckBox.getId()] = "" + oCheckBox.getChecked();
				}

				var fOnOkInputField = function(oInputField) {
					that.oDialogResult[oInputField.getId()] = "" + oInputField.getValue();
				}

				var fCreateUi5Control = function(oElementJson, oVLayout, fOnSubmit) {
					var sType = oElementJson.type;
					var oCtrl = null;
					var fOkHandler = null;
					var oLabel;
					if (sType === "dropdown") {
						if (oElementJson.text) {
							oLabel = that.createLabel(oElementJson.id + "_label");
							oLabel.setText(oElementJson.text);
							oLabel.setWidth("200px");
							oVLayout.addContent(oLabel);
						}

						oCtrl = that.createDropdownBox(oElementJson.id);
						oCtrl.setWidth(oElementJson.id === "dd_hierarchy" ? "400px" :"200px");
						if (oElementJson.entries) {
							var iEntryNum, i, oDdEntry, oItem, sSelected;
							
							iEntryNum = oElementJson.entries.length;

							for (i = 0; i < iEntryNum; i++) {
								oDdEntry = oElementJson.entries[i].entry;
								oItem = new sap.ui.core.ListItem();
								oItem.setKey(oDdEntry.id);
								oItem.setText(oDdEntry.text);
								if (oDdEntry.selected) {
									if (oDdEntry.selected === true) {
										if(sap.zen.Dispatcher.instance.isMainMode()) {
											sSelected = oItem;
										} else {
											sSelected = oDdEntry.text;
										}
									}
								}
								oCtrl.addItem(oItem);
							}
						}
						if (sSelected) {
							if(sap.zen.Dispatcher.instance.isMainMode()) {
								oCtrl.setSelectedItem(sSelected);
							} else {
								oCtrl.setValue(sSelected);
							}
						}
						oCtrl.attachChange(function() {
							var selectedKey = oCtrl.getSelectedKey();
							if (selectedKey !== "multiple") {
								var firstItem = oCtrl.getItems()[0];
								if (firstItem.getKey() === "multiple") {
									oCtrl.removeItem(firstItem);
								}
							}
						});
						oVLayout.addContent(oCtrl);
						fOkHandler = fOnOkDropDown;
					} else if (sType === "checkbox") {
						oCtrl = that.createCheckBox(oElementJson.id);
						oCtrl.setText(oElementJson.text);
						if (oElementJson.checked) {
							oCtrl.setChecked(oElementJson.checked === true)
						} else {
							oCtrl.setChecked(false);
						}
						oVLayout.addContent(oCtrl);
						fOkHandler = fOnOkCheckBox;
					} else if (sType === "input") {
						if (oElementJson.text) {
							oLabel = that.createLabel(oElementJson.id + "_label");
							oLabel.setText(oElementJson.text);
							oLabel.setWidth("200px");
							oVLayout.addContent(oLabel);
						}
						oCtrl = that.createTextField(oElementJson.id);
						if(fOnSubmit && oCtrl.attachSubmit){
							oCtrl.attachSubmit(fOnSubmit);
						} else if (fOnSubmit && oCtrl.onsapenter){
							oCtrl.addEventDelegate({
								onsapenter: fOnSubmit
							});
						}
						oCtrl.setValue(oElementJson.value);
						oVLayout.addContent(oCtrl);
						fOkHandler = fOnOkInputField;
					} else if (sType === "numeric_input") {
						if (oElementJson.text) {
							oLabel = that.createLabel(oElementJson.id + "_label");
							oLabel.setText(oElementJson.text);
							oLabel.setWidth("200px");
							oVLayout.addContent(oLabel);
						}
						oCtrl = that.createTextField(oElementJson.id);
						oCtrl.attachBrowserEvent("keypress",function(e) {  
							var key_codes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 0, 8];  
						  if (!($.inArray(e.which, key_codes) >= 0)) {  
						  	e.preventDefault();  
						  }        
						});  
						oCtrl.setValue(oElementJson.value);
						oCtrl.setWidth("100px");
						oVLayout.addContent(oCtrl);
						fOkHandler = fOnOkInputField;
					}

					if (oCtrl) {
						that.aDlgControls.push({
							control: oCtrl,
							fOkHandler: fOkHandler
						});
					}
				}
				
				var createOkButtonPressFunction = function(oDialog, oJson) {
					return function() {	
						// handle control values
						var iNumOfControls = that.aDlgControls.length, i, oCtrlInfo, oUi5Control;

						for (i = 0; i < iNumOfControls; i++) {
							oCtrlInfo = that.aDlgControls[i];
							if (oCtrlInfo) {
								oUi5Control = oCtrlInfo.control;
								oCtrlInfo.fOkHandler(oUi5Control);
							}
						}
						var sResultJSON = JSON.stringify(that.oDialogResult);
						var find = '"';
						var re = new RegExp(find, 'g');
						sResultJSON = sResultJSON.replace(re, "\\\"");
						oDialog.close();
						
						var sCommand = oJson.submitdialogcommand.replace("__JSON__", sResultJSON);
						var fCommand = new Function(sCommand);
						fCommand();
					}
				}

				var fAddDialogButtons = function(oDialog, oJson) {
					var oOkButton = that.createButton(oDialog.getId() + "OK_BTN");
					oOkButton.setText(oJson.okbtntext);
					oOkButton.attachPress(createOkButtonPressFunction(oDialog, oJson));

					var oCancelButton = that.createButton(oDialog.getId() + "CANCEL_BTN");
					oCancelButton.setText(oJson.cancelbtntext);
					oCancelButton.attachPress(function() {
						oDialog.close();
					});

					oDialog.addButton(oOkButton);
					oDialog.addButton(oCancelButton);
				}

				var fOpenDialog = function(e) {
					var oJson;
					if (e.sId) {
						var sId = e.getParameters().id;
						oJson = oMenuItemToDialogJsonMap[sId];
					} else {
						oJson = e;
					}

					var i, oElementJson;

					that.oDialogResult = {};
					that.oDialogResult["dlgtype"] = oJson.dlgtype;

					var oDialog = that.createDialog(sId + "_" + oJson.dlgtype, {
						"modal": true
					});
					oDialog.setResizable(false);
					oDialog.setTitle(oJson.title);
					oDialog.attachClosed(function() {
						oDialog.destroyContent();
						oDialog.destroy();
						that.aDlgControls = [];
						that.oDialogResult = {};
					});

					fAddDialogButtons(oDialog, oJson);

					var oVLayout = new sap.ui.layout.VerticalLayout(sId + "_vlayout");
					oDialog.addContent(oVLayout);

					that.aDlgControls = [];
					var fOnSubmit = null;
					
					var lNumberOfElements = 0;
					if (oJson.elements) {
						lNumberOfElements = oJson.elements.length;
					}
					if(lNumberOfElements <= 1){
						//if the dialog contains only one element it should be possible to submit via enter, without the need to click "ok"
						fOnSubmit = createOkButtonPressFunction(oDialog, oJson);
					}
					for (i = 0; i < lNumberOfElements; i++) {
						oElementJson = oJson.elements[i].element;
						fCreateUi5Control(oElementJson, oVLayout, fOnSubmit);
					}

					oDialog.open();
				}

				// Add select options for any not already set dimensions.
				var fAddSelectOptionsFromArray = function(aSelectionArray, oSelectOptions) {
					var sName;

					if (aSelectionArray) {
						var iLength = aSelectionArray.length;
						if (iLength > 0) {
							for (i = 0; i < iLength; i++) {
								sName = aSelectionArray[i].dimension.name;

								if (sName && sName.length > 0 && !oSelectOptions.hasOwnProperty(sName)) {
									if (aSelectionArray[i].dimension.selection) {
										// Single string value, for single-value variable support. Might be soon
										// removable.
										oSelectOptions[sProperty] = [ {
											"Sign": "I",
											"Option": "EQ",
											"Low": aSelectionArray[i].dimension.selection,
											"High": null
										} ];

									} else if (aSelectionArray[i].dimension.selections
											&& aSelectionArray[i].dimension.selections.length > 0) {
										// In selectoption format: An array of individual range objects.
										oSelectOptions[sName] = aSelectionArray[i].dimension.selections.map(function (selection) {
											if (selection.LowType !== "DATE") {
												return selection;
											}
											//clone object and "extend" the date
											var to = {};
											for (var nextKey in selection) {
												if (Object.prototype.hasOwnProperty.call(selection, nextKey)) {
													to[nextKey] = (nextKey === "Low" || nextKey === "High") && selection[nextKey] ? selection[nextKey] + "T00:00:00.000Z" : selection[nextKey];
												}
											}
											return to;
										});
									}
								}
							}
						}
					}
				}

				// This is for selections. All kinds -- including range and multivalue, are supported
				var fGetSelectOptions = function(oContext, oClickContextParams) {
					var oSelectOptions = {};
					var aSelectOptions = [];

					oClickContextParams = oClickContextParams || {};

					// First pre-fill with clickcontext
					// Then apply the rest if any
					for ( var sProperty in oClickContextParams) {
						if (oClickContextParams.hasOwnProperty(sProperty)) {
							oSelectOptions[sProperty] = [ {
								"Sign": "I",
								"Option": "EQ",
								"Low": oClickContextParams[sProperty],
								"High": null
							} ];
						}
					}

					fAddSelectOptionsFromArray(oContext.filter, oSelectOptions);
					fAddSelectOptionsFromArray(oContext.variables, oSelectOptions);

					for ( var sSelectOptionProperty in oSelectOptions) {
						if (oSelectOptions.hasOwnProperty(sSelectOptionProperty)) {
							aSelectOptions.push({
								"PropertyName": sSelectOptionProperty,
								"Ranges": oSelectOptions[sSelectOptionProperty]
							});
						}
					}

					if (aSelectOptions.length > 0) {
						return aSelectOptions;
					}
				}

				// Add tuple elements as parameters
				var fCreateParamsForContext = function(oContext) {
					if (!oContext) {
						return;
					}

					var oParams = {};

					// main dim/member
					if (oContext.member && oContext.member.length > 0) {
						oParams[oContext.dimension] = oContext.member === "#" ? "" : oContext.member;
						if (oContext.memberType === "DATE") {
							oParams[oContext.dimension] = oParams[oContext.dimension] + "T00:00:00.000Z";
						}
					}

					// tuple elements for further specification of clicked context
					var oTupleElement, i, sName;

					var oTupleElements = oContext.tuple_elements;
					if (oTupleElements) {
						var iLength = oTupleElements.length;
						for (i = 0; i < iLength; i++) {
							oTupleElement = oTupleElements[i].tuple_element;
							if (oTupleElement.member && oTupleElement.member.length > 0) {
								sName = oTupleElement.dimension;
								if (!oParams[sName]) {
									oParams[sName] = oTupleElement.member === "#" ? "" : oTupleElement.member;
									if (oTupleElement.memberType === "DATE") {
										oParams[sName] = oParams[sName] + "T00:00:00.000Z";
									}
								}
							}
						}
					}

					return oParams;
				}

				// Add selection and variable state as "Selection Variant".
				// omit things which are already in the Parameters...
				var fCreateSelectionVariantObject = function(oContext, oClickContextParams) {
					if (!oContext) {
						return;
					}

					var oSelectionVariantObject = {};

					// Mind the priorities after having added the main context information above:
					// first add filter information ...

					var oSelectOptions = fGetSelectOptions(oContext, oClickContextParams);

					if (oSelectOptions !== undefined) {
						oSelectionVariantObject.SelectOptions = oSelectOptions;
						oSelectionVariantObject.SelectionVariantID = new Date().toISOString();
						oSelectionVariantObject.Text = "Temporary Variant "
								+ oSelectionVariantObject.SelectionVariantID;

						return oSelectionVariantObject;
					}
				}

				var fAddNameSelectionPairFromArray = function(aArray, oParams) {
					var sName, sSelection, aSelections;

					if (aArray && oParams) {
						var iLength = aArray.length;
						if (iLength > 0) {
							for (i = 0; i < iLength; i++) {
								sName = aArray[i].dimension.name;
								if (sName && sName.length > 0) {
									if (!oParams[sName]) {
										// A single "selection" entry means it's a variable value.
										sSelection = aArray[i].dimension.selection;
										if (sSelection && sSelection.length > 0) {
											oParams[sName] = sSelection;
										} else {
											// "selections" means it's in the format of an array of selection
											// objects.
											// Only single-value == comparisons will be taken here, as others
											// are not possible to express in URL-parameters.
											aSelections = aArray[i].dimension.selections;
											if (aSelections && aSelections.length === 1) {
												if (aSelections[0].Sign && aSelections[0].Sign === "I"
														&& aSelections[0].Option
														&& aSelections[0].Option === "EQ") {
													oParams[sName] = aSelections[0].Low === "#" ? "" : aSelections[0].Low;
													if (aSelections[0].LowType === "DATE") {
														oParams[sName] = oParams[sName] + "T00:00:00.000Z";
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}

				var fAddJumpTargetSubMenu = function(oMenu, oContext, sNotifyFioriJumpCommand) {
					var aMappedDimensions = [];

					var oCrossAppNav = sap.ushell && sap.ushell.Container
							&& sap.ushell.Container.getService("CrossApplicationNavigation");
					if (oCrossAppNav) {
						var aIntents = [];
						if (oContext.dimension && oContext.dimension.length > 0) {
							aMappedDimensions.push(oContext.dimension);
							if ($.inArray(aMappedDimensions[0], aAllowedSemanticSources) === -1) {
								return;
							}
						} else {
							// get all of them, e. g. when having clicked on a data cell
							aMappedDimensions = aAllowedSemanticSources;
						}

						// First create classic parameters. These are only for the actual click context, not the
						// existing filter context etc.
						// These will also be taken into account when creating the actual parameters for the
						// selection variant below.
						var oParams = fCreateParamsForContext(oContext);

						// Now create the selection variant, taking into account any overriding parameters
						var oSelectionVariant = fCreateSelectionVariantObject(oContext, oParams);

						// Now we can add the (redundant) selections to URL parameters.
						// first add filter information ...
						fAddNameSelectionPairFromArray(oContext.filter, oParams);

						// ... then add add variables
						fAddNameSelectionPairFromArray(oContext.variables, oParams);

						var sAppStateKey;

						// DSH.js ALWAYS creates window.sapbi_page. If later multiple DSH are allowed on one
						// page, this logic must change.
						if (oSelectionVariant !== undefined && window.sapbi_page
								&& window.sapbi_page.appComponent) {
							var oAppState = oCrossAppNav.createEmptyAppState(window.sapbi_page.appComponent);
							var oAppStateData = {
								"selectionVariant": oSelectionVariant
							};
							oAppState.setData(oAppStateData);
							oAppState.save();
							sAppStateKey = oAppState.getKey();
						}

						var fNotifyFioriHelper = function(sShellHash) {
							if (sNotifyFioriJumpCommand && sNotifyFioriJumpCommand.length > 0) {
								sNotifyFioriJumpCommand = sNotifyFioriJumpCommand.replace("__HASH__",
										sShellHash);
								var fAction = new Function(sNotifyFioriJumpCommand);
								fAction();
								return true;
							}
							return false;
						}
						
						var aGetLinksArgs = [];
						aMappedDimensions.forEach(function(sSemanticObject) {
		                    aGetLinksArgs.push([{
		                        semanticObject: sSemanticObject,
		                        params: oParams,
		                        ignoreFormFactor: false,
		                        ui5Component: window.sapbi_page.appComponent,
		                        appStateKey: sAppStateKey,
		                        compactIntents: false}]);
						});
						
						var selfLink = oCrossAppNav.hrefForAppSpecificHash("");
						if (selfLink) {
							var qm = selfLink.indexOf("?");
							selfLink = selfLink.substring(0, qm > 0 ? qm : selfLink.length - 2);
						}
						
						oCrossAppNav.getLinks(aGetLinksArgs).done(function(paLinks) {
							//Will return an array of arrays of arrays of links.
							paLinks.forEach(function(aLinksForOneObject) {
								aLinksForOneObject[0].forEach(function(oLink) {
									if (oLink.text && oLink.intent && oLink.intent !== selfLink && oLink.intent.indexOf(selfLink + "?") !== 0) {
										//Only take links which have a text and intent is not pointing to on the same app
										aIntents.push(oLink);
									}
								});
							});
							//Sort the complete list by text
							aIntents.sort(function (a, b) {
								return a.text.localeCompare(b.text);
							});
							if (aIntents && aIntents.length > 0) {
								var sJumpMenuId = oMenu.getId() + "_JUMP_SUB";
								// remove old submenu
								var oOldJumpTargetsMenu = sap.ui.getCore().getControl(sJumpMenuId);
								if (oOldJumpTargetsMenu) {
									oOldJumpTargetsMenu.destroyItems();
									oOldJumpTargetsMenu.destroy();
								}
								var oJumpTargetsMenu = null;

								var idx;
								var fSelect = function() {
									var oCrossAppNav = sap.ushell
											&& sap.ushell.Container
											&& sap.ushell.Container
													.getService("CrossApplicationNavigation");
									if (oCrossAppNav) {
										// request backend to create
										// bookmark and trigger
										// actual jump via fiori
										// helper
										if (!fNotifyFioriHelper(this.dsh_shellHash)) {
											// In case there is no
											// Fiori helper
											// (non-updated App),
											// jump directly.
											oCrossAppNav
													.toExternal({
														target: {
															shellHash: this.dsh_shellHash
														}
													});
										}
									}
								};
								for (idx = 0; idx < aIntents.length; ++idx) {
									var oJumpMenuItem;
									var oIntent = aIntents[idx];

									if (!oMenu.bOpen) {
										return;
									}

									var sId = oControl.getId() + "_FIORINAV_"
											+ idx;
									var oMenuItemDynamic = sap.ui.getCore().getControl(sId);
									
									if (!oMenuItemDynamic) {
										oMenuItemDynamic = that.createMenuItem(sId, {
													text: oIntent.text
										});
									} else {
										oMenuItemDynamic.setText(oIntent.text);
									}
									oMenuItemDynamic.dsh_shellHash = oIntent.intent;

									oMenuItemDynamic.attachSelect(fSelect);

									if (!oJumpTargetsMenu) {
										// create new submenu
										oJumpTargetsMenu = sap.ui.getCore()
												.getControl(sJumpMenuId);
										if (!oJumpTargetsMenu) {
											oJumpTargetsMenu = that
													.createMenu(sJumpMenuId);
										}
									}
									oJumpTargetsMenu.addItem(oMenuItemDynamic);
								}

								if (oJumpTargetsMenu !== null
										&& oMenu.bOpen === true) {
									var sMenuItemId = oControl.getId() + "_"
											+ oContext.menuitemid;
									oJumpMenuItem = that.createMenuItem(
											sMenuItemId, {
												text: oContext.text
											});
									oJumpMenuItem.setSubmenu(oJumpTargetsMenu);
									oMenu.addItem(oJumpMenuItem);
								}
							}
						});
					}
				}

				var fCreateMenu = function(aEntries, sId) {
					var sMenuId = "menu" + sId;
					var hasAtLeastOneEntry = false

					var oOldMenu = sap.ui.getCore().getControl(sMenuId);
					if (oOldMenu) {
						oOldMenu.destroyItems();
						oOldMenu.destroy();
					}

					var oMenu = that.createMenu(sMenuId);
					var sMenuItemId, oEntry, sEntryId;

					if (aEntries) {
						for (var index = 0; index < aEntries.length; index++) {
							oEntry = aEntries[index].entry;
							sEntryId = sId + "-" + index;

							sMenuItemId = "item" + sEntryId;
							if (oEntry.key) {
								sMenuItemId = "CONTEXT_MENU_" + oEntry.key;
							}

							var oMenuItem = that.createMenuItem(sMenuItemId, {
								text: oEntry.text
							});

							if (oEntry.disabled) {
								oMenuItem.setEnabled(false);
							}

							if (oEntry.checked) {
								oMenuItem.setIcon("sap-icon://accept");
							}

							if (oEntry.onSelect) {
								oMenuItem.attachSelect(new Function(oEntry.onSelect));
							}

							if (oEntry.entries) {
								var oSubmenu = fCreateMenu(oEntry.entries, sEntryId);
								oMenuItem.setSubmenu(oSubmenu);
							}

							if (oEntry.dialog) {
								oMenuItemToDialogJsonMap[sMenuItemId] = oEntry.dialog;
								oMenuItem.attachSelect(fOpenDialog);
							}

							if (oEntry.startsSection && hasAtLeastOneEntry) {
								oMenuItem.setStartsSection(true);
							}

							oMenu.addItem(oMenuItem);
							hasAtLeastOneEntry = true;
						}
					}
					if (sCssClass) {
						oMenu.addStyleClass(sCssClass);
					}

					return oMenu;
				}

				var aEntries = oControlProperties.entries;
				if (oControlProperties.dialog === true && aEntries) {
					var oEntry = aEntries[0].entry;
					fOpenDialog(oEntry.dialog);
				} else {
					var oMenu = fCreateMenu(aEntries, "0");
					if (sap.zen.Dispatcher && sap.zen.Dispatcher.instance) {
						sap.zen.Dispatcher.instance.registerContextMenu(oMenu);
					}
					var eDock = sap.ui.core.Popup.Dock;
					if (oMenu.getItems().length > 0) {
						var iXCoord = that.clientX;
						if (sap.ui.getCore().getConfiguration().getRTL() === true) {
							iXCoord = $(window).width() - that.clientX;
						}
						oMenu.open(false /* First item already highlighted */, oControl.getFocusDomRef() /*
						 * Dom reference
						 * which gets the
						 * focus back when
						 * the menu is
						 * closed
						 */, eDock.BeginTop, /*
						 * "Edge" of the menu (see
						 * sap.ui.core.Popup)
						 */
						eDock.BeginTop, /*
						 * "Edge" of the related opener
						 * position (see
						 * sap.ui.core.Popup)
						 */
						window, /*
						 * Related opener position (see
						 * sap.ui.core.Popup)
						 */
						"" + iXCoord + " " + that.clientY);

						fAddJumpTargetSubMenu(
								oMenu,
								oControlProperties.context,
								(oControlProperties.navigation && oControlProperties.navigation.notifyfiorijumpcommand)
										|| "");
					}
				}
			}
			return oControl;
		};

		this.getType = function() {
			return "contextmenu";
		}

	};
	return new ContextMenuHandler();

});
