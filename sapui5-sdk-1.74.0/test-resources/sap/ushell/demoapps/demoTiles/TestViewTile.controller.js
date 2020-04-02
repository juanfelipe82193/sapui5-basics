// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

(function () {
    "use strict";

    sap.ui.controller("sap.ushell.demo.demoTiles.TestViewTile", {
        _handleTilePress: function (oTileControl) {
            if (typeof oTileControl.attachPress === 'function') {
                oTileControl.attachPress(function () {
                    if (typeof oTileControl.getTargetURL === 'function') {
                        var sTargetURL = oTileControl.getTargetURL();
                        if (sTargetURL) {
                            if (sTargetURL[0] === '#') {
                                hasher.setHash(sTargetURL);
                            } else {
                                window.open(sTargetURL, '_blank');
                            }
                        }
                    }
                });
            }
        }
    });
}());
