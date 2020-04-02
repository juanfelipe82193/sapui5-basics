/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";return{getTransformedExcludeOperation:function(o){var t={"EQ":"NE","GE":"LT","LT":"GE","LE":"GT","GT":"LE","BT":"NB","Contains":"NotContains","StartsWith":"NotStartsWith","EndsWith":"NotEndsWith"}[o];return t?t:o;}};});
