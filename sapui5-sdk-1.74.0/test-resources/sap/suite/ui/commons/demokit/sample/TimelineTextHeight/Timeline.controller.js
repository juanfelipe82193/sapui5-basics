sap.ui.define([ "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel" ],
	function (Controller, JSONModel) {
	"use strict";

	var sText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nmaximus magna eget tempor iaculis. Aliquam erat volutpat. Morbi sodales laoreet augue ac pellentesque. In facilisis at nisl non bibendum. Cras mattis bibendum libero elementum condimentum. Quisque ac finibus elit. Nam molestie eget nisl pulvinar rutrum. Sed in vulputate lorem, convallis sodales quam. Sed condimentum turpis a feugiat commodo. Nulla finibus nec risus non tempus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean ex tortor, viverra sit amet tortor ut, placerat placerat turpis. Vivamus sapien mauris, semper vel ante ut, vestibulum pharetra orci." +
		"Curabitur vulputate nisi vel efficitur dapibus. Cras eleifend eget dui non condimentum. Aliquam sit amet eros mi. Aliquam erat volutpat. Donec rhoncus ante ut mauris tempor, sit amet pharetra urna congue. Morbi semper ullamcorper lectus a fringilla. Curabitur ac mi in risus ultrices malesuada vel quis arcu. Aenean sed nisl et augue consequat commodo. Praesent sapien enim, faucibus eget nisi in, pretium maximus lacus. Duis pulvinar dapibus neque in tristique. Integer ut neque sed enim mollis convallis. Proin nisi dolor, varius a turpis maximus, molestie suscipit enim. Praesent rutrum venenatis facilisis. Vivamus vel quam at erat aliquet ultricies. Ut aliquet semper auctor." +
		"In cursus, lorem eget convallis sodales, ante risus finibus augue, at euismod dui enim at nisl. Donec maximus, ipsum at egestas tempus, nisi urna lacinia leo, at tempor velit magna vel dui. Pellentesque fermentum auctor quam, non vehicula felis elementum nec. Quisque eget libero at dolor tincidunt imperdiet. Praesent mi mi, faucibus a neque sit amet, mollis vulputate est. Vivamus mattis facilisis nisi et tincidunt. Nam bibendum aliquet iaculis. In odio metus, semper ac placerat quis, cursus sed dolor. Mauris scelerisque sem id porta varius. Maecenas odio diam, egestas eget leo eu, sagittis convallis erat. Donec quam metus, interdum sit amet molestie ut, interdum vel arcu. Nullam dolor justo, semper convallis mollis sed, hendrerit id quam. Proin non aliquet tortor, non facilisis nibh. Praesent ut lorem tellus. Donec tincidunt condimentum condimentum. Aenean tempor lacus vel odio ultricies tempus." +
		"Donec eu lorem varius eros suscipit egestas. Etiam vel risus odio. Sed lobortis nisi vitae sodales tempor. Suspendisse ut sapien nec diam maximus convallis. Cras eu nunc aliquam, malesuada quam at, congue purus. Donec nec augue non nisi egestas rutrum id vitae justo. Donec vestibulum venenatis dui ac posuere. Aenean et enim volutpat, dignissim velit eget, tempor mauris. Sed lobortis augue ac purus blandit vestibulum. Maecenas ut bibendum diam. In a placerat nunc, et semper arcu. Quisque sollicitudin, purus sit amet efficitur vestibulum, augue urna tincidunt lectus, vitae pulvinar lorem justo id ex. Vivamus at massa arcu. Proin sapien lorem, ultrices a ullamcorper eu, tincidunt ac mi. Nam eu vulputate dui, id elementum metus. Proin finibus neque nulla, eget mattis nisi rutrum non.";

	return Controller.extend("sap.suite.ui.commons.sample.TimelineTextHeight.Timeline", {
		onInit: function () {
			var aData = {
				Items: []
			};
			var oDate = new Date();
			for (var i = 1; i < 150; i++) {
				aData.Items.push({
					Date: new Date(new Date(oDate).setDate(oDate.getDate() - i)),
					Title: i + "",
					Text: sText.substring(0, Math.random() * 1500),
					UserName: 'User'
				});
			}

			var oModel = new JSONModel(aData);

			oModel.setSizeLimit(150);
			this.getView().setModel(oModel);
			this._timeline = this.byId("idTimeline");
		},
		sliderChanged: function (oEvent) {
			this.byId("idPanel").setHeight(oEvent.getParameter("value") + "px");
		}
	});
});