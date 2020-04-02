// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
(function () {
    "use strict";
    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.demo.AppPersSample2.util.TablePersonalizer");
    jQuery.sap.require("sap.ushell.services.Personalization");
    jQuery.sap.require("sap.m.TablePersoController");

    /**
     * Glues the table and the button to the respective table personalization control
     * and attaches that one to the personalization storage
     */
    sap.ushell.demo.AppPersSample2.util.TablePersonalizer = function (oTableControl,
            oStartPersonalizationButton, oPersId, oScope, oComponent) {
        var oPersonalizer,
            oTablePersoController;

        oPersonalizer = sap.ushell.Container.getService("Personalization")
            .getPersonalizer(oPersId, oScope, oComponent);
        oTablePersoController = new sap.m.TablePersoController({
            table : oTableControl,
            persoService : oPersonalizer
        });
        oTablePersoController.activate();
        oStartPersonalizationButton.attachPress(function () {
            oTablePersoController.openDialog();
        });
    };
}());