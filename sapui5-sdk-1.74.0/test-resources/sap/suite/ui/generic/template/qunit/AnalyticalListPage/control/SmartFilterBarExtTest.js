/*
 *Tests for the sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt
 */
sap.ui.define(
    ["sap/suite/ui/generic/template/AnalyticalListPage/control/SmartFilterBarExt",
        "sap/ui/comp/smartfilterbar/SmartFilterBar"
    ],
    function(SmartFilterBarExt, SmartFilterBar) {
        "use strict";
        SmartFilterBarExt = SmartFilterBar.extend("sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt", {});
        var myObject = new SmartFilterBarExt(this);
        var sfb = new SmartFilterBar(this);
        var oForm = SmartFilterBar.prototype._createFilters.apply(sfb, arguments);

        QUnit.test("CreateFilters", function(assert) {
            assert.notEqual(myObject._createFilters(), oForm);
        });
    }
);