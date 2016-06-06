/* 自定义指令(输入法院模糊查找) */
beyond.directive('selectCourt', function ($http, queryData) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on("focus", function () {
                scope.$watch('searchVal', function (newVal) {
                    queryData.getData("court/court_search", {name: newVal}, true).then(function (data) {
                        scope.searchData = data.data;
                        consoleLog(data);
                    })
                })
            })
        }
    }
});
/* 自定义获取年份的指令 */
beyond.directive("getYear", function ($http) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.on("click", function () {
                $http.get("../common/json/year.json").success(function (data) {
                    scope.yearList = data;
                })
            })
        }
    }
});

/* 自定义获取出生年份的指令 */
beyond.directive("getBirthYear", function ($http) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            $http.get("../common/json/birthYear.json").success(function (data) {
                scope.birthYearList = data;
            })
        }
    }
});

/* 自定义手机验证的指令 */
beyond.directive("checkPhone", function ($http, queryData) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.on("change", function () {
                queryData.getData("lawyer/check_phone", {phone: element.val()}).then(function (data) {
                    scope.message = data;
                    consoleLog(element.val());
                    consoleLog(data);
                    if (data.status == false) {
                        scope.phoneMessage = data.message;
                        return false;
                    }
                    else {
                        scope.phoneMessage = "";
                    }
                });
            })
        }
    }
});

/* 封装jquery进度百分比的插件指令 */
beyond.directive("radialDirective", function () {
    return {
        restrict: 'EA',
        scope: {},
        //template: '<div class="prg-cont rad-prg" id="indicatorContainer"></div>',
        link: function (scope, element, attrs) {
            var num = attrs.id * 3.6;
            if (num <= 180) {
                element.parent().parent().find('.right').css('transform', "rotate(" + num + "deg)");
            }
            else {
                element.parent().parent().find('.right').css('transform', "rotate(180deg)");
                element.parent().parent().find('.left').css('transform', "rotate(" + (num - 180) + "deg)");
            }
        }
    }
});

/* 单击收藏, 单击取消收藏 指令 */
beyond.directive("cancelcollectionOrCollection", function (queryData) {
    return {
        restrict: "AE",
        link: function (scope, element, attrs) {
            // 基本信息中后台返回一个,是否收藏的参数,判断星星的颜色,然后根据参数判断是收藏还是取消收藏.
            if (attrs.collection == "") {
                element.on("click", function () {
                    var data = {
                        uid: uid,
                        clid: attrs.id,
                        type: 2
                    };
                    queryData.postData("user/collection", data).then(function (data) {
                        consoleLog(data);
                        alert(data.message);
                        window.location.reload();
                    });
                });
            }
            else {
                element.on("click", function () {
                    var params = {
                        collection_id: attrs.collection
                    };
                    queryData.getData("user/collection_delete", params).then(function (data) {
                        consoleLog(data);
                        alert(data.message);
                        window.location.reload();
                    });
                });
            }
        }
    }
});