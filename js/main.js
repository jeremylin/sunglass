$(function () {
  var apiUrl = 'https://shop.silverskill.org/wp-json/wc/v1/orders'
  var ck = 'ck_bcf71a9d81fc4979e15a1b14f43f06f395776a5a'
  var cs = 'cs_a8f3270ae58af2214b6ee7141c838b74f168d0f9'

  $('#confirm').click(addOrder)

  function addOrder () {
    var url = apiUrl + '?consumer_key=' + ck + '&consumer_secret=' + cs

    var buyerName = $('#buyer-name').val()
    var buyerAddress = $('#buyer-address').val()
    var buyerPhone = $('#buyer-phone').val()
    var buyerNotes = $('#buyer-notes').val()

    $.post(url, {
      billing:{
        first_name: buyerName,
        address_1: buyerAddress,
        phone: buyerPhone
      },
      shipping:{
        first_name: buyerName,
        address_1: buyerAddress
      },
      payment_method:'bacs',
      payment_method_title:'貨到付款',
      status:'completed',
      customer_note: buyerNotes
    }).done(function () {

    }).fail(function () {

    })
  }
})
