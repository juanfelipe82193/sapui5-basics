// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/services/Container",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/renderers/fiori2/Renderer"
], function (oContainer, AppRuntimeService, Renderer) {
    "use strict";

    function ContainerProxy () {
        var fnOrgSetDirtyFlag;

        this.bootstrap = function (sPlatform, mAdapterPackagesByPlatform) {
            return sap.ushell.bootstrap(sPlatform, mAdapterPackagesByPlatform).then(function (Container) {
                fnOrgSetDirtyFlag = sap.ushell.Container.setDirtyFlag;

                //get indication if we are running inside an iframe
                sap.ushell.Container.runningInIframe = function () {
                    try {
                        return window.self !== window.top;
                    } catch (e) {
                        return true;
                    }
                };

                //override setDirtyFlag for delegation.
                sap.ushell.Container.setDirtyFlag = function (bIsDirty) {
                    //set local isDirty flage, so that it will reflet the real dirty state.
                    fnOrgSetDirtyFlag(bIsDirty);

                    //reflect the changes to the outer shell.
                    AppRuntimeService.sendMessageToOuterShell(
                        "sap.ushell.services.ShellUIService.setDirtyFlag", {
                            "bIsDirty": bIsDirty
                        });
                };

                sap.ushell.Container.getFLPUrl = function (bIncludeHash) {
                    return AppRuntimeService.sendMessageToOuterShell(
                        "sap.ushell.services.Container.getFLPUrl", {
                            "bIncludeHash": bIncludeHash
                        });
                };

                sap.ushell.Container.getRenderer = function () {
                    return Renderer;
                };
            });
        };
    }

    return new ContainerProxy();
}, true);
