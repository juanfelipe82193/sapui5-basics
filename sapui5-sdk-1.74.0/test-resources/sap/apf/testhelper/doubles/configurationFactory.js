jQuery.sap.declare('sap.apf.testhelper.doubles.configurationFactory');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfResourcePathHandler');
jQuery.sap.require('sap.apf.utils.hashtable');
/**
 * @description Constructor, simply clones the configuration object and sets
 * @param oBindingConfig
 */
sap.apf.testhelper.doubles.ConfigurationFactory = function(oInject) {
	var that = this;
	/**
	 * supports the loading of configuration and creation of binding
	 */
	this.supportLoadAndCreateBinding = function() {
		function loadConfigurationObjects(aConfigurationObjects, sType) {
			for(var i = 0; i < aConfigurationObjects.length; i++) {
				loadConfigurationObject(aConfigurationObjects[i], sType);
			}
		}
		function loadConfigurationObject(oConfigurationObject, sType) {
			if (oConfigurationObject.type === undefined) {
				oConfigurationObject.type = sType;
			}
			that.idRegistry.setItem(oConfigurationObject.id, oConfigurationObject);
		}
		this.loadConfig = function(oConfiguration) {
			that.idRegistry = new sap.apf.utils.Hashtable(oInject.instances.messageHandler);
			loadConfigurationObjects(oConfiguration.bindings, "binding");
			loadConfigurationObjects(oConfiguration.representationTypes, "representationType");
		};
		this.createBinding = function(sBindingId, oTitle, oLongTitle) {
			var oBindingConfig = that.idRegistry.getItem(sBindingId);
			oBindingConfig.oTitle = oTitle;
			oBindingConfig.oLongTitle = oLongTitle;
			return new sap.apf.core.Binding(oInject, oBindingConfig, this);
		};
		this.getConfigurationById = function(sId) {
			return that.idRegistry.getItem(sId);
		};
		return this;
	};
};
sap.apf.testhelper.doubles.ConfigurationFactory.prototype = new sap.apf.testhelper.interfaces.IfResourcePathHandler();
sap.apf.testhelper.doubles.ConfigurationFactory.prototype.constructor = sap.apf.testhelper.doubles.ConfigurationFactory;