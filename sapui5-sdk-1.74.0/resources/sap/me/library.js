/*!
 * SAPUI5

        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(['sap/ui/core/Core','sap/ui/core/library'],function(C){"use strict";sap.ui.getCore().initLibrary({name:"sap.me",version:"1.74.0",dependencies:["sap.ui.core"],types:["sap.me.CalendarDesign","sap.me.CalendarEventType","sap.me.CalendarSelectionMode"],interfaces:[],controls:["sap.me.Calendar","sap.me.CalendarLegend","sap.me.OverlapCalendar","sap.me.ProgressIndicator","sap.me.TabContainer"],elements:["sap.me.OverlapCalendarEvent"]});sap.me.CalendarDesign={Action:"Action",Approval:"Approval"};sap.me.CalendarEventType={Type00:"Type00",Type01:"Type01",Type04:"Type04",Type06:"Type06",Type07:"Type07",Type10:"Type10"};sap.me.CalendarSelectionMode={SINGLE:"SINGLE",MULTIPLE:"MULTIPLE",RANGE:"RANGE"};return sap.me;},true);
