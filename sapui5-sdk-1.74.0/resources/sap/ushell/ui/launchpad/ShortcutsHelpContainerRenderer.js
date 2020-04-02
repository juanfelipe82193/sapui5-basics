/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */
sap.ui.define([],function(){"use strict";var S={};S.render=function(r,c){var C=c.getContent()||[];r.write("<div");r.writeControlData(c);r.addClass("sapUshelShortcutsHelpContainer");r.writeClasses();r.writeAccessibilityState(c,{role:"group"});r.write(">");C.forEach(function(e){var s=e.isA("sap.m.Label")?"sapUshelShortcutsHelpContainerLabel":"sapUshelShortcutsHelpContainerText";r.write("<div");r.addClass(s);r.writeClasses();r.write(">");r.renderControl(e);r.write("</div>");});r.write("</div>");};return S;},true);
