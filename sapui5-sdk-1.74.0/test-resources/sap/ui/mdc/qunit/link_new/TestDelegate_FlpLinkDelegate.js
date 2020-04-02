/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/ui/mdc/flp/FlpLinkDelegate",
    "sap/ui/mdc/link/LinkItem",
    "sap/ui/mdc/link/Log"
], function(FlpLinkDelegate, LinkItem, Log) {
    "use strict";

    FlpLinkDelegate.fetchLinkItems = function(oContextObject, oPayload, oInfoLog) {
        var aItemsToReturn = [
            new LinkItem({
                key: "item00",
                href: "#Action00",
                text: "item 00"
            })
        ];
        if (oInfoLog) {
            oInfoLog.initialize(FlpLinkDelegate._getSemanticObjects(oPayload));
            aItemsToReturn.forEach(function(oItem) {
                oInfoLog.addIntent(Log.IntentType.API, {
                    text: oItem.getText(),
                    intent: oItem.getHref()
                });
            });
        }
        var oSemanticAttributes = FlpLinkDelegate._calculateSemanticAttributes(oContextObject, oPayload, oInfoLog);
        return FlpLinkDelegate._retrieveNavigationTargets("", oSemanticAttributes, oPayload, oInfoLog).then(function(aLinks, oOwnNavigationLink) {
            aItemsToReturn = aItemsToReturn.concat(aLinks);
            return Promise.resolve(aItemsToReturn);
        });
    };

    var SampleLinkDelegate = Object.assign({}, FlpLinkDelegate);

    return SampleLinkDelegate;
}, /* bExport= */ true);