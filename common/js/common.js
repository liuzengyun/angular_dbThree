//服务器模式
// var url = "http://db.beyondwinlaw.com/api/index.php/";
//本地模式
var url = "http://localhost/db3_api/index.php/";

// 1. 判断是否登录
function checkLogin(userId) {
    // 如果没有登录直接访问界面,就跳转到登录界面
    if (userId == null || userId == undefined || userId == "") {
        window.location.href = "../login.html";
    }
}
// 2. 修改密码
function editPass($scope, queryData) {
    $scope.old_pass = "";
    $scope.new_pass = "";
    $scope.second_new_pass = "";
    $scope.editPass = function () {
        var data = {uid: uid, old_pass: $scope.old_pass, new_pass: $scope.new_pass};
        if ($scope.new_pass != $scope.second_new_pass) {
            alert("两次输入密码不一致");
        }
        else {
            queryData.postData("user/pass_update", data).then(function (data) {
                alert(data.message);
                console.log(data);
            });
        }
    };
}
// 3 城市联动
function city($scope, $http) {
    $http.get("../common/json/city.json").success(function (data) {
        $scope.provinceData = data;
        $scope.province = data[0].name;
    });
}
// 4. console.log()公用
function consoleLog(data) {
    console.log(data);
}