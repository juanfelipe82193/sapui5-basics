/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/testrecorder/codeSnippets/CodeSnippetGenerator"
], function (CodeSnippetGenerator) {
	"use strict";

	/**
	 * @class  generates a common code snippet relevant to most supported frameworks
	 */
	var RawCodeSnippetGenerator = CodeSnippetGenerator.extend("sap.ui.testrecorder.codeSnippets.RawCodeSnippetGenerator", {});

	/**
	 * @param {object} mData data from which to generate a snippet
	 * @param {string} mData.controlSelector control selector in string format
	 * @param {string} mData.action name of the action to record for the control
	 * @returns {string} a stringified code snippet
	 */
	RawCodeSnippetGenerator.prototype._generate = function (mData) {
		return this._getSelectorAsString(mData.controlSelector);
	};

	return new RawCodeSnippetGenerator();
});
