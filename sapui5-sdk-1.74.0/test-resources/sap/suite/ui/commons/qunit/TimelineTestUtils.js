/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/suite/ui/commons/Timeline",
	"sap/suite/ui/commons/TimelineItem",
	"sap/ui/model/json/JSONModel"
], function (Timeline, TimelineItem, JSONModel) {
	var TestUtils = {};

	TestUtils.buildTimelineWithoutBinding = function (data, timelineOptions) {
		var oTimeline = new Timeline(timelineOptions);

		data.forEach(function (oItem, iIndex) {
			oTimeline.addContent(new TimelineItem(oItem));
		});

		return oTimeline;
	};

	TestUtils.buildTimeline = function (data, timelineOptions, itemTemplate) {
		if (!timelineOptions) {
			timelineOptions = {
				height: "100%",
				showIcons: false
			};
		}
		var bindingPath = null,
			key,
			settings,
			obj,
			properties;
		if (jQuery.isArray(data)) {
			data = {
				Items: data
			};
			bindingPath = "Items";
		} else {
			for (key in data) {
				if (data.hasOwnProperty(key) && jQuery.isArray(data[key])) {
					bindingPath = key;
					break;
				}
			}
			if (!bindingPath) {
				throw new Error("Data do not contain any array timeline can bind to.");
			}
		}
		if (!itemTemplate) {
			if (data[bindingPath].length > 0) {
				obj = data[bindingPath][0];
				settings = {};
				properties = TimelineItem.getMetadata().getAllProperties();
				for (key in properties) {
					if (properties.hasOwnProperty(key) && obj[key]) {
						settings[key] = "{" + key + "}";
					}
				}
				itemTemplate = new TimelineItem(settings);
			} else {
				itemTemplate = new TimelineItem();
			}
		}
		if (!(itemTemplate instanceof TimelineItem)) {
			itemTemplate = new TimelineItem(itemTemplate);
		}
		var model = new JSONModel(data);
		var timeline = new Timeline(timelineOptions);
		timeline.setModel(model);
		timeline.bindAggregation("content", {
			path: "/" + bindingPath,
			template: itemTemplate
		});
		return timeline;
	};

	TestUtils.stringEndsWith = function (sString, sPattern) {
		var iDiff = sString.length - sPattern.length;
		return iDiff >= 0 && sString.lastIndexOf(sPattern) === iDiff;
	};

	return TestUtils;
}, true);
