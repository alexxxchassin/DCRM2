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
  var time = moment(unconvertedTime * 1000).fromNow()
  return time
}
        // function to calculate the most recent sender for a message

        function getLastSender (messages) {
        var lastTime = null;
        var lastSender = null;
        for (message in messages) {
            if(!lastTime || lastTime < messages[message].time_stamp) {
                lastSender = messages[message].sender;
                
            }
            if(lastSender === "GregNYC2014") {
                lastSender = "You"
            }
            else
                {
                    lastSender = "Them"
                }
            }
            return lastSender;
        }
$(document).on('pageinit', '#home', function(){      
    var url = 'data1.json'       
    
    $.ajax({
        url: url,
        dataType: "json",
        async: true,
        success: function (result) {
            messageData.messages = result.messages;
            var timestamp = null;
            var recentSender = null;
            $.each(result.messages, function(username, data){
                timestamp = getLastTimestamp(data);
                recentSender = getLastSender(data);
                timestamp = timeConverter(timestamp);
                if (timestamp === "45 years ago") {
                    $('#contact-list').append('<li><a href="" data-id="' + username + '">' + username + '</a></li>');
                }
                else {

                $('#contact-list').append('<li><a href="" data-id="' + username + '">' + username + ' - '+ timestamp +' - '+ recentSender +'</a></li>');
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
    id : null,
    messages : null
}

$(document).on('pagebeforeshow', '#headline', function(){      
    $('#contact-data').empty();
    // This loops through each of the users in the list to find the one that was clicked
    $.each(messageData.messages, function(id, data) {
        if(id == messageData.id) {
            // This loops through each "message", which is the text one person sends to another
            $.each(data, function(i, message) {
                $('#contact-data').append('<li>' + message.sender + ': ' + message.content + '</li>');
                
            });
                
            $('#contact-data').listview('refresh');
                        
        }

    });
$("#profilelink").click(function(e) {
    e.preventDefault();
    window.location.href = $(this).attr("href") + '?' + messageData.id;
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


$(document).on('vclick', '#contact-list li a', function(){  
    messageData.id = $(this).attr('data-id');
    $.mobile.changePage( "#headline", { transition: "slide", changeHash: false });

});

$(document).on('pageinit', '#profile', function(){      
    var url = 'data1.json'       
    
   /* $.ajax({
        url: url,
        dataType: "json",
        async: true,
        success: function (result) {
            messageData.messages = result.messages;
            var timestamp = null;
            var recentSender = null; 
            $.each(result.messages, function(username, data){ */
               var timestamp = getLastTimestamp(messageData.id);
               var recentSender = getLastSender(messageData.id);
                timestamp = timeConverter(timestamp);
                if (timestamp === "45 years ago" && recentSender === messageData.id) {
                    $('#commhist').append('No messages yet...');
                    console.log("if" + timestamp + recentSender + messageData.id);
                    $("#profileusername").append(messageData.id);
                }
                else if (recentSender === messageData.id && timestamp !== "45 years ago") {
                    console.log("elseif" + timestamp + recentSender + messageData.id);
                    $('#profileusername').append('<li>' + messageData.id + '</li>');

                $('#commhist').append('<li>The last message was sent '+ timestamp +' by ' + recentSender.toLowerCase() +' </li>');

            }

            });
