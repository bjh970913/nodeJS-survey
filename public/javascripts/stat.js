var ans = [];
var ans_total = {};

$(document).ready(function () {
  var meta = $('#meta').text();
  var template = $('#template');
  var statBy = $('#statByQ');
  meta = JSON.parse(meta);


  for (var i = 0; i < Object.keys(meta.data).length - 1; i++) {
    $('#stat').find('tr').append('<th>' + meta.data[i].que + '</th>');
  }

  $('#ans').children().each(function (index, obj) {
    var dat = $(obj).text();
    dat = JSON.parse(dat);
    ans.push(dat);
  });

  for (var index in ans) {
    var dat = ans[index];

    var tr = '<tr>';

    var data = dat.data;
    var meta_dat = meta.data;

    for (i = 0; i < Object.keys(meta_dat).length - 1; i++) {
      var sel;

      switch (meta_dat[i].type) {
        case 'SingleSelect':
          sel = data[i][0];

          if (typeof(ans_total[i]) === 'undefined') {
            ans_total[i] = [];
          }
          ans_total[i].push(sel);

          sel = meta_dat[i][sel];
          tr += '<td><div>' + sel + '</div></td>';
          break;
        case 'MultiSelect':
          sel = data[i];
          var all = '';

          if (typeof(ans_total[i]) === 'undefined') {
            ans_total[i] = [];
          }
          ans_total[i] = ans_total[i].concat(sel);

          for (var j in sel) {
            all += meta_dat[i][sel[j]] + ', ';
          }

          tr += '<td><div>' + all.slice(0, -2) + '</div></td>';
          break;
        case 'ShortText':
          tr += '<td><div>' + data[i] + '</div></td>';
          break;
        case 'LongText':

          tr += '<td><div>' + data[i] + '</div></td>';
      }

    }

    tr += '</tr>';

    $('#stat').append(tr);
  }

  meta_dat = meta.data;

  $('#title').text(meta_dat.title);

  for (i = 0; i < Object.keys(meta_dat).length - 1; i++) {
    var no_title = 0;
    switch (meta_dat[i].type) {
      case 'SingleSelect':
        statBy.append(template.find('.SingleSelect').clone());
        addSelect_li_tag(meta_dat[i], 'radio', i);
        break;
      case 'MultiSelect':
        statBy.append(template.find('.MultiSelect').clone());
        addSelect_li_tag(meta_dat[i], 'checkbox', i);
        break;
      default:
        no_title = 1;
        break;
    }
    if (no_title !== 1) {
      var tmp = statBy.children();
      var obj = tmp[tmp.length - 1];
      obj = $(obj).children()[0];

      $(obj).text(meta_dat[i].que);
    }

  }
});

function addSelect_li_tag(data, type, name_pre) {
  var tmp = $('#statByQ').children();
  var obj = tmp[tmp.length - 1];

  var ul = $(obj).children()[1];

  for (var j = 0; j <= Object.keys(data).length - 4; j++) {
    var ans_num = 0;

    for (var index = 0; index < ans_total[name_pre].length; index++) {
      if (ans_total[name_pre][index] === j) {
        ans_num++;
      }
    }

    $(ul).append('<li><input type=\'' + type + '\' name=\'' + name_pre + '\' value=\'' + j + '\'/><label>' + data[j] + '</label><span>' + ans_num + '</span></li>');
  }
  if (type === 'radio') {
    r1 = $(ul).children().first().children().first().attr('checked', true);
  }
}