<?php
$users = array(
    '111@gmail.com',
    '123@gmail.com',
    'asd@gmail.com',
    'qwerty@gmail.com',
    'zxc@gmail.com',
    'user@gmail.com'
);

if(in_array(trim($_POST['email']), $users))
        print '1';
else
        print '0';