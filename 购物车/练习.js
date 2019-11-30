// 先做一个入口函数
$(function () {
  // 第一个功能
  let arr = kits.loadData("cartListData");
  // 遍历数组，生成指定的结构
  let html = "";
  // 获取一个产品的数据
  arr.forEach(element => {
    html += `<div class="item" data-id="${e.pID}">
        <div class="row">
          <div class="cell col-1 row">
            <div class="cell col-1">
              <input type="checkbox" class="item-ck" ${
      e.isChecked ? "checked" : ""
      }>
            </div>
            <div class="cell col-4">
              <img src="${e.imgSrc}" alt="">
            </div>
          </div>
          <div class="cell col-4 row">
            <div class="item-name">${e.name}</div>
          </div>
          <div class="cell col-1 tc lh70">
            <span>￥</span>
            <em class="price">${e.price}</em>
          </div>
          <div class="cell col-1 tc lh70">
            <div class="item-count">
              <a href="javascript:void(0);" class="reduce fl ">-</a>
              <input autocomplete="off" type="text" class="number fl" value="${
      e.number
      }">
              <a href="javascript:void(0);" class="add fl">+</a>
            </div>
          </div>
          <div class="cell col-1 tc lh70">
            <span>￥</span>
            <em class="computed">${e.number * e.price}</em>
              </div>
                <div class="cell col-1">
            <a href="javascript:void(0);" class="item-del">从购物车中移除</a>
           </div>
          </div>
         </div>`;
  });
  $(".pick-all").append(html);
  //    如果arr里面的诗句不是全部勾选的，需要把勾选去掉
  let noCkAll = arr.find(e => {
    return !e.isChecked;
  });
  $(".pick-all").prop("checked", !noCkAll);
  if (arr.lenght != 0) {
    // 处理一些该隐藏的效果和显示的效果
    $(".empty-tip").hide(); //隐藏没有产品的提示
    $(".cart-header").whow(); //显示表头
    $(".total-of").show(); //显示用于结算的div
  }
  //   第二个功能，全选和点选
  $(".pick-all").on("click", function () {
    let status = $(this).prop("checked");
    $(".item-ck").prop("checked", status);
    $('pick-all').prop("checked", status);
    // 先把本地数据里面的所有数据勾选
    arr.forEach(e => {
      e.isChecked=status;
    });
    // 重新存进本地数据库
    kits.saveData('cartListData',arr);
    // 点选全选的时候，也需要把数据重新更新
    calcTotal();
  });
// 点选，所有的点选的checkbox都是动态生成的，推荐使用委托离开
});
