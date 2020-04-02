/*
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/comp/smartfield/type/TextArrangement",
	"sap/ui/comp/smartfield/type/Guid",
	"sap/ui/model/ValidateException",
	"sap/base/assert"
], function(
	TextArrangementType,
	GuidType,
	ValidateException,
	assert
) {
	"use strict";

	var TextArrangementGuid = TextArrangementType.extend("sap.ui.comp.smartfield.type.TextArrangementGuid");

	TextArrangementGuid.prototype.parseDescriptionOnly = function(vValue, sSourceType, aCurrentValues, oFormatOptions, oSettings) {
		var vParsedValue = GuidType.prototype.parseValue.call(this, vValue, sSourceType);

		if (isGuid(vParsedValue)) {

			return new Promise(function(fnResolve, fnReject) {

				function handleSuccess(aData) {

					if (aData.length === 1) {
						this.sDescription = aData[0][oSettings.descriptionField];
						fnResolve([vParsedValue, undefined]);
						return;
					}

					if (aData.length === 0) {
						fnReject(new ValidateException(this.getResourceBundleText("SMARTFIELD_NOT_FOUND")));
						return;
					}

					assert(false, "Duplicate GUID. - " + this.getName());
				}

				function handleException() {
					fnReject(new ValidateException());
				}

				var oOnBeforeValidateValueSettings = {
					filterFields: this.getFilterFields(vParsedValue),
					success: handleSuccess.bind(this),
					error: handleException
				};

				this.onBeforeValidateValue(vParsedValue, oOnBeforeValidateValueSettings);
			}.bind(this));
		} else {
			vValue = vValue.trim();
			return TextArrangementType.prototype.parseDescriptionOnly.call(this, vValue, sSourceType, aCurrentValues, oFormatOptions, oSettings);
		}
	};

	TextArrangementGuid.prototype.getFilterFields = function(vValue) {

		if (this.oFormatOptions.textArrangement === "descriptionOnly") {

			if (isGuid(vValue)) {
				return ["keyField"];
			}

			return ["descriptionField"];
		}

		return ["keyField", "descriptionField"];
	};

	TextArrangementGuid.prototype.getName = function() {
		return "sap.ui.comp.smartfield.type.TextArrangementGuid";
	};

	TextArrangementGuid.prototype.getPrimaryType = function() {
		return GuidType;
	};

	function isGuid(vValue) {
		var rGuid = /^[A-F0-9]{8}-([A-F0-9]{4}-){3}[A-F0-9]{12}$/i;
		return rGuid.test(vValue);
	}

	return TextArrangementGuid;
});
