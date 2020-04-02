/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/core/Core'],function(C){"use strict";sap.ui.getCore().initLibrary({name:"sap.collaboration",dependencies:["sap.ui.core","sap.suite.ui.commons"],types:["sap.collaboration.AppType","sap.collaboration.DisplayFeedType","sap.collaboration.FeedType"],interfaces:[],controls:[],elements:[],version:"1.74.0"});sap.collaboration.AppType={split:"split",widget:"widget"};sap.collaboration.DisplayFeedType={BusinessRecordFeed:"BusinessRecordFeed",GroupFeedsWhereBusinessRecordIsLinked:"GroupFeedsWhereBusinessRecordIsLinked"};sap.collaboration.FeedType={follows:"follows",company:"company",group:"group",objectGroup:"objectGroup",object:"object",GroupIds:"GroupIds",BusinessObjectGroups:"BusinessObjectGroups",UserGroups:"UserGroups"};return sap.collaboration;});
