
define("zen.rt.components.sdk/resources/js/datasource", ["./component"], function(Component) {
	/**
	 * Abstract base class for all SDK data sources
	 */
	var DataSource =  function() {
	
		Component.apply(this, arguments);
		var that = this;
		
		/**
		 * Called by the framework after the SDK data source instance has been created.
		 * You can override the function to do initialization tasks.
		 */
		this.init = function() {
			// empty default implementation
		};
	
		/**
		 * Called by the framework before property setters are called.
		 */
		this.beforeUpdate = function() {
			// empty default implementation
		};
	
		/**
		 * Called by the framework after all property setters for changed properties have been called.
		 */
		this.afterUpdate = function() {
			// empty default implementation
		};
	
		
		/**
		 * The default implementation clean up the publish/subscribe mechanism. Override if your datasource needs further clean-up.
		 */
		this.componentDeleted = function() {
			sap.zen.Dispatcher.instance.sdkDsDelete(this.oComponentProperties.id);
		};
		
		/**
		 * Implement this method to "render" the data from your data source to bound components.
		 * The returned JSON must comply to the Design Studio SDK runtime data JSON format.
		 * It should also include metadata, thus "dimensions" and necessarily "externalDimensions". 
		 * Data should also be filtered according to the given data selection in "oSelection".
		 * @param oSelection
		 * @param oOptions
		 */
		this.fetchData = function(oSelection, oOptions) {
			// empty default implementation
		};
	
		/**
		 * Getter/Setter for metadata provided by this data source.
		 * Usually the framework calls only the getter to retrieve the current metadata.
		 * Return the metadata JSON including "dimensions" and necessarily "externalDimensions"
		 * as String (calling JSON.stringify()).
		 * If Metadata is changed, call this.firePropertiesChanged(["metadata"]);
		 * @param value
		 */
		this.metadata = function(value) {
		};
	
		var _filters = {};
	
		/**
		 * Getter/setter for filters specified by BIAL script methods setFilter etc.
		 * You should consider the current value of this property in your "fetchData" function.
		 */
		this.filters = function(value) {
			if (value === undefined) {
				return _filters;
			} else {
				_filters = JSON.parse(value);
				this.fireUpdate(false);
				return this;
			}
		};
	
		/*
		 * Private, called during BIAL getData
		 */
		this.bialGetData = function(sMeasure, oSelection) {
			if (sMeasure) {
				oSelection["(MEASURES_DIMENSION)"] = sMeasure;
			}
			var result = this.fetchData(oSelection, {includeData: true, includeFormattedData: true, includeTuples: true});
			if (result && result.data && result.data.length === 1) {
				var tuple = result.tuples[0];
				var json = {
					value: result.data[0],
					formattedValue: result.formattedData[0]
				};
	
				for (var i = 0; i < tuple.length; i++) {
					var dim = result.dimensions[i];
					if (dim.containsMeasures) { // TODO: Fix when we have external dims
						json.unitOfMeasure = dim.unitOfMeasure;
						json.scalingFactor = dim.scalingFactor;
					}
				}
				return json;
			}
			return null;
		};
	
		/*
		 * Private, called during fireUpdate to push the new data into the bound components.
		 */
		this.updateDataInto = function(oSelection, oOptions, oTarget) {
			var data = this.fetchData(oSelection, oOptions);
			if (data) { // TODO: fetchData currently returns undefined for bad selections. Not sure how to proceed here.
				$.each(data, function(name, entry) {
					oTarget[name] = entry;
				});
			} else {
				for (var member in oTarget) {
					delete oTarget[member];
				}
			}
		};
	
		/* @Override
		 * Private.
		 */
		this.getTargetParam = function() {
			return "TARGET_DATA_PROVIDER_REF";
		};
	
		/**
		 * Call this functions to update bound components.
		 * If bViaBackend is true, also the backend is updated and "Result set changed" is called. But this is slower.
		 */
		this.fireUpdate = function(bViaBackend) {	  
			var id = this.oComponentProperties.id;
			var dispatcher = sap.zen.Dispatcher.instance;
	
			var delta = [];
	
			var dsEntries = dispatcher.sdkDsFindInstances(id);
			$.each(dsEntries, function(compName, compEntry) {
					var deltaEntry = {
							"component": {
								"id": compName,
								"content": {
									"control": {
									}
								}
							}
					};
					
					$.each(compEntry, function(propName, entry) {
						that.updateDataInto(entry.selection, entry.options, entry.data);
						deltaEntry.component.content.control[propName] = entry.data;
					});
					if (dispatcher.getRootControlForComponentId(compName)) {
					    delta.push(deltaEntry);				
					} 
					else if (!dispatcher.isDispatching())  {
						// Unsubscribe
						// This should only happen modifying data source finds a deleted component.
						// During initial phase, the bound components are not yet available, but 
						// isDispatching returns true.
						delete dsEntries[compName];
					}
			});
			 
			if (!dispatcher.isDispatching()) {
				dispatcher.dispatchDelta(delta);
			}
		
			if (bViaBackend) {
				this.firePropertiesChangedAndEvent(["metadata"], "ON_RESULTSETCHANGED");
			}
		};
	};
	
	DataSource.subclass = Component.makeSubClass(DataSource);

   return DataSource;

});





