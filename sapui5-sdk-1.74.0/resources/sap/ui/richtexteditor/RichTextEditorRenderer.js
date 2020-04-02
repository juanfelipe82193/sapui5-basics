/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/core/Renderer'],function(R){"use strict";var a={apiVersion:2};a.render=function(r,o){var t=o.getAggregation("_toolbarWrapper");var c=t&&o._bCustomToolbarRequirementsFullfiled;r.openStart("div",o);if(o.getEditorType()=="TinyMCE4"){r.attr("data-sap-ui-preserve",o.getId());}r.class("sapUiRTE");if(o.getRequired()){r.class("sapUiRTEReq");}if(o.getUseLegacyTheme()){r.class("sapUiRTELegacyTheme");}if(c){r.class("sapUiRTEWithCustomToolbar");}r.style("width",o.getWidth());r.style("height",o.getHeight());if(o.getTooltip_AsString()){r.attr("title",o.getTooltip_AsString());}r.openEnd();if(c){t.addStyleClass("sapUiRTECustomToolbar");r.renderControl(t);}var s="render"+o.getEditorType()+"Editor";if(this[s]&&typeof this[s]==="function"){this[s].call(this,r,o);}r.close("div");};return a;},true);
