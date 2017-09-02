var app = angular.module('myApp', []);

app.controller('myCtrl', ['$scope', '$http', function ($scope, $http) {

    // function makeid() {
    //     var text = "";
    //     var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    //
    //     for (var i = 0; i < 5; i++)
    //         text += possible.charAt(Math.floor(Math.random() * possible.length));
    //
    //     return text;
    // }

    $scope.formData = {
        firstName: "",
        lastName: "",
        location: "",
        password: "",
        email: "",
        lat: "",
        lng: ""
    };


    $scope.send = function () {

        $http.post('/api/register', {}, {params: $scope.formData})

            .then(function (res) {
                res = res.data;
                if(res.msg === "OK"){
                    window.location = "/";
                } else {
                    Materialize.toast(res.msg, 5000);
                }

            });
    };


    let initAutocomplete = function () {


        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 44.812045, lng: 20.439453},
            zoom: 7,
            mapTypeId: 'roadmap'
        });
        google.maps.event.addListenerOnce(map, 'idle', function () {
            google.maps.event.trigger(map, 'resize');
        });
        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();

            $scope.formData.lat = places[0].geometry.location.lat();
            $scope.formData.lng = places[0].geometry.location.lng();
            $scope.formData.location = places[0].formatted_address;


            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function (marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));

                var controllerElement = document.querySelector('body');


                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);


        });
    };


    initAutocomplete()
}]);

