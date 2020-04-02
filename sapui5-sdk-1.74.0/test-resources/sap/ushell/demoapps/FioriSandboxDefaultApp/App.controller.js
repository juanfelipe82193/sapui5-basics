// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/*global jQuery, sap, window */
jQuery.sap.require("sap.m.MessageToast");

sap.ui
        .controller(
                "sap.ushell.demo.FioriSandboxDefaultApp.App",
                {
                  onInit: function() {

                    var aApps = [],
                        oApplications = jQuery.sap.getObject("services.NavTargetResolution.adapter.config.applications", 5, window["sap-ushell-config"]),
                        crossAppNavService = sap.ushell.Container.getService("CrossApplicationNavigation"),
                        sAppName,
                        href;

                    for (sAppName in oApplications) {
                      if (oApplications.hasOwnProperty(sAppName) && sAppName != "" && sAppName != "_comment") {

                        // use cross-application navigation service to construct link targets with proper encoding
                        href = crossAppNavService.hrefForExternal({
                            target : {
                                shellHash : sAppName
                            }
                        });

                        aApps
                                .push({
                                  href: href,
                                  appDescription: oApplications[sAppName].description
                                          || sAppName
                                });
                      }
                    }

                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData({
                      "apps": aApps
                    });

                    this.getView().setModel(oModel);
                  },

                  onSelectFromList : function() {
                    var oButton = this.getView().byId("configAsLocal1");
                    oButton.setEnabled(true);
                  },

                  onConfigureAsAppLocal1 : function(oEvent) {
                    // Determine selected app.
                    // TODO Any better way to find out which app is selected?
                    var oList = this.getView().byId("applist");
                    var oListItem = oList.getSelectedItem();
                    var aListItemContents = oListItem.getContent();
                    var oLink = aListItemContents[0];
                    var sHref = oLink.getHref();
                    var sAppName = sHref.substring(1); // sHref.split("#")[1];
                    var oApp = oApplications[sAppName];

                    var sAppConfigO = JSON.stringify(oApp);

                    var oAppClone = JSON.parse(sAppConfigO);

                    // patch for relative sample applications:
                    var sRelStart = "../../../../../test-resources/sap/ushell/demoapps";
                    var iLen = sRelStart.length;
                    if (oAppClone.url.length > iLen && oAppClone.url.substr(0,iLen) === sRelStart) {
                        oAppClone.url = "/ushell/test-resources/sap/ushell/demoapps" + oAppClone.url.substr(iLen);
                    }
                    var sAppConfig = JSON.stringify(oAppClone);

                    // Store details of selected app for hash "#Test-local1".
                    localStorage["sap.ushell.#Test-local1"] = sAppConfig;

                    sap.m.MessageToast.show("App " + sAppName + " is now available as #Test-local1 in the Fiori Launchpad.");
                  },

                });