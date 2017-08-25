<?php

if (!empty($_POST['file']))
{
    $file = $_POST['file'];
    $group = $file['group'];
    file_put_contents(dirname(dirname(__dir__)) . '/data/' . $group . '.json', json_encode($file));
    var_dump(file_get_contents(dirname(dirname(__dir__)) . '/data/' . $group . '.json', json_encode($file)));
}
