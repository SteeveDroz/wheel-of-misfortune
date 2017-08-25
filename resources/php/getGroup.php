<?php

if(!empty($_GET['name']))
{
    $name=$_GET['name'];
    echo json_encode(file_get_contents(direname(dirname(__DIR__)) . '/data/' . $name));
}
