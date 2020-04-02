sap.ui.define([ "jquery.sap.global", "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
	function (jQuery, Controller, JSONModel) {
	"use strict";

	var sText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque maximus magna eget tempor iaculis. Aliquam erat volutpat. Morbi sodales laoreet augue ac pellentesque. In facilisis at nisl non bibendum. Cras mattis bibendum libero elementum condimentum. Quisque ac finibus elit. Nam molestie eget nisl pulvinar rutrum. Sed in vulputate lorem, convallis sodales quam. Sed condimentum turpis a feugiat commodo. Nulla finibus nec risus non tempus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean ex tortor, viverra sit amet tortor ut, placerat placerat turpis. Vivamus sapien mauris, semper vel ante ut, vestibulum pharetra orci.\n" +
		"Curabitur vulputate nisi vel efficitur dapibus. Cras eleifend eget dui non condimentum. Aliquam sit amet eros mi. Aliquam erat volutpat. Donec rhoncus ante ut mauris tempor, sit amet pharetra urna congue. Morbi semper ullamcorper lectus a fringilla. Curabitur ac mi in risus ultrices malesuada vel quis arcu. Aenean sed nisl et augue consequat commodo. Praesent sapien enim, faucibus eget nisi in, pretium maximus lacus. Duis pulvinar dapibus neque in tristique. Integer ut neque sed enim mollis convallis. Proin nisi dolor, varius a turpis maximus, molestie suscipit enim. Praesent rutrum venenatis facilisis. Vivamus vel quam at erat aliquet ultricies. Ut aliquet semper auctor.\n" +
		"In cursus, lorem eget convallis sodales, ante risus finibus augue, at euismod dui enim at nisl. Donec maximus, ipsum at egestas tempus, nisi urna lacinia leo, at tempor velit magna vel dui. Pellentesque fermentum auctor quam, non vehicula felis elementum nec. Quisque eget libero at dolor tincidunt imperdiet. Praesent mi mi, faucibus a neque sit amet, mollis vulputate est. Vivamus mattis facilisis nisi et tincidunt. Nam bibendum aliquet iaculis. In odio metus, semper ac placerat quis, cursus sed dolor. Mauris scelerisque sem id porta varius. Maecenas odio diam, egestas eget leo eu, sagittis convallis erat. Donec quam metus, interdum sit amet molestie ut, interdum vel arcu. Nullam dolor justo, semper convallis mollis sed, hendrerit id quam. Proin non aliquet tortor, non facilisis nibh. Praesent ut lorem tellus. Donec tincidunt condimentum condimentum. Aenean tempor lacus vel odio ultricies tempus.\n" +
		"Donec eu lorem varius eros suscipit egestas. Etiam vel risus odio. Sed lobortis nisi vitae sodales tempor. Suspendisse ut sapien nec diam maximus convallis. Cras eu nunc aliquam, malesuada quam at, congue purus. Donec nec augue non nisi egestas rutrum id vitae justo. Donec vestibulum venenatis dui ac posuere. Aenean et enim volutpat, dignissim velit eget, tempor mauris. Sed lobortis augue ac purus blandit vestibulum. Maecenas ut bibendum diam. In a placerat nunc, et semper arcu. Quisque sollicitudin, purus sit amet efficitur vestibulum, augue urna tincidunt lectus, vitae pulvinar lorem justo id ex. Vivamus at massa arcu. Proin sapien lorem, ultrices a ullamcorper eu, tincidunt ac mi. Nam eu vulputate dui, id elementum metus. Proin finibus neque nulla, eget mattis nisi rutrum non.";

	return Controller.extend("sap.suite.ui.commons.sample.TimelineScrolling.Timeline", {
		onInit: function () {
			var aData = {
				Items: []
			};
			var oDate = new Date();
			for (var i = 1; i < 150; i++) {
				aData.Items.push({
					Date: new Date(new Date(oDate).setDate(oDate.getDate() - i)),
					Title: i + "",
					Text: sText.substring(0, Math.random() * 700),
					UserName: 'User'
				});
			}

			var oModel = new JSONModel(aData);

			oModel.setSizeLimit(150);
			this.getView().setModel(oModel);
			this._timeline = this.byId("idTimeline");
			this._timeline.setCustomMessage("Lazy Loading \u2013 The timeline loads new entries automatically, as the user scrolls along the axis. " +
				"This feature works only when the 'EnableScroll' property is set to 'true'.");
		},
		onLazyLoadingSelected: function (oEvent) {
			var bSelected = oEvent.getParameter("selected");
			this._timeline.setLazyLoading(bSelected);
			this._setMessage();

			this._bindTimelineAggregation();
		},
		onNoPagingPress: function (oEvent) {
			this._timeline.setGrowingThreshold(0);
			this._timeline.setLazyLoading(false);

			this.byId("idLazyLoading").setSelected(false);
			this.byId("idGrowing").setSelected(false);

			this._setMessage();
			this._bindTimelineAggregation();
		},
		onGrowingSelected: function (oEvent) {
			var bSelected = oEvent.getParameter("selected");
			var iThreshold = bSelected ? 10 : 0;

			this._timeline.setGrowingThreshold(iThreshold);
			this._setMessage();
			this._bindTimelineAggregation();
		},
		orientationChanged: function (oEvent) {
			var sKey = oEvent.getParameter("selectedItem").getProperty("key");
			this._timeline.setAxisOrientation(sKey);
		},
		onScrollbarSelected: function (oEvent) {
			var bSelected = oEvent.getParameter("selected");
			this._timeline.setEnableScroll(bSelected);
			this._setMessage();

			// in production you would probably want to use something like ScrollContainer
			// but for demo purpose we want to keep it simple
			// this allows scrolling for horizontal mode without EnableScrollbar ON
			jQuery("section").css("overflow-x", "auto");
			this._bindTimelineAggregation();
		},
		_setMessage: function () {
			if (!this._timeline.getLazyLoading() && !this._timelineHasGrowing()) {
				this._timeline.setCustomMessage("Both 'lazy loading' and 'growing' is turned off. All items are loaded and displayed");
				return;
			}

			if (this._timeline.getLazyLoading() && this._timelineHasGrowing()) {
				if (!this._timeline.getEnableScroll()) {
					this._timeline.setCustomMessage("EnableScroll is OFF - 'Lazy loading' can't be used so 'growing' threshold is appllied.");
				} else {
					this._timeline.setCustomMessage("EnableScroll is ON - Both 'lazy loading' and 'growing' can be used, but 'lazy loading' has priority.'");
				}
				return;
			}

			if (!this._timeline.getEnableScroll()) {
				if (this._timeline.getLazyLoading()) {
					this._timeline.setCustomMessage("EnableScroll is OFF - lazy loading can't be applied.");
				} else if (this._timelineHasGrowing()) {
					this._timeline.setCustomMessage("EnableScroll is OFF but growing still works.");
				}
			} else {
				this._timeline.setCustomMessage("EnableScroll is ON - both lazy loading and growing can be used (depends on settings).");
			}
		},
		_bindTimelineAggregation: function () {
			this._timeline.bindAggregation("content", {
				path: "/Items",
				template: this.byId("idTemplateItem").clone()
			});
		},
		_timelineHasGrowing: function () {
			return this._timeline.getGrowingThreshold() !== 0;
		}
	});
});