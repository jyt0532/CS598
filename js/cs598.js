$(document).ready(_init);
var open_code_flag = 1;
function _init() {
    $('#search-result').hide();
    show_aspects();
    button_click_action();
    quota_control();
    get_catogories();

    //  $("#search_button").click(_handle_search_button_click);
    //  $("#login").click(_handle_login_request);
    /*  ajax_call(
        "./post.php?request=category",
        null,
        function(result) {
        var search_cat = $("#search_category");
        search_cat.val(2);
        var post_cat = $("#post_category");
        for (var i=0; i<result.length; i++) {
        var option = new_elem("option", result[i])
        if (result[i] == "All") {
        option.attr("selected", "selected");
        } else {
        post_cat.append($("<option></option>").append(result[i]));
        }
        search_cat.append(option);
        }
        },
        function() {
        alert("Updating categories failed");
        }
        );*/
}
function get_catogories(){
    var availableTags = [
        "ActionScript",
        "AppleScript",
        "Asp",
        "BASIC",
        "C",
        "C++",
        "Clojure",
        "COBOL",
        "ColdFusion",
        "Erlang",
        "Fortran",
        "Groovy",
        "Haskell",
        "Java",
        "JavaScript",
        "Lisp",
        "Perl",
        "PHP",
        "Python",
        "Ruby",
        "Scala",
        "Scheme"
            ];
   /* $( "#tags" ).autocomplete({
        source: availableTags
    });*/
    append_tags_options(availableTags);
    $("#tags").select2();
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
function button_click_action(){
    $('#search-btn').click(function(){
            $('.intro').hide();
            $('#search').hide();
            $('#about').hide();
            $('#download').hide();
            $('#contact').hide();
            $('#map').hide();
            $('#search-result').show();
            $('.input-area').clone().appendTo('.new-input-area');
            $('#main-nav').removeClass("navbar-custom navbar-fixed-top");
            //$('#start-searching').hide();
            });


}


function ajax_call(url, data, successCallback, errorCallback, type) {
    if (typeof type === "undefined") {
        type = "get";
    }
    $.ajax({
url: url,
type: type,
//dataType: 'json',
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


function _handle_home_tab_click() {
    hide_all_tabs_but("home");
    $("#search_tab").parent().removeClass("active"); 
    $('#home_tab').parent().addClass("active"); 
}
function _handle_keyword_tab_click() {
    hide_all_tabs_but("keyword");
    $("#post_tab").parent().removeClass("active"); 
    $("#home_tab").parent().removeClass("active"); 
    $("#search_tab").parent().removeClass("active"); 
    $("#keyword_tab").parent().addClass("active"); 
}

function _handle_search_tab_click() {
    hide_all_tabs_but("search");
    empty_search_result();
    $("#result_detail_div").hide();
    $("#post_tab").parent().removeClass("active"); 
    $("#keyword_tab").parent().removeClass("active"); 
    $("#home_tab").parent().removeClass("active"); 
    $("#search_tab").parent().addClass("active"); 
}

function _handle_search_tab_button_click() {
    $("#search_tab").trigger("click"); 
}
function _handle_learn_more_button_click() {
    $("#keyword_tab").trigger("click"); 
}

function _handle_post_tab_click() {
    hide_all_tabs_but("post");
    $("#home_tab").parent().removeClass("active"); 
    $("#search_tab").parent().removeClass("active"); 
    $("#post_tab").parent().addClass("active"); 
}


// Conversions between <br> and '\r\n'

function textToHtml(text) {
    return text == null? null : text.replace(/(\r\n|\n|\r)/gm, "<br>");
}

function htmlToText(html) {
    return html == null? null : html.replace(/<br\s*\/?>/ig, "\r\n");
}

