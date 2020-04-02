/*global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/viz/ui5/theming/Util",
	"sap/ui/core/theming/Parameters"
], function(Util, Parameters) {

QUnit.module("Theming Util");

QUnit.test("read CSS parameters", function(assert){
    Util._mapping = {
            "sapUiChartBackgroundColor" : ["general.background.color",
                                           "plotArea.background.color"],
            "sapUiChartCategoryAxisLineColor" : "categoryAxis.color",
            "sapUiChartValueAxisLineColor" : "valueAxis.color"
    };
    var done = assert.async();
    sap.ui.getCore().attachInit(function() {
        var expected = {
            "general" : {
                "background" : {
                    "color" : Parameters.get("sapUiChartBackgroundColor")
                }
            },
            "plotArea" : {
                "background" : {
                    "color" : Parameters.get("sapUiChartBackgroundColor")
                }
            },
            "categoryAxis" : {
                "color" : Parameters.get("sapUiChartCategoryAxisLineColor")
            },
            "valueAxis" : {
                "color" : Parameters.get("sapUiChartValueAxisLineColor")
            }

        };

        var expected_excluded = {
            "general" : {
                "background" : {
                    "color" : Parameters.get("sapUiChartBackgroundColor")
                }
            },
            "plotArea" : {
                "background" : {
                    "color" : Parameters.get("sapUiChartBackgroundColor")
                }
            },
            "categoryAxis" : {
                "color" : Parameters.get("sapUiChartCategoryAxisLineColor")
            }
        };
        assert.deepEqual(Util.readCSSParameters("info/line"), expected, true, "The mapping from css parameter to properties should be corrected");
        assert.deepEqual(Util.readCSSParameters("info/dual_line"), expected_excluded, true, "The mapping from css parameter to properties should be corrected");
        done();
    });

});

QUnit.start();

});
