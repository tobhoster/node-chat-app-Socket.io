var socket = io();

function scrollToBottom() {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li')
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('clientTop');
    var scrollHeight = messages.prop('clientHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', () => {
    console.log('Connected to Server');
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, (err) => {
        if(err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log(('No Error'));
        }
    });
});

socket.on('disconnect', () => {
    console.log('Disconnected from Server');
});

socket.on('newMessage', (message) => {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} | ${formattedTime}: ${message.text}`);

    // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', (message) => {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery("#location-message-template").html();
    var html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime,
        url: message.url
    });

    // var li = jQuery("<li></li>");
    // var a = jQuery("<a target='_blank'>My current location</a>");

    // li.text(`${message.from} | ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
     
    jQuery('#messages').append(html);
    scrollToBottom();
})

jQuery('#message-form').on('submit', (e) => {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, () => {
        messageTextbox.val('');
    })
});

var locationButton = jQuery('#send_location');
locationButton.on('click', (e) => {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition((position) => {
        locationButton.removeAttr('disabled').text('Sending Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, () => {
        locationButton.removeAttr('disabled').text('Sending Location');
        alert('Unable to fetch location');
    })
})