/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Locale",'sap/base/util/isPlainObject'],function(L,i){"use strict";var U={};U.processFormatArguments=function(f,l){var F=i(f)?f:{},o=typeof f==="string"?new L(f):(l&&new L(l));return{formatOptions:F,locale:o};};return U;});
