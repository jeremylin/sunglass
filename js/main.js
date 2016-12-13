$(function () {
  var apiUrl = 'https://shop.silverskill.org/wp-json/wc/v1/orders'
  var ck = 'ck_bcf71a9d81fc4979e15a1b14f43f06f395776a5a'
  var cs = 'cs_a8f3270ae58af2214b6ee7141c838b74f168d0f9'
  var selectedItem = {}
  var selectedItems = []

  $('#confirm').click(addOrder)
  $('#confirm-add-to-cart').click(addToCart)
  $('.add-to-cart').click(fillModalData)
  $('.remove-from-cart').click(removeFromCart)

  function fillModalData (e) {
    selectedItem = {}

    var $modal = $('#choose-number')
    var $target = $(e.target).parent('.item')

    selectedItem.id = $target.data('item-id')
    selectedItem.title = $target.find('.item-title').text()
    selectedItem.price = parseInt($target.find('.item-price').text())

    $modal.find('.item-title').text(selectedItem.title)
  }

  function addToCart (e) {
    var $list = $('#cart-list')
    var $target = $($(e.target).parents('#choose-number'))
    var item = $('#cart-item-template').clone()

    selectedItem.number = parseInt($target.find('option:selected').val())

    item.removeClass('uk-hidden')
      .find('.item-title')
      .text(selectedItem.title)

    item.find('.item-number')
      .text(selectedItem.number)

    item.find('.item-price')
      .text(selectedItem.number * selectedItem.price)

    item.find('.remove-from-cart')
      .click(removeFromCart)

    $list.append(item)

    UIkit.modal('#choose-number').hide()

    selectedItems.push(selectedItem)

    caculateAmount()
  }

  function removeFromCart (e) {
    var $target = $($(e.target).parents('li'))
    $target.remove()

    caculateAmount()
  }

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
  }

  function caculateAmount () {
    var amount = 0
    $('#cart-list .item-price').toArray().forEach((item) => {
      amount += parseInt($(item).text()) || 0
    })

    $('#total-amount').text(amount)

    if ($('#cart-list li').length > 1) {
      $('#no-item-in-cart').addClass('uk-hidden')
    } else {
      $('#no-item-in-cart').removeClass('uk-hidden')
    }
  }
})
