$(function () {
  var apiUrl = 'https://shop.silverskill.org/wp-json/wc/v1/orders'
  var ck = 'ck_bcf71a9d81fc4979e15a1b14f43f06f395776a5a'
  var cs = 'cs_a8f3270ae58af2214b6ee7141c838b74f168d0f9'

  $('#confirm').click(addOrder)

  function addOrder () {
    var url = apiUrl + '?consumer_key=' + ck + '&consumer_secret=' + cs

    $.post(url, {
      billing:{
        first_name: "王小明",
        address_1: "台北市大安區基隆路一段133巷7樓之3",
        phone: '12345678'
      },
      shipping:{
        first_name: '王小明',
        address_1: "台北市大安區基隆路一段133巷7樓之3",
      },
      payment_method:'bacs',
      payment_method_title:'貨到付款',
      status:'completed',
      customer_note: '早上10點收貨'
    }).done(function () {

    }).fail(function () {

    })
  }
})
