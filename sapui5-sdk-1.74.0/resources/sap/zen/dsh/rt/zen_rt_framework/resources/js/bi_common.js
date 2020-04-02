if (!window.sap) {
	window.sap = {};
}

if (!sap.zen) {
	sap.zen = {};
}

sap.zen.createStaticMimeUrl = function(path) {
	if(path.indexOf("/") !== 0) {
		path = "/" + path;
	}
	return sapbi_page.staticMimeUrlPrefix + path; 
};

sap.zen.createStaticSdkMimeUrl = function(sdkExtensionId, path) {
	return "zen/mimes/sdk_include/" + sdkExtensionId + "/" + path;
};

var sapbi_keyCode = "";
var sapbi_radioButtons = null;

sap.zen.launch = function (config) {
	$(window).unload(function() {
		$.ajax({
			type: "POST",
			url: config.urlPrefix,
			data: {"sap-sessioncmd": "USR_ABORT", "sap-ext-sid": config.esid},
			dataType: "json",
			async: false,
	    });
	});
	
	sapbi_page.initializePage();
	var requestHandler = sapbi_createAjaxHandler(window);
	var commandSequence = new sapbi_CommandSequence();
	commandSequence.addParameter(new sapbi_Parameter("ZEN_1STCALL", "X"));
	var additionalParameters = config.urlParameters + "&sap-ext-sid=" + config.esid;
	requestHandler.submit(false, "", config.urlPrefix, "", commandSequence, false, additionalParameters);
};

function sabi_initEtc(xmlDoc) {
	sapbi_radioButtons = sapbi_getRadioButtonElements(xmlDoc);
	sapbi_initRadioButtonValues();
}

function sapbi_getElementsByAttribute(attrib, value, context_node, tag) {
	var nodes = [];
	if (tag == null)
		tag = '*';
	var elems = context_node.getElementsByTagName(tag);
	for (var i = 0; i < elems.length; i += 1) {
		if (value) {
			if (elems[i].getAttribute(attrib) === value)
				nodes.push(elems[i]);
		} else {
			if (elems[i].hasAttribute(attrib))
				nodes.push(elems[i]);
		}
	}
	return nodes;
}

function sapbi_getRadioButtonElements(node) {
	return sapbi_getElementsByAttribute("typ", "RadioButton", node, "uiele");
}

function sapbi_acComboBox_getByValue(parameterList, value) {
	var paramNameArray = parameterList.getParameterNames();

	for (var i = 0; i < paramNameArray.length; i++) {
		var currentName = paramNameArray[i];
		var selectedEntry = parameterList.getParameter(currentName);

		if (selectedEntry.getValue() === value)
			return selectedEntry;
	}

	return null;
}

function sapbi_acComboBox_selectionChange(urParam, localEvent) {
}

// A custom javascript function should be called
function sapbi_acComboBox_callCustomScript(urParam) {
	// convert the arrays into parameter objects
	var urParameterList = sapbi_createParameterList(urParam);
	var id = urParameterList.getParameter(sapbi_CONTROL_ID).getValue();
	var selected = comboBoxSelectedKey[id];
	var additionalParameterList = sapbi_page.getControlParameterList(id);

	// alert( "selected\n" + selected );
	// alert( "additionalParameterList\n" + additionalParameterList.toString() );

	// get the associated parameter to this value, which might include a javascript function
	var selectedEntry = sapbi_acComboBox_getByValue(additionalParameterList, selected);
	var customFunctionName = null;

	if (selectedEntry != null) {
		// alert( "Found additional infos" );
		// extract the function
		var selectedParameterList = selectedEntry.getChildList();
		// alert( selectedParameterList.toString() );
		customFunctionName = selectedParameterList.getParameter(sapbi_CUSTOM_FUNCTION).getValue();
		// alert( customFunctionName );
	}

	var cmd = new sapbi_ParameterList();
	cmd.addList(urParameterList);
	cmd.remove(sapbi_EVENT);
	cmd.remove(sapbi_CUSTOM_FUNCTION);

	var valueParameter = new sapbi_Parameter(sapbi_PASSIVE_VALUE, selected);
	cmd.addParameter(valueParameter);

	var currentState = new sapbi_ParameterList();
	currentState.addParameter(new sapbi_Parameter(sapbi_KEY, selected));

	// get the global function name, if no overdefined function name is given
	if (customFunctionName == null) {
		var customFunction = urParameterList.getParameter(sapbi_CUSTOM_FUNCTION);

		if (customFunction != null)
			customFunctionName = customFunction.getValue();
	}

	// execute the javascript function or send the cmd directly
	if (customFunctionName != null) {
		var evalCode = customFunctionName + "( currentState, cmd, localEvent );";

		eval(evalCode);
	} else {
		sapbi_page.sendCommand(cmd);
	}

	return false;
}
// ////////////

