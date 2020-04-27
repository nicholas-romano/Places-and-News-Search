
const PLACES_API_KEY = 'AIzaSyA226PQXOi5BSA7kJuRJYQxforZ980b7_s';

var place_types = [
                    {value: "airport", text: "Airport"}, {value: "amusement_park", text: "Amusement Park"}, {value: "aquarium", text: "Aquarium"}, {value: "art_gallery", text: "Art Gallery"},
                    {value: "atm", text: "ATM"}, {value: "bakery", text: "Bakery"}, {value: "bank", text: "Bank"}, {value: "bar", text: "Bar"}, {value: "beauty_salon", text: "Beauty Salon"},
                    {value: "bicycle_store", text: "Bicycle Store"}, {value: "book_store", text: "Book Store"}, {value: "bowling_alley", text: "Bowling Alley"}, {value: "bus_station", text: "Bus Station"}, {value: "cafe", text: "Café"},
                    {value: "campground", text: "Campground"}, {value: "car_dealer", text: "Car Dealership"}, {value: "car_rental", text: "Car Rental"}, {value: "car_repair", text: "Car Repair"}, {value: "car_wash", text: "Car Wash"},
                    {value: "casino", text: "Casino"}, {value: "cemetery", text: "Cemetery"}, {value: "church", text: "Church"}, {value: "city_hall", text: "City Hall"}, {value: "clothing_store", text: "Clothing Store"},
                    {value: "convenience_store", text: "Convenience Store"}, {value: "courthouse", text: "Courthouse"}, {value: "dentist", text: "Dentist"}, {value: "department_store", text: "Department Store"}, {value: "doctor", text: "Doctor"},
                    {value: "drugstore", text: "Drug Store"}, {value: "electrician", text: "Electrician"}, {value: "electronics_store", text: "Electronics Store"}, {value: "embassy", text: "Embassy"}, {value: "fire_station", text: "Fire Station"},
                    {value: "florist", text: "Florist"}, {value: "funeral_home", text: "Funeral Home"}, {value: "furniture_store", text: "Furniture Store"}, {value: "gas_station", text: "Gas Station"}, {value: "grocery_or_supermarket", text: "Grocery Store or Supermarket"},
                    {value: "gym", text: "Gym"}, {value: "hair_care", text: "Hair Care"}, {value: "hardware_store", text: "Hardware Store"}, {value: "hindu_temple", text: "Hindu Temple"}, {value: "home_goods_store", text: "Home Goods Store"},
                    {value: "hospital", text: "Hospital"}, {value: "insurance_agency", text: "Insurance Agency"}, {value: "jewelry_store", text: "Jewelry Store"}, {value: "laundry", text: "Laundry"}, {value: "lawyer", text: "Lawyer"},
                    {value: "library", text: "Library"}, {value: "light_rail_station", text: "Light Rail Station"}, {value: "liquor_store", text: "Liquor Store"}, {value: "local_government_office", text: "Local Government Office"}, {value: "locksmith", text: "Locksmith"},
                    {value: "lodging", text: "Lodging"}, {value: "meal_delivery", text: "Meal Delivery"}, {value: "meal_takeaway", text: "Meal Takeaway"}, {value: "mosque", text: "Mosque"}, {value: "movie_rental", text: "Movie Rental"},
                    {value: "movie_theater", text: "Movie Theater"}, {value: "moving_company", text: "Moving Company"}, {value: "museum", text: "Museum"}, {value: "night_club", text: "Night Club"}, {value: "painter", text: "Painter"},
                    {value: "park", text: "Park"}, {value: "parking", text: "Parking"}, {value: "pet_store", text: "Pet Store"}, {value: "pharmacy", text: "Pharmacy"}, {value: "physiotherapist", text: "Physiotherapist"},
                    {value: "plumber", text: "Plumber"}, {value: "police", text: "Police"}, {value: "post_office", text: "Post Office"}, {value: "primary_school", text: "Primary School"}, {value: "real_estate_agency", text: "Real Estate Agency"},
                    {value: "restaurant", text: "Restaurant"}, {value: "roofing_contractor", text: "Roofing Contractor"}, {value: "rv_park", text: "RV Park"}, {value: "school", text: "School"}, {value: "secondary_school", text: "Secondary School"},
                    {value: "shoe_store", text: "Shoe Store"}, {value: "shopping_mall", text: "Shopping Mall"}, {value: "spa", text: "Spa"}, {value: "stadium", text: "Stadium"}, {value: "storage", text: "Storage"},
                    {value: "store", text: "Store"}, {value: "subway_station", text: "Subway Station"}, {value: "supermarket", text: "Supermarket"}, {value: "synagogue", text: "Synagogue"}, {value: "taxi_stand", text: "Taxi Stand"},
                    {value: "tourist_attraction", text: "Tourist Attraction"}, {value: "train_station", text: "Train Station"}, {value: "transit_station", text: "Transit Station"}, {value: "travel_agency", text: "Travel Agency"}, {value: "university", text: "University"},
                    {value: "veterinary_care", text: "Veterinary Care"}, {value: "zoo", text: "Zoo"}
                ];

