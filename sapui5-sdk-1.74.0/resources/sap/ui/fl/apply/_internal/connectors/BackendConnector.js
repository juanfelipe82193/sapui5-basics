/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/merge","sap/ui/fl/apply/connectors/BaseConnector","sap/ui/fl/apply/_internal/connectors/Utils","sap/base/util/restricted/_pick"],function(m,B,A,_){"use strict";var a=m({},B,{xsrfToken:undefined,settings:undefined,loadFlexData:function(p){var P=_(p,["appVersion"]);if(p.draftLayer){P.draft=true;}var d=A.getUrl(this.ROUTES.DATA,p,P);return A.sendRequest(d,"GET",{xsrfToken:this.xsrfToken}).then(function(r){var R=r.response;if(r.xsrfToken){this.xsrfToken=r.xsrfToken;}R.changes=R.changes.concat(R.compVariants||[]);if(R.settings){this.settings=R.settings;}return R;}.bind(this));}});return a;},true);
