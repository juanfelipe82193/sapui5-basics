/* eslint-disable */
function setBackgroundColor(oAnyObject) {
	var oColors = {
		white: "#FFFFFF",
		black: "#000000",
		blue: "#6666FF",
		red: "#FF6666",
		green: "#66FF66"
	};
	var sParam = jQuery.sap.getUriParameters().get("sap-ui-suite-background-color");
	if (sParam) {
		var sColor = oColors[sParam.toLowerCase()];

		if (sColor) {
			oAnyObject.addDelegate({
				onAfterRendering: function() {
					oAnyObject.$().css("background-color", sColor);
				}
			});
		}
	}
}