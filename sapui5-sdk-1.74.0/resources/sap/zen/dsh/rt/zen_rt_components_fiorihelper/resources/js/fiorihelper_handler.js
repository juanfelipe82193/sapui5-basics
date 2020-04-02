define("zen.rt.components.fiorihelper/resources/js/fiorihelper_handler", ["sap/zen/basehandler"], function(BaseHandler){
	
	BaseHandler.apply(this, arguments);
	
	var FioriHelperHandler = function() {
		"use strict";
	
		sap.zen.BaseHandler.apply(this, arguments);
	
		var aAllowedSemanticSources = [];
		var aValidJumpTargets = [];
		
		var that = this;
		this.sOntilesettingssubmittedcommand = null;
		this.sGetappurlcommand = null;
		this.oBookmarkTileData = null;
		this.oBookmarkTileGroup = null;
		this.oAppState = null;
		this.sSelection = null;
		
		this.init = function(oControl, oControlProperties) {
			if (oControlProperties) {
				if (oControlProperties.appstate) {
					this.setApplicationState(oControlProperties.appstate, oControlProperties.hostui5control);
				}
				if (oControlProperties.context) {
					this.setSelection(oControlProperties.context, oControlProperties.hostui5control);
				}
				this.sOntilesettingssubmittedcommand = oControlProperties.ontilesettingssubmittedcommand;
				var sClientAction = oControlProperties.clientaction;
				if (sClientAction && sClientAction.length > 0) {
					if (sClientAction === "FETCH_JUMP_TARGETS") {
						this.fetchJumpTargets(oControlProperties);
					} else if (sClientAction === "JUMP_TO") {
						this.jumpToTarget(oControlProperties);
					} else if (sClientAction === "SAVE_TILE") {
						this.saveTile(oControlProperties);
					} else if (sClientAction === "OPEN_TILE_SETTINGS") {
						this.openSaveTileDialog(oControlProperties);
					} else if (sClientAction === "GET_APP_URL") {
						this.sGetappurlcommand = oControlProperties.getappurlcommand;
						this.sendAppUrl();
					} else if (sClientAction === "NAVIGATE_BACK") {
						this.navigateBack();
					}
				}
				if (oControlProperties.shellapptitle) {
					this.setTitle(oControlProperties.shellapptitle);
				}
			}
		};
		
		this.setTitle = function(sTitle) {
			window.sapbi_page && window.sapbi_page.appComponent && window.sapbi_page.appComponent.getService("ShellUIService").then(
                function (oShellUIService) {
                    if (oShellUIService) {
                        oShellUIService.setTitle(sTitle);
                    }
                },
                function () {
                     // silently do nothing in case the service is not present
                });		
		};
		
		this.sendAppUrl = function() {
			if (this.sGetappurlcommand && this.sGetappurlcommand.length > 0) {
				var sSendAppUrlCmd = this.sGetappurlcommand;
				var sBaseUrl;
				var sBaseHash = "";
				var oParams = {};
				if (typeof hasher !== "undefined") {
					var hash = URI(hasher.getHash());
					sBaseHash = hash.path();
					oParams = URI.parseQuery(hash.query()); 
					sBaseUrl = URI(hasher.getURL()).fragment("").toString();
				} else {
					sBaseUrl = URI("");
				}
				sSendAppUrlCmd = that.prepareCommand(sSendAppUrlCmd, "__BASE_URL__", sBaseUrl);
				sSendAppUrlCmd = that.prepareCommand(sSendAppUrlCmd, "__BASE_HASH__", sBaseHash);
				sSendAppUrlCmd = that.prepareCommand(sSendAppUrlCmd, "__PARAM_JSON__", encodeURI(JSON.stringify(oParams)));
				var fAction = new Function(sSendAppUrlCmd);
				fAction();
			}
		};
		
		this.setSelection = function(oContext, sHostUI5Control) {
			var oHostUI5Control = sHostUI5Control && sap.ui.getCore().byId(sHostUI5Control);
			if (oHostUI5Control && oHostUI5Control.fireSelectionChange) {
				var sNewSelection = JSON.stringify(oContext);
				if (this.sSelection !== sNewSelection) {
					this.sSelection = sNewSelection;
					oHostUI5Control.fireSelectionChange({selection: this.createSelectionVariantObject(oContext)});
				}
			}
		}
		
		this.setApplicationState = function(sAppState, sHostUI5Control) {			
			if (sAppState) {
				var oHostUI5Control = sHostUI5Control && sap.ui.getCore().byId(sHostUI5Control);
				if (oHostUI5Control && oHostUI5Control.fireStateChange) {
					return oHostUI5Control.fireStateChange({state: sAppState});
				}
				
				// only possible within Fiori Shell
				if (!window.sapbi_page.appComponent) {
					return;
				}
				
				var oCrossAppNav = getCrossAppNav();
				var oShellNav = getShellNav();
				var createdNewState = false;
				if (oShellNav) {
					if (this.oAppState) {
						var oExistingData = this.oAppState.getData();
						//Avoid overwriting with identical appState
						if (oExistingData && oExistingData.customData && oExistingData.customData.bookmarkedAppState === sAppState) {
							return;
						}
					} else {
						createdNewState = true;
						this.oAppState = oCrossAppNav.createEmptyAppState(window.sapbi_page.appComponent);
					}
					var oAppStateData = {"customData" : {"bookmarkedAppState" : sAppState}};
					this.oAppState.setData(oAppStateData);
					this.oAppState.save();
					oShellNav.toAppHash("sap-iapp-state=" + this.oAppState.getKey(), false);
					if (createdNewState) {
						//On new state creation, the app hash would change so we need to capture this.
						this.sendAppUrl();
					}
				} else {
					oShellNav.toAppHash("", false);
				}
			}
		};
		
		this.mixInURLParameters = function(hash, sUrlParameters) {
			var oNewUrlParameters = URI.parseQuery(sUrlParameters);

			var hashFirstSegment = hash[0];
			
			var hashURI = URI.parse(hashFirstSegment);
			
			var oUrlParameters = URI.parseQuery(hashURI.query);
			
			for (var param in oNewUrlParameters) {
				if (oNewUrlParameters.hasOwnProperty(param)) {
					oUrlParameters[param] = oNewUrlParameters[param];
				}
			}

			var sUrl = '#' + URI(hashURI.path).addQuery(oUrlParameters);
			if (hash.length > 1) {
				if (hashFirstSegment.endsWith("&") && !sUrl.endsWith("&")) {
					sUrl = sUrl + "&";
				}
				
				for (var hashIdx = 1; hashIdx < hash.length; ++hashIdx) {
					sUrl = sUrl + "/" + hash[hashIdx];
				}
			}
			return sUrl;
		}
		
		this.saveTile = function(oControlProperties) {
			var oBookmarkService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("Bookmark");
			var sUrlParameters = oControlProperties.urlparameters;
			if (oBookmarkService) {
				var hash = typeof hasher !== "undefined" ? hasher.getHashAsArray() : [""];
				if (oControlProperties.usefrontendtilesettings) {
					if (sUrlParameters) {
						//Only if we for some reason had overwrite params here, use the 
						//mixin logic.  Otherwise, take what the save tile did for us.
						this.oBookmarkTileData.url = this.mixInURLParameters(hash, sUrlParameters);
					}
					oBookmarkService.addBookmark(this.oBookmarkTileData, this.oBookmarkTileGroup);
				} else {
					var sUrl = this.mixInURLParameters(hash, sUrlParameters);
					
					oBookmarkService.addBookmark({
						title : oControlProperties.title || "",
						url : sUrl, 
						info : oControlProperties.info || "",
						subtitle : oControlProperties.subtitle || ""
					});
				}
			}
		};
		
		this.openSaveTileDialog = function(oControlProperties) {
            var that = this;
			var settingsView = sap.ui.view({
                type: sap.ui.core.mvc.ViewType.JS,
                viewName: "sap.ushell.ui.footerbar.SaveAsTile",
                viewData: {
                    appData: {
                        showGroupSelection: true,
                        title: oControlProperties.shellapptitle,
                        subtitle: oControlProperties.tileSubtitle,
                        info: oControlProperties.tileInfo
                    }
                }
            });

            var oSimpleForm = new sap.ui.layout.form.SimpleForm({
                id: 'tileSettings',
                layout: sap.ui.layout.form.SimpleFormLayout.GridLayout,
                content: [
                    settingsView
                ]
						}).addStyleClass("sapUshellAddBookmarkForm");

						var okButton = new sap.m.Button('bookmarkOkBtn', {
            	text: oControlProperties.oktext,
                press: function() {
                    that.onTileSettingsSubmitted(settingsView.getBookmarkTileData());
                    oDialog.close();
                },
                enabled: (oControlProperties.shellapptitle && oControlProperties.shellapptitle.trim()) ? true : false
            }), cancelButton = new sap.m.Button('bookmarkCancelBtn', {
                text: oControlProperties.canceltext,
                press: function() {
                    oDialog.close();
                }
            });
							
			var oDialog = new sap.m.Dialog({
                id: 'settingsDialog',
                title: oControlProperties.DialogTitle,
                contentWidth: '400px',
                content: oSimpleForm,
                beginButton: okButton,
                endButton: cancelButton,
                horizontalScrolling: false,
                afterClose: function() {
                    oDialog.destroy();
                }
            });

            // enforce the title input as a mandatory field
            var enableOKButton = function(title) {
                okButton.setEnabled(title.trim() ? true : false);
            };
            settingsView.getTitleInput().attachLiveChange(function() {
                enableOKButton(this.getValue());
            });

            oDialog.open();
		};
		
		this.onTileSettingsSubmitted = function(oBookmarkTileData) {
			//Save settings here on client for later use on save, if necessary.
            this.oBookmarkTileGroup = oBookmarkTileData.group ? oBookmarkTileData.group.object : null;
            //remove the group object before sending the data to the service
            delete oBookmarkTileData.group;
			this.oBookmarkTileData = oBookmarkTileData;

			if (this.sOntilesettingssubmittedcommand && this.sOntilesettingssubmittedcommand.length > 0) {
				var fAction = new Function(this.sOntilesettingssubmittedcommand);
				fAction();
			}
		} 
		
		function getCrossAppNav() {
			return sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
		}

		function getShellNav() {
			return sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("ShellNavigation");
		}

		this.jumpToTarget = function(oControlProperties) {
			var oCrossAppNav = getCrossAppNav();
			var sHash = oControlProperties.hash;
			
			if (oCrossAppNav && sHash && sHash.length > 0) {
				if (oControlProperties.navigateinplace) {
					oCrossAppNav.toExternal({
						target: { shellHash: sHash }
					});
				}
				else {
					window.open(sHash);
				}
			} 
		};

		this.navigateBack = function() {
			var oCrossAppNav = getCrossAppNav();
			
			if (oCrossAppNav) {
				oCrossAppNav.backToPreviousApp();
			} 
		};

		this.determineAllowedSemanticSources = function(oControlProperties) {
			aAllowedSemanticSources = [];
			if (oControlProperties.navigation && oControlProperties.navigation.allowed_semantic_sources) {
				var iLength = oControlProperties.navigation.allowed_semantic_sources.length;
				if (iLength && iLength > 0) {
					for (var i = 0; i < iLength; i++) {
						aAllowedSemanticSources.push(oControlProperties.navigation.allowed_semantic_sources[i].entry.semanticname);
					}
				}
			}
		};
		
		
		this.determineValidJumpTargets = function(oCrossAppNav, oParams, sAppStateKey, oControlProperties) {
			var aIntents = [];
			aValidJumpTargets = [];
			var aGetLinksArgs = [];

			aAllowedSemanticSources.forEach(function(sSemanticObject) {
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
					for (var idx = 0; idx < aIntents.length; ++idx) {
						var oIntent = aIntents[idx];
						aValidJumpTargets.push({"text" : oIntent.text, "hash" : oIntent.intent}); 
					}
				}
				that.sendJumpTargetsToRuntime(oControlProperties.onjumptargetsfetchedcommand);
			});
		};
		
		this.fetchJumpTargets = function(oControlProperties) {
			var oCrossAppNav = getCrossAppNav();
			this.determineAllowedSemanticSources(oControlProperties);

			var oContext = oControlProperties.context;
			var oParams = {}; //These will be passed as URL parameters -- extra info only.

			var oSelectionVariant = this.createSelectionVariantObject(oContext);

			// Now we can add the (redundant) selections to URL parameters.

			// first add selection information ...
			this.addNameSelectionPairFromArray(oContext.selections, oParams);

			// ... then add filter information ...
			this.addNameSelectionPairFromArray(oContext.filter, oParams);
			
			// ... and then add variables
			this.addNameSelectionPairFromArray(oContext.variables, oParams);
			
			var sAppStateKey;
				
			//DSH.js ALWAYS creates window.sapbi_page.  If later multiple DSH are allowed on one page, this logic must change. 
			if (oSelectionVariant !== undefined && window.sapbi_page && window.sapbi_page.appComponent) {
				var oAppState = oCrossAppNav.createEmptyAppState(window.sapbi_page.appComponent);
				var oAppStateData = {"selectionVariant" : oSelectionVariant};
				oAppState.setData(oAppStateData);
				oAppState.save();
				sAppStateKey = oAppState.getKey();
			}
			
			this.determineValidJumpTargets(oCrossAppNav, oParams, sAppStateKey, oControlProperties);			
		};
		
		this.sendJumpTargetsToRuntime = function(sOnjumptargetsfetchedcommand) {
			if (sOnjumptargetsfetchedcommand && sOnjumptargetsfetchedcommand.length > 0) {
				var sResultJSON = JSON.stringify(aValidJumpTargets);
				sResultJSON = encodeURI(sResultJSON)

				var lMethod = that.prepareCommand(sOnjumptargetsfetchedcommand, "__JUMPTARGETS__", sResultJSON);
				var loFuncAction = new Function(lMethod);
				loFuncAction();
			}
		};
		
		this.create = function(oChainedControl, oControlProperties) {
			this.oAppState = null;
			this.sSelection = null;
			var id = oControlProperties["id"];
			
			var oControl = this.createDefaultProxy(id);
	
			this.init(oControl, oControlProperties);
			oControl.setVisible(false);
			
			return oControl;
		};
		
		this.getDefaultProxyClass = function() {
			return ["sap.m.Button", "sap.ui.commons.Button"];
		};
	
		this.update = function(oControl, oControlProperties) {
			this.init(oControl, oControlProperties);	
			return oControl;
		};
		
		//This is only for variables - Simple values only
		this.getParameters = function(aArray) {
			var oParameters = [];
			var sName, sSelection;
			
			if (aArray) {
				var iLength = aArray.length;
				if (iLength > 0) {
					for (var i = 0; i < iLength; i++) {
						sName = aArray[i].dimension.name;
						sSelection = aArray[i].dimension.selection;
						if (sName && sName.length > 0 && sSelection && sSelection.length > 0) {
							oParameters.push({"PropertyName" : sName, "PropertyValue" : sSelection});
						}
					}
				}
			}
			
			if (oParameters.length > 0) {
				return oParameters;
			}
		}
	
		//Add select options for any not already set dimensions.
		this.addSelectOptionsFromArray = function(aSelectionArray, oSelectOptions) {
			if (aSelectionArray) {
				var iLength = aSelectionArray.length;
				if (iLength > 0) {
					for (var i = 0; i < iLength; i++) {
						var sName = aSelectionArray[i].dimension.name;
						
						if (sName && sName.length > 0 && !oSelectOptions.hasOwnProperty(sName)) {
							if (aSelectionArray[i].dimension.selection) {
								//Single string value, for single-value variable support.  Might be soon removable.
								oSelectOptions[sProperty] = [{"Sign" : "I", "Option" : "EQ", "Low" : aSelectionArray[i].dimension.selection, "High" : null}];
							} else if ( aSelectionArray[i].dimension.selections && aSelectionArray[i].dimension.selections.length > 0) {
								//In selectoption format:  An array of individual range objects.
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
		
		//This is for selections.  All kinds -- including range  and multivalue, are supported.
		this.getSelectOptions = function(oContext) {
			var oSelectOptions = {};
			var aSelectOptions = [];
			
			this.addSelectOptionsFromArray(oContext.selections, oSelectOptions);
			this.addSelectOptionsFromArray(oContext.filter, oSelectOptions);
			this.addSelectOptionsFromArray(oContext.variables, oSelectOptions);
			
			for (var sSelectOptionProperty in oSelectOptions) {
				if (oSelectOptions.hasOwnProperty(sSelectOptionProperty)) {
					aSelectOptions.push({"PropertyName" : sSelectOptionProperty, "Ranges" : oSelectOptions[sSelectOptionProperty]});
				}
			}
	
			if (aSelectOptions.length > 0) {
				return aSelectOptions;
			}
		}
		
		//Add selection and variable state as "Selection Variant".
		//omit things which are already in the Parameters...
		this.createSelectionVariantObject = function(oContext) {
			if (!oContext) {
				return;
			}
			
			var oSelectionVariantObject = {};
	
			// Mind the priorities after having added the main context information above:
			// first add filter information ...
	
			var oSelectOptions = this.getSelectOptions(oContext);
			
			if (oSelectOptions !== undefined) {
				oSelectionVariantObject.SelectOptions = oSelectOptions;
				oSelectionVariantObject.SelectionVariantID = new Date().toISOString();
				oSelectionVariantObject.Text = "Temporary Variant " + oSelectionVariantObject.SelectionVariantID;
				
				return oSelectionVariantObject;
			}
		}
	
		this.addNameSelectionPairFromArray = function(aArray, oParams) {
			var sName, sSelection, aSelections;
			
			if (aArray && oParams) {
				var iLength = aArray.length;
				if (iLength > 0) {
					for (var i = 0; i < iLength; i++) {
						sName = aArray[i].dimension.name;
						if (sName && sName.length > 0 && !oParams[sName]) {
							//A single "selection" entry  means it's a variable value.
							sSelection = aArray[i].dimension.selection;
							if (sSelection && sSelection.length > 0) {
								oParams[sName] = sSelection;
							} else {
								//"selections" means it's in the format of an array of selection objects.
								//Only single-value == comparisons will be taken here, as others are not possible to express in URL-parameters.
								aSelections = aArray[i].dimension.selections;
								if (aSelections && aSelections.length === 1 && aSelections[0].Sign && aSelections[0].Sign === "I" && aSelections[0].Option && aSelections[0].Option === "EQ") {
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
		};

		this.getType = function() {
			return "fiorihelper";
		};

	};

	return new FioriHelperHandler();
	
});
