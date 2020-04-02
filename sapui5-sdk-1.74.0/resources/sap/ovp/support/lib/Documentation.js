/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/m/library"],function(l){"use strict";var E="https://ui5.sap.com/";var a="03265b0408e2432c9571d6b3feb6b1fd";function g(){var u=sap.ui.getVersionInfo().version;if(u.indexOf("-SNAPSHOT")!==-1){return E+"#/topic/"+a;}else{return E+u+"/#/topic/"+a;}}function o(){l.URLHelper.redirect(g(),true);}return{getDocuURL:g,openDocumentation:o};});
