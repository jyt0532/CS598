$(document).ready(_init);
var open_code_flag = 1;
function _init() {
  hide_all_tabs_but("home");

  $("#home_tab").click(_handle_home_tab_click);
  $("#search_tab").click(_handle_search_tab_click);
  $("#keyword_tab").click(_handle_keyword_tab_click);
  $("#post_tab").click(_handle_post_tab_click);
  $("#post_tab_button").click(_handle_post_tab_click);
  $("#search_tab_button").click(_handle_search_tab_button_click);
  $("#learn_more").click(_handle_learn_more_button_click);
 
  $("#search_button").click(_handle_search_button_click);
  $("#post_question_button").click(_handle_post_question_click);
  $("#post_solution_button").click(_handle_post_solution_click);
  $("#code-editor").hide();
  $("#show_or_hide_code_area_button").click(_handle_open_code_area_button_click);
  $(".register").click(function(){
    window.open("http://cky.cs.illinois.edu/project/register.php");
  });
  $('.wrd').click(function(){
    $("#search_tab").trigger("click");
    $("#search_category").val("All");
    $("#keyword").val($(this).children(0).text());
    $("#search_button").trigger("click");
  });

//  $("#login").click(_handle_login_request);
  ajax_call(
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
  );
}

function _handle_login_request(){
   ajax_call(
    "./login.php",
    {
      id: $("#username").val(),
      passwd: $("#password").val()
    },
    function(result) {
      //location.href += "member.html";
      //window.location += "member.html";
//      $('.navbar-form').remove();
  //    $('.nav-collapse').append(result);
    },
    function(response) {
      alert("Log in failed");
    },
    "post"
  );

}

