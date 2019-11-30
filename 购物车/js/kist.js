var kits = {};

/**
 * @description 该方法是用于求随机整数的
 * @param { number } n 随机数的下限
 * @param { number } m 随机数的上限
 * @returns Number
 */
kits.randomInt = function (n, m) {
  return Math.floor(Math.random() * (m - n + 1) + n);
}

// 封装获取本地存储的数据，默认是返回数组的
kits.loadData = function (key) {
  let json = localStorage.getItem(key);

  // 使用短路运算进行简化
  return JSON.parse(json) || [];
}
// 封装把数据存储到本地数据里面的方法
/**
 * @description 把复杂数据转换为json格式存储到本地数据里面的封装
 * @param { string } key
 * @param { Array || Object } data
 * @returns undefined
 */
kits.saveData = function (key,data){
  let json = JSON.stringify(data);
  localStorage.setItem(key,json);
}