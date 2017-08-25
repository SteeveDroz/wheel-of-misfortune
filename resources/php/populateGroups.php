<?php

$groups = [];
if ($dir = opendir(dirname(dirname(__dir__)) . '/data/'))
{
    while ($file = readdir($dir))
    {
        if (substr($file, 0, 1) != '.' && substr($file, -5) == '.json')
        {
            $groups[] = $file;
        }
    }
    sort($groups);
    echo json_encode($groups);
}
