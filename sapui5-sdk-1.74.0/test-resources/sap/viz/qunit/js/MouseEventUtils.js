sap.ui.define([
], function() {

function simulateMouseEvent(type, pageX, pageY) {
	this.type = type;
	this.pageX = pageX;
	this.pageY = pageY;
}

var mouseEvent = {

	mouseHandler: function(element, event, ctrl, wheelDelta) {

		var clickEvt = document.createEvent('MouseEvents');
		clickEvt.initMouseEvent(event.type, true, true, window, 0, 0, 0, event.pageX, event.pageY, ctrl, false, false, false, 0, null);
		clickEvt.wheelDelta = wheelDelta;
		element.dispatchEvent(clickEvt);
	},

	simulateMouseWheel: function(element, x, y, wheelDelta) {
		if (element === undefined) {
			throw new Error("The element for simulateMouseClick is undefined");
		}
		if (x === undefined) {
			x = 0;
		}
		if (y === undefined) {
			y = 0;
		}
		var event = new simulateMouseEvent("mousewheel", x, y);
		this.mouseHandler(element, event, false, wheelDelta);
	},

	simulateMouseClick: function(element, x, y) {
		if (element === undefined) {
			throw new Error("The element for simulateMouseClick is undefined");
		}
		if (x === undefined) {
			x = 0;
		}
		if (y === undefined) {
			y = 0;
		}
		var event = new simulateMouseEvent("click", x, y);
		this.mouseHandler(element, event);
	},

	simulateMouseUp: function(element, x, y, ctrl) {
		if (element === undefined) {
			throw new Error("The element for simulateMouseUp is undefined");
		}
		if (x === undefined) {
			x = 0;
		}
		if (y === undefined) {
			y = 0;
		}
		var event = new simulateMouseEvent("mouseup", x, y);
		this.mouseHandler(element, event, ctrl);
	},

	simulateMouseDown: function(element, x, y, ctrl) {
		if (element === undefined) {
			throw new Error("The element for simulateMouseDown is undefined");
		}
		if (x === undefined) {
			x = 0;
		}
		if (y === undefined) {
			y = 0;
		}
		var event = new simulateMouseEvent("mousedown", x, y);
		this.mouseHandler(element, event, ctrl);
	},

	simulateMouseOver: function(element, x, y) {
		if (element === undefined) {
			throw new Error("The element for simulateMouseOver is undefined");
		}
		if (x === undefined) {
			x = 0;
		}
		if (y === undefined) {
			y = 0;
		}
		var event = new simulateMouseEvent("mouseover", x, y);
		this.mouseHandler(element, event);
	},

	simulateMouseMove: function(element, x, y) {
		if (element === undefined) {
			throw new Error("The element for simulateMouseMove is undefined");
		}
		if (x === undefined) {
			x = 0;
		}
		if (y === undefined) {
			y = 0;
		}
		var event = new simulateMouseEvent("mousemove", x, y);
		this.mouseHandler(element, event);
	},

	simulateMouseOut: function(element, x, y) {
		if (element === undefined) {
			throw new Error("The element for simulateMouseOut is undefined");
		}
		if (x === undefined) {
			x = 0;
		}
		if (y === undefined) {
			y = 0;
		}
		var event = new simulateMouseEvent("mouseout", x, y);
		this.mouseHandler(element, event);
	},

	simulateLasso: function(element, startX, startY, endX, endY) {
		if (element === undefined) {
			throw new Error("The element for simulateLasso is undefined");
		}
		if (startX === undefined) {
			startX = 0;
		}
		if (startY === undefined) {
			startY = 0;
		}
		if (endX === undefined) {
			endX = 0;
		}
		if (endY === undefined) {
			endY = 0;
		}
		var lassoEvent = new simulateMouseEvent("mousedown", startX, startY);
		this.mouseHandler(element, lassoEvent);

		lassoEvent = new simulateMouseEvent("mousemove", endX, endY);
		this.mouseHandler(element, lassoEvent);

		lassoEvent = new simulateMouseEvent("mouseup", endX, endY);
		this.mouseHandler(element, lassoEvent);
	}

}

	return mouseEvent;

});
