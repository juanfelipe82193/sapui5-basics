sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/odata/_ODataMetaModelUtils"

], function(
	BaseObject,
	MetaModelUtils
) {
	"use strict";

	var Helper = BaseObject.extend("test.sap.ui.comp.smartfield.QUnitHelper", {});

	Helper.liftSchema = function(oSchema,oMetaModel) {
		MetaModelUtils.merge({}, oSchema, oMetaModel);
	};

	Helper.liftV4Annotations = function(oMetaData) {

		if (oMetaData.entitySet) {
			Helper.liftSet(oMetaData.entitySet);
		}

		if (oMetaData.property && oMetaData.property.property) {
			Helper.liftProperty(oMetaData.property.property);
		}
	};

	Helper.liftProperty = function(oProperty) {
		MetaModelUtils.liftSAPData(oProperty, "Property");
	};

	Helper.liftSet = function(oSet) {
		MetaModelUtils.liftSAPData(oSet, "EntitySet");
	};

	Helper.addSAPAnnotation = function(oNode, sAnnotation, vValue) {
		oNode["sap:" + sAnnotation] = vValue;

		oNode.extensions = oNode.extensions || [];

		var bExists = false;

		// add also the extension
		for (var i = 0; i < oNode.extensions.length; i++) {
			if (oNode.extensions[i].name == sAnnotation) {
				oNode.extensions[i].value = vValue;
				bExists = true;
				break;
			}
		}

		if (!bExists) {
			oNode.extensions.push({
				"name": sAnnotation,
				"value": vValue,
				"namespace": "http://www.sap.com/Protocols/SAPData"
			});
		}
	};

	Helper.removeSAPAnnotation = function(oNode, sAnnotation) {
		delete oNode["sap:" + sAnnotation];

		if (!oNode.extensions) {
			return;
		}

		// add also the extension
		for (var i = 0; i < oNode.extensions.length; i++) {
			if (oNode.extensions[i].name == sAnnotation) {
				oNode.extensions[i].value = undefined;
				return;
			}
		}
	};


	return Helper;

});