// ////////////////////////

function sapbi_acComboBox_transfer(in_command) {
	// get the id of the combo box field
	var passiveIdParameter = in_command.getParameter(sapbi_PASSIVE_ID);
	var strPassiveId = passiveIdParameter.getValue();

	// get the value
	var strValue = comboBoxSelectedKey[strPassiveId];

	if (strValue == null) {
		return null;
	}
	// add the value to the command
	var valueParameter = new sapbi_Parameter(sapbi_PASSIVE_VALUE, strValue);
	in_command.addParameter(valueParameter);

	return in_command;
}

function sapUrMapi_LoadingAnimation_trigger() {
	// ignoring delay set from outside
	sap.zen.getLoadingIndicator().show();
}

function sapUrMapi_LoadingAnimation_cancel() {
	sap.zen.getLoadingIndicator().hideAsync();
}

sap.zen.LoadingIndicator = function(delay) {
	
	this.delay = delay;
	this.executeShowHide = true;
	this.enabledForNextCall = true;

	this.setDelay = function(iDelay){
		if(this.delay !== -1){
			this.delay = iDelay;
		}
	}

	this.setExecuteShowHide = function(bExecuteShowHide){
		this.executeShowHide = bExecuteShowHide;
	}
	
	this.show = function() {
		this.executeShowHide && this.enabledForNextCall && sap && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator.show(this.delay);
		this.enabledForNextCall = true;
	};

	this.showImmediately = function() {
		this.executeShowHide && sap && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator.show(0);
	};

	this.hide = function() {
		this.executeShowHide && sap && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator.hide();
	};
	
	this.hideAsync = function() {
		this.hide();
	};

	this.disableForNextCall = function() {
		this.enabledForNextCall = false;
	};

};

sap.zen.loadingIndicator = null;

sap.zen.getLoadingIndicator = function(bOnlyCusorLoadingIndicator) {
	if (!sap.zen.loadingIndicator) {
		sap.zen.loadingIndicator = new sap.zen.LoadingIndicator(0);
	}
	return sap.zen.loadingIndicator;
};

function sapUrMapi_triggerFocus(focusElementId) {

}

function sapUrMapi_PopupMenu_hideAll() {

}

function ptrGetPopupWindow() {

}

function sapbi_focusFirstElementInTemplateDialog() {
}

// ////////////////////////

var comboBoxSelectedKey = {};
var inputFieldsText = {};
var checkBoxStates = {};
var tabStripStates = {};

function sapbi_setComboBoxSelectedKey(comboBoxId, key) {
	comboBoxSelectedKey[comboBoxId] = key;
}
function sapbi_setInputFieldText(textFieldId, text) {
	inputFieldsText[textFieldId] = text;
}
function sapbi_setCheckBoxState(checkBoxId, checked) {
	checkBoxStates[checkBoxId] = checked;
}

function sapbi_setTabStripState(tabStripId, selected) {
	tabStripStates[tabStripId] = selected;
}

function sapbi_acRadioButton_clientToggle(urParam) {
	// convert the arrays into parameter objects
	var urParameterList = sapbi_createParameterList(urParam);
	var id = urParameterList.getParameter(sapbi_CONTROL_ID).getValue();

	sapbi_page.toggleAssociations(id, null, true);

	var groupId = null, i, radioButton, lid;
	for (i = 0; i < sapbi_radioButtons.length; i++) {
		radioButton = sapbi_radioButtons[i];
		lid = radioButton.getElementsByTagName("Id")[0].text;
		if (lid === id) {
			groupId = radioButton.getElementsByTagName("Name")[0].text;
			sapbi_radioButtonsValues[id] = "true";
			break;
		}
	}

	for (i = 0; i < sapbi_radioButtons.length; i++) {
		radioButton = sapbi_radioButtons[i];
		lid = radioButton.getElementsByTagName("Id")[0].text;
		var lgroupId = radioButton.getElementsByTagName("Name")[0].text;
		if ((groupId === lgroupId) && (id !== lid)) {
			sapbi_radioButtonsValues[lid] = "false";
			sapbi_page.toggleAssociations(currentRadioId, null, false);
		}
	}

}

