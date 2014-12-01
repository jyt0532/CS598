<?php
include 'pair.php';

class Query {
  private $restaurants = null;
  private $categories = null; 
  private $restaurant_id_mapping_path;

  function __construct($restaurant_index_path, $category_path, $mapping) {
    $this -> restaurants = json_decode(file_get_contents($restaurant_index_path), true);
    $this -> categories = json_decode(file_get_contents($category_path), true);
    $this -> restaurant_id_mapping_path = $mapping;
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
    if(categories == "NIL") {
      return $restaurants;
    }
    $pairs = array();

    foreach($this -> restaurants as &$rest) {
      // some restaurants do not have category tags in yelp
      if(!is_array($rest["category"])) {
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
    /*
    $mapping = json_decode(file_get_contents($restaurant_id_mapping_path), true);
    foreach($restaurants as &$rest) {
         
    }
     */
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
