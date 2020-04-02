sap.ui.define(["sap/ui/thirdparty/jquery", "sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel",
        "sap/ovp/cards/CommonUtils", "sap/ui/Device", "sap/ui/model/resource/ResourceModel",
    "sap/ui/core/mvc/ViewType"],
    function (jQuery, UIComponent, JSONModel, CommonUtils, Device, ResourceModel, ViewType) {
        "use strict";

        return UIComponent.extend("sap.ovp.cards.generic.Component", {
            // use inline declaration instead of component.json to save 1 round trip
            metadata: {
                properties: {
                    "contentFragment": {
                        "type": "string"
                    },
                    "controllerName": {
                        "type": "string",
                        "defaultValue": "sap.ovp.cards.generic.Card"
                    },
                    "headerExtensionFragment": {
                        "type": "string"
                    },
                    "contentPosition": {
                        "type": "string",
                        "defaultValue": "Middle"
                    },
                    "headerFragment": {
                        "type": "string",
                        "defaultValue": "sap.ovp.cards.generic.Header"
                    },
                    "footerFragment": {
                        "type": "string"
                    },
                    "identificationAnnotationPath": {
                        "type": "string",
                        "defaultValue": "com.sap.vocabularies.UI.v1.Identification"
                    },
                    "selectionAnnotationPath": {
                        "type": "string"
                    },
                    "filters": {
                        "type": "object"
                    },
                    "parameters": {
                        "type": "object"
                    },
                    "addODataSelect": {
                        "type": "boolean",
                        "defaultValue": false
                    }
                },
                version: "1.74.0",

                library: "sap.ovp",

                includes: [],

                dependencies: {
                    libs: [],
                    components: []
                },
                config: {}
            },

            /**
             * Sets the selectionAnnotationPath into the oSettings object
             * @param oSelectionVariantPath
             * @param oSettings
             */
            setSelectionVariant: function (sSelectionVariantPath, oSettings) {
                if (/^@/.test(sSelectionVariantPath)) {
                    sSelectionVariantPath = sSelectionVariantPath.slice(1);
                }
                oSettings.selectionAnnotationPath = sSelectionVariantPath;
            },

            /**
             * Sets the presentationvariant and visualization properties into
             * the osettings object
             * @param oPresentationVariantPath
             * @param oSettings
             * @param oEntityType
             */
            setPresentationVariant: function (sPresentationVariantPath, oSettings, oEntityType) {
                if (/^@/.test(sPresentationVariantPath)) {
                    sPresentationVariantPath = sPresentationVariantPath.slice(1);
                }
                oSettings.presentationAnnotationPath = sPresentationVariantPath;
                var splitedPresentationVariantPath = sPresentationVariantPath.split("/");
                var aVisualizations = splitedPresentationVariantPath.length === 1 ? oEntityType[sPresentationVariantPath].Visualizations : oEntityType[splitedPresentationVariantPath[0]][splitedPresentationVariantPath[1]][splitedPresentationVariantPath[2]].Visualizations;
                var index;

                /*
                 *   For annotationPath (LineItem) in Visualizations
                 * */
                for (index = 0; index < aVisualizations.length; index++) {
                    var sVisualizations = aVisualizations[index].AnnotationPath;
                    if (sVisualizations) {
                        if (/^@/.test(sVisualizations)) {
                            sVisualizations = sVisualizations.slice(1);
                        }
                        if (/.LineItem/.test(sVisualizations)) {
                            oSettings.annotationPath = sVisualizations;
                            break;
                        }
                    }
                }

                /*
                 *   For chartAnnotationPath (Chart) in Visualizations
                 * */
                for (index = 0; index < aVisualizations.length; index++) {
                    var sVisualizations = aVisualizations[index].AnnotationPath;
                    if (sVisualizations) {
                        if (/^@/.test(sVisualizations)) {
                            sVisualizations = sVisualizations.slice(1);
                        }
                        if (/.Chart/.test(sVisualizations)) {
                            oSettings.chartAnnotationPath = sVisualizations;
                            break;
                        }
                    }
                }
            },

            setDataPointAnnotationPath: function (sDataPointAnnotationPath, oSettings) {
                if (/^@/.test(sDataPointAnnotationPath)) {
                    sDataPointAnnotationPath = sDataPointAnnotationPath.slice(1);
                }
                oSettings.dataPointAnnotationPath = sDataPointAnnotationPath;
            },

            /**
             * Default "abstract" empty function.
             * In case there is a need to enrich the default preprocessor which provided by OVP, the extended Component should provide this function and return a preprocessor object.
             * @public
             * @returns {Object} SAPUI5 preprocessor object
             */
            getCustomPreprocessor: function () {
            },

            getPreprocessors: function (pOvplibResourceBundle) {
                var oComponentData = this.getComponentData(),
                    oSettings = oComponentData.settings,
                    oModel = oComponentData.model,
                    oMetaModel,
                    oEntityType,
                    oEntityTypeContext,
                    oEntitySetContext;

                //Backwards compatibility to support "description" property
                if (oSettings.description && !oSettings.subTitle) {
                    oSettings.subTitle = oSettings.description;
                }
                if (oModel) {
                    oMetaModel = oModel.getMetaModel();
                    if (oSettings.entitySet) {
                        var oEntitySet = oMetaModel.getODataEntitySet(oSettings.entitySet);
                        var sEntitySetPath = oMetaModel.getODataEntitySet(oSettings.entitySet, true);
                        oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);

                        oEntitySetContext = oMetaModel.createBindingContext(sEntitySetPath);
                        oEntityTypeContext = oMetaModel.createBindingContext(oEntityType.$path);
                    }
                }

                var oCardProperties = this._getCardPropertyDefaults();
                var oCardLayoutData = this._completeLayoutDefaults(oCardProperties, oSettings);
                //To get Global Parameters
                var showDateInRelativeFormat, disableTableCardFlexibility;
                if (oComponentData.appComponent && oComponentData.appComponent.getModel("ui") &&
                    oComponentData.appComponent.getModel("ui").oData) {
                        var appComponentData = oComponentData.appComponent.getModel("ui").oData;
                        showDateInRelativeFormat = appComponentData.showDateInRelativeFormat;
                        disableTableCardFlexibility = appComponentData.disableTableCardFlexibility;
                } else {
                    if (oComponentData.showDateInRelativeFormat) {
                        showDateInRelativeFormat = oComponentData.showDateInRelativeFormat;
                    }
                    if (oComponentData.disableTableCardFlexibility) {
                        disableTableCardFlexibility = oComponentData.disableTableCardFlexibility;
                    }
                }
                var oAdditionalData = {
                    metaModel: oMetaModel,
                    entityType: oEntityType,
                    webkitSupport: Device.browser.webkit,
                    layoutDetail: oCardLayoutData && oCardLayoutData.cardLayout ? oCardLayoutData.cardLayout.containerLayout : 'fixed',
                    showDateInRelativeFormat: showDateInRelativeFormat,
                    disableTableCardFlexibility: disableTableCardFlexibility,
                    cardId: oComponentData.cardId
                };
                if (!!oComponentData && !!oComponentData.cardId) {
                    var oMainComponent = oComponentData.mainComponent;
                    var oTemplate = null;
                    if (!!oMainComponent) {
                        oTemplate = oMainComponent._getCardFromManifest(oComponentData.cardId) ? oMainComponent._getCardFromManifest(oComponentData.cardId).template : null;
                    } else {
                        oTemplate = oComponentData.template;
                    }
                    if (!!oTemplate) {
                        oAdditionalData.template = oTemplate;
                    }
                }
                //set the densityProperty for the card
                oCardProperties.densityStyle = CommonUtils._setCardpropertyDensityAttribute();
                if (oComponentData.errorReason) {
                    var oErrorReason = oComponentData.errorReason;
                    var oParameters = oErrorReason.getParameters();
                    var sErrorIcon = "sap-icon://message-error";
                    if (oParameters && oParameters.response) {
                        oCardProperties.errorStatusCode = oParameters.response.statusCode;
                        oCardProperties.errorStatusText = oParameters.response.statusText;
                        oCardProperties.responseText = oParameters.response.responseText;
                        oCardProperties.sMessageIcon = oParameters.response.sIcon ? oParameters.response.sIcon : sErrorIcon;
                    }
                }
                if (oCardLayoutData) {
                    oAdditionalData.cardLayout = oCardLayoutData.cardLayout;
                }

                /**
                 * Setting selectionAnnotationPath, presentationAnnotationPath
                 * annotationPath and chartAnnotationPath
                 * using selectionPresentationAnnotationPath if
                 * SelectionPresentationVariant is present in annotations
                 */
                if (oCardProperties.state !== "Loading" && oCardProperties.state !== "Error") {
                    // The kpi annotation gets the first preference here, if a kpi annotation is defined, the selection
                    // and presentation variants are picked up from the kpi annotation
                    if (oSettings && oSettings.kpiAnnotationPath) {
                        var oKpiAnnotation = oEntityType[oSettings.kpiAnnotationPath];
                        var contentFragment = oCardProperties.contentFragment;
                        if (oKpiAnnotation && (contentFragment === "sap.ovp.cards.charts.analytical.analyticalChart" || contentFragment === "sap.ovp.cards.charts.smart.analyticalChart")) {
                            var sSelectionVariantPath = oKpiAnnotation.SelectionVariant && oKpiAnnotation.SelectionVariant.Path ? oKpiAnnotation.SelectionVariant.Path : oSettings.kpiAnnotationPath + "/SelectionVariant";
                            if (sSelectionVariantPath) {
                                this.setSelectionVariant(sSelectionVariantPath, oSettings);
                            }
                            var sPresentationVariantPath = oKpiAnnotation.Detail && oKpiAnnotation.Detail.DefaultPresentationVariant && oKpiAnnotation.Detail.DefaultPresentationVariant.Path ? oKpiAnnotation.Detail.DefaultPresentationVariant.Path : oSettings.kpiAnnotationPath + "/Detail/DefaultPresentationVariant";
                            if (sPresentationVariantPath) {
                                this.setPresentationVariant(sPresentationVariantPath, oSettings, oEntityType);
                            }
                            var sDataPointAnnotationPath = oKpiAnnotation.DataPoint && oKpiAnnotation.DataPoint.Path ? oKpiAnnotation.DataPoint.Path : oSettings.kpiAnnotationPath + "/DataPoint";
                            if (sDataPointAnnotationPath) {
                                this.setDataPointAnnotationPath(sDataPointAnnotationPath, oSettings);
                            }

                        }
                    } else if (oSettings && oSettings.selectionPresentationAnnotationPath) {
                        var oSelectionPresentationVariant = oEntityType[oSettings.selectionPresentationAnnotationPath];
                        if (oSelectionPresentationVariant) {
                            var sSelectionVariantPath = oSelectionPresentationVariant.SelectionVariant && oSelectionPresentationVariant.SelectionVariant.Path;
                            if (sSelectionVariantPath) {
                                this.setSelectionVariant(sSelectionVariantPath, oSettings);
                            }
                            var sPresentationVariantPath = oSelectionPresentationVariant.PresentationVariant && oSelectionPresentationVariant.PresentationVariant.Path;
                            if (sPresentationVariantPath) {
                                this.setPresentationVariant(sPresentationVariantPath, oSettings, oEntityType);
                            }
                        }
                    }
                }

                /**
                 * For External filters in API
                 * Remove Selection Variant From card settings
                 * Static Id's for External filter text in KPI Header
                 */
                if (oComponentData.ovpCardsAsApi && oSettings.ignoreSelectionVariant) {
                    oSettings.selectionAnnotationPath = "";
                    var aIdForExternalFilters = [];
                    for (var counter = 0; !!oSettings.filters && counter < oSettings.filters.length; counter++) {
                        aIdForExternalFilters.push({
                            id: "headerFilterText--" + (counter + 1),
                            index: counter
                        });
                    }
                    oSettings.idForExternalFilters = aIdForExternalFilters;
                }

                /*
                 *   Static Id's for Selection Variant text in KPI Header
                 * */

                if (!!oAdditionalData.entityType && !!oSettings.selectionAnnotationPath && !!oAdditionalData.entityType[oSettings.selectionAnnotationPath]) {
                    var oSelectOptions = oAdditionalData.entityType[oSettings.selectionAnnotationPath].SelectOptions;
                    for (var select = 0; !!oSelectOptions && select < oSelectOptions.length; select++) {
                        oSelectOptions[select].id = "headerFilterText--" + (select + 1);
                    }
                    oAdditionalData.entityType[oSettings.selectionAnnotationPath].SelectOptions = oSelectOptions;
                }

                /*
                 *   Static Id's for LinkList Static Card having list Flavour Standard
                 * */

                if (oAdditionalData.template === "sap.ovp.cards.linklist" && !!oSettings.staticContent) {
                    for (var i = 0; i < oSettings.staticContent.length; i++) {
                        oSettings.staticContent[i].id = "linkListItem--" + (i + 1);
                    }
                }

                if (oAdditionalData.template === 'sap.ovp.cards.charts.analytical') {
                    oSettings.dataStep = oSettings.dataStep ? oSettings.dataStep : 10;
                }
                oCardProperties = jQuery.extend(true, {}, oAdditionalData, oCardProperties, oSettings);
                var oOvpCardPropertiesModel = new JSONModel(oCardProperties);
                //var ovplibResourceBundle = this.getOvplibResourceBundle();

                // device model
                var oDeviceModel = new JSONModel(Device);
                oDeviceModel.setDefaultBindingMode("OneWay");

                var sConstants = {
                    dontIncludeUOM: true,
                    firstDataPointIndex: 0,
                    secondDataPointIndex: 1,
                    thirdDataPointIndex: 2,
                    fourthDataPointIndex: 3,
                    fifthDataPointIndex: 4,
                    sixthDataPointIndex: 5,
                    firstDataFieldIndex: 0,
                    secondDataFieldIndex: 1,
                    thirdDataFieldIndex: 2,
                    fourthDataFieldIndex: 3,
                    fifthDataFieldIndex: 4,
                    sixthDataFieldIndex: 5
                };
                var ovpConstantsModel = new JSONModel(sConstants);

                var oDefaultPreprocessors = {
                    xml: {
                        bindingContexts: {
                            entityType: oEntityTypeContext,
                            entitySet: oEntitySetContext
                        },
                        models: {
                            device: oDeviceModel,
                            entityType: oMetaModel,
                            entitySet: oMetaModel,
                            ovpMeta: oMetaModel,
                            ovpCardProperties: oOvpCardPropertiesModel,
                            ovplibResourceBundle: pOvplibResourceBundle,
                            ovpConstants: ovpConstantsModel
                        },
                        ovpCardProperties: oOvpCardPropertiesModel,
                        dataModel: oModel,
                        _ovpCache: {}
                    }
                };
                return jQuery.extend(true, {}, this.getCustomPreprocessor(), oDefaultPreprocessors);
            },

            _completeLayoutDefaults: function (oCardProperties, oSettings) {
                var oCardLayoutData = {},
                    oComponentData = this.getComponentData(),
                    oConfig = null,
                    oDashboardUtil = null;
                if (oComponentData.appComponent) {
                    oConfig = oComponentData.appComponent.getOvpConfig();
                }
                if (!oConfig) {
                    return null;
                }
                if (oConfig.containerLayout === "resizable" && oComponentData.cardId && oCardProperties.contentFragment !== "sap.ovp.cards.quickview.Quickview") {
                    oDashboardUtil = oComponentData.appComponent.getDashboardLayoutUtil();
                    //in resizable card layout each card may contain layout data -> use this if available
                    var sCardId = oComponentData.cardId;
                    var oCardObj = oDashboardUtil.aCards.filter(function (item) {
                        return item.id === sCardId;
                    });
                    oCardLayoutData.cardLayout = oCardObj[0].dashboardLayout;
                    oCardLayoutData.cardLayout.containerLayout = oConfig.containerLayout;
                    oCardLayoutData.cardLayout.iRowHeightPx = oDashboardUtil.ROW_HEIGHT_PX;
                    oCardLayoutData.cardLayout.iCardBorderPx = oDashboardUtil.CARD_BORDER_PX;
                    oCardLayoutData.cardLayout.headerHeight = oCardObj[0].dashboardLayout.headerHeight;
                }
                return oCardLayoutData;
            },

            _getCardPropertyDefaults: function () {
                var oCardProperties = {};
                var oPropsDef = this.getMetadata().getAllProperties();
                var oPropDef;
                for (var propName in oPropsDef) {
                    oPropDef = oPropsDef[propName];
                    if (oPropDef.defaultValue !== undefined) {
                        oCardProperties[oPropDef.name] = oPropDef.defaultValue;
                    }
                }
                return oCardProperties;
            },

            getOvplibResourceBundle: function () {
                if (!this.ovplibResourceBundle) {
                    var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ovp");
                    this.ovplibResourceBundle = oResourceBundle ? new ResourceModel({
                        bundleUrl: oResourceBundle.oUrlInfo.url
                    }) : null;
                }
                return this.ovplibResourceBundle;
            },

            /* Function to calculate the cache keys for the view
             * "useViewCache" is the manifest entry
             * @returns {array}
             * @private
             * */
            _getCacheKeys: function () {

                //Switch off view cache, uncomment below code to switch on again

                /*var oComponentData = this.getComponentData && this.getComponentData();
                 var bIsObjectStream = oComponentData && oComponentData.settings &&
                 oComponentData.settings.isObjectStream;
                 //No cache required for object streams (quick view card)
                 if (bIsObjectStream) {
                 return;
                 }

                 var oModel = oComponentData && oComponentData.model;
                 if (oModel) {
                 var aCacheKeys = [];
                 var pGetMetadataLastModified = oModel.metadataLoaded().then(function (mParams) {
                 var sCacheKey;
                 if (mParams && mParams.lastModified) {
                 sCacheKey = new Date(mParams.lastModified).getTime() + "";
                 } else {
                 jQuery.sap.log.error("No valid cache key segment last modification date provided by the OData Model");
                 sCacheKey = new Date().getTime() + ""; //to keep the application working the current timestamp is used
                 }
                 return sCacheKey;
                 });

                 aCacheKeys.push(pGetMetadataLastModified);

                 var pGetAnnotationsLastModified = oModel.annotationsLoaded().then(function (mParams) {
                 var iCacheKey = 0;
                 if (mParams) {
                 for (var i = 0; i < mParams.length; i++) {
                 if (mParams[i].lastModified) {
                 var iLastModified = new Date(mParams[i].lastModified).getTime();
                 if (iLastModified > iCacheKey) {
                 iCacheKey = iLastModified;
                 }
                 }
                 }
                 }
                 if (iCacheKey === 0) {
                 jQuery.sap.log.error("No valid cache key segment last modification date provided by OData annotations");
                 iCacheKey = new Date().getTime(); //to keep the application working the current timestamp is used
                 }
                 return iCacheKey + "";
                 });
                 aCacheKeys.push(pGetAnnotationsLastModified);
                 return aCacheKeys;
                 }*/
            },

            createContent: function () {
                var oComponentData = this.getComponentData && this.getComponentData();
                var oModel = oComponentData.model;
                var pOvplibResourceBundle;
                var oPreprocessors;

                var oMainComponent = oComponentData && oComponentData.mainComponent;
                var oModelViewMap = oMainComponent && oMainComponent.oModelViewMap;
                var sModelName = oComponentData && oComponentData.modelName;

                var fnCombineBatch = function () {
                    if (oModel && sModelName) {
                        oModel.bIncludeInCurrentBatch = false;
                        if (oModelViewMap && sModelName && oModelViewMap[sModelName] && oModelViewMap[sModelName][oComponentData.cardId]) {
                            delete oModelViewMap[sModelName][oComponentData.cardId]; //delete view being processed from map
                            //After deleting the current view from model map, if there are other views attached
                            //to the model then include them in current batch
                            if (Object.keys(oModelViewMap[sModelName]).length > 0) {
                                oModel.bIncludeInCurrentBatch = true;
                            }
                        }
                    }
                };

                if (oComponentData && oComponentData.mainComponent) {
                    pOvplibResourceBundle = oComponentData.mainComponent._getOvplibResourceBundle();
                } else {
                    pOvplibResourceBundle = this.getOvplibResourceBundle();
                }
                oPreprocessors = this.getPreprocessors(pOvplibResourceBundle);

                var oViewConfig = {
                    preprocessors: oPreprocessors,
                    type: ViewType.XML,
                    viewName: "sap.ovp.cards.generic.Card"
                };
                // Get the cache keys for the view, if present set the keys (async is
                // prerequisite for cached view)
                var aCacheKeys = this._getCacheKeys();
                if (aCacheKeys && aCacheKeys.length && aCacheKeys.length > 0) {
                    oViewConfig.async = true;
                    oViewConfig.cache = {
                        keys: aCacheKeys
                    };
                }
                /**
                 * power user
                 * temp change
                 */
                var sLoadingOrErrorState = this._getCardPropertyDefaults().state;
                var sIdForCardView = oComponentData.cardId + (sLoadingOrErrorState ? sLoadingOrErrorState : "Original");
                if (!sLoadingOrErrorState) {
                    sIdForCardView = sIdForCardView + (oComponentData.settings.selectedKey ? "_Tab" + oComponentData.settings.selectedKey : "");
                }

                if (oModel && oModel.bUseBatch && !oViewConfig.async) {
                    fnCombineBatch();
                }

                // if the card is for settings dialog, don't set an ID to the card view
                var oView = sap.ui.view(oComponentData.containerId === "dialogCard" ? undefined : sIdForCardView, oViewConfig);
                /**
                 * end
                 */

                //For async view creation, model read and request fire happens from
                //method onControllerConnected, so before this executes, insert some
                //custom code to handle model batch
                if (oViewConfig.async) {
                    var fnOnControllerConnected = oView.onControllerConnected;
                    oView.onControllerConnected = function () {
                        if (oModel && oModel.bUseBatch) {
                            fnCombineBatch();
                        }
                        fnOnControllerConnected.apply(oView, arguments);
                    };
                }

                oView.setModel(oModel);

                // check if i18n model is available and then add it to card view
                if (oComponentData.i18n) {
                    oView.setModel(oComponentData.i18n, "@i18n");
                }
                oView.setModel(oPreprocessors.xml.ovpCardProperties, "ovpCardProperties");
                oView.setModel(pOvplibResourceBundle, "ovplibResourceBundle");

                return oView;
            }

        });

    }
);