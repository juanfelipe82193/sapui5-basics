// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/*
 * Provides diagnostic plugin "SAPUI5 Apps: Check of Infrastructure on SAP NetWeaver AS for ABAP"
 * via module sap.ushell_abap.support.plugins.app-infra.AppInfraOnSapNetWeaverSupportPlugin
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ui/core/support/Plugin",
    "sap/ui/core/HTML",
    "sap/ui/layout/VerticalLayout",
    "sap/m/Text",
    "sap/base/i18n/ResourceBundle",
    "sap/base/security/encodeXML",
    "sap/m/Panel",
    "sap/m/Toolbar",
    "sap/m/Image",
    "sap/m/Title"
], function (
    jQuery,
    Plugin,
    Html,
    VerticalLayout,
    Text,
    ResourceBundle,
    encodeXML,
    Panel,
    Toolbar,
    Image,
    Title
) {
    "use strict";

    // Create diagnostic plugin
    var AppInfrastructurePlugin = Plugin.extend("sap.ushell_abap.support.plugins.app-infra.AppInfraOnSapNetWeaverSupportPlugin", {
        constructor: function (oSupportStub) {
            // Load internationalization
            this.sModulePath = sap.ui.require.toUrl("sap/ushell_abap/support/plugins/app-infra"); // "../../../../sap/ushell_abap/support/plugins"
            this.oI18n = ResourceBundle.create({ url: this.sModulePath + "/i18n/AppInfraOnSapNetWeaverSupportPlugin.properties" });

            // Base constructor
            Plugin.apply(this, ["sapUiAppInfraOnSapNetWeaverSupportPlugin", this.oI18n.getText("BACKEND_INFRASTRUCTURE"), oSupportStub]);

            // No events between app and tool window
        }
    });

    // Enable plugin in the tool window
    AppInfrastructurePlugin.prototype.isToolPlugin = function () {
        return true;
    };

    // Do not enable plugin in the app window
    AppInfrastructurePlugin.prototype.isAppPlugin = function () {
        return false;
    };

    // Format a report line
    var sGreenLightIndicator = encodeXML("@08@"),
        sYellowLightIndicator = encodeXML("@09@"),
        sRedLightIndicator = encodeXML("@0A@");
    AppInfrastructurePlugin.prototype.getReportLine = function (sLine, oOptions) {
        var sPutAtBeginning = (oOptions && oOptions.putAtBeginningOfEachLine) ? oOptions.putAtBeginningOfEachLine : "";
        sLine = (sLine === "") ? "&nbsp;" : encodeXML(sLine);
        sLine = "<div>" + sPutAtBeginning
            + sLine
                .replace(sGreenLightIndicator, "<img src='" + this.sModulePath + "/ABAP_ICON_GREEN_LIGHT.png'/>")
                .replace(sYellowLightIndicator, "<img src='" + this.sModulePath + "/ABAP_ICON_YELLOW_LIGHT.png'/>")
                .replace(sRedLightIndicator, "<img src='" + this.sModulePath + "/ABAP_ICON_RED_LIGHT.png'/>")
            + "</div>";
        return sLine;
    };

    AppInfrastructurePlugin.prototype.writeReportLine = function (oRenderManager, sLine) {
        oRenderManager.write(this.getReportLine(sLine));
    };

    AppInfrastructurePlugin.prototype.getReportLines = function (aLines, options) {
        var that = this;
        return aLines.reduce(function (sHtml, sLine) {
            return sHtml + that.getReportLine(sLine, options);
        }, "");
    };

    AppInfrastructurePlugin.prototype.writeFormatted = function (oFindings) {
        try {
            // Initialize
            var that = this,
                // Create a panel for each check
                aInfoAndPanels = [], oPanel;

            // Info in from backend
            this.oInfo = new VerticalLayout("backEndInformation", {
                content: [
                    new Text({ text: oFindings.topic }),
                    new Text({ text: "\n" }),
                    new Text({
                        text: this.oI18n.getText("SYSTEM_ID") + " : " + oFindings.sapNetWeaverAsAbap.systemId
                            + " ( " + oFindings.sapNetWeaverAsAbap.systemText + " )"
                    }),
                    new Text({
                        text: this.oI18n.getText("CLIENT") + " : " + oFindings.sapNetWeaverAsAbap.client
                            + " ( " + oFindings.sapNetWeaverAsAbap.clientDescription + " )"
                    }),
                    new Text({ text: this.oI18n.getText("SAP_NETWEAVER_RELEASE") + " : " + oFindings.sapNetWeaverAsAbap.release }),
                    new Text({ text: "\n" }),
                    new Text({
                        text: this.oI18n.getText("SAP_UI_SOFTWARE_COMPONENT") + " : " + oFindings.sapUi.softwareComponent
                            + " ( " + oFindings.sapUi.softwareComponentDescription + " )"
                    }),
                    new Text({ text: this.oI18n.getText("VERSION") + " : " + oFindings.sapUi.version }),
                    new Text({ text: this.oI18n.getText("SUPPORT_PACKAGE_LEVEL") + " : " + oFindings.sapUi.supportPackageLevel }),
                    new Text({ text: "\n" })
                ].map(function (oTextControl) { return oTextControl.addStyleClass("checkInfo"); })
            });
            aInfoAndPanels.push(this.oInfo);

            // Report the outcome of all checks:
            // ... Virus Scanner, /UI5/APP_INDEX_CALCULATE has been scheduled, Errors in the App Index Log, etc.
            oFindings.checks.forEach(function (oCheck) {
                function trafficLightUrl (oCheck) {
                    switch (oCheck.outcome.status) {
                        case "S": return that.sModulePath + "/ABAP_ICON_GREEN_LIGHT.png";
                        case "W": return that.sModulePath + "/ABAP_ICON_YELLOW_LIGHT.png";
                        case "E": return that.sModulePath + "/ABAP_ICON_RED_LIGHT.png";
                        default:
                            // eslint-disable-next-line no-console
                            console.error("SAPUI5 Apps: Check of Infrastructure on SAP NetWeaver Application Server for ABAP - Received invalid status: \""
                                + oCheck.outcome.status + "\" for Check \"" + oCheck.title + "\"");
                            return that.sModulePath + "/ABAP_ICON_LIGHT_OUT.png";
                    }
                }

                // Create panel indicating the outcome of the check in its title
                oPanel = new Panel({
                    expandable: true,
                    expanded: false,
                    width: "auto",
                    headerToolbar: new Toolbar({
                        content: [
                            new Image({ src: trafficLightUrl(oCheck) }),
                            new Title({ level: "H3", text: oCheck.outcome.message })
                        ]
                    })
                });

                function styleForStatus (sStatus) {
                    switch (sStatus) {
                        case "S": return "checkSuccessful";
                        case "W": return "checkEndedWithWarnings";
                        case "E": return "checkEndedWithErrors";
                        default: return "";
                    }
                }
                oPanel.addStyleClass(styleForStatus(oCheck.outcome.status));

                // Detail information goes into the panel
                var oHtml = new Html().setContent(
                    "<div class=\"checkSummary\">"
                    + that.getReportLines(oCheck.outcome.summary)
                    + "</div><div>&nbsp;</div>&nbsp;<div class=\"sapMText\">"
                    + that.oI18n.getText("DETAILS_BELOW")
                    + "</div><div>&nbsp;</div><div class=\"checkDetails\">"
                    + that.getReportLines(oCheck.outcome.details, { putAtBeginningOfEachLine: "&emsp;&emsp;&emsp;" })
                    + "</div>"
                );
                oPanel.addContent(oHtml);

                aInfoAndPanels.push(oPanel);
            });

            // Return info and panels in a vertical layout control
            return new VerticalLayout({ content: aInfoAndPanels, width: "100%" });
        } catch (error) {
            return new Text({ text: this.oI18n.getText("ERROR_RESPONSE_FROM_BACKEND_NOT_PROPERLY_FORMATTED") });
        }
    };

    AppInfrastructurePlugin.prototype.init = function (/*oSupportStub*/) {
        if (this.runsAsToolPlugin()) {
            // Initialize plugin if running in tool window
            var that = this,
                // Place new UI area into the panel
                oRenderManager = sap.ui.getCore().createRenderManager();
            oRenderManager.write("<div id=\"" + this.getId() + "-Area\" class=\"sapUiSizeCompact\" />").flush(this.$().get(0));
            this.addStylesheet("sap/ushell_abap/support/plugins/app-infra/AppInfraOnSapNetWeaverSupportPlugin");
            // this.addStylesheet( this.sModulePath + "/AppInfraOnSapNetWeaverSupportPlugin"); Does not work!
            oRenderManager.destroy();

            // Check the app infrastructure and write result on screen
            var oRenderingDone =
                this.check().done(
                    function (oFindings) {
                        that.writeFormatted(oFindings).placeAt(that.getId() + "-Area");
                    }
                ).fail(
                    function (/*jqxhr, textStatus, error*/) {
                        new Text("noBackEndResult", { text: that.oI18n.getText("ERROR_UNABLE_TO_RETRIEVE_INFORMATION_FROM_BACKEND") })
                            .placeAt(that.getId() + "-Area");
                    });

            // Even a call of the SAPGUI on the backend would be possible.
            // ... Unfortunatly it appears that report paging is not well supported in the Platin GUI
            // rm.write("<div><a href='https://.../sap/bc/gui/sap/its/webgui?~TRANSACTION=SUI_SUPPORT'>UI Support U51</a></div>");

            // Return promise rendering will be finished some time
            return oRenderingDone;
        }
        // Initialize plugin if running in application window
    };

    AppInfrastructurePlugin.prototype.exit = function () {
        Plugin.prototype.exit.apply(this, arguments);
    };

    AppInfrastructurePlugin.prototype.destroy = function () {
        if (this.oInfo) { this.oInfo.destroy(); } // Explicitly destroy backend information as not part of an UI5 aggregation
        Plugin.prototype.destroy.apply(this, arguments);
    };

    AppInfrastructurePlugin.prototype.check = function () {
        /*
        Returns an object representing the outcome of the backend checks in the following structure:

        {
            topic: "SAPUI5 Apps: Check of Infrastructure on SAP NetWeaver Application Server for ABAP",
            sapNetWeaverAsAbap: {
               systemId: "U1Y",
               systemText: "NW 740 UI Developments",
               release: "740",
               client: "010",
               clientDescription: "UI Development"
            },
            sapUi: {
              softwareComponent: "SAP_UI",
              version: "752",
              supportPackageLevel: "0000000000",
              description: "User Interface Technology 7.40"
            },
            checks: [
              {
                title: 'Checking the virus scanner setup for SAPUI5',
                outcome: {
                  status: 'W',
                  message: 'Virus scanner setup is okay, check the warnings',
                  summary: [
                    '   Diagnosis',
                    '   You can develop and operate SAPUI5 apps with the current virus scanner',
                    '   ...',
                    '   Procedure for System Administration',
                    '   ...',
                  ],
                  details: [
                    '*************************************************************************',
                    'Checking the virus scanner setup for SAPUI5',
                    '*************************************************************************',
                    '',
                    'Virus scan profile used: /UI5/UI5_INFRA_APP/REP_DT_PUT',
                    '',
                    'Errors and warnings:',
                    '',
                    '   ========== @09@ Warning :  VSCAN 033 ==========',
                    '   ...',
                    '',
                    'Overall result:',
                    '',
                    '   ========== @09@ Warning :  /UI5/CHECK_VIRUS_SCN 001 ==========',
                    '   Virus scanner setup is okay, check the warnings',
                    '',
                    '   Diagnosis',
                    '   ...',
                    '   Procedure for System Administration',
                    '   ...',
                    '',
                    '   Application component:',
                    '   CA-UI5-ABA ( SAP UI5 Application Infrastructure on Web AS ABAP )'
                  ]
                }
              },
              ... // Further checks
            ]
        }
        */

        return jQuery.getJSON("/sap/bc/ui2/check_app_infra", {});
    };

    return AppInfrastructurePlugin;
});
