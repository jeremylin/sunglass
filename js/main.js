$(function () {
  var apiUrl = 'http://api.zenda.tw/order'
  var selectedItem = {}
  var selectedItems = []

  $('.add-to-cart').click(addToCart)
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

  $('#zip-code').twzipcode({
    language: 'lang/zh-tw',
    detect: true,
    css: [
      'uk-form-large',
      'uk-form-large',
      'uk-form-large'
    ]
  });

  $('#next-step').click(function () {
    $('#buyer-info').removeClass('uk-hidden')
  })


  function fillModalData (e) {
    selectedItem = {}

    var $modal = $('#choose-quantity')
    var $target = $(e.target).parent('.item')

    selectedItem.product_id = $target.data('item-id')
    selectedItem.name = $target.find('.item-title').text()
    selectedItem.price = parseInt($target.find('.item-price').text())

    $modal.find('.item-title').text(selectedItem.name)
  }

  function addToCart (e) {
    var $target = $(e.target).parent('.item')

    selectedItem.product_id = $target.data('item-id')
    selectedItem.name = $target.find('.item-title').text()
    selectedItem.price = parseInt($target.find('.item-price').text())
    selectedItem.quantity = parseInt($target.find('option:selected').val())

    UIkit.notify('已成功將 ' + selectedItem.name + ' 加入購物車', {status:'success'})

    selectedItems.push(selectedItem)
    selectedItem = {}

    selectedItems = selectedItems.reduce(function (previous, after) {
      var inItem = false
      for (key in previous) {
        if (previous[key].product_id == after.product_id) {
          previous[key].quantity += after.quantity
          inItem = true
          break
        }
      }

      if (!inItem) {
        previous.push(after)
      }

      return previous
    }, [])

    updateCartList()
    caculateAmount()
  }

  function removeFromCart (e) {
    var $target = $($(e.target).parents('tr'))
    var selectedItem = selectedItems.find(function (item) {
      return item.product_id == $target.data('id')
    })

    UIkit.notify('已成功將 ' + selectedItem.name + ' 購物車從購物車移除', {status:'warning'})

    selectedItems = selectedItems.filter(function (item) {
      return item.product_id != $target.data('id')
    })

    $target.remove()
    caculateAmount()
  }

  function addOrder () {
    if (selectedItems.length == 0) {
      UIkit.notify('您目前尚未選購任何商品！', {status:'danger'})
      return false
    }

    var buyerName = $('#buyer-name').val()
    var buyerAddress  = ''
    $('#zip-code').twzipcode('get', function (county, district) {
      buyerAddress = county + district + $('#buyer-address').val()
    });

    var buyerPhone = $('#buyer-phone').val()
    var buyerNotes = $('#buyer-notes').val()
    var pickupTime = $('#pickup-time>option:selected').val()

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
        address_1: buyerAddress,
        address_2: $('#zip-code').twzipcode('get', 'zipcode')[0]
      },
      line_items: selectedItems,
      payment_method:'bacs',
      payment_method_title:'貨到付款',
      status:'completed',
      customer_note: pickupTime + ',' + buyerNotes
    }).done(function (data) {
      window.location.href = '/receipt.html?o=' + data
    }).fail(function () {

    })

    return false
  }

  function updateCartList () {
    var $list = $('#cart-list tbody')

    $list.find('tr').not('#cart-item-template').remove()

    selectedItems.forEach((item) => {
      var $item = $('#cart-item-template').clone()

      $item.removeClass('uk-hidden')
        .removeAttr('id')
        .attr('data-id', item.product_id)
        .find('.item-title')
        .text(item.name)

      $item.find('.item-quantity')
        .text(item.quantity)

      $item.find('.item-price')
        .text(item.quantity * item.price)

      $item.find('.remove-from-cart')
        .click(removeFromCart)

      $list.append($item)
    })
  }

  function caculateAmount () {
    var amount = 0
    var quantity = 0

    selectedItems.forEach(function (item) {
      amount += item.price * item.quantity
    })
    selectedItems.forEach(function (item) {
      quantity += item.quantity
    })

    $('#total-quantity').text(quantity)
    $('#total-amount').text(amount)

    if (selectedItems.length >= 1) {
      $('#no-item-in-cart').addClass('uk-hidden')
      $('#cart-list').removeClass('uk-hidden')
    } else {
      $('#no-item-in-cart').removeClass('uk-hidden')
      $('#cart-list').addClass('uk-hidden')
    }
  }
})
