sap.ui.define(["sap/base/Log"],
    function (Log) {
        "use strict";

        var supportedCards = [
            "sap.ovp.cards.list",
            "sap.ovp.cards.table",
            "sap.ovp.cards.stack",
            "sap.ovp.cards.linklist",
            "sap.ovp.cards.charts.analytical",
            "sap.ovp.cards.charts.smart.chart",
            "sap.ovp.cards.charts.bubble",
            "sap.ovp.cards.charts.donut",
            "sap.ovp.cards.charts.line",
            "sap.ovp.cards.error"
        ];

        /**
         * Gives all the API supported card types
         *
         * @method getSupportedCardTypes
         * @returns {Array} supportedCards - Array of supported card types
         * @public
         */
        function getSupportedCardTypes() {
            return supportedCards;
        }

        /**
         * Does Error Handling for API
         *
         * @method errorHandlingForAPI
         * @param {String} sMessage - Error Message text
         * @param {Function} reject - reject function of promise
         * @param {Object} [oError] - Error in case of MetaModel loading or Component Creation is failed
         * @public
         */
        function errorHandlingForAPI(sMessage, reject, oError) {
            var oErrorObject = {};
            oErrorObject.message = sMessage;
            if (oError) {
                oErrorObject._oError = oError;
                oErrorObject.getActualError = function () {
                    return oErrorObject._oError;
                };
            }
            Log.error(oErrorObject.message);
            reject(oErrorObject);
        }

        /**
         * Check Whether API is used or not
         *
         * @method checkIfAPIIsUsed
         * @param {Object} oContext - Current Context
         * @returns {boolean} bCheckForAPI - It will be true if API is used else false
         * @public
         */
        function checkIfAPIIsUsed(oContext) {
            var bCheckForAPI = false;
            var oOwnerComponent = oContext.getOwnerComponent();
            if (!!oOwnerComponent) {
                var oComponentData = oOwnerComponent.getComponentData();
                if (!!oComponentData && oComponentData.ovpCardsAsApi) {
                    bCheckForAPI = true;
                }
            }
            return bCheckForAPI;
        }

        /**
         * Recreate OVP Cards for View Switch
         * API support for View Switch
         *
         * @method recreateCard
         * @param {Object} oCardProperties - Card's updated properties for view switch
         * @param {Object} oComponentData - Card's Component Data
         * @public
         */
        function recreateCard(oCardProperties, oComponentData) {
            var oManifest = oComponentData.manifest;
            var sCardId;
            for (var card in oManifest.cards) {
                sCardId = card;
            }
            var oCard = oManifest.cards[sCardId];
            if (oCard.template === "sap.ovp.cards.charts.analytical" || oCard.template === "sap.ovp.cards.charts.smart.chart") {
                oCard.settings.chartAnnotationPath = oCardProperties.chartAnnotationPath;
                oCard.settings.navigation = oCardProperties.navigation;
            }
            if (oCardProperties.entitySet) {
                oCard.settings.entitySet = oCardProperties.entitySet;
            }
            oCard.settings.annotationPath = oCardProperties.annotationPath;
            oCard.settings.dynamicSubtitleAnnotationPath = oCardProperties.dynamicSubtitleAnnotationPath;
            oCard.settings.presentationAnnotationPath = oCardProperties.presentationAnnotationPath;
            oCard.settings.selectionAnnotationPath = oCardProperties.selectionAnnotationPath;
            oCard.settings.selectionPresentationAnnotationPath = oCardProperties.selectionPresentationAnnotationPath;
            oCard.settings.kpiAnnotationPath = oCardProperties.kpiAnnotationPath;
            oCard.settings.dataPointAnnotationPath = oCardProperties.dataPointAnnotationPath;
            oCard.settings.identificationAnnotationPath = oCardProperties.identificationAnnotationPath;
            // headerAnnotationPath is a property added to the manifest.json for Qualifier support in HeaderInfo annotations.
            oCard.settings.headerAnnotationPath = oCardProperties.headerAnnotationPath;
            oCard.settings.selectedKey = oCardProperties.selectedKey;
            if (oCard) {
                oManifest.cards[sCardId] = oCard;
                oOVPCardAsAPIUtils.createCardComponent(oComponentData.parentView, oManifest, oComponentData.containerId, oComponentData.selectionVariant);
            }
        }

        /**
         * Check if CardType should contain model or not
         *
         * @method _checkIfModelExists
         * @param {Object} oCardManifest - Card Manifest
         * @returns {boolean} bCheckIfModel - It will be true if Model exists for this CardType else false
         * @private
         */
        function _checkIfModelExists(oCardManifest) {
            var bCheckIfModel = true;

            // For Static Link List Card and Error Card Model is not required
            if (oCardManifest.template === "sap.ovp.cards.error" || (oCardManifest.template === "sap.ovp.cards.linklist" && oCardManifest.settings.staticContent)) {
                bCheckIfModel = false;
            }
            return bCheckIfModel;
        }

        /**
         * This function is used to filter Card Model using Selection Variant.
         *
         * @method _filterModel
         * @param {Object} oCardManifest - Card Manifest
         * @param {Object} oSelectionVariant - Selection Variant
         * @returns {Object} - returns an updated card Manifest
         * @private
         */
        function _filterModel(oCardManifest, oSelectionVariant) {
            var aFilters = [], aParameters = [], i, j;
            /**
             * Example for Filters in form of SelectOption and Parameters
             * var oSelectionVariant = new sap.ui.generic.app.navigation.service.SelectionVariant();
             * oSelectionVariant.addSelectOption('TotalSalesForecast', "I", "BT", '3000', '3500');
             * oSelectionVariant.addSelectOption('TotalSalesForecast', "I", "BT", '3500', '4000');
             * oSelectionVariant.addParameter('Product', 'Silverberry');
             */

            /**
             * Adding all the filters to aFilters Array
             */
            var aSelectOptionPropertyNames = oSelectionVariant.getSelectOptionsPropertyNames();
            for (i = 0; i < aSelectOptionPropertyNames.length; i++) {
                var aSelectOption = oSelectionVariant.getSelectOption(aSelectOptionPropertyNames[i]);
                if (aSelectOption && aSelectOption.length > 0) {
                    for (j = 0; j < aSelectOption.length; j++) {
                        if (aSelectOption[j]) {
                            var oFilters = {
                                path: aSelectOptionPropertyNames[i],
                                operator: aSelectOption[j].Option,
                                value1: aSelectOption[j].Low,
                                sign: aSelectOption[j].Sign
                            };
                            if (aSelectOption[j].High) {
                                oFilters.value2 = aSelectOption[j].High;
                            }
                            aFilters.push(oFilters);
                        }
                    }
                }
            }

            /**
             * Adding all the parameters to aParameters Array
             */
            var aParameterNames = oSelectionVariant.getParameterNames();
            for (i = 0; i < aParameterNames.length; i++) {
                var oParameters = {
                    path: aParameterNames[i],
                    value: oSelectionVariant.getParameter(aParameterNames[i])
                };
                aParameters.push(oParameters);
            }

            oCardManifest.settings.filters = aFilters;
            oCardManifest.settings.parameters = aParameters;
            return oCardManifest;
        }

        /**
         * Creating OVP Cards for External Libraries
         *
         * @method createCardComponent
         * @param {Object} oView - View where the card's component will be set to a Container
         * @param {Object} oManifest - Manifest settings object
         * @param {String} sContainerId - Container's Id where card's component will be set
         * @param {Object} oSelectionVariant - Selection Variant Object
         * @param {Function} fnCheckNavigation - Custom Navigation check function returning true or false
         * @returns {Promise} - returns a promise on state of card creation
         */
        function createCardComponent(oView, oManifest, sContainerId, oSelectionVariant, fnCheckNavigation) {
            return new Promise(function (resolve, reject) {
                var oCardManifest, cardId, sMessage = "";
                if (!!oManifest) {
                    for (var card in oManifest.cards) {
                        if (oManifest.cards.hasOwnProperty(card)) {
                            oCardManifest = oManifest.cards[card];
                            cardId = card;
                        }
                    }
                    if (!!oCardManifest && !!cardId) {
                        if (!!oCardManifest.template && !!oCardManifest.settings && (!!oCardManifest.model || !_checkIfModelExists(oCardManifest))) {
                            /*
                             Checking for the supported Cards in the API
                             */
                            if (supportedCards.indexOf(oCardManifest.template) !== -1) {
                                if (!!sContainerId && typeof sContainerId === 'string') {
                                    if (!!oView) {
                                        var oModel = (!oCardManifest.model) ? undefined : oView.getModel(oCardManifest.model);
                                        var getMetaModelPromise;
                                        if (!_checkIfModelExists(oCardManifest)) {
                                            getMetaModelPromise = Promise.resolve();
                                        } else {
                                            // Other Card's with data source
                                            getMetaModelPromise = oModel.getMetaModel().loaded();
                                        }
                                        getMetaModelPromise.then(function () {
                                            var bIgnoreSelectionVariant = false;
                                            if (oSelectionVariant) {
                                                oCardManifest = _filterModel(oCardManifest, oSelectionVariant);
                                                bIgnoreSelectionVariant = true;
                                            }
                                            oCardManifest.settings.ignoreSelectionVariant = bIgnoreSelectionVariant;
                                            //alert("MetaModel Loaded");
                                            var oComponentConfig = {
                                                async: true,
                                                name: oCardManifest.template,
                                                componentData: {
                                                    model: oModel,
                                                    ovpCardsAsApi: true,
                                                    parentView: oView,
                                                    manifest: oManifest,
                                                    containerId: sContainerId,
                                                    selectionVariant: oSelectionVariant,
                                                    fnCheckNavigation: fnCheckNavigation,
                                                    showDateInRelativeFormat: oManifest.showDateInRelativeFormat,
                                                    disableTableCardFlexibility: oManifest.disableTableCardFlexibility,
                                                    template: oCardManifest.template,
                                                    i18n: oView.getModel("@i18n"),
                                                    cardId: cardId,
                                                    settings: oCardManifest.settings,
                                                    appComponent: null,
                                                    mainComponent: null
                                                }
                                            };
                                            //Component creation will be done asynchronously
                                            sap.ui.component(oComponentConfig).then(function (oComponent) {

                                                var oComponentContainer = oView.byId(sContainerId);
                                                if (!!oComponentContainer) {
                                                    var oOldCard = oComponentContainer.getComponentInstance();

                                                    //Add the card component to the container
                                                    oComponent.setModel(oModel);
                                                    oComponentContainer.setComponent(oComponent);

                                                    //Destroy any old card
                                                    if (oOldCard) {
                                                        //currently the old component is not destroyed when setting a different component
                                                        //so we need to do that in timeout to make sure that it will not be destroyed
                                                        //too early, before real card will be rendered on the screen.
                                                        setTimeout(function () {
                                                            oOldCard.destroy();
                                                        }, 0);
                                                    }
                                                    resolve(true);
                                                } else {
                                                    sMessage = "Component Container '" + sContainerId + "' is not present in the current View";
                                                    errorHandlingForAPI(sMessage, reject);
                                                }

                                            }, function (oError) {
                                                sMessage = "Component creation failed";
                                                errorHandlingForAPI(sMessage, reject, oError);
                                            });
                                        }, function (oError) {
                                            sMessage = "MetaModel was not loaded";
                                            errorHandlingForAPI(sMessage, reject, oError);
                                        });
                                    } else {
                                        sMessage = "First argument oView is null";
                                        errorHandlingForAPI(sMessage, reject);
                                    }
                                } else {
                                    sMessage = "ContainerId should be of type string and not null";
                                    errorHandlingForAPI(sMessage, reject);
                                }
                            } else {
                                sMessage = oCardManifest.template + " card type is not supported in the API";
                                errorHandlingForAPI(sMessage, reject);
                            }
                        } else {
                            sMessage = "Cards template or model or settings are not defined";
                            errorHandlingForAPI(sMessage, reject);
                        }
                    } else {
                        sMessage = "Cards manifest entry or cardId is null";
                        errorHandlingForAPI(sMessage, reject);
                    }
                } else {
                    sMessage = "Second argument oManifest is null";
                    errorHandlingForAPI(sMessage, reject);
                }
            });
        }

        var oOVPCardAsAPIUtils = {
            createCardComponent: createCardComponent,
            recreateCard: recreateCard,
            checkIfAPIIsUsed: checkIfAPIIsUsed,
            getSupportedCardTypes: getSupportedCardTypes
        };

        return oOVPCardAsAPIUtils;
    },
    /* bExport= */true);
