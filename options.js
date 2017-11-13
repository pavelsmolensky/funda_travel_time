function save_options() {
    var key = $("#key").val();
    var destination1 = $('#destination1').val();
    var transport1 = $("#travel_mode1").val();
    var destination2 = $('#destination2').val();
    var transport2 = $("#travel_mode2").val();

    chrome.storage.sync.set({
        key: key,
        destination1: destination1,
        transport1: transport1,
        destination2: destination2,
        transport2: transport2
    }, function () {
        window.close();
    });
}

function restore_options() {
    chrome.storage.sync.get({
        key: 'AIzaSyBoiBnqEgfVSWykWOlVxssdIXlxW43b5nI',
        destination1: 'Amsterdam',
        transport1: 'transit',
        destination2: '',
        transport2: 'transit'
    }, function (items) {
        $('#key').val(items.key);
        $('#destination1').val(items.destination1);
        $("#travel_mode1").val(items.transport1);
        $('#destination2').val(items.destination2);
        $("#travel_mode2").val(items.transport2);
    });
}
document.addEventListener('DOMContentLoaded', restore_options);

$('#save').bind('click', save_options);