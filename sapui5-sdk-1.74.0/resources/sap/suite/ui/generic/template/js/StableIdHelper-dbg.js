sap.ui.define(["sap/suite/ui/generic/template/lib/StableIdDefinition", 
	"sap/suite/ui/generic/template/js/AnnotationHelper"
], function(StableIdDefinition, AnnotationHelper) {
	"use strict";

	function preparePathForStableId(oContext){
		var aParameter = oContext.getProperty("/stableId/aParameter");
		var oParameter = {  
			buildStableId: function(oInput){
				oParameter.id = getStableId(oInput);
				},
			buildFacetId: function(oFacet){
				// special logic to build id for Facet in the old way
				// preliminary - to be replaced...
				oParameter.id =  AnnotationHelper.getStableIdPartFromFacet(oFacet);
				}
			};
		aParameter.push(oParameter);
		return "/stableId/aParameter/" + (aParameter.length - 1);
	}
	
	function replaceSpecialCharsForLegacyIds(sLegacyId){
		return sLegacyId.replace(/@/g, "").replace(/[\/#]/g, "::");
	}

	function getLegacyStableId(oParameters){
		// optional and mandatory parameters can be treated identical - value function has to differetiate
		if (typeof StableIdDefinition.types[oParameters.type][oParameters.subType].value !== "function"){
			return StableIdDefinition.types[oParameters.type][oParameters.subType].value;
		} else {
			var aMandatoryParameters = StableIdDefinition.types[oParameters.type][oParameters.subType].parameters || [];
			var aOptionalParameters = StableIdDefinition.types[oParameters.type][oParameters.subType].optionalParameters || [];
			var aAllParameters = aMandatoryParameters.concat(aOptionalParameters);
			var oValueFunctionParams = {};
			StableIdDefinition.parameters.forEach(function(sParameter){
				if (aAllParameters.indexOf(sParameter) > -1 ) {
					oValueFunctionParams[sParameter] = oParameters[sParameter];
				}
			});
			return replaceSpecialCharsForLegacyIds(StableIdDefinition.types[oParameters.type][oParameters.subType].value(oValueFunctionParams));
		}
	}
	
	function escapeIdParameter(sParam){
		/* escape all characters not allowed in stable ids with :<hexcode>
		 * as we use : as escape character, also escape :
		 */
		return sParam.replace(/[^A-Za-z0-9_.-]/g, function(c){
			var sCode = c.charCodeAt(0).toString(16);
			return ":" + (sCode.lenght === 1 ? "0" : "") + sCode;
		});
	}
	
	function getStableId(oParameters){
		if (!oParameters.type) {throw "error";}
		if (!oParameters.subType) {throw "error";}
		if (!StableIdDefinition.types[oParameters.type]) {throw "error";}
		if (!StableIdDefinition.types[oParameters.type][oParameters.subType]) {throw "error";}
		// build legacy stable id
		if (StableIdDefinition.types[oParameters.type][oParameters.subType].value){
			return getLegacyStableId(oParameters);
		}
		// build standard stable id
		if (StableIdDefinition.types[oParameters.type][oParameters.subType].parameters){
			StableIdDefinition.types[oParameters.type][oParameters.subType].parameters.forEach(function(sParameter){
				if (!oParameters[sParameter]) {throw "error";} // for standard ids all parameters must be provided
			});
		}
		var sStableId = "template:::" + oParameters.type + ":::" + oParameters.subType;
		// add parameters - order is defined according to oStableIdDefinition.parameters
		var aMandatoryParameters = StableIdDefinition.types[oParameters.type][oParameters.subType].parameters || [];
		var aOptionalParameters = StableIdDefinition.types[oParameters.type][oParameters.subType].optionalParameters || [];
		var aAllParameters = aMandatoryParameters.concat(aOptionalParameters);
		StableIdDefinition.parameters.forEach(function(sParameter){
			if (aAllParameters.indexOf(sParameter) > -1 && oParameters[sParameter]){
				sStableId += ":::" + sParameter + "::" + escapeIdParameter(oParameters[sParameter]);
			}
		});
		return sStableId;
	}
	
	return {
		preparePathForStableId: preparePathForStableId,
		getStableId: getStableId
	};
}, /* bExport= */ true);
