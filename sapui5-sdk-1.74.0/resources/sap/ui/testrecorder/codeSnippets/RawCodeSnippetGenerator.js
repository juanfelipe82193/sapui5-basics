/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/testrecorder/codeSnippets/CodeSnippetGenerator"],function(C){"use strict";var R=C.extend("sap.ui.testrecorder.codeSnippets.RawCodeSnippetGenerator",{});R.prototype._generate=function(d){return this._getSelectorAsString(d.controlSelector);};return new R();});
