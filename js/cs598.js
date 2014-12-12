$(document).ready(_init);
var slider_exist = false;
var distance_filter = 0;
var at_index_page = true;
function _init() {
    google.maps.event.addDomListener($('#search-btn')[0], 'click', initializeMap);
    $('#search-result').hide();
    $('#ex').hide();
    $('#alert-msg').hide();
    show_aspects();
    search_button_click_action();
    clear_button_click_action();
    quota_control();
    get_catogories();
    slider();


    /*$('.select2-input').delegate("input", "click", function(){
      $('.select2-input').css("height", "29px");    
      $('.select2-input').css("margin", "auto");    
      })*/
}
function send_location_request(position){
    send_ajax_and_show_result(distance_filter, position.coords.latitude.toString(), position.coords.longitude.toString());
}
function slider(){
    $( "#slider-range-min" ).slider({
        range: "min",
        value: 1000,
        min: 0,
        max: 3200,
        slide: function( event, ui ) {
            $( "#distance" ).text( ui.value + "meters");
        },
        stop: function( event, ui ) {
            if (navigator.geolocation) {
                distance_filter = ui.value;
                navigator.geolocation.getCurrentPosition(send_location_request);
            }else{ 
                alert("Geolocation is not supported by this browser.");
                slider_exist = false;
            }
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
    var img_div = new_elem("div").addClass("rating-div-" + num).addClass("row");
    img_div.append(new_elem("div").addClass("col-md-5 text-align-left").append(new_elem("span", result[num] + ": ")));
    img_div.append(new_elem("div").attr("rating", 0).addClass("col-md-7"));
    for(var i = 0; i < 5; i++){
        img_div.children().last().append($('<i>').addClass("fa fa-2x rating-img fa-star-o star-not-selected").attr("num", i + 1));    
    }
    new_div.append(img_div);
}


function show_aspects(){
    result = ["Price", "Taste" ,"Environment"];
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
    $(cur_elem).parent().children().removeClass('fa-star star-selected').addClass('fa-star-o star-not-selected'); 
}
function get_total_used_quota(){
    result = ["Price", "Taste" ,"Environment"];
    var total = 0;
    for(var i = 0; i < result.length; i++){

        total += parseInt($($(".rating-div-"+i)[0]).children().last().attr("rating"));
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
function send_ajax_and_show_result(distance, lat, lng){
            var category = [];
            for(var i = 0; i < $('.select2-search-choice-close').length; i++){
            category.push($($('.select2-search-choice-close')[i]).prev().text());
            }
            var pref = [];
            for(var i = 0; i < 3; i++){
                pref.push(parseInt($('.rating-div-' + i).children().last().attr("rating")));
            }
            body_send = {
                category: JSON.stringify(category),
                preference: JSON.stringify(pref)
            };
            if(slider_exist){
                body_send.distance = distance;
                body_send.userlat = lat;
                body_send.userlng = lng;
            }

            ajax_call(
                "php/server/ratings.php",
                body_send
                ,
            function(result){
            $('#result-inner-area').empty();
            for(var i = 0; i < result.length; i++){
                var restaurant_div = new_elem("div", "", "result"+i).addClass("row");
                var result_top = new_elem("div", "", "result-top-"+i).addClass("result-top");
                var result_left = new_elem("div","","result"+i+"_left").addClass("left-result col-md-2");
                var result_middle = new_elem("div", "", "result"+i+"_middle").addClass("right-result col-md-4");
                var result_right = new_elem("div", "", "result"+i+"_right").addClass("right-result col-md-6");
                var show_and_hide_btn = new_elem("button", new_elem("span", "Show", "show-btn-text-"+i), "show-btn-"+i).addClass("btn btn-default btn-sm chart-btn show-hide-btn").attr("num", i).attr("status", 0).prepend(new_elem('i').addClass('fa fa-bar-chart icon-padding'));
                var btn_div = new_elem("div", show_and_hide_btn, "btn-div-"+i).addClass('btn-div');
                if(typeof result[i].first.photo != 'undefined'){
                    result_left.append($('<img src="http:'+ result[i].first.photo+'">').addClass('restaurant-img'));
                }else{
                    result_left.append($('<img src="http://s3-media2.fl.yelpcdn.com/assets/srv0/yelp_styleguide/5f69f303f17c/assets/img/default_avatars/business_medium_square.png">').addClass('restaurant-img'));
                }
                //result_left.append(btn_div);
                result_middle.append(new_elem("div", result[i].first.name, "result"+ i + "_name").prepend(new_elem("span",i+1).addClass("rank-number")));
                var category_div = create_category(result[i].first.category,i);
                result_middle.append(category_div);
                result_middle.append(new_elem("div", "", "result"+ i + "_rating"));
                result_middle.append(new_elem("div", "", "result"+ i + "_price"));
                result_right.append(new_elem("div", $('<span>' + result[i].first.address + '</span>').addClass('m_l'), "result"+ i + "_address"));
                result_right.append(new_elem("div", $('<span>' + result[i].first.phone + '</span>').addClass('m_l'), "result"+ i + "_phone"));
                result_right.append(btn_div);
                result_top.append(result_left);
                result_top.append(result_middle);
                result_top.append(result_right);
                restaurant_div.append(result_top);
                var result_bot = new_elem("div", "", "result-bot-"+i).addClass("result-bot");
                var graph_btn = new_elem("div","", "graph-btn"+i).addClass("show-graph-btn");
                graph_btn.append(new_elem("div", new_elem("button", "Price", "btn-price-"+i).addClass('btn-link')));
                graph_btn.append(new_elem("div", new_elem("button", "Taste", "btn-taste-"+i).addClass('btn-link')));
                graph_btn.append(new_elem("div", new_elem("button", "Environment", "btn-environment-"+i).addClass('btn-link')));
                result_bot.append(graph_btn);
                result_bot.append(new_elem("div","", "graph-"+i).addClass("show-graph"));
                restaurant_div.append(result_bot);
                $('#result-inner-area').append(restaurant_div);
                $('#result-inner-area').append($('<hr>'));
                $('#result'+ i +'_address').prepend($('<i class="fa fa-map-marker"></i>'));
                $('#result'+ i +'_phone').prepend($('<i class="fa fa-phone"></i>'));
                prepend_rating($('#result' + i + '_rating'), parseFloat(result[i].first.rating));
                append_dollar_sign($('#result' + i + '_price'), result[i].first.price);
            }
            $('.result-bot').hide();
            show_and_hide_btn_clicked();
            home_btn_clicked()
            placeMarkers(result, map);
            },
    function(response){
        alert("Get rating failure");
    },
    "post"
    );
}
function draw_point(elem, x,y){
    var middle = [593, 349];
    var semi_major_axis = 329;
    var semi_minor_axis = 138;

    //var x = item["rnnValue"]*semi_major_axis + middle[0];
    //var y = item["normalizedArousal"]*semi_minor_axis + middle[1];
    var point = $("<div class=\"circle\"></div>");
    //point.css("left", x.toString().concat("px"));
    point.css("left", x+"px");
    //point.css("top", y.toString().concat("px"));
    point.css("top", y+"px");
    //point.popover({title:'Tweet', content: item["tweetContent"], trigger:'hover', container: 'body'
    //        ,delay: {show: 50, hide: 100}});
    elem.append(point);
}
function create_category(category, i){
    var category_div = new_elem("div", "", "catogory" + i).addClass("category-text");
    for(var i = 0; i < category.length; i++){
        category_div.append($('<span>'+ category[i]+'</span>'));
        if (i < category.length - 1){
            category_div.append($('<span>, </span>'));    
        }
        else{
            category_div.append($('<span>&nbsp</span>'));       
        }
        
    }
    return category_div;
}
function clear_button_click_action(){
    $('#clear-btn').click(function(){
        var cur_elem = $('.input-area').children().first().next();
        for(var i = 0; i < $('.input-area').children().size() - 1; i++){
            reset_rating($(cur_elem.children().children()[1]).children()[0]);
            $(cur_elem.children().children()[1]).attr('rating',0);
            $("#quota_num").text(9);
            cur_elem = cur_elem.next();
        }
    });
}
function append_dollar_sign(elem, price){
    for(var i = 0; i < price; i++){
        elem.append($('<i class="fa fa-usd"></i>'));
    }
}

function home_btn_clicked() {
    $('#start-searching').click(function(){
        document.location.reload();
    });
}

function show_and_hide_btn_clicked(){
    $('.show-hide-btn').click(function(){
        if($(event.currentTarget).attr("status") == 0){
            var open = $("button[status='1']");
            for (var i = 0; i < open.size(); i++) {
                $("#result-bot-" + $(open[i]).attr("num")).hide("fold", "fast");
                $(open[i]).attr("status", 0);
                $("#show-btn-text-" + $(open[i]).attr("num")).text("Show");
            }
            $('#result-area').animate({scrollTop:$(event.currentTarget).attr("num") * 140}, '500');
            $("#result-bot-" + $(event.currentTarget).attr("num")).show("fold", "10");        
            $(event.currentTarget).attr("status", 1);
            $("#show-btn-text-" + $(event.currentTarget).attr("num")).text("Hide");
            
        }else{
            $("#result-bot-" + $(event.currentTarget).attr("num")).hide("fold", "fast");
            $(event.currentTarget).attr("status", 0);
            $("#show-btn-text-" + $(event.currentTarget).attr("num")).text("Show");

        }
    });
}
function search_button_click_action(){
    $('#search-btn').click(function(){
        if(at_index_page){
            $('.intro').hide();
            $('#about').hide();
            $('#search').hide();
            $('#contact').hide();
            
            $('#search-result').show();
            $('.result_area').appendTo('.new-input-area');
            quota_control();
            $('.page-header').hide();
            $('.select2-container').css('margin-left', '0px');
            $('#s2id_tags').css('width', '200px');
            $('#main-nav').removeClass("navbar-fixed-top");

            $('body').css('overflow', 'hidden');
            
            var jump = $(this).attr('href');
            var new_position = $('#'+jump).offset();
            window.scrollTo(new_position.left,new_position.top);


            slider_exist = true;
            send_ajax_and_show_result();
            at_index_page = false;
        }else{
            send_ajax_and_show_result();
        }
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

