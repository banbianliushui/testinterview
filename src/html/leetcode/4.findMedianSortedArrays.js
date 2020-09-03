//4. 寻找两个正序数组的中位数
// 中位数(Median)中位数是指将数据按大小顺序排列起来,形成一个数列,居于数列中间位置的那个数据。
//给定两个大小为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。

// 请你找出这两个正序数组的中位数，并且要求算法的时间复杂度为 O(log(m + n))。

// 你可以假设 nums1 和 nums2 不会同时为空。

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
  let len1 = nums1.length
  let len2 = nums2.length
  let mepos = []

  mepos[0] = Math.floor((len1 + len2) / 2)
  let meVal = []

  if ((len1 + len2) % 2 == 0) {
    //偶数 中间位置有两个

    mepos.unshift(mepos[0] - 1)
  }
  console.log('mepos', mepos)
  let j = 0
  if (len1 === 0 && len2 == 0) {
    return null
  } else if (len1 === 0) {
    meVal.push(nums2[mepos[0]])
    mepos.length > 1 && meVal.push(nums2[mepos[1]])
  } else if (len2 === 0) {
    meVal.push(nums1[mepos[0]])
    mepos.length > 1 && meVal.push(nums1[mepos[1]])
  } else {
    for (let i = 0; i < nums1.length; i++) {
      if (nums1[i] > nums2[j]) {
        while (j < len2) {
          if (nums1[i] > nums2[j]) {
            let val = checkNum2(j, i, nums2[j], nums1[i], 0, mepos)
            if (val !== null) {
              meVal.push(val)
              if (meVal.length == mepos.length) {
                console.log(meVal)
                return meVal.length == 2 ? (meVal[0] + meVal[1]) / 2 : meVal[0]
              }
            }
            j++
          } else {
            break
          }
        }
        if (j >= len2) {
          j--
        }
      } else {
        let val = checkNum2(j, i, nums2[j], nums1[i], 1, mepos)
        if (val !== null) {
          meVal.push(val)
          if (meVal.length == mepos.length) {
            console.log(meVal)
            return meVal.length == 2 ? (meVal[0] + meVal[1]) / 2 : meVal[0]
          }
        }
      }

      // for(let j=0;j<nums2.length;j++){

      // }
    }
  }

  return meVal.length == 2 ? (meVal[0] + meVal[1]) / 2 : meVal[0]
}

var checkNum2 = function (j, i, jVal, iVal, tag, mepos) {
  console.log('checknum', 'j=', j, 'i=', i, 'jVal=', jVal, 'iVal=', iVal, 'tag=', tag, j + i + 1)
  if (j + i + 1 === mepos[0]) {
    //一个的话取最大的
    //如果两个数组位置加起来已经等于中位数，取两者中值大的
    // return jVal > iVal ? jVal : iVal
    //if (mepos.length > 1) {
    return jVal > iVal ? jVal : iVal
    // } else {
    //   return jVal < iVal ? jVal : iVal
    // }
  }
  if (mepos.length > 1 && j + i + 1 === mepos[1]) {
    //中位数有两个取本次循环的数组元素
    return tag == 0 ? jVal : iVal
    //  return jVal < iVal ? jVal : iVal
  }
  return null
}

// let nums1 = [1, 4, 6, 7]
// let nums2 = [2, 3, 5, 10]
// let nums1 = [1, 3]
// let nums2 = [2]
// let nums1 = [1, 2]
// let nums2 = [3, 4]

let nums1 = [3]
let nums2 = [1]
console.log(nums1, nums2)
console.log(findMedianSortedArrays(nums1, nums2))

//1.
// function media(num1, left, right,len1, num2, left2, right2,len2) {
//   let mid1 =parseInt( (left + right) / 2)
//   let mid2 = parseInt((left2 + right2) / 2)
//   let maxLen = (len2+len1)%2==0?[parseInt((len2+len1)/2)-1,parseInt((len2+len1)/2)]:[parseInt((len2+len1)/2)]
//   if (num1[mid1] > num2[mid2]) {

//   }
//   if(maxLen.length>1&&mid1+mid2===maxLen[0]+maxLen[1]){
//     return( num1[mid1]+ num2[mid2])/2
//   }else if(maxLen.length=1&&mid1+mid2===maxLen[0]){
//     return num2[mid2]
//   }

// }

// module.exports = {
//   findMedianSortedArrays
// }
