$(document).ready(_init);
var open_code_flag = 1;
function _init() {
    google.maps.event.addDomListener($('#search-btn')[0], 'click', initializeMap);
    $('#search-result').hide();
    $('#ex').hide();
    $('#alert-msg').hide();
    show_aspects();
    search_button_click_action();
    quota_control();
    get_catogories();
    slider();


    /*$('.select2-input').delegate("input", "click", function(){
      $('.select2-input').css("height", "29px");    
      $('.select2-input').css("margin", "auto");    
      })*/
}
function slider(){
    $( "#slider-range-min" ).slider({
        range: "min",
        value: 1000,
        min: 0,
        max: 3200,
        slide: function( event, ui ) {
            $( "#distance" ).text( ui.value + "meters");
        }
    });
    //$( "#distance" ).texr( "$" + $( "#slider-range-min" ).slider( "value" ) );
}
function get_catogories(){
    ajax_call(
            "php/server/category.php",
            null,
            function(availableTags){
            append_tags_options(availableTags);
            $("#tags").select2({
placeholder: "Select Categories"
});
            },
            function(response){
            alert("Get category failure");
            },
            "get"
            );
    }
function append_tags_options(availableTags){
    for(var i = 0; i < availableTags.length; i++){
        $('#tags').append(new_elem("option", availableTags[i]).attr("value", availableTags[i]));
    }
}
function hide_all_div(){
    $('#search_div').hide();
    $('#map_div').hide();
    $('#result_div').hide();
}
function search_mode(){
    hide_all_div();
    $('#search_div').show();
}
function append_radios(new_div, result, num){
    var img_div = new_elem("div").attr("rating", 0).addClass("rating-div-" + num);
    img_div.append(new_elem("span", result[num] + ": "));
    for(var i = 0; i < 5; i++){
        img_div.append($('<i>').addClass("fa fa-star-o fa-2x rating-img star-not-selected").attr("num", i + 1));    
    }
    new_div.append(img_div);
}

//<i class="fa fa-star"></i>

function show_aspects(){
    result = ["Price", "Location" ,"Environment"];
    $('#result_detail_div').attr('num', result.length);
    for(var i=0; i < result.length; i++){
        var new_div = new_elem("div");
        append_radios(new_div, result, i);
        $('.input-area').append(new_div);
        //$('#quota-area').after(new_div);
    }
}
function get_quota(elem){
    return parseInt(elem.next().text());
}
function reset_rating(cur_elem){
    $(cur_elem).parent().children().not('span').removeClass('fa-star').addClass('fa-star-o star-not-selected'); 
}
function get_total_used_quota(){
    result = ["Price", "Location" ,"Environment"];
    var total = 0;
    for(var i = 0; i < result.length; i++){
        total += parseInt($(".rating-div-"+i).attr("rating"));
    }
    return 9-total;
}
function quota_control(){
    $('.rating-img').click(function(){
            var cur_elem = event.currentTarget;
            reset_rating(cur_elem);
            var rating = parseInt($(cur_elem).attr("num"));
            $(cur_elem).parent().attr("rating", rating);
            if(get_total_used_quota() < 0){
            $('#search-btn')[0].disabled = true;
            $('#ex').show().css('color', 'red');
            $('#quota_num').css('color', 'red');
            }else{
            $('#search-btn')[0].disabled = false;
            $('#ex').hide();
            $('#quota_num').css('color', 'black');
            }
            $("#quota_num").text(get_total_used_quota());
            for(var i = 0 ; i < rating; i++){
            $(cur_elem).removeClass('fa-star-o star-not-selected').addClass('fa-star star-selected');
            var prev = cur_elem.previousSibling;
            cur_elem = prev;
            }

    });

}


