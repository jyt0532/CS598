<?php
//include "../query/pair.php";

class Filter {
  public $dist = null;
  public $userLocation = null;
  function __construct($dist, $userLocation) {
    $this -> dist = $dist;
    $this -> userLocation = $userLocation;
  }

  private function calc($lat, $lng) {
    $format = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=%s,%s&destinations=%s,%s&units=imperial&sensor=false";    
    $request = sprintf($format, $lat, $lng, $this -> userLocation["lat"], $this -> userLocation["lng"]);
    $response = file_get_contents($request);
    if($response == False) {
      echo "Google Map API Error.";
      return 0;
    }
    $json_response = json_decode($response, true);
    $dist_meters = $json_response["rows"][0]["elements"][0]["distance"]["value"];
    echo $dist_meters . "\n";
    return $dist_meters;
  }

  private function parse($latlng) {
    $comma = strpos($latlng, ",");
    
    $lat = substr($latlng, 1, $comma - 1);
    $lng = substr($latlng, $comma + 2, strlen($latlng) - $comma - 3);
    return array($lat, $lng);
  }

  public function filter($restaurants) {
    $ret = array();
    foreach($restaurants as &$rest) {
       $ll = $this -> parse($rest -> first["latlng"]);
       if($this -> calc($ll[0], $ll[1]) <= $this -> dist) {
         array_push($ret, $rest);
       }
    }

    return $ret;
  }
}
?>
