const stringToBase16 = (string) => {
  var result = ''
  for (var i = 0; i < string.length; i++) {
    result += string[i].charCodeAt(0).toString(16)
  }
  return result
}

const isNumeric = (str) => {
  if (typeof str != 'string') return false // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ) // ...and ensure strings of whitespace fail
}

exports.isNumeric = isNumeric
exports.stringToBase16 = stringToBase16