function search_button_click_action(){
    $('#search-btn').click(function(){
            $('.intro').hide();
            $('#about').hide();
            $('#search').hide();
            $('#contact').hide();
            
            $('#search-result').show();
            $('.result_area').clone(true).appendTo('.new-input-area');
            quota_control();
            //get_catogories();
            $('.page-header').hide();
            $('.select2-container').css('margin-left', '0px');
            $('#s2id_tags').css('width', '200px');
            $('#main-nav').removeClass("navbar-fixed-top");
            $('body').css('overflow', 'hidden');
            

            var category = [];
            for(var i = 0; i < $('.select2-search-choice-close').length/2; i++){
            category.push($($('.select2-search-choice-close')[i]).prev().text());
            }
            var pref = [];
            for(var i = 0; i < 3; i++){
                pref.push(parseInt($('.rating-div-' + i).attr("rating")));
            }

            var jump = $(this).attr('href');
            var new_position = $('#'+jump).offset();
            window.scrollTo(new_position.left,new_position.top);

            ajax_call(
                    "php/server/ratings.php",
                    {
category: JSON.stringify(category),
preference: JSON.stringify(pref)
},
function(result){
for(var i = 0; i < result.length; i++){
var restaurant_div = new_elem("div","" , "result"+i).addClass("row");
var result_left = new_elem("div", new_elem("span", i+1), "result"+i+"_left").addClass("left-result col-md-2");
var result_middle = new_elem("div", "", "result"+i+"_right").addClass("right-result col-md-4");
var result_right = new_elem("div", "", "result"+i+"_right").addClass("right-result col-md-6");
result_middle.append(new_elem("div", result[i].first.name, "result"+ i + "_name"));
result_middle.append(new_elem("div", "", "result"+ i + "_rating"));
result_right.append(new_elem("div", $('<span>' + result[i].first.address + '</span>').addClass('m_l'), "result"+ i + "_address"));
result_right.append(new_elem("div", $('<span>' + result[i].first.phone + '</span>').addClass('m_l'), "result"+ i + "_phone"));
restaurant_div.append(result_left);
restaurant_div.append(result_middle);
restaurant_div.append(result_right);
$('#result-area').append(restaurant_div);
$('#result-area').append($('<hr>'));
$('#result'+ i +'_address').prepend($('<i class="fa fa-map-marker"></i>'));
$('#result'+ i +'_phone').prepend($('<i class="fa fa-phone"></i>'));
prepend_rating($('#result' + i + '_rating'), parseFloat(result[i].first.rating));
}
placeMarkers(result, map);
},
    function(response){
        alert("Get rating failure");
    },
    "post"
    );

    //var result = a = [{"name":"balckdog", "price":2}, {"name":"bankok", "price":"3"}];
    //render_restaurant_result(result);
    });
}
function prepend_rating(elem, rating){
    var num_of_full_star = parseInt(rating);
    var num_of_half_star = 0;
    if(parseInt(rating) != parseFloat(rating)){
        num_of_half_star = 1;
    }
    var num_of_empty_star = 5 - num_of_full_star - num_of_half_star;
    for(var i = 0; i < num_of_empty_star; i++){
        elem.prepend($('<i class="fa fa-star-o"></i>'));
    }
    for(var i = 0; i < num_of_half_star; i++){
        elem.prepend($('<i class="fa fa-star-half-empty"></i>'));
    }
    for(var i = 0; i < num_of_full_star; i++){
        elem.prepend($('<i class="fa fa-star"></i>'));
    }
};
function render_restaurant_result(result){
    for(var i = 0; i < result.length; i++){
        var restaurant_div = new_elem("div","" , "result"+i);
        var result_left = new_elem("div", new_elem("span", i+1), "result"+i+"_left").addClass("left-result");
        var result_right = new_elem("div", "", "result"+i+"_right").addClass("right-result");
        result_right.append(new_elem("div", result[i].name, "result"+ i + "_name"));
        result_left.append(new_elem("div", result[i].price, "result"+ i + "_star"));
        $('.result-area').append(restaurant_div);
    }
}


function ajax_call(url, data, successCallback, errorCallback, type) {
    if (typeof type === "undefined") {
        type = "get";
    }
    $.ajax({
url: url,
type: type,
dataType: 'json',
data: data,
success: successCallback,
error: errorCallback
});
}

function new_elem(name, content, id) {
    var elem = $("<"+name+"></"+name+">");
    if (typeof content == "undefined") {
        return elem;
    }

    elem.append(content);
    if (typeof id == "undefined") {
        return elem
    }

    return elem.attr("id", id);
}


// Conversions between <br> and '\r\n'

function textToHtml(text) {
    return text == null? null : text.replace(/(\r\n|\n|\r)/gm, "<br>");
}

function htmlToText(html) {
    return html == null? null : html.replace(/<br\s*\/?>/ig, "\r\n");
}

