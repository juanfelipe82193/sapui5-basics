sap.ui.define(["sap/ui/core/UIComponent", "sap/ovp/cards/rta/SettingsDialogConstants",
    "sap/ui/core/routing/Router", "sap/ui/thirdparty/jquery", "sap/base/util/ObjectPath", "sap/base/Log",
        "sap/ui/model/json/JSONModel", "sap/ovp/ui/DashboardLayoutUtil", "sap/ui/core/mvc/ViewType",
    "sap/ui/model/resource/ResourceModel", "sap/ovp/app/resources", "sap/ui/core/CustomData", "sap/ushell/Config", "sap/ui/rta/RuntimeAuthoring"/*Don't Remove this. Important for Personalization to work*/],

    function (UIComponent, SettingsDialogConstants, Router, jQuery, ObjectPath, Log,
              JSONModel, DashboardLayoutUtil, ViewType, ResourceModel, OvpResources, CustomData, Config) {
        "use strict";
        // We need to require RuntimeAuthoring 'sap.ui.rta.RuntimeAuthoring' in the very beginning to be able to personalize.
        // Without RuntimeAuthoring at this point or maybe a little later but not too late, for instance, in Main controller,
        // the change handler will not be called by sap.ui.fl

        return UIComponent.extend("sap.ovp.app.Component", {

            // use inline declaration instead of component.json to save 1 round trip
            metadata: {
                routing: {
                    config: {
                        routerClass: Router
                    },
                    targets: {},
                    routes: []
                },

                properties: {
                    "cardContainerFragment": {
                        "type": "string",
                        "defaultValue": "sap.ovp.app.CardContainer"
                    },
                    "dashboardLayoutUtil": {
                        "type": "sap.ovp.ui.DashboardLayoutUtil"
                    },
                    "designtimePath": {
						"type": "string",
						"defaultValue": "sap/ovp/ui/OVPWrapper.designtime"
					}
                },

                version: "1.74.0",

                library: "sap.ovp.app",

                dependencies: {
                    libs: ["sap.ovp"], /*OVP Library load is required in case it is not mentioned in app manifest*/
                    components: []
                },
                config: {
                    fullWidth: true,
                    hideLightBackground: true
                }
            },

            /**
             * @param {string} sCardId - Id of the card for which config is needed
             * @returns {object} - Configuration of card for named sCardId
             */
            _getOvpCardOriginalConfig: function (sCardId) {
                var oOvpConfig = this.getOvpConfig();
                return oOvpConfig.cards[sCardId];
            },

            /**
             * get the merged sap.ovp section from all component hierarchy
             * @returns merged sap.ovp section from manifes files
             */
            getOvpConfig: function () {
                var oOvpConfig;
                var aExtendArgs = [];
                var oManifest = this.getMetadata();
                //loop over the manifest hierarchy till we reach the current generic component
                while (oManifest && oManifest.getComponentName() !== "sap.ovp.app") {
                    oOvpConfig = oManifest.getManifestEntry("sap.ovp");
                    if (oOvpConfig) {
                        //as the last object is the dominant one we use unshift and not push
                        aExtendArgs.unshift(oOvpConfig);
                    }
                    oManifest = oManifest.getParent();
                }
                //add an empty object for the merged config as we don't whant to change the actual manifest objects
                aExtendArgs.unshift({});
                //add deep flag so the merge would be recurcive
                aExtendArgs.unshift(true);
                oOvpConfig = jQuery.extend.apply(jQuery, aExtendArgs);
                return oOvpConfig;
            },

            /**
             *  Removing extra array elements in oSettings array
             *
             *  @param {object} oSettings - Original Manifest settings
             *  @param {object} oCustomerSettings - Customer Modified settings
             *  @private
             */
            _removeExtraArrayElements: function (oSettings, oCustomerSettings) {
                var aSetStaCon = oSettings["staticContent"],
                    aCusSetStaCon = oCustomerSettings["staticContent"],
                    aSetTabs = oSettings["tabs"],
                    aCusSetTabs = oCustomerSettings["tabs"];
                /**
                 *  Checking if there is staticContent Array
                 */
                if (aSetStaCon && aCusSetStaCon) {
                    /**
                     *  Checking if oSettings Array length is greater than oCustomerSettings
                     */
                    if (aSetStaCon.length > aCusSetStaCon.length) {
                        oSettings["staticContent"].splice(aCusSetStaCon.length, aSetStaCon.length - aCusSetStaCon.length);
                    }
                }

                /**
                 *  Checking if there is tabs Array
                 */
                if (aSetTabs && aCusSetTabs) {
                    /**
                     *  Checking if oSettings Array length is greater than oCustomerSettings
                     */
                    if (aSetTabs.length > aCusSetTabs.length) {
                        oSettings["tabs"].splice(aCusSetTabs.length, aSetTabs.length - aCusSetTabs.length);
                    }
                }
            },

            /**
             *  Emptying all array elements in oSettings array
             *
             *  @param {object} oSettings - Original Manifest settings
             *  @private
             */
            _emptyAllArrayElements: function (oSettings) {
                var aSetStaCon = oSettings["staticContent"],
                    aSetTabs = oSettings["tabs"], i;
                /**
                 *  Checking if there is staticContent Array
                 */
                if (aSetStaCon) {
                    /**
                     *  Emptying all array elements in staticContent array
                     */
                    for (i = 0; i < aSetStaCon.length; i++) {
                        oSettings["staticContent"][i] = {};
                    }
                }

                /**
                 *  Checking if there is tabs Array
                 */
                if (aSetTabs) {
                    /**
                     *  Emptying all array elements in tabs array
                     */
                    for (i = 0; i < aSetTabs.length; i++) {
                        oSettings["tabs"][i] = {};
                    }
                }
            },

            /**
             *  Returns an object after merging oObject2 inside oObject1
             *
             *  @param {object} oObject1 - First Object
             *  @param {object} oObject2 - Second Object
             *  @returns {object} - Merged Object
             *  @private
             */
            _mergeObjects: function (oObject1, oObject2) {
                for (var prop in oObject2) {
                    if (oObject2.hasOwnProperty(prop)) {
                        var val = oObject2[prop];
                        if (typeof val == "object" && oObject1[prop]) { // this also applies to arrays or null!
                            if (val.operation === "DELETE") {
                                delete oObject1[prop];
                            } else {
                                this._mergeObjects(oObject1[prop], val);
                            }
                        } else {
                            /**
                             *  This Scenario comes when we are trying to delete
                             *  the property which does not exists in the object
                             *
                             *  Skip assigning val to oObject1 for the current key
                             *  if val is an object containing "DELETE" operation
                             */
                            if (typeof val == "object" && !oObject1[prop] && val.operation === "DELETE") {
                                continue;
                            }
                            oObject1[prop] = val;
                        }
                    }
                }

                return oObject1;
            },

            /**
             *  Returns an object after merging layer settings object to the original settings object
             *
             *  @param {Object} oCard - Card Configuration Object
             *  @param {String} sLayer - Layer Name
             *  @returns {Object} - New Card Configuration Object
             *  @private
             */
            _mergeLayerObject: function (oCard, sLayer) {
                if (!oCard[sLayer + ".settings"]) {
                    return oCard;
                }

                var oSettings = jQuery.extend(true, {}, oCard["settings"]),
                    oCustomSettings = jQuery.extend(true, {}, oCard[sLayer + ".settings"]);
                /**
                 *  Handling case where oSettings has an array whose length
                 *  is greater than length of a similar array in oCustomSettings
                 *
                 *  Here we delete extra elements from oSettings array
                 */
                this._removeExtraArrayElements(oSettings, oCustomSettings);

                /**
                 *  Emptying all the array elements in oSettings to
                 *  remove unnecessary properties getting merged in final settings
                 */
                this._emptyAllArrayElements(oSettings);

                oCard["settings"] = this._mergeObjects(oSettings, oCustomSettings);

                return oCard;
            },

            /**
             *  Returns the card descriptor fully merged with Key User Changes
             *
             *  @param {object} oCard - Card descriptor
             *  @returns {object} - final card descriptor
             *  @private
             */
            _mergeKeyUserChanges: function (oCard) {
                if (!oCard.hasOwnProperty("customer.settings") && !oCard.hasOwnProperty("customer_base.settings") && !oCard.hasOwnProperty("vendor.settings")) {
                    return oCard;
                }

                /**
                 *  Priority of Layers
                 *  1. Vendor
                 *  2. Customer Base
                 *  3. Customer
                 */
                /**
                 *  Vendor Layer
                 */
                oCard = this._mergeLayerObject(oCard, "vendor");

                /**
                 *  Customer_Base Layer
                 */
                oCard = this._mergeLayerObject(oCard, "customer_base");

                /**
                 *  Customer Layer
                 */
                oCard = this._mergeLayerObject(oCard, "customer");

                return oCard;
            },

            /**
             * Returns the fully qualified name of an entity which is e.g. "com.sap.GL.ZAF.GL_ACCOUNT" from the specified type name.
             *
             * @param {string} sEntityTypeName - the entity Type name which needs to be converted
             * @returns {string} - the fully qualified name for this entity
             * @private
             */
            _getFullyQualifiedNameForEntity: function (sEntityTypeName, oFilterMetaModel) {
                var sNamespace, sResult;
                if (!sEntityTypeName) {
                    return "";
                }
                // if entity type name already has a ".", this means namespace is already there, just return it
                if (sEntityTypeName.indexOf(".") > -1) {
                    return sEntityTypeName;
                }

                //There can be multiple schemas each having a different namespace in a particular metadata, in such a scenario,
                //the below code will populate namespace from default entity container
                var oDefaultEntityContainer = oFilterMetaModel && oFilterMetaModel.getODataEntityContainer();

                sNamespace = oDefaultEntityContainer && oDefaultEntityContainer.namespace;
                if (sNamespace && !(sEntityTypeName.indexOf(sNamespace) > -1)) {
                    sResult = sNamespace + "." + sEntityTypeName;
                } else {
                    sResult = sEntityTypeName;
                }
                return sResult;
            },

            createXMLView: function (ovpConfig) {

                if (this.getRouter()) {
                    this.getRouter().initialize();
                }
                var appConfig = this.getMetadata().getManifestEntry("sap.app");
                var uiConfig = this.getMetadata().getManifestEntry("sap.ui");
                var sIcon = ObjectPath.get("icons.icon", uiConfig);

                var sComponentName = this.getMetadata().getComponentName();
                // sComponentNameForURL is created by replacing all the '.' to '/' to support sap.ui.require.toUrl API
                var sComponentNameForURL = sComponentName.replace(/\./g, "/");
                ovpConfig.baseUrl = sap.ui.require.toUrl(sComponentNameForURL);
                if (ovpConfig.smartVariantRequired === undefined || ovpConfig.smartVariantRequired === null) {
                    ovpConfig.smartVariantRequired = true;
                }
                if (ovpConfig.enableLiveFilter === undefined || ovpConfig.enableLiveFilter === null) {
                    ovpConfig.enableLiveFilter = true;
                }
                if (ovpConfig.showDateInRelativeFormat === undefined || ovpConfig.showDateInRelativeFormat === null) {
                    ovpConfig.showDateInRelativeFormat = true;
                }
                if (ovpConfig.useDateRangeType === undefined || ovpConfig.useDateRangeType === null) {
                    ovpConfig.useDateRangeType = false;
                }
                if (ovpConfig.bHeaderExpanded === undefined || ovpConfig.bHeaderExpanded === null) {
                    ovpConfig.bHeaderExpanded = false;
                }

                var oFilterModel = this.getModel(ovpConfig.globalFilterModel);
                var oFilterMetaModel = oFilterModel && oFilterModel.getMetaModel();
                this.setModel(oFilterModel);

                //If global filter entity set is provided, then populate entity type using that entity set
                if (ovpConfig.globalFilterEntitySet && ovpConfig.globalFilterEntitySet !== " ") {
                    var oEntitySet = oFilterMetaModel && oFilterMetaModel.getODataEntitySet(ovpConfig.globalFilterEntitySet);
                    ovpConfig.globalFilterEntityType = oEntitySet && oEntitySet.entityType;
                }

                //Get fully-qualified and non-qualified entity type name
                if (ovpConfig.globalFilterEntityType && ovpConfig.globalFilterEntityType !== " " &&
                    ovpConfig.globalFilterEntityType.length > 0) {
                    ovpConfig.globalFilterEntityType = this._getFullyQualifiedNameForEntity(
                        ovpConfig.globalFilterEntityType, oFilterMetaModel);
                    ovpConfig.globalFilterEntityTypeNQ = ovpConfig.globalFilterEntityType.split(".").pop();
                }
                var uiModel = new JSONModel(ovpConfig);
                uiModel.setProperty("/applicationId", ObjectPath.get("id", appConfig));
                uiModel.setProperty("/title", ObjectPath.get("title", appConfig));
                uiModel.setProperty("/description", ObjectPath.get("description", appConfig));

                if (sIcon) {
                    if (sIcon.indexOf("sap-icon") < 0 && sIcon.charAt(0) !== '/') {
                        sIcon = ovpConfig.baseUrl + "/" + sIcon;
                    }
                    uiModel.setProperty("/icon", sIcon);
                }

                //convert cards object into sorted array
                var oCards = ovpConfig.cards;
                var aCards = [];
                var oCard;
                for (var cardKey in oCards) {
                    if (oCards.hasOwnProperty(cardKey) && oCards[cardKey]) {
                        oCard = this._mergeKeyUserChanges(oCards[cardKey]);
                        oCard.id = cardKey;
                        aCards.push(oCard);
                    }
                }

                aCards.sort(function (card1, card2) {
                    if (card1.id < card2.id) {
                        return -1;
                    } else if (card1.id > card2.id) {
                        return 1;
                    } else {
                        return 0;
                    }
                });

                uiModel.setProperty("/cards", aCards);
                if (this.inResizableTestMode() === true) {
                    ovpConfig.containerLayout = "resizable";
                }

                // Layout switch: read 'containerLayout' property from manifest
                if (ovpConfig.containerLayout && ovpConfig.containerLayout === "resizable") {
                    uiModel.setProperty("/cardContainerFragment", "sap.ovp.app.DashboardCardContainer");
                    //Read all the property "/resizableLayout" from the manifest and set it to "/dashboardLayout" property
                    uiModel.setProperty("/dashboardLayout", ovpConfig.resizableLayout);
                    var oDblUtil = new DashboardLayoutUtil(uiModel);
                    this.setDashboardLayoutUtil(oDblUtil);
                } else {
                    // default + compatibility --> EasyScanLayout
                    uiModel.setProperty("/cardContainerFragment", this.getCardContainerFragment());
                }

                this.setModel(uiModel, "ui");

                /* What: Using Resource Bundle to get strings to display on error page. */
                var ovplibResourceBundle = this._getOvpLibResourceBundle();
                this.setModel(ovplibResourceBundle, "ovplibResourceBundle");
                var oEntityType = oFilterMetaModel && oFilterMetaModel.getODataEntityType(ovpConfig.globalFilterEntityType, true);
                /**
                 * power user
                 * temp
                 */
                var oView = sap.ui.view("mainView", {
                    height: "100%",
                    preprocessors: {
                        xml: {
                            bindingContexts: {
                                ui: uiModel.createBindingContext("/"),
                                meta: oFilterMetaModel.createBindingContext(oEntityType)
                            },
                            models: {
                                ui: uiModel,
                                meta: oFilterMetaModel
                            }
                        }
                    },
                    type: ViewType.XML,
                    viewName: "sap.ovp.app.Main",
                    async: true,
                  //To get the template for Overview Page Extensibility via UI Adaptation Editor tool
                    customData : [new CustomData({
                        key : "sap-ui-custom-settings",
                        value : {
							"sap.ui.dt" : {
                                "designtime": "sap/ovp/ui/OVPWrapper.designtime"
							}
                        }
                    })]
                });
                /**
                 * end
                 */

                return oView;
            },

            _showErrorPage: function () {
                /* About: this function
                 *  When: If error occurs and getMetaModel.loaded() promise gets rejected
                 *  How: Loads Error Page into the Root Container and sets Aggregation
                 */
                var oView = sap.ui.view({
                    height: "100%",
                    type: ViewType.XML,
                    viewName: "sap.ovp.app.Error"
                });
                /* What: Using Resource Bundle to get strings to display on error page. */
                var ovplibResourceBundle = this._getOvpLibResourceBundle();
                oView.setModel(ovplibResourceBundle, "ovplibResourceBundle");
                this.setAggregation("rootControl", oView);
                this.oContainer.invalidate();
            },

            _formParamString: function (oParams) {
                var aKeys = Object.keys(oParams);
                var index;
                var sParams = "?";
                for (index = 0; index < aKeys.length; index++) {
                    sParams = sParams + aKeys[index] + "=" + oParams[aKeys[index]] + "&";
                }
                return sParams.slice(0, -1);
            },

            _checkForAuthorizationForLineItems: function () {
                return new Promise(function (resolve, reject) {
                    var aAllIntents = [],
                        oCardsWithStaticContent = [];
                    var oOvpConfig = this.getOvpConfig();
                    var oCards = oOvpConfig["cards"];
                    for (var sCard in oCards) {
                        if (oCards.hasOwnProperty(sCard) && oCards[sCard]) {
                            var card = oCards[sCard];
                            var oSettings = card.settings;
                            if (card.template === "sap.ovp.cards.linklist" && oSettings.listFlavor === "standard" && oSettings.staticContent) {
                                var aStaticContent = oSettings.staticContent;
                                for (var i = 0; i < aStaticContent.length; i++) {
                                    if (aStaticContent[i].semanticObject || aStaticContent[i].action) {
                                        var sIntent = "#" + aStaticContent[i].semanticObject + "-" + aStaticContent[i].action;
                                        if (aStaticContent[i].params) {
                                            var sParams = this._formParamString(aStaticContent[i].params);
                                            sIntent = sIntent + sParams;
                                        }
                                        if (oCardsWithStaticContent.indexOf(sCard) === -1) {
                                            oCardsWithStaticContent.push(sCard);
                                        }
                                        if (aAllIntents.indexOf(sIntent) === -1) {
                                            aAllIntents.push(sIntent);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    this._oCardsWithStaticContent = oCardsWithStaticContent;

                    // Checks for the supported Intents for the user
                    if (sap.ushell && sap.ushell.Container) {
                        sap.ushell.Container.getService('CrossApplicationNavigation').isIntentSupported(aAllIntents)
                            .done(function (oResponse) {
                                var oOvpConfig = this.getOvpConfig();
                                for (var key in oResponse) {
                                    if (oResponse.hasOwnProperty(key) && oResponse[key].supported === false) {
                                        for (var i = 0; i < this._oCardsWithStaticContent.length; i++) {
                                            var aStaticContent = oOvpConfig["cards"][this._oCardsWithStaticContent[i]].settings.staticContent;

                                            for (var j = aStaticContent.length - 1; j >= 0; j--) {
                                                var sIntent = "#" + aStaticContent[j].semanticObject + "-" + aStaticContent[j].action;
                                                if (aStaticContent[j].params) {
                                                    var sParams = this._formParamString(aStaticContent[j].params);
                                                    sIntent = sIntent + sParams;
                                                }
                                                if (key === sIntent) {
                                                    aStaticContent.splice(j, 1);
                                                }
                                            }
                                            oOvpConfig["cards"][this._oCardsWithStaticContent[i]].settings.staticContent = aStaticContent;
                                        }
                                    }
                                }

                                delete this._oCardsWithStaticContent;

                                resolve(oOvpConfig);
                            }.bind(this))
                            .fail(function (oError) {
                                Log.error(oError);
                                reject(oError);
                            });
                    } else {
                        resolve(oOvpConfig);
                    }
                }.bind(this));
            },

            setContainer: function () {
                var ovpConfig = this.getOvpConfig();
                var oFilterModel = this.getModel(ovpConfig.globalFilterModel);
                // call overwritten setContainer (sets this.oContainer)
                UIComponent.prototype.setContainer.apply(this, arguments);

                if (oFilterModel && !this.getAggregation("rootControl")) {
                    Promise.all([
                        oFilterModel.getMetaModel().loaded(),
                        this._checkForAuthorizationForLineItems(ovpConfig),
                        OvpResources.pResourcePromise
                    ]).then(function (aResponse) {
                        this.oOvpConfig = aResponse[1];
                        // Do the templating once the metamodel is loaded
                        this.runAsOwner(function () {
                            var oView = this.createXMLView(this.oOvpConfig);
                            oView.loaded().then(function(){
                                this.setAggregation("rootControl", oView);
                                this.oContainer.invalidate();
                            }.bind(this));
                        }.bind(this));
                    }.bind(this));
                    oFilterModel.attachMetadataFailed(function () {
                        /*To show error page if metadata Model doesn't get loaded*/
                        this._showErrorPage();
                    }.bind(this));
                }
            },
            _getOvpLibResourceBundle: function () {
                if (!this.ovplibResourceBundle) {
                    var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ovp");
                    this.ovplibResourceBundle = oResourceBundle ? new ResourceModel({
                        bundleUrl: oResourceBundle.oUrlInfo.url,
                        bundle: oResourceBundle  //Reuse created bundle to stop extra network calls
                    }) : null;
                }
                return this.ovplibResourceBundle;
            },

            createMapForEntityContainer: function (oEntityContainer) {
                var oEntitySetMap = {};
                var oEntitySets = oEntityContainer.entitySet;
                for (var i = 0; i < oEntitySets.length; i++) {
                    oEntitySetMap[oEntitySets[i].name] = oEntitySets[i].entityType;
                }
                return oEntitySetMap;

            },

            //Changes to test the Resizable layout in running applications
            inResizableTestMode: function () {
                // get the URL parameter from the parent frame
                return this._getQueryParamUpToTop('resizableTest') == 'true';
            },

            _getQueryParamUpToTop: function (name) {
                var win = window;
                var val = this.getQueryParam(win.location.search, name);
                if (val != null) {
                    return val;
                }
                if (win == win.parent) {
                    return null;
                }
                win = win.parent;
                return null;
            },

            getQueryParam: function (query, name) {
                var val = null;
                if (!query) {
                    return val;
                }
                if (query.indexOf('?') != -1) {
                    query = query.substring(query.indexOf('?'));
                }
                if (query.length > 1 && query.indexOf(name) != -1) {
                    query = query.substring(1); // remove '?'
                    var params = query.split('&');
                    for (var i = 0; i < params.length; i++) {
                        var nameVal = params[i].split('=');
                        if (nameVal[0] == name) {
                            val = nameVal[1];
                            break;
                        }
                    }
                }
                return val;
            }
        });
    }
);