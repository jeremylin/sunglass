$(function () {
  var apiUrl = 'https://shop.silverskill.org/wp-json/wc/v1/orders'
  var ck = 'ck_bcf71a9d81fc4979e15a1b14f43f06f395776a5a'
  var cs = 'cs_a8f3270ae58af2214b6ee7141c838b74f168d0f9'
  var selectedItem = {}
  var selectedItems = []

  $('#confirm-add-to-cart').click(addToCart)
  $('.add-to-cart').click(fillModalData)
  $('.remove-from-cart').click(removeFromCart)
  $('#countdown-wording').countdown("2017/01/01", function(event) {
    $(this).text(
      event.strftime('%-d 天 %-H 時 %M 分 %S 秒')
    )
  })

  $('#delivery-form').submit(addOrder)
  var validator = $('#delivery-form').validate()

  $.extend($.validator.messages, {
    required: "此欄位為必填",
  })


  function fillModalData (e) {
    selectedItem = {}

    var $modal = $('#choose-quantity')
    var $target = $(e.target).parent('.item')

    selectedItem.id = $target.data('item-id')
    selectedItem.title = $target.find('.item-title').text()
    selectedItem.price = parseInt($target.find('.item-price').text())

    $modal.find('.item-title').text(selectedItem.title)
  }

  function addToCart (e) {
    var $list = $('#cart-list')
    var $target = $($(e.target).parents('#choose-quantity'))
    var item = $('#cart-item-template').clone()

    selectedItem.quantity = parseInt($target.find('option:selected').val())

    item.removeClass('uk-hidden')
      .find('.item-title')
      .text(selectedItem.title)

    item.find('.item-quantity')
      .text(selectedItem.quantity)

    item.find('.item-price')
      .text(selectedItem.quantity * selectedItem.price)

    item.find('.remove-from-cart')
      .click(removeFromCart)

    $list.append(item)

    UIkit.modal('#choose-quantity').hide()

    selectedItems.push(selectedItem)

    caculateAmount()
  }

  function removeFromCart (e) {
    var $target = $($(e.target).parents('li'))
    $target.remove()

    caculateAmount()
  }

  function addOrder () {
    if (selectedItems.length == 0) return false

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
      line_items: [
        {
          product_id: 14,
          quantity: 1
        }
      ],
      payment_method:'bacs',
      payment_method_title:'貨到付款',
      status:'completed',
      customer_note: buyerNotes
    }).done(function () {

    }).fail(function () {

    })

    return false
  }

  function caculateAmount () {
    var amount = 0
    $('#cart-list .item-price').toArray().forEach((item) => {
      amount += parseInt($(item).text()) || 0
    })

    $('#total-amount').text(amount)

    if ($('#cart-list li').length > 1) {
      $('#no-item-in-cart').addClass('uk-hidden')

      $('#cart-list').removeClass('uk-hidden')
      $('#shipping-and-amount').removeClass('uk-hidden')
    } else {
      $('#no-item-in-cart').removeClass('uk-hidden')

      $('#cart-list').addClass('uk-hidden')
      $('#shipping-and-amount').addClass('uk-hidden')
    }
  }
})
