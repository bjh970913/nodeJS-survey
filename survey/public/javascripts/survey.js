var data;
var r1;

function addSelect_li_tag(data, type, name_pre){
	tmp = $("form").children();
	obj = tmp[tmp.length-1];

	ul = $(obj).children()[1]

	for(j=0;j<=Object.keys(data).length - 4;j++) {
		$(ul).append("<li><input type='"+type+"' name='"+name_pre+"' value='"+j+"'/><label>"+data[j]+"</label></li>");
		console.log("access"+i+"_"+j);
	}
	if (type=="radio") {
		r1 = $(ul).children().first().children().first().attr("checked",true);
	};
}		

$(document).ready(function(){
	data = JSON.parse($('#data').text());

	$('input[name="url"]').val(data.url);
	data = data.data;

	$('#title').text(data.title);
	
	for(i=0;i<Object.keys(data).length-1;i++){
		switch(data[i].type) {
			case 'SingleSelect':
				$("form").append($('#template .SingleSelect').clone());
				addSelect_li_tag(data[i], "radio", i);
				break;
			case 'MultiSelect':
				$("form").append($('#template .MultiSelect').clone());
				addSelect_li_tag(data[i], "checkbox", i);
				break;
			case 'ShortText':
				$("form").append($('#template .ShortText').clone());
				break;
			case 'LongText':
				$("form").append($('#template .LongText').clone());
				break;
		}
		
		tmp = $("form").children();
		obj = tmp[tmp.length-1];

		$($(obj).children()[0]).text(data[i].que);

	}
});

function writeSubmit(){
	var send_data={};

	send_data['url'] = $('input[name="url"]').val();

	var ques = $('form').children().slice(1);

	for(i=0;i<Object.keys(data).length-1;i++){
		send_data[i] = [];

		switch(data[i].type) {
			case 'SingleSelect':
				send_data[i].push($(ques[i]).children().find('input:checked').val());
				break;
			case 'MultiSelect':
				$(ques[i]).children().find('input:checked').each(function(index,obj){
					send_data[i].push($(obj).val());
				});
				break;
			default:
				send_data[i] = $($(ques[i]).children()[1]).val();
				break;
		}

		if(data[i].NOT_NULL && send_data[i].length==0)
		{
			alert("PLZ fill the blank questions");
			return false;
		}
	}

	$.ajax({
		url:"/survey",
		type:"POST",
		data:JSON.stringify(send_data),
		contentType:"application/json; charset=utf-8",
		dataType:"text",
		success: function(res){
			document.body.innerHTML="";
			document.body.innerHTML=res;
		}
	})
}