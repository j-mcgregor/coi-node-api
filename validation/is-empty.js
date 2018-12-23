// Custom validor method that will check the value of the inputs

// ES5 version
// function isEmpty(value){
//   return(
//     value === undefined ||
//     value === null ||
//     ( typeof value === 'object' && Object.keys(value).length === 0 ) ||
//     ( typeof value === 'string' && value.trim().length === 0 )
//   );
// }

// ES7/7 version
const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  ( typeof value === 'object' && Object.keys(value).length === 0 ) ||
  ( typeof value === 'string' && value.trim().length === 0 );

module.exports = isEmpty;
