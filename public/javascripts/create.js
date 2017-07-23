var $ = window.$;

function addSingleSelect() {
  $('#survey').append($('#template').find('.SingleSelect').clone());
}

function addMultiSelect() {
  $('#survey').append($('#template').find('.MultiSelect').clone());
}

function addShortText() {
  $('#survey').append($('#template').find('.ShortText').clone());
}

function addLongText() {
  $('#survey').append($('#template').find('.LongText').clone());
}

function addSingleOption(e) {
  $(e).parent().append('<li><input type=\'radio\'/><input  value=\'Edit\'/></li>');
  $(e).parent().append($(e));
}

function addMultiOption(e) {
  $(e).parent().append('<li><input type=\'checkbox\'/><input  value=\'Edit\'/></li>');
  $(e).parent().append($(e));
}

function readSingleSelect(i, o) {

  var li = $(o).children().select('ul').children();

  for (var j = 0; j < li.length - 1; j++) {
    data[i][j] = $(li[j]).children().eq(1).val();
  }
}

function readMultiSelect(i, o) {
  var li = $(o).children().select('ul').children();

  for (var j = 0; j < li.length - 1; j++) {
    data[i][j] = $(li[j]).children().eq(1).val();
  }
}

function removeQue(e) {
  $(e).parent().remove();
}

var data = {'title': ''};

function writeSubmit() {

  var field = $('#survey').children();

  data['title'] = $(field[0]).val();

  field = field.slice(1);

  $.each(field, function (i, o) {

    data[i] = {};

    data[i]['que'] = $($(o).children()[0]).val();

    var type = $(o).attr('class');

    data[i]['type'] = type;

    switch (type) {
      case 'SingleSelect':
        readSingleSelect(i, o);
        console.log('read 0');
        break;
      case 'MultiSelect':
        readMultiSelect(i, o);
        console.log('read 1');
        break;
      case 'ShortText':
        console.log('read 2');
        break;
      case 'LongText':
        console.log('read 3');
        break;
    }


    var child = $(o).children();
    data[i]['NOT_NULL'] = $(child[child.length - 2]).prop('checked');
  });

  $.ajax({
    url: '/save',
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'text',
    success: function (res) {
      document.body.innerHTML = '';
      document.body.innerHTML = res;
    }
  });
}

window.addSingleSelect = addSingleSelect;
window.addMultiSelect = addMultiSelect;
window.addMultiOption = addMultiOption;
window.addShortText = addShortText;
window.addLongText = addLongText;
window.addSingleOption = addSingleOption;
window.removeQue = removeQue;
window.writeSubmit = writeSubmit;
