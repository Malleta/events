var app = angular.module('myApp', ['ui.materialize']);

app.controller('myCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.conf = {
        uID: window.location.href.match(/\w{10}$/g),
        uActivation: '1'
    };

    $scope.activation = function () {
        $http.post('/api/activation', {}, {params: $scope.conf})
            .then(function (res) {
                res = res.data;
                if(res.status){
                    Materialize.toast(res.msg, 1000);
                    setTimeout(function () {
                        location.href = '/';
                    },1000)
                }
            });
    };


}]);

