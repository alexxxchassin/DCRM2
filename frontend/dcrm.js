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
    console.log('0');
    for (i = 0; i < users.length; i++) { 
        users[i].lastMessageTimestamp = getLastTimestamp(users[i].messages)
    }
    console.log('a');
    users.sort(function(a, b) {
        return b.lastMessageTimestamp - a.lastMessageTimestamp;
    });
    console.log('b');
    renderUsers(messageData.users);
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
            $('#contact-list').append('<li><a href="" data-id="' + user.username + '">' + user.username + '</a></li>');
        }
        else {
            $('#contact-list').append('<li><a href="" data-id="' + user.username + '">' + user.username + ' - '+ timestamp +' - '+ recentSender +'</a></li>');
        }
    });

    $('#contact-list').listview('refresh');
}

var idAccessCode = null

function afterLogin(result) {

$.mobile.changePage( "#home", { transition: "pop", changeHash: false });
idAccessCode = result;
}

function ajaxRenderUsers(info) {
var url = "http://dcrm.derektest1.com/data/" + info.id + info.accesscode
console.log(url)
    
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

$(document).on('click', '#loginbutton', function(){      
var url = "http://dcrm.derektest1.com/login/"
var userinfo = $("#loginform").serialize()
 $.ajax({
        url: url,
        data: userinfo,
        type: "get",
        dataType: "json",
        success: afterLogin(result),
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });
 console.log(userinfo)
 console.log(url)
 });

$(document).on('pageinit', '#home', function(){      
ajaxRenderUsers();
             
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



/* $(document).on('pageinit', '#headline', function(){      
    $('#contact-data').empty();
     This loops through each of the users in the list to find the one that was clicked
    $.each(messageData.messages, function(id, data) {
        if(id == messageData.id) {
             This loops through each "message", which is the text one person sends to another
          $.each(data, function(i, message) {
               var argument1 = message.sender;
            var p = $.param({argument1:argument1});
                console.log(p);
               $('#profilelink').attr({'href': _href + '?' + p});
                
            });
                
            $('#contact-data').listview('refresh');
                        
        }
   });
}); */
/*$(document).ready(function()) {
$("#profilelink").click(function(e) {
    e.preventDefault();
    window.location.href = $(this).attr("href") + '?' + message.sender;
    console.log(message.sender);
});
}); */

//displays the contact info page with the messaging history for the individual user
$(document).on('click', '#contact-list li a', function(){  
    userNameClicked = $(this).attr('data-id');
    $.mobile.changePage( "#contact-info", { transition: "slide", changeHash: false });
});

$(document).on('click', '#newsort', function(){
    console.log('in click');  
    messageSorter(messageData.users);
});

/* $(document).on('pageinit', '#profile', function(){      
    var url = 'data1.json'
    var userPassed = getUrlParameter("user");
    console.log(userPassed + " top")     
    timestamp = getLastTimestamp(messageData[userPassed])
    console.log(messageData[userPassed])
    //recentSender = getLastSender(messageData[userPassed])
    console.log(messageData.userPassed)
                if (timestamp === "45 years ago") {
                    $('#commhist').append('No messages yet...');

                }
                else { 
                $('#commhist').append('<li>The last message was sent '+ timestamp +' by ' + recentSender.toLowerCase() + ' </li>');
            };
$('#profileusername').append("<strong>" + userPassed + "</strong>");        
            });

*/


$(document).on('pageinit', '#profile', function(){      
    var url = 'data1.json'
    var user = getUser(messageData.users, userNameClicked);
    var profileimg = user.profile_url

    $('#profileusername').append("<strong>" + user.username + "</strong>");
    $('#profileimage').attr("src",profileimg);

    if (user.serice === "okc") {
    $('#servicelogo').attr("src","okc_icon.png");
    }

    var timestamp = null;
    var recentSender = null;
    timestamp = getLastTimestamp(user.messages);
    recentSender = getLastSender(user.messages);
    if (recentSender === "Her") {
        recentSender = "She"
    }
    timestamp = timeConverter(timestamp);
    if (recentSender === null) {
        $('#commhist').append('No messages yet...');
    } else {
        $('#commhist').append(recentSender + " sent the last message " + timestamp + ".");
    }
    
    });

$(document).on('change', '#interestslider', function(){ 
    var user = getUser(messageData.users, userNameClicked);
    user.interestLevel = $(this).val()
});

$(document).on('change', '#groupmenu', function(){ 
    var user = getUser(messageData.users, userNameClicked);
    user.group = $(this).val()
});
