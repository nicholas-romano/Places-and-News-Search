const PLACES_API_KEY = 'AIzaSyA_aM59z9COKbePB2V9d5YT5WsXjeF1YwE';
var scrollPosition = 0;

$(document).ready(function() {

    $(window).scroll(function (event) {
        scrollPosition = $(window).scrollTop();
    });

    getFavorites();

});

function getFavorites() {

    $("#images-container").hide();
    $('#list-of-favorites').empty();

    var totalStorage = window.localStorage.length;

    if (totalStorage !== null) {

      for (var i = 0; i < totalStorage; i++) {

          //loop through all local storage keys:
          var favorite = window.localStorage.key(i);

          //get favorite data:
          var favData = JSON.parse(localStorage.getItem(favorite));

            if(favData.hasOwnProperty("article_time_stamp")){

                //this is a news article
                var article_id = favData.article_time_stamp;
                var article_title = favData.article_title;
                var article_image = favData.article_image;
                var article_url = favData.article_url;
                var article_description = favData.article_description;
                var article_author = favData.article_author;
                var article_source = favData.article_source;

                sendArticleData(article_id, article_title, article_image, article_url, article_description, article_author, article_source);

            }
            else {

                //this is a place
                var place_address = favData.address;
                var place_id = favData.place_id;
                var place_name = favData.place_name;
                var photo_reference = favData.photo_reference;
                var author_ref = favData.author_ref;
                var type_categories = favData.type_categories;

                if (favData.opening_hours === undefined || favData.avg_rating === undefined || favData.price_level === undefined) {

                    displayLocationFavorite(place_id, place_name, photo_reference, author_ref, type_categories, place_address);

                }
                else {

                    var opening_hours = favData.opening_hours;
                    var avg_rating = favData.avg_rating;
                    var price_level = favData.price_level;

                    displayPlaceFavorite(place_id, place_name, photo_reference, author_ref, photo_reference, type_categories, place_address, opening_hours, price_level, avg_rating);

                }

            }

      }

    }

}

function sendArticleData(article_id, article_title, article_image, article_url, article_description, article_author, article_source) {

    if ( $('#list-of-favorites').children().length === 0 ) {
        addSearchResultsContainer();
    }

    $('#place-cards').append('<div class="col xl3 l4 m6 s12 search_result">' +
                                '<div class="card">' +
                                    '<div class="card-image">' +
                                        '<img src="' + article_image + '">' +
                                    '</div>' +
                                    '<div class="card-content">' +
                                        '<a href="' + article_url + '" target="_blank"><h5 class="card-title">' + article_title + '</h5></a>' +
                                        '<p>' + article_description + '</p>' +
                                        '<p><strong>By:</strong> ' + article_author + ', ' + article_source + '<p>' +
                                        '<a name="' + article_id + '" onclick="removeFavorite(name)" class="btn waves-effect waves-light blue darken-3 modal-trigger">Remove<i class="material-icons right">cancel</i></a>' +
                                    '</div>' +
                                '</div>' +
                            '</div>');

}

function displayLocationFavorite(place_id, place_name, photo_reference, author_ref, type_categories, place_address) {

    var categories = getCategoryList(type_categories);

    var photo = getPhotoTag(photo_reference, place_name);

    var author = getAuthorTag(photo_reference, author_ref);

    if ( $('#list-of-favorites').children().length === 0 ) {
        addSearchResultsContainer();
    }


    $('#place-cards').append( '<div class="col xl3 l4 m6 s12 search_result">' +
                                            '<div class="card">' +
                                                '<div class="card-image z-depth-5">' +
                                                        photo +
                                                    '<span class="card-title white-text" style="width:100%; background: rgba(0, 0, 0, 0.5);">' +
                                                        '<h4>' + place_name + '</h4>' +
                                                    '<span class="card-subtitle">' + place_address + '</span>' +
                                                    '</span>' +
                                                '</div>' +
                                                '<div class="card-content z-depth-5">' +
                                                    '<label>Photo by: ' + author + '</label>' +
                                                    '<p class="cat"><span class="cat-title">Categories:</span> ' + categories + '</p>' +
                                                '</div>' +
                                                '<div class="card-action">' +
                                                '<a id="' + place_id + '" onclick="showPhotos(id)" class="btn waves-effect blue darken-3">Photos<i class="material-icons left">landscape</i></a>' +
                                                '<a name="' + place_id + '" onclick="removeFavorite(name)" class="btn waves-effect blue darken-3">Remove<i class="material-icons left">cancel</i></a>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>'
                                      );

}

function displayPlaceFavorite(place_id, place_name, photo_reference, author_ref, photo_reference, type_categories, place_address, opening_hours, price_level, avg_rating) {

    var categories = getCategoryList(type_categories);

    if (photo_reference !== "") {
        var photo = '<img src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + photo_reference + '&key=' + PLACES_API_KEY + '" alt="' + place_name + '">';
        var author = '<label>Photo by: ' + author_ref + '</label>';
    }
    else {
        var photo = '<img src="images/image-not-available.png" alt="Image Not Available">';
        var author = '<label class="fine-text">Author not available</label>';
    }

    //check if there is any favorites listed, if not, add a container:
    if ( $('#list-of-favorites').children().length === 0 ) {
        addSearchResultsContainer();
    }

    $('#place-cards').append('<div class="col xl3 l4 m6 s12 search_result">' +
                                '<div class="card">' +
                                    '<div class="card-image z-depth-5">' +
                                            photo +
                                        '<span class="card-title white-text" style="width:100%; background: rgba(0, 0, 0, 0.5);">' +
                                            '<h4>' + place_name + '</h4>' +
                                        '<span class="card-subtitle">' + place_address + '</span>' +
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
                                        '<a id="' + place_id + '" onclick="showPhotos(id)" class="btn waves-effect blue darken-3">Photos<i class="material-icons left">landscape</i></a>' +
                                        '<a name="' + place_id + '" onclick="removeFavorite(name)" class="btn waves-effect blue darken-3">Remove<i class="material-icons left">cancel</i></a>' +
                                    '</div>' +
                                '</div>' +
                            '</div>'
                            );

}


function addSearchResultsContainer() {
    $('#list-of-favorites').append('<div class="row">' +
                                        '<div class="section">' +
                                            '<div id="place-cards">' +
                                            '</div>' +
                                        '</div>' +
                                      '</div>')
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

function showPhotos(place_id) {
    $(".photo-box").empty();
    $('#images-container').hide();
    var placeDetails = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=' + place_id + '&fields=address_component,formatted_address,geometry,icon,name,permanently_closed,photo,place_id,type,url,vicinity,opening_hours,website,price_level,rating,review,user_ratings_total&key=' + PLACES_API_KEY;

    $.ajax({
        url: placeDetails,
        method: "GET",
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

function removeFavorite(id) {
    window.localStorage.removeItem(id);
    getFavorites();
}
