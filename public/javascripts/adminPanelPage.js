var app = angular.module('myApp', ['ui.materialize']);

app.controller('myCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.event = {
        eNaziv: '',
        eOpis: '',
        eOcena: '',
        eCena: '',
        eDatum: '',
        eDatumDani: '',
        eLokacija: '',
        lat: '',
        lng: ''
    };

    $scope.panel = 1;

    $scope.$watch('panel', function (nVal) {

        $scope.panel = 0;
        $scope.panel = nVal;
        let initAutocomplete = function () {


            var map = new google.maps.Map(document.getElementById('map' + nVal), {
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


                    //todo mapa ne dobija parametre
                    var eventlat =  places[0].geometry.location.lat();
                    $scope.event.lat = places[0].geometry.location.lat();
                    $scope.event.lng = places[0].geometry.location.lng();
                    $scope.event.eLokacija = places[0].formatted_address;
                $scope.$apply();




                console.log('aaa1',places[0].geometry.location.lat(),eventlat);

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

        nVal == 1 || nVal == 3 ? initAutocomplete() : null;
    });



    $scope.select = {};

    $scope.send = function () {
        console.log($scope.event);


        $http.post('/api/adminPanelSend', {}, {params: $scope.event})
            .then(function (res) {
                res = res.data;

                if (res.msg === "Ok") {
                    Materialize.toast(res.msg, 5000);
                } else {
                    Materialize.toast(res.msg, 5000);
                }
            });
    };

    $scope.delete = function () {

        $http.get('/api/adminPanelDelete', {params: {event: $scope.event}})
            .then(function (res) {
                res = res.data;
                if (res.msg === "Ok") {
                    Materialize.toast(res.msg, 5000);
                } else {
                    Materialize.toast(res.msg, 5000);
                }
            });
    };

    $scope.update = function () {

        $http.get('/api/adminPanelUpdate', {params: {event: $scope.event}})

            .then(function (res) {
                $scope.res = res.data[0];
                if (res.msg === "OK") {
                    Materialize.toast(res.msg, 5000);
                } else {
                    Materialize.toast(res.msg, 5000);
                }
            });
    };

    $scope.deleteUser = function () {

        $http.get('/api/adminPanelDeleteUser', {params: {users: $scope.formData}})
            .then(function (res) {
                res = res.data;
                if (res.msg === "Ok") {
                    Materialize.toast(res.msg, 5000);
                } else {
                    Materialize.toast(res.msg, 5000);
                }
            });
    };


    $http.get('/api/getAllEvents')
        .then(function (res) {
            $scope.allEvents = res.data;
        });

    $http.get('/api/getAllUsers')
        .then(function (res) {
            $scope.allUsers = res.data;

        });

    $scope.$watch('select.value', function (nVal) {

        $http.get('/api/getEvent', {params: {eId: nVal}})

            .then(function (res) {
                $scope.event = res.data;

            });

    });

    $scope.$watch('select.valueUser', function (nVal) {

        $http.get('/api/getUser', {params: {uID: nVal}})

            .then(function (res) {
                $scope.formData = res.data;
          