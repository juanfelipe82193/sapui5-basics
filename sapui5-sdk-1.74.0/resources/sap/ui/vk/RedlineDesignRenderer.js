/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./RedlineSurfaceRenderer","sap/ui/core/Renderer"],function(R,a){"use strict";var b=a.extend(R);b.render=function(r,c){R.render.call(this,r,c);};b.renderAfterRedlineElements=function(r,c){if(c._activeElementInstance&&c._getIsDrawingOn()){c._activeElementInstance.render(r);}};return b;},true);
