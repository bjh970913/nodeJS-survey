var data;
var r1;
var $ = window.$;

var form = $('form');

function addSelect_li_tag(data, type, name_pre) {
  var tmp = $('form').children();
  var obj = tmp[tmp.length - 1];

  var ul = $(obj).children()[1];

  for (var j = 0; j <= Object.keys(data).length - 4; j++) {
    $(ul).append('<li><input type=\'' + type + '\' name=\'' + name_pre + '\' value=\'' + j + '\'/><label>' + data[j] + '</label></li>');
  }
  if (type === 'radio') {
    r1 = $(ul).children().first().children().first().attr('checked', true);
  }
}

$(document).ready(function () {
  var templates = $('#template');

  data = JSON.parse($('#data').text());

  $('input[name="url"]').val(data.url);
  data = data.data;

  $('#title').text(data.title);

  for (var i = 0; i < Object.keys(data).length - 1; i++) {
    switch (data[i].type) {
      case 'SingleSelect':
        form.append(templates.find('.SingleSelect').clone());
        addSelect_li_tag(data[i], 'radio', i);
        break;
      case 'MultiSelect':
        form.append(templates.find('.MultiSelect').clone());
        addSelect_li_tag(data[i], 'checkbox', i);
        break;
      case 'ShortText':
        form.append(templates.find('.ShortText').clone());
        break;
      case 'LongText':
        form.append(templates.find('.LongText').clone());
        break;
    }

    var tmp = $('form').children();
    var obj = tmp[tmp.length - 1];

    var must = data[i].NOT_NULL ? '**' : '';

    $($(obj).children()[0]).text(data[i].que + '  ' + must);

  }
});

function writeSubmit() {
  var send_data = {};

  $('.mustAns').removeClass('mustAns');

  send_data['url'] = $('input[name="url"]').val();

  var ques = form.children().slice(1);

  for (var i = 0; i < Object.keys(data).length - 1; i++) {
    send_data[i] = [];

    switch (data[i].type) {
      case 'SingleSelect':
        send_data[i].push($(ques[i]).children().find('input:checked').val());
        break;
      case 'MultiSelect':
        // noinspection JSDeprecatedSymbols
        $(ques[i]).children().find('input:checked').each(function (index, obj) {
          send_data[i].push($(obj).val());
        });
        break;
      default:
        send_data[i] = $($(ques[i]).children()[1]).val();
        break;
    }

    if (data[i].NOT_NULL && send_data[i].length === 0) {
      alert('PLZ fill the blank questions');
      $(ques[i]).addClass('mustAns');
      return false;
    }
  }

  $.ajax({
    url: '/survey',
    type: 'POST',
    data: JSON.stringify(send_data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'text',
    success: function (res) {
      document.body.innerHTML = '';
      document.body.innerHTML = res;
    }
  });
}

window.writeSubmit = writeSubmit;
