/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
sap.ui.define(function(){'use strict';var R=function(c,u){this.type='RepresentationInterfaceProxy';this.putMessage=function(m){return c.putMessage(m);};this.createMessageObject=function(C){return c.createMessageObject(C);};this.getActiveStep=function(){return c.getActiveStep();};this.setActiveStep=function(s){return c.setActiveStep(s);};this.getTextNotHtmlEncoded=function(l,p){return c.getTextNotHtmlEncoded(l,p);};this.getExits=function(){return u.getCustomFormatExit();};this.updatePath=function(s){return c.updatePath(s);};this.createFilter=function(){return c.createFilter();};this.selectionChanged=function(r){return u.selectionChanged(r);};this.getEventCallback=function(e){return u.getEventCallback(e);};this.getUiApi=function(){return u;};};return R;},true);
