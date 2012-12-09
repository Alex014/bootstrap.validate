#Bootstrap validate

##What is it
BV is a validation plugin for twitter bootstrap
It validates data and uses bootstrap tooltips

One field can have multiple methods, methods are separated by '|'
One method can have no, one or many parameters, they are separated by comas ','
Example: validate="method1|method2,param1,param2"

###Headers
    <script src="/js/jquery.js"></script>

    <script src="/js/bootstrap.min.js"></script>
    <link href="/css/bootstrap.min.css" rel="stylesheet">

    <script src="/js/bootstrap.validate.js"></script>
    <script src="/js/bootstrap.validate.en.js"></script>

##Simple validation
###HTML

    <form method="post" id="bt_form">
      <input name="name" type="text" validate="required"/>
      <input name="email" type="text" validate="email"/>
      <input name="www" type="text" validate="www"/>
      <input name="address" type="text" validate="length_min,10"/>
      <input name="number" id="number" type="text" validate="float|between,5,7"/>

###JS

    $('#bt_form').bt_validate();

##Standart validation methods
  * required
  * email
  * www
  * date
  * time
  * datetime
  * number
  * float
  * equal
  * min
  * max
  * between
  * length_min
  * length_max
  * length_between

##Custom validation method
###HTML

    <label for="pass">Password</label>
    <input name="pass" id="pass" type="password" validate="length_min,5"/>
    <label for="pass2">Repeat password</label>
    <input name="pass2" id="pass2" type="password" validate="custom_pass_eq"/>

###JS

    $.bt_validate.method(
      * custom_pass_eq', 
      function(value) {
        return ($('#pass').val() == $('#pass2').val());
      },
      "The passwords are not equal"
    );

##Ajax validation
###HTML

    <input name="email" id="email" type="text" validate="required|email|usercheck"/>

###JS

    $.bt_validate.method(
          * usercheck', 
          $.bt_validate.ajax_check({
            url: '/usercheck.php', 
            type: 'POST',
            return_type: 'text',
            get_data: function() { return {'email': $('#email').val()} }, 
            get_success: function(res) { return (res == '1'); },
            msg_ok: 'This email is free', 
            msg_checking: 'Checking ...', 
            msg_fail: 'This email is olready used'})
    );

Requires:
  * jQuery  *  http://jquery.com/
  * Bootstrap  *  http://twitter.github.com/bootstrap/

##License  
Fuck the bureaucracy, I AM AN ANARCHIST !