sap.ui.define(["sap/ui/test/Opa5",
    "sap/ui/test/matchers/AggregationLengthEquals",
    "./Common"
], function (Opa5, AggregationLengthEquals, Common) {
    "use strict";

    var fnAggregationLengthEquals = function (sLength) {
        return this.waitFor({
            controlType: "sap.ushell.ui.shell.ToolArea",
            matchers: new AggregationLengthEquals({
                name: "toolAreaItems",
                length: sLength
            }),
            success: function () {
                Opa5.assert.ok(true, sLength + " tool area item was found.");
            },
            errorMessage: sLength + " tool area item was not found."
        });
    };

    Opa5.createPageObjects({
        onTheToolAreaPlayground: {
            baseClass: Common,
            actions: {
                iPressTheToolAreaItemAddButton: function () {
                    return this.iPressTheButtonWithLabelFor("Tool Area Item");
                },
                iPressTheToolAreaItemRemoveButton: function () {
                    return this.iPressTheButtonWithId("toolAreaItemRemove");
                }
            },
            assertions: {
                iShouldSeeTwoToolAreaItem: function () {
                    return fnAggregationLengthEquals.call(this, 2);
                },
                iShouldSeeOneToolAreaItem: function () {
                    return fnAggregationLengthEquals.call(this, 1);
                }
            }
        }
    });
});