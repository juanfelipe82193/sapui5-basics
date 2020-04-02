//@ui5-bundle Component-preload.js
sap.ui.require.preload({
	"sap/ushell/components/shell/UserSettings/Component.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ushell/components/shell/UserSettings/UserPreferences",
    "sap/ushell/components/shell/UserSettings/UserSettings.controller" // Do not remove this
], function (
    UIComponent,
    JSONModel,
    Config,
    UserPreferences
) {
    "use strict";

    var aDoables = [];

    return UIComponent.extend("sap.ushell.components.shell.UserSettings.Component", {

        metadata: {
            rootView: {
                "viewName": "sap.ushell.components.shell.UserSettings.UserSettings",
                "type": "XML",
                "async": false,
                "id": "View"
            },
            version: "1.74.0",
            library: "sap.ushell.components.shell.UserSettings",
            dependencies: {
                libs: ["sap.m"]
            }
        },

        createId: function (sId) {
            return "sapFlpUserSettings-" + sId;
        },

        /**
         * Initalizes the user settings by sett the models on the view and adding it as a dependent of the shell
         *
         * @private
         */
        init: function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);

            var oModel = new JSONModel({
                entries: Config.last("/core/shell/model/userPreferences/entries"),
                profiling: Config.last("/core/shell/model/userPreferences/profiling")
            });

            var oShellModel = sap.ui.getCore().byId("shell").getModel();

            var oView = this.getRootControl();
            oView.setModel(oModel, "entries");
            oView.setModel(oShellModel);

            aDoables.push(Config.on("/core/shell/model/userPreferences/entries").do(function (aResult) {
                oView.getModel("entries").setProperty("/entries", aResult);
            }));

            aDoables.push(Config.on("/core/shell/model/userPreferences/profiling").do(function (aResult) {
                oView.getModel("entries").setProperty("/profiling", aResult);
            }));

            sap.ui.getCore().byId("shell").addDependent(oView);

            this._getSearchPrefs();
            UserPreferences.setModel();
        },

        /**
         * Load Search Settings.
         *
         * @private
         */
        _getSearchPrefs: function () {
            function isSearchButtonEnabled () {
                try {
                    return Config.last("/core/shellHeader/headEndItems").indexOf("sf") !== -1;
                } catch (err) {
                    jQuery.sap.log.debug("Shell controller._createWaitForRendererCreatedPromise: search button is not visible.");
                    return false;
                }
            }

            if (isSearchButtonEnabled()) {
                // search preferences (user profiling, concept of me)
                // entry is added async only if search is active
                sap.ui.require([
                    "sap/ushell/renderers/fiori2/search/userpref/SearchPrefs",
                    "sap/ushell/renderers/fiori2/search/SearchShellHelperAndModuleLoader"
                ], function (SearchPrefs) {
                    var searchPreferencesEntry = SearchPrefs.getEntry(),
                        oRenderer = sap.ushell.Container.getRenderer("fiori2");

                    searchPreferencesEntry.isSearchPrefsActive().done(function (isSearchPrefsActive) {
                        if (isSearchPrefsActive && oRenderer) {
                            // Add search as a profile entry
                            oRenderer.addUserProfilingEntry(searchPreferencesEntry);
                        }
                    });
                });
            }
        },

        /**
         * Turns the eventlistener in this component off.
         *
         * @private
         */
        exit: function () {
            for (var i = 0; i < aDoables.length; i++) {
                aDoables.off();
            }
        }
    });
});
},
	"sap/ushell/components/shell/UserSettings/DefaultParameters.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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
},
	"sap/ushell/components/shell/UserSettings/DefaultParameters.view.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    sap.ui.jsview("sap.ushell.components.shell.UserSettings.DefaultParameters", {
        createContent: function (/*oController*/) {
        },

        getControllerName: function () {
            return "sap.ushell.components.shell.UserSettings.DefaultParameters";
        }
    });
});
},
	"sap/ushell/components/shell/UserSettings/FlpSettings.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ui/model/resource/ResourceModel"
], function (Controller, JSONModel, Device, ResourceModel) {
    "use strict";

    return Controller.extend("sap.ushell.components.shell.UserSettings.FlpSettings", {
        DISPLAY_MODES: { /* enum */
            "scroll": 0,
            "tabs": 1,

            getName: function (iValue) {
                return Object.keys(this)[iValue];
            }
        },

        onInit: function () {
            // Set configuration.
            this.oConfModel = new JSONModel({});

            this.oConfModel.setData({
                isRTL: sap.ui.getCore().getConfiguration().getRTL(),
                flexAlignItems: Device.system.phone ? "Stretch" : "Start",
                textAlign: Device.system.phone ? "Begin" : "End",
                textDirection: Device.system.phone ? "Column" : "Row",
                labelWidth: Device.system.phone ? "auto" : "12rem"
            });

            this.getView().setModel(this.oConfModel, "config");

            // Set translation.
            var oResourceModel = new ResourceModel({
                bundleUrl: sap.ui.require.toUrl("sap/ushell/renderers/fiori2/resources/resources") + ".properties"
            });

            this.getView().setModel(oResourceModel, "i18n");

            // Set initial group display mode.
            var initModeName = this.getView().getViewData().initialDisplayMode;
            this.iCurrentMode = this.DISPLAY_MODES[initModeName] || this.DISPLAY_MODES.scroll;
        },

        onBeforeRendering: function () {
            this.oConfModel.setProperty("/displayMode", this.iCurrentMode);
        },

        onSave: function () {
            this.iCurrentMode = this.oConfModel.getProperty("/displayMode");
            return this.DISPLAY_MODES.getName(this.iCurrentMode);
        }
    });
});
},
	"sap/ushell/components/shell/UserSettings/FlpSettings.view.xml":'<View controllerName="sap.ushell.components.shell.UserSettings.FlpSettings"\n      width="100%"\n      xmlns:m="sap.m">\n\n    <m:VBox visible="true" class="sapUiSmallMargin">\n        <m:items>\n            <m:HBox>\n                <m:items>\n                    <m:Label text="{i18n>AnchorBarLabel}:"\n                             class="sapUshellFlpSettingsLabel"\n                             width="{config>/labelWidth}"\n                             textAlign="{config>/textAlign}"\n                             id="anchorBarLabel"/>\n                    <m:VBox>\n                        <m:items>\n                            <m:RadioButtonGroup selectedIndex="{config>/displayMode}"\n                                                ariaLabelledBy="anchorBarLabel"\n                                                ariaDescribedBy="anchorBarDescription">\n                                <m:buttons>\n                                    <m:RadioButton text="{i18n>anchorBarScrollMode}"\n                                                   class="sapUshellAnchorBarScrollMode"\n                                                   ariaLabelledBy="anchorBarLabel"/>\n                                    <m:RadioButton text="{i18n>anchorBarTabMode}"\n                                                   class="sapUshellAnchorBarTabsMode"\n                                                   ariaLabelledBy="anchorBarLabel"/>\n                                </m:buttons>\n                            </m:RadioButtonGroup>\n                            <m:VBox class ="sapUshellFlpSettingsDescriptionBorder">\n                                <m:items>\n                                    <m:Text text="{i18n>homePageGroupDisplayDescriptionText}"\n                                            class="sapUshellFlpSettingsDescription"\n                                            id="anchorBarDescription" />\n                                    <!-- second paragraph will be shown only if the user has edit option for his dashboard -->\n                                    <m:Text text="{i18n>homePageGroupDisplayDescriptionText_secondParagraph}"\n                                            class="sapUshellFlpSettingsDescription"\n                                            visible="false"/>\n                                </m:items>\n                            </m:VBox>\n                        </m:items>\n                    </m:VBox>\n                </m:items>\n            </m:HBox>\n        </m:items>\n    </m:VBox>\n</View>',
	"sap/ushell/components/shell/UserSettings/LanguageRegionSelector.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/performance/Measurement",
    "sap/ui/thirdparty/jquery",
    "sap/base/Log",
    "sap/ui/core/Locale",
    "sap/ushell/resources",
    "sap/ui/core/LocaleData",
    "sap/ui/model/json/JSONModel"
], function (
    Measurement,
    jQuery,
    Log,
    Locale,
    resources,
    LocaleData,
    JSONModel
) {
    "use strict";

    sap.ui.controller("sap.ushell.components.shell.UserSettings.LanguageRegionSelector", {
        onInit: function () {
            try {
                this.userInfoService = sap.ushell.Container.getService("UserInfo");
                this.oUser = this.userInfoService.getUser();
            } catch (e) {
                Log.error("Getting UserInfo service failed.");
                this.oUser = sap.ushell.Container.getUser();
            }
            this.bIsSetLanguage = sap.ushell.Container.getRenderer("fiori2").getModelConfiguration().enableSetLanguage;
            this.isLanguageChanged = false;
            this.isLanguagePersonalized = this.oUser.isLanguagePersonalized();
            this.sLanguage = this._getFormatedLanguage(this.oUser.getLanguage());
            this.aLanguageList = null;
            var oModel = new JSONModel();
            var sSelectedLanguageText = this.oUser.getLanguageText();
            var modelData = {
                languageList: [{
                    key: this.sLanguage,
                    text: sSelectedLanguageText
                }],
                selectedLanguage: this.sLanguage,
                selectedLanguageText: sSelectedLanguageText
            };
            var oLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
            var oLocaleData = LocaleData.getInstance(oLocale);
            var sDatePattern = oLocaleData.getDatePattern("medium"),
                sTimePattern = oLocaleData.getTimePattern("medium"),
                sTimeFormat = (sTimePattern.indexOf("H") === -1) ? "12h" : "24h";

            modelData.datePatternList = [{ text: sDatePattern, key: sDatePattern }];
            modelData.timeFormat = sTimeFormat;
            modelData.selectedDatePattern = sDatePattern;
            var hourButtons = this.oView.hourFormatSegmentedButton.getButtons();
            var selectedButton = (sTimeFormat === "12h") ? hourButtons[0] : hourButtons[1];
            this.oView.hourFormatSegmentedButton.setSelectedButton(selectedButton);
            oModel.setData(modelData);
            this.oView.setModel(oModel);
        },

        getContent: function () {
            var oDfd = jQuery.Deferred();
            var that = this;
            // if feature - show drop down with all languages.
            // if feature isn't disable - show read only text with current user language
            // if platform didn't implement this feature - enableSetLanguage == undefined - act like disable
            if (this.bIsSetLanguage) {
                Measurement.start("FLP:LanguageRegionSelector.getContent", "getContent", "FLP");
                var dfdLanguageList = this._getLanguagesList();
                dfdLanguageList.done(function (aLanguageList) {
                    // check the response isn't empty
                    if (aLanguageList) {
                        if (aLanguageList.length > 1) {
                            if (!that.isLanguagePersonalized) {
                                that.getView().getModel().setProperty("/selectedLanguage", "default");
                            } else {
                                that.getView().getModel().setProperty("/selectedLanguage", that.oUser.getLanguage());
                            }
                            // by default of UI5 the size is limit to 100 , there can be more then that in our case
                            // so we adjust it to the platform support.
                            that.getView().getModel().setSizeLimit(aLanguageList.length);
                            that.getView().getModel().setProperty("/languageList", aLanguageList);
                            that.oView.inputLanguage.setVisible(false);
                            that.oView.selectLanguage.setVisible(true);
                            that.oView.helpingText.setVisible(true);
                            that.oView.helpingTextLabel.setVisible(true);
                        }
                    }
                    Measurement.end("FLP:LanguageRegionSelector.getContent");
                    oDfd.resolve(that.getView());
                });
                // in case of failure - - show read only text with current user language
                dfdLanguageList.fail(function (sErrorMessage) {
                    Log.error(sErrorMessage);
                    oDfd.resolve(that.getView());
                });
            } else {
                oDfd.resolve(that.getView());
            }
            return oDfd.promise();
        },

        getValue: function () {
            var oDfd = jQuery.Deferred();
            var sSelectedLanguage = this.getView().getModel().getProperty("/selectedLanguage");
            var sUserLanguage = this.oUser.getLanguage();
            // if the language is default - we want to present the local instead of "DEFAULT"
            if (sSelectedLanguage === "default") {
                oDfd.resolve(this._getFormatedLanguage(sUserLanguage) + " | " + resources.i18n.getText("timeFormatFld") + ": " + this.getView().getModel().getProperty("/timeFormat"));
            } else {
                oDfd.resolve(this._getFormatedLanguage(sSelectedLanguage) + " | " + resources.i18n.getText("timeFormatFld") + ": " + this.getView().getModel().getProperty("/timeFormat"));
            }

            return oDfd.promise();
        },

        onCancel: function () {
            var oDfd = jQuery.Deferred();
            if (this.bIsSetLanguage) {
                this.isLanguageChanged = false;
                var sSelectedLanguage = this.getView().getModel().getProperty("/selectedLanguage");
                //only if there was a change
                if (!this.isLanguagePersonalized || this.oUser.getLanguage() !== sSelectedLanguage) {
                    this._handleSelectChange(this.oUser.getLanguage(), "Cancel");
                    oDfd.resolve();
                } else {
                    oDfd.resolve();
                }
            } else {
                oDfd.resolve();
            }

            return oDfd.promise();
        },

        onSave: function () {
            var oDfd = jQuery.Deferred();
            var sOriginLanguage;
            var sSelectedLanguage = this.getView().getModel().getProperty("/selectedLanguage");

            //only if there was a change
            if (this.isLanguageChanged) {
                if (sSelectedLanguage) {
                    sOriginLanguage = this.oUser.getLanguage();
                    this.oUser.setLanguage(sSelectedLanguage);
                    this.userInfoService.updateUserPreferences(this.oUser)
                        .done(function () {
                            oDfd.resolve();
                            window.location.reload(); //refresh the page to apply changes.
                        })
                        // in case of failure - return to the original language
                        .fail(function (sErrorMessage) {
                            this.oUser.setLanguage(sOriginLanguage);
                            this._handleSelectChange(sOriginLanguage, "Cancel");
                            Log.error(sErrorMessage);
                            oDfd.reject(sErrorMessage);
                        }.bind(this));
                }
            } else {
                oDfd.resolve();
            }
            return oDfd.promise();
        },

        _getFormatedLanguage: function (sLanguage) {
            // In case the language value is with region - for example 'en-us', the value would be 'EN (us)'.
            // Otherwise, the value will be 'EN'.
            if (sLanguage && sLanguage.indexOf("-") > -1) {
                sLanguage = sLanguage.replace("-", " (").concat(")").toUpperCase();
            } else if (sLanguage) {
                sLanguage = sLanguage.toUpperCase();
            }
            return sLanguage;
        },

        /**
         * This method call handle the change in the selection language
         * It call in two cases:
         *   Save - the language should be saved on model
         *   Cancel - the original selection(language) should be retrieve.
         * @param {string} sLanguage the newly selected langauge
         * @param {string} sMode - can be "Save" or "Cancel"
         * @private
         */
        _handleSelectChange: function (sLanguage, sMode) {
            var oLocale = new Locale(sLanguage);
            var oLocaleData = LocaleData.getInstance(oLocale);
            var sDatePattern = oLocaleData.getDatePattern("medium"),
                sTimePattern = oLocaleData.getTimePattern("medium"),
                sTimeFormat = (sTimePattern.indexOf("H") === -1) ? "12h" : "24h";
            this.isLanguageChanged = true;
            if (sMode === "Cancel") {
                // if the user language isn't personalzied - need to reurtn browser language
                if (!this.isLanguagePersonalized) {
                    this.getView().selectLanguage.setSelectedKey("default");
                } else {
                    this.getView().selectLanguage.setSelectedKey(sLanguage);
                }
                this.isLanguageChanged = false;
            }
            this.getView().comboDate.setValue(sDatePattern);
            var hourButtons = this.getView().hourFormatSegmentedButton.getButtons();
            var selectedButton = (sTimeFormat === "12h") ? hourButtons[0] : hourButtons[1];
            this.getView().hourFormatSegmentedButton.setSelectedButton(selectedButton);
        },

        /**
         * @returns {Promise} the language list from the platforms , triggered userInfoService API for it
         * @private
         */
        _getLanguagesList: function () {
            var oResultDeferred = jQuery.Deferred();
            // get the list only we haven't get it until now
            if (this.aLanguageList == null) {
                Measurement.start("FLP:LanguageRegionSelector._getLanguagesList", "_getLanguagesList", "FLP");
                var getLanguagePromise = this.userInfoService.getLanguageList();
                getLanguagePromise.done(function (oData) {
                    Measurement.end("FLP:LanguageRegionSelector._getLanguagesList");
                    oResultDeferred.resolve(oData);
                });
                getLanguagePromise.fail(function () {
                    oResultDeferred.reject("Failed to load language list.");
                });
            } else {
                oResultDeferred.resolve(this.aLanguageList);
            }
            return oResultDeferred.promise();
        }
    });
});
},
	"sap/ushell/components/shell/UserSettings/LanguageRegionSelector.view.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/VBox",
    "sap/m/Button",
    "sap/m/SegmentedButton",
    "sap/m/ComboBox",
    "sap/m/Text",
    "sap/m/FlexBox",
    "sap/m/Input",
    "sap/m/Select",
    "sap/m/Label",
    "sap/ui/Device",
    "sap/ushell/resources",
    "sap/ui/core/Item"
], function (
    VBox,
    Button,
    SegmentedButton,
    ComboBox,
    Text,
    FlexBox,
    Input,
    Select,
    Label,
    Device,
    resources,
    Item
) {
    "use strict";

    sap.ui.jsview("sap.ushell.components.shell.UserSettings.LanguageRegionSelector", {
        createContent: function (oController) {
            var itemTemplate = new Item({
                key: "{key}",
                text: "{text}"
            });
            var i18n = resources.i18n;
            var sLanguageLabelFor = "languageSelectionSelect";
            var sDateFormatLabelFor = "dateFormatCombo";
            var sFlexDirection = Device.system.phone ? "Column" : "Row";
            var sFlexAlignItems = Device.system.phone ? "Stretch" : "Center";
            var sTextAlign = Device.system.phone ? "Left" : "Right";
            var sLabelWidth = Device.system.phone ? "auto" : "12rem";
            var sLabelSelectLanguageWidth = Device.system.phone ? "auto" : "16rem";
            var sComboBoxWidth = Device.system.phone ? "100%" : undefined;

            var languageLabel = new Label("languageSelectionLabel", {
                text: {
                    path: "/selectedLanguage",
                    formatter: function (sSelectedLanguage) {
                        sSelectedLanguage = oController._getFormatedLanguage(sSelectedLanguage);
                        // If the language value has region - for example 'en(us)', the label should be 'Language and Region'.
                        // Otherwise, it should be 'Language'.
                        return i18n.getText(sSelectedLanguage.indexOf("(") > -1 ? "languageAndRegionTit" : "languageRegionFld") + ":";
                    }
                },
                width: sLabelWidth,
                textAlign: sTextAlign,
                labelFor: sLanguageLabelFor
            });

            this.selectLanguage = new Select("languageSelectionSelect", {
                visible: false,
                width: sLabelSelectLanguageWidth,
                items: {
                    path: "/languageList",
                    template: itemTemplate
                },
                selectedKey: "{/selectedLanguage}",
                change: function (e) {
                    var sSelectedLanguage = e.getParameters().selectedItem.getKey();
                    oController._handleSelectChange(sSelectedLanguage);
                }
            }).addAriaLabelledBy(languageLabel);

            this.inputLanguage = new Input("languageSelectionInput", {
                visible: true,
                value: "{/selectedLanguageText}",
                editable: false
            }).addAriaLabelledBy(languageLabel);


            var fboxLanguage = new FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    languageLabel,
                    this.selectLanguage,
                    this.inputLanguage
                ]
            });

            this.helpingTextLabel = new Label({
                visible: false,
                text: "",
                width: sLabelWidth,
                textAlign: sTextAlign
            });

            this.helpingText = new Text({
                visible: false,
                text: i18n.getText("LanguageAndRegionHelpingText"),
                width: sLabelSelectLanguageWidth,
                textAlign: "Begin"
            }).addStyleClass("sapUshellFlpSettingsLanguageRegionDescription");

            var fboxHelpingText = new FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    this.helpingTextLabel,
                    this.helpingText
                ]
            });

            var dateLabel = new Label({
                text: i18n.getText("dateFormatFld") + ":",
                width: sLabelWidth,
                textAlign: sTextAlign,
                labelFor: sDateFormatLabelFor
            });

            this.comboDate = new ComboBox("dateFormatCombo", {
                width: sComboBoxWidth,
                items: {
                    path: "/datePatternList",
                    template: itemTemplate
                },
                selectedKey: "{/selectedDatePattern}",
                editable: false
            }).addAriaLabelledBy(dateLabel);

            var fboxDate = new FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    dateLabel,
                    this.comboDate
                ]
            });

            var fboxTimeLabel = new Label({
                text: i18n.getText("timeFormatFld") + ":",
                width: sLabelWidth,
                textAlign: sTextAlign
            });

            this.hourFormatSegmentedButton = new SegmentedButton("hoursSegmentedButton", {
                enabled: false,
                width: "10rem",
                buttons: [
                    new Button({ text: i18n.getText("btn12h") }),
                    new Button({ text: i18n.getText("btn24h") })
                ]
            }).addAriaLabelledBy(fboxTimeLabel);

            var fboxTime = new FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    fboxTimeLabel,
                    this.hourFormatSegmentedButton
                ]
            });

            fboxTime.addStyleClass("sapUshellFlpSettingsLanguageRegionHourFormatFBox");
            var vbox = new VBox({
                items: [fboxLanguage, fboxHelpingText, fboxDate, fboxTime]
            });
            vbox.addStyleClass("sapUiSmallMargin");

            return vbox;
        },

        getControllerName: function () {
            return "sap.ushell.components.shell.UserSettings.LanguageRegionSelector";
        }
    });
});
},
	"sap/ushell/components/shell/UserSettings/Spaces.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Controller of the FLP spaces setting view
 *
 * The FLP spaces setting allows the user to activate either FLP spaces or
 * the classic FLP home page.
 *
 * Further details @see sap.ushell.components.shell.UserSettings.Spaces .
 *
 * @version 1.74.0
 */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ushell/resources",
    "sap/ushell/Config"
], function (Controller, JSONModel, Device, resources, Config) {
    "use strict";


    /**
     * Controller of the FLP spaces setting view <code>Spaces</code>.
     *
     * The FLP spaces setting allows the user to activate either FLP spaces or
     * the classic FLP home page.
     *
     * It allows the user to activate either FLP spaces mode or the classic
     * FLP home page.
     *
     * It is visible only if FLP spaces are configurable by the user
     * (depending on <code>config.ushell.spaces.configurable</code>).
     *
     * @param {string} sId Controller id
     * @param {object} oParams Controller parameters
     *
     * @class
     * @extends sap.ui.core.mvc.Controller
     *
     * @private
     * @since 1.72.0
     * @alias sap.ushell.components.shell.UserSettings.Spaces
     */
    return Controller.extend("sap.ushell.components.shell.UserSettings.Spaces",
        /** @lends sap.ushell.components.shell.UserSettings.Spaces.prototype */ {

        /**
         * UI5 lifecycle method which is called upon controller initialization.
         *
         * It remembers if FLP spaces are currently activated, creates and sets
         * the model and accesses information about the current user.
         *
         * @private
         * @since 1.72.0
         */
        onInit: function () {

            // Remember current spaces setting
            this.bSpacesEnabledSavedValue = Config.last("/core/spaces/enabled");

            // Create and set models
            this.oModel = new JSONModel({
                isSpacesEnabled: this.bSpacesEnabledSavedValue,
                textAlign: Device.system.phone ? "Begin" : "End",
                labelWidth: Device.system.phone ? "auto" : "12rem"
            });

            this.getView().setModel(this.oModel, "config");
            this.getView().setModel(resources.getTranslationModel(), "i18n");

            // Access user information
            this.oUserInfoServicePromise = sap.ushell.Container.getServiceAsync("UserInfo");
        },

        getContent: function () {
            var oDeferred = jQuery.Deferred();
            oDeferred.resolve(this.getView());
            return oDeferred.promise();
        },

        getValue: function () {
            // Nothing to do in this method, still it needs to return a resolved promise
            return jQuery.Deferred().resolve().promise();
        },

        /**
         * Sets the new spaces enabled setting back to the active value.
         * Is called when the settings dialog is cancelled.
         *
         * @private
         * @since 1.72.0
         */
        onCancel: function () {
            this.oModel.setProperty("/isSpacesEnabled", this.bSpacesEnabledSavedValue);
        },

        /**
         * Persists the user's spaces enabled setting.
         * Is called when the setting dialog is saved.
         *
         * @returns {jQuery.Deferred.Promise}
         *    Promise indicating that the settings have been saved
         *
         * @private
         * @since 1.72.0
         */
        onSave: function () {

            // Respond with a jQuery promise
            var oDeferred = jQuery.Deferred();

            var bSpacesEnabledNewValue = this.oModel.getProperty("/isSpacesEnabled");

            // Nothing to do if setting has not been changed
            if (bSpacesEnabledNewValue === this.bSpacesEnabledSavedValue) {
                oDeferred.resolve();
                return oDeferred.promise();
            }

            // Set and persist changed user preferences
            this.oUserInfoServicePromise.then(function (userInfoService) {
                var oUser = userInfoService.getUser();
                oUser.setChangedProperties({
                    propertyName: "spacesEnabled",
                    name: "SPACES_ENABLEMENT"
                }, this.bSpacesEnabledSavedValue, bSpacesEnabledNewValue);

                userInfoService.updateUserPreferences(oUser)
                    .done(function () {
                        oUser.resetChangedProperty("spacesEnabled");
                        // update with the saved value as it is not reflected in the sap.ushell.Config immediately
                        this.bSpacesEnabledSavedValue = bSpacesEnabledNewValue;
                        oDeferred.resolve({refresh: true});
                    }.bind(this))
                    .fail(function (sErrorMessage) {
                        this.oModel.setProperty("/isSpacesEnabled", this.bSpacesEnabledSavedValue);
                        oUser.resetChangedProperty("spacesEnabled");
                        oDeferred.reject(sErrorMessage);
                    }.bind(this));
            }.bind(this));

            return oDeferred.promise();
        }
    });
});
},
	"sap/ushell/components/shell/UserSettings/Spaces.view.xml":'<View controllerName="sap.ushell.components.shell.UserSettings.Spaces"\r\n      xmlns="sap.m">\r\n\r\n    <VBox class="sapUiSmallMargin">\r\n        <HBox>\r\n            <Label\r\n                id="spacesModeLabel"\r\n                text="{i18n>spacesModeLabel}:"\r\n                labelFor="spacesModeSwitch"\r\n                class="sapUshellFlpSettingsLabel"\r\n                width="{config>/labelWidth}"\r\n                textAlign="{config>/textAlign}" />\r\n            <VBox>\r\n                <Switch\r\n                    id="spacesModeSwitch"\r\n                    type="AcceptReject"\r\n                    change=".setCurrentSpacesMode"\r\n                    state="{config>/isSpacesEnabled}" />\r\n                <VBox class ="sapUshellFlpSettingsDescriptionBorder">\r\n                    <Text\r\n                        id="anchorBarDescription"\r\n                        class="sapUshellFlpSettingsDescription"\r\n                        text="{i18n>spacesModeDescriptionText}" />\r\n                </VBox>\r\n            </VBox>\r\n        </HBox>\r\n    </VBox>\r\n</View>',
	"sap/ushell/components/shell/UserSettings/ThemeSelector.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/EventHub",
    "sap/ushell/Config",
    "sap/ui/core/Component",
    "sap/ui/thirdparty/jquery",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/theming/Parameters",
    "sap/ui/Device",
    "sap/ushell/resources"
], function (
    EventHub,
    Config,
    Component,
    jQuery,
    JSONModel,
    Parameters,
    Device,
    resources
) {
    "use strict";

    // Get common name for to complementary (dark/lite) themes
    function getCommonName (name1, name2) {
        var l = Math.min(name1.length, (name2 || "").length);
        var i = 0;
        while (i < l && name1[i] === name2[i]) {
            i++;
        }
        return i ? name1.slice(0, i).trim() : name1;
    }

    sap.ui.controller("sap.ushell.components.shell.UserSettings.ThemeSelector", {
        TILE_SIZE: {
            Small: 0,
            Responsive: 1,

            getName: function (iValue) {
                return Object.keys(this)[iValue];
            }
        },

        onInit: function () {
            try {
                this.userInfoService = sap.ushell.Container.getService("UserInfo");
                this.oUser = this.userInfoService.getUser();
            } catch (e) {
                jQuery.sap.log.error("Getting UserInfo service failed.");
                this.oUser = sap.ushell.Container.getUser();
            }

            this.currentThemeId = this.oUser.getTheme(sap.ushell.User.prototype.constants.themeFormat.ORIGINAL_THEME);
            this.origThemeId = this.currentThemeId;
            this.aThemeList = null;
            this.isContentLoaded = false;
            this.aSapThemeMap = {
                base: "sapUshellBaseIconStyle",
                sap_bluecrystal: "sapUshellBlueCrystalIconStyle",
                sap_belize_hcb: "sapUshellHCBIconStyle",
                sap_belize_hcw: "sapUshellHCWIconStyle",
                sap_belize: "sapUshellBelizeIconStyle",
                sap_belize_plus: "sapUshellPlusIconStyle",
                sap_fiori_3_hcb: "sapUshellHCBIconStyle",
                sap_fiori_3_hcw: "sapUshellHCWIconStyle",
                sap_fiori_3: "sapUshellQuartzLightIconStyle",
                sap_fiori_3_dark: "sapUshellQuartzDarkIconStyle"
            };
            this.oPersonalizers = {};
            this.oThemeNamesMap = {}; // map of id-name keys to store original theme names

            this._oDarkModeModel = this.getDarkModeModel();
            this._aSupportedDarkModeThemes = Config.last("/core/darkMode/supportedThemes");
        },

        getConfigurationModel: function () {
            var oConfModel = new JSONModel({});

            oConfModel.setData({
                isRTL: sap.ui.getCore().getConfiguration().getRTL(),
                sapUiContentIconColor: Parameters.get("sapUiContentIconColor"),
                flexAlignItems: "Center",
                textAlign: Device.system.phone ? "Left" : "Right",
                textDirection: "Row",
                labelWidth: "auto",
                isCozyContentMode: this.isCozyContentMode(),
                sizeBehaviorConfigurable: Config.last("/core/home/sizeBehaviorConfigurable")
            });
            return oConfModel;
        },

        getDarkModeModel: function () {
            var oDarkModeModel = new JSONModel({}),
                oDarkModeModelData = {
                    enabled: false,
                    detectionSupported: false,
                    detectionEnabled: true, //enabled by default in DarkModeSupport service
                    isDarkThemeApplied: false
                };


            if (Config.last("/core/darkMode/enabled")) {
                oDarkModeModelData.enabled = true;
                var oDarkModeSupport = sap.ushell.Container.getService("DarkModeSupport");
                oDarkModeModelData.detectionSupported = oDarkModeSupport.canAutomaticallyToggleDarkMode();
                oDarkModeSupport.attachModeChanged(function (sMode) {
                        oDarkModeModel.setProperty("/isDarkThemeApplied", sMode === sap.ushell.services.DarkModeSupport.Mode.DARK);
                });
            }
            oDarkModeModel.setData(oDarkModeModelData);
            return oDarkModeModel;
        },

        _getIsChangeThemePermitted: function () {
            return this.oUser.isSetThemePermitted();
        },

        onAfterRendering: function () {
            var that = this;
            var bDarkModeActive = this._isDarkModeActive();

            var oDoable = EventHub.on("UserPreferencesDetailNavigated");
            oDoable.do(function (sId) {
                if (sId !== "detailuserPrefThemeSelector") {
                    return;
                }
                oDoable.off("UserPreferencesDetailNavigated");

                var oList = sap.ui.getCore().byId("userPrefThemeSelector--themeList"),
                    items = oList.getItems(),
                    oIcon,
                    sThemeId;

                oList.toggleStyleClass("sapUshellThemeListDisabled", !that.isListActive());
                items.forEach(function (oListItem) {
                    sThemeId = oListItem.getCustomData()[0].getValue();
                    oIcon = oListItem.getContent()[0].getItems()[0].getItems()[0];
                    if (!that.isListActive()) {
                        oListItem.isSelectable = function () {
                            return false;
                        };
                    }
                    if (sThemeId === that.currentThemeId) {
                        oListItem.setSelected(true);
                        if (!that.isListActive()) {
                            oListItem.toggleStyleClass("sapUshellThemeListItemSelected", true);
                        }
                    } else {
                        oListItem.setSelected(false);
                    }
                    if (that.aSapThemeMap[sThemeId]) {
                        oIcon.addStyleClass(that.aSapThemeMap[sThemeId]);
                    }
                    oIcon.toggleStyleClass("sapUshellDarkMode", bDarkModeActive); // Special icon for combined themes in the dark mode
                    oIcon.toggleStyleClass("sapUshellHCBIconStyleOnHCB", sThemeId === that.currentThemeId && (sThemeId || "").indexOf("_hcb") > -1);
                    oIcon.toggleStyleClass("sapUshellHCWIconStyleOnHCW", that.currentThemeId !== "sap_belize_hcb" && (sThemeId || "").indexOf("_hcw") > -1);
                });
                var contentDensitySwitch = sap.ui.getCore().byId("userPrefThemeSelector--contentDensitySwitch");
                if (contentDensitySwitch) {
                    contentDensitySwitch.setState(that.currentContentDensity === "cozy");
                    contentDensitySwitch.setEnabled(that.isContentDensitySwitchEnabled());
                }
                var tileSizeRadioButtonGroup = sap.ui.getCore().byId("userPrefThemeSelector--tileSizeRadioButtonGroup");
                if (tileSizeRadioButtonGroup) {
                    var sizeBehavior = Config.last("/core/home/sizeBehavior");
                    tileSizeRadioButtonGroup.setSelectedIndex(that.TILE_SIZE[sizeBehavior]);
                }

                // Update icon color in config model to current theme's ContentIconColor
                oList.getModel("config").setProperty("/sapUiContentIconColor", Parameters.get("sapUiContentIconColor"));

                // Add role 'list' to avoid screen-readers' 'table' announcement.
                jQuery(".sapUshellAppearanceTable > table").attr("role", "list");
            });
        },

        getContent: function () {
            var that = this;
            var deferred = jQuery.Deferred();
            var oResourceModel = resources.getTranslationModel();
            this.getView().setModel(oResourceModel, "i18n");
            this.getView().setModel(this.getConfigurationModel(), "config");
            this.getView().setModel(this._oDarkModeModel, "darkMode");

            if (this.isContentDensitySwitchEnabled()) {
                this.origContentDensity = this.currentContentDensity;
                if (this.oUser.getContentDensity()) {
                    this.currentContentDensity = this.oUser.getContentDensity();
                } else {
                    this.currentContentDensity = "cozy";
                }
            }
            if (this.isContentLoaded === true) {
                deferred.resolve(this.getView());
            } else {
                var dfdThemeList = this._getThemeList();
                dfdThemeList.done(function (aThemeList) {
                    if (aThemeList.length > 0) {
                        // Sort the array of themes according to theme name
                        aThemeList.sort(function (theme1, theme2) {
                            var theme1Name = theme1.name,
                                theme2Name = theme2.name;
                            if (theme1Name < theme2Name) { //sort string ascending
                                return -1;
                            }
                            if (theme1Name > theme2Name) {
                                return 1;
                            }
                            return 0; //default return value (no sorting)
                        });
                        //set theme selection
                        for (var i = 0; i < aThemeList.length; i++) {
                            if (aThemeList[i].id === that.currentThemeId) {
                                aThemeList[i].isSelected = true;
                            } else {
                                aThemeList[i].isSelected = false;
                            }
                        }
                        that._adjustThemeList(aThemeList);
                        that.getView().getModel().setProperty("/options", aThemeList);
                        deferred.resolve(that.getView());
                    } else {
                        deferred.reject();
                    }
                });

                dfdThemeList.fail(function () {
                    deferred.reject();
                });
            }

            return deferred.promise();
        },

        // Remove duplicated theme entries and adjust theme name when the dark mode is on
        _adjustThemeList: function (aThemeList) {
            aThemeList.forEach(function (oTheme) {
                var sComplementaryId = this._getComplementaryThemeId(oTheme.id);

                oTheme.name = this.oThemeNamesMap[oTheme.id] || oTheme.id || ""; // do it every time to reset the name after the dark mode switch
                oTheme.isVisible = true;
                oTheme.isCombi = false;

                if (this._isDarkModeActive() && sComplementaryId) { // Find if the complementary theme is also included into the list
                    aThemeList.forEach(function (oTheme2) {
                        if (oTheme2.id === sComplementaryId) {
                            oTheme.name = this._getCombinedThemeName(oTheme.id);
                            oTheme.isCombi = true;
                            oTheme.isVisible = oTheme.isSelected;
                            oTheme2.isVisible = !oTheme.isSelected;
                        }
                    }.bind(this));
                }
            }.bind(this));
        },

        getValue: function () {
            var deferred = jQuery.Deferred();
            var themeListPromise = this._getThemeList();
            var that = this;
            var themeName;

            themeListPromise.done(function (aThemeList) {
                that.aThemeList = aThemeList;
                themeName = that._getThemeNameById(that.currentThemeId);
                deferred.resolve(themeName);
            });

            themeListPromise.fail(function (sErrorMessage) {
                deferred.reject(sErrorMessage);
            });

            return deferred.promise();
        },

        onCancel: function () {
            this.currentThemeId = this.oUser.getTheme(sap.ushell.User.prototype.constants.themeFormat.ORIGINAL_THEME);
            if (this.isContentDensitySwitchEnabled()) {
                this.currentContentDensity = this.oUser.getContentDensity();
            }
            this.tileSizeChanged = false;
        },

        onSave: function () {
            var oResultDeferred = jQuery.Deferred(),
                oWhenPromise,
                aPromiseArray = [],
                iTotalPromisesCount = 0,
                iSuccessCount = 0,
                iFailureCount = 0,
                aFailureMsgArr = [],
                saveDoneFunc = function () {
                    iSuccessCount++;
                    oResultDeferred.notify();
                },
                saveFailFunc = function (err) {
                    aFailureMsgArr.push({
                        entry: "currEntryTitle",
                        message: err
                    });
                    iFailureCount++;
                    oResultDeferred.notify();
                };

            var oThemePromise = this.onSaveThemes();
            oThemePromise.done(saveDoneFunc);
            oThemePromise.fail(saveFailFunc);
            aPromiseArray.push(oThemePromise);

            if (this.isContentDensitySwitchEnabled()) {
                var oContentDensityPromise = this.onSaveContentDensity();

                oContentDensityPromise.done(saveDoneFunc);
                oContentDensityPromise.fail(saveFailFunc);
                aPromiseArray.push(oContentDensityPromise);
            }
            if (this.tileSizeChanged && this.currentTileSize) {
                Config.emit("/core/home/sizeBehavior", this.currentTileSize);
                if (this.currentTileSize === "Responsive") {
                    jQuery(".sapUshellTile").removeClass("sapUshellSmall");
                    jQuery(".sapUshellPlusTile").removeClass("sapUshellPlusTileSmall");
                } else {
                    jQuery(".sapUshellTile").addClass("sapUshellSmall");
                    jQuery(".sapUshellPlusTile").addClass("sapUshellPlusTileSmall");
                }
                this.tileSizeChanged = false;

                var oSizeBehaviorPromise = this.writeToPersonalization("flp.settings.FlpSettings", "sizeBehavior", this.currentTileSize);
                oSizeBehaviorPromise.done(saveDoneFunc);
                oSizeBehaviorPromise.fail(saveFailFunc);
                aPromiseArray.push(oSizeBehaviorPromise);
            }
            oWhenPromise = jQuery.when.apply(null, aPromiseArray);

            oWhenPromise.done(function () {
                oResultDeferred.resolve();
            });

            oResultDeferred.progress(function () {
                if (iFailureCount > 0 && (iFailureCount + iSuccessCount === iTotalPromisesCount)) {
                    oResultDeferred.reject("At least one save action failed");
                }
            });

            return oResultDeferred.promise();
        },

        // Apply dark mode after the user has selected a new theme
        _applyDarkMode: function () {
            var oModel = this._oDarkModeModel;
            if (oModel.getProperty("/enabled") && oModel.getProperty("/detectionSupported") && oModel.getProperty("/detectionEnabled")) {
                sap.ushell.Container.getService("DarkModeSupport")._toggleDarkModeBasedOnSystemColorScheme();
            }
        },

        onSaveThemes: function () {
            var deferred = jQuery.Deferred(),
                oUserPreferencesPromise;

            if (this.oUser.getTheme(sap.ushell.User.prototype.constants.themeFormat.ORIGINAL_THEME) !== this.currentThemeId
                    && this.isListActive()) {
                // only if there was a change we would like to save it
                // Apply the selected theme
                if (this.currentThemeId) {
                    this.oUser.setTheme(this.currentThemeId);
                    oUserPreferencesPromise = this.userInfoService.updateUserPreferences(this.oUser);

                    oUserPreferencesPromise.done(function () {
                        this.origThemeId = this.currentThemeId;
                        this.oUser.resetChangedProperty("theme");

                        this._applyDarkMode(); // make sure that the dark mode is applied after the theme change
                        deferred.resolve();
                    }.bind(this));

                    oUserPreferencesPromise.fail(function (sErrorMessage) {
                        // Apply the previous theme to the user
                        this.oUser.setTheme(this.origThemeId);
                        this.oUser.resetChangedProperty("theme");
                        this.currentThemeId = this.origThemeId;

                        jQuery.sap.log.error(sErrorMessage);
                        deferred.reject(sErrorMessage);
                    }.bind(this));
                } else {
                    deferred.reject("Could not find theme: " + this.currentThemeId);
                }
            } else {
                deferred.resolve();//No theme change, do nothing
            }

            return deferred.promise();
        },

        _getThemeList: function () {
            var deferred = jQuery.Deferred(),
                that = this;

            if (!this.aThemeList) {
                var getThemesPromise = this.userInfoService.getThemeList();

                getThemesPromise.done(function (oData) {
                    that.aThemeList = oData.options || [];
                    that.aThemeList.forEach(function (oTheme) {
                        that.oThemeNamesMap[oTheme.id] = oTheme.name;
                    });

                    if (that._getIsChangeThemePermitted() === false) {
                        that.aThemeList = [
                            {
                                id: that.currentThemeId,
                                name: that._getThemeNameById(that.currentThemeId)
                            }
                        ];
                    }

                    deferred.resolve(that.aThemeList);
                });

                getThemesPromise.fail(function () {
                    deferred.reject("Failed to load theme list.");
                });
            } else {
                deferred.resolve(this.aThemeList);
            }

            return deferred.promise();
        },

        getCurrentThemeId: function () {
            return this.currentThemeId;
        },

        setCurrentThemeId: function (newThemeId) {
            this.currentThemeId = newThemeId;
        },

        _getThemeNameById: function (themeId) {
            if (this.aThemeList) {
                for (var i = 0; i < this.aThemeList.length; i++) {
                    if (this.aThemeList[i].id === themeId) {
                        return this._getCombinedThemeName(themeId);
                    }
                }
            }
            //fallback in case relevant theme not found
            return themeId;
        },

        _isDarkModeActive: function () {
            var oModel = this._oDarkModeModel;
            if (oModel.getProperty("/enabled")) {
                return oModel.getProperty("/detectionSupported") ? oModel.getProperty("/detectionEnabled") : true;
            }
            return false;
        },

        // Find the theme ID of the complementary dark/light pair
        _getComplementaryThemeId: function (themeId) {
            var aSupportedDarkModeThemes = this._aSupportedDarkModeThemes || [];
            for (var j = 0; j < aSupportedDarkModeThemes.length; j++) {
                var oPair = aSupportedDarkModeThemes[j];
                if (oPair.dark === themeId) {
                    return oPair.light;
                } else if (oPair.light === themeId) {
                    return oPair.dark;
                }
            }
            return null;
        },

        // If the dark mode is supported
        _getCombinedThemeName: function (themeId) {
            var oThemeNamesMap = this.oThemeNamesMap;

            function getThemeName (id) {
                return oThemeNamesMap[id] || "";
            }

            var sName = getThemeName(themeId);
            return this._isDarkModeActive() ? getCommonName(sName, getThemeName(this._getComplementaryThemeId(themeId))) : sName;
        },

        onSaveContentDensity: function () {
            var deferred = jQuery.Deferred();
            var oUserPreferencesPromise;

            if (this.oUser.getContentDensity() !== this.currentContentDensity && this.isContentDensitySwitchEnabled()) {
                // only if there was a change we would like to save it...
                // Apply the selected mode
                if (this.currentContentDensity) {
                    this.oUser.setContentDensity(this.currentContentDensity);
                    oUserPreferencesPromise = this.userInfoService.updateUserPreferences(this.oUser);
                    oUserPreferencesPromise.done(function () {
                        this.oUser.resetChangedProperty("contentDensity");
                        this.origContentDensity = this.currentContentDensity;
                        sap.ui.getCore().getEventBus().publish("launchpad", "toggleContentDensity", {
                            contentDensity: this.currentContentDensity
                        });
                        EventHub.emit("toggleContentDensity", {
                            contentDensity: this.currentContentDensity
                        });
                        // resolve the promise _after_ the event has been processed
                        // we need to do this in an event handler, as the EventHub is asynchronous.
                        EventHub.once("toggleContentDensity").do(function () {
                            deferred.resolve();
                        });
                    }.bind(this));

                    oUserPreferencesPromise.fail(function (sErrorMessage) {
                        // Apply the previous display density to the user
                        this.oUser.setContentDensity(this.origContentDensity);
                        this.oUser.resetChangedProperty("contentDensity");
                        this.currentContentDensity = this.origContentDensity;
                        jQuery.sap.log.error(sErrorMessage);

                        deferred.reject(sErrorMessage);
                    }.bind(this));
                } else {
                    deferred.reject("Could not find mode: " + this.currentContentDensity);
                }
            } else {
                deferred.resolve();//No mode change, do nothing
            }

            return deferred.promise();
        },

        getCurrentContentDensity: function () {
            return this.currentContentDensity;
        },

        isCozyContentMode: function () {
            return !!jQuery("body.sapUiSizeCozy").length;
        },

        setCurrentContentDensity: function (e) {
            var newContentDensityId = e.getSource().getState() ? "cozy" : "compact";
            this.currentContentDensity = newContentDensityId;
        },

        setCurrentTileSize: function (e) {
            var newTileSizeIndex = e.getSource().getSelectedIndex();
            this.currentTileSize = this.TILE_SIZE.getName(newTileSizeIndex);
            this.tileSizeChanged = true;
        },

        getIconFormatter: function (themeId) {
            if (this.aSapThemeMap[themeId]) {
                return undefined;
            }
            return "sap-icon://palette";
        },

        onSelectHandler: function (oEvent) {
            var oItem = oEvent.getParameters().listItem;
            this.setCurrentThemeId(oItem.getBindingContext().getProperty("id"));
        },

        isContentDensitySwitchEnabled: function () {
            return !Device.system.phone;
        },

        isListActive: function () {
            return this.getView().getModel().getProperty("/setTheme");
        },

        /**
         * Calls the Personalization service to write the given value to the backend at the given
         * place identified by the container and item name.
         *
         * @param {string} sContainer The name of the container
         * @param {string} sItem The name of the item
         * @param {any} vValue The value to be posted to the personalization service
         * @returns {Promise} A promise that is resolved once the personalization data is written.
         *                    This promise is rejected if the service fails in doing so.
         */
        writeToPersonalization: function (sContainer, sItem, vValue) {
            var oPromise;

            try {
                oPromise = this.getPersonalizer(sContainer, sItem).setPersData(vValue);
            } catch (oError) {
                jQuery.sap.log.error("Personalization service does not work:");
                jQuery.sap.log.error(oError.name + ": " + oError.message);

                oPromise = jQuery.when(Promise.reject(oError));
            }

            return oPromise;
        },

        /**
         * Retrieves a Personalizer instance from the Personalization service and stores it in an internal map.
         *
         * @param {string} sContainer The container ID
         * @param {string} sItem The item ID
         * @returns {object} A new or cached Personalizer instance
         */
        getPersonalizer: function (sContainer, sItem) {
            var sKey = sContainer + "-" + sItem;

            if (this.oPersonalizers[sKey]) {
                return this.oPersonalizers[sKey];
            }

            var oPersonalizationService = sap.ushell.Container.getService("Personalization");
            var oComponent = Component.getOwnerComponentFor(this);
            var oScope = {
                keyCategory: oPersonalizationService.constants.keyCategory.FIXED_KEY,
                writeFrequency: oPersonalizationService.constants.writeFrequency.LOW,
                clientStorageAllowed: true
            };

            if (!this.oPersonalizers[sKey]) {
                this.oPersonalizers[sKey] = oPersonalizationService.getPersonalizer({
                    container: sContainer,
                    item: sItem
                }, oScope, oComponent);
            }

            return this.oPersonalizers[sKey];
        },

        changeThemeMode: function (oEvent) {
            sap.ushell.Container.getService("DarkModeSupport").toggleModeChange();
        },

        changeSystemModeDetection: function (oEvent) {
            var bSwitchState = oEvent.getSource().getState();
            if (bSwitchState) {
                sap.ushell.Container.getService("DarkModeSupport").enableDarkModeBasedOnSystem();
            } else {
                sap.ushell.Container.getService("DarkModeSupport").disableDarkModeBasedOnSystem();
            }

            // Re-adjust the theme list after the dark mode change
            var oModel = this.getView().getModel();
            var aThemes = oModel.getProperty("/options");
            this._adjustThemeList(aThemes);
            this.getView().getModel().setProperty("/options", aThemes);
            this.getView().invalidate();
        }

    });
});
},
	"sap/ushell/components/shell/UserSettings/ThemeSelector.view.xml":'<View controllerName="sap.ushell.components.shell.UserSettings.ThemeSelector"\n\txmlns="sap.m"\n\txmlns:core="sap.ui.core">\n\t<IconTabBar id="idIconTabBar" applyContentPadding="true" expandable="false">\n\t\t<items>\n\t\t\t<IconTabFilter text="{i18n>AppearanceThemeMenu}">\n\t\t\t\t<List items="{path: \'/options\'}"\n\t\t\t\t\tincludeItemInSelection="true"\n\t\t\t\t\tmode="SingleSelectMaster"\n\t\t\t\t\tselectionChange="onSelectHandler"\n\t\t\t\t\tid="themeList">\n\t\t\t\t\t<items>\n\t\t\t\t\t\t<CustomListItem selected="{isSelected}" visible="{isVisible}" class="sapUshellAppearanceCustomListItem">\n\t\t\t\t\t\t\t<customData>\n\t\t\t\t\t\t\t\t<core:CustomData key="themeid" value="{id}" writeToDom="true" />\n\t\t\t\t\t\t\t</customData>\n\t\t\t\t\t\t\t<HBox>\n\t\t\t\t\t\t\t\t<HBox class="sapUshellAppearanceItemViewLeft">\n\t\t\t\t\t\t\t\t\t<core:Icon src="{parts:[{path:\'id\'}], formatter:\'.getIconFormatter\'}"\n\t\t\t\t\t\t\t\t\t\tcolor="{config>/sapUiContentIconColor}"\n\t\t\t\t\t\t\t\t\t\tsize="1.75rem"\n\t\t\t\t\t\t\t\t\t\tclass="sapUshellAppearanceIcon" />\n\t\t\t\t\t\t\t\t\t<Text text="{name}" class="sapUshellAppearanceItemText">\n\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<FlexItemData styleClass="sapUshellAppearanceFlexItemText" />\n\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t</HBox>\n\t\t\t\t\t\t\t\t<HBox class="sapUshellAppearanceItemViewRight">\n\t\t\t\t\t\t\t\t\t<core:Icon src="sap-icon://sys-enter-2"\n\t\t\t\t\t\t\t\t\t\tvisible="{isSelected}"\n\t\t\t\t\t\t\t\t\t\tcolor="{config>/sapUiContentIconColor}"\n\t\t\t\t\t\t\t\t\t\tsize="1.375rem" />\n\t\t\t\t\t\t\t\t</HBox>\n\t\t\t\t\t\t\t</HBox>\n\t\t\t\t\t\t</CustomListItem>\n\t\t\t\t\t</items>\n\t\t\t\t</List>\n\t\t\t</IconTabFilter>\n\t\t\t<IconTabFilter text="{i18n>AppearanceLayoutAndBehaviorMenu}" id="DisplaySettingsTab">\n\t\t\t\t<HBox alignItems="Start" justifyContent="End" class="sapUshellAppearanceBox">\n\t\t\t\t\t<Label\n\t\t\t\t\t\tlabelFor="contentDensitySwitch"\n\t\t\t\t\t\ttext="{i18n>AppearanceContentDensityLabel}:"\n\t\t\t\t\t\tclass="sapUshellAppearanceLabel"\n\t\t\t\t\t\twidth="{config>/labelWidth}"\n\t\t\t\t\t\ttextAlign="{config>/textAlign}" />\n\t\t\t\t\t<VBox alignItems="Baseline" class="sapUshellAppearanceContentDensityText">\n\t\t\t\t\t\t<Switch\n\t\t\t\t\t\t\ttype="Default"\n\t\t\t\t\t\t\tid="contentDensitySwitch"\n\t\t\t\t\t\t\tclass="sapUshellAppearanceSwitchButton"\n\t\t\t\t\t\t\ttooltip="{i18n>AppearanceContentDensityTooltip}"\n\t\t\t\t\t\t\tchange="setCurrentContentDensity"\n\t\t\t\t\t\t\tstate="{config>/isCozyContentMode}"\n\t\t\t\t\t\t\tenabled="{config>/isContentDensitySwitchEnable}" />\n\t\t\t\t\t\t<Text text="{i18n>appearanceCompactCozyDescriptionText}" class="sapUshellFlpSettingsDescription" />\n\t\t\t\t\t</VBox>\n\t\t\t\t</HBox>\n\t\t\t\t<HBox visible="{config>/sizeBehaviorConfigurable}" alignItems="Start" justifyContent="End" class="sapUshellAppearanceBox">\n\t\t\t\t\t<Label text="{i18n>AppearanceTileSizeLabel}:"\n\t\t\t\t\t\tclass="sapUshellAppearanceLabel"\n\t\t\t\t\t\twidth="{config>/labelWidth}"\n\t\t\t\t\t\ttextAlign="{config>/textAlign}"\n\t\t\t\t\t\tlabelFor="setCurrentTileSize"\n\t\t\t\t\t\tid="sapUshellAppearanceTileSizeLabel" />\n\t\t\t\t\t<VBox class="sapUshellAppearanceTileSizeText">\n\t\t\t\t\t\t<RadioButtonGroup select="setCurrentTileSize" selectedIndex="{config>/tileSize}" id="tileSizeRadioButtonGroup">\n\t\t\t\t\t\t\t<buttons>\n\t\t\t\t\t\t\t\t<RadioButton text="{i18n>AppearanceTileSizeSmall}"\n\t\t\t\t\t\t\t\t\tclass="sapUshellAppearanceTileSizeSmall"\n\t\t\t\t\t\t\t\t\tariaLabelledBy="sapUshellAppearanceTileSizeLabel" />\n\t\t\t\t\t\t\t\t<RadioButton text="{i18n>AppearanceTileSizeLarge}"\n\t\t\t\t\t\t\t\t\tclass="sapUshellAppearanceTileSizeLarge"\n\t\t\t\t\t\t\t\t\tariaLabelledBy="sapUshellAppearanceTileSizeLabel" />\n\t\t\t\t\t\t\t</buttons>\n\t\t\t\t\t\t</RadioButtonGroup>\n\t\t\t\t\t\t<Text text="{i18n>appearanceTileSizeDescriptionText}" class="sapUshellFlpSettingsDescription" />\n\t\t\t\t\t</VBox>\n\t\t\t\t</HBox>\n\t\t\t\t<HBox visible="{darkMode>/enabled}" alignItems="Start" justifyContent="End" class="sapUshellAppearanceBox">\n\t\t\t\t\t<Label\n\t\t\t\t\t\tlabelFor="{= ${darkMode>/detectionSupported} ? \'darkModeDetectionSwitcher\' : \'darkModeSwitcher\'}"\n\t\t\t\t\t\ttext="{i18n>AppearanceDarkModeLabel}:"\n\t\t\t\t\t\tclass="sapUshellAppearanceLabel"\n\t\t\t\t\t\twidth="{config>/labelWidth}"\n\t\t\t\t\t\ttextAlign="{config>/textAlign}" />\n\n\t\t\t\t\t<VBox visible="{darkMode>/detectionSupported}" alignItems="Baseline" class="sapUshellAppearanceContentDensityText">\n\t\t\t\t\t\t<Switch\n\t\t\t\t\t\t\ttype="Default"\n\t\t\t\t\t\t\tid="darkModeDetectionSwitcher"\n\t\t\t\t\t\t\tclass="sapUshellAppearanceSwitchButton"\n\t\t\t\t\t\t\ttooltip="{i18n>AppearanceDarkModeDetectionTooltip}"\n\t\t\t\t\t\t\tchange="changeSystemModeDetection"\n\t\t\t\t\t\t\tstate="{darkMode>/detectionEnabled}" />\n\t\t\t\t\t\t<Text text="{i18n>appearanceDarkModeDetectionText}" class="sapUshellFlpSettingsDescription" />\n\t\t\t\t\t\t<MessageStrip\n\t\t\t\t\t\t\ttext="{i18n>appearanceDarkModeWarning}"\n\t\t\t\t\t\t\ttype="Warning"\n\t\t\t\t\t\t\tshowIcon="true"\n\t\t\t\t\t\t\tclass="sapUshellFlpSettingsWarning" />\n\t\t\t\t\t</VBox>\n\n\t\t\t\t\t<VBox visible="{=!${darkMode>/detectionSupported}}" alignItems="Baseline" class="sapUshellAppearanceContentDensityText">\n\t\t\t\t\t\t<Switch\n\t\t\t\t\t\t\ttype="Default"\n\t\t\t\t\t\t\tid="darkModeSwitcher"\n\t\t\t\t\t\t\tclass="sapUshellAppearanceSwitchButton"\n\t\t\t\t\t\t\ttooltip="{i18n>AppearanceDarkModeSwitchTooltip}"\n\t\t\t\t\t\t\tchange="changeThemeMode"\n\t\t\t\t\t\t\tstate="{darkMode>/isDarkThemeApplied}" />\n\t\t\t\t\t\t<Text text="{i18n>appearanceDarkModeSwitchText}" class="sapUshellFlpSettingsDescription" />\n\t\t\t\t\t\t<MessageStrip\n\t\t\t\t\t\t\ttext="{i18n>appearanceDarkModeWarning}"\n\t\t\t\t\t\t\ttype="Warning"\n\t\t\t\t\t\t\tshowIcon="true"\n\t\t\t\t\t\t\tclass="sapUshellFlpSettingsWarning" />\n\t\t\t\t\t</VBox>\n\t\t\t\t</HBox>\n\t\t\t</IconTabFilter>\n\t\t</items>\n\t</IconTabBar>\n</View>\n',
	"sap/ushell/components/shell/UserSettings/UsageAnalyticsSelector.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ushell/resources"
], function (jQuery, resources) {
    "use strict";

    sap.ui.controller("sap.ushell.components.shell.UserSettings.UsageAnalyticsSelector", {
        onInit: function () {
            this.oUser = sap.ushell.Container.getUser();
            this.switchStateValue = this.oUser.getTrackUsageAnalytics();
            this.getView().oSwitchButton.setState(this.switchStateValue);
        },

        getContent: function () {
            var that = this,
                deferred = jQuery.Deferred();

            deferred.resolve(that.getView());
            return deferred.promise();
        },

        getValue: function () {
            var deferred = jQuery.Deferred(),
                i18n = resources.i18n;
            deferred.resolve(this.switchStateValue ? i18n.getText("trackingEnabled") : i18n.getText("trackingDisabled"));
            return deferred.promise();
        },

        onSave: function () {
            var currentUserTracking = this.getView().oSwitchButton.getState();
            this.switchStateValue = currentUserTracking;
            return sap.ushell.Container.getService("UsageAnalytics").setTrackUsageAnalytics(currentUserTracking);
        },

        onCancel: function () {
            this.getView().oSwitchButton.setState(this.switchStateValue);
        }
    });
}, /* bExport= */ true);
},
	"sap/ushell/components/shell/UserSettings/UsageAnalyticsSelector.view.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Label",
    "sap/ushell/resources",
    "sap/ui/Device",
    "sap/m/Switch",
    "sap/m/library",
    "sap/m/Text",
    "sap/m/HBox",
    "sap/m/FlexItemData",
    "sap/m/VBox"
], function (
    Label,
    resources,
    Device,
    Switch,
    mobileLibrary,
    Text,
    HBox,
    FlexItemData,
    VBox
) {
    "use strict";

    // shortcut for sap.m.SwitchType
    var SwitchType = mobileLibrary.SwitchType;

    sap.ui.jsview("sap.ushell.components.shell.UserSettings.UsageAnalyticsSelector", {
        createContent: function (/*oController*/) {
            var sFBoxAlignItems = Device.system.phone ? "Start" : "Center",
                sFlexWrap = Device.system.phone ? "Wrap" : "NoWrap",
                sFBoxDirection = Device.system.phone ? "Column" : "Row",
                sTextAlign = Device.system.phone ? "Left" : "Right",
                sAllignSelf = Device.system.phone ? "Baseline" : "Auto",
                sWidth = Device.system.phone ? "auto" : "11.75rem";

            this.oLabel = new Label({
                width: sWidth,
                textAlign: sTextAlign,
                text: resources.i18n.getText("allowTracking") + ":"
            }).addStyleClass("sapUshellUsageAnalyticsSelectorLabel");

            this.oSwitchButton = new Switch("usageAnalyticsSwitchButton", {
                type: SwitchType.Default
            }).addStyleClass("sapUshellUsageAnalyticsSelectorSwitchButton");

            this.oMessage = new Text({
                text: sap.ushell.Container.getService("UsageAnalytics").getLegalText()
            }).addStyleClass("sapUshellUsageAnalyticsSelectorLegalTextMessage");

            this.fBox = new HBox({
                alignItems: sFBoxAlignItems,
                wrap: sFlexWrap,
                direction: sFBoxDirection,
                height: "2rem",
                items: [
                    this.oLabel,
                    this.oSwitchButton
                ],
                layoutData: new FlexItemData({ alignSelf: sAllignSelf })
            });

            this.vBox = new VBox({
                items: [this.fBox, this.oMessage]
            });

            return this.vBox;
        },

        getControllerName: function () {
            return "sap.ushell.components.shell.UserSettings.UsageAnalyticsSelector";
        }
    });
}, /* bExport= */ true);
},
	"sap/ushell/components/shell/UserSettings/UserPreferences.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/resources",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/components/SharedComponentUtils",
    "sap/ushell/Config",
    "sap/ui/thirdparty/jquery",
    "sap/base/Log",
    "sap/ushell/utils"
], function (
    resources,
    AppLifeCycle,
    oSharedComponentUtils,
    Config,
    jQuery,
    Log,
    utils
) {
    "use strict";

    // Shortcut to sap.ushell.Container.getRenderer("fiori2")
    function _renderer () {
        return sap.ushell.Container.getRenderer("fiori2");
    }

    // Shortcut to AppLifeCycle.getElementsModel().getModel()
    function _model () {
        return AppLifeCycle.getElementsModel().getModel();
    }

    function GeneralEntry (viewId, viewFullName, viewType, entryHelpID, title, onSaveFunc, onCancelFunc, getContentFunc, getValueFunc, isEditableFunc, oModel, entryIcon, defaultVisibility) {
        this.view = null;
        this.getView = function () {
            if (!this.view || !sap.ui.getCore().byId(viewId)) {
                if (viewType === "xml") {
                    this.view = sap.ui.xmlview(viewId, viewFullName);
                } else {
                    this.view = sap.ui.jsview(viewId, viewFullName);
                }
            }
            if (oModel) {
                this.view.setModel(oModel);
            }
            return this.view;
        };

        return {
            entryHelpID: entryHelpID,
            title: title,
            valueResult: null,
            onSave: onSaveFunc ? onSaveFunc.bind(this) : function () {
                if (this.getView().getController().onSave) {
                    return this.getView().getController().onSave();
                }
            }.bind(this),
            onCancel: onCancelFunc ? onCancelFunc.bind(this) : function () {
                if (this.getView().getController().onCancel) {
                    return this.getView().getController().onCancel();
                }
            }.bind(this),
            contentFunc: getContentFunc ? getContentFunc.bind(this) : function () {
                if (this.getView().getController().getContent) {
                    return this.getView().getController().getContent();
                }
            }.bind(this),
            valueArgument: getValueFunc ? getValueFunc.bind(this) : function () {
                var dfd = new jQuery.Deferred(),
                    that = this;

                setTimeout(function () {
                    if (that.getView().getController().getValue) {
                        that.getView().getController().getValue().done(function (value) {
                            dfd.resolve(value);
                        });
                    }
                }, 0);

                return dfd.promise();
            }.bind(this),
            editable: typeof isEditableFunc === "function" ? isEditableFunc() : isEditableFunc,
            contentResult: null,
            icon: entryIcon,
            defaultVisibility: defaultVisibility
        };
    }

    function createControllerMethodCaller (sMethod) {
        return function () {
            return this.getView().getController()[sMethod]();
        };
    }

    function createSpecificEntry (oParams) {
        var oEntry = {
            entryHelpID: oParams.entryHelpId,
            title: resources.i18n.getText(oParams.i18nTitleKey),
            editable: true,
            valueResult: null,
            contentResult: null,
            icon: oParams.icon,
            getView: function () {
                var fnCreateView = oParams.viewType === "xml"
                    ? sap.ui.xmlview
                    : sap.ui.jsview;

                var oView = sap.ui.getCore().byId(oParams.viewId);
                if (!oView) {
                    oView = fnCreateView(oParams.viewId, oParams.componentNamespace);
                }
                return oView;
            }
        };

        oEntry.valueArgument = createControllerMethodCaller("getValue").bind(oEntry);
        oEntry.onSave = createControllerMethodCaller("onSave").bind(oEntry);
        oEntry.onCancel = createControllerMethodCaller("onCancel").bind(oEntry);
        oEntry.contentFunc = createControllerMethodCaller("getContent").bind(oEntry);

        return oEntry;
    }

    function LanguageRegionEntry () {
        return createSpecificEntry({
            entryHelpId: "language",
            i18nTitleKey: "languageRegionTit",
            icon: "sap-icon://globe",
            viewId: "languageRegionSelector",
            componentNamespace: "sap.ushell.components.shell.UserSettings.LanguageRegionSelector"
        });
    }

    function UserActivitiesEntry () {
        return createSpecificEntry({
            entryHelpId: "UserActivitiesEntry",
            i18nTitleKey: "userActivities",
            icon: "sap-icon://laptop",
            viewId: "userActivitiesHandler",
            componentNamespace: "sap.ushell.components.shell.UserSettings.userActivitiesHandler"
        });
    }

    function SpacesEntry () {
        return createSpecificEntry({
            entryHelpId: "spaces",
            i18nTitleKey: "spaces",
            icon: "sap-icon://home",
            viewId: "Spaces",
            viewType: "xml",
            componentNamespace: "sap.ushell.components.shell.UserSettings.Spaces"
        });
    }

    function UserAccountEntry () {
        var oShellConfig = _renderer().getShellConfig();

        var bUseSelector = oShellConfig.enableUserImgConsent;

        var sViewId = bUseSelector
            ? "userAccountSelector"
            : "userAccountSetting";

        var sComponentNamespace = bUseSelector
            ? "sap.ushell.components.shell.UserSettings.userAccount.UserAccountSelector"
            : "sap.ushell.components.shell.UserSettings.userAccount.UserAccountSetting";

        return createSpecificEntry({
            entryHelpId: "userAccountEntry",
            i18nTitleKey: "UserAccountFld",
            icon: "sap-icon://account",
            viewId: sViewId,
            componentNamespace: sComponentNamespace,
            viewType: "xml"
        });
    }

    function _getUserPrefDefaultModel () {
        var oModel = _model(),
            oUser = sap.ushell.Container.getUser(),
            entries = [],
            profilingEntries = [];

        // Create user preference entries for:
        // - themeSelector
        // - usageAnalytics
        // - DefaultParameters
        // - userProfiling
        // - CompactCozySelector
        // - spaces (enabled/disabled)

        entries.push(new UserAccountEntry());

        var themeSelectorEntry = new GeneralEntry(
            "userPrefThemeSelector",
            "sap.ushell.components.shell.UserSettings.ThemeSelector",
            "xml",
            "themes",
            resources.i18n.getText("Appearance"),
            function () {
                var dfd = this.getView().getController().onSave();
                dfd.done(function () {
                    // re-calculate tiles background color according to the selected theme
                    if (Config.last("/core/home/enableTilesOpacity")) {
                        utils.handleTilesOpacity();
                    }
                });
                return dfd;
            },
            undefined,
            undefined,
            undefined,
            function () {
                if (Config.last("/core/shell/model/setTheme") !== undefined) {
                    return Config.last("/core/shell/model/setTheme") && oUser.isSetThemePermitted();
                }
                return oUser.isSetThemePermitted();
            },
            oModel,
            "sap-icon://palette"
        );
        entries.push(themeSelectorEntry);

        var usageAnalyticsEntry = new GeneralEntry(
            "userPrefUsageAnalyticsSelector",
            "sap.ushell.components.shell.UserSettings.UsageAnalyticsSelector",
            "js",
            "usageAnalytics",
            resources.i18n.getText("usageAnalytics"),
            undefined,
            undefined,
            undefined,
            undefined,
            sap.ushell.Container.getService("UsageAnalytics").isSetUsageAnalyticsPermitted()
        );
        profilingEntries.push(usageAnalyticsEntry);

        var userProfilingEntry = new GeneralEntry(
            "userProfilingView",
            "sap.ushell.components.shell.UserSettings.UserProfiling",
            "js",
            "userProfiling",
            resources.i18n.getText("userProfiling"),
            undefined,
            undefined,
            undefined,
            undefined,
            false,
            oModel,
            "sap-icon://user-settings",
            false
        );

        var bEnableSpacesSettings = Config.last("/core/spaces/configurable");
        if (bEnableSpacesSettings) {
            entries.push(new SpacesEntry());
        }

        entries.push(new LanguageRegionEntry());

        var enableRecentActivity = Config.last("/core/shell/enableRecentActivity");
        if (enableRecentActivity) {
            entries.push(new UserActivitiesEntry());
        }
        entries.push(userProfilingEntry);

        // User setting entry for notification setting UI
        // Added only if both notifications AND notification settings are enabled
        if (Config.last("/core/shell/model/enableNotifications") === true) {
            var oNotificationSettingsAvalabilityPromise = sap.ushell.Container.getService("Notifications")._getNotificationSettingsAvalability(),
                notificationSettingsEntry;

            notificationSettingsEntry = new GeneralEntry(
                "notificationSettings",
                "sap.ushell.components.shell.Notifications.Settings",
                "js",
                "notification",
                resources.i18n.getText("notificationSettingsEntry_title"),
                undefined,
                undefined,
                undefined,
                undefined,
                true,
                undefined,
                "sap-icon://bell",
                false
            );
            entries.push(notificationSettingsEntry);

            oNotificationSettingsAvalabilityPromise.done(function (oStatuses) {
                if (oStatuses.settingsAvailable) {
                    notificationSettingsEntry.visible = true;// in case the notification entry did not enter already to the model, we should change the
                    Config.last("/core/shell/model/userPreferences/entries").every(function (entry, index) {
                        if (entry.title === resources.i18n.getText("notificationSettingsEntry_title")) {
                            oModel.setProperty("/userPreferences/entries/" + index + "/visible", true);
                            return false;
                        }
                        return true;
                    });
                }
            });
        }

        if (Config.last("/core/shell/model/userDefaultParameters")) {
            var defaultParametersEntry = new GeneralEntry(
                "defaultParametersSelector",
                "sap.ushell.components.shell.UserSettings.DefaultParameters",
                "js",
                "defaultParameters",
                resources.i18n.getText("defaultsValuesEntry"),
                undefined,
                undefined,
                undefined,
                undefined,
                true,
                undefined,
                undefined,
                false
            );
            entries.push(defaultParametersEntry);
        }

        // When spaces are enabled there is no classical homepage
        var bEnableHomePageSettings = Config.last("/core/home/enableHomePageSettings") && !Config.last("/core/spaces/enabled");
        if (bEnableHomePageSettings) {
            entries.push(getHomepageSettingsEntity());
        }

        return {
            dialogTitle: resources.i18n.getText("userSettings"),
            isDetailedEntryMode: false,
            activeEntryPath: null, //the entry that is currently modified
            entries: entries,
            profiling: profilingEntries
        };
    }

    /**
     * Adds the settings for the homepage to the settings view.
     */
    function getHomepageSettingsEntity () {
        var oRenderer = _renderer(),
            oResourceBundle = resources.i18n;

        var flpSettingsView;

        var oEntry = {
            title: oResourceBundle.getText("FlpSettings_entry_title"),
            entryHelpID: "flpSettingsEntry",
            valueArgument: function () {
                return jQuery.Deferred().resolve(" ");
            },
            contentFunc: function () {
                var oDeferred = new jQuery.Deferred();

                oSharedComponentUtils.getEffectiveHomepageSetting("/core/home/homePageGroupDisplay", "/core/home/enableHomePageSettings").then(function (sDisplay) {
                    flpSettingsView = sap.ui.xmlview({
                        viewName: "sap.ushell.components.shell.UserSettings.FlpSettings",
                        viewData: {
                            initialDisplayMode: sDisplay || "scroll"
                        }
                    });
                    oDeferred.resolve(flpSettingsView);
                });

                return oDeferred;
            },
            onSave: function () {
                var sDisplay = flpSettingsView.getController().onSave();

                // save anchor bar mode in personalization
                var oDeferred = oSharedComponentUtils.getPersonalizer("homePageGroupDisplay", oRenderer)
                    .setPersData(sDisplay);

                // Log failure if occurs.
                oDeferred.fail(function (error) {
                    Log.error(
                        "Failed to save the anchor bar mode in personalization", error,
                        "sap.ushell.components.flp.settings.FlpSettings");
                });
                Config.emit("/core/home/homePageGroupDisplay", sDisplay);
                return jQuery.Deferred().resolve();
            },
            onCancel: function () {
                return jQuery.Deferred().resolve();
            },
            icon: "sap-icon://home"
        };

        return oEntry;
    }

    /**
     * Add user preferences to the shell model.
     * @private
     */
    function setModel () {
        var userPreferencesEntryArray = Config.last("/core/shell/model/userPreferences/entries");
        var oDefaultUserPrefModel = _getUserPrefDefaultModel();
        oDefaultUserPrefModel.entries = oDefaultUserPrefModel.entries.concat(userPreferencesEntryArray);
        // Re-order the entries array to have the Home Page entry right after the Appearance entry (if both exist)
        oDefaultUserPrefModel.entries = _renderer().reorderUserPrefEntries(oDefaultUserPrefModel.entries);

        _model().setProperty("/userPreferences", oDefaultUserPrefModel);
    }

    return { setModel: setModel };
});
},
	"sap/ushell/components/shell/UserSettings/UserProfiling.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery"
], function (jQuery) {
    "use strict";

    sap.ui.controller("sap.ushell.components.shell.UserSettings.UserProfiling", {
        onInit: function () {
            this.isContentLoaded = true;
        },

        onCancel: function () {
            var aProfilingEntries = this.getView().getModel().getProperty("/userPreferences/profiling"),
                oProfilingEntry,
                index;

            for (index = 0; index < aProfilingEntries.length; index++) {
                oProfilingEntry = aProfilingEntries[index];
                if (oProfilingEntry.onCancel) {
                    oProfilingEntry.onCancel();
                }
            }
        },

        getValue: function () {
            var deferred = jQuery.Deferred();
            var profilingEntries = this.getView().getModel().getProperty("/userPreferences/profiling");
            //remove usage analytics entry if its not enabled
            profilingEntries.forEach(function (entry, index) {
                if (entry.entryHelpID === "usageAnalytics") {
                    if (!sap.ushell.Container.getService("UsageAnalytics").systemEnabled() ||
                        !sap.ushell.Container.getService("UsageAnalytics").isSetUsageAnalyticsPermitted()) {
                        profilingEntries.splice(index, 1);
                    }
                }
            }, this);

            if (profilingEntries !== undefined && profilingEntries.length > 0) {
                deferred.resolve({
                    value: 1,
                    displayText: " "
                });
            } else {
                deferred.resolve({
                    value: 0,
                    displayText: " "
                });
            }
            return deferred.promise();
        },

        onSave: function () {
            var oResultDeferred = jQuery.Deferred(),
                aProfilingEntries = this.getView().getModel().getProperty("/userPreferences/profiling"),
                oWhenPromise,
                aPromiseArray = [],
                iTotalPromisesCount = 0,
                iSuccessCount = 0,
                iFailureCount = 0,
                aFailureMsgArr = [],
                oTempPromise,
                saveDoneFunc = function () {
                    iSuccessCount++;
                    oResultDeferred.notify();
                },
                saveFailFunc = function (err) {
                    aFailureMsgArr.push({
                        entry: "currEntryTitle",
                        message: err
                    });
                    iFailureCount++;
                    oResultDeferred.notify();
                };

            aProfilingEntries.forEach(function (item) {
                oTempPromise = item.onSave();
                oTempPromise.done(saveDoneFunc);
                oTempPromise.fail(saveFailFunc);
                aPromiseArray.push(oTempPromise);
                iTotalPromisesCount++;
            });

            oWhenPromise = jQuery.when.apply(null, aPromiseArray);

            oWhenPromise.done(function () {
                oResultDeferred.resolve();
            });

            oResultDeferred.progress(function () {
                if (iFailureCount > 0 && (iFailureCount + iSuccessCount === iTotalPromisesCount)) {
                    oResultDeferred.reject("At least one save action failed");
                }
            });

            return oResultDeferred.promise();
        },

        getContent: function () {
            var that = this,
                deferred = jQuery.Deferred(),
                aProfilingEntries = this.getView().getModel().getProperty("/userPreferences/profiling");

            aProfilingEntries.forEach(function (item) {
                var contentPromise = item.contentFunc();
                contentPromise.done(function (result) {
                    that.getView().profilingContent.addItem(result);
                });
            });

            deferred.resolve(that.getView());
            return deferred.promise();
        }
    });
});
},
	"sap/ushell/components/shell/UserSettings/UserProfiling.view.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * View for displaying the User Profiling entires such as Usageamalytice ans Personalized Search.
 * The View is launched when the UserProfiling option is chosen in the USerSettings UI.
 * Content is added to this View by adding an entry to the profilingEntries in shell.controller.
 */
