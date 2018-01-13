const maps_api_url_template = "https://maps.googleapis.com/maps/api/distancematrix/json?origins={origin}&destinations={destination}&mode={transport}&key={key}";

chrome.storage.sync.get({
	key: '',
    destination1: 'Amsterdam',
    transport1: 'transit',
    destination2: '',
    transport2: 'transit'
}, function (items) {
    var destination1 = normalize_string(items.destination1);
    var destination2 = normalize_string(items.destination2);
    var origin_address = get_address_at(".object-header__address");

    var request1 = new MapsApiRequest(items.key, origin_address, destination1, items.transport1, true);
    request1.call_maps_api();
    if (destination2.length != 0) {
    	var request2 = new MapsApiRequest(items.key, origin_address, destination2, items.transport2, false);
    	request2.call_maps_api();
	}

});

class MapsApiRequest {
	constructor(key, origin_address, destination, transport, is_primary){
		this.key = key;
		this.origin_address = origin_address;
		this.destination = destination;
		this.transport = transport;
		this.is_primary = is_primary;
	}

	prepare_url(origin_str) {
	    var template = maps_api_url_template.replace("{destination}", this.destination);
	    template = template.replace("{origin}", origin_str);
	    template = template.replace("{transport}", this.transport);
	    template = template.replace("{key}", this.key);
	    return template;
	}

	call_maps_api(){
		var url = this.prepare_url(this.origin_address[0]+"+"+this.origin_address[1]);
        console.log(url);
        var self = this;
        $.get(url, function(data) {
		 	if (data.rows[0].elements[0].status == "NOT_FOUND") {
	            url = self.prepare_url(self.origin_address[0]);
	            $.get(url, function (data) {
	                var duration = data.rows[0].elements[0].duration.text;
	                self.add_element_to_body(duration);
	            });
	        }
	        var duration = data.rows[0].elements[0].duration.text;
			self.add_element_to_body(duration);
			});
	}
	

	add_element_to_body(duration){
		var html = "<p class='ext-transportation-data";
		if(!this.is_primary){
        	html += " ext-transportation-second";
        }
		html += "'><i class='material-icons'>" + MapsApiRequest.icon_type(this.transport) +
        "</i>&nbsp;<span class='ext-transportation-time'>" + duration.replace(/\+/g, " ") + "</span> to " + this.destination.replace(/\+/g, " ") + "</p>";
	    $("body").append(html);	
	}

	static icon_type(transport) {
	    var icon;
	    switch (transport) {
	        case 'transit':
	            icon = 'directions_transit';
	            break;
	        case 'driving':
	            icon = 'directions_car';
	            break;
	        case 'bicycling':
	            icon = 'directions_bike';
	            break;
	        case 'walking':
	            icon = 'directions_walk';
	            break
	    }
	    return icon;
}

}

function normalize_string(s) {
    return $.trim(s).replace(/ /g, "+");
}

function get_address_at(locator) {
    var raw_address_components = $.trim($(locator).text()).split("\n");
    var city = normalize_string(raw_address_components[1]);
    var address = normalize_string(raw_address_components[0]).split("(Bouwnr.")[0];
    return [city, address];
}



