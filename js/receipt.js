$(function () {
  var orderId = getQuery('o')
  var apiUrl = 'http://api.zenda.tw/order/' + orderId

  var $noOrderSection = $('#no-order')
  var $receiptSection = $('#receipt')

  if (orderId) {
    $.get(apiUrl).done(function (data) {
      $receiptSection.removeClass('uk-hidden')

      fillOrderInfo(data)
    }).fail(function () {
      $noOrderSection.removeClass('uk-hidden')
    })
  }

  function getQuery(field, url) {
    var href = url ? url : window.location.href
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' )
    var string = reg.exec(href)
    return string ? string[1] : null
  }

  function fillOrderInfo(data) {
    $('.order-id').text(orderId)

    $('#buyer').text(data.buyer)
    $('#phone').text(data.phone)
    $('#address').text(data.address)
    $('#pickup-time').text(data.pickup_time || '全天')
    $('#notes').text(data.notes || '-')
  }
})
