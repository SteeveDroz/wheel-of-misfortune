<?php

if (!empty($_POST['file']))
{
    $file = $_POST['file'];
    $group = $file['group'];
    file_put_contents(dirname(__dir__) . '/data/' . $group . '.json', json_encode($file));
    echo dirname(__dir__) . '/data/' . $group . '.json';
}