// ////////////////////////

function sapbi_donothing() {

}

var sapbi_radioButtonsValues = null;

function sapbi_initRadioButtonValues() {
	sapbi_radioButtonsValues = {};
	for (var i = 0; i < sapbi_radioButtons.length; i++) {
		var radioButton = sapbi_radioButtons[i];
		var id = radioButton.getElementsByTagName("Id")[0].text;
		var checked = radioButton.getElementsByTagName("Checked")[0].text;
		if (checked === "true") {
			sapbi_radioButtonsValues[id] = "true";
		} else {
			sapbi_radioButtonsValues[id] = "false";
		}
	}
}

function sapbi_acRadioButton_transfer(in_command) {
	// get the id of the input field
	var passiveIdParameter = in_command.getParameter(sapbi_PASSIVE_ID);
	var strPassiveId = passiveIdParameter.getValue();

	// get the value
	var strValue = sapbi_radioButtonsValues[strPassiveId];
	if (strValue == null) {
		return null;
	}

	// add the value to the command
	var valueParameter = new sapbi_Parameter(sapbi_PASSIVE_VALUE, strValue);
	in_command.addParameter(valueParameter);

	return in_command;
}

function sapbi_acCheckBox_transfer(in_command) {
	var passiveIdParameter = in_command.getParameter(sapbi_PASSIVE_ID);
	var strPassiveId = passiveIdParameter.getValue();

	// get the value
	var strValue = checkBoxStates[strPassiveId];
	if (strValue == null) {
		return null;
	}

	// add the value to the command
	var valueParameter = new sapbi_Parameter(sapbi_PASSIVE_VALUE, strValue);
	in_command.addParameter(valueParameter);

	return in_command;
}

function sapbi_acInputTransfer(in_command) {
	var passiveIdParameter = in_command.getParameter(sapbi_PASSIVE_ID);
	var strPassiveId = passiveIdParameter.getValue();

	// get the value
	var strValue = inputFieldsText[strPassiveId];
	if (strValue == null) {
		return null;
	}

	// add the value to the command
	var valueParameter = new sapbi_Parameter(sapbi_PASSIVE_VALUE, strValue);
	in_command.addParameter(valueParameter);

	return in_command;
}

// Send an event if the user presses enter.
function sapbi_acInputOnEnter(urParam, localEvent) {
	var urParameterList = sapbi_createParameterList(urParam);

	if (sapbi_keyCode === 13) {
		var cmd = new sapbi_ParameterList();

		cmd.addList(urParameterList);
		cmd.remove(sapbi_CONTROL_ID);
		sapbi_page.sendCommand(cmd);

		return false;
	}

	return true;
}

// //////////////

function sapbi_acUniGrid_selectCell(urParam, localEvent) {
	return sapbi_acUniGrid_selectCellInternal(urParam, localEvent, true, true, false); // a normal cell
}

function sapbi_acUniGrid_selectRow(urParam, localEvent) {
	// return sapbi_acUniGrid_selectCellInternal( urParam, localEvent, true, false, true ); // a selection cell
}

function sapbi_acUniGrid_selectColumn(urParam, localEvent) {
	// return sapbi_acUniGrid_selectCellInternal( urParam, localEvent, false, true, true ); // a selection cell
}

// ///////////////////////////////////////////
// ///////////////////////////////////////////
// ///////////////////////////////////////////

function sapbi_acUniGrid_selectCellInternal(urParam, localEvent, doProcessRows, doProcessColumns, isSelectionCell) {
	// Workaround for internal CSN 1567858 2009. IE8 crashes in case the onclick
	// is caused by a selection.
	// Solution: In case it is IE8 don't handle the onclick event in case some
	// text is selected.
	// Surround with try-catch-block to be as non-destructive as possible
	try {
		var ie8wa_browserType = new sapbi_BrowserCheck();
		// Check the browser type
		if (ie8wa_browserType.getType() === sapbi_BROWSER_TYPE_IE && ie8wa_browserType.getVersion() === 8) {
			// Check if text is selected (check could be perfomrmed in the enclosing
			// if-statement as well, but it is more obvious this way)
			if (document.selection.createRange().text.length > 0) {
				return false;
			}
		}
	} catch (ex) {
		// Do nothing
	}

	// convert the arrays into parameter objects
	var urParameterList = sapbi_createParameterList(urParam);

	if (true) {
		if (urParameterList.exists("triggercmd")) {
			var cmd = urParameterList.getParameter("triggercmd").getChildList();
			sapbi_page.sendCommand(cmd);
		}
	}

	localEvent.returnValue = false;
	return false;
}

