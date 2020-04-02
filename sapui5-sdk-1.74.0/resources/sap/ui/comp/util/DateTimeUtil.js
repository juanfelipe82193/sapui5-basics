/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";var D={localToUtc:function(d){return new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),d.getSeconds(),d.getMilliseconds()));},utcToLocal:function(d){return new Date(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate(),d.getUTCHours(),d.getUTCMinutes(),d.getUTCSeconds(),d.getUTCMilliseconds());},dateToEdmTime:function(d){return{__edmType:"Edm.Time",ms:d.valueOf()};},edmTimeToDate:function(t){return new Date(t.ms);},adaptPrecision:function(d,p){var m=d.getMilliseconds(),r;if(isNaN(p)||p>=3||m===0){return d;}if(p===0){m=0;}else if(p===1){m=Math.floor(m/100)*100;}else if(p===2){m=Math.floor(m/10)*10;}r=new Date(d);r.setMilliseconds(m);return r;},isDate:function(d,u){if(u){return d.getUTCHours()===0&&d.getUTCMinutes()===0&&d.getUTCSeconds()===0&&d.getUTCMilliseconds()===0;}else{return d.getHours()===0&&d.getMinutes()===0&&d.getSeconds()===0&&d.getMilliseconds()===0;}},normalizeDate:function(d,u){var r;if(this.isDate(d,u)){return d;}r=new Date(d);if(u){r.setUTCHours(0,0,0,0);}else{r.setHours(0,0,0,0);}return r;}};return D;});
