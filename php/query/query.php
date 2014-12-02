<?php
include 'pair.php';

class Query {
  private $restaurants = null;
  private $categories = null; 
  private $restaurant_id_mapping_path = null;
  private $rating_path = null;

  function __construct($category_path, $restaurant_index_path = null, $mapping_path = null, $rating_path = null) {
    if($restaurant_index_path != null) {
      $this -> restaurants = json_decode(file_get_contents($restaurant_index_path, true), true);
    }
    if($category_path != null) {
      $this -> categories = json_decode(file_get_contents($category_path), true);
    }

    if($mapping_path != null) {
      $this -> restaurant_id_mapping_path = $mapping_path;
    }

    if($rating_path != null) {
      $this -> rating_path = $rating_path;
    }
  }

  /**
   * the category.json is a list of category string, so the
   * return type of the function is a php array of category strings
   *
   * @return an array of categories
   */
  public function getAllCategory() {
    return $this -> categories;
  } 

  /**
   * Get all restaurants with specific categories   
   *
   * @param $categories an array of restaurants categories, could be omitted
   * is you want to retrieve all restaurants
   *
   * @return an array of restaurants
   */
  public function getAllRestaurantWithCategory($categories = "NIL") {
    if($categories == null || $categories == "NIL" || count($categories) == 0) {
      return $restaurants;
    }
    $pairs = array();

    foreach($this -> restaurants as &$rest) {
      // some restaurants do not have category tags in yelp
      if(!array_key_exists("category", $rest) || !is_array($rest["category"])) {
        continue;
      }
      $score = $this -> match($rest["category"], $categories);
      if($score > 0) {
        $pair = new Pair($rest, $score);
        array_push($pairs, $pair);
      }
    }

    usort($pairs, "Pair::cmp");
    $ret = array();
    foreach($pairs as $p) {
      array_push($ret, $p -> first);
    }

    return $ret;
  }

  public function retrieveRating($restaurants) {
    if($this -> restaurant_id_mapping_path == "NIL" || $this -> rating_path == "NIL") {
      return null;
    }
    $mapping = json_decode(file_get_contents($this -> restaurant_id_mapping_path), true);
    $rating = json_decode(file_get_contents($this -> rating_path), true);
    $ret = array();
    foreach($restaurants as &$rest) {
      $name = $rest["name"]; 
      if(array_key_exists($name, $mapping)) {
        $id = $mapping[$name];
        if(array_key_exists($id, $rating)) {
          $rate = $rating[$id];
          $pair = new Pair($rest, $rate);
          array_push($ret, $pair);
        }
      }
    }

    return $ret;
  }

  /**
   * helper function to match categories, used in getAllRestaurantWithCategory
   * @param $set1 the category set of a specific restaurant
   * @param $set2 the user chosen category set
   *
   * @return number of matches between 2 parameter sets
   */
  private function match($set1, $set2) {
    $score = 0;
    foreach($set1 as $elem) {
      if(in_array($elem, $set2)) {
        $score ++;
      }
    }

    return $score;
  }

}
?>
