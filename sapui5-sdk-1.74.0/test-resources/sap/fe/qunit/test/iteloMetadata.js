sap.ui.define([], function() {
	"use strict";
	return {
		"$Version": "4.0",
		"$Reference": {
			"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_UI',Version='0001',SAP__Origin='LOCAL')/$value": {
				"$Include": ["com.sap.vocabularies.UI.v1."]
			},
			"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_COMMUNICATION',Version='0001',SAP__Origin='LOCAL')/$value": {
				"$Include": ["com.sap.vocabularies.Communication.v1."]
			},
			"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_COMMON',Version='0001',SAP__Origin='LOCAL')/$value": {
				"$Include": ["com.sap.vocabularies.Common.v1."]
			},
			"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_MEASURES',Version='0001',SAP__Origin='LOCAL')/$value": {
				"$Include": ["Org.OData.Measures.V1."]
			},
			"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_CORE',Version='0001',SAP__Origin='LOCAL')/$value": {
				"$Include": ["Org.OData.Core.V1."]
			},
			"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_CAPABILITIES',Version='0001',SAP__Origin='LOCAL')/$value": {
				"$Include": ["Org.OData.Capabilities.V1."]
			},
			"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_AGGREGATION',Version='0001',SAP__Origin='LOCAL')/$value": {
				"$Include": ["Org.OData.Aggregation.V1."]
			},
			"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_VALIDATION',Version='0001',SAP__Origin='LOCAL')/$value": {
				"$Include": ["Org.OData.Validation.V1."]
			}
		},
		"com.sap.gateway.srvd.abmp_man_product.v0001.": {
			"$kind": "Schema",
			"$Annotations": {
				"com.sap.gateway.srvd.abmp_man_product.v0001.Stock_Availability_VHType/code": {
					"@com.sap.vocabularies.Common.v1.Label": "Stock ID",
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "name"
					},
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Stock Availabilities",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Stock Availablity"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Stock_Availability_VHType/name": {
					"@com.sap.vocabularies.Common.v1.Label": "Name",
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Stock_Availability_VHType": {
					"@com.sap.vocabularies.Common.v1.Label": "Angry Bird Managed Prod: Stock Avail VH"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Container/Stock_Availability_VH": {
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": false
					},
					"@Org.OData.Capabilities.V1.InsertRestrictions": {
						"Insertable": false
					},
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						"Deletable": false
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.PriceRangeType/code": {
					"@com.sap.vocabularies.Common.v1.Label": "Price Range Code",
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "name"
					},
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Price Range",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Stock Availablity"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.PriceRangeType/name": {
					"@com.sap.vocabularies.Common.v1.Label": "Price Range"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.PriceRangeType": {
					"@com.sap.vocabularies.Common.v1.Label": "Price Range"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Container/PriceRange": {
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": false
					},
					"@Org.OData.Capabilities.V1.InsertRestrictions": {
						"Insertable": false
					},
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						"Deletable": false
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Supplier_VHType/ID": {
					"@com.sap.vocabularies.Common.v1.Label": "Supplier ID",
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "name"
					},
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Generic Node Key",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Generic Node Key"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Supplier_VHType/name": {
					"@com.sap.vocabularies.Common.v1.Label": "Supplier Name"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Supplier_VHType/emailAddress": {
					"@com.sap.vocabularies.Common.v1.Label": "eMail Address",
					"@com.sap.vocabularies.Common.v1.Heading": "Email",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: E-Mail Address"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Supplier_VHType/faxNumber": {
					"@com.sap.vocabularies.Common.v1.Label": "Fax Number",
					"@com.sap.vocabularies.Common.v1.Heading": "Fax",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Fax Number"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Supplier_VHType/phoneNumber": {
					"@com.sap.vocabularies.Common.v1.Label": "Phonenumber",
					"@com.sap.vocabularies.Common.v1.Heading": "Phone",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Phone Number"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Supplier_VHType": {
					"@com.sap.vocabularies.Common.v1.Label": "Angry Bird Managed Prod: Supplier VH",
					"@com.sap.vocabularies.Communication.v1.Contact": {
						"fn": {
							"$Path": "name"
						},
						"tel": [
							{
								"type": {
									"$EnumMember": "com.sap.vocabularies.Communication.v1.PhoneType/fax"
								},
								"uri": {
									"$Path": "faxNumber"
								}
							},
							{
								"type": {
									"$EnumMember": "com.sap.vocabularies.Communication.v1.PhoneType/work"
								},
								"uri": {
									"$Path": "phoneNumber"
								}
							}
						],
						"email": [
							{
								"address": {
									"$Path": "emailAddress"
								}
							}
						]
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Container/Supplier_VH": {
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": true,
						"UnsupportedExpressions": {
							"$EnumMember":
								"Org.OData.Capabilities.V1.SearchExpressions/AND Org.OData.Capabilities.V1.SearchExpressions/OR Org.OData.Capabilities.V1.SearchExpressions/NOT Org.OData.Capabilities.V1.SearchExpressions/group Org.OData.Capabilities.V1.SearchExpressions/phrase"
						}
					},
					"@Org.OData.Capabilities.V1.InsertRestrictions": {
						"Insertable": false
					},
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						"Deletable": false
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Product_TextType/id": {
					"@com.sap.vocabularies.Common.v1.Label": "Product ID",
					"@com.sap.vocabularies.Common.v1.Heading": "Product Id",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Product Id"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Product_TextType/name": {
					"@com.sap.vocabularies.Common.v1.Label": "Product Name"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Product_TextType/description": {
					"@com.sap.vocabularies.Common.v1.Label": "Product Description"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Product_TextType": {
					"@com.sap.vocabularies.Common.v1.Label": "Product Text",
					"@com.sap.vocabularies.Communication.v1.Contact": {}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Container/Product_Text": {
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": true,
						"UnsupportedExpressions": {
							"$EnumMember":
								"Org.OData.Capabilities.V1.SearchExpressions/AND Org.OData.Capabilities.V1.SearchExpressions/OR Org.OData.Capabilities.V1.SearchExpressions/NOT Org.OData.Capabilities.V1.SearchExpressions/group Org.OData.Capabilities.V1.SearchExpressions/phrase"
						}
					},
					"@Org.OData.Capabilities.V1.InsertRestrictions": {
						"Insertable": false
					},
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						"Deletable": false
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/ID": {
					"@com.sap.vocabularies.Common.v1.Label": "ID",
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "name"
					},
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Generic Node Key",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Generic Node Key"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/product": {
					"@com.sap.vocabularies.Common.v1.Label": "Product",
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "name"
					},
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
					},
					"@com.sap.vocabularies.Common.v1.Heading": "Product Id",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Product Id"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/name": {
					"@com.sap.vocabularies.Common.v1.Label": "Name",
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/description": {
					"@com.sap.vocabularies.Common.v1.Label": "Description",
					"@com.sap.vocabularies.UI.v1.MultiLineText": true
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/Category_ID": {
					"@com.sap.vocabularies.Common.v1.Label": "Category",
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "Category_ID_Text"
					},
					"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement": {
						"$EnumMember": "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
					},
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
					},
					"@com.sap.vocabularies.Common.v1.ValueListReferences": [
						"../../../../srvd_f4/sap/abmp_c_category/0001;ps='srvd-abmp_man_product-0001';va='com.sap.gateway.srvd.abmp_man_product.v0001.et-abmp_c_product_tp_uwt.category_id'/$metadata"
					],
					"@com.sap.vocabularies.Common.v1.Heading": "Generic Node Key",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Generic Node Key"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/Category_ID_Text": {
					"@com.sap.vocabularies.Common.v1.Label": "Name",
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/Image_URL": {
					"@com.sap.vocabularies.Common.v1.Label": "Product Image",
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.UI.v1.IsImageURL": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Image URL",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Image"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/Price": {
					"@com.sap.vocabularies.Common.v1.Label": "Price",
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
					},
					"@com.sap.vocabularies.Common.v1.Heading": "Price",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Total Gross Amount",
					"@Org.OData.Measures.V1.ISOCurrency": {
						"$Path": "Currency"
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/Currency": {
					"@com.sap.vocabularies.Common.v1.Label": "Currency",
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
					},
					"@com.sap.vocabularies.Common.v1.ValueListReferences": [
						"../../../../srvd_f4/sap/i_currency/0001;ps='srvd-abmp_man_product-0001';va='com.sap.gateway.srvd.abmp_man_product.v0001.et-abmp_c_product_tp_uwt.currency'/$metadata"
					],
					"@com.sap.vocabularies.Common.v1.Heading": "ISO Currency Code",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Currency Code"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/PriceRange_Code": {
					"@com.sap.vocabularies.Common.v1.Label": "Price range",
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "_PriceRange/name"
					},
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.ValueListReferences": [
						"../../../../srvd_f4/sap/abmp_i_pricerange/0001;ps='srvd-abmp_man_product-0001';va='com.sap.gateway.srvd.abmp_man_product.v0001.et-abmp_c_product_tp_uwt.pricerange_code'/$metadata"
					],
					"@com.sap.vocabularies.Common.v1.ValueListWithFixedValues": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Price Range",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Stock Availablity"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/Height": {
					"@com.sap.vocabularies.Common.v1.Label": "Heigth",
					"@com.sap.vocabularies.Common.v1.Heading": "Product Height",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Height",
					"@Org.OData.Measures.V1.Unit": {
						"$Path": "DimensionUnit_Code"
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/Width": {
					"@com.sap.vocabularies.Common.v1.Label": "Width",
					"@com.sap.vocabularies.Common.v1.Heading": "Product Width",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Width",
					"@Org.OData.Measures.V1.Unit": {
						"$Path": "DimensionUnit_Code"
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/Depth": {
					"@com.sap.vocabularies.Common.v1.Label": "Depth",
					"@com.sap.vocabularies.Common.v1.Heading": "Product Depth",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Depth",
					"@Org.OData.Measures.V1.Unit": {
						"$Path": "DimensionUnit_Code"
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/DimensionUnit_Code": {
					"@com.sap.vocabularies.Common.v1.Label": "Dimension Unit",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Dimension Unit Code"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/Weight": {
					"@com.sap.vocabularies.Common.v1.Label": "Weight",
					"@com.sap.vocabularies.Common.v1.Heading": "Weight",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Weight Measure",
					"@Org.OData.Measures.V1.Unit": {
						"$Path": "WeightUnit_Code"
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/WeightUnit_Code": {
					"@com.sap.vocabularies.Common.v1.Label": "Weight Unit",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Weight Unit Code"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/BaseUnit_Code": {
					"@com.sap.vocabularies.Common.v1.Label": "Base Unit",
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
					},
					"@com.sap.vocabularies.Common.v1.ValueListReferences": [
						"../../../../srvd_f4/sap/abmp_i_baseunit/0001;ps='srvd-abmp_man_product-0001';va='com.sap.gateway.srvd.abmp_man_product.v0001.et-abmp_c_product_tp_uwt.baseunit_code'/$metadata"
					],
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Base Unit Code"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/Supplier_ID": {
					"@com.sap.vocabularies.Common.v1.Label": "Supplier",
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "Supplier_ID_Text"
					},
					"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement": {
						"$EnumMember": "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
					},
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
					},
					"@com.sap.vocabularies.Common.v1.ValueListReferences": [
						"../../../../srvd_f4/sap/abmp_c_supplier_vh/0001;ps='srvd-abmp_man_product-0001';va='com.sap.gateway.srvd.abmp_man_product.v0001.et-abmp_c_product_tp_uwt.supplier_id'/$metadata"
					],
					"@com.sap.vocabularies.Common.v1.Heading": "Generic Node Key",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Generic Node Key"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/Supplier_ID_Text": {
					"@com.sap.vocabularies.Common.v1.Label": "Supplier Name",
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/minimumQuantity": {
					"@com.sap.vocabularies.Common.v1.Label": "Minimum Quantity",
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/quantity": {
					"@com.sap.vocabularies.Common.v1.Label": "Quantity",
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/availability_code": {
					"@com.sap.vocabularies.Common.v1.Label": "Availability Code",
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "availability_code_Text"
					},
					"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement": {
						"$EnumMember": "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
					},
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.ValueListReferences": [
						"../../../../srvd_f4/sap/abmp_c_stock_availability_vh/0001;ps='srvd-abmp_man_product-0001';va='com.sap.gateway.srvd.abmp_man_product.v0001.et-abmp_c_product_tp_uwt.availability_code'/$metadata"
					],
					"@com.sap.vocabularies.Common.v1.ValueListWithFixedValues": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Stock Availabilities",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Stock Availablity"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/availability_code_Text": {
					"@com.sap.vocabularies.Common.v1.Label": "Availability",
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/averageRating": {
					"@com.sap.vocabularies.Common.v1.Label": "Average Rating",
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/numberOfReviews": {
					"@com.sap.vocabularies.Common.v1.Label": "Review Count",
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/Created_ByUser": {
					"@com.sap.vocabularies.Common.v1.Label": "Created by"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/Modified_ByUser": {
					"@com.sap.vocabularies.Common.v1.Label": "Modified by",
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/Created_At": {
					"@com.sap.vocabularies.Common.v1.Label": "Created at",
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Time Stamp",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UTC Time Stamp in Short Form (YYYYMMDDhhmmss)"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/Modified_At": {
					"@com.sap.vocabularies.Common.v1.Label": "Modified at",
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Time Stamp",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UTC Time Stamp in Short Form (YYYYMMDDhhmmss)"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/HasDraftEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Has Draft",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Has draft document"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/ActiveUUID": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Key",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID serving as key (parent key, root key)"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/DraftEntityCreationDateTime": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Created On"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/DraftEntityLastChangeDateTime": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Last Changed On"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/HasActiveEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Has active",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Has active document"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/IsActiveEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Is active",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Is active document"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Container/Products": {
					"@com.sap.vocabularies.Common.v1.DraftRoot": {
						"ValidationFunction": "com.sap.gateway.srvd.abmp_man_product.v0001.ValidationFunction",
						"ActivationAction": "com.sap.gateway.srvd.abmp_man_product.v0001.ActivationAction",
						"EditAction": "com.sap.gateway.srvd.abmp_man_product.v0001.EditAction",
						"PreparationAction": "com.sap.gateway.srvd.abmp_man_product.v0001.PreparationAction"
					},
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": true,
						"UnsupportedExpressions": {
							"$EnumMember":
								"Org.OData.Capabilities.V1.SearchExpressions/AND Org.OData.Capabilities.V1.SearchExpressions/OR Org.OData.Capabilities.V1.SearchExpressions/NOT Org.OData.Capabilities.V1.SearchExpressions/group Org.OData.Capabilities.V1.SearchExpressions/phrase"
						}
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType": {
					"@com.sap.vocabularies.Common.v1.Label": "Angry Bird Managed Product: Consumption",
					"@com.sap.vocabularies.Common.v1.SemanticKey": [
						{
							"$PropertyPath": "product"
						}
					],
					"@com.sap.vocabularies.UI.v1.DataPoint#Price": {
						"Value": {
							"$Path": "Price"
						},
						"Title": "Price"
					},
					"@com.sap.vocabularies.UI.v1.DataPoint#availability_code": {
						"Value": {
							"$Path": "availability_code"
						},
						"Title": "Availability",
						"Criticality": {
							"$Path": "availability_code"
						}
					},
					"@com.sap.vocabularies.UI.v1.DataPoint#averageRating": {
						"Value": {
							"$Path": "averageRating"
						},
						"Title": "Average Rating",
						"Visualization": {
							"$EnumMember": "com.sap.vocabularies.UI.v1.VisualizationType/Rating"
						}
					},
					"@com.sap.vocabularies.UI.v1.DataPoint#description": {
						"Value": {
							"$Path": "description"
						},
						"Title": "Description"
					},
					"@com.sap.vocabularies.UI.v1.Facets": [
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							"$Type": "com.sap.vocabularies.UI.v1.CollectionFacet",
							"Label": "Product Details",
							"ID": "ProductDetails",
							"Facets": [
								{
									"@com.sap.vocabularies.UI.v1.Importance": {
										"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
									},
									"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
									"Label": "General Information",
									"ID": "GeneralInformation",
									"Target": {
										"$AnnotationPath": "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInfoHead"
									}
								},
								{
									"@com.sap.vocabularies.UI.v1.Importance": {
										"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
									},
									"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
									"Label": "Technical Data",
									"ID": "TechnicalData",
									"Target": {
										"$AnnotationPath": "@com.sap.vocabularies.UI.v1.FieldGroup#TechnicalData"
									}
								},
								{
									"@com.sap.vocabularies.UI.v1.Importance": {
										"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
									},
									"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
									"Label": "Administrative Data",
									"ID": "AdministrativeData",
									"Target": {
										"$AnnotationPath": "@com.sap.vocabularies.UI.v1.FieldGroup#AdministrativeData"
									}
								}
							]
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"Label": "Rating",
							"ID": "RatingList",
							"Target": {
								"$AnnotationPath": "reviews/@com.sap.vocabularies.UI.v1.LineItem"
							}
						}
					],
					"@com.sap.vocabularies.UI.v1.HeaderFacets": [
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"Label": "Availability",
							"ID": "Availability",
							"Target": {
								"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#availability_code"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"Label": "Rating",
							"ID": "Rating",
							"Target": {
								"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#averageRating"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"Label": "Price",
							"ID": "Price",
							"Target": {
								"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#Price"
							}
						}
					],
					"@com.sap.vocabularies.UI.v1.FieldGroup#AdministrativeData": {
						"Data": [
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Label": "Created at",
								"Value": {
									"$Path": "Created_At"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Label": "Created by",
								"Value": {
									"$Path": "Created_ByUser"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Label": "Modified at",
								"Value": {
									"$Path": "Modified_At"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Label": "Modified by",
								"Value": {
									"$Path": "Modified_ByUser"
								}
							}
						],
						"Label": "Administrative Data"
					},
					"@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInfoHead": {
						"Data": [
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "product"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "name"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "description"
								}
							},
							{
								"@com.sap.vocabularies.UI.v1.Importance": {
									"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
								},
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Category_ID"
								}
							},
							{
								"@com.sap.vocabularies.UI.v1.Importance": {
									"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
								},
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Label": "Supplier",
								"Value": {
									"$Path": "Supplier_ID"
								}
							}
						],
						"Label": "Description"
					},
					"@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation": {
						"Data": [
							{
								"@com.sap.vocabularies.UI.v1.Importance": {
									"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
								},
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "product"
								}
							},
							{
								"@com.sap.vocabularies.UI.v1.Importance": {
									"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
								},
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "name"
								}
							},
							{
								"@com.sap.vocabularies.UI.v1.Importance": {
									"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
								},
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Category_ID"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "description"
								}
							},
							{
								"@com.sap.vocabularies.UI.v1.Importance": {
									"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
								},
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Price"
								}
							},
							{
								"@com.sap.vocabularies.UI.v1.Importance": {
									"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
								},
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Supplier_ID"
								}
							}
						],
						"Label": "Product Information"
					},
					"@com.sap.vocabularies.UI.v1.FieldGroup#TechnicalData": {
						"Data": [
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "BaseUnit_Code"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Weight"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Depth"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Width"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Height"
								}
							}
						],
						"Label": "Administrative Data"
					},
					"@com.sap.vocabularies.UI.v1.HeaderInfo": {
						"TypeName": "Angry Bird Manage Products",
						"TypeNamePlural": "Angry Bird Manage Products",
						"Title": {
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Manage Products",
							"Value": {
								"$Path": "name"
							}
						},
						"Description": {
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Product",
							"Value": {
								"$Path": "product"
							}
						}
					},
					"@com.sap.vocabularies.UI.v1.Identification": [
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Product",
							"Value": {
								"$Path": "product"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Base Unit",
							"Value": {
								"$Path": "BaseUnit_Code"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Name",
							"Value": {
								"$Path": "name"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Height",
							"Value": {
								"$Path": "Height"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Category",
							"Value": {
								"$Path": "Category_ID"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Width",
							"Value": {
								"$Path": "Width"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Description",
							"Value": {
								"$Path": "description"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Depth",
							"Value": {
								"$Path": "Depth"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Price",
							"Value": {
								"$Path": "Price"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Supplier",
							"Value": {
								"$Path": "Supplier_ID"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Weight",
							"Value": {
								"$Path": "Weight"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Created at",
							"Value": {
								"$Path": "Created_At"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Created by",
							"Value": {
								"$Path": "Created_ByUser"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Modified at",
							"Value": {
								"$Path": "Modified_At"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Modified by",
							"Value": {
								"$Path": "Modified_ByUser"
							}
						}
					],
					"@com.sap.vocabularies.UI.v1.LineItem": [
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Product",
							"Value": {
								"$Path": "product"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Category",
							"Value": {
								"$Path": "Category_ID"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
							"Label": "Supplier",
							"Target": {
								"$AnnotationPath": "_Supplier/@com.sap.vocabularies.Communication.v1.Contact"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Availability",
							"Criticality": {
								"$Path": "availability_code"
							},
							"Value": {
								"$Path": "availability_code"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Low"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
							"Label": "Rating",
							"Target": {
								"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#averageRating"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Price",
							"Value": {
								"$Path": "Price"
							}
						}
					],
					"@com.sap.vocabularies.UI.v1.SelectionFields": [
						{
							"$PropertyPath": "Supplier_ID"
						},
						{
							"$PropertyPath": "PriceRange_Code"
						},
						{
							"$PropertyPath": "availability_code"
						},
						{
							"$PropertyPath": "Category_ID"
						}
					],
					"@com.sap.vocabularies.Common.v1.SemanticObject": "EPMProduct",
					"@com.sap.vocabularies.Communication.v1.Contact": {
						"fn": {
							"$Path": "Supplier_ID_Text"
						}
					},
					"@com.sap.vocabularies.Common.v1.Messages": {
						"$Path": "SAP__Messages"
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.StocksType/ID": {
					"@com.sap.vocabularies.Common.v1.Label": "Stock ID",
					"@com.sap.vocabularies.Common.v1.Heading": "Generic Node Key",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Generic Node Key"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.StocksType/quantity": {
					"@com.sap.vocabularies.Common.v1.Label": "Quantity"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.StocksType/minimumQuantity": {
					"@com.sap.vocabularies.Common.v1.Label": "Minimum Quantity"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.StocksType/availability_code": {
					"@com.sap.vocabularies.Common.v1.Label": "Availability Code",
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "availability_code_Text"
					},
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Stock Availabilities",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Stock Availablity"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.StocksType/availability_code_Text": {
					"@com.sap.vocabularies.Common.v1.Label": "Availability",
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.StocksType/created_at": {
					"@com.sap.vocabularies.Common.v1.Label": "Created at",
					"@com.sap.vocabularies.Common.v1.Heading": "Time Stamp",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UTC Time Stamp in Short Form (YYYYMMDDhhmmss)"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.StocksType/created_byUser": {
					"@com.sap.vocabularies.Common.v1.Label": "Created by"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.StocksType/modified_at": {
					"@com.sap.vocabularies.Common.v1.Label": "Modified at",
					"@com.sap.vocabularies.Common.v1.Heading": "Time Stamp",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UTC Time Stamp in Short Form (YYYYMMDDhhmmss)"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.StocksType/modified_byUser": {
					"@com.sap.vocabularies.Common.v1.Label": "Modified by"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.StocksType": {
					"@com.sap.vocabularies.Common.v1.Label": "ABMP Stock"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Container/Stocks": {
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": false
					},
					"@Org.OData.Capabilities.V1.InsertRestrictions": {
						"Insertable": false
					},
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						"Deletable": false
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.CurrenciesType/code": {
					"@com.sap.vocabularies.Common.v1.Label": "Currency Code",
					"@com.sap.vocabularies.Common.v1.Heading": "Crcy",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Currency Key"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.CurrenciesType/name": {
					"@com.sap.vocabularies.Common.v1.Label": "Currency Name",
					"@com.sap.vocabularies.Common.v1.Heading": "Description",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Description"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.CurrenciesType": {
					"@com.sap.vocabularies.Common.v1.Label": "Currency"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Container/Currencies": {
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": true,
						"UnsupportedExpressions": {
							"$EnumMember":
								"Org.OData.Capabilities.V1.SearchExpressions/AND Org.OData.Capabilities.V1.SearchExpressions/OR Org.OData.Capabilities.V1.SearchExpressions/NOT Org.OData.Capabilities.V1.SearchExpressions/group Org.OData.Capabilities.V1.SearchExpressions/phrase"
						}
					},
					"@Org.OData.Capabilities.V1.InsertRestrictions": {
						"Insertable": false
					},
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						"Deletable": false
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.DimensionUnitsType/code": {
					"@com.sap.vocabularies.Common.v1.Label": "Dimension Unit Code",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Dimension Unit Code"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.DimensionUnitsType/name": {
					"@com.sap.vocabularies.Common.v1.Label": "Dimension"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.DimensionUnitsType": {
					"@com.sap.vocabularies.Common.v1.Label": "Length unit"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Container/DimensionUnits": {
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": true,
						"UnsupportedExpressions": {
							"$EnumMember":
								"Org.OData.Capabilities.V1.SearchExpressions/AND Org.OData.Capabilities.V1.SearchExpressions/OR Org.OData.Capabilities.V1.SearchExpressions/NOT Org.OData.Capabilities.V1.SearchExpressions/group Org.OData.Capabilities.V1.SearchExpressions/phrase"
						}
					},
					"@Org.OData.Capabilities.V1.InsertRestrictions": {
						"Insertable": false
					},
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						"Deletable": false
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.SupplierType/ID": {
					"@com.sap.vocabularies.Common.v1.Label": "Supplier ID",
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "name"
					},
					"@com.sap.vocabularies.Common.v1.Heading": "Generic Node Key",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Generic Node Key"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.SupplierType/name": {
					"@com.sap.vocabularies.Common.v1.Label": "Supplier Name"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.SupplierType/emailAddress": {
					"@com.sap.vocabularies.Common.v1.Label": "eMail Address",
					"@com.sap.vocabularies.Common.v1.Heading": "Email",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: E-Mail Address"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.SupplierType/faxNumber": {
					"@com.sap.vocabularies.Common.v1.Label": "Fax Number",
					"@com.sap.vocabularies.Common.v1.Heading": "Fax",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Fax Number"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.SupplierType/phoneNumber": {
					"@com.sap.vocabularies.Common.v1.Label": "Phonenumber",
					"@com.sap.vocabularies.Common.v1.Heading": "Phone",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Phone Number"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.SupplierType/created_at": {
					"@com.sap.vocabularies.Common.v1.Label": "Created at",
					"@com.sap.vocabularies.Common.v1.Heading": "Time Stamp",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UTC Time Stamp in Short Form (YYYYMMDDhhmmss)"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.SupplierType/created_byUser": {
					"@com.sap.vocabularies.Common.v1.Label": "Created by"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.SupplierType/modified_at": {
					"@com.sap.vocabularies.Common.v1.Label": "Modified at",
					"@com.sap.vocabularies.Common.v1.Heading": "Time Stamp",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UTC Time Stamp in Short Form (YYYYMMDDhhmmss)"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.SupplierType/modified_byUser": {
					"@com.sap.vocabularies.Common.v1.Label": "Modified by"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.SupplierType": {
					"@com.sap.vocabularies.Common.v1.Label": "Supplier",
					"@com.sap.vocabularies.Communication.v1.Contact": {
						"fn": {
							"$Path": "name"
						},
						"tel": [
							{
								"type": {
									"$EnumMember": "com.sap.vocabularies.Communication.v1.PhoneType/fax"
								},
								"uri": {
									"$Path": "faxNumber"
								}
							},
							{
								"type": {
									"$EnumMember": "com.sap.vocabularies.Communication.v1.PhoneType/work"
								},
								"uri": {
									"$Path": "phoneNumber"
								}
							}
						],
						"email": [
							{
								"address": {
									"$Path": "emailAddress"
								}
							}
						]
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Container/Supplier": {
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": true,
						"UnsupportedExpressions": {
							"$EnumMember":
								"Org.OData.Capabilities.V1.SearchExpressions/AND Org.OData.Capabilities.V1.SearchExpressions/OR Org.OData.Capabilities.V1.SearchExpressions/NOT Org.OData.Capabilities.V1.SearchExpressions/group Org.OData.Capabilities.V1.SearchExpressions/phrase"
						}
					},
					"@Org.OData.Capabilities.V1.InsertRestrictions": {
						"Insertable": false
					},
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						"Deletable": false
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.StockAvailabilitiesType/code": {
					"@com.sap.vocabularies.Common.v1.Label": "Stock ID",
					"@com.sap.vocabularies.Common.v1.Heading": "Stock Availabilities",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Stock Availablity"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.StockAvailabilitiesType/name": {
					"@com.sap.vocabularies.Common.v1.Label": "Availability",
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.StockAvailabilitiesType": {
					"@com.sap.vocabularies.Common.v1.Label": "ABMP Stock Availabilities"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Container/StockAvailabilities": {
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": false
					},
					"@Org.OData.Capabilities.V1.InsertRestrictions": {
						"Insertable": false
					},
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						"Deletable": false
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType/CreatedByUser": {
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "CreatedByUserDescription"
					},
					"@com.sap.vocabularies.Common.v1.Label": "Draft Created By"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType/LastChangedByUser": {
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "LastChangedByUserDescription"
					},
					"@com.sap.vocabularies.Common.v1.Label": "Draft Last Changed By"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType/InProcessByUser": {
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "InProcessByUserDescription"
					},
					"@com.sap.vocabularies.Common.v1.Label": "Draft In Process By"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType": {
					"@com.sap.vocabularies.Common.v1.Label": "Draft Administration Data"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Container/I_DraftAdministrativeData": {
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": true,
						"UnsupportedExpressions": {
							"$EnumMember":
								"Org.OData.Capabilities.V1.SearchExpressions/AND Org.OData.Capabilities.V1.SearchExpressions/OR Org.OData.Capabilities.V1.SearchExpressions/NOT Org.OData.Capabilities.V1.SearchExpressions/group Org.OData.Capabilities.V1.SearchExpressions/phrase"
						}
					},
					"@Org.OData.Capabilities.V1.InsertRestrictions": {
						"Insertable": false
					},
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						"Deletable": false
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.BaseUnitsType/code": {
					"@com.sap.vocabularies.Common.v1.Label": "Base Unit Code",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Base Unit Code"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.BaseUnitsType/name": {
					"@com.sap.vocabularies.Common.v1.Label": "Base Unit"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.BaseUnitsType": {
					"@com.sap.vocabularies.Common.v1.Label": "Base unit"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Container/BaseUnits": {
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": true,
						"UnsupportedExpressions": {
							"$EnumMember":
								"Org.OData.Capabilities.V1.SearchExpressions/AND Org.OData.Capabilities.V1.SearchExpressions/OR Org.OData.Capabilities.V1.SearchExpressions/NOT Org.OData.Capabilities.V1.SearchExpressions/group Org.OData.Capabilities.V1.SearchExpressions/phrase"
						}
					},
					"@Org.OData.Capabilities.V1.InsertRestrictions": {
						"Insertable": false
					},
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						"Deletable": false
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Category_VHType/ID": {
					"@com.sap.vocabularies.Common.v1.Label": "Category ID",
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "name"
					},
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Generic Node Key",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Generic Node Key"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Category_VHType/name": {
					"@com.sap.vocabularies.Common.v1.Label": "Name"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Category_VHType/description": {
					"@com.sap.vocabularies.Common.v1.Label": "Description"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Category_VHType": {
					"@com.sap.vocabularies.Common.v1.Label": "Category"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Container/Category_VH": {
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": true,
						"UnsupportedExpressions": {
							"$EnumMember":
								"Org.OData.Capabilities.V1.SearchExpressions/AND Org.OData.Capabilities.V1.SearchExpressions/OR Org.OData.Capabilities.V1.SearchExpressions/NOT Org.OData.Capabilities.V1.SearchExpressions/group Org.OData.Capabilities.V1.SearchExpressions/phrase"
						}
					},
					"@Org.OData.Capabilities.V1.InsertRestrictions": {
						"Insertable": false
					},
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						"Deletable": false
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/ID": {
					"@com.sap.vocabularies.Common.v1.Label": "Review ID",
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Generic Node Key",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Generic Node Key"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/Product_ID": {
					"@com.sap.vocabularies.Common.v1.Label": "Product ID",
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "_Product/name"
					},
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Generic Node Key",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Generic Node Key"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/Reviewer_ID": {
					"@com.sap.vocabularies.Common.v1.Label": "Reviewer ID",
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "Reviewer_ID_Text"
					},
					"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement": {
						"$EnumMember": "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
					},
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Reviewer ID",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Reviewer ID"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/Reviewer_ID_Text": {
					"@com.sap.vocabularies.Common.v1.Label": "Name",
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/Title": {
					"@com.sap.vocabularies.Common.v1.Label": "Title",
					"@com.sap.vocabularies.Common.v1.Heading": "Review Title",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Angry Bird: Review Title"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/Message": {
					"@com.sap.vocabularies.Common.v1.Label": "Message",
					"@com.sap.vocabularies.UI.v1.MultiLineText": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Review Message",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Angry Bird: Review Message"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/Rating": {
					"@com.sap.vocabularies.Common.v1.Label": "Rating",
					"@com.sap.vocabularies.Common.v1.Heading": "Review Rating",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Angry Bird: Review Rating"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/HelpfulCount": {
					"@com.sap.vocabularies.Common.v1.Label": "Rated Helpful",
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Helpful Count",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Angry Bird: Review Helpful Count"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/HelpfulTotal": {
					"@com.sap.vocabularies.Common.v1.Label": "Total Helpful ratings",
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Total Count of Helpful Function",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Angry Bird: Review Helpful Total Count"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/Created_ByUser": {
					"@com.sap.vocabularies.Common.v1.Label": "Created by",
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/Modified_ByUser": {
					"@com.sap.vocabularies.Common.v1.Label": "Modified by",
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/Created_At": {
					"@com.sap.vocabularies.Common.v1.Label": "At",
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Time Stamp",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UTC Time Stamp in Short Form (YYYYMMDDhhmmss)"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/Modified_At": {
					"@com.sap.vocabularies.Common.v1.Label": "Modified at",
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Time Stamp",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UTC Time Stamp in Short Form (YYYYMMDDhhmmss)"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/HasDraftEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Has Draft",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Has draft document"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/ActiveUUID": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Key",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID serving as key (parent key, root key)"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/DraftEntityCreationDateTime": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Created On"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/DraftEntityLastChangeDateTime": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Last Changed On"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/HasActiveEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Has active",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Has active document"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/IsActiveEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Is active",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Is active document"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Container/Reviews": {
					"@com.sap.vocabularies.Common.v1.DraftNode": {
						"ValidationFunction": "com.sap.gateway.srvd.abmp_man_product.v0001.ValidationFunction",
						"PreparationAction": "com.sap.gateway.srvd.abmp_man_product.v0001.PreparationAction"
					},
					"@com.sap.vocabularies.Common.v1.DraftActivationVia": ["SAP__self.Container/Products"],
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": false
					},
					"@Org.OData.Capabilities.V1.FilterRestrictions": {
						"Filterable": true,
						"FilterExpressionRestrictions": [
							{
								"Property": {
									"$PropertyPath": "Reviewer_ID_Text"
								},
								"AllowedExpressions": "SearchExpression"
							},
							{
								"Property": {
									"$PropertyPath": "Title"
								},
								"AllowedExpressions": "SearchExpression"
							},
							{
								"Property": {
									"$PropertyPath": "Message"
								},
								"AllowedExpressions": "SearchExpression"
							}
						]
					},
					"@Org.OData.Capabilities.V1.SortRestrictions": {
						"NonSortableProperties": [
							{
								"$PropertyPath": "Reviewer_ID_Text"
							},
							{
								"$PropertyPath": "Title"
							},
							{
								"$PropertyPath": "Message"
							}
						]
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType": {
					"@com.sap.vocabularies.Common.v1.Label": "Angry Bird Man. Prod: Review Cons View",
					"@com.sap.vocabularies.UI.v1.DataPoint#HelpfulCount": {
						"Value": {
							"$Path": "HelpfulCount"
						},
						"Title": "Feedback",
						"TargetValue": {
							"$Path": "HelpfulTotal"
						},
						"Visualization": {
							"$EnumMember": "com.sap.vocabularies.UI.v1.VisualizationType/Progress"
						}
					},
					"@com.sap.vocabularies.UI.v1.DataPoint#Rating": {
						"Value": {
							"$Path": "Rating"
						},
						"Title": "Rating",
						"Visualization": {
							"$EnumMember": "com.sap.vocabularies.UI.v1.VisualizationType/Rating"
						}
					},
					"@com.sap.vocabularies.UI.v1.Facets": [
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"Label": "Review",
							"ID": "ReviewDetails",
							"Target": {
								"$AnnotationPath": "@com.sap.vocabularies.UI.v1.Identification"
							}
						}
					],
					"@com.sap.vocabularies.UI.v1.HeaderFacets": [
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"Label": "Review",
							"ID": "ReviewHead",
							"Target": {
								"$AnnotationPath": "@com.sap.vocabularies.UI.v1.FieldGroup#ReviewHead"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"Label": "Rating",
							"ID": "RatingHeader",
							"Target": {
								"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#Rating"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"Label": "Feedback",
							"ID": "FeedbackHeader",
							"Target": {
								"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#HelpfulCount"
							}
						}
					],
					"@com.sap.vocabularies.UI.v1.FieldGroup#ReviewHead": {
						"Data": [
							{
								"@com.sap.vocabularies.UI.v1.Importance": {
									"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
								},
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Reviewer_ID"
								}
							},
							{
								"@com.sap.vocabularies.UI.v1.Importance": {
									"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
								},
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Created_At"
								}
							}
						],
						"Label": "Review"
					},
					"@com.sap.vocabularies.UI.v1.HeaderInfo": {
						"TypeName": "Review",
						"TypeNamePlural": "Reviews",
						"Title": {
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Review",
							"Value": {
								"$Path": "Title"
							}
						},
						"Description": {
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Reviewer",
							"Value": {
								"$Path": "Reviewer_ID_Text"
							}
						}
					},
					"@com.sap.vocabularies.UI.v1.Identification": [
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Rating",
							"Value": {
								"$Path": "Rating"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Value": {
								"$Path": "Title"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Value": {
								"$Path": "Message"
							}
						}
					],
					"@com.sap.vocabularies.UI.v1.LineItem": [
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
							"Label": "Rating",
							"Target": {
								"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#Rating"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Reviewer",
							"Value": {
								"$Path": "Reviewer_ID"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "Date",
							"Value": {
								"$Path": "Created_At"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Value": {
								"$Path": "Message"
							}
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
							"Label": "Feedback",
							"Target": {
								"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#HelpfulCount"
							}
						}
					],
					"@com.sap.vocabularies.Communication.v1.Contact": {
						"fn": {
							"$Path": "Reviewer_ID_Text"
						}
					},
					"@com.sap.vocabularies.Common.v1.Messages": {
						"$Path": "SAP__Messages"
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.WeightUnitsType/code": {
					"@com.sap.vocabularies.Common.v1.Label": "Weight Unit Code",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Weight Unit Code"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.WeightUnitsType/name": {
					"@com.sap.vocabularies.Common.v1.Label": "Weight Unit"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.WeightUnitsType": {
					"@com.sap.vocabularies.Common.v1.Label": "Weight unit"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Container/WeightUnits": {
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": true,
						"UnsupportedExpressions": {
							"$EnumMember":
								"Org.OData.Capabilities.V1.SearchExpressions/AND Org.OData.Capabilities.V1.SearchExpressions/OR Org.OData.Capabilities.V1.SearchExpressions/NOT Org.OData.Capabilities.V1.SearchExpressions/group Org.OData.Capabilities.V1.SearchExpressions/phrase"
						}
					},
					"@Org.OData.Capabilities.V1.InsertRestrictions": {
						"Insertable": false
					},
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						"Deletable": false
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Container": {
					"@Org.OData.Aggregation.V1.ApplySupported": {
						"Transformations": ["aggregate", "groupby", "filter"],
						"Rollup": {
							"$EnumMember": "None"
						}
					}
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/SAP__Messages": {
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType/SAP__Messages": {
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType/DraftUUID": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft (Technical ID)"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType/DraftEntityType": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Entity ID"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType/DraftAccessType": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Access Type"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType/ProcessingStartDateTime": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft In Process Since"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType/DraftIsKeptByUser": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Is Kept By User"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType/EnqueueStartDateTime": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Locked Since"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType/DraftIsCreatedByMe": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Created By Me"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType/DraftIsLastChangedByMe": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Last Changed By Me"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType/DraftIsProcessedByMe": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft In Process By Me"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType/CreatedByUserDescription": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Created By (Description)"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType/LastChangedByUserDescription": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Last Changed By (Description)"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType/InProcessByUserDescription": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft In Process By (Description)"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.Product_TextType/sprsl": {
					"@com.sap.vocabularies.Common.v1.Label": "Language Key",
					"@com.sap.vocabularies.Common.v1.Heading": "Language"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType/Stock_ID": {
					"@com.sap.vocabularies.Common.v1.Label": "Node Key",
					"@com.sap.vocabularies.Common.v1.Heading": "Generic Node Key",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "EPM: Generic Node Key"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType/CreationDateTime": {
					"@com.sap.vocabularies.Common.v1.Label": "Draft Created On"
				},
				"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType/LastChangeDateTime": {
					"@com.sap.vocabularies.Common.v1.Label": "Draft Last Changed On"
				}
			}
		},
		"com.sap.gateway.srvd.abmp_man_product.v0001.Stock_Availability_VHType": {
			"$kind": "EntityType",
			"$Key": ["code"],
			"code": {
				"$kind": "Property",
				"$Type": "Edm.Int32",
				"$Nullable": false
			},
			"name": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			}
		},
		"com.sap.gateway.srvd.abmp_man_product.v0001.PriceRangeType": {
			"$kind": "EntityType",
			"$Key": ["code"],
			"code": {
				"$kind": "Property",
				"$Type": "Edm.Int32",
				"$Nullable": false
			},
			"name": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			}
		},
		"com.sap.gateway.srvd.abmp_man_product.v0001.Supplier_VHType": {
			"$kind": "EntityType",
			"$Key": ["ID"],
			"ID": {
				"$kind": "Property",
				"$Type": "Edm.Guid",
				"$Nullable": false
			},
			"name": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"emailAddress": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"faxNumber": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 30
			},
			"phoneNumber": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 30
			}
		},
		"com.sap.gateway.srvd.abmp_man_product.v0001.Product_TextType": {
			"$kind": "EntityType",
			"$Key": ["sprsl", "id"],
			"sprsl": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false,
				"$MaxLength": 2
			},
			"id": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false,
				"$MaxLength": 36
			},
			"name": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"description": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			}
		},
		"com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType": {
			"$kind": "EntityType",
			"$Key": ["ID", "IsActiveEntity"],
			"ID": {
				"$kind": "Property",
				"$Type": "Edm.Guid",
				"$Nullable": false
			},
			"product": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 36
			},
			"name": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"description": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"Category_ID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"Category_ID_Text": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"Image_URL": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"Price": {
				"$kind": "Property",
				"$Type": "Edm.Decimal",
				"$Precision": 10,
				"$Scale": 3
			},
			"Currency": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 5
			},
			"PriceRange_Code": {
				"$kind": "Property",
				"$Type": "Edm.Int32"
			},
			"Height": {
				"$kind": "Property",
				"$Type": "Edm.Decimal",
				"$Precision": 13,
				"$Scale": 3
			},
			"Width": {
				"$kind": "Property",
				"$Type": "Edm.Decimal",
				"$Precision": 13,
				"$Scale": 3
			},
			"Depth": {
				"$kind": "Property",
				"$Type": "Edm.Decimal",
				"$Precision": 13,
				"$Scale": 3
			},
			"DimensionUnit_Code": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 3
			},
			"Weight": {
				"$kind": "Property",
				"$Type": "Edm.Decimal",
				"$Precision": 13,
				"$Scale": 3
			},
			"WeightUnit_Code": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 3
			},
			"BaseUnit_Code": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 3
			},
			"Supplier_ID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"Supplier_ID_Text": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"Stock_ID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"minimumQuantity": {
				"$kind": "Property",
				"$Type": "Edm.Decimal",
				"$Precision": 13,
				"$Scale": 3
			},
			"quantity": {
				"$kind": "Property",
				"$Type": "Edm.Decimal",
				"$Precision": 13,
				"$Scale": 3
			},
			"availability_code": {
				"$kind": "Property",
				"$Type": "Edm.Int32"
			},
			"availability_code_Text": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"averageRating": {
				"$kind": "Property",
				"$Type": "Edm.Double"
			},
			"numberOfReviews": {
				"$kind": "Property",
				"$Type": "Edm.Int32"
			},
			"Created_ByUser": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"Modified_ByUser": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"Created_At": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset"
			},
			"Modified_At": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset"
			},
			"HasDraftEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"ActiveUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"DraftEntityCreationDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"DraftEntityLastChangeDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"HasActiveEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"IsActiveEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			},
			"SAP__Messages": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.SAP__Message",
				"$Nullable": false
			},
			"DraftAdministrativeData": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType"
			},
			"reviews": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType"
			},
			"SiblingEntity": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType"
			},
			"_BaseUnit": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.BaseUnitsType"
			},
			"_Currency": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.CurrenciesType"
			},
			"_DimensionUnit": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.DimensionUnitsType"
			},
			"_PriceRange": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.PriceRangeType"
			},
			"_Stock": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.StocksType"
			},
			"_StockAvailability": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.StockAvailabilitiesType"
			},
			"_Supplier": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.SupplierType"
			},
			"_WeightUnit": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.WeightUnitsType"
			}
		},
		"com.sap.gateway.srvd.abmp_man_product.v0001.StocksType": {
			"$kind": "EntityType",
			"$Key": ["ID"],
			"ID": {
				"$kind": "Property",
				"$Type": "Edm.Guid",
				"$Nullable": false
			},
			"quantity": {
				"$kind": "Property",
				"$Type": "Edm.Decimal",
				"$Precision": 13,
				"$Scale": 3
			},
			"minimumQuantity": {
				"$kind": "Property",
				"$Type": "Edm.Decimal",
				"$Precision": 13,
				"$Scale": 3
			},
			"availability_code": {
				"$kind": "Property",
				"$Type": "Edm.Int32"
			},
			"availability_code_Text": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"created_at": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset"
			},
			"created_byUser": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"modified_at": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset"
			},
			"modified_byUser": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"_StockAvailability": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.StockAvailabilitiesType"
			}
		},
		"com.sap.gateway.srvd.abmp_man_product.v0001.CurrenciesType": {
			"$kind": "EntityType",
			"$Key": ["code"],
			"code": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false,
				"$MaxLength": 5
			},
			"name": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 40
			}
		},
		"com.sap.gateway.srvd.abmp_man_product.v0001.DimensionUnitsType": {
			"$kind": "EntityType",
			"$Key": ["code"],
			"code": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false,
				"$MaxLength": 3
			},
			"name": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			}
		},
		"com.sap.gateway.srvd.abmp_man_product.v0001.SupplierType": {
			"$kind": "EntityType",
			"$Key": ["ID"],
			"ID": {
				"$kind": "Property",
				"$Type": "Edm.Guid",
				"$Nullable": false
			},
			"name": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"emailAddress": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"faxNumber": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 30
			},
			"phoneNumber": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 30
			},
			"created_at": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset"
			},
			"created_byUser": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"modified_at": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset"
			},
			"modified_byUser": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			}
		},
		"com.sap.gateway.srvd.abmp_man_product.v0001.StockAvailabilitiesType": {
			"$kind": "EntityType",
			"$Key": ["code"],
			"code": {
				"$kind": "Property",
				"$Type": "Edm.Int32",
				"$Nullable": false
			},
			"name": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			}
		},
		"com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType": {
			"$kind": "EntityType",
			"$Key": ["DraftUUID"],
			"DraftUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid",
				"$Nullable": false
			},
			"DraftEntityType": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 30
			},
			"CreationDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"CreatedByUser": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 12
			},
			"LastChangeDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"LastChangedByUser": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 12
			},
			"DraftAccessType": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 1
			},
			"ProcessingStartDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"InProcessByUser": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 12
			},
			"DraftIsKeptByUser": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"EnqueueStartDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"DraftIsCreatedByMe": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"DraftIsLastChangedByMe": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"DraftIsProcessedByMe": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"CreatedByUserDescription": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 80
			},
			"LastChangedByUserDescription": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 80
			},
			"InProcessByUserDescription": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 80
			}
		},
		"com.sap.gateway.srvd.abmp_man_product.v0001.BaseUnitsType": {
			"$kind": "EntityType",
			"$Key": ["code"],
			"code": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false,
				"$MaxLength": 3
			},
			"name": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			}
		},
		"com.sap.gateway.srvd.abmp_man_product.v0001.Category_VHType": {
			"$kind": "EntityType",
			"$Key": ["ID"],
			"ID": {
				"$kind": "Property",
				"$Type": "Edm.Guid",
				"$Nullable": false
			},
			"name": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"description": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			}
		},
		"com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType": {
			"$kind": "EntityType",
			"$Key": ["ID", "IsActiveEntity"],
			"ID": {
				"$kind": "Property",
				"$Type": "Edm.Guid",
				"$Nullable": false
			},
			"Product_ID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"Reviewer_ID": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 36
			},
			"Reviewer_ID_Text": {
				"$kind": "Property",
				"$Type": "Edm.String"
			},
			"Title": {
				"$kind": "Property",
				"$Type": "Edm.String"
			},
			"Message": {
				"$kind": "Property",
				"$Type": "Edm.String"
			},
			"Rating": {
				"$kind": "Property",
				"$Type": "Edm.Decimal",
				"$Precision": 4,
				"$Scale": 2
			},
			"HelpfulCount": {
				"$kind": "Property",
				"$Type": "Edm.Int32"
			},
			"HelpfulTotal": {
				"$kind": "Property",
				"$Type": "Edm.Int32"
			},
			"Created_ByUser": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"Modified_ByUser": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"Created_At": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset"
			},
			"Modified_At": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset"
			},
			"HasDraftEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"ActiveUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"DraftEntityCreationDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"DraftEntityLastChangeDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"HasActiveEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"IsActiveEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			},
			"SAP__Messages": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.SAP__Message",
				"$Nullable": false
			},
			"DraftAdministrativeData": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType"
			},
			"SiblingEntity": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType"
			},
			"_Product": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType",
				"$Nullable": false
			}
		},
		"com.sap.gateway.srvd.abmp_man_product.v0001.WeightUnitsType": {
			"$kind": "EntityType",
			"$Key": ["code"],
			"code": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false,
				"$MaxLength": 3
			},
			"name": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			}
		},
		"com.sap.gateway.srvd.abmp_man_product.v0001.SAP__Message": {
			"$kind": "ComplexType",
			"code": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false
			},
			"message": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false
			},
			"numericSeverity": {
				"$kind": "Property",
				"$Type": "Edm.Byte",
				"$Nullable": false
			},
			"target": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false
			},
			"transition": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			}
		},
		"com.sap.gateway.srvd.abmp_man_product.v0001.PreparationAction": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$EntitySetPath": "_it",
				"$Parameter": [
					{
						"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType",
						"$Name": "_it",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "SideEffectsQualifier",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType",
					"$Nullable": false
				}
			},
			{
				"$kind": "Action",
				"$IsBound": true,
				"$EntitySetPath": "_it",
				"$Parameter": [
					{
						"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType",
						"$Name": "_it",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "SideEffectsQualifier",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType",
					"$Nullable": false
				}
			}
		],
		"com.sap.gateway.srvd.abmp_man_product.v0001.ActivationAction": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$EntitySetPath": "_it",
				"$Parameter": [
					{
						"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType",
						"$Name": "_it",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType",
					"$Nullable": false
				}
			}
		],
		"com.sap.gateway.srvd.abmp_man_product.v0001.EditAction": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$EntitySetPath": "_it",
				"$Parameter": [
					{
						"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType",
						"$Name": "_it",
						"$Nullable": false
					},
					{
						"$Type": "Edm.Boolean",
						"$Name": "PreserveChanges",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType",
					"$Nullable": false
				}
			}
		],
		"com.sap.gateway.srvd.abmp_man_product.v0001.Container": {
			"$kind": "EntityContainer",
			"BaseUnits": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.BaseUnitsType"
			},
			"Category_VH": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.Category_VHType"
			},
			"Currencies": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.CurrenciesType"
			},
			"DimensionUnits": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.DimensionUnitsType"
			},
			"I_DraftAdministrativeData": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.I_DraftAdministrativeDataType"
			},
			"PriceRange": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.PriceRangeType"
			},
			"Products": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.ProductsType",
				"$NavigationPropertyBinding": {
					"DraftAdministrativeData": "I_DraftAdministrativeData",
					"reviews": "Reviews",
					"SiblingEntity": "Products",
					"_BaseUnit": "BaseUnits",
					"_Currency": "Currencies",
					"_DimensionUnit": "DimensionUnits",
					"_PriceRange": "PriceRange",
					"_Stock": "Stocks",
					"_StockAvailability": "StockAvailabilities",
					"_Supplier": "Supplier",
					"_WeightUnit": "WeightUnits"
				}
			},
			"Product_Text": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.Product_TextType"
			},
			"Reviews": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.ReviewsType",
				"$NavigationPropertyBinding": {
					"DraftAdministrativeData": "I_DraftAdministrativeData",
					"SiblingEntity": "Reviews",
					"_Product": "Products"
				}
			},
			"StockAvailabilities": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.StockAvailabilitiesType"
			},
			"Stocks": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.StocksType",
				"$NavigationPropertyBinding": {
					"_StockAvailability": "StockAvailabilities"
				}
			},
			"Stock_Availability_VH": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.Stock_Availability_VHType"
			},
			"Supplier": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.SupplierType"
			},
			"Supplier_VH": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.Supplier_VHType"
			},
			"WeightUnits": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.abmp_man_product.v0001.WeightUnitsType"
			}
		},
		"$EntityContainer": "com.sap.gateway.srvd.abmp_man_product.v0001.Container"
	};
});
