$(document).ready(_init);
var open_code_flag = 1;
function _init() {
    $('#search-result').hide();
    show_aspects();
    search_button_click_action();
    quota_control();
    get_catogories();


    $('.select2-input').delegate("input", "click", function(){
        $('.select2-input').css("height", "29px");    
        $('.select2-input').css("margin", "auto");    
    })
}
function get_catogories(){
    ajax_call(
        "php/server/category.php",
        null,
        function(availableTags){
            append_tags_options(availableTags);
            $("#tags").select2();
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
function append_radios(new_div, num){
    var img_div = new_elem("div").attr("rating", 0).addClass("rating-div-" + num);
    for(var i = 0; i < 5; i++){
        img_div.append($('<img>').addClass("img-not-selected rating-img").attr("num", i + 1));    
    }
    new_div.append(img_div);
}
function show_aspects(){
    result = ["Price", "Location" ,"Environment"];
    /*
       ajax_call(
       "",
       null,
       function(result){
       for(var i=0; i < result.length; i++){

       var new_div = new_elem("div", new_elem("span", result[i]));
       append_radios(new_div);
       $('#result_detail_div').append(new_div);
       }
       },
       function(response){
       alert("Get aspects failure");
       },
       "get"
       );*/
    $('#result_detail_div').attr('num', result.length);
    for(var i=0; i < result.length; i++){
        var new_div = new_elem("div", new_elem("span", result[i]));
        append_radios(new_div, i);
        $('.input-area').append(new_div);
    }
}
function get_quota(elem){
    return parseInt(elem.next().text());
}
function reset_rating(cur_elem){
    $(cur_elem).parent().children().removeClass('img-selected').addClass('img-not-selected'); 
}
function get_total_used_quota(){
    //AJAX!!
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
            $("#quota_num").text(get_total_used_quota());
            for(var i = 0 ; i < rating; i++){
                $(cur_elem).removeClass('img-not-selected').addClass('img-selected');
                var prev = cur_elem.previousSibling;
                cur_elem = prev;
            }

    });

}
function search_button_click_action(){
    $('#search-btn').click(function(){
        $('.intro').hide();
        $('#search').hide();
        $('#about').hide();
        $('#download').hide();
        $('#contact').hide();
        $('#map').hide();
        $('#search-result').show();
        $('.result_area').clone().appendTo('.new-input-area');
        $('.page-header').hide();
        $('.select2-container').css('margin-left', '0px');
        $('#s2id_tags').css('width', '200px');
        $('#main-nav').removeClass("navbar-custom navbar-fixed-top");

        var result = a = [{"a":1, "b":2}, {"a":3, "b":4}];
        render_restaurant_result(result);
    });
}
function render_restaurant_result(result){
    for(var i = 0; i < result.length; i++){
        var restaurant_div = new_elem("div","" , "result"+i);
        restaurant_div.append(new_elem("div", result[i].a, "result"+ i + "_name"));
        restaurant_div.append(new_elem("div", result[i].b, "result"+ i + "_star"));
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

