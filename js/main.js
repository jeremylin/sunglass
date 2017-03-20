$(function () {
  var apiUrl = 'http://api.zenda.tw/order'
  var useCoupon = false
  var selectedItem = {}
  var selectedItems = []

  $('.add-to-cart').click(addToCart)
  $('.remove-from-cart').click(removeFromCart)

  $('#countdown-wording').countdown("2018/01/01", function(e) {
    $(this).text('剩 ' + e.strftime('%H小時 %M分 %S秒' + ' 可領取'))
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
  })

  $('#next-step').click(function () {
    $('#buyer-info').removeClass('uk-hidden')
  })

  $(document).scroll((e) => {
    var $services = $('.onlineService')
    var cartOffsetTop = $('#shopping-cart').offset().top
    var top = $(window).scrollTop()

    if (top > cartOffsetTop) {
      $services.addClass('uk-hidden')
    } else {
      $services.removeClass('uk-hidden')
    }
  })

  var bar = new ProgressBar.Line('#countdown-progressbar', {
    strokeWidth: 4,
    easing: 'easeInOut',
    duration: 1400,
    color: '#FFEA82',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: {width: '100%', height: '100%'},
    from: {color: '#ED6A5A'},
    to: {color: '#FFEA82'},
    step: (state, bar) => {
      bar.path.setAttribute('stroke', state.color)
    }
  })

  $('#choose-coupon').on({
    'show.uk.modal': function () {
      bar.set(1)
      bar.animate(0.1)
    },
    'hide.uk.modal': function () {
      useCoupon = true
      $('#use-coupon').removeClass('uk-hidden')
      $('#coupon-discount').text(100)
      $('#acquire-coupon').css('visibility', 'hidden')
    }
  })


  function fillModalData (e) {
    selectedItem = {}

    var $modal = $('#choose-coupon')
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
    })

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
      customer_note: pickupTime + ',' + buyerNotes,
      coupon_lines: useCoupon ? [{
        id: selectedItems[0].product_id,
        code: 'zenda-100-coupon',
        discount: 100
      }] : [],
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
