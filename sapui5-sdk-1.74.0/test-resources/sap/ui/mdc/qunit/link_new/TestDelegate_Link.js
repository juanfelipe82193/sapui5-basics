/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/ui/mdc/LinkDelegate",
    "sap/ui/mdc/link/LinkItem"
], function(LinkDelegate, LinkItem) {
    "use strict";

    var SampleLinkDelegate = Object.assign({}, LinkDelegate);

    SampleLinkDelegate.fetchLinkItems = function() {
        var aLinkItems = [
            new LinkItem({
                href: "#Action01"
            }),
            new LinkItem({
                href: "#Action02"
            })
        ];
        return Promise.resolve(aLinkItems);
    };

    return SampleLinkDelegate;
}, /* bExport= */ true);