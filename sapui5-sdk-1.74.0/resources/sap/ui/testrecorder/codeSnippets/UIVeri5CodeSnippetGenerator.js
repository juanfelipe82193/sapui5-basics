/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/testrecorder/codeSnippets/CodeSnippetGenerator","sap/ui/testrecorder/interaction/Commands"],function(C,a){"use strict";var U=C.extend("sap.ui.testrecorder.codeSnippets.UIVeri5CodeSnippetGenerator",{});U.prototype._generate=function(d){var e="element(by.control("+this._getSelectorAsString(d.controlSelector)+"))";var s=e+this._getActionAsString(d.action)+";";return s;};U.prototype._getActionAsString=function(A){switch(A){case a.PRESS:return".click()";case a.ENTER_TEXT:return'.sendKeys("test")';default:return"";}};return new U();});
