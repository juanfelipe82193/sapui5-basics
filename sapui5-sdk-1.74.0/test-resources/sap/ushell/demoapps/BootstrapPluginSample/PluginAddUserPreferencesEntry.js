    // Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview an example for a custom bootstrap plug-in which FOR USE in Selenium test
 */
(function () {
    "use strict";
    /*global jQuery, sap, localStorage, window */
    jQuery.sap.log.debug("PluginAddUserPreferencesEntry - module loaded");

    jQuery.sap.declare("sap.ushell.demo.PluginAddUserPreferencesEntry");

    var oRendererExtensions,
        PluginSaveEntryConstructor = function (id) {
            this.init(id);
        };

    PluginSaveEntryConstructor.prototype = {
        init: function (id) {
            this.value = false;
            this.prevValue = false;
            this.id = "switchButton" + id;
            sap.ushell.Container.getService("UsageAnalytics").setLegalText("Indonesia's republican form of government includes an elected legislature and president. Indonesia has 34 provinces, of which five have Special Administrative status. Its capital city is Jakarta. The country shares land borders with Papua New Guinea, East Timor, and Malaysia. Other neighbouring countries include Singapore");
        },
        getValue: function () {
            var deferred = jQuery.Deferred();
            deferred.resolve(this.value);
            return deferred.promise();
        },
        onCancel: function () {
            this.value = this.prevValue;
            return this.value;
        },
        onSave: function () {
            var deferred = jQuery.Deferred();

            deferred.resolve(this.value);
            return deferred.promise();
        },
        getContent: function () {
            var that = this,
                switchButton = new sap.m.Switch(this.id);

            switchButton.setState(this.value);
            switchButton.attachChange(function () {
                that.value = this.getState();
                that.prevValue = !this.getState();
            });
            return jQuery.Deferred().resolve(switchButton);
        }
    };

    oRendererExtensions = jQuery.sap.getObject("sap.ushell.renderers.fiori2.RendererExtensions");

    function applyRendererExtensions() {
        jQuery.sap.log.debug("PluginAddUserPreferencesEntry - inserting user preferences entry after renderer was loaded");

        if (!oRendererExtensions) {
            oRendererExtensions = jQuery.sap.getObject("sap.ushell.renderers.fiori2.RendererExtensions");
        }

        if (oRendererExtensions) {
            var PluginSaveEntry4 = new PluginSaveEntryConstructor("4"),
                PluginSaveEntry5 = new PluginSaveEntryConstructor("5");

            oRendererExtensions.addUserPreferencesEntry({
                title: "entry1HappyScenario",
                value: function () {
                    var deferred = jQuery.Deferred();
                    window.setTimeout(function () {
                        deferred.resolve("entry1HappyScenario");
                    }, 2000);

                    return deferred.promise();
                },
                content: function () {
                    var deferred = jQuery.Deferred();

                    window.setTimeout(function () {
                        deferred.resolve(new sap.m.Button("userPrefEntryButton1", {text: "Button"}));
                    }, 2000);

                    return deferred.promise();
                },
                onSave: function () {
                    var deferred = jQuery.Deferred();

                    window.setTimeout(function () {
                        deferred.resolve();
                    }, 2000);

                    return deferred.promise();
                }
            });

            oRendererExtensions.addUserPreferencesEntry({
                title: "entry2SavingKey",
                value: function () {
                    var deferred = jQuery.Deferred();
                    window.setTimeout(function () {
                        deferred.resolve("entry2SavingValue");
                    }, 500);

                    return deferred.promise();
                },
                onSave: function () {
                    var deferred = jQuery.Deferred();

                    window.setTimeout(function () {
                        deferred.reject("entry2FailureScenario");
                    }, 500);

                    return deferred.promise();
                }
            });

            oRendererExtensions.addUserPreferencesEntry({
                title: "entry3ValueFailure",
                value: function () {
                    var deferred = jQuery.Deferred();
                    window.setTimeout(function () {
                        deferred.reject();
                    }, 2000);

                    return deferred.promise();
                },
                content: function () {
                    var deferred = jQuery.Deferred();

                    window.setTimeout(function () {
                        deferred.resolve("entry3ValueFailure");
                    }, 2000);

                    return deferred.promise();
                },
                onSave: function () {
                    var deferred = jQuery.Deferred();

                    window.setTimeout(function () {
                        deferred.reject("entry3ValueFailure");
                    }, 2000);

                    return deferred.promise();
                }
            });

            oRendererExtensions.addUserPreferencesEntry({
                title: "entry4SaveScenario",
                value: PluginSaveEntry4.getValue.bind(PluginSaveEntry4),
                content: PluginSaveEntry4.getContent.bind(PluginSaveEntry4),
                onSave: PluginSaveEntry4.onSave.bind(PluginSaveEntry4),
                onCancel : PluginSaveEntry4.onCancel.bind(PluginSaveEntry4)
            });

            oRendererExtensions.addUserPreferencesEntry({
                title: "entry5SaveScenario",
                value: PluginSaveEntry5.getValue.bind(PluginSaveEntry5),
                content: PluginSaveEntry5.getContent.bind(PluginSaveEntry5),
                onSave: PluginSaveEntry5.onSave.bind(PluginSaveEntry5),
                onCancel : PluginSaveEntry5.onCancel.bind(PluginSaveEntry5)
            });

            jQuery.sap.log.debug("PluginAddUserPreferencesEntry - Added a user preferences entry into the Shell Model");
        } else {
            jQuery.sap.log.error("BootstrapPluginSample - failed to apply renderer extensions, because 'sap.ushell.renderers.fiori2.RendererExtensions' not available");
        }
    }

    // the module could be loaded asynchronously, the shell does not guarantee a loading order;
    // therefore, we have to consider both cases, i.e. renderer is loaded before or after this module
    if (oRendererExtensions) {
        // fiori renderer already loaded, apply extensions directly
        applyRendererExtensions();
    } else {
        // fiori renderer not yet loaded, register handler for the loaded event
        sap.ui.getCore().getEventBus().subscribe("sap.ushell", "rendererLoaded", applyRendererExtensions, this);
    }

}());
