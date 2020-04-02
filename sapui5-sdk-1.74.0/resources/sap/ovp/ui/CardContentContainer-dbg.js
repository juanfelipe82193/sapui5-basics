sap.ui.define(["sap/m/FlexBox"],
    function(FlexBox) {
        "use strict";

        var CardContentContainer = FlexBox.extend("sap.ovp.ui.CardContentContainer", {
            metadata: {
                library: "sap.ovp"
            },
            renderer: {
                render: function (oRm, oControl) {
                    oRm.write("<div");
                    oRm.writeControlData(oControl);
                    oRm.addClass("sapOvpCardContentContainer");
                    oRm.writeClasses();
                    oRm.write(">");
                    var items = oControl.getItems();
                    for (var i = 0; i < items.length; i++) {
                        oRm.renderControl(items[i]);
                    }
                    oRm.write("</div>");
                }
            }

        });
        return CardContentContainer;

    });
