/**
 * Bootstrap validate V 0.1 Alpha
 * 
 * No license
 * Do what you want with it
 */
$.bt_validate = {
  method: function(method_name, fn_check, message) {
    $.bt_validate.fn[method_name] = fn_check;
    $.bt_validate.text[method_name] = message;
  }
}

$.fn.show_tooltip = function(text, color) {
    $(this).tooltip('destroy');
    var rid = 'tlt_' + parseInt(new Date().getTime());
    var marker = '<div id="'+rid+'"</div>';
    $(this).tooltip(
      {title: text+marker, html: true, trigger: 'manual', placement: 'right'});
    $(this).tooltip('show');
    $('#'+rid).parent().css({'background-color': color});
    $('#'+rid).parent().prev().css({'border-right-color': color});
}
  
$.fn.show_ok_tooltip = function(text) {
    $(this).show_tooltip(text, 'green')
}

$.fn.show_err_tooltip = function(text) {
    $(this).show_tooltip(text, 'red')
}

$.fn.hide_tooltip = function(text) {
    $(this).tooltip('destroy');
}


$.bt_validate.result = true;
$.bt_validate.blocked = false;

$.bt_validate.block = function() {
  $.bt_validate.blocked = true;
}

$.bt_validate.unblock = function() {
  $.bt_validate.blocked = false;
}

$.fn.bt_validate = function() {
  $.bt_validate.form = $(this);
  $.bt_validate.form.find('input[validate],select[validate],textarea[validate]').blur(function() {
    
    var validate_params = $(this).attr('validate').split('|');
    
    var field_result = true;
    
    for(var i in validate_params) {
      var validate_param = validate_params[i].split(',');
      var fn_name = validate_param[0];
      
      validate_param[0] = $(this).val().trim();
      
      var fn_or_object = $.bt_validate.fn[fn_name];
      
      if(typeof(fn_or_object) == 'function')
        //Validate by function
        var res = fn_or_object.apply($(this), validate_param);
      else
        //Validate by object
        var res = fn_or_object.fn_validate.apply($(this), validate_param);
      
      if(typeof(res) != 'string') {
          if(!res) {
            var tl_text = $.bt_validate.text[fn_name];
            
            for(var j = 1; j < validate_param.length; j++) {
              tl_text = tl_text.replace('%'+j, validate_param[j]);
            }
            
            $(this).show_err_tooltip(tl_text);
            
            field_result = false;
            $.bt_validate.result = false;
            //After validate event
            if($.bt_validate.after_validate != null)
              $.bt_validate.after_validate.call($(this), fn_name, validate_param[0], validate_param.slice(1), false);
            break;
          }
      }
      else {
        field_result = false;
        //After validate event
        if($.bt_validate.after_validate != null)
          $.bt_validate.after_validate.call($(this), fn_name, validate_param[0], validate_param.slice(1), false);
      }
    
    }
    
    //If result is true
    if(field_result) {
      //After validate event
      if($.bt_validate.after_validate != null)
        $.bt_validate.after_validate.call($(this), fn_name, validate_param[0], validate_param.slice(1), true);
      //Hiding tooltip
      $(this).tooltip('hide');
    }
  });
  
  $.bt_validate.form.submit(function() {
    $.bt_validate.result = true;
    $.bt_validate.form.find('input[validate],select[validate],textarea[validate]').trigger('blur');
    
    if($.bt_validate.blocked) return false;
    return $.bt_validate.result;
  });
}

$.bt_validate.validate = function(params) {
    $.bt_validate.result = true;
    $.bt_validate.form.find('input[validate],select[validate],textarea[validate]').trigger('blur');
    
    if($.bt_validate.blocked) return false;
    return $.bt_validate.result;
}

$.bt_validate.ajax_check = function(params) {
  
  this.params = params;
  var ajax_check = this;
  
  this.fn_validate = function(value) {
    //Checking if value has changed
    if((ajax_check.usercheck_prev_value != undefined) && (ajax_check.usercheck_prev_value == value))
      return '';
    
    ajax_check.usercheck_prev_value = value;
    //Blocking form and showing progress
    $.bt_validate.block()
    this.show_tooltip(ajax_check.params.msg_checking, 'blue');

    var self = this;
    //Timeout
    setTimeout(function() {
        //Ajax call
        $.ajax({
          url: ajax_check.params.url, 
          data: ajax_check.params.get_data(), 
          success: function(res) {
            if(ajax_check.params.get_success(res)) {
              //User with same email is found
              self.show_err_tooltip(ajax_check.params.msg_fail);
            }
            else {
              //If no user found, showing "green" tooltip and unblocking the form
              self.show_ok_tooltip(ajax_check.params.msg_ok);
              $.bt_validate.unblock();
              //Hiding tooltip after 3 sec
              setTimeout(function() { self.hide_tooltip(); }, 3000);
            }
          }, 
          type: ajax_check.params.type,
          dataType: ajax_check.params.return_type});      
    },250);
    //Return empty string, if you want to skip standart checking
    return '';
  }
  return this;
}