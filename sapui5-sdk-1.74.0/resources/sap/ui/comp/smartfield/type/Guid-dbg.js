/*
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/model/odata/type/Guid"
], function(GuidBase) {
	"use strict";

	var Guid = GuidBase.extend("sap.ui.comp.smartfield.type.Guid", {
		constructor: function(oFormatOptions, oConstraints) {
			GuidBase.apply(this, arguments);
			this.oFieldControl = null;
		}
	});

	Guid.prototype.parseValue = function(sValue, sSourceType) {
		sValue = GuidBase.prototype.parseValue.apply(this, arguments);

		if (typeof this.oFieldControl === "function") {
			this.oFieldControl(sValue, sSourceType);
		}

		return sValue;
	};

	Guid.prototype.destroy = function() {
		GuidBase.prototype.destroy.apply(this, arguments);
		this.oFieldControl = null;
	};

	Guid.prototype.getName = function() {
		return "sap.ui.comp.smartfield.type.Guid";
	};

	return Guid;
});
