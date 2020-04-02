/*global QUnit,sinon*/
sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Label",
    "sap/ui/model/odata/v4/ODataListBinding",
    "sap/ui/model/odata/v4/ODataMetaModel",
    "sap/fe/macros/microchart/MicroChartContainer",
    "sap/suite/ui/microchart/AreaMicroChart",
    "sap/suite/ui/microchart/AreaMicroChartItem",
    "sap/suite/ui/microchart/AreaMicroChartLabel",
    "sap/suite/ui/microchart/ColumnMicroChart",
    "sap/suite/ui/microchart/ColumnMicroChartLabel",
    "sap/suite/ui/microchart/LineMicroChart",
    "sap/suite/ui/microchart/LineMicroChartLine",
    "sap/suite/ui/microchart/BulletMicroChart",
    "sap/suite/ui/microchart/StackedBarMicroChart",
    "sap/suite/ui/microchart/ComparisonMicroChart",
    "sap/suite/ui/microchart/HarveyBallMicroChart",
    "sap/suite/ui/microchart/RadialMicroChart"
], function (Control, Label, ODataV4ListBinding, ODataMetaModel, MicroChartContainer, AreaMicroChart, AreaMicroChartItem, AreaMicroChartLabel, ColumnMicroChart, ColumnMicroChartLabel, LineMicroChart, LineMicroChartLine, BulletMicroChart, StackedBarMicroChart, ComparisonMicroChart, HarveyBallMicroChart, RadialMicroChart) {
    "use strict";

    QUnit.module("sap.fe.macros.microchart.MicroChartContainer", {
        beforeEach: function () {
            this.oFEMacroMCC = new MicroChartContainer({
                id: "micro-chart-conatiner"
            }).placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oFEMacroMCC.destroy();
        }
    });

    QUnit.test("Check default values", function (assert) {
        assert.equal(this.oFEMacroMCC.getRenderLabels(), true, "RenderLabels default value is correct.");
        assert.equal(this.oFEMacroMCC.getUomPath(), undefined, "UomPath default value is correct.");
        assert.deepEqual(this.oFEMacroMCC.getMeasures(), [], "Measures default value is correct.");
        assert.equal(this.oFEMacroMCC.getDimension(), undefined, "Dimension default value is correct.");
        assert.deepEqual(this.oFEMacroMCC.getDataPointQualifiers(), [], "DataPointQualifiers default value is correct.");
        assert.strictEqual(MicroChartContainer.getMetadata()._sDefaultAggregation, "microChart", "The default aggregation is correctly set to microChart");
    });

    QUnit.test("Check rendering methods", function (assert) {
        var oBindingToUse, oBinding = {
            detachEvent: function (sEvent) {
                assert.strictEqual(sEvent, 'change', "Change event is detached.");
            },
            attachEvent: function (sEvent) {
                assert.strictEqual(sEvent, 'change', "Change event is attached.");
            }
        };

        var oStubBinding = sinon.stub(this.oFEMacroMCC, "_getListBindingForRuntimeLabels").callsFake(function () {
            return oBindingToUse;
        });
        var oStubCheckLabels = sinon.stub(this.oFEMacroMCC, "_checkIfChartRequiresRuntimeLabels").onFirstCall().returns(false).onSecondCall().returns(false).onThirdCall().returns(true);

        var oSpyDetach = sinon.spy(oBinding, "detachEvent");
        var oSpyAttach = sinon.spy(oBinding, "attachEvent");

        this.oFEMacroMCC.onBeforeRendering();
        assert.strictEqual(oSpyDetach.callCount, 0, "onBeforeRendering doesn't call detachEvent without listBinding.");
        assert.strictEqual(oSpyAttach.callCount, 0, "onBeforeRendering doesn't call attachEvent without listBinding.");
        assert.strictEqual(this.oFEMacroMCC._olistBinding, undefined, "ListBinding is undefined as default.");

        oBindingToUse = oBinding;
        this.oFEMacroMCC.onBeforeRendering();
        assert.strictEqual(oSpyDetach.callCount, 1, "onBeforeRendering call detachEvent when listBinding is available.");
        assert.strictEqual(oSpyAttach.callCount, 0, "onBeforeRendering doesn't call attachEvent without listBinding.");
        assert.strictEqual(this.oFEMacroMCC._olistBinding, undefined, "ListBinding is set to undefined when we detachEvent of listBinding.");

        this.oFEMacroMCC.onAfterRendering();
        assert.strictEqual(oSpyDetach.callCount, 1, "onAfterRendering doesn't call detachEvent of listBinding.");
        assert.strictEqual(oSpyAttach.callCount, 0, "onAfterRendering doesn't call attachEvent of listBinding with renderLabels not set to true.");
        assert.strictEqual(this.oFEMacroMCC._olistBinding, undefined, "onAfterRendering doesn't set listBinding if renderLabels not set to true.");

        this.oFEMacroMCC.setRenderLabels(true);
        this.oFEMacroMCC.onAfterRendering();
        assert.strictEqual(oSpyDetach.callCount, 1, "onAfterRendering doesn't call detachEvent of listBinding.");
        assert.strictEqual(oSpyAttach.callCount, 0, "onAfterRendering doesn't call attachEvent of listBinding with renderLabels set to true, but the microchart doesn't require runtime labels.");
        assert.strictEqual(this.oFEMacroMCC._olistBinding, undefined, "onAfterRendering doesn't set listBinding if renderLabels is set to true, but the microchart doesn't require runtime labels.");

        this.oFEMacroMCC.onAfterRendering();
        assert.strictEqual(oSpyDetach.callCount, 1, "onAfterRendering doesn't call detachEvent of listBinding.");
        assert.strictEqual(oSpyAttach.callCount, 1, "onAfterRendering calls attachEvent of listBinding when renderLabels is true and runtime labels are required");
        assert.ok(this.oFEMacroMCC._olistBinding, "The listBinding is set correctly");

        this.oFEMacroMCC.onBeforeRendering();
        assert.strictEqual(oSpyDetach.callCount, 2, "onBeforeRendering calls detachEvent when listBinding is available.");
        assert.strictEqual(oSpyAttach.callCount, 1, "onBeforeRendering doesn't call attachEvent with listBinding.");
        assert.strictEqual(this.oFEMacroMCC._olistBinding, undefined, "onBeforeRendering the listBinding is set to undefined.");

        oStubBinding.restore();
        oStubCheckLabels.restore();
        oSpyDetach.restore();
        oSpyAttach.restore();
    });

    QUnit.module("Test func: '_checkIfChartRequiresRuntimeLabels'", {
        beforeEach: function () {
            this.oFEMacroMCC = new MicroChartContainer({
                id: "micro-chart-conatiner"
            }).placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oFEMacroMCC.destroy();
        }
    });

    QUnit.test("Test for AreaMicroChart", function (assert) {
        var oMicroChart = new AreaMicroChart();
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._checkIfChartRequiresRuntimeLabels(), true, "AreaMicroChart requires runtime labels");

    });

    QUnit.test("Test for ColumnMicroChart", function (assert) {
        var oMicroChart = new ColumnMicroChart();
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._checkIfChartRequiresRuntimeLabels(), true, "ColumnMicroChart requires runtime labels");

    });

    QUnit.test("Test for LineMicroChart", function (assert) {
        var oMicroChart = new LineMicroChart();
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._checkIfChartRequiresRuntimeLabels(), true, "LineMicroChart requires runtime labels");

    });

    QUnit.test("Test for BulletMicroChart", function (assert) {
        var oMicroChart = new BulletMicroChart();
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._checkIfChartRequiresRuntimeLabels(), false, "BulletMicroChart dosen't require runtime labels");

    });

    QUnit.test("Test for StackedBarMicroChart", function (assert) {
        var oMicroChart = new StackedBarMicroChart();
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._checkIfChartRequiresRuntimeLabels(), false, "StackedBarMicroChart dosen't require runtime labels");

    });

    QUnit.test("Test for ComparisonMicroChart", function (assert) {
        var oMicroChart = new ComparisonMicroChart();
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._checkIfChartRequiresRuntimeLabels(), false, "ComparisonMicroChart dosen't require runtime labels");

    });

    QUnit.test("Test for HarveyBallMicroChart", function (assert) {
        var oMicroChart = new HarveyBallMicroChart();
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._checkIfChartRequiresRuntimeLabels(), false, "HarveyBallMicroChart dosen't require runtime labels");

    });

    QUnit.test("Test for RadialMicroChart", function (assert) {
        var oMicroChart = new RadialMicroChart();
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._checkIfChartRequiresRuntimeLabels(), false, "RadialMicroChart dosen't require runtime labels");

    });

    QUnit.test("Test for basic Control", function (assert) {
        var oMicroChart = new Control();
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._checkIfChartRequiresRuntimeLabels(), false, "Control dosen't require runtime labels");

    });

    QUnit.module("Test func: '_checkForChartLabelAggregations'", {
        beforeEach: function () {
            this.oFEMacroMCC = new MicroChartContainer({
                id: "micro-chart-conatiner"
            }).placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oFEMacroMCC.destroy();
        }
    });

    QUnit.test("Test for AreaMicroChart", function (assert) {
        var oMicroChart = new AreaMicroChart();
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._checkForChartLabelAggregations(), false, "No label Aggregations present.");

        oMicroChart.setAggregation("firstXLabel", new AreaMicroChartLabel(), false);
        assert.strictEqual(this.oFEMacroMCC._checkForChartLabelAggregations(), false, "One label Aggregation is present.");

        oMicroChart.setAggregation("firstYLabel", new AreaMicroChartLabel(), false);
        assert.strictEqual(this.oFEMacroMCC._checkForChartLabelAggregations(), false, "Two label Aggregation are present.");

        oMicroChart.setAggregation("lastXLabel", new AreaMicroChartLabel(), false);
        assert.strictEqual(this.oFEMacroMCC._checkForChartLabelAggregations(), false, "Three label Aggregations are present.");

        oMicroChart.setAggregation("lastYLabel", new AreaMicroChartLabel(), false);
        assert.strictEqual(this.oFEMacroMCC._checkForChartLabelAggregations(), true, "All label Aggregations are present.");
    });

    QUnit.test("Test for ColumnMicroChart", function (assert) {
        var oMicroChart = new ColumnMicroChart();
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._checkForChartLabelAggregations(), false, "No label Aggregations present.");

        oMicroChart.setAggregation("leftBottomLabel", new ColumnMicroChartLabel(), false);
        assert.strictEqual(this.oFEMacroMCC._checkForChartLabelAggregations(), false, "One label Aggregation is present.");

        oMicroChart.setAggregation("leftTopLabel", new ColumnMicroChartLabel(), false);
        assert.strictEqual(this.oFEMacroMCC._checkForChartLabelAggregations(), false, "Two label Aggregation are present.");

        oMicroChart.setAggregation("rightBottomLabel", new ColumnMicroChartLabel(), false);
        assert.strictEqual(this.oFEMacroMCC._checkForChartLabelAggregations(), false, "Three label Aggregations are present.");

        oMicroChart.setAggregation("rightTopLabel", new ColumnMicroChartLabel(), false);
        assert.strictEqual(this.oFEMacroMCC._checkForChartLabelAggregations(), true, "All label Aggregations are present.");
    });

    QUnit.test("Test for LineMicroChart", function (assert) {
        var oMicroChart = new LineMicroChart();
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._checkForChartLabelAggregations(), true, "LineMicroChart doesn't require any aggregation for labels");
    });

    QUnit.test("Test for BulletMicroChart", function (assert) {
        var oMicroChart = new BulletMicroChart();
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._checkForChartLabelAggregations(), false, "BulletMicroChart doesn't require any runtime labels");
    });

    QUnit.test("Test for StackedBarMicroChart", function (assert) {
        var oMicroChart = new StackedBarMicroChart();
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._checkForChartLabelAggregations(), false, "StackedBarMicroChart doesn't require any runtime labels");
    });

    QUnit.test("Test for ComparisonMicroChart", function (assert) {
        var oMicroChart = new ComparisonMicroChart();
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._checkForChartLabelAggregations(), false, "ComparisonMicroChart doesn't require any runtime labels");
    });

    QUnit.test("Test for HarveyBallMicroChart", function (assert) {
        var oMicroChart = new HarveyBallMicroChart();
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._checkForChartLabelAggregations(), false, "HarveyBallMicroChart doesn't require any runtime labels");
    });

    QUnit.test("Test for RadialMicroChart", function (assert) {
        var oMicroChart = new RadialMicroChart();
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._checkForChartLabelAggregations(), false, "RadialMicroChart doesn't require any runtime labels");
    });

    QUnit.module("Test func: '_getListBindingForRuntimeLabels'", {
        beforeEach: function () {
            this.oFEMacroMCC = new MicroChartContainer({
                id: "micro-chart-conatiner"
            }).placeAt("qunit-fixture");
            this.oStubListBinding = sinon.createStubInstance(ODataV4ListBinding);
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oFEMacroMCC.destroy();
            this.oStubListBinding.destroy();
        }
    });

    QUnit.test("Test for basic Control", function (assert) {
        var oMicroChart = new Control(),
            oStubMicroChart = sinon.stub(oMicroChart, "getBinding").onFirstCall().returns(false).onSecondCall().returns(this.oStubListBinding);

        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._getListBindingForRuntimeLabels(), false, "ListBinding is not fetched from basic Control");
        assert.notOk(this.oFEMacroMCC._getListBindingForRuntimeLabels() instanceof ODataV4ListBinding, "ListBinding is fetched is not fetched for basic Control");

        oStubMicroChart.restore();
    });

    QUnit.test("Test for BulletMicroChart", function (assert) {
        var oMicroChart = new BulletMicroChart(),
            oStubMicroChart = sinon.stub(oMicroChart, "getBinding").onFirstCall().returns(false).onSecondCall().returns(this.oStubListBinding);

        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._getListBindingForRuntimeLabels(), false, "ListBinding is not fetched from BulletMicroChart");
        assert.notOk(this.oFEMacroMCC._getListBindingForRuntimeLabels() instanceof ODataV4ListBinding, "ListBinding is fetched is not fetched for BulletMicroChart");

        oStubMicroChart.restore();
    });

    QUnit.test("Test for StackedBarMicroChart", function (assert) {
        var oMicroChart = new StackedBarMicroChart(),
            oStubMicroChart = sinon.stub(oMicroChart, "getBinding").onFirstCall().returns(false).onSecondCall().returns(this.oStubListBinding);

        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._getListBindingForRuntimeLabels(), false, "ListBinding is not fetched from StackedBarMicroChart");
        assert.notOk(this.oFEMacroMCC._getListBindingForRuntimeLabels() instanceof ODataV4ListBinding, "ListBinding is fetched is not fetched for StackedBarMicroChart");

        oStubMicroChart.restore();
    });

    QUnit.test("Test for ComparisonMicroChart", function (assert) {
        var oMicroChart = new ComparisonMicroChart(),
            oStubMicroChart = sinon.stub(oMicroChart, "getBinding").onFirstCall().returns(false).onSecondCall().returns(this.oStubListBinding);

        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._getListBindingForRuntimeLabels(), false, "ListBinding is not fetched from ComparisonMicroChart");
        assert.notOk(this.oFEMacroMCC._getListBindingForRuntimeLabels() instanceof ODataV4ListBinding, "ListBinding is fetched is not fetched for ComparisonMicroChart");

        oStubMicroChart.restore();
    });

    QUnit.test("Test for HarveyBallMicroChart", function (assert) {
        var oMicroChart = new Control(),
            oStubMicroChart = sinon.stub(oMicroChart, "getBinding").onFirstCall().returns(false).onSecondCall().returns(this.oStubListBinding);

        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._getListBindingForRuntimeLabels(), false, "ListBinding is not fetched from HarveyBallMicroChart");
        assert.notOk(this.oFEMacroMCC._getListBindingForRuntimeLabels() instanceof ODataV4ListBinding, "ListBinding is fetched is not fetched for HarveyBallMicroChart");

        oStubMicroChart.restore();
    });

    QUnit.test("Test for RadialMicroChart", function (assert) {
        var oMicroChart = new RadialMicroChart(),
            oStubMicroChart = sinon.stub(oMicroChart, "getBinding").onFirstCall().returns(false).onSecondCall().returns(this.oStubListBinding);

        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._getListBindingForRuntimeLabels(), false, "ListBinding is not fetched from RadialMicroChart");
        assert.notOk(this.oFEMacroMCC._getListBindingForRuntimeLabels() instanceof ODataV4ListBinding, "ListBinding is fetched is not fetched for RadialMicroChart");

        oStubMicroChart.restore();
    });

    QUnit.test("Test for AreaMicroChart", function (assert) {
        var oMicroChart = new AreaMicroChart(),
            oChart = new AreaMicroChartItem(),
            oStubChart = sinon.stub(oChart, "getBinding").onFirstCall().returns(false).onSecondCall().returns(this.oStubListBinding);

        oMicroChart.setChart(oChart);
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._getListBindingForRuntimeLabels(), false, "ListBinding is not fetched for AreaMicroChart when listBinding is not available.");
        assert.ok(this.oFEMacroMCC._getListBindingForRuntimeLabels() instanceof ODataV4ListBinding, "ListBinding is fetched for AreaMicroChart when available");

        oStubChart.restore();
    });

    QUnit.test("Test for ColumnMicroChart", function (assert) {
        var oMicroChart = new ColumnMicroChart(),
            oStubMicroChart = sinon.stub(oMicroChart, "getBinding").onFirstCall().returns(false).onSecondCall().returns(this.oStubListBinding);

        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._getListBindingForRuntimeLabels(), false, "ListBinding is not fetched for ColumnMicroChart when listBinding is not available.");
        assert.ok(this.oFEMacroMCC._getListBindingForRuntimeLabels() instanceof ODataV4ListBinding, "ListBinding is fetched for ColumnMicroChart when available");

        oStubMicroChart.restore();
    });

    QUnit.test("Test for LineMicroChart", function (assert) {
        var oMicroChart = new LineMicroChart(),
            oLine = new LineMicroChartLine(),
            oStubLine = sinon.stub(oLine, "getBinding").onFirstCall().returns(false).onSecondCall().returns(this.oStubListBinding);

        oMicroChart.addLine(oLine);
        this.oFEMacroMCC.setMicroChart(oMicroChart);

        assert.strictEqual(this.oFEMacroMCC._getListBindingForRuntimeLabels(), false, "ListBinding is not fetched for LineMicroChart when listBinding is not available.");
        assert.ok(this.oFEMacroMCC._getListBindingForRuntimeLabels() instanceof ODataV4ListBinding, "ListBinding is fetched for LineMicroChart when available");

        oStubLine.restore();
    });

    QUnit.module("Test func: '_setRuntimeChartLabelsAndUnitOfMeasure'", {
        beforeEach: function () {
            this.oFEMacroMCC = new MicroChartContainer({
                id: "micro-chart-conatiner"
            }).placeAt("qunit-fixture");

            this.oStubListBinding = sinon.createStubInstance(ODataV4ListBinding);
            this.oStubListBinding.getContexts = function () {
                return [
                    {
                        getObject: function (sProperty) {
                            if (sProperty.indexOf("measure1") > -1) {
                                return "0";
                            } else if (sProperty.indexOf("measure2") > -1) {
                                return "10";
                            } else if (sProperty.indexOf("dimension") > -1) {
                                return "First";
                            } else if (sProperty.indexOf("uom") > -1) {
                                return "EUR";
                            }
                        }
                    },
                    {
                        getObject: function (sProperty) {
                            if (sProperty.indexOf("measure1") > -1) {
                                return "50";
                            } else if (sProperty.indexOf("measure2") > -1) {
                                return "60";
                            } else if (sProperty.indexOf("dimension") > -1) {
                                return "Last";
                            }
                        }
                    }
                ];
            };

            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oStubListBinding.destroy();
            this.oFEMacroMCC.destroy();
        }
    });

    QUnit.test("Test for AreaMicroChart", function (assert) {
        var oMicroChart = new AreaMicroChart(),
            oLabel = new Label(),
            oStubMeasures = sinon.stub(this.oFEMacroMCC, "getMeasures").returns(["measure1"]),
            oStubDimension = sinon.stub(this.oFEMacroMCC, "getDimension").returns("dimension1"),
            oStubUomPath = sinon.stub(this.oFEMacroMCC, "getUomPath").returns("uom1"),
            oStubCheckForLabels = sinon.stub(this.oFEMacroMCC, "_checkForChartLabelAggregations").returns(true),
            oStubChartLabels = sinon.stub(this.oFEMacroMCC, "_setChartLabels").returns(true),
            oStubChartLabelColors = sinon.stub(this.oFEMacroMCC, "_setChartLabelsColors").returns(true);

        this.oFEMacroMCC.setAggregation("_uomLabel", oLabel);
        this.oFEMacroMCC._olistBinding = this.oStubListBinding;
        this.oFEMacroMCC.setMicroChart(oMicroChart);
        this.oFEMacroMCC._setRuntimeChartLabelsAndUnitOfMeasure();

        assert.strictEqual(oLabel.getText(), "EUR", "UOM Label is set correctly.");
        assert.strictEqual(oStubChartLabels.callCount, 1, "Call made to set labels.");
        assert.strictEqual(oStubChartLabelColors.callCount, 1, "Call made to set label colors.");

        oStubMeasures.restore();
        oStubDimension.restore();
        oStubUomPath.restore();
        oStubCheckForLabels.restore();
        oStubChartLabels.restore();
        oStubChartLabelColors.restore();
    });

    QUnit.test("Test for ColumnMicroChart", function (assert) {
        var oMicroChart = new ColumnMicroChart(),
            oLabel = new Label(),
            oStubMeasures = sinon.stub(this.oFEMacroMCC, "getMeasures").returns(["measure1"]),
            oStubDimension = sinon.stub(this.oFEMacroMCC, "getDimension").returns("dimension1"),
            oStubUomPath = sinon.stub(this.oFEMacroMCC, "getUomPath").returns("uom1"),
            oStubCheckForLabels = sinon.stub(this.oFEMacroMCC, "_checkForChartLabelAggregations").returns(true),
            oStubChartLabels = sinon.stub(this.oFEMacroMCC, "_setChartLabels").returns(true),
            oStubChartLabelColors = sinon.stub(this.oFEMacroMCC, "_setChartLabelsColors").returns(true);

        this.oFEMacroMCC.setAggregation("_uomLabel", oLabel);
        this.oFEMacroMCC._olistBinding = this.oStubListBinding;
        this.oFEMacroMCC.setMicroChart(oMicroChart);
        this.oFEMacroMCC._setRuntimeChartLabelsAndUnitOfMeasure();

        assert.strictEqual(oLabel.getText(), "EUR", "UOM Label is set correctly.");
        assert.strictEqual(oStubChartLabels.callCount, 1, "Call made to set labels.");
        assert.strictEqual(oStubChartLabelColors.callCount, 1, "Call made to set label colors.");

        oStubMeasures.restore();
        oStubDimension.restore();
        oStubUomPath.restore();
        oStubCheckForLabels.restore();
        oStubChartLabels.restore();
        oStubChartLabelColors.restore();
    });

    QUnit.test("Test for LineMicroChart", function (assert) {
        var oMicroChart = new LineMicroChart(),
            oLabel = new Label(),
            oStubMeasures = sinon.stub(this.oFEMacroMCC, "getMeasures").returns(["measure1", "measure2"]),
            oStubDimension = sinon.stub(this.oFEMacroMCC, "getDimension").returns("dimension1"),
            oStubUomPath = sinon.stub(this.oFEMacroMCC, "getUomPath").returns("uom1"),
            oStubCheckForLabels = sinon.stub(this.oFEMacroMCC, "_checkForChartLabelAggregations").returns(true),
            oStubPointCriticality = sinon.stub(this.oFEMacroMCC, "_getCriticalityFromPoint").onFirstCall().returns(Promise.resolve("Neutral")).onSecondCall().returns(Promise.resolve("Good")),
            oStubChartLabels = sinon.stub(this.oFEMacroMCC, "_setChartLabels").returns(true);

        oMicroChart.addLine(new LineMicroChartLine());
        oMicroChart.addLine(new LineMicroChartLine());

        this.oFEMacroMCC.setAggregation("_uomLabel", oLabel);
        this.oFEMacroMCC._olistBinding = this.oStubListBinding;
        this.oFEMacroMCC.setMicroChart(oMicroChart);
        return this.oFEMacroMCC._setRuntimeChartLabelsAndUnitOfMeasure().then(function () {
            assert.strictEqual(oLabel.getText(), "EUR", "UOM Label is set correctly.");
            assert.strictEqual(oStubChartLabels.callCount, 1, "Call made to set labels.");
            assert.strictEqual(oMicroChart.getLines()[0].getColor(), "Neutral", "Call made to set line color.");
            assert.strictEqual(oMicroChart.getLines()[1].getColor(), "Good", "Call made to set line color.");

            oStubMeasures.restore();
            oStubDimension.restore();
            oStubUomPath.restore();
            oStubCheckForLabels.restore();
            oStubPointCriticality.restore();
            oStubChartLabels.restore();

        });
    });

    QUnit.module("Test func: '_setChartLabelsColors'", {
        beforeEach: function () {
            this.oFEMacroMCC = new MicroChartContainer({
                id: "micro-chart-conatiner"
            }).placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oFEMacroMCC.destroy();
        }
    });

    QUnit.test("Test for AreaMicroChart", function (assert) {
        var oMicroChart = new AreaMicroChart(),
            oStubPointCriticality = sinon.stub(this.oFEMacroMCC, "_getCriticalityFromPoint").onFirstCall().returns("Neutral").onSecondCall().returns("Error");

        this.oFEMacroMCC.setMicroChart(oMicroChart);

        oMicroChart.setAggregation("firstYLabel", new AreaMicroChartLabel(), false);
        oMicroChart.setAggregation("lastYLabel", new AreaMicroChartLabel(), false);

        return this.oFEMacroMCC._setChartLabelsColors().then(function () {
            assert.strictEqual(oMicroChart.getAggregation("firstYLabel").getColor(), "Neutral", "Top left corner label color of AreaMicroChart is set correctly.");
            assert.strictEqual(oMicroChart.getAggregation("lastYLabel").getColor(), "Error", "Top right corner label color of AreaMicroChart is set correctly.");

            oStubPointCriticality.restore();
        });
    });

    QUnit.test("Test for ColumnMicroChart", function (assert) {
        var oMicroChart = new ColumnMicroChart(),
            oStubPointCriticality = sinon.stub(this.oFEMacroMCC, "_getCriticalityFromPoint").onFirstCall().returns("Critical").onSecondCall().returns("Good");

        this.oFEMacroMCC.setMicroChart(oMicroChart);

        oMicroChart.setAggregation("leftTopLabel", new ColumnMicroChartLabel(), false);
        oMicroChart.setAggregation("rightTopLabel", new ColumnMicroChartLabel(), false);

        return this.oFEMacroMCC._setChartLabelsColors().then(function () {
            assert.strictEqual(oMicroChart.getAggregation("leftTopLabel").getColor(), "Critical", "Top left corner label color of AreaMicroChart is set correctly.");
            assert.strictEqual(oMicroChart.getAggregation("rightTopLabel").getColor(), "Good", "Top right corner label color of AreaMicroChart is set correctly.");

            oStubPointCriticality.restore();
        });
    });

    QUnit.module("Test func: '_setChartLabels'", {
        beforeEach: function () {
            this.oFEMacroMCC = new MicroChartContainer({
                id: "micro-chart-conatiner"
            }).placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oFEMacroMCC.destroy();
        }
    });

    QUnit.test("Test for AreaMicroChart", function (assert) {
        var oMicroChart = new AreaMicroChart();

        this.oFEMacroMCC.setMicroChart(oMicroChart);

        oMicroChart.setAggregation("firstYLabel", new AreaMicroChartLabel(), false);
        oMicroChart.setAggregation("lastYLabel", new AreaMicroChartLabel(), false);
        oMicroChart.setAggregation("firstXLabel", new AreaMicroChartLabel(), false);
        oMicroChart.setAggregation("lastXLabel", new AreaMicroChartLabel(), false);

        this.oFEMacroMCC._setChartLabels();
        assert.strictEqual(oMicroChart.getAggregation("firstYLabel").getLabel(), "", "Top left corner label of AreaMicroChart is set empty correctly.");
        assert.strictEqual(oMicroChart.getAggregation("lastYLabel").getLabel(), "", "Top right corner label of AreaMicroChart is set empty correctly.");
        assert.strictEqual(oMicroChart.getAggregation("firstXLabel").getLabel(), "", "Bottom left corner label of AreaMicroChart is set empty correctly.");
        assert.strictEqual(oMicroChart.getAggregation("lastXLabel").getLabel(), "", "Bottom right corner label of AreaMicroChart is set empty correctly.");

        this.oFEMacroMCC._setChartLabels(10, 60, 0, 70);
        assert.strictEqual(oMicroChart.getAggregation("firstYLabel").getLabel(), "10", "Top left corner label of AreaMicroChart is set correctly with decimal.");
        assert.strictEqual(oMicroChart.getAggregation("lastYLabel").getLabel(), "60", "Top right corner label of AreaMicroChart is set correctly with decimal.");
        assert.strictEqual(oMicroChart.getAggregation("firstXLabel").getLabel(), "0", "Bottom left corner label of AreaMicroChart is set correctly with decimal.");
        assert.strictEqual(oMicroChart.getAggregation("lastXLabel").getLabel(), "70", "Bottom right corner label of AreaMicroChart is set correctly with decimal.");

        this.oFEMacroMCC._setChartLabels("LT", "RT", "LB", "RB");
        assert.strictEqual(oMicroChart.getAggregation("firstYLabel").getLabel(), "LT", "Top left corner label of AreaMicroChart is set correctly with string.");
        assert.strictEqual(oMicroChart.getAggregation("lastYLabel").getLabel(), "RT", "Top right corner label of AreaMicroChart is set correctly with string.");
        assert.strictEqual(oMicroChart.getAggregation("firstXLabel").getLabel(), "LB", "Bottom left corner label of AreaMicroChart is set correctly with string.");
        assert.strictEqual(oMicroChart.getAggregation("lastXLabel").getLabel(), "RB", "Bottom right corner label of AreaMicroChart is set correctly with string.");
    });

    QUnit.test("Test for ColumnMicroChart", function (assert) {
        var oMicroChart = new ColumnMicroChart();

        this.oFEMacroMCC.setMicroChart(oMicroChart);

        oMicroChart.setAggregation("leftTopLabel", new ColumnMicroChartLabel(), false);
        oMicroChart.setAggregation("rightTopLabel", new ColumnMicroChartLabel(), false);
        oMicroChart.setAggregation("leftBottomLabel", new ColumnMicroChartLabel(), false);
        oMicroChart.setAggregation("rightBottomLabel", new ColumnMicroChartLabel(), false);

        this.oFEMacroMCC._setChartLabels();
        assert.strictEqual(oMicroChart.getAggregation("leftTopLabel").getLabel(), "", "Top left corner label of ColumnMicroChart is set empty correctly.");
        assert.strictEqual(oMicroChart.getAggregation("rightTopLabel").getLabel(), "", "Top right corner label of ColumnMicroChart is set empty correctly.");
        assert.strictEqual(oMicroChart.getAggregation("leftBottomLabel").getLabel(), "", "Bottom left corner label of ColumnMicroChart is set empty correctly.");
        assert.strictEqual(oMicroChart.getAggregation("rightBottomLabel").getLabel(), "", "Bottom right corner label of ColumnMicroChart is set empty correctly.");

        this.oFEMacroMCC._setChartLabels(10, 60, 0, 70);
        assert.strictEqual(oMicroChart.getAggregation("leftTopLabel").getLabel(), "10", "Top left corner label of ColumnMicroChart is set correctly with decimal.");
        assert.strictEqual(oMicroChart.getAggregation("rightTopLabel").getLabel(), "60", "Top right corner label of ColumnMicroChart is set correctly with decimal.");
        assert.strictEqual(oMicroChart.getAggregation("leftBottomLabel").getLabel(), "0", "Bottom left corner label of ColumnMicroChart is set correctly with decimal.");
        assert.strictEqual(oMicroChart.getAggregation("rightBottomLabel").getLabel(), "70", "Bottom right corner label of ColumnMicroChart is set correctly with decimal.");

        this.oFEMacroMCC._setChartLabels("LT", "RT", "LB", "RB");
        assert.strictEqual(oMicroChart.getAggregation("leftTopLabel").getLabel(), "LT", "Top left corner label of ColumnMicroChart is set correctly with string.");
        assert.strictEqual(oMicroChart.getAggregation("rightTopLabel").getLabel(), "RT", "Top right corner label of ColumnMicroChart is set correctly with string.");
        assert.strictEqual(oMicroChart.getAggregation("leftBottomLabel").getLabel(), "LB", "Bottom left corner label of ColumnMicroChart is set correctly with string.");
        assert.strictEqual(oMicroChart.getAggregation("rightBottomLabel").getLabel(), "RB", "Bottom right corner label of ColumnMicroChart is set correctly with string.");
    });

    QUnit.test("Test for LineMicroChart", function (assert) {
        var oMicroChart = new LineMicroChart();

        this.oFEMacroMCC.setMicroChart(oMicroChart);

        this.oFEMacroMCC._setChartLabels();
        assert.strictEqual(oMicroChart.getProperty("leftTopLabel"), "", "Top left corner label of LineMicroChart is set empty correctly.");
        assert.strictEqual(oMicroChart.getProperty("rightTopLabel"), "", "Top right corner label of LineMicroChart is set empty correctly.");
        assert.strictEqual(oMicroChart.getProperty("leftBottomLabel"), "", "Bottom left corner label of LineMicroChart is set empty correctly.");
        assert.strictEqual(oMicroChart.getProperty("rightBottomLabel"), "", "Bottom right corner label of LineMicroChart is set empty correctly.");

        this.oFEMacroMCC._setChartLabels(10, 60, 0, 70);
        assert.strictEqual(oMicroChart.getProperty("leftTopLabel"), "10", "Top left corner label of LineMicroChart is set correctly with decimal.");
        assert.strictEqual(oMicroChart.getProperty("rightTopLabel"), "60", "Top right corner label of LineMicroChart is set correctly with decimal.");
        assert.strictEqual(oMicroChart.getProperty("leftBottomLabel"), "0", "Bottom left corner label of LineMicroChart is set correctly with decimal.");
        assert.strictEqual(oMicroChart.getProperty("rightBottomLabel"), "70", "Bottom right corner label of LineMicroChart is set correctly with decimal.");

        this.oFEMacroMCC._setChartLabels("LT", "RT", "LB", "RB");
        assert.strictEqual(oMicroChart.getProperty("leftTopLabel"), "LT", "Top left corner label of LineMicroChart is set correctly with string.");
        assert.strictEqual(oMicroChart.getProperty("rightTopLabel"), "RT", "Top right corner label of LineMicroChart is set correctly with string.");
        assert.strictEqual(oMicroChart.getProperty("leftBottomLabel"), "LB", "Bottom left corner label of LineMicroChart is set correctly with string.");
        assert.strictEqual(oMicroChart.getProperty("rightBottomLabel"), "RB", "Bottom right corner label of LineMicroChart is set correctly with string.");
    });

    QUnit.module("Test func: '_getCriticalityFromPoint'", {
        beforeEach: function () {
            this.oFEMacroMCC = new MicroChartContainer({
                id: "micro-chart-conatiner"
            }).placeAt("qunit-fixture");

            var that = this;

            this.oStubModel = sinon.stub(this.oFEMacroMCC, "getModel").callsFake(function () {
                return that.oModelToUse;
            });
            this.oPoint = {
                context: {
                    getPath: function () {
                        return "/A('1')";
                    },
                    getObject: function () {
                        return undefined;
                    }
                }
            };
            this.oDataPoint = undefined;
            this.oModelToUse = undefined;
            this.oMetaModel = sinon.createStubInstance(ODataMetaModel);
            this.oMetaModel.getMetaPath = function () {
                return "/A";
            };
            this.oMetaModel.requestObject = function () {
                return that.oRequestedObject;
            };
            this.oModel = {
                getMetaModel: function () {
                    return that.oMetaModel;
                }
            };

            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oStubModel.restore();
            this.oFEMacroMCC.destroy();
            this.oMetaModel.destroy();
            delete this.oDataPoint;
            delete this.oModel;
            delete this.oModelToUse;
            delete this.oPoint;
            delete this.oRequestedObject;
        }
    });

    QUnit.test("Test for Model,criticality and Point non-existances", function (assert) {
        var aPromises = [];

        aPromises.push(this.oFEMacroMCC._getCriticalityFromPoint(undefined).then(function (sCriticality) {
            assert.strictEqual(sCriticality, "Neutral", "Criticality is neutral when there is no model");
        }));

        this.oModelToUse = this.oModel;
        aPromises.push(this.oFEMacroMCC._getCriticalityFromPoint(undefined).then(function (sCriticality) {
            assert.strictEqual(sCriticality, "Neutral", "Criticality is neutral when there is no point");
        }));
        aPromises.push(this.oFEMacroMCC._getCriticalityFromPoint(
            {
                context: undefined
            }).then(function (sCriticality) {
                assert.strictEqual(sCriticality, "Neutral", "Criticality is neutral when point context doesn't exist.");
            })
        );
        aPromises.push(this.oFEMacroMCC._getCriticalityFromPoint(
            {
                context: {
                    getPath: function () {
                        return undefined;
                    }
                }
            }).then(function (sCriticality) {
                assert.strictEqual(sCriticality, "Neutral", "Criticality is neutral when point without context path.");
            })
        );

        this.oDataPoint = {
            "$Type": "com.sap.vocabularies.UI.v1.DataPointType",
            "Title": "Net Amount",
            "Value": {
                "$Path": "NetAmount"
            }
        };

        this.oRequestedObject = Promise.resolve(this.oDataPoint);
        aPromises.push(this.oFEMacroMCC._getCriticalityFromPoint(this.oPoint).then(function (sCriticality) {
            assert.strictEqual(sCriticality, "Neutral", "Criticality is neutral with no criticality and criticality calculation");
        }));
        return Promise.all(aPromises);
    });

    QUnit.test("Test with Criticality and Criticality Calculation", function (assert) {
        var aPromises = [],
            oStubCriticality = sinon.stub(this.oFEMacroMCC, "_criticality").returns("Good");

        this.oModelToUse = this.oModel;
        this.oDataPoint = {
            "$Type": "com.sap.vocabularies.UI.v1.DataPointType",
            "CriticalityCalculation": {
                "$Type": "com.sap.vocabularies.UI.v1.CriticalityCalculationType",
                "AcceptanceRangeHighValue": {
                    "$Path": "AcceptanceRangeHigh"
                },
                "AcceptanceRangeLowValue": {
                    "$Path": "AcceptanceRangeLow"
                },
                "DeviationRangeHighValue": {
                    "$Path": "DeviationRangeHigh"
                },
                "DeviationRangeLowValue": {
                    "$Path": "DeviationRangeLow"
                },
                "ImprovementDirection": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target"
                },
                "ToleranceRangeHighValue": {
                    "$Path": "ToleranceRangeHigh"
                },
                "ToleranceRangeLowValue": {
                    "$Path": "ToleranceRangeLow"
                }
            },
            "TargetValue": {
                "$Path": "TargetAmount"
            },
            "Title": "Data",
            "Value": {
                "$Path": "NetAmount"
            },
            "Criticality": {
                "$Path": "Criticality"
            }
        };
        this.oRequestedObject = Promise.resolve(this.oDataPoint);

        aPromises.push(this.oFEMacroMCC._getCriticalityFromPoint(this.oPoint).then(function (sCriticality) {
            assert.strictEqual(sCriticality, "Good", "Criticality is neutral with criticality and criticality calculation");
        }));

        return Promise.all(aPromises).then(function () {
            oStubCriticality.restore();
        });
    });

    QUnit.test("Test with Criticality", function (assert) {
        var aPromises = [],
            oStubCriticality = sinon.stub(this.oFEMacroMCC, "_criticality").returns("Critical");

        this.oModelToUse = this.oModel;
        this.oDataPoint = {
            "$Type": "com.sap.vocabularies.UI.v1.DataPointType",
            "TargetValue": {
                "$Path": "TargetAmount"
            },
            "Title": "Data",
            "Value": {
                "$Path": "NetAmount"
            },
            "Criticality": {
                "$Path": "Criticality"
            }
        };
        this.oRequestedObject = Promise.resolve(this.oDataPoint);

        aPromises.push(this.oFEMacroMCC._getCriticalityFromPoint(this.oPoint).then(function (sCriticality) {
            assert.strictEqual(sCriticality, "Critical", "Coloring with criticality.");
        }));

        return Promise.all(aPromises).then(function () {
            oStubCriticality.restore();
        });
    });

    QUnit.test("Test with Criticality Calculation with Paths", function (assert) {
        var aPromises = [],
            oStubCriticality = sinon.stub(this.oFEMacroMCC, "_criticalityCalculation").returns("Good"),
            oStubObject = sinon.stub(this.oPoint.context, "getObject")
                .withArgs("AcceptanceRangeHigh").returns(40)
                .withArgs("AcceptanceRangeLow").returns(30)
                .withArgs("DeviationRangeHigh").returns(50)
                .withArgs("DeviationRangeLow").returns(20)
                .withArgs("ToleranceRangeHigh").returns(35)
                .withArgs("ToleranceRangeLow").returns(25);

        this.oModelToUse = this.oModel;
        this.oDataPoint = {
            "$Type": "com.sap.vocabularies.UI.v1.DataPointType",
            "CriticalityCalculation": {
                "$Type": "com.sap.vocabularies.UI.v1.CriticalityCalculationType",
                "AcceptanceRangeHighValue": {
                    "$Path": "AcceptanceRangeHigh"
                },
                "AcceptanceRangeLowValue": {
                    "$Path": "AcceptanceRangeLow"
                },
                "DeviationRangeHighValue": {
                    "$Path": "DeviationRangeHigh"
                },
                "DeviationRangeLowValue": {
                    "$Path": "DeviationRangeLow"
                },
                "ImprovementDirection": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target"
                },
                "ToleranceRangeHighValue": {
                    "$Path": "ToleranceRangeHigh"
                },
                "ToleranceRangeLowValue": {
                    "$Path": "ToleranceRangeLow"
                }
            },
            "TargetValue": {
                "$Path": "TargetAmount"
            },
            "Title": "Data",
            "Value": {
                "$Path": "NetAmount"
            }
        };
        this.oRequestedObject = Promise.resolve(this.oDataPoint);

        aPromises.push(this.oFEMacroMCC._getCriticalityFromPoint(this.oPoint).then(function (sCriticality) {
            assert.strictEqual(sCriticality, "Good", "Coloring with path criticality calculation");
        }));

        return Promise.all(aPromises).then(function () {
            oStubCriticality.restore();
            oStubObject.reset();
        });
    });

    QUnit.test("Test with Criticality Calculation with Decimals", function (assert) {
        var aPromises = [],
            oStubCriticality = sinon.stub(this.oFEMacroMCC, "_criticalityCalculation").returns("Good"),
            oStubObject = sinon.stub(this.oPoint.context, "getObject")
                .withArgs("AcceptanceRangeHigh").returns(40)
                .withArgs("AcceptanceRangeLow").returns(30)
                .withArgs("DeviationRangeHigh").returns(50)
                .withArgs("DeviationRangeLow").returns(20)
                .withArgs("ToleranceRangeHigh").returns(35)
                .withArgs("ToleranceRangeLow").returns(25);

        this.oModelToUse = this.oModel;
        this.oDataPoint = {
            "$Type": "com.sap.vocabularies.UI.v1.DataPointType",
            "CriticalityCalculation": {
                "$Type": "com.sap.vocabularies.UI.v1.CriticalityCalculationType",
                "AcceptanceRangeHighValue": {
                    "$Decimal": 40
                },
                "AcceptanceRangeLowValue": {
                    "$Decimal": 30
                },
                "DeviationRangeHighValue": {
                    "$Decimal": 50
                },
                "DeviationRangeLowValue": {
                    "$Decimal": 20
                },
                "ImprovementDirection": {
                    "$EnumMember": "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target"
                },
                "ToleranceRangeHighValue": {
                    "$Decimal": 35
                },
                "ToleranceRangeLowValue": {
                    "$Decimal": 25
                }
            },
            "TargetValue": {
                "$Path": "TargetAmount"
            },
            "Title": "Data",
            "Value": {
                "$Path": "NetAmount"
            }
        };
        this.oRequestedObject = Promise.resolve(this.oDataPoint);

        aPromises.push(this.oFEMacroMCC._getCriticalityFromPoint(this.oPoint).then(function (sCriticality) {
            assert.strictEqual(sCriticality, "Good", "Coloring with decimal criticality calculation");
        }));

        return Promise.all(aPromises).then(function () {
            oStubCriticality.restore();
            oStubObject.reset();
        });
    });

    QUnit.module("Test func: '_criticality'", {
        beforeEach: function () {
            var that = this;

            this.oFEMacroMCC = new MicroChartContainer({
                id: "micro-chart-conatiner"
            }).placeAt("qunit-fixture");
            this.context = {
                getObject: function () {
                    return that.iCriticality;
                }
            };

            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oFEMacroMCC.destroy();
            delete this.context;
        }
    });

    QUnit.test("Test different values for criticality", function (assert) {
        var oCriticality = {};

        assert.strictEqual(this.oFEMacroMCC._criticality(oCriticality, this.context), "Neutral", "Criticality default value when there is no criticality");

        oCriticality.$Path = "Criticality";

        this.iCriticality = "Negative";
        assert.strictEqual(this.oFEMacroMCC._criticality(oCriticality, this.context), "Error", "Criticality is 'Negative'.");

        this.iCriticality = "1";
        assert.strictEqual(this.oFEMacroMCC._criticality(oCriticality, this.context), "Error", "Criticality is '1'.");

        this.iCriticality = 1;
        assert.strictEqual(this.oFEMacroMCC._criticality(oCriticality, this.context), "Error", "Criticality is 1.");

        this.iCriticality = "Critical";
        assert.strictEqual(this.oFEMacroMCC._criticality(oCriticality, this.context), "Critical", "Criticality is 'Critical'.");

        this.iCriticality = "2";
        assert.strictEqual(this.oFEMacroMCC._criticality(oCriticality, this.context), "Critical", "Criticality is '2'.");

        this.iCriticality = 2;
        assert.strictEqual(this.oFEMacroMCC._criticality(oCriticality, this.context), "Critical", "Criticality is 2.");

        this.iCriticality = "Positive";
        assert.strictEqual(this.oFEMacroMCC._criticality(oCriticality, this.context), "Good", "Criticality is 'Positive'.");

        this.iCriticality = "3";
        assert.strictEqual(this.oFEMacroMCC._criticality(oCriticality, this.context), "Good", "Criticality is '3'.");

        this.iCriticality = 3;
        assert.strictEqual(this.oFEMacroMCC._criticality(oCriticality, this.context), "Good", "Criticality is 3.");

        delete oCriticality.$Path;
        oCriticality.$EnumMember = "com.sap.vocabularies.UI.v1.CriticalityType/Negative";
        assert.strictEqual(this.oFEMacroMCC._criticality(oCriticality, this.context), "Error", "Criticality enum is Negative.");

        oCriticality.$EnumMember = "com.sap.vocabularies.UI.v1.CriticalityType/Positive";
        assert.strictEqual(this.oFEMacroMCC._criticality(oCriticality, this.context), "Good", "Criticality enum is Positive.");

        oCriticality.$EnumMember = "com.sap.vocabularies.UI.v1.CriticalityType/Critical";
        assert.strictEqual(this.oFEMacroMCC._criticality(oCriticality, this.context), "Critical", "Criticality enum is Critical.");

        oCriticality.$EnumMember = "com.sap.vocabularies.UI.v1.CriticalityType/Neutral";
        assert.strictEqual(this.oFEMacroMCC._criticality(oCriticality, this.context), "Neutral", "Criticality enum is Neutral.");
    });

    QUnit.module("Test func: '_criticalityCalculation'", {
        beforeEach: function () {
            this.oFEMacroMCC = new MicroChartContainer({
                id: "micro-chart-conatiner"
            }).placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oFEMacroMCC.destroy();
        }
    });

    QUnit.test("Test different values for criticalityCalculation", function (assert) {
        var fnCC = this.oFEMacroMCC._criticalityCalculation;

        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target", "10", "20", "25", "30", "40", "45", "50"), "Error", "Value < DL with Target.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target", "22", "20", "25", "30", "40", "45", "50"), "Critical", "DL < Value < TL with Target.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target", "27", "20", "25", "30", "40", "45", "50"), "Neutral", "TL < Value < AL with Target.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target", "35", "20", "25", "30", "40", "45", "50"), "Good", "AL < Value < AH with Target.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target", "42", "20", "25", "30", "40", "45", "50"), "Neutral", "AH < Value < TH with Target.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target", "47", "20", "25", "30", "40", "45", "50"), "Critical", "TH < Value < DH with Target.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target", "55", "20", "25", "30", "40", "45", "50"), "Error", "DH < Value with Target.");

        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target", "27", "20", "25", undefined, undefined, "45", "50"), "Good", "Without Acceptance with Target.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target", "22", "20", undefined, "30", "40", "45", "50"), "Neutral", "Without TL with Target.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target", "45", "20", "25", "30", "40", undefined, "50"), "Neutral", "Without TH with Target.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target", "15", undefined, "25", "30", "40", "45", "50"), "Critical", "Without DL with Target.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target", "55", "20", "25", "30", "40", "45", undefined), "Critical", "Without DH with Target.");

        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize", "10", "20", "25", "30", "40", "45", "50"), "Error", "Value < DL with Maximize.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize", "22", "20", "25", "30", "40", "45", "50"), "Critical", "DL < Value < TL with Maximize.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize", "27", "20", "25", "30", "40", "45", "50"), "Neutral", "TL < Value < AL with Maximize.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize", "35", "20", "25", "30", "40", "45", "50"), "Good", "AL < Value < AH with Maximize.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize", "42", "20", "25", "30", "40", "45", "50"), "Good", "AH < Value < TH with Maximize.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize", "47", "20", "25", "30", "40", "45", "50"), "Good", "TH < Value < DH with Maximize.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize", "55", "20", "25", "30", "40", "45", "50"), "Good", "DH < Value with Maximize.");

        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize", "27", "20", "25", undefined, undefined, "45", "50"), "Good", "Without Acceptance with Target.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize", "22", "20", undefined, "30", "40", "45", "50"), "Neutral", "Without TL with Target.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize", "45", "20", "25", "30", "40", undefined, "50"), "Good", "Without TH with Target.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize", "15", undefined, "25", "30", "40", "45", "50"), "Critical", "Without DL with Target.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize", "55", "20", "25", "30", "40", "45", undefined), "Good", "Without DH with Target.");

        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize", "10", "20", "25", "30", "40", "45", "50"), "Good", "Value < DL with Minimize.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize", "22", "20", "25", "30", "40", "45", "50"), "Good", "DL < Value < TL with Minimize.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize", "27", "20", "25", "30", "40", "45", "50"), "Good", "TL < Value < AL with Minimize.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize", "35", "20", "25", "30", "40", "45", "50"), "Good", "AL < Value < AH with Minimize.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize", "42", "20", "25", "30", "40", "45", "50"), "Neutral", "AH < Value < TH with Minimize.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize", "47", "20", "25", "30", "40", "45", "50"), "Critical", "TH < Value < DH with Minimize.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize", "55", "20", "25", "30", "40", "45", "50"), "Error", "DH < Value with Minimize.");

        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize", "27", "20", "25", undefined, undefined, "45", "50"), "Good", "Without Acceptance with Minimize.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize", "22", "20", undefined, "30", "40", "45", "50"), "Good", "Without TL with Minimize.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize", "45", "20", "25", "30", "40", undefined, "50"), "Neutral", "Without TH with Minimize.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize", "15", undefined, "25", "30", "40", "45", "50"), "Good", "Without DL with Minimize.");
        assert.strictEqual(fnCC("com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize", "55", "20", "25", "30", "40", "45", undefined), "Critical", "Without DH with Minimize.");
    });

});
