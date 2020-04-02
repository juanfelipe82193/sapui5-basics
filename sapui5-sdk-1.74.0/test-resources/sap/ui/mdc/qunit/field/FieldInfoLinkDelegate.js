/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/ui/mdc/flp/FlpLinkDelegate",
    "sap/ui/mdc/link/ContactDetails"
], function (FlpLinkDelegate, ContactDetails) {
    "use strict";

    FlpLinkDelegate.fetchAdditionalContent = function (oPayload) {
        var aAdditionalContent = [
            new ContactDetails()
        ];
        if (oPayload && oPayload.additionalContent) {
            aAdditionalContent.push(oPayload.additionalContent);
        }
        return Promise.resolve(aAdditionalContent);
    };

    var SampleLinkDelegate = Object.assign({}, FlpLinkDelegate);

    return SampleLinkDelegate;
}, /* bExport= */ true);