function sapbi_acUniGrid_clearCache() {

}

function sapbi_acUniGrid_transfer(in_command) {
	var passiveIdParameter = in_command.getParameter(sapbi_PASSIVE_ID);
	var strPassiveId = passiveIdParameter.getValue();
	var value = sapbi_tableRowSelectedState[strPassiveId];

	value = value + ";;;";

	var valueParameter = new sapbi_Parameter(sapbi_PASSIVE_VALUE, value);
	in_command.addParameter(valueParameter);

	return in_command;
}

var sapbi_tableRowSelectedState = {};
function sapbi_setRowSelectedState(tableId, selectedString) {
	sapbi_tableRowSelectedState[tableId] = selectedString;
}

// an array, used as hash, to store all ids
var sapbi_analysisItemHash = {};
// constant for the input id
// var sapbi_analysis_INPUT_ID_NAME = "INPUT_CELL_ID";
// The id of the item.
// var sapbi_analysis_ITEM_ID = "ITEM"; //$NON-NLS-1$
// The id of the advanced ctrl.
// var sapbi_analysis_ADV_ID = "ADV"; //$NON-NLS-1$

// handle the change of an input field
function sapbi_analysisItemInputChange(urParam, localEvent) {
	// convert the arrays into parameter objects
	var urParameterList = sapbi_createParameterList(urParam);

	// get the id
	var id = urParameterList.getParameter(sapbi_CONTROL_ID).getValue();
	// var localEvent = urParameterList.getParameter( sapbi_EVENT ).getValue();

	// check for existance in the hash
	if (sapbi_analysisItemHash[id] == null) {
		// set the hash
		sapbi_analysisItemHash[id] = id;

		// get the item id
		var item = urParameterList.getParameter(sapbi_TARGET_ITEM_REF).getValue(); // sapbi_TARGET_ITEM_REF
		// get the advanced control id
		var advanced = urParameterList.getParameter(sapbi_ADVANCED).getValue(); // sapbi_ADVANCED

		// get the passive type
		var passiveType = urParameterList.getParameter(sapbi_PASSIVE_TYPE).getValue();
		// get the passive index
		var passiveIndex = urParameterList.getParameter(sapbi_PASSIVE_INDEX).getValue();
		// get the passive subindex
		var passiveSubIndex = urParameterList.getParameter(sapbi_PASSIVE_SUB_INDEX).getValue();

		// create the input transfer command
		var newCommand = new sapbi_Command(sapbi_CMD_PASSIVE_VALUE_TRANSFER);
		newCommand.addParameter(new sapbi_Parameter(sapbi_TARGET_ITEM_REF, item));
		newCommand.addParameter(new sapbi_Parameter(sapbi_ADVANCED, advanced));
		newCommand.addParameter(new sapbi_Parameter(sapbi_PASSIVE_ID, id));
		newCommand.addParameter(new sapbi_Parameter(sapbi_PASSIVE_TYPE, passiveType));
		newCommand.addParameter(new sapbi_Parameter(sapbi_PASSIVE_INDEX, passiveIndex));
		newCommand.addParameter(new sapbi_Parameter(sapbi_PASSIVE_SUB_INDEX, passiveSubIndex));

		// register the input element for data transfer
		sapbi_page.registerPassiveElementWithParameterList(newCommand, "sapbi_analysisItemInputTransfer");

		// do accessibility action
		// sapUrMapi_InputField_change( id, localEvent );
	}

	// do not stop the event on bubbling, because e.g. the focus needs to be changed
	localEvent.returnValue = true;
	return true;
}

// transfer the value of the input field
function sapbi_analysisItemInputTransfer(in_command) {
	// get the id of the input field
	var id = in_command.getParameter(sapbi_PASSIVE_ID).getValue();
	// get the value
	var strValue = inputFieldsText[id];
	// set the value
	in_command.addParameter(new sapbi_Parameter(sapbi_PASSIVE_VALUE, strValue));
	// Remove this element from the hash
	sapbi_analysisItemHash[id] = null;

	return in_command;
}

