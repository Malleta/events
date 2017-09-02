let app = angular.module('myApp', []);
app.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            let lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
                //Also remove . and , so its gives a cleaner result.
                if (value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ',') {
                    lastspace = lastspace - 1;
                }
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});
app.controller('myCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.event = {
        eId: "",
        eNaziv: "",
        eOpis: "",
        eOcena: "",
        eCena: "",
        eDatum: "",
        eDatumDani: "",
        eLokacija: "",
        lat: "",
        lng: "",
        latlng: ""
    };

    $http.get('/api/index', {}, {params: $scope.event})
        .then(function (res) {
            $scope.event = res.data;

            let locations = [];
            $scope.event.forEach(function (item) {
                locations.push({lat: parseFloat(item.lat), lng: parseFloat(item.lng)})
            });

/*            var sort_by;
            (function() {
                // utility functions
                var default_cmp = function(a, b) {
                        if (a == b) return 0;
                        return a < b ? -1 : 1;
                    },
                    getCmpFunc = function(primer, reverse) {
                        var cmp = default_cmp;
                        if (primer) {
                            cmp = function(a, b) {
                                return default_cmp(primer(a), primer(b));
                            };
                        }
                        if (reverse) {
                            return function(a, b) {
                                return -1 * cmp(a, b);
                            };
                        }
                        return cmp;
                    };

                // actual implementation
                sort_by = function() {
                    var fields = [],
                        n_fields = arguments.length,
                        field, name, reverse, cmp;

                    // preprocess sorting options
                    for (var i = 0; i < n_fields; i++) {
                        field = arguments[i];
                        if (typeof field === 'string') {
                            name = field;
                            cmp = default_cmp;
                        }
                        else {
                            name = field.name;
                            cmp = getCmpFunc(field.primer, field.reverse);
                        }
                        fields.push({
                            name: name,
                            cmp: cmp
                        });
                    }

                    return function(A, B) {
                        var a, b, name, cmp, result;
                        for (var i = 0, l = n_fields; i < l; i++) {
                            result = 0;
                            field = fields[i];
                            name = field.name;
                            cmp = field.cmp;

                            result = cmp(A[name], B[name]);
                            if (result !== 0) break;
                        }
                        return result;
                    }
                }
            }());*/

            $scope.price = function () {
                $scope.event = $scope.event.sort(function(a, b) {
                    return b.eCena - a.eCena;
                });
            };

            $scope.date = function () {

                $scope.event.forEach(function (items, index) {
                    $scope.event[index].eDatum = $scope.event[index].eDatum.replace(/,/g , "");
                });

                $scope.event =  $scope.event.sort(function(a, b) {
                    let dateA = new Date(a.eDatum), dateB = new Date(b.eDatum);
                    console.log(dateA, dateB);
                    return dateA - dateB;
                });
            };

            $scope.location = function () {

                $http.get('/api/getUserID')
                    .then(function (res) {
                        $scope.userID = res.data;
                        $scope.userID = parseFloat($scope.userID.lat) + parseFloat($scope.userID.lng);

                        $scope.event.forEach(function (items, index) {
                            $scope.event[index].latlng = parseFloat($scope.event[index].lat) + parseFloat($scope.event[index].lng);
                        });

                        $scope.event = $scope.event.sort(function(a, b) {
                            return Math.abs(a.latlng - $scope.userID) - Math.abs(b.latlng - $scope.userID);
                        });
                        $scope.event.forEach(function (items, index) {
                            console.log($scope.event[index].latlng, '=', $scope.userID)
                        });
                    });
            };

            initMap(locations);
        });

    $http.get('/api/checkSession', {}, {params: $scope.formData})
        .then(function (res) {
            $scope.checkSession = !!res.data;
        });



    let initMap = function initMap(locations) {

        let map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            center: {lat: 44.812045, lng: 20.439453}
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