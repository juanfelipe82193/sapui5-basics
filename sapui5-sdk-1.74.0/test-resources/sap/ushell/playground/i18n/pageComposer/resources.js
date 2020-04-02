// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define(["sap/ui/model/resource/ResourceModel"], function (
    ResourceModel
) {
    "use strict";

    var oI18nModel = new ResourceModel({
            bundleUrl: sap.ui.require.toUrl("sap/ushell/applications/PageComposer/i18n/i18n.properties"),
            bundleLocale: sap.ui.getCore().getConfiguration().getLanguage()
        }),
        oI18n = oI18nModel.getResourceBundle();

    return {
        i18nModel: oI18nModel,
        i18n: oI18n
    };
}, /* bExport= */ true);