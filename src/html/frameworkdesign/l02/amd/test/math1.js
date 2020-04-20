define("math1", function () {
  function add(...nums) {
    let total = 0;
    for (let i = 0; i < nums.length; i++) {
      total += nums[i];
    }
    return total;
  }
  return {
    add: add,
  };
});