var lat = null;
var lng = null;
var within = $("#radius").val();
var location_name = "";
var keywords_list = "";
var type = "all";

var place_info = {};
var places_data = [];

var scrollPosition = 0;

$(document).ready(function() {

    $("#loader").hide();
    $("select").show();
    $("#images-container").hide();

    $(window).scroll(function (event) {
        scrollPosition = $(window).scrollTop();
    });

    //favorites save confirmation:
    $('.modal').modal();

    $("#place-type-select").on("change", function() {
        type = $("#place-type-select").val();
    });

    //insert place type options into select list:
    $.each(place_types, function(index, type) {
        $("#place-type-select").append('<option value="' + type.value + '">' + type.text + '</option>');
    });


    $('#search-form').submit(function(event) {
        event.preventDefault();

        resetVariables();

        $("#place-search-results").empty();

        //get place input:
        var place_name = $("#place_name").val();

        //get keyword input:
        keywords_list = $("#keywords").val();

        if (place_name !== "") {
            keywords_list += " " + place_name;
        }

        if (keywords_list !== "") {
            //add place name to keywords list:
            keywords_list = keywords_list.split(" ").join("+");
            keywords_list = keywords_list.toString().trim();
        }

        //get type input:
        type = $("#place-type-select option:selected").val();

        //get location input:
        location_name = $("#location").val();

        if (location_name === "") {
            getUserLocation();
        }
        else {
            executeSearch();
        }

    });

    within = $("#radius").val();
    $("#within_amt_text").val(within);
    $("#within_amt").text(within + " meters");

    $("#within_amt_text").on("keyup", function() {
        var radius_input = $(this).val();
        within = parseInt(radius_input);
        $("#radius").val(within);
        $("#within_amt").text(within + " meters");
    })

    $("#within_amt_text").on("blur", function() {
        within = $(this).val();
        within = parseInt(within);
        if (within > 50000) {
            $(this).val(50000);
            $("#within_amt").text(50000 + " meters");
        }
        if (within < 500) {
            $(this).val(500);
            $("#within_amt").text(500 + " meters");
        }
    });

    $("#radius").on("change", function() {
        within = $(this).val()
        within = parseInt(within);
        $("#within_amt").text(within + " meters");
        $("#within_amt_text").val(within);
    });

});

function resetVariables() {
    lat = null;
    lng = null;
    location_name = "";
    keywords_list = "";
    type = "all";
    place_info = {};
}

function getUserLocation() {

    //HTML5 geolocation - get the user's location:
    var getPosition = function (options) {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    }

    getPosition()
        .then((position) => {

        //set coords globals:
        lat = position.coords.latitude;
        lng = position.coords.longitude;

        executeSearch();

        })
        .catch((err) => {
            console.error(err.message);
        });

}

function executeSearch() {

    var locationInfo = "";

    if (location_name !== "" && keywords_list !== "") {
        locationInfo = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + location_name + '&inputtype=textquery&fields=photos,formatted_address,name,place_id,types,opening_hours,rating,geometry&key=' + PLACES_API_KEY;
        searchLocation(locationInfo);
    }

    if (location_name === "" && keywords_list !== "") {
        findPlaces();
    }

    if (keywords_list === "" && location_name !== "") {
        locationInfo = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + location_name + '&inputtype=textquery&fields=photos,formatted_address,name,place_id,types,opening_hours,rating,geometry&key=' + PLACES_API_KEY;
        searchLocation(locationInfo);
    }

    if (keywords_list === "" && location_name === "") {
        findPlaces();
    }

}