function sapbi_acTabStrip_transfer(in_command) {
	// get the id of the input field
	var passiveIdParameter = in_command.getParameter(sapbi_PASSIVE_ID);
	var strPassiveId = passiveIdParameter.getValue();

	// check if this element really exists
	// Sometimes elements are hidden and displayed again, which causes ghost registrations.
	// This should be solved with SPS 9.
	// get the value
	var strValue = tabStripStates[strPassiveId];
	if (strValue == null) {
		return null;
	}

	// add the value to the command
	var valueParameter = new sapbi_Parameter(sapbi_PASSIVE_VALUE, strValue);
	in_command.addParameter(valueParameter);

	return in_command;
}

function ur_EVT_cancel(event) {

}

function sapzen_createPopup(oHostedControl) {
	var oPopup = new sap.ui.core.Popup(oHostedControl, true, true, false);

	sap.zen.Dispatcher.instance.currentPopup = oPopup;
	oPopup.attachClosed(function() {
		var content = this.getContent();
		if(content.destroy) { // is SAP UI 5 element
			content.destroy();
		};
		this.destroy();
	});
	oPopup.setInitialFocusId("sapbi_snippet_ROOT_DIALOG");
	return oPopup;
}

function sapzen_openPopup(dlgHeight, dlgWidth) {
	var oPopup = sap.zen.Dispatcher.instance.currentPopup;
	var eDock = sap.ui.core.Popup.Dock;
	oPopup.setPosition(eDock.CenterCenter, eDock.CenterCenter, window);
	oPopup.open();
}

function sapbi_closeDialog() {
	if (this.sap && this.sap.zen.Dispatcher.instance.currentPopup) {
		this.sap.zen.Dispatcher.instance.currentPopup.close();
		delete this.sap.zen.Dispatcher.instance.currentPopup;
		this.sapbi_dialogStatus = "closing";
	}
	// for "m". Keep the method for compatibility since this is used elsewhere in ZEN
	if (this.sap && this.sap.zen.Dispatcher.instance.oCurrentVarDlg && this.sap.zen.Dispatcher.instance.isMainMode()) {
		sap.zen.ZenDialogHandler.closeDialog();
		this.sapbi_dialogStatus = "closing";
	}
}  


// ('modal',true,'true','true',[['BI_COMMAND',null,0,[['BI_COMMAND_TYPE','UPDATE',0]]]],'false',[]);
function sapbi_DoDialogReLoaded(displayMode, useLayeredDialogs, closeDialog, updateCaller, parentUpdateCommand,
		hasFollowingCommand, followingCommand) {
	
	if(typeof window.sapbi_updateDialogInDesigner === "function") {
		sapbi_updateDialogInDesigner();
	}
}

function sapbi_DoDialogLoaded(displayMode, useLayeredDialogs, closeDialog, updateCaller, parentUpdateCommand,
		hasFollowingCommand, followingCommand) {
}

function sapbi_isNotUr() {

}

function sapbi_resizeDialog() {
}

function sapbi_checkDestroyDialog() {
}

/////////////////////////////////////////////////////////////////////////+
// Require.js stuff
/////////////////////////


sap.zen.useMinFiles = function() {
	var oldLoad = requirejs.load;
	requirejs.load = function(context, id, url) {
		// Use Min-files for non-sdk includes
		if (url.indexOf("zen/mimes/sdk_include/") === -1) {
			url = url.replace(/\.js/g, "-min.js");					
		}
		
		return oldLoad.call(requirejs, context, id, url);
	};
};

