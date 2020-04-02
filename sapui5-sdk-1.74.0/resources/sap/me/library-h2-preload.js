//@ui5-bundle sap/me/library-h2-preload.js
/*!
 * SAPUI5

        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.predefine('sap/me/library',['sap/ui/core/Core','sap/ui/core/library'],function(C){"use strict";sap.ui.getCore().initLibrary({name:"sap.me",version:"1.74.0",dependencies:["sap.ui.core"],types:["sap.me.CalendarDesign","sap.me.CalendarEventType","sap.me.CalendarSelectionMode"],interfaces:[],controls:["sap.me.Calendar","sap.me.CalendarLegend","sap.me.OverlapCalendar","sap.me.ProgressIndicator","sap.me.TabContainer"],elements:["sap.me.OverlapCalendarEvent"]});sap.me.CalendarDesign={Action:"Action",Approval:"Approval"};sap.me.CalendarEventType={Type00:"Type00",Type01:"Type01",Type04:"Type04",Type06:"Type06",Type07:"Type07",Type10:"Type10"};sap.me.CalendarSelectionMode={SINGLE:"SINGLE",MULTIPLE:"MULTIPLE",RANGE:"RANGE"};return sap.me;},true);
sap.ui.require.preload({
	"sap/me/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"sap.me","type":"library","embeds":[],"applicationVersion":{"version":"1.74.0"},"title":"SAPUI5 library with controls specialized for mobile devices (extension).","description":"SAPUI5 library with controls specialized for mobile devices (extension).","ach":"MOB-UIA-LIB-CC","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":["base","sap_belize","sap_belize_plus","sap_bluecrystal","sap_hcb"]},"sap.ui5":{"dependencies":{"minUI5Version":"1.74","libs":{"sap.ui.core":{"minVersion":"1.74.0"}}},"library":{"i18n":false,"content":{"controls":["sap.me.Calendar","sap.me.CalendarLegend","sap.me.OverlapCalendar","sap.me.ProgressIndicator","sap.me.TabContainer"],"elements":["sap.me.OverlapCalendarEvent"],"types":["sap.me.CalendarDesign","sap.me.CalendarEventType","sap.me.CalendarSelectionMode"],"interfaces":[]}}}}'
},"sap/me/library-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/me/Calendar.js":["sap/base/Log.js","sap/m/library.js","sap/me/CalendarDate.js","sap/me/CalendarRenderer.js","sap/me/library.js","sap/ui/Device.js","sap/ui/core/Control.js","sap/ui/core/Icon.js","sap/ui/core/IconPool.js","sap/ui/core/LocaleData.js","sap/ui/core/date/UniversalDate.js","sap/ui/thirdparty/jquery.js"],
"sap/me/CalendarDate.js":["sap/base/Log.js","sap/ui/base/Object.js","sap/ui/core/date/UniversalDate.js"],
"sap/me/CalendarLegend.js":["sap/m/Label.js","sap/me/CalendarLegendRenderer.js","sap/me/library.js","sap/ui/core/Control.js","sap/ui/core/Icon.js","sap/ui/core/IconPool.js","sap/ui/core/theming/Parameters.js","sap/ui/thirdparty/jquery.js"],
"sap/me/CalendarRenderer.js":["sap/me/CalendarDate.js","sap/ui/core/LocaleData.js","sap/ui/core/date/UniversalDate.js","sap/ui/core/format/DateFormat.js"],
"sap/me/OverlapCalendar.js":["sap/base/Log.js","sap/m/Label.js","sap/me/Calendar.js","sap/me/CalendarDate.js","sap/me/OverlapCalendarRenderer.js","sap/me/library.js","sap/ui/Device.js","sap/ui/core/Control.js","sap/ui/core/date/UniversalDate.js","sap/ui/core/theming/Parameters.js","sap/ui/thirdparty/jquery.js"],
"sap/me/OverlapCalendarEvent.js":["sap/me/library.js","sap/ui/core/Element.js"],
"sap/me/ProgressIndicator.js":["sap/me/ProgressIndicatorRenderer.js","sap/me/library.js","sap/ui/core/Control.js","sap/ui/core/library.js","sap/ui/thirdparty/jquery.js"],
"sap/me/ProgressIndicatorRenderer.js":["sap/base/Log.js","sap/base/security/encodeXML.js","sap/base/util/Version.js"],
"sap/me/TabContainer.js":["sap/m/Label.js","sap/m/ScrollContainer.js","sap/me/TabContainerRenderer.js","sap/me/library.js","sap/ui/core/Control.js","sap/ui/core/Icon.js","sap/ui/core/IconPool.js","sap/ui/core/theming/Parameters.js","sap/ui/thirdparty/jquery.js"],
"sap/me/TabContainerRenderer.js":["sap/base/Log.js","sap/base/util/Version.js"],
"sap/me/library.js":["sap/ui/core/Core.js","sap/ui/core/library.js"]
}});
//# sourceMappingURL=library-h2-preload.js.map