function searchLocation(placeInfo) {

    $.ajax({
        url: placeInfo,
        method: "GET",
        beforeSend: function(){
            $("#loader").show();
          },
          complete: function(){
            $("#loader").hide();
        },
        success: sendLocationInfoResponse,
        error: function() {
            //ajax call failed:
            console.log('Location Search failed.');
        }
    });

}

function sendLocationInfoResponse(response) {

    var location = response.candidates[0];

    //get place id:
    var place_id = location.place_id;

    //get place name result:
    var place_results_name = location.name;

    //get photo ref:
    var photo_reference = location.photos[0].photo_reference;

    //get author name and link:
    var author_ref = location.photos[0].html_attributions;

    //get location results address:
    var address = location.formatted_address;

    //get place latitude:
    lat = location.geometry.location.lat;
    //get longitude:
    lng = location.geometry.location.lng;

    var type_categories = location.types;

    findPlaces();

    displayLocationResults(place_results_name, place_id, author_ref, photo_reference, address, type_categories);

}

function findPlaces() {

    var placeLocation = "";

    if (keywords_list !== "" && type !== "all") {
        placeLocation = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + lng + '&radius=' + within + '&type=' + type + '&keyword=' + keywords_list + '&key=' + PLACES_API_KEY;
    }

    if (keywords_list === "" && type !== "all") {
        placeLocation = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + lng + '&radius=' + within + '&type=' + type + '&key=' + PLACES_API_KEY;
    }

    if (keywords_list !== "" && type === "all") {
        placeLocation = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + lng + '&radius=' + within + '&keyword=' + keywords_list + '&key=' + PLACES_API_KEY;
    }

    getPlaceNearbyKeywordDetails(placeLocation);

}

function getPlaceNearbyKeywordDetails(placeLocation) {
    $.ajax({
        url: placeLocation,
        method: "GET",
        beforeSend: function(){
            $("#loader").show();
          },
          complete: function(){
            $("#loader").hide();
        },
        success: sendPlaceNearbyKeywordDetails,
        error: function() {
            //ajax call failed:
            console.log('Search Place Details failed.');
        }
    });
}

function sendPlaceNearbyKeywordDetails(response) {

    if (response.status === "ZERO_RESULTS" || response.status === "INVALID_REQUEST") {
        $('#place-search-results').html('<div class="row">' +
                                            '<div class="col s12 m8">' +
                                                '<div class="card">' +
                                                    '<div class="card-content">' +
                                                        '<div class="card-title">' +
                                                            '<h4>Results Not Found!</h4>' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>' +
                                       '</div>'
                                        );
    }

    var places = response.results;

    $.each(places, function(index, place) {

        var place_name = place.name;
        var place_id = place.place_id;
        var address = place.vicinity;
        var type_categories = place.types;

        opening_hours = getPlaceStatus(place);

        avg_rating = getPlaceRating(place);

        var photo_reference = getPhotoReference(place);

        var author_ref = getAuthorReference(place);

        var price_level = getPriceLevel(place);

        displayPlaceResults(place_name, place_id, author_ref, photo_reference, address, opening_hours, avg_rating, type_categories, price_level);
    });

}

function getPlaceStatus(place) {

    var opening_hours;

    if (place.opening_hours === undefined) {
        opening_hours = 'NA';
    }
    else {
        var open = place.opening_hours.open_now;
        if (open === true) {
            opening_hours = "Open";
        }
        else {
            opening_hours = "Closed";
        }
    }
    return opening_hours;

}

function getPlaceRating(place) {

    var avg_rating;

    if (place.rating === undefined) {
        avg_rating = '<span class="NA">NA</span>';
    }
    else {
        avg_rating = place.rating;
    }

    return avg_rating;

}

function getPhotoReference(place) {

    var photo_reference

    if (place.photos !== undefined) {
        photo_reference = place.photos[0].photo_reference;
    }
    else {
        photo_reference = '';
    }

    return photo_reference;

}

