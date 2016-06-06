/* ui-route 路由器, 文件上传依赖 ngFileUpload */
var beyond = angular.module("beyond", ['ngRoute', 'ngFileUpload', "ui.bootstrap"]);
/* 创建获取数据的服务factory模式, $q, deferd, resolve, reject, then使用 开始 */
beyond.factory("queryData", function ($http, $q) {
    var resultData = {};
    /* get方法获取数据 */
    resultData.getData = function (urlParams, params, state) {
        var deferred = $q.defer();
        /* get方法获取数据 */
        $http.get(url + urlParams, {params: params}, {cache: state}).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
    /* post方法获取数据 */
    resultData.postData = function (urlParams, data) {
        var deferred = $q.defer();
        /* post方法获取数据 */
        $http.post(url + urlParams, data).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
    return resultData;
});
/* 创建获取数据的服务 结束 */

/* 退出登录的服务 */
beyond.factory("loginOut", function ($http, queryData) {
    var loginOutResult = {};
    // 2. 退出删除session, 依赖自定义服务,获取数据
    loginOutResult.out = function () {
        queryData.postData("login/logout").then(function (data) {
            if (data.status == true) {
                sessionStorage.clear();
                window.location.href = "../login.html";
            }
            return data;
        })
    };
    return loginOutResult;
});