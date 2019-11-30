$(function () {

  // 第一个功能： 先读取本地数据中的数据，然后动态的生成列表结构
  let arr = kits.loadData('cartListData');
  // 遍历数组，生成指定的结构
  let html = '';// 先准备一个空字符串，后面存储我们要生成的所有的结构字符串
  arr.forEach(e => {
    // 需要有一个产品的id，用于后期的一些其他操作
    html += `<div class="item" data-id="${e.pID}">
    <div class="row">
      <div class="cell col-1 row">
        <div class="cell col-1">
          <input type="checkbox" class="item-ck" ${e.isChecked ? "checked" : ''}>
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
          <input autocomplete="off" type="text" class="number fl" value="${e.number}">
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
  })
  $('.item-list').append(html);

  // 如果arr里面的数据不是全都勾选的，需要把全选的勾选去掉
  let noCkAll = arr.find(e => {
    return !e.isChecked;
  });
  // if(noCkAll){
  //   // 有没有勾选的产品
  //   $('.pick-all').prop('checked',false);
  // }
  $('.pick-all').prop('checked', !noCkAll);

  if (arr.length != 0) {
    // 处理一些该隐藏的效果和该显示的效果
    $('.empty-tip').hide(); // 隐藏空空如也的提示
    $('.cart-header').show(); // 显示表头
    $('.total-of').show(); // 显示用于结算的div
  }

  //第二个功能 全选和点选
  $('.pick-all').on('click', function () {
    let status = $(this).prop('checked');
    $('.item-ck').prop('checked', status);
    $('.pick-all').prop('checked', status);
    // 先把本地数据里面的所有的数据都勾选
    arr.forEach(e=>{
      e.isChecked = status;
    })
    // 重新存进本地数据
    kits.saveData('cartListData',arr);
    // 点击全选的时候，也需要把数据重新更新
    calcTotal();
  })

  // 点选 - 所有的点选的checkbox都是动态生成的，推荐使用委托离开实现
  $('.item-list').on('click', '.item-ck', function () {
    // 如果勾选的个数和总个数一致 = 全选
    let ckall = $('.item-ck').length === $('.item-ck:checked').length;
    // 设置全选的状态和ckall一致就行
    $('.pick-all').prop('checked', ckall);
    // 点选的同时，要修改该多选框对应的本地数据里面的选中状态
    // 需要根据点选的商品的id，到本地数据中，修改 isChecked 属性
    let pID = $(this).parents('.item').attr('data-id');
    // 获取当前这个单选是否是选中
    let isChecked = $(this).prop('checked');
    // console.log(pID);
    arr.forEach(e=>{
      if(e.pID == pID){
        // 就需要把当前这个产品的选中状态改成和勾选状态一致
        e.isChecked = isChecked;
      }
    });
    // 把数据更新会本地数据
    kits.saveData('cartListData',arr);
    // 每次点选需要计算总价和总件数
    calcTotal();
  })

  // 封装一个计算总价格和总件数的函数，方便每次使用就调用
  function calcTotal() {
    // 第三个功能： 计算总价和总件数
    // 每次需要计算总价和总件数，都是直接从本地数据里面，得到 isChecked 为true的数据，然后计算总价和总件数
    let totalCount = 0; // 总件数
    let totalMoney = 0; // 总价格
    arr.forEach(e => {
      if (e.isChecked) {
        totalCount += e.number;
        totalMoney += e.number * e.price;
      }
    })
    // 把总价和总件数更新到页面里面
    $('.selected').text(totalCount);
    $('.total-money').text(totalMoney);
  }
  // 需要一开始就计算一次
  calcTotal();

  // 第四个功能 - 实现数量的加减
  $('.item-list').on('click','.add',function(){
    // 让 输入框里面的 数量增加
    let prev = $(this).prev();
    let current = prev.val();
    prev.val(++current);
    // 数量也要更新到本地数据
    let id = $(this).parents('.item').attr('data-id');
    let obj = arr.find(e=>{
      return e.pID == id;
    });
    obj.number = current;
    // 要把数据存储到本地里面才可以
    kits.saveData('cartListData',arr);
    // 更新总件数和总价格
    calcTotal();
    // 更新右边的总价
    // console.log($(this).parents('.item').find('.computed')); // find这个方法用于查找某个元素的后代元素中，满足条件的部分
    $(this).parents('.item').find('.computed').text(obj.number * obj.price);
  })

  // 点击减号
  $('.item-list').on('click','.reduce',function(){
    // 让 输入框里面的 数量增加
    let next = $(this).next();
    let current = next.val();
    // 判断一下，当前的值是否是 小于等于1
    if(current <= 1){
      alert('商品的件数不能小于1');
      return;
    }
    next.val(--current);
    // 数量也要更新到本地数据
    let id = $(this).parents('.item').attr('data-id');
    let obj = arr.find(e=>{
      return e.pID == id;
    });
    obj.number = current;
    // 要把数据存储到本地里面才可以
    kits.saveData('cartListData',arr);
    // 更新总件数和总价格
    calcTotal();
    // 更新右边的总价
    // console.log($(this).parents('.item').find('.computed')); // find这个方法用于查找某个元素的后代元素中，满足条件的部分
    $(this).parents('.item').find('.computed').text(obj.number * obj.price);
  })

  // 当得到焦点的时候，把当前的值，先保存 起来，如果失焦的时候输入的结果是不合理的，我们可以恢复原来的数字
  $('.item-list').on('focus','.number',function(){
    // 把旧的，正确的数量先存储起来
    let old = $(this).val();
    $(this).attr('data-old',old);
  });

  // 当输入框失去焦点的时候，需要把当前的值也同步到本地数据里面
  $('.item-list').on('blur','.number',function(){
    // 跟加减的操作是一样的，只不过我们需要对用户的输入进行验证
    let current = $(this).val();
    // 每次让用户自己输入的内容，一定要做合法性判断
    if (current.trim().length === 0 || isNaN(current) || parseInt(current) <= 0) {
      let old = $(this).attr('data-old');
      $(this).val(old); // 如果用户输入的不正确，恢复以前的正确的数字
      alert('商品数量不正确，请输入一个阿拉伯数字');
      return;
    }
    // 如果验证通过，把总价之类数据更新即可
    // 数量也要更新到本地数据
    let id = $(this).parents('.item').attr('data-id');
    let obj = arr.find(e=>{
      return e.pID == id;
    });
    obj.number = parseInt(current);
    // 要把数据存储到本地里面才可以
    kits.saveData('cartListData',arr);
    // 更新总件数和总价格
    calcTotal();
    // 更新右边的总价
    // console.log($(this).parents('.item').find('.computed')); // find这个方法用于查找某个元素的后代元素中，满足条件的部分
    $(this).parents('.item').find('.computed').text(obj.number * obj.price);
  })

  // 实现删除
  $('.item-list').on('click','.item-del',function(){
    layer.confirm('你确定要删除吗?', {icon: 0, title:'警告'}, (index)=>{
      layer.close(index);
      // 在这里执行 删除的逻辑
      // 先得到要删除的数据的id
      let id = $(this).parents('.item').attr('data-id');
      // 把当前点击的这个删除对应的这一行删掉
      $(this).parents('.item').remove();
      // 还要把本地存储里面的数据删除
      arr = arr.filter(e=>{
        return e.pID != id;
      });
      kits.saveData('cartListData',arr);
      // 重新更新总件数和总价
      calcTotal();
    });
  })
});