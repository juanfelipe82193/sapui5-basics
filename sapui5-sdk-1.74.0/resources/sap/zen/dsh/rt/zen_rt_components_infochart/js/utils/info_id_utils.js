/*global define */

define("zen.rt.components.infochart/js/utils/info_id_utils", [],
	function(){

	"use strict";

	function InfoIDUtils(){}

	InfoIDUtils.prototype.convertEnumToId = function(enumValue){
        var chartID = enumValue;
        if (chartID.indexOf("INFO_") === 0){
            chartID = chartID.replace("INFO_","INFO/");
        }
        return chartID.toLowerCase();
	};

	/*
	*  IMPORTANT : this conversion code MUST do the reverse the code in ZenResourceSet.java
	*  Please keep them in sync
	*/
	InfoIDUtils.prototype.convertIdToEnum = function(value){
        var chartENUM = value;
        if (chartENUM.indexOf("info/") === 0){
            chartENUM = chartENUM.replace("info/","info_");
        }
        return chartENUM.toUpperCase();
	};

	return InfoIDUtils;
});