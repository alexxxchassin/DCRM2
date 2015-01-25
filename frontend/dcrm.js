// function to calculate the most recent timestamp for each bundle of messages from a given user
function getLastTimestamp (messages) {
    var lastTime = null;
    var lastSender = null;
    for (message in messages) {
        if(!lastTime || lastTime < messages[message].time_stamp) {
            lastTime = messages[message].time_stamp
            
        }
    }
    return lastTime;
}

//converts unix timestamps to number of days ago
function timeConverter(unconvertedTime){
    var time = moment(unconvertedTime * 1000).fromNow();
    return time;
}
        // function to calculate the most recent sender for a message

function getLastSender (messages) {
    var lastTime = null;
    var lastSender = null;
    for (message in messages) {
        if (!lastTime || lastTime < messages[message].time_stamp) {
            lastSender = messages[message].sender;
            
        }
        if (lastSender === "GregNYC2014") {
            lastSender = "You"
        } else {
                lastSender = "Her"
        }
    }
    return lastSender;
}

function getUser(users, userName) {
    for (i = 0; i < users.length; i++) { 
        if (users[i].username === userName) {
            return users[i];
        }
    }
    return null;
}
//sorts messages for display
function messageSorter(users) {
    for (i = 0; i < users.length; i++) { 
        users[i].lastMessageTimestamp = getLastTimestamp(users[i].messages)
    }
    users.sort(function(a, b) {
        return b.lastMessageTimestamp - a.lastMessageTimestamp;
    });
    $('#contact-list').empty();
    $.each(messageData.users, function(i, user) {
        timestamp = getLastTimestamp(user.messages);
        recentSender = getLastSender(user.messages);
        timestamp = timeConverter(timestamp);
        if (timestamp === "45 years ago") {
            $('#contact-list').append('<li><img class="ui-li-thumb" src="' + user.profile_url + '" alt="image" id="contactlistimage_' + user.username+ '" height="30" width="30"><a href="" data-id="' + user.username + '">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + user.username + '</a></li>');
        }
        else {
            $('#contact-list').append('<li><img class="ui-li-thumb" src="' + user.profile_url + '" alt="image" id="contactlistimage_' + user.username+ '" height="30" width="30"><a href="" data-id="' + user.username + '">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + user.username + ' - '+ timestamp +' - '+ recentSender +'</a></li>');
        }
    });

    $('#contact-list').listview('refresh');
}

function matchSorter(users) {
    $('#contact-list').empty();
    $.each(messageData.users, function(i, user) {
        timestamp = getLastTimestamp(user.messages);
        recentSender = getLastSender(user.messages);
        timestamp = timeConverter(timestamp);
        if (timestamp === "45 years ago") {
            $('#contact-list').append('<li><img class="ui-li-thumb" src="' + user.profile_url + '" alt="image" id="contactlistimage_' + user.username + '" height="30" width="30"><a href="" data-id="' + user.username + '">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + user.username + '</a></li>');
        }
    });

    $('#contact-list').listview('refresh');
}

//gets parameters from the URL
function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('?'); 
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];   
        }
    }
}

