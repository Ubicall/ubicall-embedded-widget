<script> 
$(document) .ready(function(){
	$.fn.serializeObject = function(){    
		var o = {};    var a = this.serializeArray();    
		$.each(a, function() {        
			if (o[this.name] !== undefined) {            
				if (!o[this.name].push) {                
					o[this.name] = [o[this.name]];            
				}            o[this.name].push(this.value || '');        
			} else {            o[this.name] = this.value || '';        
		}    
	});    return o;};       
$('#callForm').submit(function(){       
			var data =JSON.stringify($('#callForm').serializeObject())); 
			var qid =$('#callForm #qid').val(); 
		ubiCallManager.setFormDate(data);    
		ubiCallManager.setPhoneCallQueue(qid);  

	});
});

</script>