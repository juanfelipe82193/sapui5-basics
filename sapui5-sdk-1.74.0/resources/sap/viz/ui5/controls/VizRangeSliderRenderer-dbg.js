/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

sap.ui.define(["sap/ui/core/Renderer", "./VizSliderBasicRenderer", "sap/ui/Device"], function (Renderer, SliderRenderer, Device) {
    "use strict";

    /**
     * VizRangeSlider renderer.
     */
    var VizRangeSliderRenderer = Renderer.extend(SliderRenderer);

    VizRangeSliderRenderer.renderHandles = function (oRM, oControl) {
        this.renderHandle(oRM, oControl, {
            id: oControl.getId() + "-handle1",
            position: "start"
        });
        this.renderHandle(oRM, oControl, {
            id: oControl.getId() + "-handle2",
            position: "end"
        });

        // Render tooltips
        this.renderTooltips(oRM, oControl);

        // Render ARIA labels
        oRM.renderControl(oControl._mHandleTooltip.start.label);
        oRM.renderControl(oControl._mHandleTooltip.end.label);
        oRM.renderControl(oControl._oRangeLabel);
    };

    VizRangeSliderRenderer.renderTooltips = function (oRM, oControl) {
        // The tooltips container
        oRM.write("<div");
        oRM.writeAttribute("id", oControl.getId() + "-TooltipsContainer");
        oRM.addClass(SliderRenderer.CSS_CLASS + "TooltipContainer");
        oRM.addStyle("left","0%");
        oRM.addStyle("right","0%");
        oRM.addStyle("min-width", "0%");

        oRM.writeClasses();
        oRM.writeStyles();
        oRM.write(">");

        // The first tooltip
        this.renderTooltip(oRM, oControl, oControl.getInputsAsTooltips(), "Left");

        // The second tooltip
        this.renderTooltip(oRM, oControl, oControl.getInputsAsTooltips(), "Right");

        oRM.write("</div>");
    };

    // override sap.m.rangeSliderRenderer!!
    VizRangeSliderRenderer.renderTooltip = function(oRM, oControl, bInput, sPosition){

            oRM.write("<span");
            oRM.addClass(SliderRenderer.CSS_CLASS + "HandleTooltip");
            if (!oControl.getShowStartEndLabel()) {
                oRM.addStyle("visibility", "hidden");
            }
            oRM.addStyle("width", oControl._iLongestRangeTextWidth + "px");
            oRM.writeAttribute("id", oControl.getId() + "-" + sPosition + "Tooltip");

            oRM.writeClasses();
            oRM.writeStyles();
            oRM.write(">");
            oRM.write("</span>");
    };

    /**
     * Used to render each of the handles of the RangeSlider.
     *
     * @param {sap.ui.core.RenderManager} oRM The RenderManager that can be used for writing to the render output buffer.
     * @param {sap.ui.core.Control} oControl An object representation of the slider that should be rendered.
     * @param {object} mOptions Options used for specificity of the handles
     * @overrige sap.m.rangeSliderRenderer!!
     */
    VizRangeSliderRenderer.renderHandle = function (oRM, oControl, mOptions) {
        var fValue,
            aRange = oControl.getRange(),
            bEnabled = oControl.getEnabled(),
            bRTL = sap.ui.getCore().getConfiguration().getRTL();

        oRM.write("<span");

        if (mOptions && (mOptions.id !== undefined)) {
            oRM.writeAttributeEscaped("id", mOptions.id);
        }
        if (mOptions && (mOptions.position !== undefined)) {
            fValue = aRange[mOptions.position === "start" ? 0 : 1];

            oRM.writeAttribute("data-range-val", mOptions.position);
            oRM.writeAttribute("aria-labelledby", oControl._mHandleTooltip[mOptions.position].label.getId());

            if (oControl.getInputsAsTooltips()) {
                oRM.writeAttribute("aria-controls", oControl._mHandleTooltip[mOptions.position].tooltip.getId());
            }
        }
        if (oControl.getShowHandleTooltip()) {
            this.writeHandleTooltip(oRM, oControl);
        }

        oRM.addClass(SliderRenderer.CSS_CLASS + "Handle");

        //extra classes for VizFrame slider handle
        //for cozy specification

        if ((!Device.system.desktop) && (Device.system.phone || Device.system.tablet)) {
            oRM.addClass('viz-Mobile');
        }
        //for icon
        oRM.addClass('sapUiIcon');
        oRM.addClass('ui5-sap-viz-vizSliderHandle');

        oRM.writeAttribute("data-sap-ui-icon-content", '&#xe1fa');

        //style difference of handles includes border and left&right
        if (mOptions && (mOptions.id !== undefined) && mOptions.id === (oControl.getId() + "-handle1")) {
            oRM.addClass('ui5-sap-viz-vizSliderHandle-left');
            oRM.addStyle(bRTL ? "right" : "left", aRange[0]);
        }
        if (mOptions && (mOptions.id !== undefined) && mOptions.id === (oControl.getId() + "-handle2")) {
            oRM.addClass('ui5-sap-viz-vizSliderHandle-right');
            oRM.addStyle(bRTL ? "right" : "left", aRange[1]);
        }

        this.writeAccessibilityState(oRM, oControl, fValue);
        oRM.writeClasses();
        oRM.writeStyles();

        if (bEnabled) {
            oRM.writeAttribute("tabindex", "0");
        }
        oRM.write("></span>");
    };

    /**
     * Writes the accessibility state to the control.
     * To be overwritten by subclasses.
     * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
     * @param {sap.ui.core.Control} oSlider An object representation of the control that should be rendered.
     * @Param {Float} fValue
     */
    VizRangeSliderRenderer.writeAccessibilityState = function(oRm, oSlider, fValue) {
        oRm.writeAccessibilityState(oSlider, {
            role: "slider",
            orientation: "horizontal",
            valuemin: oSlider.toFixed(oSlider.getMin()),
            valuemax: oSlider.toFixed(oSlider.getMax()),
            valuenow: fValue
        });
    };

    /**
     * Renders the lower range label under the left part of the RangeSlider control.
     *
     * @param {sap.ui.core.RenderManager} oRM The RenderManager that can be used for writing to the render output buffer.
     * @param {sap.ui.core.Control} oControl An object representation of the slider that should be rendered.
     */
    VizRangeSliderRenderer.renderStartLabel = function (oRM, oControl) {
        oRM.write("<div");
        oRM.addClass(SliderRenderer.CSS_CLASS + "RangeLabel");
        oRM.writeClasses();
        oRM.write(">");

        oRM.write(oControl.getMin());

        oRM.write("</div>");
    };

    /**
     * Renders the higher range label under the right part of the RangeSlider control.
     *
     * @param {sap.ui.core.RenderManager} oRM The RenderManager that can be used for writing to the render output buffer.
     * @param {sap.ui.core.Control} oControl An object representation of the slider that should be rendered.
     */
    VizRangeSliderRenderer.renderEndLabel = function (oRM, oControl) {
        oRM.write("<div");
        oRM.addClass(SliderRenderer.CSS_CLASS + "RangeLabel");
        oRM.addStyle("width", oControl._iLongestRangeTextWidth + "px");
        oRM.writeClasses();
        oRM.writeStyles();
        oRM.write(">");

        oRM.write(oControl.getMax());

        oRM.write("</div>");
    };

    /**
     * Renders the label under the RangeSlider control.
     *
     * @param {sap.ui.core.RenderManager} oRM The RenderManager that can be used for writing to the render output buffer.
     * @param {sap.ui.core.Control} oControl An object representation of the slider that should be rendered.
     */
    VizRangeSliderRenderer.renderLabels = function (oRM, oControl) {
        oRM.write("<div");
        oRM.addClass();
        oRM.addClass(SliderRenderer.CSS_CLASS + "Labels");
        oRM.writeClasses();
        oRM.write(">");

        this.renderStartLabel(oRM, oControl);
        this.renderEndLabel(oRM, oControl);

        oRM.write("</div>");
    };

    VizRangeSliderRenderer.renderProgressIndicator = function(oRm, oSlider) {
        var aRange = oSlider.getRange();

        oRm.write("<div");
        oRm.writeAttribute("id", oSlider.getId() + "-progress");
        if (oSlider.getEnabled()) {
            oRm.writeAttribute("tabindex", "0");
        }
        this.addProgressIndicatorClass(oRm, oSlider);
        oRm.addStyle("width", oSlider._sProgressValue);
        oRm.writeClasses();
        oRm.writeStyles();

        oRm.writeAccessibilityState(oSlider, {
            role: "slider",
            orientation: "horizontal",
            valuemin: oSlider.toFixed(oSlider.getMin()),
            valuemax: oSlider.toFixed(oSlider.getMax()),
            valuenow: aRange.join("-"),
            valuetext: oSlider._oResourceBundle.getText('RANGE_SLIDER_RANGE_ANNOUNCEMENT', aRange),
            labelledby: oSlider._oRangeLabel.getId()
        });

        oRm.write('></div>');
    };

    /*
     * @override sap.m.SliderRenderer!!
    */
    VizRangeSliderRenderer.render = function(oRm, oSlider) {
        var bEnabled = oSlider.getEnabled(),
            sTooltip = oSlider.getTooltip_AsString(),
            CSS_CLASS = SliderRenderer.CSS_CLASS;

        oRm.write("<div");
        this.addClass(oRm, oSlider);
        oRm.addClass("ui5-sap-viz-vizRangeSlider");
        if (!bEnabled) {
            oRm.addClass(CSS_CLASS + "Disabled");
        }

        oRm.writeClasses();
        oRm.addStyle("position", "absolute");
        oRm.addStyle("width", oSlider.getWidth());
        oRm.addStyle("height", oSlider.getHeight());
        oRm.addStyle("top", oSlider.getTop());
        oRm.addStyle("left", oSlider.getLeft());
        oRm.writeStyles();
        oRm.writeControlData(oSlider);

        if (sTooltip && oSlider.getShowHandleTooltip()) {
            oRm.writeAttributeEscaped("title", sTooltip);
        }

        oRm.write(">");
        this.renderMock(oRm, oSlider);
        oRm.write('<div');
        oRm.writeAttribute("id", oSlider.getId() + "-inner");
        this.addInnerClass(oRm, oSlider);

        if (!bEnabled) {
            oRm.addClass(CSS_CLASS + "InnerDisabled");
        }

        oRm.writeClasses();
        oRm.writeStyles();
        oRm.write(">");

        if (oSlider.getProgress()) {
            this.renderProgressIndicator(oRm, oSlider);
        }

        this.renderHandles(oRm, oSlider);
        oRm.write("</div>");

        if (oSlider.getEnableTickmarks()) {
            this.renderTickmarks(oRm, oSlider);
        } else {
            // Keep the "old" labels for backwards compatibility
            this.renderLabels(oRm, oSlider);
        }

        if (oSlider.getName()) {
            this.renderInput(oRm, oSlider);
        }

        oRm.write("</div>");
    };

    /*
     * extra functions
    */
     VizRangeSliderRenderer.renderMock = function(oRm, oSlider){
         var aRange = oSlider.getRange();
         var max = oSlider.getMax();
         var min = oSlider.getMin();
         var minRange = Math.min(aRange[0], aRange[1]);
         var maxRange = Math.max(aRange[0], aRange[1]);


         oRm.write("<div");

         oRm.writeAttribute("id", oSlider.getId() + "-leftMock");
         oRm.addClass("ui5-sap-viz-vizSliderMock");
         oRm.addClass("ui5-sap-viz-vizSliderMock-left");
         oRm.writeClasses();
         oRm.addStyle("right", (max - minRange) * 100 / (max - min) + "%" );
         oRm.writeStyles();
         oRm.write('></div>');
         oRm.write("<div");

         oRm.writeAttribute("id", oSlider.getId() + "-rightMock");
         oRm.addClass("ui5-sap-viz-vizSliderMock");
         oRm.addClass("ui5-sap-viz-vizSliderMock-right");
         oRm.writeClasses();
         oRm.addStyle("left", (maxRange - min) * 100 / (max - min) + "%" );
         oRm.writeStyles();
         oRm.write('></div>');
         oRm.write("<div");


         oRm.writeAttribute("id", oSlider.getId() + "-label");
         oRm.addClass('ui5-sap-viz-vizSliderLabel');
         oRm.writeClasses();
         oRm.addStyle("left", (maxRange + minRange) * 50 / (maxRange - minRange) + "%" );
         if (!oSlider.getShowPercentageLabel()) {
             oRm.addStyle("visibility", "hidden");
         }
         oRm.writeStyles();
         oRm.write('>' + (maxRange - minRange) * 100 / (max - min) + '%</div>');
     };
    return VizRangeSliderRenderer;
}, /* bExport= */ true);
