/**
 * initialize google map, set necessary parameter to customize the map object
 *
 */
function initializeMap() {
  var mapProp = {
    center : new google.maps.LatLng(40.11094363, -88.22300514) ,
    zoom : 12 ,
    mapTypeId : google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("googleMap"), mapProp)
}

/**
 * parse a latlng string of form (lat, lng)
 * @param str: a latlng string of described form(must of valid form)
 * @return: a tuple of two [lat, lng] in float type
 *
 */
function parseLatlng(str) {
  var len = str.length
  var comma = str.indexOf(",")
  var lat = str.substring(1, comma)
  var lon = str.substring(comma+2, len)
  return [parseFloat(lat), parseFloat(lon)]
}

/**
 * extract latlng info from each restaurant object and place it to google map
 *
 * @param restaurants: a javascript array of restaurant object
 * @param myMap: google map object
 * 
 * 
 * TODO: for further callback operations, the below code will not work. It has to 
 * be **function closure**
 */

function placeMarkers(restaurants, myMap) {
  for(var i = 0; i < restaurants.length; i ++) {
    // get lat lng tuple
    var latlng = parseLatlng(restaurants[i].latlng)
    var myMarker = new google.maps.Markder({
      position : new google.maps.LatLng(latlng[0], latlng[1])
    }) 
    
    myMarker.setMap(myMap)
  }
}
