/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/m/Slider","./AnimationTimeSliderRenderer"],function(S,A){"use strict";var a=S.extend("sap.ui.vk.AnimationTimeSlider",{metadata:{library:"sap.ui.vk"}});a.prototype.init=function(){if(S.prototype.init){S.prototype.init.call(this);}};a.prototype.handleAnimationStarted=function(e){this.setProgress(true);this.setValue(0);this.setStep(0.1);};a.prototype.handleAnimationUpdated=function(e){var v=e.getParameter("value");this.setValue(v);};a.prototype.handleAnimationFinished=function(e){this.setValue(100);};return a;});
