/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./AnimationTrackValueType"],function(A){"use strict";var a={};a.get=function(v){switch(v){case A.Vector3:return 3;case A.AngleAxis:return 4;case A.Quaternion:return 4;case A.Euler:return 4;default:return 1;}};return a;},true);