function getAuthorReference(place) {

    var author_ref;

    if (place.photos !== undefined) {
        author_ref = place.photos[0].html_attributions[0];
    }
    else {
        author_ref = '';
    }

    return author_ref;

}

function getPriceLevel(place) {

    var price_level;

    if (place.price_level === undefined) {
        price_level = '<span class="NA">NA</span>';
    }
    else {
        price_level = place.price_level;
        switch(price_level) {
            case 1:
                price_level = '$';
            break;
            case 2:
                price_level = '$$';
            break;
            case 3:
                price_level = '$$$';
            break;
            case 4:
                price_level = '$$$$';
            break;
        }
    }

    return price_level;

}

function addSearchResultsContainer() {
    $('#place-search-results').append('<div class="row">' +
                                        '<div class="section">' +
                                            '<div id="place-cards">' +
                                            '</div>' +
                                        '</div>' +
                                      '</div>')
}

function displayLocationResults(place_name, place_id, author_ref, photo_reference, address, type_categories) {

    var categories = getCategoryList(type_categories);

    var photo = getPhotoTag(photo_reference, place_name);

    var author = getAuthorTag(photo_reference, author_ref);

    //check if there is any search results, if not, add a container:
    if ( $('#place-search-results').children().length === 0 ) {
        addSearchResultsContainer();
    }

    addLocationData(place_name, place_id, author_ref, photo_reference, address, type_categories);

    $('#place-search-results').prepend( '<div class="col xl3 l4 m6 s12 search_result">' +
                                            '<div class="card">' +
                                                '<div class="card-image z-depth-5">' +
                                                        photo +
                                                    '<span class="card-title white-text" style="width:100%; background: rgba(0, 0, 0, 0.5);">' +
                                                        '<h4>' + place_name + '</h4>' +
                                                    '<span class="card-subtitle">' + address + '</span>' +
                                                    '</span>' +
                                                '</div>' +
                                                '<div class="card-content z-depth-5">' +
                                                    '<label>Photo by: ' + author + '</label>' +
                                                    '<p class="cat"><span class="cat-title">Categories:</span> ' + categories + '</p>' +
                                                '</div>' +
                                                '<div class="card-action">' +
                                                    '<a id="' + place_id + '" onclick="showPhotos(id)" class="btn waves-effect blue darken-3">Photos<i class="material-icons left">landscape</i></a>' +
                                                    '<a name="' + place_id + '" onclick="addFavorite(name)" href="#modal1" class="btn waves-effect blue darken-3 modal-trigger">Add<i class="material-icons right">thumb_up</i></a>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>'
                                      );


}

function getCategoryList(type_categories) {

    var categories = "";

    $.each(type_categories, function(index, category) {

        //replace all instances of the underscore with a space:
        category = category.replace(/_/g, " ");

        if (index !== type_categories.length - 1) {
            categories += category + ", ";
        }
        else {
            categories += category;
        }
    });

    return categories;
}

function getPhotoTag(photo_reference, place_name) {

    var photo;

    if (photo_reference !== "") {
        photo = '<img src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + photo_reference + '&key=' + PLACES_API_KEY + '" alt="' + place_name + '">';
    }
    else {
        photo = '<img src="images/image-not-available.png" alt="Image Not Available">';
    }

    return photo;

}

function getAuthorTag(photo_reference, author_ref) {

    var author;

    if (photo_reference !== "") {
        var author = '<label>Photo by: ' + author_ref + '</label>';
    }
    else {
        var author = '<label class="fine-text">Author not available</label>';
    }

    return author;

}

