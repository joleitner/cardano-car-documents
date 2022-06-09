const stringToBase16 = (string) => {
  var result = ''
  for (var i = 0; i < string.length; i++) {
    result += string[i].charCodeAt(0).toString(16)
  }
  return result
}

exports.stringToBase16 = stringToBase16