sap.ui.define([
    "sap/m/VBox"
], function (VBox) {
    "use strict";

    sap.ui.jsview("sap.ushell.components.shell.UserSettings.UserProfiling", {
        createContent: function (/*oController*/) {
            this.profilingContent = new VBox().addStyleClass("sapUshellUserSettingDetailContent");
            return this.profilingContent;
        },

        getControllerName: function () {
            return "sap.ushell.components.shell.UserSettings.UserProfiling";
        }
    });
});
},
	"sap/ushell/components/shell/UserSettings/UserSettings.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/resources",
    "sap/ushell/ui/utils",
    "sap/base/Log",
    "sap/ui/thirdparty/jquery",
    "sap/m/ObjectHeader",
    "sap/m/library",
    "sap/ui/core/IconPool",
    "sap/m/Page",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/StandardListItem",
    "sap/m/Text",
    "sap/m/FlexBox"
], function (
    Controller,
    Device,
    AppLifeCycle,
    Config,
    EventHub,
    resources,
    utils,
    Log,
    jQuery,
    ObjectHeader,
    mobileLibrary,
    IconPool,
    Page,
    Label,
    Input,
    StandardListItem,
    Text,
    FlexBox
) {
    "use strict";

    // shortcut for sap.m.BackgroundDesign
    var BackgroundDesign = mobileLibrary.BackgroundDesign;

    var oDoable;
    return Controller.extend("sap.ushell.components.shell.UserSettings", {
        /**
         * Initalizes the user settings dialog.
         *
         * @private
         */
        onInit: function () {
            this.getView().byId("userSettingEntryList").addEventDelegate({
                onAfterRendering: this._listAfterRendering.bind(this)
            });

            this.getView().byId("userSettingsDialog").addEventDelegate({
                onkeydown: this._keyDown.bind(this)
            });

            var oSplitApp = this.getView().byId("settingsApp");
            // SplitContainer behaves only depending on the width/height viewport ratio and does not take into account available space.
            // According to the documentation, SplitContainer should be used as a full screen control but it is used in a dialog here.
            // Solution: make sure that the master list is always visible on desktop computers.
            oSplitApp.setMode(Device.system.desktop ? "StretchCompressMode" : "ShowHideMode");

            // This is a hack suggested as temporal solution in BCP ticket 1680226447
            // We have to set the autofocus property of internal SplitApp navcontainer in order to allow search through the views of the
            // Detail page and also to assure that we set focus on the first element in the view
            // and not the one which appears earlier in case of dynamic content.
            // A feature request will be opened in order to allow this property to be set via official API.
            oSplitApp._oDetailNav.setAutoFocus(false);

            oDoable = EventHub.on("openUserSettings").do(this.openUserSettings.bind(this));
        },

        /**
         * Turns the eventlistener off.
         *
         * @private
         */
        onExit: function () {
            oDoable.off();
        },

        /**
         * Opens the user settings dialog.
         *
         * @private
         */
        openUserSettings: function () {
            this.getView().byId("userSettingsDialog").open();
        },

        /**
         * Resets changed properties.
         *
         * @private
         */
        _afterClose: function () {
            sap.ushell.Container.getUser().resetChangedProperties();
            if (window.document.activeElement && window.document.activeElement.tagName === "BODY") {
                window.document.getElementById("meAreaHeaderButton").focus();
            }
        },

        /**
         * Creates the detail page that should be displayed
         *
         * @param {string} sEntryId the name of the entry
         * @param {string} sTitle the title of the entry
         * @param {object} oContent that should be shown on the detail page
         * @returns {string} the id of the created detail page
         * @private
         */
        _createDetailPage: function (sEntryId, sTitle, oContent) {
            var oObjectHeader = new ObjectHeader({
                title: sTitle,
                backgroundDesign: BackgroundDesign.Solid
            }).addStyleClass("sapUshellUserSettingDetailHeader");

            if (sEntryId === "userAccountEntry") {
                var oUser = sap.ushell.Container.getUser();

                // User image in the detail page (in user account entry)
                if (oUser.getImage()) {
                    oObjectHeader.setIcon(Config.last("/core/shell/model/userImage/personPlaceHolder"));
                } else {
                    oObjectHeader.setIcon(IconPool.getIconURI("sap-icon://person-placeholder"));
                }

                oUser.attachOnSetImage(function () {
                    var sPersonPlaceHolder = Config.last("/core/shell/model/userImage/personPlaceHolder"),
                        sPlaceholderIcon = IconPool.getIconURI("sap-icon://person-placeholder");

                    oObjectHeader.setIcon(sPersonPlaceHolder || sPlaceholderIcon);
                });

                oObjectHeader.setTitle(sap.ushell.Container.getUser().getFullName());
            }
            var oPage = new Page("detail" + oContent.getId(), {
                content: [oObjectHeader, oContent],
                showHeader: false
            }).addStyleClass("sapUsheUserSettingDetaildPage");

            oPage.addEventDelegate({
                onAfterRendering: this._handleNavButton.bind(this)
            });

            this.getView().byId("settingsApp").addDetailPage(oPage);
            return oPage.getId();
        },

        /**
         * Creates a detail page for the given Entry
         *
         * @param {object} oEntry that needs a detail page
         * @returns {Promise<string>} that resolves with the created Page id
         * @private
         */
        _createEntryContent: function (oEntry) {
            var that = this;
            return new Promise(function (resolve) {
                if (typeof oEntry.contentFunc === "function") {
                    oEntry.contentFunc().always(function (oContentResult) {
                        if (oContentResult instanceof sap.ui.core.Control) {
                            resolve(that._createDetailPage(oEntry.entryHelpID, oEntry.title, oContentResult));
                        } else {
                            var oErrorContent = new FlexBox(oEntry.entryHelpID, {
                                height: "5rem",
                                alignItems: "Center",
                                justifyContent: "Center",
                                items: [ new Text({ text: resources.i18n.getText("loadingErrorMessage") })]
                            });
                            resolve(that._createDetailPage(oEntry.entryHelpID, oEntry.title, oErrorContent));
                        }
                    });
                } else {
                    var oContent;
                    oEntry.valueArgument().done(function (sValue) {
                        oContent = that._getKeyValueContent(oEntry, sValue);
                    }).fail(function () {
                        oContent = that._getKeyValueContent(oEntry);
                    }).always(function () {
                        resolve(that._createDetailPage(oEntry.entryHelpID, oEntry.title, oContent));
                    });
                }
            });
        },

        /**
         * Factory function that creates the list items for the entires
         *
         * @param {string} sId the id given by the model
         * @param {object} oContext the model context of the specific entry
         * @returns {sap.m.StandardListItem} the list item for an entry
         *
         * @private
         */
        _createListEntry: function (sId, oContext) {
            var oEntry = oContext.getProperty(oContext.sPath);

            if (oEntry.entryHelpID) {
                sId = oEntry.entryHelpID + "-UserSettingsEntry";
            }

            return new StandardListItem(sId, {
                title: { path: "entries>title" },
                description: { path: "entries>valueResult" },
                icon: {
                    parts: [
                        { path: "entries>icon" },
                        { path: "/userImage/account" }
                    ],
                    formatter: this._getEntryIcon
                },
                visible: {
                    parts: [
                        { path: "entries>visible"},
                        { path: "entries>defaultVisibility"},
                        { path: "entries>title"}
                    ],
                    formatter: this._getEntryVisible.bind(this)
                },
                type: Device.system.phone ? "Navigation" : "Inactive"
            }).addStyleClass("sapUshellUserSettingMasterListItem");
        },

        /**
         * Close User Settings Dialog without saving.
         *
         * @private
         */
        _dialogCancelButtonHandler: function () {
            var aEntries = this.getView().getModel("entries").getData().entries || [];
            // Invoke onCancel function for each userPreferences entry
            for (var i = 0; i < aEntries.length; i++) {
                if (aEntries[i] && aEntries[i].onCancel) {
                    aEntries[i].onCancel();
                }
            }
            this._handleSettingsDialogClose();
        },

        /**
         * Emits an event to notify that the given entry needs to be saved.
         *
         * @param {string} sEntryPath the model path of the entry
         * @private
         */
        _emitEntryOpened: function (sEntryPath) {
            var aUserSettingsEntriesToSave = EventHub.last("UserSettingsOpened") || {},
                sPosition = sEntryPath.split("/").pop();

            aUserSettingsEntriesToSave[sPosition] = true;
            EventHub.emit("UserSettingsOpened", aUserSettingsEntriesToSave);
        },

        /**
         * Calculates the correct icon on the list entry.
         *
         * @param {string} sEntryIcon icon source
         * @param {string} sUserImage user image source
         * @returns {string} the correct icon source
         * @private
         */
        _getEntryIcon: function (sEntryIcon, sUserImage) {
            if (sEntryIcon === "sap-icon://account" && sUserImage) {
                return sUserImage;
            }
            return sEntryIcon || "sap-icon://action-settings";
        },

        /**
         * Calculates if an entry list item should be visible.
         *
         * @param {boolean} bVisibility entry set to be visible
         * @param {boolean} bDefaultVisibility entry set to be visible as a default
         * @param {string} sTitle the title of the entry
         * @returns {boolean} if an entry list item should be visible
         * @private
         */
        _getEntryVisible: function (bVisibility, bDefaultVisibility, sTitle) {
            if (sTitle === resources.i18n.getText("userProfiling")) {
                var aProfilingEntries = this.getView().getModel("entries").getProperty("/profiling") || [],
                    UsageAnalytics = sap.ushell.Container.getService("UsageAnalytics");
                // Remove usage analytics entry if its not enabled
                for (var i = aProfilingEntries.length - 1; i >= 0; i--) {
                    if (aProfilingEntries[i].entryHelpID === "usageAnalytics") {
                        if (!UsageAnalytics.systemEnabled() || !UsageAnalytics.isSetUsageAnalyticsPermitted()) {
                            aProfilingEntries.splice(i, 1);
                        }
                    }
                }
                return aProfilingEntries && aProfilingEntries.length > 0;
            }

            if (bVisibility !== undefined) {
                return bVisibility;
            }

            if (bDefaultVisibility !== undefined) {
                return bDefaultVisibility;
            }

            return true;
        },

        /**
         * Creating UI for key/value settings.
         *
         * @param {object} oEntry the settings entry (containing the title)
         * @param {string} sEntryValue the value of the setting
         * @returns {object} a Flexbox containing the setting
         * @private
         */
        _getKeyValueContent: function (oEntry, sEntryValue) {
            var oKeyLabel = new Label({
                text: oEntry.title + ":"
            }).addStyleClass("sapUshellUserSettingsDetailsKey");

            var oValueLabel = new Input({
                value: sEntryValue || " ",
                editable: false
            }).addStyleClass("sapUshellUserSettingsDetailsValue");

            var oBox = new FlexBox(oEntry.entryHelpID, {
                alignItems: Device.system.phone ? "Start" : "Center",
                wrap: Device.system.phone ? "Wrap" : "NoWrap",
                direction: Device.system.phone ? "Column" : "Row",
                items: [
                    oKeyLabel,
                    oValueLabel
                ]
            });
            return oBox;
        },

        /**
         * Determins if the Navigation Button is visible.
         *
         * @private
         */
        _handleNavButton: function () {
            var oSplitApp = this.getView().byId("settingsApp"),
                oNavBackButton = this.getView().byId("userSettingsNavBackButton");

            oNavBackButton.setVisible(!oSplitApp.isMasterShown());
        },

        /**
         * Close User Settings Dialog.
         *
         * @private
         */
        _handleSettingsDialogClose: function () {
            this.getView().byId("settingsApp").toMaster("sapFlpUserSettings-View--userSettingMaster");
            // Fix - in phone the first selection (user account) wasn't responsive when this view was closed
            // and re-opened because is was regarded as already selected entry in the splitApp control.
            this.getView().byId("userSettingEntryList").removeSelections(true);
            this.getView().byId("userSettingsDialog").close();
        },
        /**
         * Triggers a refresh to the home page
         *
         * @private
         * @since 1.72.0
         */
        _refreshBrowser: function () {
            document.location = document.location.href.replace(location.hash, "");
        },

        /**
         * Save and close User Settings Dialog.
         *
         * @private
         */
        _handleSettingsSave: function () {
            var oShellModel = AppLifeCycle.getElementsModel().getModel(),
                that = this;
            // In case the save button is pressed in the detailed entry mode, there is a need to update value result in the model
            var isDetailedEntryMode = oShellModel.getProperty("/userPreferences/isDetailedEntryMode");
            if (isDetailedEntryMode) {
                oShellModel.setProperty("/userPreferences/activeEntryPath", null);
            }

            utils.saveUserPreferenceEntries(oShellModel.getProperty("/userPreferences/entries"))
                .done(function (oAfterSave) {
                    that._handleSettingsDialogClose();
                    sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
                        var sMessage = resources.i18n.getText("savedChanges");

                        MessageToast.show(sMessage, {
                            duration: 3000,
                            width: "15em",
                            my: "center bottom",
                            at: "center bottom",
                            of: window,
                            offset: "0 -50",
                            collision: "fit fit"
                        });
                    });
                    if (oAfterSave && oAfterSave.refresh) {
                        that._refreshBrowser();
                    }
                })
                .fail(function (failureMsgArr) {
                    sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
                        var sErrMessageText;
                        var sErrMessageLog = "";
                        if (failureMsgArr.length === 1) {
                            sErrMessageText = resources.i18n.getText("savingEntryError") + " ";
                        } else {
                            sErrMessageText = resources.i18n.getText("savingEntriesError") + "\n";
                        }
                        failureMsgArr.forEach(function (oError) {
                            sErrMessageText += oError.entry + "\n";
                            sErrMessageLog += "Entry: " + oError.entry + " - Error message: " + oError.message + "\n";
                        });

                        MessageBox.show(
                            sErrMessageText, {
                                icon: MessageBox.Icon.ERROR,
                                title: resources.i18n.getText("error"),
                                actions: [MessageBox.Action.OK]
                            }
                        );

                        Log.error(
                            "Failed to save the following entries",
                            sErrMessageLog,
                            "sap.ushell.ui.footerbar.UserPreferencesButton"
                        );
                    }
                    );
                });
        },

        /**
         * Handles the entry item press
         *
         * @param {object} oEvent the event that was fired
         * @private
         */
        _itemPress: function (oEvent) {
            this._toDetail(oEvent.getSource().getSelectedItem(), oEvent.getId());
        },

        /**
         * Handles the key down event on the Dialog
         *
         * @param {object} oEvent the event that was fired
         * @private
         */
        _keyDown: function (oEvent) {
            if (oEvent.keyCode === 27) { // ESC
                this._dialogCancelButtonHandler();
            }
        },

        /**
         * Handles after renderering code of the list.
         *
         * @private
         */
        _listAfterRendering: function () {
            var oMasterEntryList = this.getView().byId("userSettingEntryList");

            var aEntries = oMasterEntryList.getItems();
            // For each item in the list we need to add XRay help id
            // For each item in the list we need to execute the relevant function to get the entry value
            for (var i = 0; i < aEntries.length; i++) {
                var sPath = aEntries[i].getBindingContext("entries").getPath();
                this._setEntryValueResult(sPath);
            }

            if (!Device.system.phone) {
                var oFirstEntry = oMasterEntryList.getItems()[0];
                if (oFirstEntry) {
                    oMasterEntryList.setSelectedItem(oFirstEntry);
                    this._toDetail(oFirstEntry, "select");
                    oFirstEntry.getDomRef().focus();
                }
            }
        },

        /**
         * Handles the Back / Menu button press
         *
         * @param {object} oEvent the event that was fired
         * @private
         */
        _navBackButtonPressHandler: function (oEvent) {
            var oSplitApp = this.getView().byId("settingsApp");

            if (Device.system.phone) {
                oSplitApp.backDetail();
                this._handleNavButton();
                oEvent.getSource().setPressed(false);
            } else if (oSplitApp.isMasterShown()) {
                oSplitApp.hideMaster();
                oEvent.getSource().setTooltip(resources.i18n.getText("ToggleButtonShow"));
                oEvent.getSource().setPressed(false);
            } else {
                oSplitApp.showMaster();
                oEvent.getSource().setTooltip(resources.i18n.getText("ToggleButtonHide"));
                oEvent.getSource().setPressed(true);
            }
        },

        /**
         * Navigates to the corresponding detail Page
         *
         * @param {string} sId the id of the detail Page the AppSplit-Container schould navigate to
         * @param {string} sEventId the name of the event that was fired
         * @param {string} sEntryPath the path ot the entry that should be navigated to
         * @private
         */
        _navToDetail: function (sId, sEventId, sEntryPath) {
            var oSplitApp = this.getView().byId("settingsApp");

            oSplitApp.toDetail(sId);
            EventHub.emit("UserPreferencesDetailNavigated", sId);
            // Since we cannot use autofocus property of splitApp navcontainer, we have to implement it explicitly
            if (sEventId === "select" && !Device.system.phone) {
                var elFirstToFocus = jQuery(document.getElementById(sId)).firstFocusableDomRef();

                if (elFirstToFocus) {
                    elFirstToFocus.focus();
                }
            }
            if (oSplitApp.getMode() === "ShowHideMode") {
                oSplitApp.hideMaster();
            }

            this._handleNavButton();
            this._emitEntryOpened(sEntryPath);
        },

        /**
         * Tries to load the information for the list item of an entry async.
         *
         * @param {string} sEntryPath a speific path of one of the entries
         * @private
         */
        _setEntryValueResult: function (sEntryPath) {
            var oModel = this.getView().getModel("entries"),
                isEditable = oModel.getProperty(sEntryPath + "/editable"),
                valueArgument = oModel.getProperty(sEntryPath + "/valueArgument"),
                bVisibility = oModel.getProperty(sEntryPath + "/visible"),
                bDefaultVisibility = oModel.getProperty(sEntryPath + "/defaultVisibility");

            if (typeof valueArgument === "function") {
                // Display "Loading..." and disable the entry until the value result is available
                oModel.setProperty(sEntryPath + "/valueResult", resources.i18n.getText("genericLoading"));
                oModel.setProperty(sEntryPath + "/editable", false);
                valueArgument()
                    .done(function (valueResult) {
                        oModel.setProperty(sEntryPath + "/editable", isEditable);
                        var bVisible = true;
                        if (valueResult && valueResult.value !== undefined) {
                            bVisible = !!valueResult.value;
                        } else if (bVisibility !== undefined) {
                            bVisible = bVisibility;
                        } else if (bDefaultVisibility !== undefined) {
                            bVisible = bDefaultVisibility;
                        }
                        var sDisplayText = " ";
                        if (valueResult !== undefined) {
                            if (typeof (valueResult) === "object") {
                                sDisplayText = valueResult.displayText;
                            } else {
                                sDisplayText = valueResult;
                            }
                        }

                        oModel.setProperty(sEntryPath + "/visible", bVisible);
                        oModel.setProperty(sEntryPath + "/valueResult", sDisplayText);
                    })
                    .fail(function () {
                        oModel.setProperty(sEntryPath + "/valueResult", resources.i18n.getText("loadingErrorMessage"));
                    });
            } else if (valueArgument) {
                oModel.setProperty(sEntryPath + "/valueResult", valueArgument);
            } else {
                oModel.setProperty(sEntryPath + "/valueResult", resources.i18n.getText("loadingErrorMessage"));
            }
        },

        /**
         * Navigates to the detail page that belongs to the given selected item
         *
         * @param {object} oSelectedItem the entry control that should be handled
         * @param {string} sEventId the name of the even
         * @private
         */
        _toDetail: function (oSelectedItem, sEventId) {
            var oModel = this.getView().getModel("entries"),
                sEntryPath = oSelectedItem.getBindingContext("entries").getPath(),
                sDetailPageId = oModel.getProperty(sEntryPath + "/contentResult");

            // Clear selection from list.
            if (Device.system.phone) {
                oSelectedItem.setSelected(false);
            }

            if (sDetailPageId) {
                this._navToDetail(sDetailPageId, sEventId, sEntryPath);
            } else {
                var that = this,
                    oEntry = oModel.getProperty(sEntryPath);

                this._createEntryContent(oEntry).then(function (sNewDetailPageId) {
                    oModel.setProperty(sEntryPath + "/contentResult", sNewDetailPageId);
                    that._navToDetail(sNewDetailPageId, sEventId, sEntryPath);
                });
            }
        }
    });
});
},
	"sap/ushell/components/shell/UserSettings/UserSettings.view.xml":'<mvc:View\n    controllerName="sap.ushell.components.shell.UserSettings"\n    xmlns="sap.m"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:core="sap.ui.core">\n\n    <Dialog id="userSettingsDialog"\n        class="sapUshellUserSetting"\n        showHeader="false"\n        contentHeight="42rem"\n        contentWidth="58rem"\n        afterClose="._afterClose"\n        stretch="{device>/system/phone}">\n        <buttons>\n            <Button id="userSettingSaveButton"\n                text="{i18n>saveBtn}"\n                type="Emphasized"\n                press="._handleSettingsSave"/>\n            <Button id="userSettingCancelButton"\n                text="{i18n>cancelBtn}"\n                press="._dialogCancelButtonHandler"/>\n        </buttons>\n        <content>\n            <Page\n                class="sapUshellSettingsPage"\n                showHeader="true">\n                <customHeader>\n                    <Bar id="settingsBar">\n                        <contentLeft>\n                            <ToggleButton id="userSettingsNavBackButton"\n                                icon="{= ${device>/system/phone} ? \'sap-icon://nav-back\' : \'sap-icon://menu2\'}"\n                                press="._navBackButtonPressHandler"\n                                tooltip="{i18n>ToggleButtonShow}"\n                                visible="false"/>\n                        </contentLeft>\n                        <contentMiddle>\n                            <Text\n                                text="{i18n>userSettings}"/>\n                        </contentMiddle>\n                    </Bar>\n                </customHeader>\n                <content>\n                    <SplitApp id="settingsApp"\n                        defaultTransitionNameDetail="show"\n                        afterMasterClose="._handleNavButton"\n                        afterMasterOpen="._handleNavButton">\n                        <masterPages>\n                            <Page id="userSettingMaster"\n                                class="sapUshellUserSettingMaster"\n                                showHeader="false">\n                                <content>\n                                    <List id="userSettingEntryList"\n                                        items="{\n                                            path: \'entries>/entries\',\n                                            factory: \'._createListEntry\'\n                                        }"\n                                        mode="SingleSelectMaster"\n                                        select="._itemPress"/>\n                                </content>\n                            </Page>\n                        </masterPages>\n                    </SplitApp>\n                </content>\n            </Page>\n        </content>\n    </Dialog>\n</mvc:View>',
	"sap/ushell/components/shell/UserSettings/userAccount/UserAccountImgConsentSelector.fragment.xml":'<core:FragmentDefinition\n        height="100%"\n        width="100%"\n        xmlns:m="sap.m"\n        xmlns:core="sap.ui.core">\n    <m:VBox>\n        <m:FlexBox alignItems="{config>/flexAlignItems}" direction="{config>/textDirection}"\n                   id="userImgConsentEnableFlexBox">\n            <m:Label text="{i18n>imgConsentMsg}:"\n                     class="sapUshellUserAccountLabel"/>\n        </m:FlexBox>\n        <m:FlexBox alignItems="{config>/flexAlignItems}" direction="{config>/textDirection}">\n            <m:Link text="{i18n>userImageConsentDialogShowTermsOfUse}" textAlign="{config>/textAlign}"\n                    class="sapUshellUserAccountLabel" press = "termsOfUserPress" id="termsOfUseLink"  />\n            <m:Label text="{i18n>userImageConsentText}:" visible="false" id="sapUshellUserImageConsentSwitchLabel"/>\n        </m:FlexBox>\n        <m:FlexBox direction="{config>/textDirection}" id="termsOfUseTextFlexBox"\n                   visible = "false">\n            <m:Text text="{i18n>userImageConsentDialogTermsOfUse}" class = "sapUshellUserConsentDialogTerms" />\n        </m:FlexBox>\n    </m:VBox>\n</core:FragmentDefinition>',
	"sap/ushell/components/shell/UserSettings/userAccount/UserAccountSelector.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/base/Log",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/resources",
    "sap/m/Switch",
    "sap/m/library",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/theming/Parameters",
    "sap/ui/Device"
], function (
    AccessibilityCustomData,
    Log,
    jQuery,
    resources,
    Switch,
    mobileLibrary,
    JSONModel,
    Parameters,
    Device
) {
    "use strict";


    // shortcut for sap.m.SwitchType
    var SwitchType = mobileLibrary.SwitchType;

    sap.ui.controller("sap.ushell.components.shell.UserSettings.userAccount.UserAccountSelector", {
        onInit: function () {

            var oShellCtrl = sap.ushell.Container.getRenderer("fiori2").getShellController();
            var oShellView = oShellCtrl.getView();
            this.oShellConfig = (oShellView.getViewData() ? oShellView.getViewData().config : {}) || {};

            //determines whether the User Image consent feature is enabled
            this.imgConsentEnabled = this.oShellConfig.enableUserImgConsent ? this.oShellConfig.enableUserImgConsent : false;

            if (this.imgConsentEnabled) {
                try {
                    this.userInfoService = sap.ushell.Container.getService("UserInfo");
                    this.oUser = this.userInfoService.getUser();
                } catch (e) {
                    Log.error("Getting UserInfo service failed.");
                    this.oUser = sap.ushell.Container.getUser();
                }

                this.currentUserImgConsent = this.oUser.getImageConsent();
                this.origUserImgConsent = this.currentUserImgConsent;

                this.addImgConsentEnableSwitch(this.currentUserImgConsent);
            }
        },

        getContent: function () {
            var oDfd = jQuery.Deferred();
            var oResourceModel = resources.getTranslationModel();
            this.getView().setModel(oResourceModel, "i18n");
            this.getView().setModel(this.getConfigurationModel(), "config");

            oDfd.resolve(this.getView());
            return oDfd.promise();
        },

        getValue: function () {
            var oDfd = jQuery.Deferred();
            oDfd.resolve(sap.ushell.Container.getUser().getFullName());
            return oDfd.promise();
        },

        onCancel: function () {
            if (this.imgConsentEnabled) {
                this.currentUserImgConsent = this.oUser.getImageConsent();
                this.oUserEnableImgConsentSwitch.setState(this.currentUserImgConsent);
            }
        },

        onSave: function () {
            var oResultDeferred = jQuery.Deferred(),
                oWhenPromise, usrConsentDeferred,
                aPromiseArray = [];

            if (this.imgConsentEnabled) {
                usrConsentDeferred = this.onSaveUserImgConsent();
                aPromiseArray.push(usrConsentDeferred);
            }
            oWhenPromise = jQuery.when.apply(null, aPromiseArray);
            oWhenPromise.done(function () {
                oResultDeferred.resolve();
            });

            return oResultDeferred.promise();
        },

        onSaveUserImgConsent: function () {
            var deferred = jQuery.Deferred();
            var oUserPreferencesPromise;

            if (this.oUser.getImageConsent() !== this.currentUserImgConsent) { //only if there was a change we would like to save it
                // set the user's image consent
                if (this.currentUserImgConsent !== undefined) {
                    this.oUser.setImageConsent(this.currentUserImgConsent);
                    oUserPreferencesPromise = this.userInfoService.updateUserPreferences(this.oUser);

                    oUserPreferencesPromise.done(function () {
                        this.oUser.resetChangedProperty("isImageConsent");
                        this.origUserImgConsent = this.currentUserImgConsent;
                        deferred.resolve();
                    }.bind(this));

                    oUserPreferencesPromise.fail(function (sErrorMessage) {
                        // Apply the previous display density to the user
                        this.oUser.setImageConsent(this.origUserImgConsent);
                        this.oUser.resetChangedProperty("isImageConsent");
                        this.currentUserImgConsent = this.origUserImgConsent;
                        Log.error(sErrorMessage);

                        deferred.reject(sErrorMessage);
                    }.bind(this));
                } else {
                    deferred.reject(this.currentUserImgConsent + "is undefined");
                }
            } else {
                deferred.resolve();//No mode change, do nothing
            }

            return deferred.promise();
        },

        getConfigurationModel: function () {
            var oConfModel = new JSONModel({});
            var oUser = sap.ushell.Container.getUser();
            oConfModel.setData({
                isRTL: sap.ui.getCore().getConfiguration().getRTL(),
                sapUiContentIconColor: Parameters.get("sapUiContentIconColor"),
                isStatusEnable: this.originalEnableStatus ? this.originalEnableStatus : false,
                flexAlignItems: Device.system.phone ? "Stretch" : "Center",
                textAlign: Device.system.phone ? "Left" : "Right",
                textDirection: Device.system.phone ? "Column" : "Row",
                labelWidth: Device.system.phone ? "auto" : "12rem",
                name: oUser.getFullName(),
                mail: oUser.getEmail(),
                server: window.location.host,
                imgConsentEnabled: this.imgConsentEnabled,
                isImageConsent: this.currentUserImgConsent
            });
            return oConfModel;
        },


        _getUserSettingsPersonalizer: function () {
            if (this.oUserPersonalizer === undefined) {
                this.oUserPersonalizer = this._createUserPersonalizer();
            }
            return this.oUserPersonalizer;
        },

        _createUserPersonalizer: function () {
            var oPersonalizationService = sap.ushell.Container.getService("Personalization"),
                oComponent,
                oScope = {
                    keyCategory: oPersonalizationService.constants.keyCategory.FIXED_KEY,
                    writeFrequency: oPersonalizationService.constants.writeFrequency.LOW,
                    clientStorageAllowed: true
                },
                oPersonalizer = oPersonalizationService.getPersonalizer(oScope, oComponent);

            return oPersonalizer;
        },

        /*
         * User Image Consent functions
         */

        addImgConsentEnableSwitch: function (bEnable) {
            var oUserImgConsentEnableFlexBox = sap.ui.getCore().byId("UserAccountSelector--userImgConsentEnableFlexBox");
            this.oUserEnableImgConsentSwitch = new Switch({
                customTextOff: resources.i18n.getText("No"),
                customTextOn: resources.i18n.getText("Yes"),
                type: SwitchType.Default,
                state: bEnable,
                change: this.setCurrentUserImgConsent.bind(this)
            });
            //"aria-labelledBy", cannot be added in the constructor
            this.oUserEnableImgConsentSwitch.addCustomData(new AccessibilityCustomData({
                key: "aria-labelledBy",
                value: "UserAccountSelector--sapUshellUserImageConsentSwitchLabel",
                writeToDom: true
            }));
            if (!oUserImgConsentEnableFlexBox) {
                Log.error("UserAccountSelector: addImgConsentEnableSwitch was called before the renderer");
                return;
            }
            oUserImgConsentEnableFlexBox.addItem(this.oUserEnableImgConsentSwitch);
        },

        setCurrentUserImgConsent: function (oEvent) {
            this.currentUserImgConsent = oEvent.mParameters.state;
        },

        termsOfUserPress: function () {
            var termsOfUseTextBox = sap.ui.getCore().byId("UserAccountSelector--termsOfUseTextFlexBox");
            var termsOfUseLink = sap.ui.getCore().byId("UserAccountSelector--termsOfUseLink");
            var isTermsOfUseVisible = termsOfUseTextBox.getVisible();
            if (isTermsOfUseVisible) {
                termsOfUseTextBox.setVisible(false);
                termsOfUseLink.setText(resources.i18n.getText("userImageConsentDialogShowTermsOfUse"));
            } else {
                termsOfUseLink.setText(resources.i18n.getText("userImageConsentDialogHideTermsOfUse"));
                termsOfUseTextBox.setVisible(true);
            }
        }
    });
});
},
	"sap/ushell/components/shell/UserSettings/userAccount/UserAccountSelector.view.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/m/VBox",
    "sap/m/FlexBox",
    "sap/m/Input",
    "sap/m/Label",
    "sap/ui/Device",
    "sap/ushell/resources"
], function (
    jQuery,
    VBox,
    FlexBox,
    Input,
    Label,
    Device,
    resources
) {
    "use strict";

    sap.ui.jsview("sap.ushell.components.shell.UserSettings.userAccount.UserAccountSelector", {
        createContent: function (/*oController*/) {
            var i18n = resources.i18n;
            var sFlexDirection = Device.system.phone ? "Column" : "Row";
            var sFlexAlignItems = Device.system.phone ? "Stretch" : "Center";
            var sTextAlign = Device.system.phone ? "Left" : "Right";
            var sLabelWidth = Device.system.phone ? "auto" : "12rem";
            var nameLabel = new Label({
                text: i18n.getText("UserAccountNameFld") + ":",
                width: sLabelWidth,
                textAlign: sTextAlign
            });
            var nameInput = new Input("userAccountuserName", {
                value: "{/name}",
                editable: false
            }).addAriaLabelledBy(nameLabel);

            nameInput.addEventDelegate({
                onfocusin: function () {
                    jQuery("#userAccountuserName input").blur();
                }
            });

            var fboxName = new FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [nameLabel, nameInput]
            });
            var emailLabel = new Label({
                text: i18n.getText("UserAccountEmailFld") + ":",
                width: sLabelWidth,
                textAlign: sTextAlign
            });
            var fboxMail = new FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    emailLabel,
                    new Input({
                        value: "{/mail}",
                        editable: false
                    }).addAriaLabelledBy(emailLabel)
                ]
            });
            var serverLabel = new Label({
                text: i18n.getText("UserAccountServerFld") + ":",
                width: sLabelWidth,
                textAlign: sTextAlign
            });
            var fboxServer = new FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    serverLabel,
                    new Input({
                        value: "{/server}",
                        editable: false
                    }).addAriaLabelledBy(serverLabel)
                ]
            });

            var vbox = new VBox({
                items: [fboxName, fboxMail, fboxServer]
            });
            vbox.addStyleClass("sapUiSmallMargin");

            return vbox;
        },

        getControllerName: function () {
            return "sap.ushell.components.shell.UserSettings.userAccount.UserAccountSelector";
        }
    });
}, /* bExport= */ true);
},
	"sap/ushell/components/shell/UserSettings/userAccount/UserAccountSelector.view.xml":'<View\n\t\tcontrollerName="sap.ushell.components.shell.UserSettings.userAccount.UserAccountSelector"\n\t\txmlns="sap.m"\n\t\txmlns:core="sap.ui.core">\n\n\t<IconTabBar id="idIconTabBar"\n\t\tapplyContentPadding="true">\n\t\t<items>\n\t\t\t<IconTabFilter text="{i18n>UserAccountFld}">\n\t\t\t\t<core:Fragment fragmentName="sap.ushell.components.shell.UserSettings.userAccount.UserAccountSetting" type="XML"></core:Fragment>\n\t\t\t</IconTabFilter>\n\t\t\t<IconTabFilter visible = "{config>/imgConsentEnabled}" text="{i18n>ProfileImgId}">\n\t\t\t\t<core:Fragment fragmentName="sap.ushell.components.shell.UserSettings.userAccount.UserAccountImgConsentSelector" type="XML"></core:Fragment>\n\t\t\t</IconTabFilter>\n\t\t</items>\n\t</IconTabBar>\n</View>',
	"sap/ushell/components/shell/UserSettings/userAccount/UserAccountSetting.fragment.xml":'<core:FragmentDefinition\n                         height="100%"\n                         width="100%"\n                         xmlns:m="sap.m"\n                         xmlns:core="sap.ui.core">\n    <m:VBox class="sapUiSmallMargin">\n        <m:FlexBox alignItems="{config>/flexAlignItems}" direction="{config>/textDirection}">\n            <m:Label text="{i18n>UserAccountNameFld}:"\n                     class="sapUshellUserAccountLabel"\n                     width="{config>/labelWidth}"\n                     textAlign="{config>/textAlign}"\n                     labelFor="userAccountuserName"/>\n            <m:Input value="{config>/name}"\n                     id="userAccountuserName"\n                     class="sapUshellUserAccountInput"\n                     editable="false"/>\n\n        </m:FlexBox>\n\n\n        <m:FlexBox alignItems="{config>/flexAlignItems}" direction="{config>/textDirection}">\n            <m:Label text="{i18n>UserAccountEmailFld}:"\n                     class="sapUshellUserAccountLabel"\n                     width="{config>/labelWidth}"\n                     textAlign="{config>/textAlign}"\n                     labelFor="userAccountuserMail"/>\n            <m:Input value="{config>/mail}"\n                     id="userAccountuserMail"\n                     class="sapUshellUserAccountInput"\n                     editable="false"/>\n\n        </m:FlexBox>\n\n        <m:FlexBox alignItems="{config>/flexAlignItems}" direction="{config>/textDirection}">\n            <m:Label text="{i18n>UserAccountServerFld}:"\n                     class="sapUshellUserAccountLabel"\n                     width="{config>/labelWidth}"\n                     textAlign="{config>/textAlign}"\n                     labelFor="userAccountuserServer"/>\n            <m:Input value="{config>/server}"\n                     id="userAccountuserServer"\n                     class="sapUshellUserAccountInput"\n                     editable="false"/>\n\n        </m:FlexBox>\n\n    </m:VBox>\n</core:FragmentDefinition>',
	"sap/ushell/components/shell/UserSettings/userAccount/UserAccountSetting.view.xml":'<View\n        controllerName="sap.ushell.components.shell.UserSettings.userAccount.UserAccountSelector"\n        xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\n        xmlns="sap.m">\n    <core:Fragment fragmentName="sap.ushell.components.shell.UserSettings.userAccount.UserAccountSetting" type="XML"></core:Fragment>\n</View>',
	"sap/ushell/components/shell/UserSettings/userActivitiesHandler.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Config",
    "sap/ui/thirdparty/jquery",
    "sap/base/Log",
    "sap/ui/core/Component",
    "sap/ushell/resources"
], function (
    AppLifeCycle,
    Config,
    jQuery,
    Log,
    Component,
    resources
) {
    "use strict";

    sap.ui.controller("sap.ushell.components.shell.UserSettings.userActivitiesHandler", {
        onInit: function () {
            this.oModel = AppLifeCycle.getElementsModel().getModel();
            this.isTrackingEnable = this.oModel.getProperty("/enableTrackingActivity") !== undefined ? this.oModel.getProperty("/enableTrackingActivity") : true;
            this.currentTrackingMode = this.isTrackingEnable;
            this.oView.trackUserActivitySwitch.setState(this.isTrackingEnable);
        },

        getContent: function () {
            var oDfd = jQuery.Deferred();
            oDfd.resolve(this.getView());
            return oDfd.promise();
        },

        getValue: function () {
            return jQuery.Deferred().resolve(" ");
        },

        onCancel: function () {
            var oDfd = jQuery.Deferred();
            if (this.currentTrackingMode !== this.isTrackingEnable) {
                this.isTrackingEnable = !this.isTrackingEnable;
                this.oView.trackUserActivitySwitch.setState(this.isTrackingEnable);
            }
            oDfd.resolve();
            return oDfd.promise();
        },

        onSave: function () {
            var oDfd = jQuery.Deferred();
            if (this.currentTrackingMode !== this.isTrackingEnable) {
                this.oModel.setProperty("/enableTrackingActivity", this.isTrackingEnable);
                this.writeUserActivityModeToPersonalization(this.isTrackingEnable);
                this.currentTrackingMode = this.isTrackingEnable;
                Config.emit("/core/shell/model/enableTrackingActivity", this.isTrackingEnable);
            }
            oDfd.resolve();
            return oDfd.promise();
        },

        writeUserActivityModeToPersonalization: function (isTrackingEnable) {
            var oDeferred,
                oPromise;

            try {
                oPromise = this._getPersonalizer().setPersData(isTrackingEnable);
            } catch (err) {
                Log.error("Personalization service does not work:");
                Log.error(err.name + ": " + err.message);
                oDeferred = new jQuery.Deferred();
                oDeferred.reject(err);
                oPromise = oDeferred.promise();
            }
            return oPromise;
        },

        _getPersonalizer: function () {
            var oPersonalizationService = sap.ushell.Container.getService("Personalization"),
                oComponent = Component.getOwnerComponentFor(this),
                oScope = {
                    keyCategory: oPersonalizationService.constants.keyCategory.FIXED_KEY,
                    writeFrequency: oPersonalizationService.constants.writeFrequency.LOW,
                    clientStorageAllowed: true
                },
                oPersId = {
                    container: "flp.settings.FlpSettings",
                    item: "userActivitesTracking"
                };

            return oPersonalizationService.getPersonalizer(oPersId, oScope, oComponent);
        },

        _handleCleanHistory: function () {
            sap.ushell.Container.getServiceAsync("UserRecents").then(function (oService) {
                oService.clearRecentActivities();
                showSaveMessageToast();

                function showSaveMessageToast () {
                    sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
                        var message = resources.i18n.getText("savedChanges");

                        MessageToast.show(message, {
                            duration: 3000,
                            width: "15em",
                            my: "center bottom",
                            at: "center bottom",
                            of: window,
                            offset: "0 -50",
                            collision: "fit fit"
                        });
                    });
                }
            });
        },

        _handleTrackUserActivitySwitch: function (isVisible) {
            this.isTrackingEnable = isVisible;
        }
    });
});
},
	"sap/ushell/components/shell/UserSettings/userActivitiesHandler.view.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/VBox",
    "sap/m/Button",
    "sap/m/FlexBox",
    "sap/m/library",
    "sap/m/Switch",
    "sap/m/Label",
    "sap/ui/Device",
    "sap/ushell/resources"
], function (
    VBox,
    Button,
    FlexBox,
    mobileLibrary,
    Switch,
    Label,
    Device,
    resources
) {
    "use strict";

    // shortcut for sap.m.SwitchType
    var SwitchType = mobileLibrary.SwitchType;

    sap.ui.jsview("sap.ushell.components.shell.UserSettings.userActivitiesHandler", {
        createContent: function (oController) {
            var i18n = resources.i18n;
            var sFlexDirection = Device.system.phone ? "Column" : "Row";
            var sFlexAlignItems = Device.system.phone ? "Stretch" : "Center";
            var sTextAlign = Device.system.phone ? "Left" : "Right";
            var sCleanActivityButton = "cleanActivityButton";

            this.trackingLabel = new Label("trackingLabel", {
                text: i18n.getText("trackingLabel"),
                textAlign: sTextAlign
            }).addStyleClass("sapUshellCleanActivityLabel");

            this.trackUserActivitySwitch = new Switch("trackUserActivitySwitch", {
                type: SwitchType.Default,
                customTextOn: i18n.getText("Yes"),
                customTextOff: i18n.getText("No"),
                change: function (oEvent) {
                    oController._handleTrackUserActivitySwitch(oEvent.getParameter("state"));
                }
            }).addAriaLabelledBy(this.trackingLabel);

            var fTrackingSwitch = new FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    this.trackingLabel,
                    this.trackUserActivitySwitch
                ]
            });

            this.cleanActivityLabel = new Label("cleanActivityLabel", {
                text: i18n.getText("cleanActivityLabel"),
                textAlign: sTextAlign,
                labelFor: sCleanActivityButton
            }).addStyleClass("sapUshellCleanActivityLabel");

            this.cleanActivityButton = new Button({
                id: "cleanActivityButton",
                text: i18n.getText("cleanActivityButton"),
                press: oController._handleCleanHistory
            }).addAriaLabelledBy(this.cleanActivityLabel);

            var fcleanActivity = new FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    this.cleanActivityLabel,
                    this.cleanActivityButton
                ]
            });

            var vbox = new VBox({
                items: [fTrackingSwitch, fcleanActivity]
            });
            vbox.addStyleClass("sapUiSmallMargin");

            return vbox;
        },

        getControllerName: function () {
            return "sap.ushell.components.shell.UserSettings.userActivitiesHandler";
        }
    });
});
}
},"Component-preload"
);
