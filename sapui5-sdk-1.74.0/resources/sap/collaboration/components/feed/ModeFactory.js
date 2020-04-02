/*
* ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
*/
sap.ui.define(["./GroupIDsMode","./BOMode","./UserMode","sap/collaboration/library"],function(G,B,U,l){"use strict";var F=l.FeedType;var M=function(){this._oFeedTypeToModeClass={};this._oFeedTypeToModeClass[F.GroupIds]=G;this._oFeedTypeToModeClass[F.BusinessObjectGroups]=B;this._oFeedTypeToModeClass[F.UserGroups]=U;};M._instance=null;M.getInstance=function(){if(M._instance===null){M._instance=new M();}return M._instance;};M.prototype.createMode=function(f,o){var a=this._oFeedTypeToModeClass[f];if(a===undefined){var e=f+" is not a valid value for the feedSources mode property.\n";e+="It must be equal to the value of either one of the following:\n";e+="sap.collaboration.FeedType.GroupIds\n";e+="sap.collaboration.FeedType.BusinessObjectGroups\n";e+="sap.collaboration.FeedType.UserGroups";o.logError(e);o.byId("timeline").destroy();throw new Error(e);}return new a(o);};return M;},true);
