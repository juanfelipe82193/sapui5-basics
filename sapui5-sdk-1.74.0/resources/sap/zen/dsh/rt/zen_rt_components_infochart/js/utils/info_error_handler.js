/* global sap, _, define*/

define("zen.rt.components.infochart/js/utils/info_error_handler", 
		[], 
		function(){

	"use strict";

	var INFO_LEVEL = "info",
		WARN_LEVEL = "warn",
		ERROR_LEVEL = "error",
		LEVELS = [INFO_LEVEL, WARN_LEVEL, ERROR_LEVEL],
		global = window; // FIXME

	/**
	 * Constructor
	 * @param control The control on which the errors are displayed.
	 * @param errorLookup Object to lookup error information based on
	 * a key.
	 */
	function ControlErrorHandler(control, errorLookup, isDesignTime) {
		this.control = control;
		this.errorLookup = errorLookup;
		this.isDesignTime = isDesignTime;
	}

	/**
	 * Renders the given error. If e is not present then the error
	 * that was set for this handler is rendered.
	 * @param e The error to render
	 * @return true if an error was rendered
	 *
	 */
	ControlErrorHandler.prototype.renderError = function(e) {
		this.control.fireChartError({newValue: e.message ? e.message : e});
		var errorInfo = this.errorLookup.get(e);
		logError(e, errorInfo);

		if (errorInfo) {
			displayError(this.control, errorInfo, this.isDesignTime);
		}
		return !!errorInfo;
	};

	ControlErrorHandler.prototype.checkError = function() {
		if(this._error) {
			throw this._error;
		}
	};

	ControlErrorHandler.prototype.setError = function(e) {
		var errorInfo = this.errorLookup.get(e);
		logError(e, errorInfo);
		this._errorInfo = errorInfo;
		this._error = e;
	};

	ControlErrorHandler.prototype.clearError = function() {
		this._errorInfo = undefined;
		this._error = undefined;
	};

	function logError(e, errorInfo) {
		// TODO better logging
		if (global.console) {
			global.console.log(errorInfo, e);
			if (e instanceof Error){
				global.console.log(e.stack);
			}
		}
	}

	function displayError(control, errorInfo, isDesignTime) {
		var showLoadingStateIcon = false,
			$controlDiv = control.getControlDiv();

		removeMessageState($controlDiv);
		setMessageState($controlDiv, errorInfo.level);
		setMessage($controlDiv, errorInfo.title);
		// The message overlay may be invoked again by the dispatcher
		control.showLoadingStateText = errorInfo.title;
		control.showLoadingState = true;
		control.setEmptyBackground();

		control.showLoadingState = true;
		sap.zen.Dispatcher.instance.addMessageOverlay(control, control.showLoadingStateText,
			showLoadingStateIcon, true);

		// This is used by code in the dispatcher.
		control.oldAfterRenderingForDispatching = control.oldAfterRenderingForDispatching || control.onAfterRendering;
		if (!isDesignTime) {
			popupMessage(errorInfo);
		}
	}

	function removeMessageState($container) {
		_.forEach(LEVELS, function(level) {
			$container.removeClass("state-" + level);
		});
	}

	function setMessageState($container, state) {
		$container.addClass("ghost");
		$container.addClass("state-" + state);
	}

	function setMessage($controlDiv, message) {
		var $parent = $controlDiv.parent();
		// Append the text message
		$parent.find(".infoMessagePanel").remove();
		$parent.append(
			$("<div/>")
				.addClass("infoMessagePanel")
				.addClass("componentLoadingStateMessage") // Same as dispathcer
				.attr("title", message)
				.text(message)
		);

		// Append the error icon
		$parent.find(".infoErrorIcon").remove();
		$parent.append(
			$("<div/>")
				.addClass("infoErrorIcon")
				.addClass("componentLoadingStateBox")
				.addClass("zenLoadingStateOpacity75")
				.addClass("componentLoadingStateBoxNoIcon")
		);
	}

	function popupMessage(errorInfo) {
		var messageViewLevel = sap.zen.MessageViewHandler.error;
		if (errorInfo.level === INFO_LEVEL) {
			messageViewLevel = sap.zen.MessageViewHandler.info;
		} else if (errorInfo.level === WARN_LEVEL) {
			messageViewLevel = sap.zen.MessageViewHandler.warning;
		}
		// only show if there is a description
		if (errorInfo.description) {
			sap.zen.MessageViewHandler.createMessage(messageViewLevel, errorInfo.title, errorInfo.description, true);
		}
	}

	return ControlErrorHandler;
});