function displayPlaceResults(place_name, place_id, author_ref, photo_reference, address, opening_hours, avg_rating, type_categories, price_level) {

        var categories = getCategoryList(type_categories);

        var photo = getPhotoTag(photo_reference);

        var author = getAuthorTag(photo_reference, author_ref);

        if ( $('#place-search-results').children().length === 0 ) {
            addSearchResultsContainer();
        }

        addPlaceData(place_name, place_id, author_ref, photo_reference, address, opening_hours, avg_rating, type_categories, price_level);

        $('#place-cards').append('<div class="col xl3 l4 m6 s12 search_result">' +
                                    '<div class="card">' +
                                        '<div class="card-image z-depth-5">' +
                                                photo +
                                            '<span class="card-title white-text" style="width:100%; background: rgba(0, 0, 0, 0.5);">' +
                                                '<h4>' + place_name + '</h4>' +
                                            '<span class="card-subtitle">' + address + '</span>' +
                                            '</span>' +
                                        '</div>' +
                                        '<div class="card-content z-depth-5">' +
                                            author +
                                            '<p class="cat"><span class="cat-title">Categories:</span> ' + categories + '</p>' +
                                            '<label class="status">Status: <span class="'+ opening_hours + '">' + opening_hours + '</span>' +
                                            '<span class="rating">Rating: <span class="rating-value">' + avg_rating + '</span></span>' +
                                            '<span class="price">Price: <span class="price-value">' + price_level + '</span></span></label>' +
                                        '</div>' +
                                        '<div class="card-action">' +
                                            '<a id="' + place_id + '" onclick="showPhotos(id)" class="btn waves-effect waves-light blue darken-3">Photos<i class="material-icons left">landscape</i></a>' +
                                            '<a name="' + place_id + '" onclick="addFavorite(name)" href="#modal1" class="btn waves-effect waves-light blue darken-3 modal-trigger">Add<i class="material-icons right">thumb_up</i></a>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>'
                                );
}

function addLocationData(place_name, place_id, author_ref, photo_reference, address, type_categories) {

        place_info = {};

        place_info["place_name"] = place_name;
        place_info["place_id"] = place_id;
        place_info["author_ref"] = author_ref;
        place_info["photo_reference"] = photo_reference;
        place_info["address"] = address;
        place_info["type_categories"] = type_categories;

        places_data.push(place_info);
}

function addPlaceData(place_name, place_id, author_ref, photo_reference, address, opening_hours, avg_rating, type_categories, price_level) {

        place_info = {};

        place_info["place_name"] = place_name;
        place_info["place_id"] = place_id;
        place_info["author_ref"] = author_ref;
        place_info["photo_reference"] = photo_reference;
        place_info["address"] = address;
        place_info["opening_hours"] = opening_hours;
        place_info["avg_rating"] = avg_rating;
        place_info["type_categories"] = type_categories;
        place_info["price_level"] = price_level;

        places_data.push(place_info);

}

function addFavorite(place_id) {

    //find place id:
    $.each(places_data, function(index, place) {

        if (place_id === place.place_id) {

            //set localStorage:
            place = JSON.stringify(place);
            window.localStorage.setItem(place_id, place);

        }

    });
}

function showPhotos(place_id) {
    $(".photo-box").empty();
    $("#images-container").hide();
    var placeDetails = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=' + place_id + '&fields=address_component,formatted_address,geometry,icon,name,permanently_closed,photo,place_id,type,url,vicinity,opening_hours,website,price_level,rating,review,user_ratings_total&key=' + PLACES_API_KEY;

    $.ajax({
        url: placeDetails,
        method: "GET",
        beforeSend: function(){
            $("#loader").show();
          },
          complete: function(){
            $("#loader").hide();
        },
        success: sendPlacePhotos,
        error: function() {
            //ajax call failed:
            alert('Error!');
        }
    });
}

function sendPlacePhotos(response) {
    var place = response.result;
    var name = place.name;
    var photos = place.photos;

    $("#images-container").css({top: scrollPosition + 50, position: 'absolute'}).show();

    $.each(photos, function(index, photo) {
        var photo_ref = photo.photo_reference;
        var author_ref = photo.html_attributions;

        addPhotos(name, photo_ref, author_ref);
    });

}

function addPhotos(name, photo_ref, author_ref) {

    $(".photo-box").append('<div class="card left" style="min-height: 500px; max-width: 300px;">' +
                            '<div class="card-content">' +
                                '<img src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=225&photoreference=' + photo_ref + '&key=' + PLACES_API_KEY + '" alt="' + name + '">' +
                                '<div class="card-action">' +
                                    '<p>Photo By: ' + author_ref + '</p>' +
                                '</div>' +
                            '</div>' +
                        '</div>');

}

function closeImageBox() {
    $('#images-container').hide();
}
