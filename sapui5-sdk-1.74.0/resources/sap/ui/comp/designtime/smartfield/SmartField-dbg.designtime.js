/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// Provides the Design Time Metadata for the sap.ui.comp.smartfield.SmartField control.
sap.ui.define([], function() {
	"use strict";
	return {
		annotations: {

			/**
			 * Based on the data type the <code>SmartField</code> determines the rendering of the inner control. Additionally the
			 * <code>FieldControl</code> is used.
			 * <code>FieldControl</code> is an annotation that contains a collection of <code>EnumMembers</code> that can dynamically set the state of the control.
			 * Controls used for the <code>SmartField</code> control during runtime are:
			 * <ul>
			 *    <li>sap.m.Input of type Edm.String without value help. <br>
			 *       Used if control is editable and the EntityType is updatable.
			 *    </li>
			 *    <li>sap.m.Input of type Edm.String with value help and suggestion list. <br>
			 *       Used if control is editable, the <code>EntityType</code> is updatable, and a ValueHelp annotations exists.
			 *    </li>
			 * </ul>
			 */
			dataType: {
				namespace: "Edm",
				types: [
					"String", "Boolean", "Byte", "DateTimeOffset", "Date", "Time", "Decimal", "Double", "Single", "Int16", "Int32", "Int64", "Guid"
				]
			},

			/**
			 * Defines whether a field is mandatory, hidden, or in read-only/editable mode.
			 *
			 * An Entity Data Model (EDM) property can be dynamically annotated with the
			 * <code>com.sap.vocabularies.Common.v1.FieldControl</code> annotation in OData V4 models or with
			 * the <code>sap:field-control</code> annotation in OData V2 models by providing a binding path to
			 * another EDM property typed as <code>Edm.Byte</code> whose value in the data model can be:
			 *
			 * <ul>
			 *  <li>0; indicates that the field is hidden.
			 *  <b>Note:</b> Hidden is a deprecated synonym for inapplicable, do not use it to statically hide a field on
			 *  the user interface, but use the static <code>FieldControl</code> annotation instead.</li>
			 *  <li>1; indicates that the field is in read-only mode, and its value cannot be changed.
			 *  <b>Note:</b> To statically annotate an EDM property as read-only, use the <code>Org.OData.Core.V1.Computed</code>
			 *  annotation instead.</li>
			 *  <li>3; indicates that the field is editable and optional (default).</li>
			 *  <li>7; indicates that the field is mandatory from a business perspective.
			 * This value does not imply any restrictions on the value range of an EDM property.
			 * For restricting the value range use, for example, the standard type facet <code>Nullable</code> with a
			 * value of <code>false</code> must be used to exclude the <code>null</code> value, or terms from the
			 * <code>Org.OData.Validation.V1</code> vocabulary must be used.</li>
			 * </ul>
			 *
			 * Example for dynamic use, in a travel expense report the EDM property <code>DestinationCountry</code> is
			 * is not applicable if the trip type is domestic, and mandatory if the trip type is international.
			 * Whenever the value in the data model of the referenced EDM property changes, the field adapts its state
			 * accordingly.
			 *
			 * <i>XML Example Extract of an EDM Property Annotated with the Dynamic <code>FieldControl</code> OData V4 Annotation
			 * in a Service Metadata Document</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;CompanyCode&quot;&gt;
			 *      &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.FieldControl&quot; Path=&quot;CompanyCodeFC&quot;/&gt;
			 *    &lt;/Property&gt;
			 *
			 *    &lt;Property Name=&quot;CompanyCodeFC&quot; type=&quot;Edm.Byte&quot;/&gt;
			 * </pre>
			 *
			 * <i>XML Example Extract of an EDM Property Annotated with the Dynamic <code>sap:field-control</code> OData V2
			 * Annotation in a Service Metadata Document</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;CompanyCode&quot; sap:field-control=&quot;CompanyCodeFC&quot;/&gt;
			 *    &lt;Property Name=&quot;CompanyCodeFC&quot; type=&quot;Edm.Byte&quot;/&gt;
			 * </pre>
			 */
			fieldControl: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "FieldControl",
				target: [
					"Property", "Record"
				],
				defaultValue: 3,
				appliesTo: [
					"fieldItem/#"
				],
				group: [
					"Appearance", "Behavior"
				],
				since: "1.28.1"
			},

			/**
			 * Defines whether a field is hidden.
			 *
			 * In OData V4 models, an Entity Data Model (EDM) property can be statically annotated
			 * as hidden with the <code>com.sap.vocabularies.Common.v1.FieldControl</code> annotation.
			 * A fixed value can be provided as an enumeration member (<code>EnumMember</code>) of the
			 * <code>FieldControlType</code> enumeration.
			 *
			 * <i>XML Example Extract of an EDM Property Statically Annotated as Hidden in an OData
			 * V4 Service Metadata Document</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;CompanyCode&quot;&gt;
			 *      &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.FieldControl&quot; EnumMember=&quot;com.sap.vocabularies.Common.v1.FieldControlType/Hidden&quot;/&gt;
			 *    &lt;/Property&gt;
			 * </pre>
			 *
			 * In OData V2 models, an EDM property can be statically annotated as hidden with the
			 * <code>sap:visible</code> annotation:
			 *
			 * <i>XML Example Extract of an EDM Property Statically Annotated as Hidden in an OData V2 Service
			 * Metadata Document</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;CompanyCode&quot; sap:visible=&quot;false&quot;/&gt;
			 * </pre>
			 */
			fieldVisible: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "FieldControlType",
				target: [
					"Property", "Record"
				],
				whiteList: {
					values: [
						"Hidden"
					]
				},
				defaultValue: false,
				appliesTo: [
					"fieldItem/#/visible"
				],
				group: [
					"Appearance", "Behavior"
				],
				since: "1.28.1"
			},

			/**
			 * Defines whether the field is read-only.
			 *
			 * In OData V4 models, an Entity Data Model (EDM) property can be statically annotated as read-only
			 * with the <code>com.sap.vocabularies.Common.v1.FieldControl</code> annotation.
			 *
			 * A fixed value can be provided as an enumeration member (<code>EnumMember</code>) of the
			 * <code>FieldControlType</code> enumeration.
			 *
			 * <i>XML Example Extract of an EDM Property Statically Annotated as Read-only in an OData V4
			 * Service Metadata Document</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;CompanyCode&quot;&gt;
			 *      &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.FieldControl&quot; EnumMember=&quot;com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly&quot;/&gt;
			 *    &lt;/Property&gt;
			 * </pre>
			 *
			 * In OData V2 models, an EDM property can be statically annotated as read-only with the
			 * <code>sap:updatable</code> annotation:
			 *
			 * <i>XML Example Extract of an EDM Property Statically Annotated as Read-only in an OData V2
			 * Service Metadata Document</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;CompanyCode&quot; ... sap:updatable=&quot;false&quot;/&gt;
			 * </pre>
			 */
			fieldReadOnly: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "FieldControlType",
				target: [
					"Property", "Record"
				],
				whiteList: {
					 values: [
						"ReadOnly"
					]
				},
				defaultValue: false,
				appliesTo: [
					"fieldItem/#/editable"
				],
				group: [
					"Appearance", "Behavior"
				],
				since: "1.28.1"
			},

			/**
			 * Defines whether the control is mandatory. A fixed value can be provided as <code>EnumMember</code> <code>FieldControlType/Mandatory</code> of the <code>FieldControl</code> annotation.
			 * The <code>mandatory</code> property of the SmartField control renders the field as
			 * mandatory input. A SmartField can only be mandatory if the corresponding <code>EntityType</code> is at least annotated as
			 * <code>com.sap.vocabularies.Common.v1.Updatable</code>.
			 *
			 * <i>XML Example of OData V4 with static Mandatory Customer and CompanyCode Properties</i>
			 *
			* <pre>
			 *    &lt;Property Name=&quot;Customer&quot;&gt;
			 *      &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.FieldControl&quot; EnumMember=&quot;com.sap.vocabularies.Common.v1.FieldControlType/Mandatory&quot;/&gt;
			 *    &lt;/Property&gt;
			 *    &lt;Property Name=&quot;CompanyCode&quot;&gt;
			 *      &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.FieldControl&quot; EnumMember=&quot;com.sap.vocabularies.Common.v1.FieldControlType/Mandatory&quot;/&gt;
			 *    &lt;/Property&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>Nullable</code> property on the <code>Property</code> can be used to specify whether the field is
			 * mandatory.
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Customer&quot; ...Nullable=&quot;false&quot;/&gt;
			 *    &lt;Property Name=&quot;CompanyCode&quot; ... Nullable=&quot;false&quot;/&gt;
			 * </pre>
			 */
			fieldMandatory: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "FieldControlType",
				target: [
					"Property", "Record"
				],
				whiteList: {
					values: [
						"Mandatory"
					]
				},
				defaultValue: false,
				appliesTo: [
					"fieldItem/#/editable"
				],
				group: [
					"Behavior"
				],
				since: "1.28.1"
			},

			/**
			 * Determines that a control must not display the actual value in a field with sensitive data, but replace it with a placeholder, for
			 * example, *. Use this annotation for sensitive data.
			 *
			 * <i>XML Example of OData V4 with Masked Password property</i>
			 *
			 * <pre>
			 *   &lt;Property Name=&quot;Password&quot; /&gt;
			 *   &lt;Annotations Target=&quot;Password&quot; xmlns=&quot;http://docs.oasis-open.org/odata/ns/edm&quot;&gt;
			 *     &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.Masked&quot; /&gt;
			 *   &lt;/Annotations&gt;
			 * </pre>
			 */
			fieldMasked: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "Masked",
				target: [
					"Property"
				],
				defaultValue: false,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Behavior"
				],
				since: "1.28.1"
			},

			/**
			 * A short, human-readable text suitable for labels on user interfaces. Renders the value associated with the label annotation of a
			 * <code>Property</code>, which can be <code>null</code>.
			 *
			 * <i>XML Example of OData V4 with CustomerName as Label for Customer</i>
			 *
			 * <pre>
			 *   &lt;Property Name=&quot;Customer&quot;&gt;
			 *     &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.Label&quot; Path=&quot;CustomerName&quot; /&gt;
			 *   &lt;/Property&gt;
			 *   &lt;Property Name=&quot;CustomerName&quot; type=&quot;Edm.String&quot; /&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:label</code> annotation on the <code>Property</code> can be used to assign a label.
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Customer&quot; ... sap:label=&quot;Customer Name&quot;/&gt;
			 *    &lt;Property Name=&quot;CompanyCode&quot; ... sap:label=&quot;Company Code&quot;/&gt;
			 * </pre>
			 */
			fieldLabel: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "Label",
				target: [
					"Property", "PropertyPath"
				],
				defaultValue: null,
				appliesTo: [
					"fieldItem/#/label"
				],
				group: [
					"Behavior"
				],
				since: "1.28.1"
			},

			/**
			 * A descriptive text for values of the annotated property. <b>Note:</b> The value must be a dynamic expression when used as metadata
			 * annotation.
			 *
			 * <i>XML Example of OData V4 Text on CustomerName Property</i>
			 *
			 * <pre>
			 * &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.Text&quot; Path=&quot;CustomerName&quot; /&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:text</code> annotation on the <code>Property</code> can be used to assign a text/description.
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Customer&quot; type=&quot;Edm.String&quot; sap:text=&quot;CustomerName&quot;/&gt;
			 *    &lt;Property Name=&quot;CustomerName&quot; type=&quot;Edm.String&quot;/&gt;
			 * </pre>
			 */
			fieldText: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "Text",
				target: [
					"Property"
				],
				defaultValue: null,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Behavior"
				],
				since: "1.28.1"
			},
			/**
			 * Describes the arrangement of an ID value and its description.
			 *
			 * <b>Note</b>: By default, this annotation is not evaluated in edit mode.
			 * To enable this feature in edit mode, set the <code>textInEditModeSource</code> control property to a non-default
			 * value.
			 *
			 * The following enumeration members are allowed:
			 *
			 * <ul>
			 * <li><code>com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate</code>:
			 * The control displays the specified ID only.</li>
			 *
			 * <li><code>com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst</code>:
			 * The control displays the specified description followed by its ID.</li>
			 *
			 * <li><code>com.sap.vocabularies.UI.v1.TextArrangementType/TextLast</code>:
			 * The control displays the specified ID followed by its description.</li>
			 *
			 * <li><code>com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly</code>:
			 * The control displays the specified description only.</li>
			 * </ul>
			 *
			 * The <code>TextArrangement</code> annotation is usually used as a
			 * child of a <code>com.sap.vocabularies.Common.v1.Text</code>
			 * annotation.
			 *
			 * <i>XML Example of OData V4 with <code>TextArrangement</code>
			 * annotation on an entity's property</i>
			 *
			 * <pre>
			 * &lt;Annotations xmlns=&quot;http://docs.oasis-open.org/odata/ns/edm&quot; Target=&quot;namespace.Product/Category&quot;&gt;
			 * 	&lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.Text&quot; Path=&quot;CategoryName&quot;&gt;
			 * 		&lt;Annotation Term=&quot;com.sap.vocabularies.UI.v1.TextArrangement&quot; EnumMember=&quot;com.sap.vocabularies.UI.v1.TextArrangementType/TextLast&quot; /&gt;
			 * 	&lt;/Annotation&gt;
			 * &lt;/Annotations&gt;
			 * </pre>
			 *
			 * <i>XML Example of OData V4 with <code>TextArrangement</code>
			 * annotation on entity <code>Product</code></i>
			 *
			 * <pre>
			 *    &lt;Annotations Target=&quot;Namespace.ProductType&quot;&gt;
			 *      &lt;Annotation Term=&quot;com.sap.vocabularies.UI.v1.TextArrangement&quot; EnumMember=&quot;com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst&quot;/&gt;
			 *    &lt;/Annotations&gt;
			 * </pre>
			 */
			fieldTextArrangement: {
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "TextArrangement",
				target: [
					"EntityType",
					"Annotation"
				],
				defaultValue: null,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Appearance", "Behavior"
				],
				since: "1.32.1"
			},

			/**
			 * Defines a currency code for an amount according to the ISO 4217 standard. <code>ISOCurrency</code> annotation can point to a
			 * <code>Property</code>, which can also be <code>null</code>.
			 *
			 * <i>XML Example of OData V4 with Price and CurrencyCode as ISOCurrency</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Price&quot;&gt;
			 *       &lt;Annotation Term=&quot;Org.OData.Measures.V1.ISOCurrency&quot; Path=&quot;CurrencyCode&quot; /&gt;
			 *    &lt;/Property&gt;
			 *    &lt;Property Name=&quot;CurrencyCode&quot; type=&quot;Edm.String&quot; /&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:semantics="currency-code"</code> along with <code>sap:unit</code> annotations on the
			 * <code>Property</code> can be used to assign a currency code to the field.
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Price&quot; ... sap:unit=&quot;CurrencyCode&quot;/&gt;
			 *    &lt;Property Name=&quot;CurrencyCode&quot; ... sap:semantics=&quot;currency-code&quot;/&gt;
			 * </pre>
			 */
			fieldCurrencyCode: {
				namespace: "Org.OData.Measures.V1",
				annotation: "ISOCurrency",
				target: [
					"Property"
				],
				defaultValue: null,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Behavior"
				],
				since: "1.28.1"
			},

			/**
			 * The unit of measure for this measured quantity, for example, cm for centimeters. Renders the value associated with the unit annotation
			 * of a <code>Property</code>, which can be <code>null</code>.
			 *
			 * <i>XML Example of OData V4 with OrderedQuantity and OrderedUnit as Unit</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;OrderedQuantity&quot;&gt;
			 *       &lt;Annotation Term=&quot;Org.OData.Measures.V1.Unit&quot; Path=&quot;OrderedUnit&quot; /&gt;
			 *    &lt;/Property&gt;
			 *    &lt;Property Name=&quot;OrderedUnit&quot; type=&quot;Edm.String&quot; /&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:semantics="unit-of-measure"</code> along with <code>sap:unit</code> annotations on the
			 * <code>Property</code> can be used to assign a unit of measure to the field.
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;OrderedQuantity&quot; ... sap:unit=&quot;OrderedUnit&quot;/&gt;
			 *    &lt;Property Name=&quot;OrderedUnit&quot; ... sap:semantics=&quot;unit-of-measure&quot;/&gt;
			 * </pre>
			 */
			fieldUnitOfMeasure: {
				namespace: "Org.OData.Measures.V1",
				annotation: "Unit",
				target: [
					"Property"
				],
				defaultValue: null,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Behavior"
				],
				since: "1.28.1"
			},

			/**
			 * Defines the number of digits that are to be displayed after the decimal point. This annotation can be applied to a
			 * <code>Property</code>.
			 *
			 * <i>XML Example of OData V4 with Scaled Price and Weight Properties</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Price&quot;&gt;
			 *       &lt;Annotation Term=&quot;Org.OData.Measures.V1.Scale&quot; Path=&quot;PriceScale&quot; /&gt;
			 *    &lt;/Property&gt;
			 *    &lt;Property Name=&quot;Weight&quot;&gt;
			 *       &lt;Annotation Term=&quot;Org.OData.Measures.V1.Scale&quot; Path=&quot;WeightScale&quot; /&gt;
			 *    &lt;/Property&gt;
			 *    &lt;Property Name=&quot;PriceScale&quot; type=&quot;Edm.Byte&quot; /&gt;
			 *    &lt;Property Name=&quot;WeightScale&quot; type=&quot;Edm.Byte&quot; /&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:precision</code> annotation on the <code>Property</code> can be used to scale the number of digits to be
			 * displayed after the decimal point.
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Price&quot; ... sap:precision=&quot;2&quot;/&gt;
			 *    &lt;Property Name=&quot;Weight&quot; ... sap:precision=&quot;3&quot;/&gt;
			 * </pre>
			 */
			fieldScale: {
				namespace: "Org.OData.Measures.V1",
				annotation: "Scale",
				target: [
					"Property"
				],
				defaultValue: null,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Behavior"
				],
				since: "1.28.1"
			},

			/**
			 * A short, human-readable text suitable for tool tips in user interfaces.
			 *
			 * <i>XML Example of OData V4 with Tooltip on CompanyCode Property</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;CompanyCode&quot;&gt;
			 *      &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.QuickInfo&quot; Path=&quot;CompanyCodeQuickInfo&quot; /&gt;
			 *    &lt;/Property&gt;
			 *    &lt;Property Name=&quot;CompanyQuickInfo&quot; type=&quot;Edm.String&quot; /&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:quickinfo</code> annotation on the <code>Property</code> can be used to assign information relevant for
			 * tool tips of the field.
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;CompanyCode&quot; ... sap:quickinfo=&quot;Company Code quickinfo&quot;/&gt;
			 * </pre>
			 */
			fieldQuickInfo: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "QuickInfo",
				target: [
					"Property"
				],
				defaultValue: null,
				appliesTo: [
					"fieldItem/#/tooltip"
				],
				group: [
					"Behavior"
				],
				since: "1.28.1"
			},

			/**
			 * Properties annotated with this annotation are rendered as multi-line text (for example, text area).
			 *
			 * <i>XML Example of OData V4 with Multi-line Text Description Property</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Description&quot; /&gt;
			 *    &lt;Annotations Target=&quot;Description&quot;&gt;
			 *       &lt;Annotation Term=&quot;com.sap.vocabularies.UI.v1.MultiLineText&quot; /&gt;
			 *    &lt;/Annotations&gt;
			 * </pre>
			 */
			fieldMultiLineText: {
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "MultiLineText",
				target: [
					"Property", "PropertyPath"
				],
				defaultValue: true,
				appliesTo: [
					"fieldItem/#/control"
				],
				group: [
					"Appearance", "Behavior"
				],
				since: "1.28.1"
			},

			/**
			 * Defines whether a string value is capitalized.
			 *
			 * <i>XML Example of OData V4 with Capitalized Customer and CompanyCode Properties</i>
			 *
			 * <pre>
			 *    &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.IsUpperCase&quot;&gt;
			 *        &lt;Collection&gt;
			 *           &lt;PropertyPath&gt;Customer&lt;/PropertyPath&gt;
			 *           &lt;PropertyPath&gt;CompanyCode&lt;/PropertyPath&gt;
			 *        &lt;/Collection&gt;
			 *    &lt;/Annotation&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:display-format="UpperCase"</code> annotation on the <code>Property</code> can be used to render the text
			 * in upper case format.
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Customer&quot; ... sap:display-format=&quot;UpperCase&quot;/&gt;
			 *    &lt;Property Name=&quot;CompanyCode&quot; ... sap:display-format=&quot;UpperCase&quot;/&gt;
			 * </pre>
			 */
			fieldUpperCase: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "IsUpperCase",
				target: [
					"Property", "Parameter"
				],
				defaultValue: true,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Behavior"
				],
				since: "1.28.1"
			},

			/**
			 * Indicates whether the annotated <code>Property</code> contains only digit sequences
			 * (non-negative numeric values).
			 *
			 * Other input leads to validation errors and the value state message popup is shown.
			 * In addition, whenever the control's value property is changed on the user interface side, and the change
			 * has to be propagated back into the data model, then the value is either filled with leading zeroes
			 * (if the <code>maxLength</code> attribute is given) or the leading zeroes are removed (if no
			 * <code>maxLength</code> attribute is given).
			 *
			 * Intended for <code>Edm.String</code> properties that are stored as ABAP <code>NUMC</code> (numeric text)
			 * data type.
			 *
			 * <i>XML Example of the OData V4 Annotation</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Price&quot; MaxLength=&quot;20&quot; Type=&quot;Edm.String&quot;/&gt;
			 *    &lt;Annotations Target=&quot;Price&quot;&gt;
			 *        &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.IsDigitSequence&quot; Bool=&quot;true&quot;/&gt;
			 *    &lt;/Annotations&gt;
			 * </pre>
			 */
			fieldDigitSequence: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "IsDigitSequence",
				target: [
					"Property"
				],
				defaultValue: true,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Behavior"
				],
				since: "1.46"
			},

			/**
			 * Indicates whether a field has a recommended value. Intelligent systems can help users by recommending input the user may prefer.
			 *
			 * This annotation is intended for editable fields for which a recommended input has been
			 * pre-filled by a system and is used to highlight a field.
			 *
			 * <b>Note:</b> The <code>RecommendationState</code> annotation is currently experimental and might be renamed or redefined.
			 *
			 * <i>XML Example of the OData V4 Annotation</i>
			 *
			 * <pre>
			 * &lt;Property Name=&quot;Name&quot; Type=&quot;Edm.String&quot; /&gt;
			 * &lt;Property Name=&quot;Name_sr&quot; Type=&quot;Edm.Byte&quot;/&gt;
			 * ...
			 * &lt;Annotations xmlns=&quot;http://docs.oasis-open.org/odata/ns/edm&quot; Target=&quot;namespace.Product/Name&quot;&gt;
			 *     &lt;Annotation Term=&quot;com.sap.vocabularies.UI.v1.RecommendationState&quot; Path=&quot;Name_sr&quot; /&gt;
			 * &lt;/Annotations&gt;
			 * </pre>
			 *
			 * The following values are allowed for the <code>edm:property</code> typed as <code>Edm.Byte</code>:
			 *
			 * <ul>
			 * 	<li><b>0 regular</b>: With human or default input, no recommendation</li>
			 *	<li><b>1 highlighted</b>: Without human input and with recommendation</li>
			 * 	<li><b>2 warning</b>: With human or default input and with recommendation</li>
			 * </ul>
			 */
			fieldRecommendationState: {
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "RecommendationState",
				target: [
					"Property"
				],
				defaultValue: 0,
				group: [
					"Appearance"
				],
				since: "1.61"
			},

			/**
			 * Indicates whether the annotated <code>Property</code> is a string that is based on a calendar date following the pattern 'yyyyMMdd'.
			 *
			 * Intended for <code>Edm.String</code> properties that are stored as ABAP and follow the pattern 'YYYYMMDD'.
			 *
			 * <i>XML Example of the OData V4 Annotation</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Price&quot; MaxLength=&quot;20&quot; Type=&quot;Edm.String&quot;/&gt;
			 *    &lt;Annotations Target=&quot;Price&quot;&gt;
			 *        &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.IsCalendarDate&quot; Bool=&quot;true&quot;/&gt;
			 *    &lt;/Annotations&gt;
			 * </pre>
			 */
			fieldCalendarDate: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "IsCalendarDate",
				target: [
					"Property"
				],
				defaultValue: true,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Behavior"
				],
				since: "1.54"
			},

			/**
			 * Indicates whether a <code>Property</code> contains an e-mail address.
			 *
			 * <i>XML Example of the OData V4 E-mail Address Annotation</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Email&quot; Type=&quot;Edm.String&quot;/&gt;
			 *    &lt;Annotations Target=&quot;Email&quot;&gt;
			 *        &lt;Annotation Term=&quot;com.sap.vocabularies.Communication.v1.IsEmailAddress&quot; Bool=&quot;true&quot;/&gt;
			 *    &lt;/Annotations&gt;
			 * </pre>
			 */
			fieldEmailAddress: {
				namespace: "com.sap.vocabularies.Communication.v1",
				annotation: "IsEmailAddress",
				target: [
					"Property"
				],
				defaultValue: true,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Behavior"
				],
				since: "1.46"
			},

			/**
			 * Indicates whether a <code>Property</code> contains a phone number.
			 *
			 * <i>XML Example of the OData V4 Phone Number Annotation</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Phone&quot; Type=&quot;Edm.String&quot;/&gt;
			 *    &lt;Annotations Target=&quot;Phone&quot;&gt;
			 *        &lt;Annotation Term=&quot;com.sap.vocabularies.Communication.v1.IsPhoneNumber&quot; Bool=&quot;true&quot;/&gt;
			 *    &lt;/Annotations&gt;
			 * </pre>
			 */
			fieldPhoneNumber: {
				namespace: "com.sap.vocabularies.Communication.v1",
				annotation: "IsPhoneNumber",
				target: [
					"Property"
				],
				defaultValue: true,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Behavior"
				],
				since: "1.46"
			},

			/**
			 * Indicates whether a <code>Property</code> contains a URL.
			 *
			 * <i>XML Example of the OData V4 URL Annotation</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;URL&quot; Type=&quot;Edm.String&quot;/&gt;
			 *    &lt;Annotations Target=&quot;URL&quot;&gt;
			 *        &lt;Annotation Term=&quot;Org.OData.Core.V1.IsURL&quot; Bool=&quot;true&quot;/&gt;
			 *    &lt;/Annotations&gt;
			 * </pre>
			 */
			fieldUrl: {
				namespace: "Org.OData.Core.V1",
				annotation: "IsURL",
				target: [
					"Property"
				],
				defaultValue: true,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Behavior"
				],
				since: "1.46"
			},

			/**
			 * Defines whether an <code>EntitySet</code> can be created.
			 *
			 * <i>XML Example of OData V4 with Insertable ProductCollection EntitySet</i>
			 *
			 * <pre>
			 *   &lt;EntitySet Name=&quot;ProductCollection&quot;&gt;
			 *     &lt;Annotation Term=&quot;Org.OData.Capabilities.V1.InsertRestrictions&quot;&gt;
			 *       &lt;Record&gt;
			 *         &lt;PropertyValue Property=&quot;Insertable&quot; Bool=&quot;true&quot; /&gt;
			 *       &lt;/Record&gt;
			 *     &lt;/Annotation&gt;
			 *   &lt;/EntitySet&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:creatable</code> annotation on the <code>Property</code> can be used to specify that the field is
			 * creatable.
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Customer&quot; ... sap:creatable=&quot;true&quot;/&gt;
			 *    &lt;Property Name=&quot;CompanyCode&quot; ... sap:creatable=&quot;true&quot;/&gt;
			 * </pre>
			 */
			fieldCreatable: {
				namespace: "Org.OData.Capabilities.V1",
				annotation: "InsertRestrictions/Insertable",
				target: [
					"EntitySet"
				],
				defaultValue: false,
				appliesTo: [
					"fieldItem/#/editable"
				],
				group: [
					"Behavior"
				],
				since: "1.28.1"
			},

			/**
			 * Defines whether a <code>Property</code> can be created. A value for this <code>Property</code> is generated on both insert and
			 * update actions.
			 *
			 * <i>XML Example of OData V4 with Computed Customer and CompanyCode Properties</i>
			 *
			 * <pre>
			 *    &lt;Annotation Term=&quot;Org.OData.Core.V1.Computed&quot;&gt;
			 *        &lt;Collection&gt;
			 *           &lt;PropertyPath&gt;Customer&lt;/PropertyPath&gt;
			 *           &lt;PropertyPath&gt;CompanyCode&lt;/PropertyPath&gt;
			 *        &lt;/Collection&gt;
			 *    &lt;/Annotation&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:creatable</code> and <code>sap:updatable</code> annotation on the <code>Property</code> can be used to
			 * specify whether a value has to be created on insert and update actions.
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Customer&quot; ... sap:creatable=&quot;true&quot;/&gt;
			 *    &lt;Property Name=&quot;CompanyCode&quot; ... sap:creatable=&quot;true&quot;/&gt;
			 * </pre>
			 */
			fieldComputed: {
				namespace: "Org.OData.Core.V1",
				annotation: "Computed",
				target: [
					"Property"
				],
				defaultValue: true,
				appliesTo: [
					"fieldItem/#/editable"
				],
				group: [
					"Behavior"
				],
				since: "1.28.1"
			},

			/**
			 * Defines whether an <code>EntitySet</code> can be updated.
			 *
			 * <i>XML Example of OData V4 with Updatable ProductCollection EntitySet</i>
			 *
			 * <pre>
			 *   &lt;Annotations Target=&quot;namespace/ProductCollection&quot;&gt;
			 *     &lt;Annotation Term=&quot;Org.OData.Capabilities.V1.UpdateRestrictions&quot;&gt;
			 *       &lt;Record&gt;
			 *         &lt;PropertyValue Property=&quot;Org.OData.Capabilities.V1.UpdateRestrictionsType/Updatable&quot; Bool=&quot;false&quot; /&gt;
			 *       &lt;/Record&gt;
			 *     &lt;/Annotation&gt;
			 *   &lt;/Annotations&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:updatable</code> annotation on the <code>Property</code> can be used to specify whether a field is
			 * updatable.
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Customer&quot; ... sap:updatable=&quot;true&quot;/&gt;
			 *    &lt;Property Name=&quot;CompanyCode&quot; ... sap:updatable=&quot;true&quot;/&gt;
			 * </pre>
			 */
			fieldUpdatableEntitySet: {
				namespace: "Org.OData.Capabilities.V1",
				annotation: "UpdateRestrictions/Updatable",
				target: [
					"EntitySet"
				],
				defaultValue: false,
				appliesTo: [
					"fieldItem/#editable"
				],
				group: [
					"Behavior"
				],
				since: "1.28.1"
			},

			/**
			 * A value for this non-key property can be provided on <code>insert</code> and cannot even be changed on update actions.
			 *
			 * <i>XML Example of OData V4 with Immutable Customer and CompanyCode properties</i>
			 *
			 * <pre>
			 *    &lt;Annotation Term=&quot;Org.OData.Core.V1.Immutable&quot;&gt;
			 *        &lt;Collection&gt;
			 *           &lt;PropertyPath&gt;Customer&lt;/PropertyPath&gt;
			 *           &lt;PropertyPath&gt;CompanyCode&lt;/PropertyPath&gt;
			 *        &lt;/Collection&gt;
			 *    &lt;/Annotation&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:updatable</code> and <code>sap:creatable</code> annotation on the <code>Property</code> can be used to
			 * avoid changes that can be done on update actions.
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Customer&quot; ... sap:creatable=&quot;false&quot;/&gt;
			 *    &lt;Property Name=&quot;CompanyCode&quot; ... sap:creatable=&quot;false&quot;/&gt;
			 * </pre>
			 */
			fieldImmutable: {
				namespace: "Org.OData.Core.V1",
				annotation: "Immutable",
				target: [
					"Property"
				],
				defaultValue: true,
				appliesTo: [
					"fieldItem/#/editable"
				],
				group: [
					"Behavior"
				],
				since: "1.28.1"
			},

			/**
			 * Changes to the source properties may have side-effects on the target properties or entities. If neither TargetProperties nor
			 * TargetEntities are specified, a change to the source property values may have unforeseeable side-effects. An empty
			 * NavigationPropertyPath may be used in TargetEntities to specify that any property of the annotated entity type may be affected. Actions
			 * are a special case: here the change trigger is the action invocation, so SourceProperties and SourceEntities have no meaning, only
			 * TargetProperties and TargetEntities are relevant. They are addressed via the binding parameter of the action. <code>SideEffects</code>
			 * can be associated with the given entity, which can be a complex type, entity type or entity set. In addition to this,
			 * <code>SideEffects</code> can also be applied to a <code>PropertyPath</code> or a <code>NavigationPropertyPath</code> of the given
			 * entity.
			 *
			 * <i>XML Example of OData V4 with Side Effect on CurrencyCode Property</i>
			 *
			 * <pre>
			 *   &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.SideEffects&quot; Qualifier=&quot;ExampleQualifierName&quot;&gt;
			 *     &lt;Record&gt;
			 *       &lt;PropertyValue Property=&quot;SourceProperties&quot;&gt;
			 *         &lt;Collection&gt;
			 *           &lt;PropertyPath&gt;CurrencyCode&lt;/PropertyPath&gt;
			 *         &lt;/Collection&gt;
			 *       &lt;/PropertyValue&gt;
			 *       &lt;PropertyValue Property=&quot;TargetProperties&quot;&gt;
			 *         &lt;Collection&gt;
			 *           &lt;PropertyPath&gt;CurrencyCode&lt;/PropertyPath&gt;
			 *         &lt;/Collection&gt;
			 *       &lt;/PropertyValue&gt;
			 *       &lt;PropertyValue Property=&quot;EffectTypes&quot; EnumMember=&quot;ValidationMessage&quot; /&gt;
			 *     &lt;/Record&gt;
			 *   &lt;/Annotation&gt;
			 * </pre>
			 */
			fieldSideEffects: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "SideEffects",
				target: [
					"EntitySet", "EntityType", "ComplexType"
				],
				defaultValue: null,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Behavior"
				],
				since: "1.32.1"
			},

			/**
			 * Specifies how to get a list of acceptable values for a property or parameter. Provides the value help dialog and type-ahead function.
			 *
			 * <b>Note</b>: This annotation is only supported for Entity Data Model (EDM) properties typed as:
			 *
			 * <ul>
			 * 	<li><code>Edm.String</code></li>
			 * </ul>
			 *
			 * <b>Note</b>: The <code>CollectionPath</code> property does not support paths with navigation properties.
			 *
			 * <b>Note</b>: The <code>CollectionRoot</code> property is not supported.
			 *
			 * <i>Example in OData V4 notation with property "Category" with a ValueList</i>
			 *
			 * <i>XML Example of OData V4 Value List on Category Property</i>
			 *
			 * <pre>
			 *    &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.ValueList&quot;&gt;
			 *      &lt;Record&gt;
			 *        &lt;PropertyValue Property=&quot;Label&quot; String=&quot;Category&quot; /&gt;
			 *        &lt;PropertyValue Property=&quot;CollectionPath&quot; String=&quot;Category&quot; /&gt;
			 *        &lt;PropertyValue Property=&quot;SearchSupported&quot; Bool=&quot;true&quot; /&gt;
			 *        &lt;PropertyValue Property=&quot;Parameters&quot;&gt;
			 *          &lt;Collection&gt;
			 *            &lt;Record Type=&quot;com.sap.vocabularies.Common.v1.ValueListParameterOut&quot;&gt;
			 *              &lt;PropertyValue Property=&quot;LocalDataProperty&quot; PropertyPath=&quot;Category&quot; /&gt;
			 *              &lt;PropertyValue Property=&quot;ValueListProperty&quot; String=&quot;Description&quot; /&gt;
			 *            &lt;/Record&gt;
			 *            &lt;Record Type=&quot;com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly&quot;&gt;
			 *              &lt;PropertyValue Property=&quot;ValueListProperty&quot; String=&quot;CategoryName&quot; /&gt;
			 *            &lt;/Record&gt;
			 *          &lt;/Collection&gt;
			 *        &lt;/PropertyValue&gt;
			 *      &lt;/Record&gt;
			 *    &lt;/Annotation&gt;
			 * </pre>
			 */
			valueList: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "ValueList",
				target: [
					"Property", "Parameter"
				],
				whiteList: {
					properties: [
						"Label", "CollectionPath", "Parameters", "SearchSupported"
					]
				},
				defaultValue: null,
				appliesTo: [
					"field/#/fieldHelp"
				],
				group: [
					"Behavior"
				],
				since: "1.28.1"
			},

			/**
			 * If set to <code>true</code>, there's only one value list mapping, and its value list
			 * consists of a small number of fixed values.
			 * The value list is rendered as a dropdown list containing all possible values.
			 *
			 * <b>Note</b>: This annotation is only supported for Entity Data Model (EDM) properties typed as:
			 *
			 * <ul>
			 * 	<li><code>Edm.String</code></li>
			 * 	<li><code>Edm.Guid</code></li>
			 * 	<li><code>Edm.Boolean</code></li>
			 * 	<li><code>Edm.Byte</code></li>
			 * 	<li><code>Edm.Decimal</code></li>
			 * 	<li><code>Edm.Double</code></li>
			 * 	<li><code>Edm.Float</code></li>
			 * 	<li><code>Edm.Single</code></li>
			 * 	<li><code>Edm.Int16</code></li>
			 * 	<li><code>Edm.Int32</code></li>
			 * 	<li><code>Edm.Int64</code></li>
			 * </ul>
			 *
			 * <i>XML Example of OData V4 Value List on Category Property</i>
			 *
			 * <pre>
			 *    &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.ValueListWithFixedValues&quot; Bool=&quot;true&quot;/&gt;
			 * </pre>
			 */
			valueListWithFixedValues: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "ValueListWithFixedValues",
				target: [
					"Property", "Parameter"
				],
				defaultValue: null,
				appliesTo: [
					"field/#/fieldHelp"
				],
				group: [
					"Behavior"
				],
				since: "1.48.1"
			},

			/**
			 * Indicates whether the annotated <code>Property</code> is a string that is based on a fiscal date following the 'y' pattern.
			 *
			 * Intended for <code>Edm.String</code> properties that are stored as ABAP and follow the 'y' pattern.
			 *
			 * <b>Note:</b> The <code>IsFiscalYear</code> annotation is currently experimental and might be renamed or redefined.
			 *
			 * <i>XML Example of the OData V4 Annotation</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Price&quot; Type=&quot;Edm.String&quot;/&gt;
			 *    &lt;Annotations Target=&quot;Price&quot;&gt;
			 *        &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.IsFiscalYear&quot; Bool=&quot;true&quot;/&gt;
			 *    &lt;/Annotations&gt;
			 * </pre>
			 */
			fiscalYear: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "IsFiscalYear",
				target: [
					"Property"
				],
				defaultValue: true,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Appearance", "Behavior"
				],
				since: "1.74"
			},

			/**
			 * Indicates whether the annotated <code>Property</code> is a string that is based on a fiscal date following the 'M' pattern.
			 *
			 * Intended for <code>Edm.String</code> properties that are stored as ABAP and follow the 'M' pattern.
			 *
			 * <b>Note:</b> The <code>IsFiscalPeriod</code> annotation is currently experimental and might be renamed or redefined.
			 *
			 * <i>XML Example of the OData V4 Annotation</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Price&quot; Type=&quot;Edm.String&quot;/&gt;
			 *    &lt;Annotations Target=&quot;Price&quot;&gt;
			 *        &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.IsFiscalPeriod&quot; Bool=&quot;true&quot;/&gt;
			 *    &lt;/Annotations&gt;
			 * </pre>
			 */
			fiscalPeriod: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "IsFiscalPeriod",
				target: [
					"Property"
				],
				defaultValue: true,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Appearance", "Behavior"
				],
				since: "1.74"
			},

			/**
			 * Indicates whether the annotated <code>Property</code> is a string that is based on a fiscal date following the 'yM' pattern.
			 *
			 * Intended for <code>Edm.String</code> properties that are stored as ABAP and follow the 'yM' pattern.
			 *
			 * <b>Note:</b> The <code>IsFiscalYearPeriod</code> annotation is currently experimental and might be renamed or redefined.
			 *
			 * <i>XML Example of the OData V4 Annotation</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Price&quot; Type=&quot;Edm.String&quot;/&gt;
			 *    &lt;Annotations Target=&quot;Price&quot;&gt;
			 *        &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.IsFiscalYearPeriod&quot; Bool=&quot;true&quot;/&gt;
			 *    &lt;/Annotations&gt;
			 * </pre>
			 */
			fiscalYearPeriod: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "IsFiscalYearPeriod",
				target: [
					"Property"
				],
				defaultValue: true,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Appearance", "Behavior"
				],
				since: "1.74"
			},

			/**
			 * Indicates whether the annotated <code>Property</code> is a string that is based on a fiscal date following the 'Q' pattern.
			 *
			 * Intended for <code>Edm.String</code> properties that are stored as ABAP and follow the 'Q' pattern.
			 *
			 * <b>Note:</b> The <code>IsFiscalQuarter</code> annotation is currently experimental and might be renamed or redefined.
			 *
			 * <i>XML Example of the OData V4 Annotation</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Price&quot; Type=&quot;Edm.String&quot;/&gt;
			 *    &lt;Annotations Target=&quot;Price&quot;&gt;
			 *        &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.IsFiscalQuarter&quot; Bool=&quot;true&quot;/&gt;
			 *    &lt;/Annotations&gt;
			 * </pre>
			 */
			fiscalQuarter: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "IsFiscalQuarter",
				target: [
					"Property"
				],
				defaultValue: true,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Appearance", "Behavior"
				],
				since: "1.74"
			},

			/**
			 * Indicates whether the annotated <code>Property</code> is a string that is based on a fiscal date following the 'yQ' pattern.
			 *
			 * Intended for <code>Edm.String</code> properties that are stored as ABAP and follow the 'yQ' pattern.
			 *
			 * <b>Note:</b> The <code>IsFiscalYearQuarter</code> annotation is currently experimental and might be renamed or redefined.
			 *
			 * <i>XML Example of the OData V4 Annotation</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Price&quot; Type=&quot;Edm.String&quot;/&gt;
			 *    &lt;Annotations Target=&quot;Price&quot;&gt;
			 *        &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.IsFiscalYearQuarter&quot; Bool=&quot;true&quot;/&gt;
			 *    &lt;/Annotations&gt;
			 * </pre>
			 */
			fiscalYearQuarter: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "IsFiscalYearQuarter",
				target: [
					"Property"
				],
				defaultValue: true,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Appearance", "Behavior"
				],
				since: "1.74"
			},

			/**
			 * Indicates whether the annotated <code>Property</code> is a string that is based on a fiscal date following the 'w' pattern.
			 *
			 * Intended for <code>Edm.String</code> properties that are stored as ABAP and follow the 'w' pattern.
			 *
			 * <b>Note:</b> The <code>IsFiscalWeek</code> annotation is currently experimental and might be renamed or redefined.
			 *
			 * <i>XML Example of the OData V4 Annotation</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Price&quot; Type=&quot;Edm.String&quot;/&gt;
			 *    &lt;Annotations Target=&quot;Price&quot;&gt;
			 *        &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.IsFiscalWeek&quot; Bool=&quot;true&quot;/&gt;
			 *    &lt;/Annotations&gt;
			 * </pre>
			 */
			fiscalWeek: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "IsFiscalWeek",
				target: [
					"Property"
				],
				defaultValue: true,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Appearance", "Behavior"
				],
				since: "1.74"
			},

			/**
			 * Indicates whether the annotated <code>Property</code> is a string that is based on a fiscal date following the 'Yw' pattern.
			 *
			 * Intended for <code>Edm.String</code> properties that are stored as ABAP and follow the 'Yw' pattern.
			 *
			 * <b>Note:</b> The <code>IsFiscalYearWeek</code> annotation is currently experimental and might be renamed or redefined.
			 *
			 * <i>XML Example of the OData V4 Annotation</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Price&quot; Type=&quot;Edm.String&quot;/&gt;
			 *    &lt;Annotations Target=&quot;Price&quot;&gt;
			 *        &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.IsFiscalYearWeek&quot; Bool=&quot;true&quot;/&gt;
			 *    &lt;/Annotations&gt;
			 * </pre>
			 */
			fiscalYearWeek: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "IsFiscalYearWeek",
				target: [
					"Property"
				],
				defaultValue: true,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Appearance", "Behavior"
				],
				since: "1.74"
			},

			/**
			 * Indicates whether the annotated <code>Property</code> is a string that is based on a fiscal date following the 'd' pattern.
			 *
			 * Intended for <code>Edm.String</code> properties that are stored as ABAP and follow the 'd' pattern.
			 *
			 * <b>Note:</b> The <code>IsDayOfFiscalYear</code> annotation is currently experimental and might be renamed or redefined.
			 *
			 * <i>XML Example of the OData V4 Annotation</i>
			 *
			 * <pre>
			 *    &lt;Property Name=&quot;Price&quot; Type=&quot;Edm.String&quot;/&gt;
			 *    &lt;Annotations Target=&quot;Price&quot;&gt;
			 *        &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.IsDayOfFiscalYear&quot; Bool=&quot;true&quot;/&gt;
			 *    &lt;/Annotations&gt;
			 * </pre>
			 */
			dayOfFiscalYear: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "IsDayOfFiscalYear",
				target: [
					"Property"
				],
				defaultValue: true,
				appliesTo: [
					"fieldItem/#/value"
				],
				group: [
					"Appearance", "Behavior"
				],
				since: "1.74"
			}
		},

		properties: {
			value: {
				ignore: true
			},
			enabled: {
				ignore: true
			},
			entitySet: {
				ignore: true
			// can be used only in a static way
			},
			editable: {
				ignore: true
			},
			contextEditable: {
				ignore: true
			},
			width: {
				ignore: true
			},
			textAlign: {
				ignore: true
			},
			placeholder: {
				ignore: true
			},
			name: {
				ignore: true
			},
			valueState: {
				ignore: true
			},
			valueStateText: {
				ignore: true
			},
			showValueStateMessage: {
				ignore: true
			},
			jsontype: {
				ignore: true
			},
			mandatory: {
				ignore: true
			},
			maxLength: {
				ignore: true
			},
			showSuggestion: {
				ignore: true
			},
			showValueHelp: {
				ignore: false
			},
			showLabel: {
				ignore: true
			},
			textLabel: {
				ignore: true
			},
			tooltipLabel: {
				ignore: true
			},
			uomVisible: {
				ignore: true
			},
			uomEditable: {
				ignore: true
			},
			uomEnabled: {
				ignore: true
			},
			url: {
				ignore: true
			},
			uomEditState: {
				ignore: true
			},
			controlContext: {
				ignore: true
			// can be used only in a static way
			},
			proposedControl: {
				ignore: true
			},
			wrapping: {
				ignore: true
			},
			clientSideMandatoryCheck: {
				ignore: true
			},
			fetchValueListReadOnly: {
				ignore: true
			},
			expandNavigationProperties: {
				ignore: true
			},
			textInEditModeSource: {
				ignore: false
			}
		},
		aggregations: {
			_content: {
				ignore: function(oSmartField){
					var oInternalControl = oSmartField.getContent();
					if (oInternalControl) {
						return oInternalControl.getMetadata().getName() !== "sap.ui.comp.navpopover.SmartLink";
					} else {
						return true;
					}
				}
			}
		},

		customData: {
			/**
			 * Overrides the default settings for formatting dates inside the control.
			 *
			 * For more information see {@link sap.ui.model.type.Date}
			 */
			dateFormatSettings: {
				type: "string",
				defaultValue: "\{'UTC':'true'\}",
				group: ["Appearance"],
				since: "1.28.1"
			},
			/**
			 * Used to select from the different options to define display behavior of a SmartField control.
			 *
			 * For more information see {@link sap.ui.comp.smartfield.DisplayBehaviour}
			 */
			displayBehaviour: {
				type: "sap.ui.comp.smartfield.DisplayBehaviour",
				defaultValue: "auto",
				since: "1.28.1"
			},
			/**
			 * If set to <code>true</code> then for currency or measure field the unit is not shown.
			 */
			suppressUnit: {
				type: "boolean",
				defaultValue: false,
				group: ["Appearance"],
				since: "1.28.1"
			},
			/**
			 * JSON object to configure how longer text are displayed in a text area.
			 */
			multiLineSettings: {
				type: "object",
				defaultValue: "{cols: 20, rows: 2}",
				group: ["Appearance"],
				since: "1.28.1"
			}
		}
	};
});