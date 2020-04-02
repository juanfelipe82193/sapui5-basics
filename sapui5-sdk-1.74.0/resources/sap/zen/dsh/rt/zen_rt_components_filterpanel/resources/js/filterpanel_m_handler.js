define("zen.rt.components.filterpanel/resources/js/filterpanel_m_handler",  ["sap/zen/basehandler", "./ValueHelpDialog", "./emptyComponent"], function(BaseHandler, ValueHelpDialog, Empty) {
"use strict";

var dispatcher = BaseHandler.dispatcher;

$.sap.require("sap.ui.comp.util.FormatUtil");
$.sap.require("sap.ui.core.format.DateFormat");

var FilterPanelHandler = function() {
	var that = this;
	
	BaseHandler.apply(this, arguments);

	/**
	 * Create the Control
	 */
	this.create = function(oChainedControl, oControlProperties) {
		var lControlId = that.createUI5Identifier(oControlProperties["id"]);
		var loControl;

		var loJsonModel = new sap.ui.model.json.JSONModel();
		loJsonModel.setData(oControlProperties);
		
		var lIsMemberSelector = loJsonModel.getProperty("/property/memberselector") || loJsonModel.getProperty("/property/popupreference");
		
		if (lIsMemberSelector) {
			loControl = oChainedControl ? oChainedControl : new Empty(lControlId);
			loControl.onAfterRendering = function() {
				new Function(that.prepareCommand(loControl.getModel().getProperty("/command/showfilterdialog"), "__STRING__", loControl.getModel().getProperty("/characteristics/0/characteristic/name")))();
				loControl.onAfterRendering = undefined;
			};
		} else {
			loControl = oChainedControl ? oChainedControl : new sap.m.VBox(lControlId).addStyleClass("sapzenfilterpanelM");
			if (!loJsonModel.getProperty("/property/showembedded")) {
				loControl.addStyleClass("sapzendimensionfilterM");
			}
		}
		if (!loJsonModel.getProperty("/property/variablescreen")) {
			loControl.ZEN_IdToDimensionMap = {};
		}
		
		loControl.setModel(loJsonModel);
		if (oChainedControl) {
			loControl.removeAllItems();
		}
		
		if (!lIsMemberSelector) {
			addItems(loControl);
			
			loControl.ZEN_submit = submitExternal(loJsonModel, true);
			loControl.ZEN_submit_with_apply = submitExternal(loJsonModel, true, true);
			loControl.ZEN_check = submitExternal(loJsonModel, false);
			loControl.ZEN_cancel = function() {
				new Function(loJsonModel.getProperty("/command/cancelonlyfilter"))();
			};	
		}
		
		var loSuperExit = loControl.exit;
		loControl.exit = function() {
			if (loSuperExit) {
				loSuperExit.apply(loControl, arguments);
			}
			//This is a temporary fix for the issue that, when the Dsh control is being destroyed via navigation to external, 1 command is put in the queue per
			//dimension in the filterbar.  This can lead to long flickering of the loading indicator as the queue is processed.  This should be fixed more 
			//cleanly in the future.
			(sapbi_page.appComponent && sapbi_page.appComponent._bIsBeingDestroyed) || new Function(loJsonModel.getProperty("/command/destroyfiltercomponent"))();
		};
		
		if (!this.isDesignModeD4LIncluded()) {
			if (oControlProperties.visible) {
				loControl.removeStyleClass("zenHideFilterPanel");
			} else {
				loControl.addStyleClass("zenHideFilterPanel");
			}
		}
				
		return loControl;
	};

	/**
	 * Update the Control
	 */
	this.update = function(oControl, oControlProperties, oComponentProperties) {
		if (oControl && oControlProperties) {
			var lView = oControlProperties.view;
			
			if (this.isDesignModeD4LIncluded() || oControlProperties.newds) {
                oControl.ZEN_multiInput = [];
				oControl = this.create(oControl, oControlProperties, oComponentProperties);
				if (lView !== "DIALOG") {
					return oControl;
				}
			}
			
			if (oControlProperties.changeVisibility) {
				if (oControlProperties.visible) {
					oControl.removeStyleClass("zenHideFilterPanel");
				} else {
					oControl.addStyleClass("zenHideFilterPanel");
				}
				if (lView === "SUBMIT") {
					oControl.ZEN_submit();
				} else if (lView === "SUBMIT_WITH_APPLY") {
					oControl.ZEN_submit_with_apply();
				} else if (lView === "CANCEL") {
					oControl.ZEN_cancel();
				}
				return oControl;
			}
			
			var loModel = oControl.getModel();
			var ltFilters = loModel.getProperty("/filters"), loFilter;	
			var lVariableScreen = loModel.getProperty("/property/variablescreen");
			
			// New Filters
			var ltNewFilters = oControlProperties.filters;
			if (ltNewFilters) {
				ltFilters = loModel.getProperty("/filters");
				
				var lFilterMatch = false;
				for (var lCharName in ltNewFilters) {
					var loNewFilter = ltNewFilters[lCharName];					
					loFilter = ltFilters[lCharName];
					if (!loFilter || !loNewFilter) {
						continue;
					}
					
					lFilterMatch = true;
					if (oControlProperties.filtercanceled || !loFilter.dirty || lVariableScreen) {
						if (lVariableScreen && loFilter.dirty) {
							loNewFilter.dirty = true;
						}							
						ltFilters[lCharName] = loNewFilter;
						if (loModel.getProperty("/dialog/name") === lCharName) {
							loModel.setProperty("/dialog/filters", loNewFilter);
						}
					}
				}
				
				loModel.setProperty("/filters", lFilterMatch ? ltFilters : ltNewFilters);
				forceModelUpdate(loModel, "/filters");
			}
			
			// Validated Filters
			var ltValidatedFilters = oControlProperties.validatedfilters;
			if (ltValidatedFilters) {
				ltFilters = loModel.getProperty("/filters");
				
				for (var lCharName in ltValidatedFilters) {
					var loValidatedFilter = ltValidatedFilters[lCharName];
					loFilter = ltFilters[lCharName];
					if (!loFilter || !loValidatedFilter) {
						continue;
					}
					
					if (loFilter && loFilter.dirty) {
						loValidatedFilter.dirty = true;						
						ltFilters[lCharName] = loValidatedFilter;
						if (loModel.getProperty("/dialog/name") === lCharName) {
							loModel.setProperty("/dialog/filters", loValidatedFilter);
						}
					}
				}
				
				forceModelUpdate(loModel, "/filters");
			}
			
			var loOldAxis = loModel.getProperty("/axis");
			
			var lHasDirtyAxis = false;		
			var ltOldCharacteristics = loModel.getProperty("/characteristics");
			if (ltOldCharacteristics) {
				for (i = 0; i < ltOldCharacteristics.length; i++) {
					if (ltOldCharacteristics[i].characteristic.axisdirty) {
						lHasDirtyAxis = true;
						break;
					}
				}
			}

			var lCharsChanged = false;
			var lAxisDirty = lHasDirtyAxis || (loOldAxis && (loOldAxis.rows.dirty || loOldAxis.columns.dirty));
			if (lView === "DEFAULT" && (oControlProperties.filtercanceled || !lAxisDirty) && !isCharListEqual(oControlProperties.characteristics, ltOldCharacteristics)) {
				loModel.setProperty("/characteristics", oControlProperties.characteristics);
				lCharsChanged = true;
			}
			
			var lMaxChildIndex = -1;			
			if (lView === "DIALOG") {
				loModel.setProperty("/dialog", oControlProperties.dialog);
				if (oControlProperties.characteristics && !isCharListEqual(oControlProperties.characteristics, ltOldCharacteristics)) {
					loModel.setProperty("/characteristics", oControlProperties.characteristics);
					lCharsChanged = true;
				}
				
				var loValueHelpDialog = getValueHelpDialog(oControl);
				loValueHelpDialog.open();
				loValueHelpDialog.update();
				oControl.zenValueHelpDialog = loValueHelpDialog;
				
			} else if (lView === "DIALOG_SEARCH") {
				var loDialogProperties = oControlProperties.dialog;
				loModel.setProperty("/dialog/selection", loDialogProperties.selection);
				
				var lHierarchical = loModel.getProperty("/dialog/hierarchical");
				if (lHierarchical) {
					var ltMembers = loDialogProperties.members;
					if (ltMembers) {
						for (var i = 0; i === lMaxChildIndex+1; i++) {
							var loChild = ltMembers[""+i];
							if (!loChild) {
								continue;
							}
							
							loChild.level = 0;
							lMaxChildIndex = i;
						}
					}
				}
				loModel.setProperty("/dialog/members", loDialogProperties.members);
				
				if (oControl.zenValueHelpDialog) {
					if (lHierarchical && oControl.zenValueHelpDialog.getTable().collapseAll) {
						oControl.zenValueHelpDialog.getTable().collapseAll();
					}
					oControl.zenValueHelpDialog.update();
					//release searchField from busy mode 
					//(searchField is stored in ValueHelpDialog as FilterBar)
					oControl.zenValueHelpDialog.getFilterBar().setBusy(false);
					if (loDialogProperties.selection.maxelements || (loDialogProperties.members && (lHierarchical || loDialogProperties.members.size > 0))) {
						oControl.zenValueHelpDialog.TableStateSearchData();
					} else {
						oControl.zenValueHelpDialog.TableStateDataFilled();
					}
				}
				
			} else if (lView === "EXPAND_NODE") {
				var lParentLevel = loModel.getProperty(oControlProperties.path).level;
				
				var loMember = oControlProperties.member;
				loMember.level = lParentLevel;
				
				for (var i = 0; i === lMaxChildIndex+1; i++) {
					var loChild = loMember[""+i];
					if (!loChild) {
						continue;
					}
					
					loChild.level = lParentLevel+1;
					lMaxChildIndex = i;
				}
				loModel.setProperty(oControlProperties.path, oControlProperties.member);
				
				if (oControl.zenValueHelpDialog) {
					oControl.zenValueHelpDialog.update();
				}
				
			} else if (lView === "SUBMIT") {
				oControl.ZEN_submit();
				
			} else if (lView === "SUBMIT_WITH_APPLY") {
				oControl.ZEN_submit_with_apply();
				
			} else if (lView === "CANCEL") {
				oControl.ZEN_cancel();
			}				
		}
		
		return oControl;
	};

	/**
	 * Add Items
	 */
	function addItems(oControl) {
		//if "/property/showembedded" is true, render as filter panel
		//if false as dimension filter
		var loModel = oControl.getModel();
		
		var lShowHeader = loModel.getProperty("/property/showembedded");
		if (lShowHeader) {
			var lNavigationMode = loModel.getProperty("/property/navigationpanel");
            
            var loSearchField = new sap.m.SearchField({
                liveChange: function(oEvent) {
                    var lValue = oEvent.getParameter("newValue");
                    var loFilter = new sap.ui.model.Filter(lNavigationMode ? "entry/text" : "characteristic/text", sap.ui.model.FilterOperator.Contains, lValue);
					var ltFilters = [ loFilter ];
 					
					var ltVisiblePrompts = loModel.getProperty("/visibleprompts");
					if (ltVisiblePrompts) {
						ltFilters.push(getFilterForVisibleVariables(ltVisiblePrompts));
					}
					
                    oControl.ZEN_multiInput = [];
					
					var ltCharLists = oControl.ZENCharLists;
                    for (var i = 0; i < ltCharLists.length; i++) {
                        ltCharLists[i].getBinding("formElements").filter(ltFilters);
                    }
            }});
            
			var loSubHeader = new sap.m.Toolbar({
				content: [,loSearchField]
			});
			
			if (loModel.getProperty("/property/variablescreen") && loModel.getProperty("/visibleprompts")) {
				loSubHeader.addContent(getSettingsButton(oControl, loSearchField));
			}

			oControl.addItem(loSubHeader);
		}

		oControl.addItem(getMainItem(oControl));
	}

	/**
	 * Get Main Item
	 */
	function getMainItem(oControl) {
		var loForm = new sap.ui.layout.form.Form({
			editable: true,
			formContainers: [getMainContent(oControl)],
			layout: new sap.ui.layout.form.ResponsiveGridLayout({
				labelSpanXL: 3,
				labelSpanL: 4,
				labelSpanM: 5,
				labelSpanS: 12,
				adjustLabelSpan: false
			})
		});
		
		return loForm;
	}
	
	/**
	 * Get Main Content
	 */
	function getMainContent(oControl) {
		var loContent;
		
		var loModel = oControl.getModel();
		if (loModel) {
			var ltVisiblePrompts = loModel.getProperty("/visibleprompts");
			if (ltVisiblePrompts) {
				loContent = getFormContainer(oControl, [getFilterForVisibleVariables(ltVisiblePrompts)]);
			} else {
				loContent = getFormContainer(oControl);
			}
		}
		
		return loContent;
	}

	/**
	 * Get Form Container
	 */
	function getFormContainer(oControl, tFilters, axis) {
		var loFormContainer = new sap.ui.layout.form.FormContainer({
			formElements: {
				path : "/characteristics",
				factory: getFromElementsFactory(oControl, axis),
				filters: tFilters
			}
		});
		oControl.ZENCharLists = [loFormContainer];
		return loFormContainer;
	}

	/**
	 * Get From Elements Factory
	 */
	function getFromElementsFactory(oControl, axis) {
		return function(sId, oContext) {
			var loModel = oContext.getModel();
			var lCharName = loModel.getProperty(axis ? oContext.getPath("entry/name") : oContext.getPath("characteristic/name"));
			var lCharPath = axis ? getPathForCharName(loModel, lCharName) : oContext.getPath("characteristic");
			if (!lCharPath) {
				return new sap.ui.layout.form.FormElement({
					visible: false
				});
			}
			
			var loInput = getInput(loModel, lCharName, lCharPath, oControl);
            
			var lPositionPath = oContext.getPath();
			if (!oControl.ZEN_multiInput) {
				oControl.ZEN_multiInput = [];
			}
			oControl.ZEN_multiInput.push(loInput);

			var lsFormElementId;
			var lsFormElementIdLabel;
			if (loModel.getProperty("/property/variablescreen")) {
				lsFormElementId = oControl.getId() + "-" +  that.createUI5Identifier(lCharName);
				lsFormElementIdLabel = lsFormElementId + "-label";
			}

			if(loModel.getProperty("/property/label")) { //DimensionName
				var loLabel = new sap.m.Label(lsFormElementIdLabel).bindProperty("text", {
					path: lCharPath,
					formatter : function(oCharacteristic) {
						return oCharacteristic.text;
					}
				});
				loLabel.bindProperty("tooltip", {
					path: lCharPath,
					formatter : function(oCharacteristic) {
						return oCharacteristic.text;
					}
				});
				loLabel.bindProperty("required", {
					path: lCharPath,
					formatter : function(oCharacteristic) {
						return oCharacteristic.mandatory;
					}
				});
			}
			
			var loFormElement = new sap.ui.layout.form.FormElement(lsFormElementId, {
				label: loLabel,
				fields: [loInput]
			});
			
			if (oControl.ZEN_IdToDimensionMap) {
				oControl.ZEN_IdToDimensionMap[loFormElement.getId()] = lCharName;
			}

			return loFormElement;
		};
	}

	/**
	 * Get Input Control
	 */
	function getInput(oModel, charName, charPath, oControl) {
		var loChar = getCharacteristicByName(oModel, charName);
		
		var lIsMeasureStructure = oModel.getProperty(charPath + "/measureStructure");
		var lType = oModel.getProperty(charPath + "/type");
		var lCompound = oModel.getProperty(charPath + "/compound");
		var lHierarchical = oModel.getProperty(charPath +"/hierarchical");
		var lMandatory = oModel.getProperty(charPath +"/mandatory");
		var lSingleOnly = oModel.getProperty(charPath +"/singleonly");
		var lIntervalAllowed = oModel.getProperty(charPath + "/intervalAllowed");
		var lRangeAllowed = oModel.getProperty(charPath + "/rangeAllowed");
		var lIncludingPatternAllowed = oModel.getProperty(charPath + "/includingPatternAllowed");
		var lExclusionAllowed = oModel.getProperty(charPath +"/exclusionAllowed");
		var lExcludingPatternAllowed = oModel.getProperty(charPath + "/excludingPatternAllowed");
		var lSupportsValueHelp = oModel.getProperty(charPath + "/supportsValueHelp");
		var lRequiresValueHelp = oModel.getProperty(charPath + "/requiresValueHelp");
	       
        // check if ValueHelp is available or required for setting conditions
        var lShowValueHelp = lSupportsValueHelp || lRequiresValueHelp;
       
        var loInput, lInputId;

		if (oModel.getProperty("/property/variablescreen")) {
			lInputId = oControl.getId() + "-" +  that.createUI5Identifier(charName) + "-input";
		}
        
        if ((lType === "DATE" && lSingleOnly && !lExclusionAllowed && !lRangeAllowed && !lHierarchical) || (lType === "TIME" && lSingleOnly && !lIntervalAllowed)) {
            if (lIntervalAllowed) {
                loInput = new sap.m.DateRangeSelection(lInputId, {
                    dateValue: {
                        path: "/filters",
                        mode : sap.ui.model.BindingMode.OneWay,
                        formatter: getFilterFormatter(charName, lType, oModel, "from")
                    },
                    secondDateValue: {
                        path: "/filters",
                        mode : sap.ui.model.BindingMode.OneWay,
                        formatter: getFilterFormatter(charName, lType, oModel, "to")
                    },
                    change: function (e) {
                        if (e.getParameter("valid")) {
                        	loInput.setValueState(sap.ui.core.ValueState.None);
                        	oControl.hasClientError = false;
                        	
                        	var lKeyFrom = e.getParameter("from") ? e.getParameter("from") : e.getParameter("to");
                        	var lKeyTo = e.getParameter("to") ? e.getParameter("to") : e.getParameter("from");
                        	
                        	var loRange = createRange(false, "BT", lKeyFrom, null, lKeyTo, null);
                        	var loToken = createTokenFromRange(oModel, charName, loChar, loRange);                            	
                        	var ltTokens = [];
        					ltTokens.push(loToken);
                        	
                        	applyTokensToFilter(loInput.getModel(), charName, ltTokens, false);
                        } else {
                        	loInput.setValueState(sap.ui.core.ValueState.Error);
                        	oControl.hasClientError = true;
                        	
                        	setOkButtonDisabledIfExists();
                        }
                    }
                });
            } else {
            	if (lType === "DATE") {
                    loInput = new sap.m.DatePicker(lInputId, {
                        valueFormat: "yyyyMMdd",
                        dateValue: {
                            path: "/filters",
                            mode : sap.ui.model.BindingMode.OneWay,
                            formatter: getFilterFormatter(charName, lType, oModel, "from")
                        },
                        change: function (e) {
                            if (e.getParameter("valid")) {
                            	loInput.setValueState(sap.ui.core.ValueState.None);
    							oControl.hasClientError = false;

    							var lKey = e.getParameter("value");

                            	var loRange = createRange(false, "EQ", lKey, null, null, null);
                            	var loToken = createTokenFromRange(oModel, charName, loChar, loRange);
                            	var ltTokens = [];
             					ltTokens.push(loToken);

                            	applyTokensToFilter(loInput.getModel(), charName, ltTokens, false);
                            } else {
                            	loInput.setValueState(sap.ui.core.ValueState.Error);
                            	oControl.hasClientError = true;
                            	
                            	setOkButtonDisabledIfExists();
                            }
                        }
                    });
            	} else if (lType === "TIME"){
                    loInput = new sap.m.TimePicker(lInputId, {
                        valueFormat: "HH:mm:ss",
                        dateValue: {
                            path: "/filters",
                            mode : sap.ui.model.BindingMode.OneWay,
                            formatter: getFilterFormatter(charName, lType, oModel, "from")
                        },
                        change: function (e) {
                            if (e.getParameter("valid")) {
                            	loInput.setValueState(sap.ui.core.ValueState.None);
                            	oControl.hasClientError = false;

                            	var lKey = e.getParameter("value");
                            	
                            	var loRange = createRange(false, "EQ", lKey, null, null, null);
                            	var loToken = createTokenFromRange(oModel, charName, loChar, loRange);
                            	var ltTokens = [];
                            	ltTokens.push(loToken);

                            	applyTokensToFilter(loInput.getModel(), charName, ltTokens, false);
                            } else {
                            	loInput.setValueState(sap.ui.core.ValueState.Error);
                            	oControl.hasClientError = true;
                            	
                            	setOkButtonDisabledIfExists();
                            }
                       }
                    });
            	}
            }
        } else {
            loInput = new sap.m.MultiInput(lInputId, {
                showValueHelp: lShowValueHelp,
                enableMultiLineMode: {
                    path: "/filters",
                    mode : sap.ui.model.BindingMode.OneWay,
                    formatter: applyFilterToTokens(oModel, charName)
                },
                
                // apply Token to Model
                tokenUpdate: function(e) {
                    if (e.getParameter("type") === sap.m.MultiInput.TokenChangeType.Removed) {
                       	var ltRemovedTokens = e.getParameter("removedTokens");
                       	
                    	// remove Removed Tokens from Token List
                    	var ltTokens = loInput.getTokens().filter(
                    			function(loInputToken) {
                    				return ltRemovedTokens.every(
                    						function(oRemovedToken) {
                    							return oRemovedToken !== loInputToken;
                    						});
                    			});
                    	//var ltTokens = loInput.getTokens().filter(loInputToken => ltRemovedTokens.every(oRemovedToken => oRemovedToken !== loInputToken));
                    	
                    	// apply Tokens to Filter
                    	applyTokensToFilter(loInput.getModel(), charName, ltTokens, false);
                    	
                    } else if (e.getParameter("type") === sap.m.MultiInput.TokenChangeType.Added) {                   	
                    	var ltAddedTokens = e.getParameter("addedTokens");
                    	
                    	// process Added Tokens
                    	if (this.oDesignStudio && this.oDesignStudio.tPastedTokens && this.oDesignStudio.tPastedTokens.length > 0) {
                        	for (var i = 0; i < ltAddedTokens.length; i++) {
                        		var loAddedToken = ltAddedTokens[i];
                        		if (!loAddedToken) {
                        			continue;
                        		}
                        		
                        		for (var j = 0; j < this.oDesignStudio.tPastedTokens.length; j++) {
                        			var loPastedToken = this.oDesignStudio.tPastedTokens[j];
                        			if (!loPastedToken) {
                        				continue;
                        			}
                        			
                        			if (loAddedToken.getText() === loPastedToken.getText()) {
                        				loAddedToken.setKey(loPastedToken.getKey());
                        				loAddedToken.setText(loPastedToken.getText());
                        				loAddedToken.setTooltip(loPastedToken.getTooltip());
                        				loAddedToken.data(loPastedToken.data());
                        				
                        				this.oDesignStudio.tPastedTokens.splice(i, 1);
                        				
                        				break;
                        			}
                        		}
                        	}
                    	}
                    	
                    	// remove Added Tokens from Token List
                    	var ltTokens = loInput.getTokens().filter(
                    			function(loInputToken) {
                    				return ltAddedTokens.every(
                    						function(oAddedToken) {
                    							return oAddedToken !== loInputToken;
                    						});
                    			});
                    	
                    	// add Added Tokens to Token List
                    	ltTokens = ltTokens.concat(ltAddedTokens);
                    	
                    	// apply Tokens to Filter
                    	applyTokensToFilter(loInput.getModel(), charName, ltTokens, true);
                    }
                } 
            });
            
            // validate input
            loInput.addValidator(function(e) {
        		// create Dummy Token for validation confirmation
        		var loToken = new sap.m.Token({
        			key: e.text,
        			text: e.text,
        			tooltip: e.text})
           	
            	return loToken;
            });
            
            // overwrite copy
            loInput._tokenizer._copy = function(e) {
				if (sap.m.Tokenizer.prototype._copy) {
					sap.m.Tokenizer.prototype._copy.apply(this, arguments);
				}
				
				if (!loInput.oDesignStudio) {
					loInput.oDesignStudio = {};
					loInput.oDesignStudio.tCopiedTokens = [];
					loInput.oDesignStudio.tPastedTokens = [];
				}
				
				// Shallow Copy the Selected Tokens
				var ltTokens = this.getSelectedTokens();
				for (var i = 0; i < ltTokens.length; i++) {
					var loToken = ltTokens[i];
					if (!loToken) {
						continue;
					}

					var loCopyToken = copyToken(loToken);
					loInput.oDesignStudio.tCopiedTokens.push(loCopyToken);
				}
			}
            
            // overwrite paste
            loInput.onpaste = function(e) {
				if (sap.m.MultiInput.prototype.onpaste) {
					sap.m.MultiInput.prototype.onpaste.apply(this, arguments);
				}
				
            	if (loInput.oDesignStudio && loInput.oDesignStudio.tCopiedTokens) {
    				loInput.oDesignStudio.tPastedTokens = loInput.oDesignStudio.tCopiedTokens;
    				loInput.oDesignStudio.tCopiedTokens = [];
            	}
			}
        }
        
		if (lShowValueHelp && loInput.attachValueHelpRequest) {
			var loFunctionValueHelp = function() {
				sap.ui.core.BusyIndicator.show(0);
				new Function(that.prepareCommand(oModel.getProperty("/command/showfilterdialog"), "__STRING__", charName))();
			};
			loInput.attachValueHelpRequest(loFunctionValueHelp);
		}
		
		loInput.addEventDelegate({
			onfocusin:function() {
				oControl.$().css("z-index", "1");
			},
			onfocusout:function() {
				oControl.$().css("z-index", "");
			}
		});

		return loInput;
	}
    
	/**
	 * Get Filter Formatter (handling of Date and Time)
	 */
    function getFilterFormatter(charName, type, oModel, fromTo) {
        return function(oFilters) {
            if (oFilters && charName && oFilters[charName]) {
                var loCharFilter = oFilters[charName];
                if (loCharFilter.ranges) {
                    var loRange = loCharFilter.ranges[0];
                    if (loRange) {
                        var loMember = loRange[fromTo];
                        if (loMember) {
                        	if (type === "DATE") {
                                return getDateFormat().parse(loMember.key);
                        	} else if (type === "TIME") {
                        		return getTimeFormat().parse(loMember.key);
                        	}
                        }
                    }
                }
            }
            
            return null;
        }
    }
    
    /**
     * Get Data Format Instance
     */
    function getDateFormat() {
        return sap.ui.core.format.DateFormat.getInstance({pattern: "yyyyMMdd", strictParsing: true});
    }
    
    /**
     * Get Time Format Instance
     */
    function getTimeFormat() {
        return sap.ui.core.format.DateFormat.getTimeInstance({pattern: "HH:mm:ss", strictParsing: true});
    }
	
	/**
	 * Transfer Filter to Tokens
	 */
	function applyFilterToTokens(oModel, charName) {
		return function(oAllFilters) {
			if (!oAllFilters || !charName || !oAllFilters[charName]) {
				this.setTokens([]);
				return true;
			}
								
			var ltTokens = [];
			
			var loCharFilters = oAllFilters[charName];
			if (loCharFilters && loCharFilters.ranges && loCharFilters.ranges.length > 0) {
				var loChar = getCharacteristicByName(oModel, charName);
                
				for (var i = 0; i < loCharFilters.ranges.length; i++) {
					var loRange = loCharFilters.ranges[i];
					if (!loRange) {
						continue;
					}
					
					var loToken = createTokenFromRange(oModel, charName, loChar, loRange);
					if (loToken) {
						ltTokens.push(loToken);
					}
				}
			}

			this.setTokens(ltTokens);
			return true;
		};
	}
	
	/**
	 * Transfer Tokens to Filter
	 */
	function applyTokensToFilter(oModel, charName, tTokens, displayKey) {
		var loChar = getCharacteristicByName(oModel, charName);

		var ltAllFilters = oModel.getProperty("/filters");
		var loCharFilters = null;
		if (ltAllFilters) {
			loCharFilters = ltAllFilters[charName];
		}
		
		if (loCharFilters) {
			loCharFilters.dirty = true;
			loCharFilters.input = [];
			loCharFilters.ranges = [];
			
			for (var i = 0; i < tTokens.length; i++) {
				var loToken = tTokens[i];
				if (!loToken) {
					continue;
				}
				
				var loRange = createRangeFromToken(oModel, charName, loChar, loToken);
				if (loRange) {
					// If Token was copied and pasted then it can be a range although occurring via direct input
			        var lIsRange = true;
					if (!loRange.exclude && (!loRange.operation || loRange.operation === "EQ")) {
						lIsRange = false;
					}
					
					if (displayKey && !lIsRange) {
						loCharFilters.input.push(loRange.from.key);
					} else {
						loCharFilters.ranges.push(loRange);
					}
				}
			}
		}
		
		var lPauseRefresh = oModel.getProperty("/property/pauserefresh");
		if (!lPauseRefresh) {			
			submitAll(oModel, !oModel.getProperty("/property/variablescreen"), !lPauseRefresh);
		} else {
			submitAll(oModel, false, !lPauseRefresh);			
		}
	}

	/**
	 * Create Token From Range
	 */
	function createTokenFromRange(oModel, charName, oChar, oRange) {
		if (!oRange || !oRange.from) {
			return null;
		}
		
		if (!oChar) {
			oChar = getCharacteristicByName(oModel, charName);
		}
		
		var lMemberDisplay = oModel.getProperty("/property/memberdisplay");
		
		var lDirectInputVariable;
        if (!oChar.supportsValueHelp) {
        	lDirectInputVariable = true;
        }
        
		var loFormat, loFormatter;
        if (oChar.type === "DATE") {
        	loFormat = getDateFormat();
        	loFormatter = sap.ui.core.format.DateFormat.getDateInstance();
        } else if (oChar.type === "TIME") {
        	loFormat = getTimeFormat();
        	loFormatter = sap.ui.core.format.DateFormat.getTimeInstance();
        }
        
        // determine if definition is a range or singular value
        var lIsRange = true;
		if (!oRange.exclude && (!oRange.operation || oRange.operation === "EQ")) {
			lIsRange = false;
		}
		if (loFormat) { // Date/Time-Picker need to be added as ranges for the condition Tab of Valuehelp to work
			lIsRange = true;
		}
        	
		// low value
		var lInternalKeyFrom, lKeyFrom, lTextFrom, loValueFrom;
		if (oRange.from) {
			lInternalKeyFrom = (oRange.from.key && oRange.from.key.length > 0) || !oRange.from.displaykey ? oRange.from.key : oRange.from.displaykey;
			lKeyFrom = (oRange.from.displaykey && oRange.from.displaykey.length > 0) || !oRange.from.key ? oRange.from.displaykey : lIsRange ? oRange.from.key : oRange.from.text;
	        if (loFormat) {
	        	lKeyFrom = lInternalKeyFrom;
	        	// Backend has simple formatted value - Token requires the correct internal value
	        	try {
		            if (lKeyFrom) {
		            	loValueFrom = loFormat.parse(lKeyFrom);
		            	if (!loValueFrom) {
		            		loValueFrom = lKeyFrom;
		            	}	            	
		            	lTextFrom = loFormatter.format(loValueFrom);
		            }
	        	} catch (e) {
	        		// do nothing
	        	}
	        } else {
				if (lDirectInputVariable || lKeyFrom === oRange.from.text) {
					lTextFrom = sap.ui.comp.util.FormatUtil.getFormattedExpressionFromDisplayBehaviour("idOnly", lKeyFrom);
				} else {
					lTextFrom = sap.ui.comp.util.FormatUtil.getFormattedExpressionFromDisplayBehaviour(getValueHelpDialogMemberDisplay(lMemberDisplay), lKeyFrom, oRange.from.text);
				}
	        }
	        if (!lTextFrom || lTextFrom.length <= 0) {
	        	lTextFrom = lKeyFrom;
	        }
		} else {
			lKeyFrom = "";
			lTextFrom = "";
		}
		
		// high value
		var lInternalKeyTo, lKeyTo, lTextTo, loValueTo;
		if (oRange.to) {
			lInternalKeyTo = (oRange.to.key && oRange.to.key.length > 0) || !oRange.to.displaykey ? oRange.to.key : oRange.to.displaykey;
			lKeyTo = (oRange.to.displaykey && oRange.to.displaykey.length > 0) || !oRange.to.key ? oRange.to.displaykey : lIsRange ? oRange.to.key : oRange.to.text;
	        if (loFormat) {
	        	lKeyTo = lInternalKeyTo;
	        	// Backend has simple formatted value - Token requires the correct internal value
	        	try {
		            if (lKeyTo) {
		            	loValueTo = loFormat.parse(lKeyTo);
		            	if (!loValueTo) {
		            		loValueTo = lKeyTo;
		            	}
		            	lTextTo = loFormatter.format(loValueTo);
		            }
	        	} catch (e) {
	        		// do nothing
	        	}
	        } else {
				if (lDirectInputVariable || lKeyTo === oRange.to.text) {
					lTextTo = sap.ui.comp.util.FormatUtil.getFormattedExpressionFromDisplayBehaviour("idOnly", lKeyTo);
				} else {
					lTextTo = sap.ui.comp.util.FormatUtil.getFormattedExpressionFromDisplayBehaviour(getValueHelpDialogMemberDisplay(lMemberDisplay), lKeyTo, oRange.to.text);
				}
	        }
	        if (!lTextTo || lTextTo.length <= 0) {
	        	lTextTo = lKeyTo;
	        }
		} else {
			lKeyTo = "";
			lTextTo = "";
		}
		
		// prepare Token
        var lTokenType = null;
		var lOperation = oRange.operation ? oRange.operation : "EQ";						
		var lExclude = oRange.exclude ? true : false;
		var lKeyField = "key";
        var lKey = null;
        var lText = null;
		if (!lIsRange) {
			lTokenType = "input";
			lKey = lInternalKeyFrom;
			lText = lTextFrom;
		} else {
			lTokenType = "range"
			lKey = "range" + "_" + lExclude + "_" + lOperation + "_" + lKeyFrom + "_" + lKeyTo;
			lText = ValueHelpDialog.prototype._getFormattedRangeTokenText(lOperation, lTextFrom, lTextTo, lExclude, lKeyField);						
		}
        
		// create Token
		var loToken = new sap.m.Token({
			key: lKey,
			text: lText,
			tooltip: lText})
		loToken.data(lTokenType, {
			"exclude": lExclude,
			"operation": lOperation,
			"keyField": lKeyField,
			"value1": loValueFrom ? loValueFrom : lKeyFrom,
			"textFrom": lTextFrom,
			"value2": loValueTo ? loValueTo : lKeyTo,
			"textTo": lTextTo});
		
		return loToken;
	}
	
	/**
	 * Copy Token
	 */
	function copyToken(oToken) {
		if (!oToken) {
			return null;
		}
		
		var loToken = new sap.m.Token({
			key: oToken.getKey(),
			text: oToken.getText(),
			tooltip: oToken.getTooltip()
		});
		
		loToken.data(oToken.data());
		
		return loToken;
	}
	
	/**
	 * Create Range from Token
	 */
	function createRangeFromToken(oModel, charName, oChar, oToken) {
		if (!oToken) {
			return null;
		}
		
		if (!oChar) {
			oChar = getCharacteristicByName(oModel, charName);
		}
		
		var lExclude = null;
		var lOperation = null;
		var lKeyFrom = oToken.getKey();
		var lTextFrom = oToken.getText();
		var lKeyTo = null;
		var lTextTo = null;
		var lLongKey = oToken.data("longKey");
		
		var lIsRange = false;
		if (oToken.data("range")) {			
			var loTokenRange = oToken.data("range");
            
			lExclude = loTokenRange.exclude;
			lOperation = loTokenRange.operation;
			
			lKeyFrom = loTokenRange.value1;
			lTextFrom = loTokenRange.textFrom;
			
			lKeyTo = loTokenRange.value2;
			lTextTo = loTokenRange.textTo;
			
			lIsRange = true;
		} else {
			if (lLongKey) {
				lKeyFrom = lLongKey;
			}
		}
			
		var loFormat = null;
		
		// lower bound value
        if (lKeyFrom) {
            if (oChar.type === "DATE") {
            	// Token has the correct internal value - Backend requires simple formatted value (DisplayKey Backend)
            	loFormat = getDateFormat();
            	if (lKeyFrom.getDate) {
            		lKeyFrom = loFormat.format(lKeyFrom); // internal > external (DisplayKey Backend)
            	}
            } else if (oChar.type === "TIME") {
            	// Token has the correct internal value - Backend requires simple formatted value (DisplayKey Backend)
            	loFormat = getTimeFormat();
            	if (lKeyFrom.getTime) {
                	lKeyFrom = loFormat.format(lKeyFrom); // internal > external (DisplayKey Backend)
            	}
            }
        }
			
		// upper bound value
		if (lKeyTo) {
			if (oChar.type === "DATE") {
             	// Token has the correct internal value - Backend requires simple formatted value (DisplayKey Backend)
				if (!loFormat) {
					loFormat = getDateFormat();
               }
	           	if (lKeyTo.getDate) {
	           		lKeyTo = loFormat.format(lKeyTo); // internal > external (DisplayKey Backend)
	           	}
            } else if (oChar.type === "TIME") {
             	// Token has the correct internal value - Backend requires simple formatted value (DisplayKey Backend)
				if (!loFormat) {
					loFormat = getTimeFormat();
                }
	           	if (lKeyTo.getTime) {
    				lKeyTo = loFormat.format(lKeyTo); // internal > external (DisplayKey Backend)
            	}
            }
		}
		
		var loRange = createRange(lExclude, lOperation, lKeyFrom, lTextFrom, lKeyTo, lTextTo);
		return loRange;
	}
	
	/**
	 * Create Range
	 */
	function createRange(exclude, operation, keyFrom, textFrom, keyTo, textTo) {
		if (!keyFrom) {
			return null;
		}
		
		var loRange = {};
		
		if (exclude) {
			loRange.exclude = exclude;
		}
		
		if (operation) {
			loRange.operation = operation;
		}
		
		if (keyFrom) {
			loRange.from = {};
			loRange.from.key = keyFrom;
			if (textFrom) {
				loRange.from.text = textFrom;
			}
		}
		
		if (keyTo) {
			loRange.to = {};
			loRange.to.key = keyTo;
			if (textTo) {
				loRange.to.text = textTo;
			}
		}
		
		return loRange;
	}
	
	/**
	 * Submit Model to Backend
	 */
	function submitExternal(oModel, submit, executeOnApply) {
		return function(sToReplace, sLongReplaceTarget) {
			return submitAll(oModel, submit, executeOnApply, sToReplace, sLongReplaceTarget);
		};
	}
	
	/**
	 * Submit Model to Backend
	 */
	function submitAll(oModel, submit, executeOnApply, sToReplace, sLongReplaceTarget) {
		var ltFilters = [];
		
		var ltModelFilters = oModel.getProperty("/filters");
		if (ltModelFilters) {
			for (var lCharName in ltModelFilters) {
				var loModelCharFilter = ltModelFilters[lCharName];
				if (!loModelCharFilter) {
					continue;
				}
				
				if (loModelCharFilter.dirty) {
					var loChar = getCharacteristicByName(oModel, lCharName);
					loModelCharFilter.dirty = !oModel.getProperty("/property/variablescreen") && !submit;
					
					var loCharFilter = {};
					loCharFilter.name = lCharName;
					if (loModelCharFilter.input !== undefined && loModelCharFilter.input !== null) {
						loCharFilter.input = [];
						if ((Array && Array.isArray(loModelCharFilter.input)) || (typeof loModelCharFilter.input === "object" && loModelCharFilter.input.constructor === Array)) {
							loCharFilter.input = loModelCharFilter.input;
						} else {
							loCharFilter.input.push(loModelCharFilter.input);
						}
					}
					loCharFilter.ranges = [];
					ltFilters.push(loCharFilter);				
					
					var lLength = loModelCharFilter.ranges.length;
					for (var i = 0; i < lLength; i++) {
						var loRange = loModelCharFilter.ranges[i];
						if (!loRange) {
							continue;
						}
						
						var loRangeToSend = {};
						if (loChar.type !== "DATE" && loRange.operation && loRange.operation !== "EQ" && !loRange.exclude && loRange.from.displaykey) {
							loRangeToSend.from = loRange.from.displaykey;
						} else {
							loRangeToSend.from = loRange.from.key;
						}
						if (loChar.type !== "DATE" && loRange.to && loRange.to.displaykey) {
							loRangeToSend.to = loRange.to.displaykey;
						} else if (loRange.to) {
	                        loRangeToSend.to = loRange.to.key;
	                    }
						//no operation means "EQ"
						if (loRange.operation && loRange.operation !== "EQ") {
							loRangeToSend.operation = loRange.operation;
						}
						if (loRange.exclude) {
							loRangeToSend.exclude = true;
						}
						
						loCharFilter.ranges.push(loRangeToSend);
					}
				}
			}
		}

		var ltCharacteristics = oModel.getProperty("/characteristics");
		if (ltCharacteristics) {
			var loAxis;
			for (var i = 0; i < ltCharacteristics.length; i++) {
				var loCharacteristic = ltCharacteristics[i];
				if (!loCharacteristic) {
					continue;
				}
				
				if (loCharacteristic.characteristic.axisdirty) {
					if (!loAxis) {
						loAxis = oModel.getProperty("/axis");
					}
					loCharacteristic.characteristic.axisdirty = !submit;
				}
			}
			if (!loAxis && (oModel.getProperty("/axis/rows/dirty") || oModel.getProperty("/axis/columns/dirty"))) {
				loAxis = oModel.getProperty("/axis");
			}
	
			if (submit && loAxis) {
				oModel.setProperty("/axis/rows/dirty", undefined);
				oModel.setProperty("/axis/columns/dirty", undefined);
			}
			
			var lIsVariableScreen = oModel.getProperty("/property/variablescreen");
			if (loAxis || ltFilters.length > 0 || (lIsVariableScreen && submit)) {
				if (lIsVariableScreen) {
					sap.zen.MessageViewHandler.clearMessages();
				}
				
				if (!loAxis) {
					loAxis = {};
				}
				
				var loSubmitJson = {
					filters : ltFilters,
					axis : loAxis
				};
				
				if (sToReplace && sLongReplaceTarget) {
					//__STRING____FILTERBAR_13FBDIM
					var lMethod = that.prepareCommand(sLongReplaceTarget, sToReplace, JSON.stringify(loSubmitJson));
					return lMethod;
				} else {
					lMethod = that.prepareCommand(oModel.getProperty(executeOnApply ? "/command/submitfilter" : "/command/submitonlyfilter"), "__STRING__", JSON.stringify(loSubmitJson));
					lMethod = that.prepareCommand(lMethod, "__BOOLEAN__", submit ? "X" : " ");
					new Function(lMethod)();
				}
			}
		}
	}

	/**
	 * Create the ValueHelp Dialog for a Characteristic
	 */
	function getValueHelpDialog(oControl) {
		var loModel = oControl.getModel();
		var lCharName = loModel.getProperty("/dialog/name");
		var loChar = getCharacteristicByName(loModel, lCharName);
		
		var lDestroyFilterDialogCmd = loModel.getProperty("/command/destroyfilterdialog");
		
		var lMaxChildIndex = -1;
		
		var lIsMeasureStructure = loModel.getProperty("/dialog/measureStructure");
		var lType = loModel.getProperty("/dialog/type");
		var lCompound = loModel.getProperty("/dialog/compound");
		var lHierarchical = loModel.getProperty("/dialog/hierarchical");
		var lMandatory = loModel.getProperty("/dialog/mandatory");
		var lSingleOnly = loModel.getProperty("/dialog/singleonly");
		var lIntervalAllowed = loModel.getProperty("/dialog/intervalAllowed");
		var lRangeAllowed = loModel.getProperty("/dialog/rangeAllowed");
		var lIncludingPatternAllowed = loModel.getProperty("/dialog/includingPatternAllowed");
		var lExclusionAllowed = loModel.getProperty("/dialog/exclusionAllowed");
		var lExcludingPatternAllowed = loModel.getProperty("/dialog/excludingPatternAllowed");
		var lSupportsValueHelp = loModel.getProperty("/dialog/supportsValueHelp");
		var lRequiresValueHelp = loModel.getProperty("/dialog/requiresValueHelp");
		
		var lMemberType = loModel.getProperty("/dialog/membertype");
		var lRangesVisible = loModel.getProperty("/dialog/range/visible");
		
		var loValueHelpDialog = new ValueHelpDialog({
			//basicSearchText: this.theTokenInput.getValue(),
			title: "{/dialog/title}",
			supportMultiselect: !lSingleOnly,
			supportRanges: lRangesVisible || lExclusionAllowed,
			supportRangesOnly: lMemberType === "DATE" || !lSupportsValueHelp,
			key: "key",
			descriptionKey: lCompound ? "" : "text",
	
			ok: function(e) {
				var ltTokens = e.getParameter("tokens");
				applyTokensToFilter(loModel, lCharName, ltTokens, false);
				oControl.zenValueHelpDialog = null;
				new Function(that.prepareCommand(lDestroyFilterDialogCmd, "__BOOLEAN__", " "))();
				loValueHelpDialog.close();
			},
	
			cancel: function() {
				oControl.zenValueHelpDialog = null;
				new Function(that.prepareCommand(lDestroyFilterDialogCmd, "__BOOLEAN__", "X"))();
				loValueHelpDialog.close();
			},
	
			afterClose: function() {
				if (oControl.zenValueHelpDialog) {
	                oControl.zenValueHelpDialog = null;
					new Function(that.prepareCommand(lDestroyFilterDialogCmd, "__BOOLEAN__", "X"))();
				}
				loValueHelpDialog.destroy();
			},
	
			afterOpen: function () {
				sap.ui.core.BusyIndicator.hide();
			}
		});
		if (lHierarchical) {
			loValueHelpDialog.setTable(new sap.ui.table.TreeTable());
		}
	
		// Set Include Range Operations
		if (lRangesVisible) {
			var ltIncludeOperations = [];
			
			ltIncludeOperations.push(sap.zen.ValueHelpRangeOperation.BT);
			// never allow EQ in the Conditions Tab since single values are passed down as internal key instead of display key
			/*if (!lSupportsValueHelp) {
				ltIncludeOperations.push(sap.zen.ValueHelpRangeOperation.EQ);
			}*/
			
			if (lSingleOnly) {
				loValueHelpDialog.setMaxIncludeRanges("1");
			} else {
				if (lRangeAllowed) {
					ltIncludeOperations.push(sap.zen.ValueHelpRangeOperation.LT);
					ltIncludeOperations.push(sap.zen.ValueHelpRangeOperation.LE);
					ltIncludeOperations.push(sap.zen.ValueHelpRangeOperation.GT);
					ltIncludeOperations.push(sap.zen.ValueHelpRangeOperation.GE);
					if (lIncludingPatternAllowed) {
						ltIncludeOperations.push(sap.zen.ValueHelpRangeOperation.Contains);
						ltIncludeOperations.push(sap.zen.ValueHelpRangeOperation.StartsWith);
						ltIncludeOperations.push(sap.zen.ValueHelpRangeOperation.EndsWith);
					}
				} else if (lIntervalAllowed) {
					loValueHelpDialog.setMaxIncludeRanges("1");
				} 
			}
			
			loValueHelpDialog.setIncludeRangeOperations(ltIncludeOperations);
		} else {
			loValueHelpDialog.setMaxIncludeRanges("0");
		}
		
		// Set Exclude Range Operations
		if (lExclusionAllowed) {
			var ltExcludeOperations = [];
			
			ltExcludeOperations.push(sap.zen.ValueHelpRangeOperation.EQ);
			
			if (lRangesVisible) {
				ltExcludeOperations.push(sap.zen.ValueHelpRangeOperation.BT);
			}
			
			if (lSingleOnly) {
				loValueHelpDialog.setMaxExcludeRanges("1");
			} else {			
				if (lRangeAllowed) {
					ltExcludeOperations.push(sap.zen.ValueHelpRangeOperation.LT);
					ltExcludeOperations.push(sap.zen.ValueHelpRangeOperation.LE);
					ltExcludeOperations.push(sap.zen.ValueHelpRangeOperation.GT);
					ltExcludeOperations.push(sap.zen.ValueHelpRangeOperation.GE);
					if (lExcludingPatternAllowed) {
						ltExcludeOperations.push(sap.zen.ValueHelpRangeOperation.Contains);
						ltExcludeOperations.push(sap.zen.ValueHelpRangeOperation.StartsWith);
						ltExcludeOperations.push(sap.zen.ValueHelpRangeOperation.EndsWith);
					}
				} else if (lIntervalAllowed) {
					loValueHelpDialog.setMaxExcludeRanges("1");
				}
			}
			
			loValueHelpDialog.setExcludeRangeOperations(ltExcludeOperations);
		} else {
			loValueHelpDialog.setMaxExcludeRanges("0");
		}
	
		var loTable = loValueHelpDialog.getTable();
		if (lHierarchical && loTable.attachToggleOpenState) {
			var lDialogUpdate;
			loTable.attachToggleOpenState(function(e) {
				var loParams = e.getParameters();
				loValueHelpDialog._bIgnoreSelectionChange = true;
				if (loParams.expanded) {
					var loBindingContext = loParams.rowContext;
					var loModel = loBindingContext.oModel;
					if (loModel.getProperty(loBindingContext.sPath + "/0/node")) {
						var lMethod = that.prepareCommand(loModel
								.getProperty("/command/expandnode"), "__STRING__", loModel
								.getProperty(loBindingContext.sPath + "/key"));
						lMethod = that.prepareCommand(lMethod, "__STRING2__",
								loBindingContext.sPath);
						new Function(lMethod)();
					} else {
						loValueHelpDialog.update();
					}
				}
			});
			
			var lFuncOnClick = loTable.onclick;
			loTable.onclick = function() {
				if (lFuncOnClick) {
					lFuncOnClick.apply(loTable, arguments);
				}
				loValueHelpDialog._bIgnoreSelectionChange = false;
				if (lDialogUpdate) {
					oControl.zenValueHelpDialog.update();
					lDialogUpdate = false;
				}
			};
			
			loValueHelpDialog.attachTokenRemove(function (e) {
				var ltTokenKeys = e.getParameters().tokenKeys;
				if (ltTokenKeys && ltTokenKeys.length > 0) {
					var ltContexts = loTable.getBinding("rows").getContexts(0);
					if (ltContexts && ltContexts.length > 0) {
						for (var i = 0; i < ltTokenKeys.length; i++) {
							var lKey = ltTokenKeys[i];
							if (!lKey) {
								continue;
							}
							
							for (var j = 0; j < ltContexts.length; j++) {
								var loContext = ltContexts[j];
								if (!loContext) {
									continue;
								}
								
								var loRow = loContext.getObject();
								if (loRow["key"] === lKey) {
									loTable.removeSelectionInterval(j, j);
									uncheckChildMembers(loRow, loValueHelpDialog);
									loValueHelpDialog.update();
								}
							}
						}
					}
				}
			});
			
			loValueHelpDialog.attachUpdateSelection(function (e) {
				loTable.clearSelection();
				var ltTokenKeys = e.getParameters().tokenKeys;
				if (ltTokenKeys && ltTokenKeys.length > 0) {
					var ltContexts = loTable.getBinding("rows").getContexts(0);
					if (ltContexts && ltContexts.length > 0) {
						for (var i = 0; i < ltTokenKeys.length; i++) {
							var lKey = ltTokenKeys[i];
							if (!lKey) {
								continue;
							}
							
							var lLevel = null;
							for (var j = 0; j < ltContexts.length; j++) {
								var loContext = ltContexts[j];
								if (!loContext) {
									continue;
								}
								
								var oRow = loContext.getObject();
								if (lLevel !== null) {
									//is child of a selected member
									if (lLevel < oRow.lLevel) {
										loTable.addSelectionInterval(j, j);
									} else {
										lLevel = null;
									}
								} else if (oRow["key"] === lKey) {
									this._oSelectedItems.add(oRow["key"], oRow);
									loTable.addSelectionInterval(j, j);
									lLevel = oRow.lLevel;
								}
							}
						}
					}
				}
			});
			
			loValueHelpDialog.attachSelectionChange(function(e) {
				// collect all the new selected or removed items
				var loRowsBinding = loTable.getBinding("rows");
				
				var lUsePath = false;
				if (loRowsBinding.aKeys) {
					lUsePath = true;
				}
				
				var ltIndices = e.getParameter("tableSelectionParams").rowIndices;
				
				var lCheckAllIsClicked = e.getParameter("tableSelectionParams").selectAll && !loValueHelpDialog.getFilterBar().ZEN_searchValue;
				if (lCheckAllIsClicked && ltIndices.length) {
					loValueHelpDialog._oSelectedTokens.removeAllTokens();
					
					for (var lRangeKey in loValueHelpDialog._oSelectedRanges) {
						loValueHelpDialog._removeRangeByKey(lRangeKey, false);
					}
		
					loValueHelpDialog._oSelectedItems.removeAll();
				}
				
				//ZEN in case of single selection destroy all selections first
				if (!this.getSupportMultiselect()) {//ZEN
					this._oSelectedTokens.destroyTokens();//ZEN
					this._oSelectedItems.removeAll();//ZEN
				}//ZEN
	
				for (var i = 0; i < ltIndices.length; i++) {
					var lIndex = ltIndices[i];
					
					var loContext = loTable.getContextByIndex(lIndex);
					var loRow = loContext ? loContext.getObject() : null;
	
					if (loRow) {
						var lKey;
						if (lUsePath) {
							lKey = loContext.sPath.substring(1);
						} else {
							lKey = loRow["key"];
						}
	
						if (loTable.isIndexSelected(lIndex) || lCheckAllIsClicked) {
							if (!lCheckAllIsClicked || !loRow.level) {
								uncheckChildMembers(loRow, loValueHelpDialog);
								loValueHelpDialog._oSelectedItems.add(lKey, loRow);
								loValueHelpDialog._addToken2Tokenizer(lKey, loValueHelpDialog._getFormattedTokenText(lKey), loValueHelpDialog._oSelectedTokens);
							}
						} else {
							loValueHelpDialog._oSelectedItems.remove(lKey);
							var lInSelectionState = loValueHelpDialog._removeTokenFromTokenizer(lKey, loValueHelpDialog._oSelectedTokens);
							removeSelectionInTree(loRow, loContext.sPath, lInSelectionState, loValueHelpDialog);
						}
					}
				}
				
				loValueHelpDialog.update();
			});
		}
	
		var loColModel = new sap.ui.model.json.JSONModel();
		var lMemberDisplay = loModel.getProperty("/property/memberdisplay");
		loValueHelpDialog.setTokenDisplayBehaviour(getValueHelpDialogMemberDisplay(lMemberDisplay));
		if (lMemberDisplay === "KEY") {
			loColModel.setData({
				cols: [
				      	{label: loModel.getProperty("/text/key"), template: "displaykey"}
				      ]
			});
		} else if (lMemberDisplay === "TEXT") {
			loColModel.setData({
				cols: [
				      	{label: loModel.getProperty("/text/text"), template: "text"}
				      ]
			});
		} else if (lMemberDisplay === "KEY_TEXT") {
			loColModel.setData({
				cols: [
				      	{label: loModel.getProperty("/text/key"), template: "displaykey"},
				      	{label: loModel.getProperty("/text/text"), template: "text"}
				      ]
			});
		} else if (lMemberDisplay === "TEXT_KEY") {
			loColModel.setData({
				cols: [
				      	{label: loModel.getProperty("/text/text"), template: "text"},
				        {label: loModel.getProperty("/text/key"), template: "displaykey"}
				      ]
			});
		}
		loTable.setModel(loColModel, "columns");
	
	    var loRangeKeyField = {label: loModel.getProperty("/text/key"), key: "key"};
	    if ((lRangesVisible || lExclusionAllowed)) {
	        if (lMemberType === "DATE") {
	            loRangeKeyField.type = "date";
	        } else if (lMemberType === "TIME") {
	            loRangeKeyField.type = "time";
	        }
	    }
		loValueHelpDialog.setRangeKeyFields([loRangeKeyField]);
	
		loValueHelpDialog.setModel(loModel);
		loTable.bindRows("/dialog/members");
	
		if (oControl.$().closest(".sapUiSizeCompact").length > 0) { // check if runs in Compact mode
			loValueHelpDialog.addStyleClass("sapUiSizeCompact");
		}
		applyFilterToTokens(loModel, loModel.getProperty("/dialog/name")).call(loValueHelpDialog, loModel.getProperty("/filters"));
				
		var loSearchField = new sap.m.SearchField({
			width: "95%",
			placeholder:"{/text/search}"}
		);
		
		var loMembers;
		var lLength;
		if (lHierarchical) {
			loMembers = loModel.getProperty("/dialog/members");
			if (loMembers) {
				for (var i = 0; i === lMaxChildIndex+1; i++) {
					var loChild = loMembers[""+i];
					if (!loChild) {
						continue;
					}
					
					loChild.level = 0;
					lMaxChildIndex = i;
				}
			}
		}
		
		if (!loModel.getProperty("/dialog/nosearch") && (loModel.getProperty("/dialog/selection/maxelements") || lHierarchical)) {
			loSearchField.setBusyIndicatorDelay(0);
			loValueHelpDialog.TableStateSearchData();
			loSearchField.attachSearch(function(e) {
				loSearchField.setBusy(true);
				loValueHelpDialog.TableStateDataSearching();
				var lValue = e.getParameters().query;
				loSearchField.ZEN_searchValue = lValue;
				new Function(that.prepareCommand(loModel
						.getProperty("/command/membersearch"),
						"__STRING__", lValue))();
			});
		} else {
			loMembers = loModel.getProperty("/dialog/members");
			if (loMembers) {
				for (var i = 0; i < loMembers.length; i++) {
					var loMember = loMembers[i];
					if (!loMember) {
						continue;
					}
					
					var lSearchString = "";
					if (lMemberDisplay !== "KEY") {
						lSearchString += loMember.text;
					}
					if (lMemberDisplay !== "TEXT") {
						if (lSearchString) {
							lSearchString += " ";
						}
						lSearchString += loMember.displaykey;
					}
					loMember.searchstring = lSearchString;
				}
			}
			
			loSearchField.setShowSearchButton(false);
			loSearchField.attachLiveChange(function(e) {
				var loValue1 = e.getParameters().newValue ? e.getParameters().newValue.toUpperCase() : "";
				var ltCharsToEscape = [ "\\\\", "\\^", "\\$", "\\+", "\\.", "\\(", "\\)", "\\[", "\\]", "\\{", "\\}" ];
				
				for (var i = 0; i < ltCharsToEscape.length; i++) {
					var lChar = ltCharsToEscape[i];
					if (!lChar) {
						continue;
					}
					
					loValue1 = loValue1.replace(new RegExp(lChar, "g"), lChar);
				}
				
				loValue1 = loValue1.replace(/\?/g, ".").replace(/\*/g, ".*?");
				var loFilter = new sap.ui.model.Filter("searchstring", "Wildcard", loValue1);
				loFilter.fnTest = function(value) {
					return value.search(new RegExp(loValue1)) !== -1;
				};
				if (!loModel.getProperty("/dialog/selection/maxelements")
						&& !loModel.getProperty("/dialog/hierarchical")) {
					loValueHelpDialog._bIgnoreSelectionChange = true;
					loValueHelpDialog.getTable().getBinding("rows").filter([ loFilter ]);
					loValueHelpDialog._bIgnoreSelectionChange = false;
					loValueHelpDialog.update();
				}
			});
			loValueHelpDialog.TableStateDataFilled();
		}
		loValueHelpDialog.setFilterBar(loSearchField);
		
		return loValueHelpDialog;
	}
	
	/**
	 * Get MemberDispay Mode
	 */
	function getValueHelpDialogMemberDisplay(memberDisplay) {
		switch (memberDisplay) {
			case "TEXT_KEY":
				return "descriptionAndId";
			case "KEY_TEXT":
				return "idAndDescription";
			case "TEXT":
				return "descriptionOnly";
            default:
			    return "idOnly";
		}
	}
	
	/**
	 * Change Axis
	 */
	function changeAxis(oModel, charPath, newAxis) {
		var lOldAxis = oModel.getProperty(charPath + "/axis");
		if (lOldAxis === newAxis) {
			return;
		}
		
		var loChar = oModel.getProperty(charPath);
		
		oModel.setProperty(charPath + "/axisdirty", true);
		oModel.setProperty(charPath + "/axis", newAxis);
		
		// We now change the axis array
		var ltAxisDims;
		if (lOldAxis !== "FREE") {
			ltAxisDims = oModel.getProperty("/axis/" + lOldAxis.toLowerCase());
			for (var i = 0; i < ltAxisDims.length; i++) {
				var lAxisDim = ltAxisDims[i].entry.name;
				if (lAxisDim === loChar.name) {
					lAxisDim.splice(i, 1);
					break;
				}
			}
			oModel.setProperty("/axis/" + lOldAxis.toLowerCase(), ltAxisDims);
		}
		if (newAxis !== "FREE") {
			// Insert into new Axis
			ltAxisDims = oModel.getProperty("/axis/" + newAxis.toLowerCase());
			ltAxisDims.push({
				entry : {
					name : loChar.name,
					text: loChar.text
				}
			});
			oModel.setProperty("/axis/" + newAxis.toLowerCase(), ltAxisDims);
		}
		
		if (lOldAxis === "FREE" || newAxis === "FREE") {
			refreshFreeAxis(oModel);
		}
		
		if (!oModel.getProperty("/property/pauserefresh")) {
			submitAll(oModel, true, true);
		}
	}
	
	/**
	 * get the Technical Name of a Variable
	 */
	function getVariableTechnicalName(varName) {
		//this technical name recognition works only in S4 mode!!!
		return varName.substring(varName.indexOf(":")+1, varName.length);
	}
	
	/**
	 * Get Settings Button
	 */
	function getSettingsButton(oControl, oSearchField) {
		var loModel = oControl.getModel();
		
		return new sap.m.Button({
			icon: "sap-icon://action-settings",
			press: function () {
				var loDialog = new sap.m.SelectDialog({
					items:{
						path:  "/characteristics",
						template: new sap.m.StandardListItem({
							title: "{characteristic/text}",
							selected: {
								path: "/visibleprompts",
								formatter: function(tVisiblePrompts) {
									var lVarTechName = getVariableTechnicalName(this.getBindingContext().getProperty("characteristic/name"));
									for (var i = 0; i < tVisiblePrompts.length; i++) {
										if (tVisiblePrompts[i] === lVarTechName) {
											return true;
										}
									}
									return false;
								}
							}
						}),
						filters: [getFilterExcludeMandatory()],
						sorter: new sap.ui.model.Sorter({
							path: "characteristic/text"
						})
					},
					//0 === always all of them.
					growingThreshold: 0,
					multiSelect: true,
					liveChange: function(oEvent) {
						var loFilter = new sap.ui.model.Filter("characteristic/text", sap.ui.model.FilterOperator.Contains, oEvent.getParameter("value"));
						oEvent.getParameter("itemsBinding").filter([ getFilterExcludeMandatory(), loFilter ]);
					},
					cancel: function() {
						loDialog.destroy();
					},
					confirm: function(oEvent) {
						var ltVisiblePrompts = [];
						var ltSelectedContexts = oEvent.getParameter("selectedContexts");
						for (var i = 0; i < ltSelectedContexts.length; i++) {
							var loSelectedContext = ltSelectedContexts[i];
							if (!loSelectedContext) {
								continue;
							}
							
							var lVarName = loSelectedContext.getProperty("characteristic/name");
							var lVarTechName = lVarName.substring(lVarName.indexOf(":")+1, lVarName.length);
							ltVisiblePrompts.push(lVarTechName);
						}
						loModel.setProperty("/visibleprompts", ltVisiblePrompts);
						
						oSearchField.setValue("");
						oControl.ZENCharLists[0].getBinding("formElements").filter([getFilterForVisibleVariables(ltVisiblePrompts)]);
						new Function(that.prepareCommand(loModel.getProperty("/command/setvisibleprompts"), "__ARRAY__", JSON.stringify(ltVisiblePrompts)))();
					}
				});
				loDialog.setModel(loModel);
				loDialog.open();
			}
		});
	}
	
	/**
	 * 
	 */
	function getFilterExcludeMandatory() {
		return new sap.ui.model.Filter({
			path: "characteristic",
			test: function(oVar) {
				return oVar.mandatory ? false : true;
			}
		});
	}
	
	/**
	 * 
	 */
	function getFilterForVisibleVariables(tVisiblePrompts) {
		return new sap.ui.model.Filter({
			path: "characteristic",
			test: function(oVar) {
				if (oVar.mandatory) {
					return true;
				}
				var lVarTechName = getVariableTechnicalName(oVar.name);
				for (var i = 0; i < tVisiblePrompts.length; i++) {
					if (tVisiblePrompts[i] === lVarTechName) {
						return true;
					}
				}
				return false;
			}
		});
	}
	
	/**
	 * 
	 */
	function getPathForCharName(oModel, charName) {
		var ltCharacteristics = oModel.getProperty("/characteristics");
		if (ltCharacteristics) {
			for (var i = 0; i < ltCharacteristics.length; i++) {
				var loCharacteristic = ltCharacteristics[i].characteristic;
				if (!loCharacteristic) {
					continue;
				}
				
				if (loCharacteristic.name === charName) {
					return "/characteristics/"+i+"/characteristic";
				}
			}
		}
	}
	
	/**
	 * 
	 */
	function resetFilterOnLists(oControl) {
		var ltCharLists = oControl.ZENCharLists;
		for (var i = 0; i < ltCharLists.length; i++) {
			var loBinding = ltCharLists[i].getBinding("items");
			if (!loBinding) {
				continue;
			}
			
			var ltFilters = loBinding.aFilters;
			if (ltFilters && ltFilters.length > 0) {
				oBinding.filter([]);
				oBinding.filter(ltFilters);
			}
		}
	}

	/**
	 * 
	 */
	function setOkButtonDisabledIfExists() {
		var ltElements = document.getElementsByClassName("zenDialogOkButton");
		if (ltElements && ltElements.length) {
			var loUI5Element = sap.ui.getCore().byId(ltElements[0].id);
			if (loUI5Element) {
				loUI5Element.setEnabled(false);
			}
		}
	}
	
	/**
	 * Compare to Arrays
	 */
	function isCharListEqual(tCharacteristics1, tCharacteristics2) {
		if ((!tCharacteristics1 && tCharacteristics2) || (tCharacteristics1 && !tCharacteristics2)) {
			return false;
		}
		
		if (tCharacteristics1 && tCharacteristics2) {
			if (tCharacteristics1.length !== tCharacteristics2.length) {
				return false;
			}
			
			for (var i = 0; i < tCharacteristics1.length; i++) {
				var loCharacteristic1 = tCharacteristics1[i].characteristic;
				var loCharacteristic2 = tCharacteristics2[i].characteristic;
				if (!loCharacteristic1 || !loCharacteristic2) {
					continue;
				}
				
				if (loCharacteristic1.name !== loCharacteristic2.name || loCharacteristic1.axis !== loCharacteristic2.axis) {
					return false;
				}
			}
		}
		
		return true;
	}
	
	/**
	 * isDesignModeD4LIncluded
	 */
	this.isDesignModeD4LIncluded = function(){
		return sap.zen.designmode;
	};

	/**
	 * Force Model Update
	 */
	function forceModelUpdate(oModel, path) {
		var ltBindings = oModel.aBindings.slice(0);
		jQuery.each(ltBindings, function(index, oBinding) {
			if (oBinding.sPath === path) {
				oBinding.checkUpdate(true);
			}
		});
	}
	
	/**
	 * 
	 */
	function removeSelectionInTree(oMember, path, inSelectionState, oValueHelpDialog) {
		uncheckChildMembers(oMember, oValueHelpDialog);
		
		// unmark path, add all marked children to the selection
		if (!inSelectionState && path) {
			//unmark path up to the top
			var ltPath = path.split("/");
			var lTempPath = path;
			
			var oModel = oValueHelpDialog.getTable().getModel();
			
			var ltRemovedParentMemberKeys = [oMember.key];
			var lStopPath = sTempPath;
			while (ltPath.length > 3) {
				ltPath.pop();
				lTempPath = ltPath.join("/");
				
				var loTempMember = oModel.getProperty(lTempPath);
				
				oValueHelpDialog._oSelectedItems.remove(loTempMember.key);
				if (oValueHelpDialog._removeTokenFromTokenizer(loTempMember.key, oValueHelpDialog._oSelectedTokens)) {
					lStopPath = lTempPath;
				}
				
				ltRemovedParentMemberKeys.push(loTempMember.key);
				
				//by single selection also unmark all children
				if (oModel.getProperty("/dialog/singleonly")) {
					uncheckChildMembers(loTempMember);
				}
			}
			
			//if not single selection add all siblings to the selection
			if (!oModel.getProperty("/dialog/singleonly")) {
				ltPath = path.split("/");
				lTempPath = path;
				
				while (ltPath.length > 3 && lStopPath !== sTempPath) {
					ltPath.pop();
					lTempPath = ltPath.join("/");
					
					var lMaxChildIndex = -1;
					for (var i = 0; i === lMaxChildIndex + 1; i++) {
						var loChild = oModel.getProperty(lTempPath + "/" + i);
						if (!loChild) {
							continue;
						}
						
						if (!loChild.node && ltRemovedParentMemberKeys.indexOf(loChild.key) === -1) {
							oValueHelpDialog._oSelectedItems.add(loChild.key, loChild);
							oValueHelpDialog._addToken2Tokenizer(loChild.key, oValueHelpDialog._getFormattedTokenText(loChild.key), oValueHelpDialog._oSelectedTokens);
						}
						
						lMaxChildIndex = i;
					}
				}
			}
		}
	}
	
	/**
	 * Deselect all Child Members
	 */
	function uncheckChildMembers(oMember, oValueHelpDialog) {
		if (oMember) {
			var lMaxChildIndex = -1;
			for (var i = 0; i === lMaxChildIndex + 1; i++) {
				var loChild = oMember["" + i];
				if (!loChild) {
					continue;
				}
				
				oValueHelpDialog._oSelectedItems.remove(loChild.key);
				oValueHelpDialog._removeTokenFromTokenizer(loChild.key, oValueHelpDialog._oSelectedTokens);
				lMaxChildIndex = i;
				uncheckChildMembers(loChild, oValueHelpDialog);
			}
		}
	}
    
	/**
	 * Get Characteristic by Name
	 */
    function getCharacteristicByName(oModel, charName) {
        var ltChars = oModel.getProperty("/characteristics");
        for (var i = 0; i < ltChars.length; i++) {
            var loChar = ltChars[i].characteristic;
            if (!loChar) {
            	continue;
            }
            
            if (loChar.name === charName) {
                return loChar;
            }
        }
    }
	
	/**
	 * Get ContextMenu Action
	 */
	this.getContextMenuAction = function(sContextMenuComponentId, oClickedUI5Component, oDomClickedElement) {
		var lCommand = oClickedUI5Component.getModel().getProperty("/command/createcontextmenu");
		if (lCommand && oClickedUI5Component.ZEN_IdToDimensionMap) {
			var loListItem = this.getListItemElement(oDomClickedElement);
			if (loListItem && loListItem[0]) {
				var lDimensionName = oClickedUI5Component.ZEN_IdToDimensionMap[loListItem[0].id];
				var lMemberName;
				if (lDimensionName) {
					var lMethod = that.prepareCommand(lCommand, "__STRING__", sContextMenuComponentId);
					lMethod = that.prepareCommand(sMethod, "__STRING2__", lDimensionName);
					lMethod = that.prepareCommand(sMethod, "__STRING3__", lMemberName);
					lMethod = that.prepareCommand(sMethod, "__STRING4__", oDomClickedElement[0].id);
					return new Function(lMethod);
				}
			}
		}
		
		return null;
	};
	
	/**
	 * Get ListItem element
	 */
	this.getListItemElement = function(oDom) {
		if (oDom.hasClass("sapzenfilterpanelM-ListItem")) {
			return oDom;
		} else {
			return oDom.parents(".sapzenfilterpanelM-ListItem");
		}
	};
	
    /**
     * Get Type for FilterPanel
     */
	this.getType = function() {
		return "filterpanel";
	};
	
	/**
	 * Get Decorator for FilterPanel
	 */
	this.getDecorator = function() {
		return "DataSourceControlDecorator";
	};
};

var loInstance = new FilterPanelHandler();
dispatcher.addHandlers("filter", loInstance, "DataSourceControlDecorator");
return loInstance;
});