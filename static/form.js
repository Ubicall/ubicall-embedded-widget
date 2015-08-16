$(document).ready(function() {
  $.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };

  function submitCallForm(evt){
    var formData = JSON.stringify($('#callForm').serializeObject()));
    var qid = $('#callForm #qid').val(); UbiCallManager.setFormDate(formData); UbiCallManager.setPhoneCallQueue(qid);
    UbiCallManager.goToCallOptions()
  }
});
