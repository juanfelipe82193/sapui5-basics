/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define([
        'sap/ui/thirdparty/jquery',
        "sap/ovp/cards/CommonUtils",
        'sap/ovp/cards/rta/SettingsDialogConstants',
        "sap/ovp/app/OVPUtils"
    ], function(jQuery, CommonUtils, SettingsConstants, OVPUtils) {
        "use strict";

        function generateId(sApplicationId, sCardId, sPath, sPropertyName) {
            return sApplicationId + "_sap.ovp.cards." + sCardId + "." + sPath + "." + sPropertyName;
        }
        function createTranslationTextObject(sValue) {
            return {
                "type": "XTIT",
                "maxLength": 40,
                "value": {
                    "": sValue
                }
            };
        }
        function createTranslationTextObjectForDTA() {
            return {
                "i18n":"../i18n/i18n.properties"
            };
        }
        function createArrayPathForPayLoad(sPathPrefix, iIndex, sPathSuffix) {
            var sPath = sPathPrefix + "[" + iIndex + "]";
            if (sPathSuffix) {
                sPath += "/" + sPathSuffix;
            }
            return sPath;
        }

        function searchCardIdInManifest(cardId, oMainComponent) {
            var aCards = oMainComponent._getCardsModel();
            for (var i = 0; i < aCards.length; i++) {
                if (aCards[i].id === cardId) {
                    return true;
                }
            }
            return false;
        }

        function createEntityPropertyChangeObject(propertyPath, operation, propertyValue) {
            var oEntityPropertyChange = {
                "propertyPath": propertyPath,
                "operation": operation
            };

            if (propertyValue) {
                oEntityPropertyChange["propertyValue"] = propertyValue;
            }

            return oEntityPropertyChange;
        }

        /**
         * Deleting unnecessary Manifest settings
         */
        function formatManifestSettings(oCardManifest) {
            delete oCardManifest.id;
            delete oCardManifest.dashboardLayout;
            delete oCardManifest.settings.baseUrl;
            delete oCardManifest.settings.cloneCard;
            delete oCardManifest.settings.newCard;
            delete oCardManifest["customer.settings"];
            delete oCardManifest["customer_base.settings"];
            delete oCardManifest["vendor.settings"];
            if (oCardManifest.settings["staticContent"]) {
                for (var i = 0; i < oCardManifest.settings["staticContent"].length; i++) {
                    delete oCardManifest.settings["staticContent"][i].id;
                }
            }
        }

        function createDeleteOperation(sNameSpace, sPath, oObjectToUpdate, sPropertyName) {
            /**
             *  If the property has to be updated on the object
             */
            if (oObjectToUpdate) {
                if (sNameSpace === CommonUtils._getLayerNamespace() + ".settings") {
                    oObjectToUpdate[sPropertyName] = {
                        operation: "DELETE"
                    };
                }
            } else {
                /**
                 *  Else create an entity property change payLoad
                 */
                if (sNameSpace === CommonUtils._getLayerNamespace() + ".settings") {
                    oPayLoadUtils.aEntityPropertyChange.push(createEntityPropertyChangeObject(sPath, "UPSERT", {
                        operation: "DELETE"
                    }));
                } else {
                    oPayLoadUtils.aEntityPropertyChange.push(createEntityPropertyChangeObject(sPath, "DELETE"));
                }
            }
        }

        /**
         *
         */
        function createCustomerSettingsChange(oCardManifest) {
            /**
             *  Push all changes in <LAYER>.settings object to change payLoad
             */
            oPayLoadUtils.aEntityPropertyChange.push(createEntityPropertyChangeObject(CommonUtils._getLayerNamespace() + ".settings", "UPSERT", oCardManifest[CommonUtils._getLayerNamespace() + ".settings"]));
        }

        /**
         * Method to create the text property change in DTA and RTA
         */
        function createTextPropertyChange(sIdPath, sPath, sPropertyName, sValue, oCardManifestSettings, oObjectToUpdate) {
            var sId;
            var layer = CommonUtils._getLayer();
            if (!oPayLoadUtils.oText) {
                oPayLoadUtils.oText = {};
            }

            if (!layer || layer === OVPUtils.Layers.customer) {
                sId = generateId(oPayLoadUtils.sApplicationId, oPayLoadUtils.sCardId, sIdPath, sPropertyName);
                oPayLoadUtils.oText[sId] = createTranslationTextObject(sValue);
            } else {
                var bRepeatedText = false;
                for (var key in oCardManifestSettings.ai18nProperties) {
                    if (oCardManifestSettings.ai18nProperties[key].value === sValue) {
                        sId = oCardManifestSettings.ai18nProperties[key].key;
                        bRepeatedText = true;
                        break;
                    }
                }
                if (!bRepeatedText) {
                    sId = generateId(oPayLoadUtils.sApplicationId, oPayLoadUtils.sCardId, sIdPath, sPropertyName);
                }
                oPayLoadUtils.oText[sId] = createTranslationTextObject(sValue);
            }
            /**
             *  If the property has to be updated on the object
             */
            if (oObjectToUpdate) {
                oObjectToUpdate[sPropertyName] = "{{" + sId + "}}";
            } else {
                /**
                 *  Else create an entity property change payLoad
                 */
                var sPropPath = sPath + "/" + sPropertyName;
                oPayLoadUtils.aEntityPropertyChange.push(createEntityPropertyChangeObject(sPropPath, "UPSERT", "{{" + sId + "}}"));
            }
        }

        /**
         *
         */
        function createTextChangesForSimpleCard(sNameSpace, oCardManifest, aTexts, bObjectToUpdate) {
            var newSettings = this._oCardManifestSettings,
                oldSettings = this._oOriginalCardManifestSettings;
            /**
             *  Looping through all text properties to detect text change
             */
            for (var i = 0; i < aTexts.length; i++) {
                /**
                 *  Condition where a property inside newSettings does not exist inside oldSettings
                 *  It is a case where a new text property is added
                 *  "Add" operation
                 *
                 *  Condition where a property inside newSettings value is changed w.r.t oldSettings
                 *  It is a case where a text property is updated
                 *  "Update" operation
                 */
                if ((!oldSettings[aTexts[i]] && newSettings[aTexts[i]]) ||
                    (oldSettings[aTexts[i]] && newSettings[aTexts[i]] && (oldSettings[aTexts[i]] != newSettings[aTexts[i]]))) {
                    /**
                     *  If the property has to be updated on the object
                     */
                    if (bObjectToUpdate) {
                        createTextPropertyChange(sNameSpace, sNameSpace, aTexts[i], newSettings[aTexts[i]], newSettings, oCardManifest[sNameSpace]);
                    } else {
                        /**
                         *  Else create an entity property change payLoad
                         */
                        createTextPropertyChange(sNameSpace, sNameSpace, aTexts[i], newSettings[aTexts[i]], newSettings);
                    }
                    var layer = CommonUtils._getLayer();
                    if (!layer || layer === OVPUtils.Layers.customer) {
			            oCardManifest.settings[aTexts[i]] = newSettings[aTexts[i]];
                    } else {
			            var oI18nValueProperty = SettingsConstants.oI18nValueProperty;
						if (oI18nValueProperty[aTexts[i]]) {
							oCardManifest.settings[aTexts[i]] = this._oCardManifestSettings[oI18nValueProperty[aTexts[i]]];
						} else {
						    oCardManifest.settings[aTexts[i]] = newSettings[aTexts[i]];
						}
                    }
                } else if (!newSettings[aTexts[i]] && oldSettings[aTexts[i]]) {
                    /**
                     *  It is a case where an old text property is deleted
                     *  "Delete" operation
                     */
                    /**
                     *  If the property has to be updated on the object
                     */
                    if (bObjectToUpdate) {
                        createDeleteOperation(sNameSpace, sNameSpace + "/" + aTexts[i], oCardManifest[sNameSpace], aTexts[i]);
                    } else {
                        /**
                         *  Else create an entity property change payLoad
                         */
                        createDeleteOperation(sNameSpace, sNameSpace + "/" + aTexts[i]);
                    }
                    delete oCardManifest.settings[aTexts[i]];
                }
            }
        }

        /**
         *
         */
        function createPropertyChange(sPath, sPropertyName, sValue, oObjectToUpdate) {
            var sPropPath = sPath + "/" + sPropertyName;
            /**
             *  If the property has to be updated on the object
             */
            if (oObjectToUpdate) {
                oObjectToUpdate[sPropertyName] = sValue;
            } else {
                /**
                 *  Else create an entity property change payLoad
                 */
                oPayLoadUtils.aEntityPropertyChange.push(createEntityPropertyChangeObject(sPropPath, "UPSERT", sValue));
            }
        }

        /**
         *
         */
        function createPropChangesForSimpleCard(sNameSpace, oCardManifest, aSettings, bObjectToUpdate) {
            var newSettings = this._oCardManifestSettings,
                oldSettings = this._oOriginalCardManifestSettings;
            /**
             *  Looping through all the other properties to detect property change
             */
            for (var i = 0; i < aSettings.length; i++) {
                /**
                 *  Condition where a property inside newSettings does not exist inside oldSettings
                 *  It is a case where a new property is added
                 *  "Add" operation
                 *
                 *  Condition where a property inside newSettings value is changed w.r.t oldSettings
                 *  It is a case where a property is updated
                 *  "Update" operation
                 */
                if ((!oldSettings[aSettings[i]] && newSettings[aSettings[i]]) ||
                    (oldSettings[aSettings[i]] && newSettings[aSettings[i]] && (oldSettings[aSettings[i]] != newSettings[aSettings[i]]))) {
                    /**
                     *  If the property has to be updated on the object
                     */
                    if (bObjectToUpdate) {
                        createPropertyChange(sNameSpace, aSettings[i], newSettings[aSettings[i]], oCardManifest[sNameSpace]);
                    } else {
                        /**
                         *  Else create an entity property change payLoad
                         */
                        createPropertyChange(sNameSpace, aSettings[i], newSettings[aSettings[i]]);
                    }
                    oCardManifest.settings[aSettings[i]] = newSettings[aSettings[i]];
                } else if (!newSettings[aSettings[i]] && oldSettings[aSettings[i]]) {
                    /**
                     *  It is a case where an old property is deleted
                     *  "Delete" operation
                     */
                    /**
                     *  If the property has to be updated on the object
                     */
                    if (bObjectToUpdate) {
                        createDeleteOperation(sNameSpace, sNameSpace + "/" + aSettings[i], oCardManifest[sNameSpace], aSettings[i]);
                    } else {
                        /**
                         *  Else create an entity property change payLoad
                         */
                        createDeleteOperation(sNameSpace, sNameSpace + "/" + aSettings[i]);
                    }
                    delete oCardManifest.settings[aSettings[i]];
                }
            }
        }

        /**
         *
         */
        function createForSimpleCard(sNameSpace, oCardManifest) {
            var aSettings = SettingsConstants.cardSettings["settings"],
                aTexts = SettingsConstants.cardSettings["text"];
            /**
             *  For case where changes are made on top of cards delivered by vendor
             *  Updating of the properties for such cards is done in <LAYER>.settings
             *  Instead of settings
             */
            if (sNameSpace === CommonUtils._getLayerNamespace() + ".settings") {
                /**
                 *  If there is <LAYER>.settings object inside card manifest
                 *  Example:-
                 *  "cardId" : {
                 *      "<LAYER>.settings": {...},
                 *      "settings": {...},
                 *      ...
                 *  }
                 */
                if (oCardManifest[CommonUtils._getLayerNamespace() + ".settings"]) {
                    /**
                     *  Settings containing text changes
                     */
                    createTextChangesForSimpleCard.bind(this)(sNameSpace, oCardManifest, aTexts, false);

                    /**
                     *  Settings containing other changes
                     */
                    createPropChangesForSimpleCard.bind(this)(sNameSpace, oCardManifest, aSettings, false);
                } else {
                    /**
                     *  There is no <LAYER>.settings object inside card manifest
                     *  Example:-
                     *  "cardId" : {
                     *      "settings": {...},
                     *      ...
                     *  }
                     */
                    oCardManifest[CommonUtils._getLayerNamespace() + ".settings"] = {};
                    /**
                     *  Settings containing text changes
                     */
                    createTextChangesForSimpleCard.bind(this)(sNameSpace, oCardManifest, aTexts, true);

                    /**
                     *  Settings containing other changes
                     */
                    createPropChangesForSimpleCard.bind(this)(sNameSpace, oCardManifest, aSettings, true);

                    createCustomerSettingsChange(oCardManifest);
                }
            } else {
                /**
                 *  For case where changes are made on top of cards delivered by customers
                 *  Updating of the properties for such cards is done in settings
                 */
                /**
                 *  Settings containing text changes
                 */
                createTextChangesForSimpleCard.bind(this)(sNameSpace, oCardManifest, aTexts, false);

                /**
                 *  Settings containing other changes
                 */
                createPropChangesForSimpleCard.bind(this)(sNameSpace, oCardManifest, aSettings, false);
            }
        }

        /**
         *
         */
        function createTextChangeForWholeArray(sNameSpace, oCardManifest, aNewArray, aTexts, sType, bObjectToUpdate) {
            var newCardSettings = this._oCardManifestSettings;
            var newSettings = newCardSettings[sType];

            /**
             *  Looping through all the elements of the Array
             */
            for (var i = 0; i < newSettings.length; i++) {
                /**
                 *  Looping through all text properties to detect text change
                 */
                for (var j = 0; j < aTexts.length; j++) {
                    /**
                     *  If Property value is not undefined
                     */
                    if (newSettings[i][aTexts[j]]) {
                        var sPath = createArrayPathForPayLoad(sNameSpace + "/" + sType, i),
                            sIdPath = sNameSpace + "." + sType + "." + i;

                        /**
                         *  If the property has to be updated on the object
                         */
                        if (bObjectToUpdate) {
                            createTextPropertyChange(sIdPath, sPath, aTexts[j], newSettings[i][aTexts[j]], newCardSettings, oCardManifest[sNameSpace][sType][i]);
                        } else {
                            /**
                             *  Else update property on temporary object aNewArray
                             */
                            createTextPropertyChange(sIdPath, sPath, aTexts[j], newSettings[i][aTexts[j]], newCardSettings, aNewArray[i]);
                        }
                    }
                }
            }

            /**
             *  Create an entity property change payLoad
             */
            if (!bObjectToUpdate) {
                createPropertyChange(sNameSpace, sType, aNewArray);
            }
        }

        /**
         *
         */
        function checkIfOnlyTabLevelProp(sPropertyName, sType) {
            var aOnlyTabLevelProps = SettingsConstants.cardSettingsArrayLevel[sType]["onlyTabLevelProps"],
                bFlag = false;
            /**
             *  Looping through all the onlyTabLevelProps
             */
            for (var i = 0; aOnlyTabLevelProps && i < aOnlyTabLevelProps.length; i++) {
                /**
                 *  If it is only tab level property
                 *  Then return true
                 */
                if (aOnlyTabLevelProps[i] === sPropertyName) {
                    bFlag = true;
                    break;
                }
            }

            return bFlag;
        }

        /**
         *
         */
        function createChangeForRemovalOfArray(sNameSpace, oCardManifest, aTexts, aSettings, sType, bObjectToUpdate) {
            var newSettings = this._oCardManifestSettings, i;
            /**
             *  Text Changes
             */
            /**
             *  Looping through all text properties to detect text change
             */
            for (i = 0; i < aTexts.length; i++) {
                /**
                 *  If Property value is not undefined
                 */
                if (newSettings[aTexts[i]] && !checkIfOnlyTabLevelProp(aTexts[i], sType)) {
                    /**
                     *  If the property has to be updated on the object
                     */
                    if (bObjectToUpdate) {
                        createTextPropertyChange(sNameSpace, sNameSpace, aTexts[i], newSettings[aTexts[i]], newSettings, oCardManifest[sNameSpace]);
                    } else {
                        /**
                         *  Else create an entity property change payLoad
                         */
                        createTextPropertyChange(sNameSpace, sNameSpace, aTexts[i], newSettings[aTexts[i]], newSettings);
                    }
                    oCardManifest.settings[aTexts[i]] = newSettings[aTexts[i]];
                }
            }

            /**
             *  Settings Changes
             */
            /**
             *  Looping through all the other properties to detect property change
             */
            for (i = 0; i < aSettings.length; i++) {
                /**
                 *  If Property value is not undefined
                 */
                if (newSettings[aSettings[i]] && !checkIfOnlyTabLevelProp(aSettings[i], sType)) {
                    /**
                     *  If the property has to be updated on the object
                     */
                    if (bObjectToUpdate) {
                        createPropertyChange(sNameSpace, aSettings[i], newSettings[aSettings[i]], oCardManifest[sNameSpace]);
                    } else {
                        /**
                         *  Else create an entity property change payLoad
                         */
                        createPropertyChange(sNameSpace, aSettings[i], newSettings[aSettings[i]]);
                    }
                    oCardManifest.settings[aSettings[i]] = newSettings[aSettings[i]];
                }
            }

            /**
             *  Remove whole Array
             */
            /**
             *  If the property has to be updated on the object
             */
            if (bObjectToUpdate) {
                createDeleteOperation(sNameSpace, sNameSpace + "/" + sType, oCardManifest[sNameSpace], sType);
            } else {
                /**
                 *  Else create an entity property change payLoad
                 */
                createDeleteOperation(sNameSpace, sNameSpace + "/" + sType);
            }
            delete oCardManifest.settings[sType];
        }

        /**
         *
         */
        function createChangeForRevealOfArray(sNameSpace, oCardManifest, newArray, aTexts, aSettings, sType, bObjectToUpdate) {
            var i;
            /**
             *  Text Changes
             */
            /**
             *  Looping through all text properties to detect text change
             */
            for (i = 0; i < aTexts.length; i++) {
                /**
                 *  If Property exists
                 */
                if (oCardManifest[sNameSpace][aTexts[i]]) {
                    /**
                     *  If the property has to be updated on the object
                     */
                    if (bObjectToUpdate) {
                        createDeleteOperation(sNameSpace, sNameSpace + "/" + aTexts[i], oCardManifest[sNameSpace], aTexts[i]);
                    } else {
                        /**
                         *  Else create an entity property change payLoad
                         */
                        createDeleteOperation(sNameSpace, sNameSpace + "/" + aTexts[i]);
                    }
                    delete oCardManifest.settings[aTexts[i]];
                }
            }

            /**
             *  Settings Changes
             */
            /**
             *  Looping through all the other properties to detect property change
             */
            for (i = 0; i < aSettings.length; i++) {
                /**
                 *  If Property exists
                 */
                if (oCardManifest[sNameSpace][aSettings[i]]) {
                    /**
                     *  If the property has to be updated on the object
                     */
                    if (bObjectToUpdate) {
                        createDeleteOperation(sNameSpace, sNameSpace + "/" + aSettings[i], oCardManifest[sNameSpace], aSettings[i]);
                    } else {
                        /**
                         *  Else create an entity property change payLoad
                         */
                        createDeleteOperation(sNameSpace, sNameSpace + "/" + aSettings[i]);
                    }
                    delete oCardManifest.settings[aSettings[i]];
                }
            }

            /**
             *  Reveal whole Array
             */
            createTextChangeForWholeArray.bind(this)(sNameSpace, oCardManifest, newArray, aTexts, sType, bObjectToUpdate);
        }

        function copyFormattedArrayWithoutReference(newArray, sType) {
            return jQuery.map(jQuery.extend(true, {}, newArray), function (value) {
                var aTexts = SettingsConstants.cardSettingsArrayLevel[sType]["text"], i,
                    aSettings = SettingsConstants.cardSettingsArrayLevel[sType]["settings"],
                    formattedValue = {};
                /**
                 *  Copy Text properties
                 */
                for (i = 0; i < aTexts.length; i++) {
                    /**
                     *  If property exists in value object
                     */
                    if (value[aTexts[i]]) {
                        formattedValue[aTexts[i]] = value[aTexts[i]];
                    }
                }

                /**
                 *  Copy Settings properties
                 */
                for (i = 0; i < aSettings.length; i++) {
                    /**
                     *  If property exists in value object
                     */
                    if (value[aSettings[i]] || value[aSettings[i]] === "") {
                        formattedValue[aSettings[i]] = value[aSettings[i]];
                    }
                }

                return formattedValue;
            });
        }

        /**
         *
         */
        function modifyPropInSettingsWhichShouldNotBeDeleted(aSettings, newArray, sType, sOperation) {
            var aCheckForRemoval = SettingsConstants.cardSettingsArrayLevel[sType]["checkForRemoval"],
                i, index;

            /**
             *  Looping through all check for removal properties
             */
            for (i = 0; i < aCheckForRemoval.length; i++) {
                /**
                 *  If Property doesn't exists
                 */
                if (!newArray[0][aCheckForRemoval[i]]) {
                    index = aSettings.indexOf(aCheckForRemoval[i]);
                    if (sOperation === "remove") {
                        if (index > -1) {
                            aSettings.splice(index, 1);
                        }
                    } else if (sOperation === "add") {
                        if (index === -1) {
                            aSettings.push(aCheckForRemoval[i]);
                        }
                    }
                }
            }

            return aSettings;
        }

        /**
         *
         */
        function createChangeForArray(sNameSpace, oCardManifest, newArray, oldArray, sType, bObjectToUpdate) {
            var aTexts = SettingsConstants.cardSettingsArrayLevel[sType]["text"],
                aSettings = SettingsConstants.cardSettingsArrayLevel[sType]["settings"],
                aCopyNewArray = copyFormattedArrayWithoutReference(newArray, sType);
            /**
             *  Condition where both arrays newArray and oldArray exist and
             *  Case where delete operation is done on newArray elements
             *  Array "Delete" operation
             *
             *  Condition where both arrays newArray and oldArray exist and
             *  Case where add operation is done on newArray elements
             *  Array "Add" operation
             *
             *  Condition where both arrays newArray and oldArray exist and
             *  Case where reorder operation is done on newArray elements
             *  Array "Reorder" operation
             *
             *  Condition where both arrays newArray and oldArray exist and
             *  Case where update operation is done on newArray elements
             *  Array "Update" operation
             */
            if (newArray && oldArray) {
                /**
                 *  Copying whole new array to oCardManifest
                 */
                oCardManifest.settings[sType] = copyFormattedArrayWithoutReference(newArray, sType);
                /**
                 *  Copying whole array to oCardManifest in <LAYER>.settings
                 */
                if (sNameSpace === CommonUtils._getLayerNamespace() + ".settings") {
                    oCardManifest[sNameSpace][sType] = copyFormattedArrayWithoutReference(newArray, sType);
                }
                createTextChangeForWholeArray.bind(this)(sNameSpace, oCardManifest, aCopyNewArray, aTexts, sType, bObjectToUpdate);
            } else if (!newArray && oldArray) {
                /**
                 *  Condition where newArray is empty and oldArray exist
                 *  Case where remove operation is done on newArray
                 *  Array "Remove" operation
                 */
                createChangeForRemovalOfArray.bind(this)(sNameSpace, oCardManifest, aTexts, aSettings, sType, bObjectToUpdate);
            } else if (newArray && !oldArray) {
                /**
                 *  Condition where oldArray is empty and newArray exist
                 *  Case where reveal operation is done on newArray
                 *  Array "Reveal" operation
                 */
                /**
                 *  Copying whole new array to oCardManifest
                 */
                oCardManifest.settings[sType] = copyFormattedArrayWithoutReference(newArray, sType);
                /**
                 *  Copying whole array to oCardManifest in <LAYER>.settings
                 */
                if (sNameSpace === CommonUtils._getLayerNamespace() + ".settings") {
                    oCardManifest[sNameSpace][sType] = copyFormattedArrayWithoutReference(newArray, sType);
                }
                /**
                 *  Remove property from aSettings array which shouldn't be deleted from settings object
                 */
                aSettings = modifyPropInSettingsWhichShouldNotBeDeleted(aSettings, aCopyNewArray, sType, "remove");
                createChangeForRevealOfArray.bind(this)(sNameSpace, oCardManifest, aCopyNewArray, aTexts, aSettings, sType, bObjectToUpdate);
                /**
                 *  Add the above deleted property in aSettings array
                 */
                aSettings = modifyPropInSettingsWhichShouldNotBeDeleted(aSettings, aCopyNewArray, sType, "add");
            }
        }

        /**
         *
         */
        function createChangesForComplexCard(sNameSpace, oCardManifest, bObjectToUpdate) {
            var aStaticContent = this._oCardManifestSettings["staticContent"],
                aOriginalStaticContent = this._oOriginalCardManifestSettings["staticContent"],
                aTabs = this._oCardManifestSettings["tabs"],
                aOriginalTabs = this._oOriginalCardManifestSettings["tabs"];
            /**
             *  If the card contains static link list array
             */
            if (aStaticContent || aOriginalStaticContent) {
                createChangeForArray.bind(this)(sNameSpace, oCardManifest, aStaticContent, aOriginalStaticContent, "staticContent", bObjectToUpdate);
            } else if (aTabs || aOriginalTabs) {
                /**
                 *  If the card contains tabs array
                 */
                createChangeForArray.bind(this)(sNameSpace, oCardManifest, aTabs, aOriginalTabs, "tabs", bObjectToUpdate);
            }
        }

        /**
         *
         */
        function createForComplexCard(sNameSpace, oCardManifest) {
            var aSettings = SettingsConstants.cardSettingsForComplex["settings"],
                aTexts = SettingsConstants.cardSettingsForComplex["text"];
            /**
             *  For case where changes are made on top of cards delivered by vendor
             *  Updating of the properties for such cards is done in <LAYER>.settings
             *  Instead of settings
             */
            if (sNameSpace === CommonUtils._getLayerNamespace() + ".settings") {
                /**
                 *  If there is <LAYER>.settings object inside card manifest
                 *  Example:-
                 *  "cardId" : {
                 *      "<LAYER>.settings": {...},
                 *      "settings": {...},
                 *      ...
                 *  }
                 */
                if (oCardManifest[CommonUtils._getLayerNamespace() + ".settings"]) {
                    /**
                     *  Settings containing text changes
                     *  For non Array level settings
                     */
                    createTextChangesForSimpleCard.bind(this)(sNameSpace, oCardManifest, aTexts, false);

                    /**
                     *  Settings containing other changes
                     *  For non Array level settings
                     */
                    createPropChangesForSimpleCard.bind(this)(sNameSpace, oCardManifest, aSettings, false);

                    /**
                     *  For Array level settings
                     */
                    createChangesForComplexCard.bind(this)(sNameSpace, oCardManifest, false);
                } else {
                    /**
                     *  There is no <LAYER>.settings object inside card manifest
                     *  Example:-
                     *  "cardId" : {
                     *      "settings": {...},
                     *      ...
                     *  }
                     */
                    oCardManifest[CommonUtils._getLayerNamespace() + ".settings"] = {};
                    /**
                     *  Settings containing text changes
                     *  For non Array level settings
                     */
                    createTextChangesForSimpleCard.bind(this)(sNameSpace, oCardManifest, aTexts, true);

                    /**
                     *  Settings containing other changes
                     *  For non Array level settings
                     */
                    createPropChangesForSimpleCard.bind(this)(sNameSpace, oCardManifest, aSettings, true);

                    /**
                     *  For Array level settings
                     */
                    createChangesForComplexCard.bind(this)(sNameSpace, oCardManifest, true);

                    createCustomerSettingsChange(oCardManifest);
                }
            } else {
                /**
                 *  For case where changes are made on top of cards delivered by customers
                 *  Updating of the properties for such cards is done in settings
                 */
                /**
                 *  Settings containing text changes
                 *  For non Array level settings
                 */
                createTextChangesForSimpleCard.bind(this)(sNameSpace, oCardManifest, aTexts, false);

                /**
                 *  Settings containing other changes
                 *  For non Array level settings
                 */
                createPropChangesForSimpleCard.bind(this)(sNameSpace, oCardManifest, aSettings, false);

                /**
                 *  For Array level settings
                 */
                createChangesForComplexCard.bind(this)(sNameSpace, oCardManifest, false);
            }
        }

        /**
         *
         */
        function createSettingsChangeObjectForEditCard(sNameSpace, oCardManifest) {
            var aStaticContent = this._oCardManifestSettings["staticContent"],
                aOriginalStaticContent = this._oOriginalCardManifestSettings["staticContent"],
                aTabs = this._oCardManifestSettings["tabs"],
                aOriginalTabs = this._oOriginalCardManifestSettings["tabs"];

            /**
             *  Case where are is Array operations involved
             */
            if (aStaticContent || aOriginalStaticContent || aTabs || aOriginalTabs) {
                createForComplexCard.bind(this)(sNameSpace, oCardManifest);
            } else {
                /**
                 *  Case where no Array operations are needed
                 */
                createForSimpleCard.bind(this)(sNameSpace, oCardManifest);
            }
        }

        /**
         *
         */
        function createManifestForKPICard(settingsUtils) {
            var aAllCardSettings = SettingsConstants.AllCardSettingsForKPICard, j,
                newSettings = this._oCardManifestSettings,
                oCardManifest = {
                    "model": CommonUtils._getLayerNamespace() + ".kpi_card_model_" + settingsUtils.getTrimmedDataURIName(newSettings.selectedKPI.ODataURI),
                    "template": "sap.ovp.cards.charts.analytical",
                    "settings": {}
                };

            /**
             *  Copying all the card level settings for KPI card
             */
            for (j = 0; j < aAllCardSettings.length; j++) {
                /**
                 *  If property exists in value object
                 */
                if (newSettings[aAllCardSettings[j]]) {
                    oCardManifest.settings[aAllCardSettings[j]] = newSettings[aAllCardSettings[j]];
                }
            }

            return oCardManifest;
        }

        /**
         *
         */
        function createManifestForStaticLinkListCard() {
            var aStaticContent = this._oCardManifestSettings["staticContent"],
                aTexts = SettingsConstants.cardSettingsArrayLevel["staticContent"]["text"], i, j,
                aSettings = SettingsConstants.cardSettingsArrayLevel["staticContent"]["settings"],
                newSettings = this._oCardManifestSettings,
                aCardSetting = SettingsConstants.cardSettingsForStaticLinkListCard,
                oCardManifest = {
                    "template": "sap.ovp.cards.linklist",
                    "settings": {
                        "staticContent": []
                    }
                };

            /**
             *  Copying all the card level settings for static link list card
             */
            for (j = 0; j < aCardSetting.length; j++) {
                /**
                 *  If property exists in value object
                 */
                if (newSettings[aCardSetting[j]]) {
                    oCardManifest.settings[aCardSetting[j]] = newSettings[aCardSetting[j]];
                }
            }

            /**
             *  Copying all the staticContent properties to oCardManifest
             */
            for (j = 0; j < aStaticContent.length; j++) {
                /**
                 *  Pushing Empty Object for a new static link
                 */
                oCardManifest.settings["staticContent"].push({});
                /**
                 *  Copy Text properties
                 */
                for (i = 0; i < aTexts.length; i++) {
                    /**
                     *  If property exists in value object
                     */
                    if (aStaticContent[j][aTexts[i]]) {
                        oCardManifest.settings["staticContent"][j][aTexts[i]] = aStaticContent[j][aTexts[i]];
                    }
                }

                /**
                 *  Copy Settings properties
                 */
                for (i = 0; i < aSettings.length; i++) {
                    /**
                     *  If property exists in value object
                     */
                    if (aStaticContent[j][aSettings[i]]) {
                        oCardManifest.settings["staticContent"][j][aSettings[i]] = aStaticContent[j][aSettings[i]];
                    }
                }
            }

            return oCardManifest;
        }

        function createManifestForNewCard(settingsUtils) {
            var aAllCardSettings = SettingsConstants.NewCardSettings, aSelectedCardSetting;
            var newSettings = this._oCardManifestSettings;
            aAllCardSettings.forEach(function(settings) {
                if (settings.template === this._oCardManifestSettings.template) {
                    aSelectedCardSetting = settings;
                }
            }.bind(this));

            var oCardManifest = {
                "model": this._oCardManifestSettings.model,
                "template": aSelectedCardSetting.template,
                "settings": {}
            };

            /**
             *  Copying all the card level settings for selected card type
             */
            if (!this._oCardManifestSettings["tabs"]) {
                var aCardSettings = aSelectedCardSetting.cardSettings;
                var oI18nValueProperty = SettingsConstants.oI18nValueProperty;
                for (var j = 0; j < aCardSettings.length; j++) {
                    /**
                     *  If property exists in value object
                     */
                    if (!settingsUtils.bAddNewCardFlag) {
	                    if (newSettings[aCardSettings[j]]) {
	                        oCardManifest.settings[aCardSettings[j]] = newSettings[aCardSettings[j]];
	                    }
                    } else {
	                   if (newSettings[aCardSettings[j]]) {
                            if (oI18nValueProperty[aCardSettings[j]]) {
                                oCardManifest.settings[aCardSettings[j]] = this._oCardManifestSettings[oI18nValueProperty[aCardSettings[j]]];
		                    } else {
                                oCardManifest.settings[aCardSettings[j]] = newSettings[aCardSettings[j]];
		                    }
	                   }
                    }
                }
            } else {
                var aText = aSelectedCardSetting.text;
                for (var j = 0; j < aText.length; j++) {
                    /**
                     *  If property exists in value object
                     */
                    if (newSettings[aText[j]]) {
                        oCardManifest.settings[aText[j]] = newSettings[aText[j]];
                    }
                }
                var aTabs = this._oCardManifestSettings["tabs"],
                aCopyNewArray = copyFormattedArrayWithoutReference(aTabs, "tabs"),
                iSelectedKey = this._oCardManifestSettings.defaultViewSelected;
            oCardManifest.settings["tabs"] = aCopyNewArray;
            oCardManifest.settings.selectedKey = iSelectedKey;
            }
            return oCardManifest;
        }
        /**
        * Write array of text properties to the i18n file
        */
        function writeToi18nFile(sApplicationId, aTextPropertychanges) {
            var aProperties = [];
            if (aTextPropertychanges) {
                for (var key in aTextPropertychanges) {
                    var oTextProperties = aTextPropertychanges[key];
                    aProperties.push({
                        "key": key,
                        "value": oTextProperties.value[""],
                        "textType": oTextProperties.type
                    });
                }
                if (aProperties.length) {
                    /* eslint-disable */
                    writeToI18n("/" + sApplicationId + "/webapp/i18n", aProperties);
                    /* eslint-disable */
                }
            }
        }

	/**
	* Making an Object oText containing translation properties for Clone Card
	* type is "XTIT"
	* maxLength is 40
	*/
	function createTextTranslationObjectForCloneCard(sApplicationId, sCardId, oCardManifest, oSettingsUtils ) {
		var oText, i, j, k, sPropertyName, aStaticContent = oCardManifest.settings["staticContent"],
			aTabs = oCardManifest.settings["tabs"];

		var aCardSettingsWithText = SettingsConstants.cardSettingsWithText;
		var oI18nKeyValueProperty = SettingsConstants.oI18nKeyValueProperty;
		for (i = 0; i < aCardSettingsWithText.length; i++) {
			var sId;
			if (typeof aCardSettingsWithText[i] == "string") {
				if (oCardManifest.settings[aCardSettingsWithText[i]]) {
					if (!oText) {
						oText = {};
					}
					if (oSettingsUtils) {
						if (!oSettingsUtils.bAddNewCardFlag) {
							sId = generateId(sApplicationId, sCardId, "settings", aCardSettingsWithText[i]);
						} else {
							for (var key in oI18nKeyValueProperty) {
								if (aCardSettingsWithText[i] === key) {
									sId = this._oCardManifestSettings[oI18nKeyValueProperty[key]] ? this._oCardManifestSettings[oI18nKeyValueProperty[key]] :  generateId(sApplicationId, sCardId, "settings", aCardSettingsWithText[i]);
									break;
								}
							}
						}
					} else {
						sId = generateId(sApplicationId, sCardId, "settings", aCardSettingsWithText[i]);
					}
					oText[sId] = createTranslationTextObject(oCardManifest.settings[aCardSettingsWithText[i]]);
					oCardManifest.settings[aCardSettingsWithText[i]] = "{{" + sId + "}}";
				}
			} else if (typeof aCardSettingsWithText[i] == "object") {
				if (aCardSettingsWithText[i].hasOwnProperty("staticContent")) {
					if (aStaticContent) {
						for (j = 0; j < aStaticContent.length; j++) {
							for (k = 0; k < aCardSettingsWithText[i]["staticContent"].length; k++) {
								sPropertyName = aCardSettingsWithText[i]["staticContent"][k];
								if (aStaticContent[j][sPropertyName]) {
									if (!oText) {
										oText = {};
									}
									sId = generateId(sApplicationId, sCardId, "settings.staticContent." + j, sPropertyName);
									oText[sId] = createTranslationTextObject(aStaticContent[j][sPropertyName]);
									oCardManifest.settings["staticContent"][j][sPropertyName] = "{{" + sId + "}}";
								}
							}
						}
					}
				} else if (aCardSettingsWithText[i].hasOwnProperty("tabs")) {
					if (aTabs) {
						for (j = 0; j < aTabs.length; j++) {
							for (k = 0; k < aCardSettingsWithText[i]["tabs"].length; k++) {
								sPropertyName = aCardSettingsWithText[i]["tabs"][k];
								if (aTabs[j][sPropertyName]) {
									if (!oText) {
										oText = {};
									}
									sId = generateId(sApplicationId, sCardId, "settings.tabs." + j, sPropertyName);
									oText[sId] = createTranslationTextObject(aTabs[j][sPropertyName]);
									oCardManifest.settings["tabs"][j][sPropertyName] = "{{" + sId + "}}";
								}
							}
						}
					}
				}
			}
		}
		return oText;
    }

        function checkIfOtherCardUsesTheSameModel (sModelName, sCardId, aCards) {
            var bIsSameModel = false;
            for (var i = 0; i < aCards.length; i++) {
                if (aCards[i].id !== sCardId && aCards[i].model === sModelName) {
                    bIsSameModel = true;
                    break;
                }
            }
            return bIsSameModel;
        }

        function createFinalPayLoad(oParameters, oText, oFlexCardManifest, oOriginalCardManifest, oViewSwitchChange) {
            var payLoad = {};
            payLoad['appDescriptorChange'] = {
                'parameters': oParameters
            };
            if (oText) {
                payLoad['appDescriptorChange']['texts'] = oText;
            }

            if (oOriginalCardManifest) {
                payLoad['flexibilityChange'] = {
                    "newAppDescriptor": oFlexCardManifest,
                    "oldAppDescriptor": oOriginalCardManifest
                };
            } else {
                payLoad['flexibilityChange'] = oFlexCardManifest;
            }

            if (oViewSwitchChange) {
                payLoad['viewSwitchChange'] = oViewSwitchChange;
            }

            return payLoad;
        }
        //Generic method to create Final Payload in case of new card i.e addNewCard, addKPI card, add static link list card
        function getFinalPayload(settingsUtils, cardType) {
            var oParameters = {
                card: {}
            }, oFlexCardManifest = {},
            oMainComponent = settingsUtils.oMainComponent,
            sApplicationId = oMainComponent._getApplicationId(), oCardManifest,
            oFinalData = {},
            sLayer = CommonUtils._getLayer();

            if (settingsUtils.bAddNewCardFlag) {
                oCardManifest = createManifestForNewCard.bind(this)(settingsUtils);
            } else if (settingsUtils.bNewStaticLinkListCardFlag) {
                oCardManifest = createManifestForStaticLinkListCard.bind(this)(settingsUtils);
            } else if (settingsUtils.bNewKPICardFlag) {
                oCardManifest = createManifestForKPICard.bind(this)(settingsUtils);
            }

            var cardId = CommonUtils._getLayerNamespace() + cardType, i = 1;
            while (searchCardIdInManifest(cardId + "_N" + i, oMainComponent)) {
                i++;
            }
            cardId = cardId + "_N" + i;

            formatManifestSettings(oCardManifest);

            oFlexCardManifest = jQuery.extend(true, {}, oCardManifest);
            oFlexCardManifest.id = cardId;
            if (this._oCardManifestSettings.selectedKPI) {
                oFlexCardManifest.settings.selectedKPI = jQuery.extend(true, {}, this._oCardManifestSettings.selectedKPI);
            }
            oFinalData.oFlexCardManifest = oFlexCardManifest;

            oFinalData.oText = createTextTranslationObjectForCloneCard.bind(this)(sApplicationId, cardId, oCardManifest, settingsUtils);
            if (sLayer === OVPUtils.Layers.vendor) {
                writeToi18nFile(sApplicationId, jQuery.extend(true, {},oFinalData.oText));
                oFinalData.oText = createTranslationTextObjectForDTA();
            }
            oParameters.card[cardId] = oCardManifest;
            oFinalData.oParameters = oParameters;
            return oFinalData;
        }


        var oPayLoadUtils = {

            sApplicationId: "",
            sCardId: "",
            aEntityPropertyChange: [],
            oText: undefined,

            getPayLoadForEditCard: function(settingsUtils) {
                var sCardId = settingsUtils.oAppDescriptor.id, oParameters = {
                    "cardId": sCardId
                }, oText, aEntityPropertyChange, oCardManifest = jQuery.extend(true, {}, settingsUtils.oAppDescriptor),
                    oOriginalCardManifest = jQuery.extend(true, {}, settingsUtils.oAppDescriptor),
                    sNameSpace, oViewSwitchChange,
                    sLayer = CommonUtils._getLayer();

                sNameSpace = (sCardId.lastIndexOf(CommonUtils._getLayerNamespace() + ".", 0) === 0) ? "settings" : CommonUtils._getLayerNamespace() + ".settings";
                oPayLoadUtils.sApplicationId = settingsUtils.sApplicationId;
                oPayLoadUtils.sCardId = sCardId;
                oPayLoadUtils.aEntityPropertyChange = [];
                oPayLoadUtils.oText = undefined;

                createSettingsChangeObjectForEditCard.bind(this)(sNameSpace, oCardManifest);

                oText = jQuery.extend(true, {}, oPayLoadUtils.oText);
                if (sLayer === OVPUtils.Layers.vendor) {
                    writeToi18nFile(oPayLoadUtils.sApplicationId, oPayLoadUtils.oText);
                    oText = createTranslationTextObjectForDTA();
                }
                aEntityPropertyChange = oPayLoadUtils.aEntityPropertyChange;

                if (aEntityPropertyChange.length === 1) {
                    oParameters["entityPropertyChange"] = aEntityPropertyChange[0];
                } else {
                    oParameters["entityPropertyChange"] = aEntityPropertyChange;
                }

                /**
                 *  If View Switch exists
                 *  Then also added the selectedKey to flex change
                 */
                if (this._oCardManifestSettings["tabs"]) {
                    var iSelectedKey = this._oCardManifestSettings.defaultViewSelected,
                        iOldKey = this._oOriginalCardManifestSettings.selectedKey;
                    // Changing oldKey to the previously selected tab
                    iOldKey = (iOldKey && iOldKey > 0) ? iOldKey : 1;
                    if (iSelectedKey && iSelectedKey > 0 && iSelectedKey !== iOldKey) {
                        oViewSwitchChange = {
                            cardId: sCardId,
                            selectedKey: iSelectedKey,
                            oldKey: iOldKey
                        };
                    }
                    oCardManifest.settings.selectedKey = iSelectedKey;
                }

                return createFinalPayLoad(oParameters, oText, oCardManifest, oOriginalCardManifest, oViewSwitchChange);
            },

            getPayLoadForCloneCard: function(oComponentContainer) {
                return new Promise(function (resolve, reject) {
                    var oParameters = {
                            card: {}
                        }, oText, oFlexCardManifest = {},
                        oComponentData = oComponentContainer.getComponentInstance().getComponentData(),
                        oMainComponent = oComponentData.mainComponent,
                        sApplicationId = oMainComponent._getApplicationId(),
                        oCardManifest = jQuery.extend(true, {}, oMainComponent._getCardFromManifest(oComponentData.cardId)),
                        sLayer = CommonUtils._getLayer();

                    var cardId = CommonUtils._getLayerNamespace() + "." + oCardManifest.id, i = 1;
                    while (searchCardIdInManifest(cardId + "_C" + i, oMainComponent)) {
                        i++;
                    }
                    cardId = cardId + "_C" + i;

                    formatManifestSettings(oCardManifest);

                    oFlexCardManifest = jQuery.extend(true, {}, oCardManifest);
                    oFlexCardManifest.id = cardId;
                    oFlexCardManifest.settings.title = oFlexCardManifest.settings.title + " " + i;
                    oCardManifest.settings.title = oCardManifest.settings.title + " " + i;
                    if (oCardManifest.settings.defaultSpan && oCardManifest.settings.defaultSpan.showOnlyHeader) {
                        oCardManifest.settings.defaultSpan.rows = 12;
                    }

                    oText = createTextTranslationObjectForCloneCard(sApplicationId, cardId, oCardManifest);
                    if (sLayer === OVPUtils.Layers.vendor) {
                        writeToi18nFile(sApplicationId, jQuery.extend(true, {}, oText));
                        oText = createTranslationTextObjectForDTA();
                    }
                    oParameters.card[cardId] = oCardManifest;

                    resolve(createFinalPayLoad(oParameters, oText, oFlexCardManifest));
                });
            },

            getPayLoadForNewStaticLinkListCard: function(settingsUtils) {
                var oPayLoadData = getFinalPayload.bind(this)(settingsUtils, ".newStaticLinkListCard");
                return createFinalPayLoad(oPayLoadData.oParameters, oPayLoadData.oText, oPayLoadData.oFlexCardManifest);
            },

            getPayLoadForNewKPICard: function(settingsUtils) {
                var oPayLoadData = getFinalPayload.bind(this)(settingsUtils, ".newKPICard"),
                    oAppComponent = settingsUtils.oAppComponent,
                    oCardManifest = oPayLoadData.oFlexCardManifest,
                    oParameters = oPayLoadData.oParameters,
                    sAnnoKey = oCardManifest.model + "_ANNO",
                    oDataSources = settingsUtils.getDataSources(sAnnoKey),
                    bAddODataAnnotation = true, index = 0;

                if (oDataSources[sAnnoKey]) {
                    /**
                     *  Case where ODataAnnotation name exists but ModelURI is not same
                     *  Meaning Annotation for this KPI card comes from a different Annotation file
                     *  But it has the same dataSource.
                     */
                    if (oDataSources[sAnnoKey].uri !== this._oCardManifestSettings.selectedKPI.ModelURI) {
                        while (oDataSources[sAnnoKey + "_" + index]) {
                            index++;
                        }
                        sAnnoKey = sAnnoKey + "_" + index;
                    } else {
                        // This is to avoid duplicate entries & backend error's during publish of app descriptor
                        bAddODataAnnotation = false;
                    }
                }

                var oModel = oAppComponent.getModel(oCardManifest.model);
                if (!oModel) {
                    /**
                     *  In case where data source and model is not defined for a particular card
                     *  We add "dataSource" & "model" Object in oParameters of the payLoad
                     *  Like "card" Object
                     *
                     *  "dataSource": {
                     *      "sap.newCardDataSource01": {
                     *          "uri": "/sap/opu/odata/snce/PO_S_SRV_1;v=2/",
                     *          "type": "OData",
                     *          "settings": {
                     *              "annotations": ["sap.cardAnnotation01"]],
                     *              localUri: ""
                     *          }
                     *      },
                     *      "sap.cardAnnotation01": {
                     *          "uri": "/sampleURI",
                     *          "type": "ODataAnnotation",
                     *          settings: {
                     *              localUri: ""
                     *          }
                     *      }
                     *  },
                     *  "model": {
                     *      "sap.newCardModel01": {
                     *          "dataSource": "sap.newCardDataSource01",
                     *          "settings": {
                     *              "defaultCountMode": "None"
                     *          }
                     *      }
                     *  },
                     */
                    //add model for kpi card
                    oParameters["model"] = {};
                    oParameters["model"][oCardManifest.model] = {
                        dataSource: oCardManifest.model,
                        settings: {
                            "defaultCountMode": sap.ui.model.odata.CountMode.None
                        }
                    };

                    oParameters["dataSource"] = {};

                    //add datasource in manifest
                    oParameters["dataSource"][oCardManifest.model] = {
                        uri: this._oCardManifestSettings.selectedKPI.ODataURI,
                        type: "OData",
                        settings: {
                            annotations: [sAnnoKey],
                            localUri: ""
                        }
                    };

                    if (bAddODataAnnotation) {
                        //add annotation in manifest
                        oParameters["dataSource"][sAnnoKey] = {
                            uri: this._oCardManifestSettings.selectedKPI.ModelURI,
                            type: "ODataAnnotation",
                            settings: {
                                localUri: ""
                            }
                        };

                        oCardManifest.settings["sAnnoKey"] = sAnnoKey;
                    }
                }

                var oPayLoad = createFinalPayLoad(oParameters, oPayLoadData.oText, oPayLoadData.oFlexCardManifest);

                /**
                 *  Problem: Case where dataSource exists but new annotation's uri is different.
                 *  Solution: In this case we have to add annotation in manifest &
                 *  also Upsert the dataSource with new Annotation key
                 */
                if (bAddODataAnnotation && oModel) {
                    oPayLoad["addODataAnnotation"] = {
                        'parameters': {
                            "dataSourceId": oCardManifest.model,
                            "annotations": [sAnnoKey],
                            "dataSource": {}
                        }
                    };

                    oPayLoad["addODataAnnotation"].parameters.dataSource[sAnnoKey] = {
                        uri: this._oCardManifestSettings.selectedKPI.ModelURI,
                        type: "ODataAnnotation",
                        settings: {
                            localUri: ""
                        }
                    };

                    oPayLoad['flexibilityChange'].settings["sAnnoKey"] = sAnnoKey;
                }

                return oPayLoad;
            },
            /* Create payload of new card, card can be of any type from provided list of card type
            */
           getPayLoadForNewCard: function(settingsUtils) { //TODO: make a method to return the new data source payload for new card and new kpi card
            var oPayLoadData = getFinalPayload.bind(this)(settingsUtils, ".newCard"),
                oParameters = oPayLoadData.oParameters;
            if (settingsUtils.newDataSource) {
                var oAppComponent = settingsUtils.oAppComponent,
                oCardManifest = oPayLoadData.oFlexCardManifest,
                sAnnoKey = settingsUtils.newDataSourceModel.serviceAnnotation,
                oDataSources = settingsUtils.getDataSources(sAnnoKey),
                bAddODataAnnotation = true, index = 0;
                if (oDataSources[sAnnoKey]) {
                    /**
                    *  Case where ODataAnnotation name exists but ModelURI is not same
                    *  Meaning Annotation for this KPI card comes from a different Annotation file
                    *  But it has the same dataSource.
                    */
                    if (oDataSources[sAnnoKey].uri !== settingsUtils.newDataSourceModel.serviceAnnotationURI) {
                        while (oDataSources[sAnnoKey + "_" + index]) {
                            index++;
                        }
                        sAnnoKey = sAnnoKey + "_" + index;
                    } else {
                        // This is to avoid duplicate entries & backend error's during publish of app descriptor
                        bAddODataAnnotation = false;
                    }
                }
                var oModel = oAppComponent.getModel(oCardManifest.model);
                if (!oModel) {
                    oParameters["model"] = {};
                    oParameters["model"][oCardManifest.model] = {
                        dataSource: oCardManifest.model,
                        settings: {
                            "defaultCountMode": sap.ui.model.odata.CountMode.None
                        }
                    };
                    oParameters["dataSource"] = {};
                    //add datasource in manifest
                    oParameters["dataSource"][oCardManifest.model] = {
                        uri: settingsUtils.newDataSourceModel.serviceURI,
                        type: "OData",
                        settings: {
                            annotations: [sAnnoKey],
                            localUri: ""
                        }
                    };
                    if (bAddODataAnnotation) {
                        //add annotation in manifest
                        oParameters["dataSource"][sAnnoKey] = {
                            uri: settingsUtils.newDataSourceModel.serviceAnnotationURI,
                            type: "ODataAnnotation",
                            settings: {
                                localUri: ""
                            }
                        };
                    }
                }
            }
            return createFinalPayLoad(oPayLoadData.oParameters, oPayLoadData.oText, oPayLoadData.oFlexCardManifest);
        },

            getPayLoadForRemoveCard: function(oComponentContainer) {
                var oParameters = {}, oFlexCardManifest = {},
                    oComponentData = oComponentContainer.getComponentInstance().getComponentData(),
                    sCardId = oComponentData.cardId;

                oParameters["cardId"] = sCardId;
                oFlexCardManifest.id = oComponentContainer.getId();

                var oPayLoad = createFinalPayLoad(oParameters, null, oFlexCardManifest),
                    aCards = oComponentData.mainComponent.getUIModel().getProperty("/cards");

                if (!checkIfOtherCardUsesTheSameModel(oComponentData.modelName, sCardId, aCards) && !!oComponentData.modelName) {
                    oPayLoad["removeDataSourceChange"] = [];
                    var oMetaData = oComponentData.appComponent.getMetadata(),
                        sDataSource = oMetaData.getManifestEntry("sap.ui5").models[oComponentData.modelName].dataSource,
                        aAnnotationNames = oMetaData.getManifestEntry("sap.app").dataSources[sDataSource].settings.annotations;

                    // Push all dataSources Type ODataAnnotation
                    aAnnotationNames.forEach(function (sAnnotationNames) {
                        oPayLoad["removeDataSourceChange"].push({
                            'parameters': {
                                "dataSourceId": sAnnotationNames
                            }
                        });
                    });
                }

                return oPayLoad;
            }
        };

        return oPayLoadUtils;
    },
    /* bExport= */true);
