<?php

if (!empty($_POST['file']))
{
    $file = $_POST['file'];
    unlink(dirname(dirname(__dir__)) . '/data/' . $file . '.json');
}
