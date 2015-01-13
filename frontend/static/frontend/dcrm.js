$(document).on('pageinit', '#home', function(){      
    var url = 'http://dcrm.derektest1.com:8000/data'       
    
    $.ajax({
        url: url,
        dataType: "json",
        async: true,
        success: function (result) {
            messageData.messages = result.messages;

            $.each(result.messages, function(username, data){
                $('#contact-list').append('<li><a href="" data-id="' + username + '">' + username + '</a></li>');
            });
            $('#contact-list').listview('refresh');
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });         
});

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
});

var messageData = {
    id : null,
    messages : null
}

$(document).on('vclick', '#contact-list li a', function(){  
    messageData.id = $(this).attr('data-id');
    $.mobile.changePage( "#headline", { transition: "slide", changeHash: false });
});
