/**
 * Created by malet on 20-Jul-17.
 */
var app = angular.module('myApp', []);

app.controller('myCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    $scope.comment = {
        eID: window.location.href.match(/\w{10}$/g),
        uComment: "",
        uReview: ""
    };

    $http.get('/api/getEvent', {params: {eID: window.location.href.match(/\w{10}$/g)}})
        .then(function (res) {
            $scope.res = res.data;
            let locations = [];
            locations.push({lat: parseFloat($scope.res.lat), lng: parseFloat($scope.res.lng)});
            initMap(locations);
        });

    $http.get('/api/getComments', {params: {eID: window.location.href.match(/\w{10}$/g)}})
        .then(function (res) {
            $scope.comments = res.data;
        });

    $http.get('/api/getReview', {params: {eID: window.location.href.match(/\w{10}$/g)}})
        .then(function (res) {
            if(res.data){
                $scope.comment = res.data;
                $scope.disabled = true;

                let allReview = 0;
                let count = 0;
                $scope.comment.forEach(function (item) {
                    allReview = allReview + parseInt(item.uReview);
                    count++;
                });
                $scope.uReview = parseInt(allReview/count);
            }
        });





    $scope.send = function () {
        $http.post('/api/commentSend', {}, {params: $scope.comment})
            .then(function (res) {
                res = res.data;
                if (res.status) {
                    Materialize.toast(res.msg, 1000);
                    setTimeout(function () {
                        location.reload();
                    }, 1000)
                }
            });
    };

    $scope.uReviewSend = function () {
        $http.post('/api/uReviewSend', {}, {params: $scope.comment})
            .then(function (res) {
                res = res.data;
                if (res.status) {
                    $scope.disabled = true;
                    Materialize.toast(res.msg, 1000);
                }
            });
    };


    let initMap = function initMap(locations) {

        let map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: {lat: locations[0].lat, lng: locations[0].lng}
        });

        // Create an array of alphabetical characters used to label the markers.
        let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        // Add some markers to the map.
        // Note: The code uses the JavaScript Array.prototype.map() method to
        // create an array of markers based on a given "locations" array.
        // The map() method here has nothing to do with the Google Maps API.
        let markers = locations.map(function (location, i) {
            return new google.maps.Marker({
                position: location,
                label: labels[i % labels.length]
            });
        });

        // Add a marker clusterer to manage the markers.
        let markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    }

}]);