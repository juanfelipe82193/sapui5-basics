sap.ui.define([],
	function () {
		"use strict";
		
		var oDataStore = {};
		
		return { 
			 setData: function (name, value) {
				 oDataStore[name] = value;
			 },
			 getData: function (name) {
				 return  oDataStore[name];
			 },
			 clearData: function () {
				 oDataStore = {};
			 }
		}; 
	}
);