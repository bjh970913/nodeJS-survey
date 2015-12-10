function addSingleSelect() {
	$("#survey").append($('#template .SingleSelect').clone());
}
function addMultiSelect() {
	$("#survey").append($('#template .MultiSelect').clone());
}
function addShortText() {
	$("#survey").append($('#template .ShortText').clone());
}
function addLongText() {
	$("#survey").append($('#template .LongText').clone());
}
function addSingleOption(e) {
	$(e).parent().append("<li><input type='radio'/><input type='text' value='Edit'/></li>");
	$(e).parent().append($(e));
}
function addMultiOption(e) {
	$(e).parent().append("<li><input type='checkbox'/><input type='text' value='Edit'/></li>");
	$(e).parent().append($(e));
}

function readSingleSelect(i,o){

	var li = $(o).children().select('ul').children();

	for(j=0;j<li.length-1;j++)
	{
		data[i][j] = $(li[j]).children().eq(1).val();
	}
}
function readMultiSelect(i,o){
	var li = $(o).children().select('ul').children();

	for(j=0;j<li.length-1;j++)
	{
		data[i][j] = $(li[j]).children().eq(1).val();
	}
}
function removeQue(e) {
	$(e).parent().remove();
}

var data = {'title':''};

function writeSubmit() {
		
	var field = $('#survey').children();
	
	data['title'] = $(field[0]).val();
	
	field = field.slice(1);
	
	$.each(field, function(i,o) {
		
		data[i]={};

		data[i]['que'] = $($(o).children()[0]).val();

		var type = $(o).attr('class');

		data[i]['type'] = type;

		switch(type) {
			case 'SingleSelect':
				readSingleSelect(i,o);
				console.log('read 0');
				break;
			case 'MultiSelect':
				readMultiSelect(i,o);
				console.log('read 1');
				break;
			case 'ShortText':
				console.log('read 2');
				break;
			case 'LongText':
				console.log('read 3');
				break;
		}


		child = $(o).children();
		data[i]['NOT_NULL'] = $(child[child.length - 2]).prop('checked');
	})

	$.ajax({
		url:"/save",
		type:"POST",
		data:JSON.stringify(data),
		contentType:"application/json; charset=utf-8",
		dataType:"json",
		success: function(res){
			document.body.innerHTML="";
			document.body.innerHTML=res;
		}
	})
}