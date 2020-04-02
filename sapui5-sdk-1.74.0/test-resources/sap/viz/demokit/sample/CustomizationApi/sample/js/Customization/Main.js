sap.ui.define(['./Overlay', './CustomRenderers', './Interaction'
], function(Overlay, CustomRenderers, Interaction) {
    "use strict";

    var FlagBarChart = sap.viz.extapi.core.BaseCustomization.extend();

    FlagBarChart.id = "com.sap.viz.custom.infoColumn";
    FlagBarChart.chartType = "info/bar";
    //FlagBarChart.customOverlay = Overlay;
    FlagBarChart.customRenderers = CustomRenderers;
    //FlagBarChart.customInteraction = Interaction;
    return FlagBarChart;
});