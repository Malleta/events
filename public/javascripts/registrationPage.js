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
        email: ""
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


}]);

