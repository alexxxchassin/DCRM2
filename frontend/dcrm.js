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
                lastSender = "Them"
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
//sorts messages by parameter
function messageSorter(field, reverse, primer) {
console.log("I'm working!")
   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = [-1, 1][+!!reverse];

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
     $('#contact-list').listview('refresh');
     console.log(messageData.users);
};

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

$(document).on('pageinit', '#home', function(){      
    var url = 'http://dcrm.derektest1.com/data/?id=1'       
    
    $.ajax({
        url: url,
        dataType: "jsonp",
        async: true,
        success: function (result) {
            messageData.users = result.users;
            var timestamp = null;
            var recentSender = null;
            $.each(result.users, function(i, user){
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
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
        
    });         
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
$(document).on('vclick', '#contact-list li a', function(){  
    userNameClicked = $(this).attr('data-id');
    $.mobile.changePage( "#contact-info", { transition: "slide", changeHash: false });
});

$(document).on('vclick', '#newsort', function() {
      messageData.sort(messageSorter(messages[time_stamp],true, parseInt));
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
    timestamp = timeConverter(timestamp);
    if (recentSender === null) {
        $('#commhist').append('No messages yet...');
    } else {
        $('#commhist').append("The last message was sent " + timestamp + " by "  + recentSender.toLowerCase() );
    }
});