function hide_all_tabs_but(tab) {
  $("#home_div").hide();
  $("#search_div").hide();
  $("#post_div").hide();
  $("#keyword_div").hide();
  if (typeof tab != "undefined") {
    $("#"+tab+"_div").show();
  }
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

function new_link(content, id) {
  var link = new_elem("a", content).css("cursor", "pointer");
  if (typeof id != "undefined") {
    return link.attr("id", id);
  }
  return link;
}

function _handle_open_code_area_button_click() {
  if (open_code_flag == 1) {
    $("#code-editor").show();
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/clouds");
    editor.getSession().setMode("ace/mode/c_cpp");
    $("#code-language").change(function(){
      var editor = ace.edit("editor");
      editor.getSession().setMode("ace/mode/" + $(this).find(":selected").text());
    });
    $('#show_or_hide_code_area_button').text("Hide Code Editor")
    open_code_flag = 0;
  } else {
    $("#code-editor").hide();
    $('#show_or_hide_code_area_button').text("Open Code Editor");
    open_code_flag = 1;
  }
}

function _handle_home_tab_click() {
  hide_all_tabs_but("home");
  $("#search_tab").parent().removeClass("active"); 
  $("#keyword_tab").parent().removeClass("active"); 
  $("#post_tab").parent().removeClass("active"); 
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
  $("#keyword_tab").parent().removeClass("active"); 
  $("#search_tab").parent().removeClass("active"); 
  $("#post_tab").parent().addClass("active"); 
}

function empty_result_detail() {
  $("#detail_question_div").empty();
  $("#detail_solutions_div").empty();
  $("#solution_text").val("");
  ace.edit("editor").setValue("");
  $("#post_solution_button").removeAttr("qid");
}

function empty_search_result() {
  $("#keyword").val("");
  $("#result_list_div").empty();
  empty_result_detail();
}

function _handle_search_button_click() {
  ajax_call(
    "./post.php",
    { 
      method: "search_question",
      category: $("#search_category").val(),
      keyword: $("#keyword").val()
    },
    function(result) {
      $("#result_list_div").empty();
      empty_result_detail();
      $("#result_detail_div").hide();

      var list = new_elem("div").addClass("list-group");
      $("#result_list_div").append(list);
      for (var i=0; i<result.length; i++) {
        var content = 
          new_link(result[i]['title'])
          .addClass("list-group-item")
          .attr({
            "id": "item_q"+result[i]['id'],
            "qid": result[i]['id']
          });
//        var content_div = new_elem("div", content);
/*        var item = new_elem("li", content_div)
          .attr({
            "id": "item_q"+result[i]['id'],
            "qid": result[i]['id']
          })
          .addClass("result-item")
          .append(content_div);*/
        list.append(content);
      }
      $(".list-group-item").click(_handle_result_item_click);
    },
    function(error) {
      alert("Searching failed");
    },
    "post"
  );
}

function _handle_result_item_click() {
  $(".list-group-item").removeClass("active");
  $(event.currentTarget).addClass("active");
  empty_result_detail();
  $("#result_detail_div").hide();
  var qid = $(this).attr("qid");
  ajax_call(
    "./post.php?request=solutions&id="+qid,
    null,
    function(solutions) {
      var ques_post = new_elem("div").attr("qid", qid);
      $("#detail_question_div").append(ques_post);
      render_post("question", qid, ques_post);

      for (var i=0; i<solutions.length; i++) {
        var sid = solutions[i]['id'];
        var soln_div = new_elem("div").attr("id", "post_s"+sid).attr("sid", sid);
        render_post("solution", sid, soln_div);
        $("#detail_solutions_div").append(soln_div);
      }
      $("#post_solution_button").attr("qid", qid);
      $("#result_detail_div").show();
    },
    function(error, response) {
      alert("Showing question failed");
    }
  );
}

function _handle_edit_click() {
  var div = $(this).parent().parent();
  var full_id = typeof div.attr("qid") != "undefined" ?
    "q"+div.attr("qid") : "s"+div.attr("sid");
  var html = $(div.children().get(0)).html();
  div.empty();
  var textarea = new_elem("textarea", htmlToText(html)).addClass("edit_area");
  var cancel_button = 
    new_elem("button", "cancel", "cancel_"+full_id)
    .addClass("btn")
    .addClass("btn-default")
    .addClass("btn-cancel");
  var done_button = 
    new_elem("button", "Done", "done_"+full_id)
    .addClass("btn")
    .addClass("btn-success")
    .addClass("btn-done");
  var button_div = 
    new_elem("div")
    .append(cancel_button)
    .append(done_button)
    .addClass("to_right");
  div.append(textarea).append(button_div);
  $("#cancel_"+full_id).click(_handle_cancel_click);
  $("#done_"+full_id).click(_handle_done_click);
}

function _handle_delete_click() {
  var div = $(this).parent().parent();
  var id = div.attr("qid");
  var method;
  if (typeof id != "undefined") {
    method = "delete_question";
  } else {
    id = div.attr("sid");
    method = "delete_solution";
  }
  ajax_call(
    "./post.php",
    {
      method: method,
      id: id
    },
    function() {
      if (method == "delete_question") {
        $("#item_q"+id).remove();
        empty_result_detail();
      } else {
        $("#post_s"+id).remove();
      }
    },
    function() {
      alert("Deleting failed");
    },
    "post"
  );
}

function _handle_cancel_click() {
  var div = $(this).parent().parent();
  var qid = div.attr("qid");
  if (typeof qid != "undefined") {
    render_post("question", qid, div);
  } else {
    render_post("solution", div.attr("sid"), div);
  }
}

function _handle_done_click() {
  var div = $(this).parent().parent();
  var desc_text = $(div.children().get(0));
  if (desc_text.val() == "") {
    alert("Description can not be empty");
    return;
  }

  var id = div.attr("qid");
  if (typeof id != "undefined") {
    method = "edit_question";
  } else {
    method = "edit_solution";
    id = div.attr("sid");
  }
  ajax_call(
    "./post.php",
    {
      method: method,
      id: id,
      desc: desc_text.val()
    },
    function() {
      if (method == "edit_question") {
        render_post("question", id, div);
      } else {
        render_post("solution", id, div);
      }
    },
    function() {
      alert("Failed");
    },
    "post"
  );
}

function _handle_post_solution_click() {
  var soln_text = $("#solution_text");
  if (soln_text.val() == "") {
    alert("Description can not be empty");
    return;
  }
  var editor = ace.edit("editor");
  var code = editor.getValue();
  var lang = $("#code-language").find(":selected").text();
  ajax_call(
    "./post.php",
    { 
      method: "post_solution",
      qid: $(this).attr("qid"),
      desc: soln_text.val(),
      code: code,
      language: lang
    },
    function(sid) {
      soln_text.val("");
      ace.edit("editor").setValue("");
      var div = 
        new_elem("div")
        .attr("id", "post_s"+sid)
        .attr("sid", sid)
        .addClass("thumbnail");
      $("#detail_solutions_div").append(div);
      render_post("solution", sid, div);
    },
    function() {
      alert("Failed");
    },
    "post"
  );
}

function render_post(post_type, id, div) {
  ajax_call(
    "./post.php?request="+post_type+"&id="+id,
    null,
    function(result) {
      var desc = result['desc'];
      var votes = result['votes'];
      div.empty();
      div.addClass("thumbnail");
      var span = new_elem("span").append(textToHtml(desc));
      var full_id = post_type == "question" ? "q"+id : "s"+id;
      var vote_button = 
        new_elem("button", "+"+votes, "vote_"+full_id)
        .addClass("btn")
        .addClass("btn-default")
        .attr("value", votes);
      var edit_button =
        new_elem("button", "edit", "edit_"+full_id)
        .addClass("btn")
        .addClass("btn-success")
      var delete_button =
        new_elem("button", "delete", "delete_"+full_id)
        .addClass("btn")
        .addClass("btn-danger")
      var button_div = new_elem("div").addClass("to_right")
        .append(vote_button)
        .append(edit_button)
        .append(delete_button);
      div.append(span).append(button_div);
      $("#vote_"+full_id).click(_handle_vote_click);
      $("#edit_"+full_id).click(_handle_edit_click);
      $("#delete_"+full_id).click(_handle_delete_click);
      if(post_type == "solution" && result['code'] !=""){
        var code = result['code'];
        var language = result['language'];
        div.append(new_elem("pre", code , "editor" + full_id).addClass("editor"));
        //var editor = ace.edit("editor" + full_id);
        //editor.setTheme("ace/theme/clouds");
        //editor.getSession().setMode("ace/mode/" + language);
      }
    },
    function() {
      div.remove();
      alert("Updatin post failed");
    }
  );
}

function _handle_vote_click() {
  var div = $(this).parent().parent();
  var votes = parseInt($(this).attr("value"), 10)+1;
  var voted_button
    = new_elem("button","+"+votes).attr("value", votes)
      .addClass("btn")
      .addClass("btn-default");
  $(this).before(voted_button);
  $(this).remove();

  var id = div.attr("qid");
  if (typeof id != "undefined") {
    method = "vote_question";
  } else {
    method = "vote_solution";
    id = div.attr("sid");
  }
  ajax_call(
    "./post.php",
    {
      method: method,
      id: id
    },
    null,
    null,
    "post"
  );
}


// Post Tab 

function _handle_post_question_click() {
  var ques_title = $("#question_title_text");
  if (ques_title.val() == "") {
    alert("Title can not be empty");
    return;
  }
  var ques_desc = $("#question_text");
  if (ques_desc.val() == "") {
    alert("Question can not be empty");
    return;
  }
  ajax_call(
    "./post.php",
    { 
      method: "post_question",
      category: $("#post_category").val(),
      title: ques_title.val(),
      desc: ques_desc.val()
    },
    function() {
      ques_title.val("");
      ques_desc.val("");
      alert("Succeed")
    },
    function() {
      alert("Failed");
    },
    "post"
  );
}

// Conversions between <br> and '\r\n'

function textToHtml(text) {
  return text == null? null : text.replace(/(\r\n|\n|\r)/gm, "<br>");
}

function htmlToText(html) {
  return html == null? null : html.replace(/<br\s*\/?>/ig, "\r\n");
}

