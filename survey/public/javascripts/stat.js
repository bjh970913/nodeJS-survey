var ans=[];

$(document).ready(function(){
	var meta = $('#meta').text();
	meta = JSON.parse(meta);
	
	
	for(var i=0;i<Object.keys(meta.data).length-1;i++){
		$('#stat tr').append('<th>'+meta.data[i].que+'</th>');
	}
	
	$('#ans').children().each(function (index, obj) {
		var dat = $(obj).text();
		dat = JSON.parse(dat);
		ans.push(dat);
	})
	
	for(index in ans){
		var dat = ans[index];
		
		var tr="<tr>";
		
		var data = dat.data;
		var meta_dat = meta.data;
		
		for(i=0;i<Object.keys(meta_dat).length-1;i++){
			switch(meta_dat[i].type) {
				case 'SingleSelect':
					var sel = data[i][0];
					sel = meta_dat[i][sel];
					tr+= "<td><div>" + sel + "</div></td>";
					break;
				case 'MultiSelect':
					var sel = data[i];
					var all="";
					
					for(j in sel){
						all+= meta_dat[i][j]+", ";	
					}
					
					tr+= "<td><div>" + all.slice(0,-2) + "</div></td>";
					break;
				case 'ShortText':
					tr+= "<td><div>" + data[i] + "</div></td>";
					break;
				case 'LongText':
					
					tr+= "<td><div>" + data[i] + "</div></td>";
			}
	
		}
		
		tr+= "</tr>";
		
		$('#stat').append(tr);
	}
});