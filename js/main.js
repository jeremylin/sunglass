$(function () {
  var apiUrl = 'http://192.168.99.100/order'
  var selectedItem = {}
  var selectedItems = []

  $('#confirm-add-to-cart').click(addToCart)
  $('.add-to-cart').click(fillModalData)
  $('.remove-from-cart').click(removeFromCart)

  $('#countdown-wording').flipcountdown({
    beforeDateTime: '1/01/2017 00:00:00'
  })
  $('#countdown-wording').on('active.uk.sticky', function () {
    $(this).css('padding', '10px')
  })
  $('#countdown-wording').on('inactive.uk.sticky', function () {
    $(this).css('padding', '0')
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
    var $list = $('#cart-list tbody')
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
    UIkit.notify('已成功將 ' + selectedItem.title + ' 加入購物車', {status:'success'})

    selectedItems.push(selectedItem)

    caculateAmount()
  }

  function removeFromCart (e) {
    var $target = $($(e.target).parents('tr'))
    $target.remove()

    caculateAmount()
  }

  function addOrder () {
    if (selectedItems.length == 0) {
      UIkit.notify('您目前尚未選購任何商品！', {status:'danger'})
      return false
    }

    var buyerName = $('#buyer-name').val()
    var buyerAddress = $('#buyer-address').val()
    var buyerPhone = $('#buyer-phone').val()
    var buyerNotes = $('#buyer-notes').val()

    var confirmButton = $('#confirm')
    confirmButton.attr('disabled', true)
    confirmButton.html('<i class="uk-icon-spinner uk-icon-spin"></i> 送出訂單中...')

    $.post(apiUrl, {
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
    var quantity = 0

    $('#cart-list .item-price').toArray().forEach((item) => {
      amount += parseInt($(item).text()) || 0
    })

    $('#cart-list .item-quantity').toArray().forEach((item) => {
      quantity += parseInt($(item).text()) || 0
    })

    $('#total-quantity').text(quantity)
    $('#total-amount').text(amount)

    if ($('#cart-list tbody tr').length > 1) {
      $('#no-item-in-cart').addClass('uk-hidden')

      $('#cart-list').removeClass('uk-hidden')
    } else {
      $('#no-item-in-cart').removeClass('uk-hidden')

      $('#cart-list').addClass('uk-hidden')
    }
  }
})
