/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  let low = 0
  let subS = ''
  //pwwkew
  //dvdf
  console.log('----------------' + s + '-----------------')
  for (let i = 0; i < s.length; i++) {
    let newS = s.substring(low, i + 1)
    let newSet = new Set(newS.split(''))
    if (newSet.size < newS.length) {
      let code = s.substring(i, i + 1)
      let start = Array.from(newSet).indexOf(code)
      console.log('start = ', start, 'i=', i, 'newS.length=', newS.length)
  
      if (start != -1) {
        low = i - (newS.length - start - 1) + 1
        console.log('low', low)
      }

      continue
    }
    if (newS != subS && newS.length > subS.length) {
      subS = newS
    }
  }

  return subS.length
}
//返回被重复字符的位置

/**
 * @param {string} s
 * @return {number}
 */
//https://leetcode.com/submissions/detail/370053691/
var lengthOfLongestSubstring_BEST = function(s) {
  let answer = ""
  let maxlength = 0
  
  
  for(let x = 0; x < s.length; x++){
      let letter = s[x]
      let checker = true
      for(let y = 0; y < answer.length; y++){
          if(letter === answer[y]){
              checker = false
              break
          }
      }
      if(checker === true){
          answer = answer + letter
      }
      else{
          let indexx = answer.indexOf(letter)
          answer = answer.substring(indexx+1) + letter
      }
      maxlength = Math.max(answer.length, maxlength)
      
  }
  
  return maxlength
};


module.exports = {
  lengthOfLongestSubstring
}
