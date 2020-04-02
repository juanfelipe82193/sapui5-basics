sap.ui.define(function () {
    "use strict";

    // static variables
    var ovpUtils = {
        bCRTLPressed: false
    };

    // constants
    ovpUtils.constants = {
        explace: "explace",
        inplace: "inplace"
    };
    ovpUtils.Annotations = {
        dataPoint: "dataPoint",
        title: "title",
        subTitle: "subtitle",
        valueSelectionInfo: "value Selection Info",
        listFlavor: "listFlavor"
    };
    ovpUtils.Layers = {
        vendor: "VENDOR",
        customer: "CUSTOMER",
        customer_base: "CUSTOMER_BASE"
    };
    ovpUtils.loadingState = {
        ERROR: "Error",
        LOADING: "Loading",
        GLOBALFILTERFILLED: false
    };


    return ovpUtils;

}, /* bExport= */ true);
