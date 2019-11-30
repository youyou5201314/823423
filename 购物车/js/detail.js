// 建立一个入口函数
$(function() {
  //  线获取location.search里面的Id
  let id = location.search.substring(4);
  let target = phoneData.find(e => {
    return e.pID == id;
  });
  // 修改价格
  $(".summary-price em").text(`¥${target.price}`);
  // 改名字
  $(".sku-name").text(target.name);
  // 改图片
  $(".preview-img>img").attr("src", target.imgSrc);

  
  // 购物车数据获取
  $(".addshopcar").on("click", function() {
    // 获取输入框的件数
    let number = $(".choose-number").val();
    // 判断
    if (number.trim().lenght === 0 || isNaN(number) || parseInt(number) <= 0) {
      alert("商品数量不正确，请正确输入");
      return;
    }
    // 把件数和商品的信息储存到本地数据里面
    let arr = kits.loadData("cartListData");
    // 判断
    let exist = arr.find(e => {
      return (e.pID == id);
    });
    number = parseInt(number);
    if (exist) {
      console.log(exist)
      exist.number += number;
    } else {
      // 需要自己构建数据对象
      let obj = {
        pID: target.pID,
        imgSrc: target.imgSrc,
        name: target.name,
        price: target.price,
        number: number,
        isChecked: true
      };
      // 把数据储存到本地数据里面
      arr.push(obj);
      console.log(arr)
      
    }
    kits.saveData("cartListData", arr);
    // 跳转到购物车页面
    location.href = "./cart.html";

  });
});
