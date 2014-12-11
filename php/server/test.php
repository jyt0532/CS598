<?php
    $du = file_get_contents("https://maps.googleapis.com/maps/api/distancematrix/json?origins=51.6896118,-0.7846495&destinations=51.7651382,-3.7914676&units=imperial&sensor=false");
    $djd = json_decode(utf8_encode($du),true);
    print_r($djd["rows"][0]["elements"][0]["distance"]["value"]);

?>
