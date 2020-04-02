// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview This module is responsible to create reference pages,
 *  that is a shareable JSON representation of layout and navigation targets in the specific format
 *
 * @version 1.74.0
 * @private
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ushell/utils/clone"
], function (jQuery, fnClone) {
    "use strict";

    var PageReferencer = {};

    function getPermanentKeys (aPageLayout, NavTargetResolution) {
        var oResult = {};
        aPageLayout.forEach(function (oSection) {
            oSection.tiles.forEach(function (oTile) {
                var sTarget = oTile.target;
                if (sTarget && !oResult[sTarget]) {
                    oResult[sTarget] = NavTargetResolution.resolveHashFragment(sTarget);
                }
            });
        });

        return new Promise(function (fnResolve, fnReject) {
            var aPromises = [];
            Object.keys(oResult).forEach(function (sHash) {
                aPromises.push(oResult[sHash]);
            });
            jQuery.when.apply(null, aPromises).then(function () {
                var aResolutionResult = arguments;
                Object.keys(oResult).forEach(function (sHash, index) {
                    oResult[sHash] = aResolutionResult[index].inboundPermanentKey;
                });
                fnResolve(oResult);
            }, fnReject);
        });
    }

    function _createVisualization (oPermanentKeys, oTile) {
        return {
            inboundPermanentKey: oPermanentKeys[oTile.target],
            vizId: oTile.tileCatalogId
        };
    }

    function _createSection (oPermanentKeys, oGroup) {
        return {
            id: oGroup.id,
            title: oGroup.title,
            visualizations: oGroup.tiles.map(_createVisualization.bind(null, oPermanentKeys))
        };
    }

    PageReferencer.createReferencePage = function (oPageInfo, aPageGroups) {
        return sap.ushell.Container.getServiceAsync("NavTargetResolution")
            .then(getPermanentKeys.bind(null, aPageGroups))
            .then(function (oPermanentKeys) {
                var oResult = fnClone(oPageInfo);
                oResult.content.sections = aPageGroups.map(_createSection.bind(null, oPermanentKeys));
                return Promise.resolve(oResult);
            });
    };

    return PageReferencer;
});