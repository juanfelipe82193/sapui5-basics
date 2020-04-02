// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/*global sap, jQuery */
sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function(jQuery, Controller, JSONModel, MessageToast) {
    "use strict";

    var S_INTRO = [
     ['The ShellUIService allows apps to interact with the surrounding UI.',
      'The service is injected in the app components by the FLP renderer',
      'before the corresponding apps start. To consume the service,',
      'app components should declare it in their manifest.json as follows:'
     ].join(" ")
     ,'{'
     ,' ...'
     ,'  "sap.ui5": {'
     ,'    "services": {'
     ,'      "ShellUIService": {'
     ,'        "factoryName": "sap.ushell.ui5service.ShellUIService"'
     ,'      }'
     ,'    }'
     ,'  }'
     ,' ...'
     ,'}'
     ,'',
     ['The service can be then consumed within the root component as shown in the',
      'following example:'
     ].join(" ")
     ,''
     ,'// Component.js'
     ,'...'
     ,'this.getService("ShellUIService").then( // promise is returned'
     ,'   function (oService) {'
     ,'      oService.setTitle("Application Title");'
     ,'   },'
     ,'   function (oError) {'
     ,'      jQuery.sap.log.error("Cannot get ShellUIService", oError, "my.app.Component");'
     ,'   }'
     ,');'
     ,'...'
    ].join("\n");

    return Controller.extend("sap.ushell.demo.AppShellUIServiceSample.App", {
        onInit: function () {
            jQuery.sap.log.setLevel(2); // set Warning level
            this.oShellUIServiceFromStaticMethod = null;
            this.oShellUIServiceFromComponent = null;
            this.oCrossAppNavigation = sap.ushell.Container.getService("CrossApplicationNavigation");
            this.iUpdateTimeout = 3000;
            this.sSwitchOnText = "using sap.ui.Component.getService('ShellUIService')";
            this.sSwitchOffText = "using ServiceFactoryRegistry#get('sap.ushell.ui5service.ShellUIService').getInstance()";
            this.setTitleTextStart = "Start calling setTitle()";
            this.setTitleTextStop = "Stop calling setTitle()";
            this.setTitleIconStart = "restart";
            this.setTitleIconStop = "stop";
            this.bSwitchOn = false;
            this.bCallSetTitle = false;
            this.oModel = {
                introText: S_INTRO,
                currentTimeout: "" + this.iUpdateTimeout,
                currentStateText: this.sSwitchOffText,
                setTitleIcon: "restart",
                setTitleText: this.setTitleTextStart,
                componentId: this.getOwnerComponent().getId(),
                setHierarchyRelatedAppsFormSaveEnabled: false,
                setHierarchyRelatedAppsFormDeleteEnabled: false,
                setHierarchyRelatedAppsFormItem: {
                },
                setHierarchyRelatedAppsArg: [{
                    title: "Sample App",
                    subtitle: "Demonstrates navigation",
                    icon: "sap-icon://media-play",
                    intent: "#Action-toappnavsample"
                }]
            };
            this._setModel(this.oModel);
        },
        onSetHierarchyRowSelectionChange: function (oControl) {
            var iSelectedIndex = oControl.getParameters().rowIndex;
            if (iSelectedIndex >= 0) {
                this.iSetHierarchySelectionIndex = iSelectedIndex;
                this.oModel.setHierarchyRelatedAppsFormSaveEnabled = true;
                this.oModel.setHierarchyRelatedAppsFormDeleteEnabled = true;
                this.oModel.setHierarchyRelatedAppsFormItem = jQuery.extend(true, {}, this.oModel.setHierarchyRelatedAppsArg[iSelectedIndex]);
                this._setModel(this.oModel);
            }
        },
        btnAddHierarchyEntryPressed: function () {
            this.iSetHierarchySelectionIndex = -1;
            this.oModel.setHierarchyRelatedAppsFormSaveEnabled = false;
            this.oModel.setHierarchyRelatedAppsFormDeleteEnabled = false;
            this.oModel.setHierarchyRelatedAppsFormItem = {};

            // Get data from form and add to the arg
            var oEntry = {
                title: this.byId("setHierarchyRelatedAppsTitle").getValue(),
                subtitle: this.byId("setHierarchyRelatedAppsSubtitle").getValue(),
                icon: this.byId("setHierarchyRelatedAppsIcon").getValue(),
                intent: this.byId("setHierarchyRelatedAppsIntent").getValue()
            };

            if (!jQuery.isArray(this.oModel.setHierarchyRelatedAppsArg)) {
                this.oModel.setHierarchyRelatedAppsArg = [];
            }

            this.oModel.setHierarchyRelatedAppsArg.push(oEntry);

            this._setModel(this.oModel);

            this.byId("setHierarchyRelatedAppsTable").clearSelection();
        },
        btnSaveHierarchyEntryPressed: function () {
            var that = this;
            var idx = this.iSetHierarchySelectionIndex;
            if (idx >= 0) {
                this.oModel.setHierarchyRelatedAppsFormSaveEnabled = false;
                this.oModel.setHierarchyRelatedAppsFormDeleteEnabled = false;

                this.oModel.setHierarchyRelatedAppsArg = this.oModel.setHierarchyRelatedAppsArg.map(function (oArg, i) {
                    if (i === idx) {
                        return {
                            title: that.byId("setHierarchyRelatedAppsTitle").getValue(),
                            subtitle: that.byId("setHierarchyRelatedAppsSubtitle").getValue(),
                            icon: that.byId("setHierarchyRelatedAppsIcon").getValue(),
                            intent: that.byId("setHierarchyRelatedAppsIntent").getValue()
                        };
                    }
                    return oArg;
                });

                this.iSetHierarchySelectionIndex = -1;
                this.oModel.setHierarchyRelatedAppsFormItem = {};
                this._setModel(this.oModel);
                this.byId("setHierarchyRelatedAppsTable").clearSelection();
            } else {
                MessageToast.show("No item selected");
            }
        },
        btnDeleteHierarchyEntryPressed: function () {
            var that = this;
            var idx = this.iSetHierarchySelectionIndex;
            if (idx >= 0) {
                this.byId("setHierarchyRelatedAppsTable").clearSelection();
                this.oModel.setHierarchyRelatedAppsFormSaveEnabled = false;
                this.oModel.setHierarchyRelatedAppsFormDeleteEnabled = false;
                this.oModel.setHierarchyRelatedAppsFormItem = {};

                this.oModel.setHierarchyRelatedAppsArg = this.oModel.setHierarchyRelatedAppsArg.filter(function (e, i) {
                    return i !== idx;
                });

                this.iSetHierarchySelectionIndex = -1;

                this._setModel(this.oModel);
            } else {
                MessageToast.show("No item selected");
            }
        },
        onAfterRendering: function () {
            // Fix some styles
            jQuery("textarea")
                .css("font-family", "courier")
                .css("font-size", "10pt")
                .css("border", "none");

            var that = this;

            this.iTitleCount = 0;

            // Read service from component
            this.getOwnerComponent().getService("ShellUIService").then(
                function (oService) {
                    that.oShellUIServiceFromComponent = oService;
                },
                function (oError) {
                    jQuery.sap.log.error(
                        "Error while getting ShellUIService",
                        oError,
                        "sap.ushell.demo.AppShellUIServiceSample"
                    );
                }
            );

            // Use static method
            sap.ui.core.service.ServiceFactoryRegistry
                .get("sap.ushell.ui5service.ShellUIService")
                .createInstance()
                .then(
                    function (oService) {
                        that.oShellUIServiceFromStaticMethod = oService;
                    },
                    function (oError) {
                        jQuery.sap.log.error(
                            "Error while getting ShellUIService",
                            oError,
                            "sap.ushell.demo.AppShellUIServiceSample"
                        );
                    }
                );
        },
        btnGoHomePressed: function () {
            this.oCrossAppNavigation.toExternal({
                target: {
                    shellHash: "#Shell-home"
                }
            });
        },
        btnGoToAppNavSample: function () {
            this.oCrossAppNavigation.toExternal({
                target: {
                    shellHash: "#Action-toappnavsample"
                }
            });
        },
        btnStartStopPressed: function (oControl) {
            if (oControl.getParameters().pressed) {
                this.oModel.setTitleIcon = this.setTitleIconStop;
                this.oModel.setTitleText = this.setTitleTextStop;
                this.bCallSetTitle = true;
                this._setRandomTitle();
            } else {
                this.oModel.setTitleIcon = this.setTitleIconStart;
                this.oModel.setTitleText = this.setTitleTextStart;
                this.bCallSetTitle = false;
                clearTimeout(this._currentTimeout);
            }

            this._setModel(this.oModel);
        },
        btnSetHierarchyRelatedAppsPressed: function () {
            this._setHierarchyRelatedApps(this.oModel.setHierarchyRelatedAppsArg);
        },
        btnClearHierarchyRelatedAppsPressed: function () {
            this._setHierarchyRelatedApps();
        },
        onTimeoutChanged: function (oControl) {
            this.iUpdateTimeout = oControl.getParameters().value;
            this.oModel.currentTimeout = this.iUpdateTimeout;
            this._setModel(this.oModel);
        },
        onUseInjectedServiceChange: function (oControl) {
            var bOn = oControl.getParameters().state;
            this.bSwitchOn = bOn;
            this.oModel.currentStateText = bOn
                ? this.sSwitchOnText
                : this.sSwitchOffText;
            this._setModel(this.oModel);
        },
        _setHierarchyRelatedApps: function (aMethodArg) {
            var oService = this.bSwitchOn
                ? this.oShellUIServiceFromComponent
                : this.oShellUIServiceFromStaticMethod;

            try {
                var sMethod = this.byId("radioRelatedApps").getSelected()
                    ? "setRelatedApps"
                    : "setHierarchy";

                oService[sMethod](aMethodArg);
                MessageToast.show(sMethod + " called successfully");
            } catch (oError) {
                MessageToast.show(oError);
            }
        },
        _setModel: function (oJson) {
            if (!this._oModel) {
                this._oModel = new JSONModel(oJson);
            } else {
                this._oModel.setData(oJson);
            }
            this.getView().setModel(this._oModel);
        },
        _setRandomTitle: function () {
            var oService = this.bSwitchOn
                ? this.oShellUIServiceFromComponent
                : this.oShellUIServiceFromStaticMethod;

            this.iTitleCount++;

            oService.setTitle("Automatic Title " + this.iTitleCount);

            // Schedule next one
            if (this.bCallSetTitle) {
                this._currentTimeout = setTimeout(this._setRandomTitle.bind(this), this.iUpdateTimeout);
            }
        }
    });
});
