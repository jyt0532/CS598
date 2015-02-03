<?php
  include '../query/query.php';
  include '../query/util.php';
  include 'filter.php';

  $raw_category = $_POST["category"];
  $category = json_decode($raw_category);
  $raw_preference = $_POST["preference"];
  $preference = json_decode($raw_preference);

  /*
  $preference = array(3, 3, 3);
  $category = array();
   */

  if(!is_array($preference)) {
      echo "parameter parse error\n";
      return;
  }


  $q = new Query("../db/category.json", "../db/restaurant_index_final.json", "../db/mapping.json", "../db/rating.json", "../db/RestaurantAddress.json");

  $restaurants = $q -> getAllRestaurantWithCategory($category);
  $restaurants = $q -> convertRestaurantAddressToCoord($restaurants);

  if(array_key_exists("distance", $_POST)) {
    $userlat = $_POST["userlat"];
    $userlng = $_POST["userlng"];
    $dist = $_POST["distance"];
    $userlocation = array("lat" => $userlat, "lng" => $userlng);
    $filter = new Filter($dist, $userlocation); 
    $restaurants = $filter -> filter($restaurants);
  }

  $ratingPairs = $q -> retrieveRating($restaurants);
  foreach($ratingPairs as &$pair) {
    $pair -> second = dot($pair -> second, $preference);
  }

  usort($ratingPairs, "Pair::cmp");

  $hack = json_decode(file_get_contents("../db/rnn.json"), true);
  foreach($ratingPairs as &$pair) {
    
    $arr = null;
    $name = $pair -> first["name"];
    if(array_key_exists($name, $hack)) {
      $arr = $hack[$name];
    }

    $pair -> first["rnn"] = $arr;
  }
 
  echo json_encode($ratingPairs);

?>
