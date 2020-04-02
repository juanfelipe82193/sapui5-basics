define("zen.rt.components.filterbar/resources/js/filterbar_handler", ["sap/zen/basehandler", "zen.rt.components.filterpanel/resources/js/filterpanel_m_handler"], 
function(BaseHandler){
	
	var FilterBarHandler = function() {
		"use strict";
	
		BaseHandler.apply(this, arguments);
		
		var dispatcher = BaseHandler.dispatcher;
		
		var me = this;
		
		/**
		 * Create the Control
		 */
		me.create = function(oChainedControl, oControlProperties) {
			var id = oControlProperties["id"];
			
			jQuery.sap.require('sap.ui.comp.filterbar.FilterBar');			
		    
			var ZenFilterBar = sap.ui.comp.filterbar.FilterBar.extend("sap.zen.ZenFilterBar", {
				renderer : {}
			});
			
			ZenFilterBar.prototype._createVariantManagement = function() {
				/*
				 * Variant Management is only possible for applications
				 * 	see method initializeVariantManagement: window.sapbi_page.appComponent.getId() is required
				 */
				this._smartVm = false;
				var loVariantManagement;
				if (window.sapbi_page.appComponent) {
					loVariantManagement = new sap.ui.comp.smartvariants.SmartVariantManagement(
							this.getId() + "-variant", 
							{
								showExecuteOnSelection: false,
								showShare: true
							});
					this._smartVm = true;
				}
		        return loVariantManagement;
		    };		    
			
		    // create filterbar
			var filterBar = new ZenFilterBar(
					id,
					{
						advancedMode:false,
						considerGroupTitle:false,
						showRestoreButton:false,
						filterBarExpanded: oControlProperties.expanded,
						persistencyKey: oControlProperties.VARIANT_KEY
					}).addStyleClass('zenFilterBarM');			

			// overwrite _initializeVariantManagement of VariantManagement control
			filterBar._initializeVariantManagementOriginal = sap.ui.comp.filterbar.FilterBar.prototype._initializeVariantManagement; 
			filterBar._initializeVariantManagement = function() {    	
		    	if (this._smartVm) {
			    	if (this._oVariantManagement && this.getPersistencyKey()) {
						this._sOwnerId = window.sapbi_page && window.sapbi_page.appComponent.getId();
			    		var loPersInfo = new sap.ui.comp.smartvariants.PersonalizableInfo({
					       type: "filterBar",
					       keyName: "persistencyKey"		
			            });
			    		loPersInfo.setControl(this);
		
					    this._oVariantManagement.addPersonalizableControl(loPersInfo);					        
					    filterBar._initializeVariantManagementOriginal.call(filterBar);
			      	} else {
			      		this.fireInitialise();
				 	}
		    	} else {
		    		filterBar._initializeVariantManagementOriginal.call(filterBar);
		    	}
			};
			
			// overwrite _initialize to set standard variant
			if (filterBar._oVariantManagement) {
				filterBar._oVariantManagement._initializeOriginal = filterBar._oVariantManagement._initialize; 			
				filterBar._oVariantManagement._initialize = function(parameter, oCurrentControlWrapper) {
					if (oControlProperties.ignoreDefaultVariant) {			
						this.setInitialSelectionKey(filterBar._oVariantManagement.STANDARDVARIANTKEY);
						var lModifyCurrentVariant = me.allowVariantSave(filterBar, oControlProperties);
						filterBar._oVariantManagement.currentVariantSetModified(lModifyCurrentVariant);
					}
					filterBar._oVariantManagement._initializeOriginal.call(filterBar._oVariantManagement, parameter, oCurrentControlWrapper);
				};
			}
			
			// overwrite applyVariant: load bookmark, skip anything else
			filterBar.applyVariant = function(oVariant, sContext, bInitial) {
				if (oVariant) {
					var lBookmarkContent = oVariant.filterBarVariant;
				
					if (lBookmarkContent) {
						var lCommandString = getCommand(filterBar, 'loadSfinBookmark');
						if(lCommandString) {
							me.applyForChildren(filterBar, function(oDimFilter) {
								var loDimFilterModel = oDimFilter.getModel();
								var loAllFilters;
								if (loDimFilterModel) {
									loAllFilters = loDimFilterModel.getProperty("/filters");
								}
								if (loAllFilters) {
									for (var filterKey in loAllFilters) {
										if (loAllFilters.hasOwnProperty(filterKey)) {
											if (loAllFilters[filterKey].dirty) {
												loAllFilters[filterKey].dirty = false;
											}
										}
									}
								}
							});
							
							if (lCommandString.indexOf("__bmId__")>=0) {
								lCommandString = me.prepareCommand(lCommandString, "__bmId__", "42");
								lCommandString = me.prepareCommand(lCommandString, "__arg2__", lBookmarkContent);
								new Function(lCommandString).call();
							}
						}
					}
	
					if (bInitial && this._isNewFilterBarDesign()) {
						this._fHandleResize();
					}
				}
			};
			
			// register + implement variant content fetch
			filterBar.registerFetchData(function() {
				var lBookmarkContent = window[oControlProperties.PAGE_ID].getWindow().getContext("BookmarkInternal").createBookmark().getBookmark();
				
				/*
				 * VariantManagement holds a pointer to the object when storing
				 * We overwrite the pointer content when we load the current state of the application
				 * For this reason we need to provide Variant Management with a copy of the content
				 */
				var lCopy = JSON.parse(JSON.stringify(lBookmarkContent));
				return lCopy;
			});				
            
			// register + implement retrieval of Filters with value
            filterBar.registerGetFiltersWithValues(function() {
            	var ltFiltersWithValue = [];
            	
            	var ltFilters = this.getFilterGroupItems();
                for (var i = 0; i < ltFilters.length; i++) {
                    var loControl = this.determineControlByFilterItem(ltFilters[i]);
                    if (loControl && loControl.ZEN_multiInput && loControl.ZEN_multiInput[0] && loControl.ZEN_multiInput[0].getTokens().length) {
                    	ltFiltersWithValue.push(ltFilters[i]);
                    }
                }
                
                return ltFiltersWithValue;
            });
			
			// call _initializeVariantManagement() directly: fireInitialise() doesn't trigger _initializeVariantManagement()
			filterBar._initializeVariantManagement();
			
			if (!sap.zen.designmode && !oControlProperties.fbVisible) {
				filterBar.toggleStyleClass("zenFilterBarMHidden");
			}
			
			filterBar.custProp = {}; // to store local properties
			filterBar.custProp.i18n = {"expand":oControlProperties.EXPAND_ACTION, "collapse":oControlProperties.COLLAPSE_ACTION, "novariant":oControlProperties.NO_VARIANT};
			filterBar.custProp.allChildrenSubmit = oControlProperties.allChildrenSubmit;
			
			me.addCustomExpandButton(filterBar);

			if (typeof (DSH_deployment) !== "undefined") { //only enable this in new runtime
				setCommand(filterBar, 'loadSfinBookmark', oControlProperties.loadsfinbookmarkcmd);
			}
			
			filterBar.zenInitLater = function() {
				init(filterBar, oControlProperties);
				filterBar.zenInitLater=null;
			};
			
			filterBar.attachSearch(function(ev){
				me.handleSearch(ev, filterBar);
			});

			setCommand(filterBar, 'EXPAND', oControlProperties.expandcmd);
			setCommand(filterBar, 'DELAYRERENDER', oControlProperties.delayrerendercmd);
			
			if (!sap.zen.designmode) {
				filterBar.addEventDelegate({
					onAfterRendering:function(e) {
						e.srcControl.removeEventDelegate(this);
						me.updateEnablement(e.srcControl, oControlProperties);
						$(e.srcControl.getParent().getDomRef()).addClass("zenFilterBarMParentCont");
					}
				})
			}

			/////////////////////////////////////////////////////////////////////
			// temporary solution to hide the header 'Basic' in the Filter dialog
			// (nichts hält länger als ein Provisorium)
			/////////////////////////////////////////////////////////////////////
			me.hideFilterDialogHeader(filterBar);

			///////////////////////////////////////////////////////////////////////
			// initialization for adding custom overflow expand button in filterbar 
			///////////////////////////////////////////////////////////////////////
			me.initOverflowExpand(filterBar, oControlProperties);
            
			return filterBar;
		};
	
		/**
		 * Update the Control
		 */
		me.update = function(oControl, oControlProperties) {
			if (oControlProperties) {							
				if (oControl.zenInitLater) {
					setTimeout(oControl.zenInitLater);
				} else{						
					init(oControl, oControlProperties, true);
				}
				
				me.updateVisibility(oControl, oControlProperties);
				
				me.updateEnablement(oControl, oControlProperties);

				var lModifyCurrentVariant = me.allowVariantSave(oControl, oControlProperties);
				if (oControl._oVariantManagement) {
					oControl._oVariantManagement.currentVariantSetModified(lModifyCurrentVariant);
				}
			}
			return oControl;
		};
		
		/**
		 * Initialize the Control (Create, Update)
		 */
		function init(oControl, oControlProperties, bUpdate) {	
			var ltChildren = oControlProperties.content;
			
			if (ltChildren && ltChildren[0]) {
				if (ltChildren[0].component.content && ltChildren[0].component.content.control.newds) {			
					oControl.custProp.allChildrenSubmit = oControlProperties.allChildrenSubmit;
					if (bUpdate) { 
						ltChildren.forEach(function(oChild) {
							if (oChild.component.content && oChild.component.content.control.newds) {
								//this flag is not needed for updates in context of the filter bar...
								oChild.component.content.control.newds = false;
							}
						});
					}
				}
				
				me.updateChildren(ltChildren, oControl, function(oNewControl, iIndex, componentData) {					
					if (componentData) {
						var loFilterBarItem = new sap.ui.comp.filterbar.FilterGroupItem(
								oControl.getId() + '-' + oNewControl.getId(), 
								{
									name: oControl.getId() + '-' + oNewControl.getId(),
									groupName: sap.ui.comp.filterbar.FilterBar.INTERNAL_GROUP,
									partOfCurrentVariant: true,
									visibleInFilterBar: false
								});
						loFilterBarItem.setControl(oNewControl);
					
						if (componentData.content && componentData.content.control &&
								componentData.content.control.characteristics && 
								componentData.content.control.characteristics.length > 0) {
							loFilterBarItem.setLabel(componentData.content.control.characteristics[0].characteristic.text);
						}		
						
						oNewControl.addStyleClass('zenFilterBarMFilter');
                        if (oNewControl.ZEN_multiInput && oNewControl.ZEN_multiInput[0]) {
                            oNewControl.ZEN_multiInput[0].attachTokenChange(function(oEvent) {
                                oControl.fireFilterChange(oEvent);
                            });
                        }
                        
						oControl.addFilterGroupItem(loFilterBarItem);
					}			
				}, function(){
                    //do nothing					
				});

				oControl.fireFilterChange();
			}
			
			if (oControlProperties.visibleDimensionNames) {
				var ltVisibleDimensions = oControlProperties.visibleDimensionNames;
				var ltFilters = oControl.getFilterGroupItems();
                
                for (var i = 0; i < ltFilters.length; i++) {
                	var loFilter = ltFilters[i];
                	
                	var loDimFilter = oControl.determineControlByFilterItem(loFilter);
            		if (loDimFilter) {
            			loFilter.setVisibleInFilterBar(false);
            			var lDimName = loDimFilter.getModel().getProperty("/characteristics/0/characteristic/name");
            			for (var j = 0; j < ltVisibleDimensions.length; j++) {
							if (lDimName === ltVisibleDimensions[j]._n) {
								loFilter.setVisibleInFilterBar(true);
								break;
							}
						}
            		}
            	}
			}			
		}
		
		/**
		 * 
		 */
		me.applyForChildren = function(oControl, funclet) {			
			var lContent = oControl.getAllFilterItems();		
			for (var i = 0; i < lContent.length; i++) {
                var loFilterControl = oControl.determineControlByFilterItem(lContent[i]);
				if (loFilterControl) {
					var lResult = funclet(loFilterControl);
					if (lResult){
						return lResult;
					}
				}
			}
			
			return null;
		};
		
		/**
		 * get Type
		 */
		me.getType = function() {
			return "filterbar";
		};

		/////////////////////////////////////////
		//
		// Local Utilities
		//
		/////////////////////////////////////////
		
		/**
		 * Update Visibility
		 */
		me.updateVisibility = function(oFilterBar, oControlProperties) {
			if (oControlProperties.visibilityChanged) {
				oFilterBar.toggleStyleClass("zenFilterBarMHidden");
			}
		}
		
		/**
		 * Determine if Variant is to be overwritten or not
		 */
		me.allowVariantSave = function(oFilterBar, oControlProperties) {
			if (oFilterBar._oVariantManagement) {
				var loVariantManagement = oFilterBar._oVariantManagement;
				if (loVariantManagement.getSelectionKey() !== loVariantManagement.STANDARDVARIANTKEY && oControlProperties.datasourcechanged) {
					return true;
				} else {
					return false;
				}
			}
		}
		
		/**
		 * 
		 */
		me.initOverflowExpand = function(oFilterBar, oControlProperties) {
			dispatcher.registerResizeHandler(oFilterBar, {                
                endResize : function(e) {
	                if (e) {
						///////////////////////////////////////////////
						// Dynamically Hide/Show Expand button
						//////////////////////////////////////////////						
						if (getSampleDFWidth() === -1) {
							me.sampleDimensionFilterWidth(oFilterBar);
						}
																		
						if (oFilterBar.getFilterBarExpanded()) {
							me.refreshCollapseVisibleDFCount(oFilterBar);							
						}
						me.updateCustomExpandVisibility(oFilterBar);
	                }
                }
            });

			
			oFilterBar.orig_setFilterBarExpanded = oFilterBar.setFilterBarExpanded;
			oFilterBar.setFilterBarExpanded = function(showExpanded){
				var lOldExpanded = this.getFilterBarExpanded();				
				oFilterBar.orig_setFilterBarExpanded.call(oFilterBar, showExpanded);
				
				if (showExpanded !== lOldExpanded) {
					var lCommandString = getCommand(oFilterBar, 'EXPAND');
					if (lCommandString) {
						eval(lCommandString);
					}
					
	                new Function(oControlProperties.onToggle).call();
				}
			};			
		};
		
		/**
		 * Add Custom Expand Button
		 */
		me.addCustomExpandButton = function(oFilterBar) {
			if (oFilterBar._oToolbar) {
				var lHideShowButtonIndex;
				if (oFilterBar._oHideShowButton) {
					lHideShowButtonIndex = oFilterBar._oToolbar.indexOfContent(oFilterBar._oHideShowButton);
				}
				
				if (lHideShowButtonIndex) {					
					jQuery.sap.require('sap.m.Button');
					jQuery.sap.require('sap.m.ButtonType');
					
					oFilterBar.customExpandButton = new sap.m.Button({
						text: oFilterBar.custProp.i18n.expand,
						visible:false,
						type: sap.m.ButtonType.Transparent
					});
					
					oFilterBar.customExpandButton.attachPress(function() {
						me.toggleExpandOverlay(oFilterBar);
					});
					oFilterBar.customExpandButton.addStyleClass('zenCustomExpandButton');				
					oFilterBar._oToolbar.insertContent(oFilterBar.customExpandButton, lHideShowButtonIndex);
				}
				
			}			
		};
		
		/**
		 * Update Expand Visibility
		 */
		me.updateCustomExpandVisibility = function(oFilterBar) {
			var lExpandButtonVisible = false;
			if (oFilterBar.getFilterBarExpanded()) {				
				lExpandButtonVisible = me.checkCustomExpandVisibility(oFilterBar) && oFilterBar.getFilterBarExpanded();
			}
			oFilterBar.customExpandButton.setVisible(lExpandButtonVisible);			
			
			// this is the case when the overlay is expanded, the user opens filter
			// dialog and hide dimension filters.  If the expand button should not
			// be visible anymore, we'll collapse the overlay
			if (oFilterBar.custProp.customExpanded && !lExpandButtonVisible) {
				me.toggleExpandOverlay(oFilterBar, true);
			}
		}
		
		/**
		 * Collapse
		 */
		me.refreshCollapseVisibleDFCount = function(oFilterBar) {
			if (getSampleDFWidth() === -1) {
				me.sampleDimensionFilterWidth(oFilterBar);
			}
			
			var count = Math.floor((($(oFilterBar.getDomRef()).width())/getSampleDFWidth()));
            var ltFilters = oFilterBar.getFilterGroupItems();
            
            var indexVisible = 0;
            for (var i =0 ; i < ltFilters.length; i++) {
                var loFilter = ltFilters[i];
                
                if (loFilter.getVisibleInFilterBar()) {
	                var loDimFilter = oFilterBar.determineControlByFilterItem(loFilter);
	                if (loDimFilter) {
	                   var loParent = loDimFilter.getParent();
	                   if (loParent && loParent.addStyleClass && loParent.removeStyleClass) {
		                   if (indexVisible++>=count) {
		                	   loParent.addStyleClass('zenFBIhidden');
		                   }
		                   else {
		                	   loParent.removeStyleClass('zenFBIhidden');
		                   }
	                   }
	                }
	            }
            }				
		};
		
		/**
		 * Check Expand Visibility
		 */
		me.checkCustomExpandVisibility = function(oFilterBar) {
			var retValue = false;

			var visibleDFCount = getVisibleDFCount(oFilterBar);			
			if (getSampleDFWidth() !== -1) {				
				if ((visibleDFCount*getSampleDFWidth()) > ($(oFilterBar.getDomRef()).width())) {			
					retValue = true;
				}
			}
			
			return retValue;
		};
		
		/**
		 * 
		 */
		me.sampleDimensionFilterWidth = function(oFilterBar) {
			var w = -1;
			var dfs = oFilterBar.getAllFilterItems();
			if (dfs.length>1) {
				var df = $(oFilterBar.getDomRef()).find('.sapUiAFLayoutItem:first-of-type');
				if (df) {
					var dfPaddings = parseInt(df.css('padding-left'))+parseInt(df.css('padding-right'));
					if (isNaN(dfPaddings)) {
						dfPaddings = 0;		
					}
					var dfMargin = parseInt(df.css('margin-left'))+parseInt(df.css('margin-right'));
					if (isNaN(dfMargin)) {
						dfMargin = 0;		
					}
					w = df.width()+dfPaddings+dfMargin;
				}
			}
			setSampleDFWidth(w);
		}
		
		/**
		 * Toggle Expand Overlay
		 */
		me.toggleExpandOverlay = function(oFilterBar, manualClose) {
			if (oFilterBar.custProp.customExpanded || manualClose===true) {
				oFilterBar.removeStyleClass('zenCustomExpand');
				oFilterBar.custProp.customExpanded = false;							
				oFilterBar.customExpandButton.setText(oFilterBar.custProp.i18n.expand);
			}
			else {
				oFilterBar.addStyleClass('zenCustomExpand');
				oFilterBar.custProp.customExpanded = true;
				oFilterBar.customExpandButton.setText(oFilterBar.custProp.i18n.collapse);
			}
		}
		
		/**
		 * Hide Filter Dialog Header
		 */
		me.hideFilterDialogHeader = function(oFilterBar) {
			me.originalShowFilterDialog = oFilterBar._showFilterDialog;		
			oFilterBar._showFilterDialog = function() {
				$(document.body).addClass('zenFilterBarDialogOpened');
				
                me.applyForChildren(oFilterBar, function(oDimFilter) {
                    oDimFilter.ZENFilterBeforeDialog = JSON.stringify(oDimFilter.getModel().getProperty("/filters"));
                });
				me.originalShowFilterDialog.call(oFilterBar);
				
				oFilterBar._oFilterDialog.attachAfterClose(function() {
                    me.applyForChildren(oFilterBar, function(oDimFilter) {
                        if (oDimFilter.ZENFilterBeforeDialog) {
                            oDimFilter.ZENFilterBeforeDialog = null;
                        }
                    });		
					$(document.body).removeClass('zenFilterBarDialogOpened');					
					
					if (oFilterBar.getFilterBarExpanded()) {
						me.refreshCollapseVisibleDFCount(oFilterBar);						
					}
					me.updateCustomExpandVisibility(oFilterBar);
				});										
			}
            
            me.originalCancelFilterDialog = oFilterBar._cancelFilterDialog;
            oFilterBar._cancelFilterDialog = function() {
                me.applyForChildren(oFilterBar, function(oDimFilter) {
                    if (oDimFilter.ZENFilterBeforeDialog) {
                        oDimFilter.getModel().setProperty("/filters", JSON.parse(oDimFilter.ZENFilterBeforeDialog));
                        oDimFilter.ZENFilterBeforeDialog = null;
                    }
                });
                
				me.originalCancelFilterDialog.call(oFilterBar);						
			}					
		};
		
		/**
		 * Handle Search
		 */
		me.handleSearch = function(ev, oFilterBar) {
			var lSubmitMethod = oFilterBar.custProp.allChildrenSubmit;
			var lKeyWordToReplace = lSubmitMethod.indexOf("__STRING____");
			while(lKeyWordToReplace > 0){
				var lKeyWeNeedToReplace;
				if (typeof (DSH_deployment) === "undefined"){
					lKeyWeNeedToReplace = lSubmitMethod.substring(lKeyWordToReplace, lSubmitMethod.indexOf("'",lKeyWordToReplace));
				}else{
					lKeyWeNeedToReplace = lSubmitMethod.substring(lKeyWordToReplace, lSubmitMethod.indexOf("\\x27",lKeyWordToReplace));
				}
				var lIdWeNeed = lKeyWeNeedToReplace.substring(12)+"_filter1";
				var loDimensionFilter = sap.ui.getCore().byId(lIdWeNeed);

				var lOriginalSubmitMethod = lSubmitMethod;						
				lSubmitMethod = loDimensionFilter.ZEN_submit(lKeyWeNeedToReplace, lSubmitMethod);
				if (!lSubmitMethod) {
					lSubmitMethod = lOriginalSubmitMethod.replace(lKeyWeNeedToReplace,"{}");
				}
				
				lKeyWordToReplace = lSubmitMethod.indexOf("__STRING____");
			}
			
			var lDelayrerendercmdStart = getCommand(oFilterBar, 'DELAYRERENDER');
			if(lDelayrerendercmdStart && lDelayrerendercmdStart.indexOf("__arg1__") >= 0) {
				lDelayrerendercmdStart = lDelayrerendercmdStart.replace("__arg1__", "true");
			}
			
			var lDelayrerendercmdEnd = getCommand(oFilterBar, 'DELAYRERENDER');
			if(lDelayrerendercmdEnd && lDelayrerendercmdEnd.indexOf("__arg1__") >=0 ) {
				lDelayrerendercmdEnd = lDelayrerendercmdEnd.replace("__arg1__", "false");
			}
			
			var lVisibleDimensions = me.getVisibleDimensions(oFilterBar);
			if(lVisibleDimensions && lDelayrerendercmdEnd && lDelayrerendercmdEnd.indexOf("__arg2__")>=0) {
				lDelayrerendercmdEnd = lDelayrerendercmdEnd.replace("__arg2__", lVisibleDimensions);
			}
					
			lSubmitMethod = lDelayrerendercmdStart + lDelayrerendercmdEnd + lSubmitMethod ;			
			eval(lSubmitMethod);			
		};
		
		/**
		 * Get Visible Dimensions
		 */
		me.getVisibleDimensions = function(oFilterBar) {
            if (typeof (DSH_deployment) !== "undefined") {
                 var ltFilters = oFilterBar.getFilterGroupItems();
                
                var ltVisibleDimensions = [];             
                for (var i = 0; i < ltFilters.length; i++) {
                	var loFilter = ltFilters[i];
                	
                	if (loFilter.getVisibleInFilterBar()) {
                		var loControl = oFilterBar.determineControlByFilterItem(loFilter);
                		if (loControl) {
                			var lDimName = loControl.getModel().getProperty("/characteristics/0/characteristic/name");
                			if (lDimName) {
                				ltVisibleDimensions.push(lDimName);
                			}
                		}
                	}
                }
				return JSON.stringify(ltVisibleDimensions);
            }
            
            return null;
		}
		
		/**
		 * Update Enabled
		 */
		me.updateEnablement = function(oFilterBar) {
			if (oFilterBar._oVariantManagement) {
				oFilterBar._oVariantManagement.setEnabled(true);
			}
		};
		
		/**
		 * 
		 */
		function getVisibleDFCount(oFilterBar) {
			var dfs = oFilterBar.getAllFilterItems(true);
			
			var visibleDFCount = 0;
			for (var i=0; dfs && i<dfs.length; i++) {
				if (dfs[i].getVisibleInFilterBar()) {
					visibleDFCount++;
				}
			}
			return visibleDFCount;
		}

		/**
		 * 
		 */
		function setSampleDFWidth(val) {
			me._sampleDFWidth = val;
		}

		/**
		 * 
		 */
		function getSampleDFWidth() {
			if (!me._sampleDFWidth) {
				me._sampleDFWidth = -1;
			}
			return me._sampleDFWidth;
		}

		/**
		 * Get Command
		 */
		function getCommand(oControl, type) {
			var lCommand;
			if (oControl.custProp && oControl.custProp.commands) {
				lCommand = oControl.custProp.commands[type];
			}
			return lCommand;
		}
		
		/**
		 * Set Command
		 */
		function setCommand(oControl, type, command) {
			if (oControl.custProp) {
				if (!oControl.custProp.commands) {
					oControl.custProp.commands = {};
				}
				oControl.custProp.commands[type] = command;
			}			
		}

		/**
		 * get Decorator
		 */
		this.getDecorator = function() {
			return "DataSourceFixedHeightDecorator";
		};
	};
	
	return new FilterBarHandler();
});