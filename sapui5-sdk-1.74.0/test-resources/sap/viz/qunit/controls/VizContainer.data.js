/*
*used to create analysis obj
*/
var AnalysisInfo =[{'uid':'ENTITY_ID_PRODUCT', 'name':'Product', 'type':'dimension'},
                   			{'uid':'ENTITY_ID_COUNTRY', 'name':'Country', 'type':'dimension'},
                   			{'uid':'ENTITY_ID_PROFIT', 'name':'Profit', 'type':'measure'},
                   			{'uid':'ENTITY_ID_REVENUE', 'name':'Revenue', 'type':'measure'},
                   			{'uid':'ENTITY_ID_COUNTRY', 'name':'Country', 'type':'dimension'},
                   			{'uid':'ENTITY_ID_CITY', 'name':'City', 'type':'dimension'},
                   			{'uid':'ENTITY_ID_SALENUMBER', 'name':'Number', 'type':'measure'},
                   			{ 'uid':'ENTITY_ID_SALEQUANTITY', 'name':'Sale Quantity', 'type':'measure'},
                   			{ 'uid':'ENTITY_ID_SALEREVENUE', 'name':'Sale Revenue', 'type':'measure'},
                   			{ 'uid':'ENTITY_ID_SALENUMBER','name':'Sale Number', 'type':'measure' }             			
                   ];

/*
 *used to create vizcontainer model, data can be append column, don't delete existed column
 */
var ModelInfo = { businessData: [
										                     {Country :"Canada",revenue:410.87,profit:-141.25, population:34789000},
										                     {Country :"China",revenue:338.29,profit:133.82, population:1339724852},
										                     {Country :"France",revenue:487.66,profit:348.76, population:65350000},
										                     {Country :"Germany",revenue:470.23,profit:217.29, population:81799600},
										                     {Country :"India",revenue:170.93,profit:117.00, population:1210193422},
										                     {Country :"United States",revenue:905.08,profit:609.16, population:313490000}
							                         ],
			                         businessContextData: [
                                                     {Country :"Canada",revenue:410.87,profit:-141.25, population:34789000 ,Year:"2001", City:"a"},
                                                     {Country :"China",revenue:338.29,profit:133.82, population:1339724852,Year:"2002", City:"b"},
                                                     {Country :"France",revenue:487.66,profit:348.76, population:65350000,Year:"2003", City:"c"},
                                                     {Country :"Germany",revenue:470.23,profit:217.29, population:81799600,Year:"2004", City:"d"},
                                                     {Country :"India",revenue:170.93,profit:117.00, population:1210193422,Year:"2005", City:"e"},
                                                     {Country :"United States",revenue:905.08,profit:609.16, population:313490000,Year:"2006", City:"f"}
                                             ],
						        businessData2 : [
						                         {Product : "Bike", City :"Beijing", number:34789000},
						                         {Product :"Car", City: "Beijing", number:39724852},
						                         {Product :"Truck", City: "Beijing", number:65350000},
						                         {Product : "Bike", City :"Shanghai", number:45789000},
						                         {Product :"Car", City: "Shanghai", number:23724852},
						                         {Product :"Truck", City: "Shanghai", number:32350000}
						                 ]
						   
							};

/*
 *  used to vizcontainer property
 */
var VizProperty = [{		
								title : {
											visible : true,
											text : 'title1',
											alignment : "left"
										}
							},
							{		
								title : {
									visible : false,
									text : 'title2'
								}
							},
							{		
								title : {
									visible : false,
									text : 'title2',
									alignment : "left"
								}
							},
                   ];

/*
 *  used to vizcontainer css
 */
var VizCss = [ '.v-background{width: 222px;} .v-body-title{border: none;} .v-body-label{font-size:12px;}',
               '.v-m-main .v-background-body{height:300px;} .v-m-main .v-background-border{ stroke-width:4}',
              ];

var bulletModelInfo = {
  "milk": [{
        "Store Name": "24-Seven",
        "Revenue": 82922.07,
        "Target": 124383.105,
        "Forecast": 127534.53, 
        "Additional Revenue": 16795.9, 
        "Revenue2": 345292.06, 
        "Target2": 517938.09, 
        "Forecast2": 601546.392, 
        "Additional Revenue2": 77587.62 
    },
    {
        "Store Name": "A&A",
        "Revenue": 157913.07,
        "Target": 78956.535,
        "Forecast": 64538.2, 
        "Additional Revenue": 29305.82, 
        "Revenue2": 1564235.29, 
        "Target2": 782117.645, 
        "Forecast2": 625694.116, 
        "Additional Revenue2": 245429.35 
    },
    {
        "Store Name": "Alexei's Specialities",
        "Revenue": 245609.486884,
        "Target": 122804.743442,
        "Forecast": 106361.6587536, 
        "Additional Revenue": 50302.52, 
        "Revenue2": 1085567.22, 
        "Target2": 542783.61, 
        "Forecast2": 442778.656, 
        "Additional Revenue2": 182858.06 
    }]
};