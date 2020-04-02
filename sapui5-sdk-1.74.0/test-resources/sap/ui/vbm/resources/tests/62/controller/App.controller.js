
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("vbm-regression.tests.62.controller.App", {

		get: function(id) {
			return this.getView().byId(id);
		},

		update: function() {
			this.get("input-1").setValue(this.eventsDelay);
			this.get("button-1").setText(this.listenersAttached ? "Detach Listeners" : "Attach Listeners");
			this.get("button-2").setText(this.useDefaultActions ? "Disable Default Actions" : "Enable Default Actions");
			this.get("button-3").setText(this.repeatsEnabled ? "Disable Repeats" : "Enable Repeats");
		},
		
		message: function (event, action) {
			var key = event.getParameter( "key" );
			var code =	event.getParameter( "code" );
			var shift = event.getParameter( "shift" );
			var ctrl =	event.getParameter( "ctrl" );
			var alt =	event.getParameter( "alt" );
			var meta = event.getParameter( "meta" );

			var output = this.get("input-2");
			output.setValue(output.getValue() + (new Date(Date.now()).toTimeString().slice(0,8)) + " " + action +" (key: "+ key +", code: "+ code +", shift: "+ shift +", ctrl: " + ctrl + ", alt: "+ alt + ", meta: "+ meta + ")\n");
		},
		
		onInit: function() {
			this.eventsDelay = 250;
			this.repeatsEnabled = true;
			this.useDefaultActions = true;
			this.listenersAttached = false;
			
			var map = this.get("map");
			map.setMapConfiguration(GLOBAL_MAP_CONFIG);
			map.setKeyEventDelay(this.eventsDelay);
			
			this.update();
		},
	
		onKeyDown: function (event) {
			this.message(event, "Down");

			if(!this.useDefaultActions) {
				event.preventDefault();
			}
		},

		onKeyUp: function (event) {
			this.message(event, "Up");
		},

     	onKeyPress: function (event) {
			this.message(event, "Press");
		},

		onClearEvents: function() {
			this.get("input-2").setValue("");
		},

		onChangeRepeats: function() {
			this.repeatsEnabled = !this.repeatsEnabled;
			this.get("map").setAllowKeyEventRepeat(this.repeatsEnabled);
			this.update();
		},

		onChangeDefaultActions: function() {
			this.useDefaultActions = !this.useDefaultActions;
			this.update();
		},

		onChangeListeners: function() {
			var map = this.get("map");
			
			if (this.listenersAttached) {
				map.detachKeyDown(this.onKeyDown, this);
				map.detachKeyPress(this.onKeyPress, this);
				map.detachKeyUp(this.onKeyUp, this);
			} else {
				map.attachKeyDown(this.onKeyDown, this);
				map.attachKeyPress(this.onKeyPress, this);
				map.attachKeyUp(this.onKeyUp, this);
			}
			this.listenersAttached = !this.listenersAttached;
			this.update();
		},

		onChangeDelay: function(e) {
			this.eventsDelay = parseInt(this.get("input-1").getValue());

			if (!isNaN(this.eventsDelay)) {
				this.get("map").setKeyEventDelay(this.eventsDelay);
			}
			this.update();
		}
	});
});


