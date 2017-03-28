$(function () {
  var orderId = getQuery('o')
  var apiUrl = 'http://api.zenda.tw/order/' + orderId

  var $noOrderSection = $('#no-order')
  var $receiptSection = $('#receipt')

  if (orderId) {
    $.get(apiUrl).done(function (data) {
      $receiptSection.removeClass('uk-hidden')

      fillOrderInfo(data.items)
      caculateAmount(data)
      fillBuyerInfo(data)
    }).fail(function () {
      $noOrderSection.removeClass('uk-hidden')
    })
  } else {
    $noOrderSection.removeClass('uk-hidden')
  }

  function getQuery(field, url) {
    var href = url ? url : window.location.href
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' )
    var string = reg.exec(href)
    return string ? string[1] : null
  }

  function fillOrderInfo(items) {
    var $list = $('#receipt-list tbody')

    items.forEach(function (item) {

      var $item = $('#receipt-template').clone()

      $item.removeClass('uk-hidden')
           .removeAttr('id')
           .attr('data-id', item.product_id)
           .find('.item-title')
           .text(item.name)

      $item.find('.item-quantity')
        .text(item.quantity)

      $item.find('.item-price')
        .text(item.quantity * item.price)

      $list.append($item)
    })
  }

  function fillBuyerInfo(data) {
    $('.order-id').text(orderId)

    $('#buyer').text(data.buyer)
    $('#phone').text(data.phone)
    $('#address').text(data.address)
    $('#pickup-time').text(data.pickup_time || '全天')
    $('#notes').text(data.notes || '-')
  }

  function caculateAmount (data) {
    var amount = 0
    var quantity = 0
    var discount = 0
    var items = data.items

    items.forEach(function (item) {
      amount += item.price * item.quantity
    })
    items.forEach(function (item) {
      quantity += item.quantity
    })

    if (data.coupon_discount) {
      discount = data.coupon_discount
      $('#coupon-used').removeClass('uk-hidden')
      $('#coupon-discount').text(discount)
    }

    $('#total-quantity').text(quantity)
    $('#total-amount').text(amount - discount)
  }
})