// Backward compatibility for SDK global object access sap.designstudio.sdk.Component, sap.designstudio.sdk.DataSource, sap.designstudio.sdk.DataBuffer
// We create proxy object for those global objects having a special "subclass" method.
// This method requires the real base class and call the base constructor
(function(){
	
	function makeSubClassForRequire(sRequiredModule) {
		function subClass(sName, fConstructor) {
			sap.zen.Dispatcher.instance.pauseDispatching();
			require([sRequiredModule], function(fBaseContructor){
				var fConstructorCallingSuper = function() {
					fBaseContructor.apply(this, arguments);
					fConstructor.apply(this, arguments);
				};

				var aParts = sName.split(".");
				var lastScope = window;
				for (var i = 0; i < aParts.length - 1; i++) {
					var sPart = aParts[i];
					var newScope = lastScope[sPart] || {};
					lastScope[sPart] = newScope;
					lastScope = newScope;
				}
				var sFunctionName = aParts[i];
				lastScope[sFunctionName] = fConstructorCallingSuper;
				sap.zen.Dispatcher.instance.resumeDispatching();
			}); 
		}

		return subClass;

	}

	window.sap = window.sap || {};
	sap.designstudio = sap.designstudio || {};
	sap.designstudio.sdk = sap.designstudio.sdk || {};

	sap.designstudio.sdk.Component =  sap.designstudio.sdk.Component || {}; 
	sap.designstudio.sdk.Component.subclass = makeSubClassForRequire("zen.rt.components.sdk/resources/js/component");

	sap.designstudio.sdk.DataSource =  sap.designstudio.sdk.DataSource || {}; 
	sap.designstudio.sdk.DataSource.subclass = makeSubClassForRequire("zen.rt.components.sdk/resources/js/datasource");

	sap.designstudio.sdk.DataBuffer =  sap.designstudio.sdk.DataBuffer || {}; 
	sap.designstudio.sdk.DataBuffer.subclass = makeSubClassForRequire("zen.rt.components.sdk/resources/js/databuffer");

})();

////////////////////////////////////////////////////////////////////////////////////////////
// RequireJS CSS plugin 
// This is a simplified version of the one from BI Extension framework
// If we want to use it also if SAP.VIZ is not loaded, we need it always

/**
 * A requirejs CSS module.
 */
define('sap/bi/framework/BundleLoader/CssPlugin',[], function() {
    
    
    function CssPlugin() {
    	//
    }
    
    // Compatibility functions:

    // Gets the document head in a cross-browser manner  
    var getHead = function () {
        return document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    };
    


    //The RequireJS module methods
    CssPlugin.prototype.normalize = function(name, normalizer) {
        if (!/\.css$/.test(name)) {
            name = name + ".css";
        }

        return normalizer(name);
    };

    CssPlugin.prototype.load = function (name, req, load, config) {
        
        var cssUrl = (req.toUrl ? req.toUrl(name) : name);
        
        var link = document.createElement("link");
        
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = cssUrl;
        

        link.onload = function(e) {
            load(this.sheet);
            this.onerror = this.onload = null;
        };
        link.onerror = function(e) {
            load.error(new Error("Failed to load " + this.href));
            this.onerror = this.onload = null;
        };

        getHead().appendChild(link);

        if (window.navigator.userAgent.indexOf("PhantomJS") !== -1) {
            /*
             * PhantomJS (the headless browser we use for unit testing) is based on an old version of
             * Webkit that doesn't fire load/error events on stylesheet links. So we simulate them by
             * polling the document.styleSheets collections (which is not updated until the stylsheet
             * finishes loading).
             */
            
            var href = link.href;
            var intervalId = window.setInterval(function() {
                var stylesheets = Array.prototype.slice.call(document.styleSheets); //convert to proper array
                var matchingStylesheets = stylesheets.filter(function(styleSheet) {
                    return styleSheet.href === href;
                });
                
                if (matchingStylesheets.length > 0) {
                    window.clearInterval(intervalId);
                    link.sheet = matchingStylesheets[0];
                    if (link.onload) {
                        link.onload();
                    }
                }
            }, 10);
        }
    };
    
    CssPlugin.prototype.pluginBuilder = "cssBuilder";
        
    return CssPlugin;
});

require(['sap/bi/framework/BundleLoader/CssPlugin'], function(CssPlugin) {

	var cssPlugin = new CssPlugin();
	define("css",  cssPlugin);
});

require.config({
	paths: {
		'sdk_include': '../zen/mimes/sdk_include' 
	},
	map: {
        '*': {
            'd3': 'zen.rt.uiframework/cvom/libs/d3.v3',
            'sap/designstudio/sdk/component': 'zen.rt.components.sdk/resources/js/component', 
            'sap/designstudio/sdk/datasource': 'zen.rt.components.sdk/resources/js/datasource',
            'sap/designstudio/sdk/databuffer': 'zen.rt.components.sdk/resources/js/databuffer',
            'sap/designstudio/sdk/SDKModel': 'zen.rt.components.sdk/resources/js/SDKModel'
        }
	}
     
});