function renderUsers(result) {
    messageData.users = result.users;
    var timestamp = null;
    var recentSender = null;
    $.each(result.users, function(i, user) {
        timestamp = getLastTimestamp(user.messages);
        recentSender = getLastSender(user.messages);
        timestamp = timeConverter(timestamp);
        if (timestamp === "45 years ago") {
         $('#contact-list').append('<li><img class="ui-li-thumb" src="' + user.profile_url + '" alt="image" id="contactlistimage_' + user.username+ '" height="30" width="30"><a href="" data-id="' + user.username + '">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + user.username + '</a></li>');
        } 
       // $('#contact-list').append('<li><a href="" data-id="' + user.username + '">' + user.username + '</a></li>');
       //}
        else {
            $('#contact-list').append('<li><img class="ui-li-thumb" src="' + user.profile_url + '" alt="image" id="contactlistimage_' + user.username+ '" height="30" width="30"><a href="" data-id="' + user.username + '">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + user.username + ' - '+ timestamp +' - '+ recentSender +'</a></li>');
        }
    });

    $('#contact-list').listview('refresh');
    messageSorter(messageData.users);
   // $('.scroll').jscroll({
//loadingHtml: '<small>Loading...</small>',
//callback: scrollMore,
//debug: true
//});
}

function scrollMore() {
    ajaxRenderUsers(messageData.users, currentPosition, 5);
console.log("I've been called");
}

var idAuthCode = null;
var currentPosition = null;
var currentStart = null;
var currentNum = null;

function afterLogin(result) {
idAuthCode = result;
$.mobile.changePage( "#home", { transition: "slide", changeHash: false });
}

function ajaxRenderUsers(info, start, num) {
var url = "http://dcrm.derektest1.com/data/?" + "id=" + info.id + "&authcode=" + info.authcode + "&start=" + start + "&num=" + num
currentPosition = start + num
currentStart = start
currentNum = num
    $.ajax({
        url: url,
        dataType: "jsonp",
        async: true,
        success: renderUsers,
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
        
    });

}

function interestSorter(info) {
    for(var i=0; i<users.length ; i++) {
        users.append("<li>"+users.interestLevel[i]+"</li>");

interestSort.listview({
        autodividers:true,
        autodividersSelector: function ( li ) {
            var interest = user.interestLevel
            return (user.interestLevel)
        }
    });
$("#contact-list").listview("refresh");

}
}

function renderProfile(username, hist) {
    $('#profileusername').empty();
    $('#profileimage').empty();
    $('#contact-data').empty();
    $('#servicelogo').empty();
    $('#commhist').empty();
    var user = getUser(messageData.users, username);
    console.log(user);
    var profileimg = user.profile_url
    if (user.displayName === undefined) {
    $('#profileusername').append("<strong>" + user.username + "</strong>");
    }
    else {
     $('#profileusername').append("<strong>" + user.displayName + "</strong>");   
    }
    $('#profileimage').attr("src",profileimg);

    if (user.service === "okc") {
    $('#servicelogo').attr("src","okc_icon.png");
    }

    var timestamp = null;
    var recentSender = null;
    timestamp = getLastTimestamp(user.messages);
    recentSender = getLastSender(user.messages);
    if (recentSender === "Her") {
        recentSender = "She"
    }
    if (hist === "Y") {
        $("#profilenav").hide();
        $("#historycontainer").show();
    timestamp = timeConverter(timestamp);
    if (recentSender === null) {
        $('#commhist').append('No messages yet...');
    } else {
        $('#commhist').append(recentSender + " sent the last message " + timestamp + ".");
    }
}
else {
$("#historycontainer").hide();
$("#profilenav").show();
}

$('input[type=radio][value=' + user.interestLevel + ']').attr('checked', true);
$('input[type=radio][value=' + user.statusLevel + ']').attr('checked', true);
}


$(document).on('click', '#loginbutton', function(event){      
var url = "http://dcrm.derektest1.com/login/"
var userinfo = $("#loginform").serialize()
 event.preventDefault()
 $.ajax({
        url: url,
        data: userinfo,
        type: "get",
        async: true,
        dataType: "jsonp",
        success: afterLogin,
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });
 });

$(document).on('pagebeforeshow', '#home', function(){      
ajaxRenderUsers(idAuthCode, 0, 15);
$('#contact-list').empty();
});

var messageData = {
    users : null
}
var userNameClicked = null;

$(document).on('pagebeforeshow', '#contact-info', function(){      
    $('#contact-data').empty();
    // This loops through each of the users in the list to find the one that was clicked
    $.each(messageData.users, function(i, user) {
        if(user.username == userNameClicked) {
            // This loops through each "message", which is the text one person sends to another
            $.each(user.messages, function(i, message) {
                $('#contact-data').append('<li>' + message.sender + ': ' + message.content + '</li>');
            });
            $('#contact-data').listview('refresh');  
        }
    });
});

$(document).on('click', '#refreshbutton', function() {
var url = "http://dcrm.derektest1.com/data/?" + "id=" + idAuthCode.id + "&start=" + currentStart + "&num=" + currentNum

       $.ajax({
        url: url,
        dataType: "jsonp",
        async: true,
        success: alert("Refresh in progress"),
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
});
       $("#contact-list").listview("refresh");
});

//displays the contact info page with the messaging history for the individual user
$(document).on('click', '#contact-list li a', function(){  
    userNameClicked = $(this).attr('data-id');
    $.mobile.changePage( "#contact-info", { transition: "slide", changeHash: false });
});
//sorts the users by most recent message first
$(document).on('click', '#newsort', function(){
    messageSorter(messageData.users);
});

$(document).on('click', '#matchsort', function(){
    matchSorter(messageData.users);
});

$(document).on('click','#interestsort', function(){
interestSorter(messageData.users);
});

//$(document).on('pagebeforeshow', '#profile', function(){      
//renderProfile(userNameClicked,hist);
//});

$(document).on('click','#profilelink', function() {
var hist = "Y"
$.mobile.changePage( "#profile", { transition: "slide"});
renderProfile(userNameClicked,hist);
});

var usercount = 0;

$(document).on('click','#assignbutton', function() {
var hist = "N"
var firstUser = messageData.users[usercount].username
$.mobile.changePage( "#profile", { transition: "slide"});
renderProfile(firstUser,hist);
});

$(document).on('click','#assignnext', function() {
var hist = "N"
usercount++
var nextUser = messageData.users[usercount].username
$.mobile.changePage( "#profile", { transition: "slide"});
renderProfile(nextUser,hist);
});

$(document).on('click','#assignprev', function() {
var hist = "N"
usercount--
var prevUserUser = messageData.users[usercount].username
$.mobile.changePage( "#profile", { transition: "slide"});
renderProfile(prevUser,hist);
});

//sets the interest level of each user on the profile page
$(document).on('click','#interestselect', function() {
var user = getUser(messageData.users, userNameClicked)
user.interestLevel = $('input[name=interestbutton]:checked').val()
});

//sets the status of each user on the profile page
$(document).on('click','#statusselect', function() {
var user = getUser(messageData.users, userNameClicked)
user.statusLevel = $('input[name=statusbutton]:checked').val()
});

$(document).on('click','#nameedit',function() {
var user = getUser(messageData.users, userNameClicked);
user.displayName = prompt("Enter a new name");
$('#profileusername').empty();
$('#profileusername').append("<strong>" + user.displayName + "</strong>");
});