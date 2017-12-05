module.exports = bp => {
  // Batch Processing
}

// Request
// {
//    "LanguageCode": "en",
//    "TextList": [
//       "I have been living in Seattle for almost 4 years",
//       "It is raining today in Seattle"
//    ]
// }

// Response
// {
//    "ResultList"  : [
//       {
//          "Index": 0,
//          "Entities": [
//             {
//                "Text": "Seattle",
//                "Score": 0.95,
//                "Type": "LOCATION",
//                "BeginOffset": 22,
//                "EndOffset": 29
//             },
//             {
//                "Text": "almost 4 years",
//                "Score": 0.89,
//                "Type": "QUANTITY",
//                "BeginOffset": 34,
//                "EndOffset": 48
//             }
//          ]
//       },
//       {
//          "Index": 1,
//          "Entities": [
//             {
//               "Text": "today",
//               "Score": 0.87,
//               "Type": "DATE",
//               "BeginOffset": 14,
//               "EndOffset": 19
//             },
//             {
//                "Text": "Seattle",
//                "Score": 0.96,
//                "Type": "LOCATION",
//                "BeginOffset": 23,
//                "EndOffset": 30
//             }
//          ]
//       }
//    ],
//    "ErrorList": []
// }
