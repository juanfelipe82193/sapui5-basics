// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/comp/smartform/SmartForm",
    "sap/ui/model/odata/ODataModel",
    "sap/ui/comp/smartfield/SmartField",
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/ui/thirdparty/jquery",
    "sap/base/Log",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ui/comp/smartform/GroupElement",
    "sap/ui/comp/smartform/Group",
    "sap/ui/layout/GridData",
    "sap/m/Button",
    "sap/ushell/resources",
    "sap/m/library",
    "sap/ui/comp/smartfield/SmartLabel",
    "sap/m/Input",
    "sap/m/FlexItemData",
    "sap/m/FlexBox",
    "sap/ui/comp/library",
    "sap/m/Token"
], function (
    SmartForm,
    ODataModel,
    SmartField,
    ValueHelpDialog,
    jQuery,
    Log,
    Device,
    JSONModel,
    GroupElement,
    Group,
    GridData,
    Button,
    resources,
    mobileLibrary,
    SmartLabel,
    Input,
    FlexItemData,
    FlexBox,
    compLibrary,
    Token
) {
    "use strict";

    // shortcut for sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation
    var ValueHelpRangeOperation = compLibrary.valuehelpdialog.ValueHelpRangeOperation;

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    /* global setTimeout */

    sap.ui.controller("sap.ushell.components.shell.UserSettings.DefaultParameters", {
        onInit: function () {
            this.oModelRecords = {}; // a map of models
            this.oChangedParameters = {}; // a Map of all parameters changed by the control
            this.oBlockedParameters = {}; // parmeters of odata models which are not yet filled with "our" value
            this.aDisplayedUserDefaults = []; // array of displayed parameters, in order
            this.DefaultParametersService = sap.ushell.Container.getService("UserDefaultParameters");
        },

        applyFocus: function () {
            var that = this;
            //Since each field is loaded separately, we have to check for focusable element
            //After each element is loaded in order to assure that the first element is focused
            //When the view is displayed for the first time.
            setTimeout(function () {
                if (!Device.phone) {
                    var elFirstToFocus = that.getView().$().firstFocusableDomRef();

                    if (elFirstToFocus) {
                        elFirstToFocus.focus();
                    }
                }
            }, 1);
        },

        overrideOdataModelValue: function (oEvent) {
            var sUrl = oEvent.getParameter("url"),
                oModel = oEvent.getSource(),
                sFullPath,
                sFullOdataUrl,
                that = this;
            this.aDisplayedUserDefaults.forEach(function (oRecord) {
                if (oRecord.editorMetadata && oRecord.editorMetadata.editorInfo) {
                    sFullOdataUrl = oRecord.editorMetadata.editorInfo.odataURL + oRecord.editorMetadata.editorInfo.bindingPath;
                    // check if there is a parameter with the same oData URL as the completed request
                    if (sFullOdataUrl === sUrl) {
                        sFullPath = oRecord.editorMetadata.editorInfo.bindingPath + "/" + oRecord.editorMetadata.editorInfo.propertyName;
                        // if the property value in the model is not the same as the one we got from the service,
                        // change the property value accordingly
                        if (oModel.getProperty(sFullPath) !== oRecord.valueObject.value) {
                            oModel.setProperty(sFullPath, oRecord.valueObject.value);
                        }
                        that.oBlockedParameters[oRecord.parameterName] = false;
                    }
                }
            });
        },

        getOrCreateModelForODataService: function (sUrl) {
            if (!this.oModelRecords[sUrl]) {
                // In order to reduce the volume of the metadata response
                // We pass only relevant parameters to oDATaModel constructor
                var oParameters = {
                    metadataUrlParams: {
                        "sap-documentation": "heading,quickinfo",
                        "sap-value-list": "none"
                    },
                    json: true
                };
                var oModel = new ODataModel(sUrl, oParameters);
                oModel.setDefaultCountMode("None");
                oModel.setDefaultBindingMode("TwoWay");
                oModel.attachRequestCompleted(this.overrideOdataModelValue.bind(this));
                this.oModelRecords[sUrl] = oModel;
            }
            return this.oModelRecords[sUrl];
        },

        constructControlSet: function (oParameters) {
            // sort parameters and remove noneditable ones
            var oUserDefTmp = []; // use an empty array to be able to delete parameters
            // for each property name -> push all array elements into aUserDef
            for (var sParameter in oParameters) {
                // loop oUserDefTmp and search for an already existing parameter name
                for (var n = 0; n < oUserDefTmp.length; n++) {
                    if (oUserDefTmp[n].parameterName === sParameter) {
                        oUserDefTmp.splice(n, 1);
                    }
                }
                // copy the parameter name because we want to show it in the UI later
                oParameters[sParameter].parameterName = sParameter;
                oUserDefTmp.push(oParameters[sParameter]);
            }
            this.sortParametersByGroupIdParameterIndex(oUserDefTmp);

            this.aDisplayedUserDefaults = oUserDefTmp;
            this.sForm = new SmartForm({
                editable: true
            }).addStyleClass("sapUshellShellDefaultValuesForm");

            this.getView().addContent(this.sForm);
        },

        getValue: function () {
            var deferred = jQuery.Deferred();

            var oHasRelevantMaintainableParameters = sap.ushell.Container.getService("UserDefaultParameters").hasRelevantMaintainableParameters();
            oHasRelevantMaintainableParameters.done(function (bHasRelevantParameters) {
                deferred.resolve({
                    value: bHasRelevantParameters ? 1 : 0,
                    displayText: " "
                });
            });

            oHasRelevantMaintainableParameters.fail(function (sErrorMessage) {
                deferred.reject(sErrorMessage);
            });

            return deferred.promise();
        },

        createPlainModel: function (grpel, oRecord) {
            oRecord.modelBind.model = this.oMdlParameter;
            oRecord.modelBind.extendedModel = this.oMdlParameter; // same model!
            grpel.setModel(oRecord.modelBind.model);
            var oModelPath = "/sUserDef_" + oRecord.nr + "_";
            oRecord.modelBind.sFullPropertyPath = oModelPath;
            oRecord.modelBind.sPropertyName = "{" + oModelPath + "}";
            oRecord.modelBind.model.setProperty(oRecord.modelBind.sFullPropertyPath, oRecord.valueObject.value);
        },

        revertToPlainModelControls: function (grpel, oRecord) {
            Log.error("Metadata loading for parameter " + oRecord.parameterName + " failed" + JSON.stringify(oRecord.editorMetadata));// metadata loading for the model intended for this control failed
            // -> instead display as plain
            // switch model binding:
            oRecord.modelBind.isOdata = false;
            this.createPlainModel(grpel, oRecord);
            // switch to create other controls
            this.createAppropriateControl(grpel, oRecord);
        },

        getContent: function () {
            var that = this;
            var deferred = new jQuery.Deferred();

            this.DefaultParametersService.editorGetParameters().done(function (oParameters) {
                // a json model for the "conventional" ( = non odata parameters)
                that.oMdlParameter = new JSONModel(oParameters);
                that.oMdlParameter.setDefaultBindingMode("TwoWay");
                that.getView().setModel(that.oMdlParameter, "MdlParameter");
                // take a deep copy of the original parameters
                that.oOriginalParameters = jQuery.extend(true, {}, oParameters);
                // that deep copy maintains the currently (within the editor) altered properties
                that.oCurrentParameters = jQuery.extend(true, {}, oParameters);
                that.constructControlSet(oParameters);

                var lastGroup = "nevermore";
                var grp; // the current group;
                that.aChangedParameters = [];
                that.oBindingContexts = {};

                that.setPropValue = function (oRecord) {
                    oRecord.modelBind.model.setProperty(oRecord.modelBind.sFullPropertyPath, oRecord.valueObject.value);
                    that.oBlockedParameters[oRecord.parameterName] = false;
                };
                that.oMdlParameter.setProperty("/sUser");
                for (var i = 0; i < that.aDisplayedUserDefaults.length; ++i) {
                    var oRecord = that.aDisplayedUserDefaults[i];
                    oRecord.nr = i;
                    oRecord.editorMetadata = oRecord.editorMetadata || {};
                    oRecord.valueObject = oRecord.valueObject || { value: "" };
                    var grpel = new GroupElement({});

                    if (lastGroup !== oRecord.editorMetadata.groupId) {
                        // generate a group on group change
                        // var groupTitle = oRecord.editorMetadata.groupTitle || sap.ushell.resources.i18n.getText("userDefaultsGeneralGroup");
                        var groupTitle = oRecord.editorMetadata.groupTitle || undefined;
                        // for a proper form-field alignment across groups, set the linebreak layoutData to false explicitly.
                        grp = new Group({ label: groupTitle, "editable": true, layoutData: new GridData({ linebreak: false }) });
                        lastGroup = oRecord.editorMetadata.groupId;
                        that.sForm.addGroup(grp);
                    }
                    grp.addGroupElement(grpel);
                    oRecord.modelBind = {
                        model: undefined, // the model
                        sModelPath: undefined, // path into the model to the property value "/sUserDef_<i>_/" or "/UserDefaults('FIN')/CostCenter
                        sPropertyName: undefined, // the property binding statement , e.g. {xxxx} to attach to the control
                        sFullPropertyPath: undefined // path into the model to the property value
                    };

                    // normalize the value, in the editor, undefined is represented as "" for now,
                    // (check if we can make that better!
                    oRecord.valueObject.value = oRecord.valueObject.value || "";

                    if (oRecord.editorMetadata.editorInfo && oRecord.editorMetadata.editorInfo.propertyName) {
                        oRecord.modelBind.isOdata = true;
                        var sUrl = oRecord.editorMetadata.editorInfo.odataURL;
                        oRecord.modelBind.model = that.getOrCreateModelForODataService(sUrl);
                        grpel.setModel(oRecord.modelBind.model);
                        // in order to avoid OData requests to the same URL
                        // we try to reuse the BindingContext that was previously created for the same URL
                        // the call to bindElement creates a new BindingContext, and triggers an OData request
                        if (!that.oBindingContexts[sUrl]) {
                            grpel.bindElement(oRecord.editorMetadata.editorInfo.bindingPath);
                            that.oBindingContexts[sUrl] = oRecord.modelBind.model.getContext(oRecord.editorMetadata.editorInfo.bindingPath);
                        } else {
                            grpel.setBindingContext(that.oBindingContexts[sUrl]);
                        }
                        oRecord.modelBind.sPropertyName = "{" + oRecord.editorMetadata.editorInfo.propertyName + "}";
                        oRecord.modelBind.sFullPropertyPath = oRecord.editorMetadata.editorInfo.bindingPath + "/" + oRecord.editorMetadata.editorInfo.propertyName;

                        // for the extendedDefault we use the plain model for OData
                        oRecord.modelBind.extendedModel = that.oMdlParameter; // original model!
                    } else {
                        that.createPlainModel(grpel, oRecord);
                    }

                    oRecord.valueObject.value = oRecord.valueObject.value || "";
                    oRecord.modelBind.model.setProperty(oRecord.modelBind.sFullPropertyPath, oRecord.valueObject.value);
                    // before we have set "our" value, we do not want to listen/react on values
                    // within the control, thus we "block" the update
                    if (oRecord.modelBind.isOdata) {
                        that.oBlockedParameters[oRecord.parameterName] = true;
                        oRecord.modelBind.model.attachMetadataLoaded(that.createAppropriateControl.bind(that, grpel, oRecord));
                        oRecord.modelBind.model.attachMetadataFailed(that.revertToPlainModelControls.bind(that, grpel, oRecord));
                    } else {
                        that.createAppropriateControl(grpel, oRecord);
                    }
                    oRecord.modelBind.model.bindTree(oRecord.modelBind.sFullPropertyPath).attachChange(that.storeChangedData.bind(that));
                }
                that.oMdlParameter.bindTree("/").attachChange(that.storeChangedData.bind(that));
                deferred.resolve(that.getView());
            });
            return deferred.promise();
        },

        createAppropriateControl: function (grpel, oRecord) {
            var sf, lbl, expButton, layout;
            // If oRecord supports extended values (ranges), we want to add an additional button to it
            // The style of the button depends on whether there are any ranges in the extendedValues object
            if (oRecord.editorMetadata.extendedUsage) {
                var that = this;
                expButton = new Button({
                    text: resources.i18n.getText("userDefaultsExtendedParametersTitle"),
                    tooltip: resources.i18n.getText("userDefaultsExtendedParametersTooltip"),
                    type: {
                        parts: ["MdlParameter>/" + oRecord.parameterName + "/valueObject/extendedValue/Ranges"],
                        formatter: function (aRanges) {
                            return aRanges && aRanges.length ? ButtonType.Emphasized : ButtonType.Transparent;
                        }
                    },
                    press: function (oEvent) {
                        that.openExtendedValueDialog(oEvent, oRecord);
                    }
                }).addStyleClass("sapUshellExtendedDefaultParamsButton");
            }
            // grpel
            Log.debug("Creating controls for parameter" + oRecord.parameterName + " type " + oRecord.modelBind.isOdata);
            var aElements = grpel.getElements().slice();
            aElements.forEach(function (oElement) {
                // at time or writing, the removeElement call was flawed
                grpel.removeElement(oElement);
            });
            var aFields = grpel.getFields().slice();
            aFields.forEach(function (oElement) {
                grpel.removeField(oElement);
            });

            lbl = new SmartLabel({
                width: Device.system.phone ? "auto" : "12rem",
                textAlign: Device.system.phone ? "Left" : "Right"
            });
            if (oRecord.modelBind.isOdata && oRecord.editorMetadata.editorInfo) {
                sf = new SmartField({
                    value: oRecord.modelBind.sPropertyName,
                    name: oRecord.parameterName
                });
                sf.attachInnerControlsCreated({}, this.applyFocus, this);
                lbl.setLabelFor(sf);
            } else {
                sf = new Input({ name: oRecord.parameterName, value: oRecord.modelBind.sPropertyName, type: "Text" });
                sf.addAriaLabelledBy(lbl);
                this.setPropValue(oRecord);
                lbl.setText((oRecord.editorMetadata.displayText || oRecord.parameterName) + ":");
                lbl.setTooltip(oRecord.editorMetadata.description || oRecord.parameterName);
            }

            sf.attachChange(this.storeChangedData.bind(this));
            sf.addStyleClass("sapUshellDefaultValuesSmartField");
            sf.setLayoutData(new FlexItemData({ shrinkFactor: 0 }));
            var oInputBox = new FlexBox({
                width: Device.system.phone ? "100%" : "auto",
                direction: (Device.system.phone && !expButton) ? "Column" : "Row",
                items: [sf, expButton]
            });
            lbl.setLayoutData(new FlexItemData({ shrinkFactor: 0 }));
            layout = new FlexBox({
                alignItems: Device.system.phone ? "Start" : "Center",
                direction: Device.system.phone ? "Column" : "Row",
                items: [lbl, oInputBox]
            });

            grpel.addElement(layout);
        },

        openExtendedValueDialog: function (oEvent, oData) {
            var that = this,
                sPathToTokens = "/" + oData.parameterName + "/valueObject/extendedValue/Ranges",
                oModel = oData.modelBind.extendedModel,
                aRanges = oModel.getProperty(sPathToTokens) || [],
                lblText,
                sNameSpace;

            if (oData.modelBind.isOdata) {
                sNameSpace = this._getMetadataNameSpace(oData.editorMetadata.editorInfo.odataURL);
                var oEntityType = oData.modelBind.model.getMetaModel().getODataEntityType(sNameSpace + "." + oData.editorMetadata.editorInfo.entityName);
                if (oEntityType) {
                    lblText = oData.modelBind.model.getMetaModel().getODataProperty(oEntityType, oData.editorMetadata.editorInfo.propertyName)["sap:label"];
                }
            }
            var oValueHelpDialog = new ValueHelpDialog({
                basicSearchText: oData.editorMetadata.displayText || lblText || oData.parameterName,
                title: oData.editorMetadata.displayText || lblText || oData.parameterName,
                supportRanges: true,
                supportRangesOnly: true,
                key: oData.modelBind.sPropertyName,
                displayFormat: "UpperCase",
                descriptionKey: oData.editorMetadata.displayText || lblText || oData.parameterName,
                filterMode: true,
                stretch: Device.system.phone,
                ok: function (oControlEvent) {
                    that.saveExtendedValue(oControlEvent, oData, oModel, oValueHelpDialog);
                },
                cancel: function (/*oControlEvent*/) {
                    oValueHelpDialog.close();
                },
                afterClose: function () {
                    oValueHelpDialog.destroy();
                }
            });

            oValueHelpDialog.setIncludeRangeOperations(this.getListOfSupportedRangeOperations());
            this.addTokensToValueHelpDialog(oValueHelpDialog, aRanges, oData.parameterName);
            var keyFields = [];
            keyFields.push({ label: oValueHelpDialog.getTitle(), key: oData.parameterName });
            oValueHelpDialog.setRangeKeyFields(keyFields);
            oValueHelpDialog.open();
        },

        saveExtendedValue: function (oControlEvent, oData, oModel, oValueHelpDialog) {
            this.aTokens = oControlEvent.getParameters().tokens;
            var aTokensData = [],
                sPathToTokens = "/" + oData.parameterName + "/valueObject/extendedValue/Ranges",
                aFormattedTokensData,
                valueObject = { extendedValue: { "Ranges": [] } };
            jQuery.extend(this.oCurrentParameters[oData.parameterName].valueObject, valueObject);
            for (var token in this.aTokens) {
                if (this.aTokens.hasOwnProperty(token)) {
                    aTokensData.push(this.aTokens[token].data("range"));
                }
            }
            // convert the Ranges that are coming from the dialog to the format that should be persisted in the service and that applications can read
            aFormattedTokensData = aTokensData.map(function (token) {
                return {
                    Sign: token.exclude ? "E" : "I",
                    Option: token.operation !== "Contains" ? token.operation : "CP",
                    Low: token.value1,
                    High: token.value2 || null
                };
            });
            if (!oModel.getProperty("/" + oData.parameterName + "/valueObject/extendedValue")) {
                oModel.setProperty("/" + oData.parameterName + "/valueObject/extendedValue", {});
            }
            oModel.setProperty(sPathToTokens, aFormattedTokensData);
            this.oChangedParameters[oData.parameterName] = true;
            oValueHelpDialog.close();
        },

        getListOfSupportedRangeOperations: function () {
            // there is no representation of StartsWith and EndsWith on ABAP so applications won't be able to get these operations
            var aSupportedOps = Object.keys(ValueHelpRangeOperation);
            return aSupportedOps.filter(function (operation) {
                return operation !== "StartsWith" && operation !== "EndsWith" && operation !== "Initial";
            });
        },

        _getMetadataNameSpace: function (sServiceUrl) {
            var aSplit = sServiceUrl.split("/"),
                sNamespace;
            sNamespace = aSplit[aSplit.length - 1];
            return sNamespace;
        },

        addTokensToValueHelpDialog: function (oDialog, aRanges, sParameterName) {
            var tokens = [],
                oFormattedToken;
            aRanges.forEach(function (oRange) {
                if (oRange) {
                    // convert the Range format to the format that the value help dialog knows how to read
                    oFormattedToken = {};
                    oFormattedToken.exclude = oRange.Sign === "E";
                    oFormattedToken.keyField = sParameterName;
                    oFormattedToken.operation = oRange.Option !== "CP" ? oRange.Option : "Contains";
                    oFormattedToken.value1 = oRange.Low;
                    oFormattedToken.value2 = oRange.High;
                    tokens.push(new Token({}).data("range", oFormattedToken));
                }
            });
            oDialog.setTokens(tokens);
        },

        /**
         * Sorts the array parameter aUserDefTmp in situ by respective criteria to achieve a display order
         * @param {array} aUserDefTmp list or parameters
         */
        sortParametersByGroupIdParameterIndex: function (aUserDefTmp) {
            // compare by groupId
            function compareByGroupId (oDefault1, oDefault2) {
                // handle default without metadata
                if (!(oDefault2.editorMetadata && oDefault2.editorMetadata.groupId)) {
                    return -1; // keep order
                }
                if (!(oDefault1.editorMetadata && oDefault1.editorMetadata.groupId)) {
                    return 1; // move oDefault1 to the end
                }

                if (oDefault1.editorMetadata.groupId < oDefault2.editorMetadata.groupId) { return -1; }
                if (oDefault1.editorMetadata.groupId > oDefault2.editorMetadata.groupId) { return 1; }

                return 0;
            }
            // compare by parameterIndex
            function compareByParameterIndex (oDefault1, oDefault2) {
                // handle default without metadata
                if (!(oDefault2.editorMetadata && oDefault2.editorMetadata.parameterIndex)) {
                    return -1; // keep order
                }
                if (!(oDefault1.editorMetadata && oDefault1.editorMetadata.parameterIndex)) {
                    return 1; // move oDefault1 to the end
                }
                return oDefault1.editorMetadata.parameterIndex - oDefault2.editorMetadata.parameterIndex;
            }

            // sort by groupid, parameterindex
            aUserDefTmp.sort(function (oDefault1, oDefault2) {
                // first by groupId
                var returnValueOfCompareByGroupId = compareByGroupId(oDefault1, oDefault2);
                if (returnValueOfCompareByGroupId === 0) {
                    // then by parameterIdx
                    return compareByParameterIndex(oDefault1, oDefault2);
                }
                return returnValueOfCompareByGroupId;
            });
        },

        /*
         * this function is invoked on any model data change, be it in an odata model or in the plain JSON fallback model
         * we always run over all parameters and record the ones with a delta
         * we change *relevant* deltas compared to the data when calling up the dialogue
         * note that the valueObject may contain other relevant metadata!
         * (which is *not* altered by the Editor Control),
         * thus it is important not to overwrite or recreate the valueObject, but only set the value property
         */
        storeChangedData: function () {
            var i = 0,
                that = this,
                arr = that.aDisplayedUserDefaults;

            // check for all changed parameters...
            for (i = 0; i < arr.length; ++i) {
                var pn = arr[i].parameterName;
                if (!that.oBlockedParameters[pn]) {
                    var oldValue = {
                        value: that.oCurrentParameters[pn].valueObject && that.oCurrentParameters[pn].valueObject.value,
                        extendedValue: that.oCurrentParameters[pn].valueObject && that.oCurrentParameters[pn].valueObject.extendedValue && that.oCurrentParameters[pn].valueObject.extendedValue
                    };
                    if (arr[i].modelBind && arr[i].modelBind.model) {
                        var oModel = arr[i].modelBind.model;
                        var oModelExtended = arr[i].modelBind.extendedModel;
                        var sPropValuePath = arr[i].modelBind.sFullPropertyPath;
                        var sActValue = oModel.getProperty(sPropValuePath);
                        var oNewValue = {
                            value: oModel.getProperty(sPropValuePath),
                            extendedValue: oModelExtended.getProperty("/" + pn + "/valueObject/extendedValue")
                        };
                        if (this.isValueDifferent(oNewValue, oldValue)) {
                            that.oCurrentParameters[pn].valueObject.value = sActValue;
                            if (oNewValue.extendedValue) {
                                jQuery.extend(that.oCurrentParameters[pn].valueObject.extendedValue, oNewValue.extendedValue);
                            }
                            that.oChangedParameters[pn] = true;
                        }
                    }
                }
            }
        },

        onCancel: function () {
            if (sap.ui.getCore().byId("saveButton")) {
                sap.ui.getCore().byId("saveButton").setEnabled(true);
            }
            var aChangedParameterNames = Object.keys(this.oChangedParameters),
                aDisplayedParameters = this.aDisplayedUserDefaults,
                sParameterName,
                oBoundModel,
                oOriginalParameter;

            if (aChangedParameterNames.length > 0) {
                for (var i = 0; i < aDisplayedParameters.length && aChangedParameterNames.length > 0; i++) {
                    sParameterName = aDisplayedParameters[i].parameterName;
                    if (aChangedParameterNames.indexOf(sParameterName) > -1) {
                        oOriginalParameter = this.oOriginalParameters[sParameterName];
                        oBoundModel = aDisplayedParameters[i].modelBind;
                        oBoundModel.model.setProperty(oBoundModel.sFullPropertyPath, oOriginalParameter.valueObject.value || "");
                        if (oOriginalParameter.editorMetadata && oOriginalParameter.editorMetadata.extendedUsage) {
                            oBoundModel.extendedModel.setProperty("/" + sParameterName + "/valueObject/extendedValue",
                            oOriginalParameter.valueObject.extendedValue || {});
                        }
                    }
                }
                this.oCurrentParameters = jQuery.extend(true, {}, this.oOriginalParameters);
                this.oChangedParameters = {};
            }

        },

        isValueDifferent: function (oValueObject1, oValueObject2) {
            var isEmptyValue = false,
                sValue1 = oValueObject1 ? JSON.stringify(oValueObject1) : oValueObject1,
                sValue2 = oValueObject2 ? JSON.stringify(oValueObject2) : oValueObject2,
                sExtendedValue1,
                sExtendedValue2;

            if (sValue1 === sValue2) {
                return false;
            }
            if (oValueObject1 === undefined) {
                return false;
            }
            if (oValueObject2 === undefined) {
                return false;
            }
            sExtendedValue1 = oValueObject1.extendedValue ? JSON.stringify(oValueObject1.extendedValue) : oValueObject1.extendedValue;
            sExtendedValue2 = oValueObject2.extendedValue ? JSON.stringify(oValueObject2.extendedValue) : oValueObject2.extendedValue;

            // for the editor, "" and undefined are the same!
            if ((oValueObject1.value === "" && oValueObject2.value === undefined) ||
                (oValueObject2.value === "" && oValueObject1.value === undefined)) {
                isEmptyValue = true;
            }
            if (isEmptyValue && (sExtendedValue1 === sExtendedValue2)) {
                return false;
            }
            return (!isEmptyValue && (oValueObject1.value !== oValueObject2.value))
                || (sExtendedValue1 !== sExtendedValue2);
        },

        onSave: function () {
            var that = this,
                deferred = new jQuery.Deferred(),
                i,
                aChangedParameterNames = Object.keys(this.oChangedParameters).sort(),
                oSetValuePromise,
                pn,
                bDefaultsWereUpdated = false;

            if (aChangedParameterNames.length === 0) {
                deferred.resolve();
            }

            // we change the effectively changed parameters, once, in alphabetic order
            for (i = 0; i < aChangedParameterNames.length; i++) {
                pn = aChangedParameterNames[i];
                // only if effectively changed:
                if (this.isValueDifferent(this.oOriginalParameters[pn].valueObject, this.oCurrentParameters[pn].valueObject)) {
                    // as the editor does not distinguish empty string from deletion, and has no "reset" button
                    // we drop functionality to allow to set a value to an empty string (!in the editor!)
                    // and map an empty string to an effective delection!
                    // TODO: make sure all controls allow to enter an empty string as an "valid" value
                    if ((this.oCurrentParameters[pn].valueObject && this.oCurrentParameters[pn].valueObject.value === null) ||
                        (this.oCurrentParameters[pn].valueObject && this.oCurrentParameters[pn].valueObject.value === "")) {
                        this.oCurrentParameters[pn].valueObject.value = undefined;
                    }
                    // we rectify the extended value, as the editor produces empty object
                    if (this.oCurrentParameters[pn].valueObject &&
                        this.oCurrentParameters[pn].valueObject.extendedValue &&
                        Array.isArray(this.oCurrentParameters[pn].valueObject.extendedValue.Ranges) &&
                        (this.oCurrentParameters[pn].valueObject.extendedValue.Ranges.length === 0)) {
                        this.oCurrentParameters[pn].valueObject.extendedValue = undefined;
                    }
                    oSetValuePromise = sap.ushell.Container.getService("UserDefaultParameters").editorSetValue(pn, this.oCurrentParameters[pn].valueObject);
                    oSetValuePromise.done(function (sParameterName) {
                        that.oChangedParameters = {};
                        that.oOriginalParameters[sParameterName].valueObject.value = that.oCurrentParameters[sParameterName].valueObject.value;
                        deferred.resolve();
                    });
                    oSetValuePromise.fail(deferred.reject);
                    bDefaultsWereUpdated = true;
                }
            }
            //Settings dialog waits for the resolving of the promise.
            //In case if values are the same, for example, value was changed several times and set as it was before,
            //we need to resolve the deffered otherwise settings dialog stays opened.
            if (!bDefaultsWereUpdated) {
                deferred.resolve();
            }
            return deferred.promise();
        }
    });
});
