// 定义app然后修改post请求后台数据问题
var loginApp = angular.module('loginApp', [], function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var param = function (obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];
            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    };
    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});
loginApp.config(function ($httpProvider) {
    $httpProvider.defaults.transformRequest = function (data) {
        if (data === undefined) {
            return data;
        }
        return $.param(data);
    }
});
// 定义控制器
loginApp.controller("loginCtrl", function ($scope, $http) {
    // 初始化变量
    $scope.username = "";
    $scope.password = "";
    $scope.message = "";
    // 定义登陆提交函数
    $scope.submitLogin = function () {
        // 定义参数,这个是在登陆中使用ng-model绑定的变量
        var data = {username: $scope.username, pass: $scope.password};
        $http.post(url + "login/login", data).success(function (data) {
            $scope.message = data.message;
            console.log(data);
            if (data.status == true) {
                // 数据存储到session中
                sessionStorage.setItem("area", data.user.area);
                sessionStorage.setItem("id", data.user.id);
                sessionStorage.setItem("level", data.user.level);
                sessionStorage.setItem("name", data.user.name);
                sessionStorage.setItem("phone", data.user.phone);
                sessionStorage.setItem("type", data.user.type);
                if (data.user.type == 0) {
                    window.location.href = "boss/index.html";
                }
                if (data.user.type == 1) {
                    window.location.href = "market/index.html";
                }
                if (data.user.type == 2) {
                    window.location.href = "business/index.html";
                }
            }
        });
    };
    // 回车调用登陆事件
    document.onkeydown = function (e) {
        if (!e) e = window.event;//火狐中是 window.event
        if ((e.keyCode || e.which) == 13) {
            // 定义参数,这个是在登陆中使用ng-model绑定的变量
            var data = {username: $scope.username, pass: $scope.password};
            $http.post(url + "login/login", data).success(function (data) {
                $scope.message = data.message;
                console.log(data);
                if (data.status == true) {
                    // 数据存储到session中
                    sessionStorage.setItem("area", data.user.area);
                    sessionStorage.setItem("id", data.user.id);
                    sessionStorage.setItem("level", data.user.level);
                    sessionStorage.setItem("name", data.user.name);
                    sessionStorage.setItem("phone", data.user.phone);
                    sessionStorage.setItem("type", data.user.type);
                    if (data.user.type == 0) {
                        window.location.href = "boss/index.html";
                    }
                    if (data.user.type == 1) {
                        window.location.href = "market/index.html";
                    }
                    if (data.user.type == 2) {
                        window.location.href = "business/index.html";
                    }
                }
            });
        }
    };
});