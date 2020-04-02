// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define(["sap/ui/model/resource/ResourceModel"], function (
    ResourceModel
) {
    "use strict";
    return {
        i18n: new ResourceModel({
            bundleUrl: sap.ui.require.toUrl("sap/ushell/applications/PageComposer/i18n/i18n.properties"),
            bundleLocale: sap.ui.getCore().getConfiguration().getLanguage()
        }).getResourceBundle()
    };
}, /* bExport= */ true);