var uid = sessionStorage.getItem("id");
/* 一些公用的控制器操作 */
beyond.controller("commonCtrl", function ($scope, $http, queryData, loginOut) {
    /* 获取登陆名称 */
    $scope.name = sessionStorage.getItem("name");

    /* 检查是否登录,如果没有登录,返回登录界面 */
    checkLogin(uid);

    /* 退出 调取退出服务 loginOut */
    $scope.out = function () {
        loginOut.out();
    };

    /* 修改密码 */
    editPass($scope, queryData);

    /* 写到各自的控制器中,要不然一次付给好多court种 */
    /* 搜索到法院,单击赋值 */
    $scope.changeVal = function (newVal, pro) {
        $scope.searchVal = newVal;
        $scope.court = newVal;
        $scope.matchingprovince = pro;
        $(".resultList").hide();
    };
    $scope.showList = function () {
        $(".resultList").show();
        $(".search").focus();
        $scope.searchVal = "";
    };
    /* 初始化出生年份 */
    $scope.birth = "1980";
});
/* 路由控制 */
function beyondRoute($routeProvider) {
    $routeProvider
    /* 律师匹配条件 */
        .when("/", {
            templateUrl: "main.html",
            controller: mainCtrl
        })
        /* 匹配律师 */
        .when("/lawyerMatching", {
            controller: matchingCtrl,
            templateUrl: "lawyerMatching.html"
        })
        /* 查看某个律师详细信息 */
        .when("/lawyerInfo/:lid", {
            controller: lawyerInfo,
            templateUrl: "lawyerInfo.html"
        })
        /* excel导入 */
        .when("/excel", {
            templateUrl: "excel.html",
            controller: excelCtrl
        })
        /* 所有律师 */
        .when("/allLawyer", {
            controller: allLawyerCtrl,
            templateUrl: "allLawyer.html"
        })
        /* 选择添加律师途径 */
        .when("/addLawyer", {
            templateUrl: "addLawyer.html"
        })
        /* 收藏律师 */
        .when("/favorites", {
            controller: favoriteList,
            templateUrl: "favorites.html"
        })
        /* 录入律师 */
        .when("/inputLawyer", {
            controller: inputLawyerCtrl,
            templateUrl: "inputLawyer.html"
        })
        /* 查看合作情况 */
        .when("/cooperation/:phone", {
            controller: cooperationCtrl,
            templateUrl: "cooperation.html"
        })
        .otherwise(
            {
                redirectTo: "/"
            }
        )
}
beyond.config(beyondRoute);
/* 律师匹配 new */
function mainCtrl($scope) {
    // 默认选择民商事
    $scope.area = "1";
    $scope.matching = function () {
        $scope.warnInfo = "";
        sessionStorage.setItem("court", $scope.court);
        sessionStorage.setItem("area", $scope.area);
        sessionStorage.setItem("province", $scope.matchingprovince);
    }
}
/* 匹配律师展示 */
function matchingCtrl($scope, queryData) {
    var params = {
        uid: uid,
        court: sessionStorage.getItem("court"),
        area: sessionStorage.getItem("area"),
        province: sessionStorage.getItem("province")
    };
    consoleLog(params);
    queryData.getData("lawyer/lawyer_match", params).then(function (data) {
        $scope.result = data.data.data;
        $scope.maxItems = data.data.maxRows;
        $scope.maxPage = data.data.maxPage;

        // 插件中默认是10条为一页,现在是9条一页 所以要修改插件
        $scope.maxSize = 5; // 显示最大页数
        $scope.bigTotalItems = $scope.maxItems;
        $scope.bigCurrentPage = 1;
        consoleLog(data);
    });
    $scope.pageChanged = function (page) {
        params = {
            court: $scope.court,
            area: $scope.area,
            province: $scope.matchingprovince,
            page: page
        };
        queryData.getData("lawyer/lawyer_match", params).then(function (data) {
            $scope.result = data.data.data;
            $scope.maxItems = data.data.maxRows;
            $scope.maxPage = data.data.maxPage;
        });
    }
}
/* boss跳转界面匹配省份 */
function checkMapProvince($scope, $routeParams) {
    var mapProvince = $routeParams.province;
    if (mapProvince != undefined) {
        var params = {uid: uid, province: mapProvince};
        $scope.province = mapProvince;
        consoleLog(mapProvince);
    }
    else {
        var params = {uid: uid};
    }
    return params;
}
/* 读取所有律师信息 new */
function allLawyerCtrl($scope, $routeParams, $location, queryData) {
    $scope.name = "";
    $scope.province = "";
    $scope.firm = "";
    /* 从业信息设置默认选择无 */
    $scope.judicial_type = "";
    // 判断地图传递省份
    var params = checkMapProvince($scope, $routeParams);
    params.judicial_type = "";
    // 所有律师
    queryData.getData("lawyer/lawyer_search", params).then(function (data) {
        $scope.result = data.data.data;
        $scope.maxItems = data.data.maxRows;
        $scope.maxPage = data.data.maxPage;

        // 插件中默认是10条为一页,现在是9条一页 所以要修改插件
        $scope.maxSize = 5; // 显示最大页数
        $scope.bigTotalItems = $scope.maxItems;
        $scope.bigCurrentPage = 1;
        consoleLog(data);
    });
    // 搜索项目
    // 初始化
    $scope.statusChange = function () {
        var params = {
            name: $scope.name,
            firm: $scope.firm,
            province: $scope.province,
            position: $scope.position,
            judicial_type: $scope.judicial_type
        };
        if ($scope.judicial_type == "法院") {
            params = {
                name: $scope.name,
                firm: $scope.firm,
                province: $scope.province,
                position: $scope.position,
                judicial_type: $scope.judicial_type,

                court: $scope.court,
                case_type: $scope.case_type,
                job_duty: $scope.job_duty,
                court_level: $scope.court_level
            };
        }
        if ($scope.judicial_type == "检察院") {
            params = {
                name: $scope.name,
                firm: $scope.firm,
                province: $scope.province,
                position: $scope.position,
                judicial_type: $scope.judicial_type,

                procuratorate: $scope.procuratorate,
                job_duty: $scope.job_duty
            };
        }
        if ($scope.judicial_type == "公安") {
            params = {
                name: $scope.name,
                firm: $scope.firm,
                province: $scope.province,
                position: $scope.position,
                judicial_type: $scope.judicial_type,

                police: $scope.police,
                level: $scope.level
            };
        }
        queryData.getData("lawyer/lawyer_search", params).then(function (data) {
            $scope.result = data.data.data;
            $scope.maxItems = data.data.maxRows;
            $scope.maxPage = data.data.maxPage;

            // 插件中默认是10条为一页,现在是9条一页 所以要修改插件
            $scope.maxSize = 5; // 显示最大页数
            $scope.bigTotalItems = $scope.maxItems;
            $scope.bigCurrentPage = 1;
        });
    };
    // 分页ng-change()传递参数为当前页
    //页面传递过来单击页码参数
    $scope.pageChanged = function (page) {
        var params = {
            name: $scope.name,
            firm: $scope.firm,
            province: $scope.province,
            position: $scope.position,
            judicial_type: $scope.judicial_type,
            page: page
        };
        if ($scope.judicial_type == "法院") {
            params = {
                name: $scope.name,
                firm: $scope.firm,
                province: $scope.province,
                position: $scope.position,
                judicial_type: $scope.judicial_type,

                court: $scope.court,
                case_type: $scope.case_type,
                job_duty: $scope.job_duty,
                court_level: $scope.court_level,
                page: page
            };
        }
        if ($scope.judicial_type == "检察院") {
            params = {
                name: $scope.name,
                firm: $scope.firm,
                province: $scope.province,
                position: $scope.position,
                judicial_type: $scope.judicial_type,

                procuratorate: $scope.procuratorate,
                job_duty: $scope.job_duty,
                page: page
            };
        }
        if ($scope.judicial_type == "公安") {
            params = {
                name: $scope.name,
                firm: $scope.firm,
                province: $scope.province,
                position: $scope.position,
                judicial_type: $scope.judicial_type,

                police: $scope.police,
                level: $scope.level,
                page: page
            };
        }
        queryData.getData("lawyer/lawyer_search", params).then(function (data) {
            $scope.result = data.data.data;
            $scope.maxItems = data.data.maxRows;
            $scope.maxPage = data.data.maxPage;
        });
    };
    // 删除律师
    $scope.deleteLawyer = function (id) {
        var params = {
            lawyer_id: id
        };
        if (confirm("您确定删除吗?")) {
            queryData.getData("lawyer/lawyer_delete", params).then(function (data) {
                consoleLog(data);
                window.location.reload();
            })
        }
        else {
            return false;
        }
    }
}
/* 查看某个律师详情 new */
function lawyerInfo($scope, $http, $routeParams, queryData, Upload) {
    // 通过路由获取律师id
    var params = {
        lawyer_id: $routeParams.lid
    };
    queryData.getData("lawyer/lawyer", params).then(function (data) {
        /* 律师基本信息,法院信息,检察院信息,公安信息 */
        $scope.lawyer = data.data.lawyer;
        $scope.lawyer_court = data.data.lawyer_court;
        $scope.lawyer_procuratorate = data.data.lawyer_procuratorate;
        $scope.lawyer_police = data.data.lawyer_police;
        consoleLog(data);
        // 传递上传头像的参数, 显示头像对象
        $scope.files = data.data.file;

        $scope.lawyer_id = data.data.lawyer.id;
        $scope.file_id = data.data.file.file_id;
    });
    // 加载省份和年份
    $scope.city = function() {
        city($scope, $http);
    };
    // 修改基本信息
    $scope.editLawyer = function (id) {
        var data = {
            lawyer_id: id,
            name: $scope.lawyer.name,
            phone: $scope.lawyer.phone,
            country: '中国',
            province: $scope.lawyer.province,
            firm: $scope.lawyer.firm,
            practice_area: $scope.lawyer.practice_area,
            license_number: $scope.lawyer.license_number,

            birth: $scope.lawyer.birth,
            sex: $scope.lawyer.sex,
            city: $scope.lawyer.city,
            address: $scope.lawyer.address,
            school: $scope.lawyer.school,
            position: $scope.lawyer.position,
            admin_case: $scope.lawyer.admin_case,
            income: $scope.lawyer.income,
            team_scale: $scope.lawyer.team_scale,
            remarks: $scope.lawyer.remarks,
            judicial_type: $scope.lawyer.judicial_type,
            is_middle: $scope.lawyer.is_middle

        };
        consoleLog(data);
        if (
            id == "" ||
            $scope.lawyer.name == "" ||
            $scope.lawyer.phone == "" ||
            $scope.lawyer.province == "" ||
            $scope.lawyer.firm == "" ||
            $scope.lawyer.practice_area == "" ||
            $scope.lawyer.license_number == "" ||
            $scope.lawyer.birth == "" ||
            $scope.lawyer.sex == "" ||
            $scope.lawyer.city == "" ||
            $scope.lawyer.address == "" ||
            $scope.lawyer.position == "" ||
            $scope.lawyer.income == "" ||
            $scope.lawyer.team_scale == "" ||
            $scope.lawyer.is_middle == "" ||
            $scope.lawyer.judicial_type == ""


        ) {
            $scope.warnMessage = "带*号的为必填字段";
            return false;
        }
        else {
            queryData.postData("lawyer/lawyer_update", data).then(function (data) {
                consoleLog(data);
                alert(data.message);
                window.location.reload();
            })
        }
    };
    // 修改从业信息
    $scope.editJud = function () {
        // 修改法院信息
        if ($scope.lawyer.judicial_type == "法院") {
            if ($scope.lawyer_court.court == "" || $scope.lawyer_court.case_type == "") {
                $scope.warnMessage = "所在法院和审理案件不能为空";
                return false;
            }
            else {
                var dataCourt = {
                    court_id: $scope.lawyer_court.id,
                    court: $scope.court,
                    case_type: $scope.lawyer_court.case_type,
                    job_duty: $scope.lawyer_court.job_duty,
                    start_time: $scope.lawyer_court.start_time,
                    end_time: $scope.lawyer_court.end_time,
                    court_level: $scope.lawyer_court.court_level
                };
                queryData.postData("lawyer/lawyer_court_update", dataCourt).then(function (data) {
                    consoleLog(data);
                    alert(data.message);
                    window.location.reload();
                })
            }
        }
        // 修改检察院信息
        if ($scope.lawyer.judicial_type == "检察院") {
            if ($scope.lawyer_procuratorate.procuratorate == "") {
                $scope.warnMessage = "所在检察院不能为空";
                return false;
            }
            else {
                var dataProcuratorate = {
                    procuratorate_id: $scope.lawyer_procuratorate.id,
                    procuratorate: $scope.lawyer_procuratorate.procuratorate,
                    job_duty: $scope.lawyer_procuratorate.job_duty,
                    start_time: $scope.lawyer_procuratorate.start_time,
                    end_time: $scope.lawyer_procuratorate.end_time
                };
                queryData.postData("lawyer/lawyer_procuratorate_update", dataProcuratorate).then(function (data) {
                    consoleLog(data);
                    alert(data.message);
                    window.location.reload();
                })
            }
        }
        // 修改公安信息
        if ($scope.lawyer.judicial_type == "公安") {
            if ($scope.lawyer_police.police == "") {
                $scope.warnMessage = "所在公安不能为空";
                return false;
            }
            else {
                var dataPolice = {
                    police_id: $scope.lawyer_police.id,
                    police: $scope.lawyer_police.police,
                    level: $scope.lawyer_police.level,
                    start_time: $scope.lawyer_police.start_time,
                    end_time: $scope.lawyer_police.end_time
                };
                queryData.postData("lawyer/lawyer_police_update", dataPolice).then(function (data) {
                    consoleLog(data);
                    alert(data.message);
                    window.location.reload();
                })
            }
        }
    };
    // 删除从业信息
    $scope.deleteJud = function () {
        if ($scope.lawyer.judicial_type == "法院") {
            var courtParams = {
                court_id: $scope.lawyer_court.id
            };
            if (confirm("你确定删除吗?")) {
                queryData.getData("lawyer/lawyer_court_delete", courtParams).then(function (data) {
                    consoleLog(data);
                    if (data.status == true) {
                        window.location.reload();
                    }
                    else {
                        alert(data.message);
                        return false;
                    }
                })
            }
            else {
                return false;
            }
        }
        if ($scope.lawyer.judicial_type == "检察院") {
            var procuratorateParams = {
                procuratorate_id: $scope.lawyer_procuratorate.id
            };
            if (confirm("你确定删除吗?")) {
                queryData.getData("lawyer/lawyer_procuratorate_delete", procuratorateParams).then(function (data) {
                    consoleLog(data);
                    if (data.status == true) {
                        window.location.reload();
                    }
                    else {
                        alert(data.message);
                        return false;
                    }
                })
            }
            else {
                return false;
            }
        }
        if ($scope.lawyer.judicial_type == "公安") {
            var policeParams = {
                police_id: $scope.lawyer_police.id
            };
            if (confirm("你确定删除吗?")) {
                queryData.getData("lawyer/lawyer/lawyer_police_delete", policeParams).then(function (data) {
                    consoleLog(data);
                    if (data.status == true) {
                        window.location.reload();
                    }
                    else {
                        alert(data.message);
                        return false;
                    }
                })
            }
            else {
                return false;
            }
        }
    };

    /* 上传头像 依赖Upload服务 */
    /* 注意: 这里要获取基本信息里面的信息, 从在异步加载问 */
    $scope.uploadUser = function () {
        $scope.upload($scope.file);
    };
    $scope.upload = function (file) {
        Upload.upload({
            url: url + 'lawyer/lawyer_photo_upload',
            data: {file: file, lawyer_id: $scope.lawyer_id, file_id: $scope.file_id}
        }).progress(function (evt) {    // 进度
            $(".progress-striped").show();
        }).success(function (data, status, headers, config) { //成功的情况
            window.location.reload();
            consoleLog(data);
            //失败的情况
        }).error(function (data) {
            consoleLog(data);
        })
    };

}
/* 收藏 new */
function favoriteList($scope, queryData) {
    var params = {uid: uid, type: "2"};
    queryData.getData("user/collections", params).then(function (data) {
        $scope.result = data.data.data;
        $scope.maxItems = data.data.maxRows;
        $scope.maxPage = data.data.maxPage;

        // 插件中默认是10条为一页,现在是9条一页 所以要修改插件
        $scope.maxSize = 5; // 显示最大页数
        $scope.bigTotalItems = $scope.maxItems;
        $scope.bigCurrentPage = 1;
        consoleLog(data);
    });
    $scope.pageChanged = function (page) {
        params = {uid: uid, type: "2", page: page};
        queryData.getData("user/collections", params).then(function (data) {
            $scope.result = data.data.data;
            $scope.maxItems = data.data.maxRows;
            $scope.maxPage = data.data.maxPage;
        });
    }
}
/* 录入律师信息控制器 new */
function inputLawyerCtrl($scope, $http, queryData) {
    city($scope, $http);
    $scope.name = "";
    $scope.city = "延庆";
    if ($scope.admin_case == true) {
        $scope.admin_case = "是";
    }
    else {
        $scope.admin_case = "否";
    }
    $scope.addLawyer = function () {
        if (confirm("您确定提交吗?")) {
            var data = {
                name: $scope.name,
                phone: $scope.phone,
                country: "中国",
                province: $scope.province,
                firm: $scope.firm,
                practice_area: $scope.practice_area,
                license_number: $scope.license_number,
                birth: $scope.birth,
                sex: $scope.sex,
                city: $scope.city,
                address: $scope.address,
                school: $scope.school,
                position: $scope.position,
                admin_case: $scope.admin_case,
                income: $scope.income,
                team_scale: $scope.team_scale,
                remarks: $scope.remarks,
                is_middle: $scope.is_middle,
                judicial_type: "没有"
            };
            if ($scope.judicial_type == "法院") {
                data = {
                    name: $scope.name,
                    phone: $scope.phone,
                    country: "中国",
                    province: $scope.province,
                    firm: $scope.firm,
                    practice_area: $scope.practice_area,
                    license_number: $scope.license_number,
                    birth: $scope.birth,
                    sex: $scope.sex,
                    city: $scope.city,
                    address: $scope.address,
                    school: $scope.school,
                    position: $scope.position,
                    admin_case: $scope.admin_case,
                    income: $scope.income,
                    team_scale: $scope.team_scale,
                    remarks: $scope.remarks,
                    is_middle: $scope.is_middle,
                    judicial_type: "法院",

                    court: $scope.court,
                    case_type: $scope.case_type,
                    job_duty: $scope.job_duty,
                    start_time: $scope.start_time_year + "-" + $scope.start_time_month,
                    end_time: $scope.end_time_year + "-" + $scope.end_time_month,
                    court_level: $scope.court_level
                }
            }
            if ($scope.judicial_type == "检察院") {
                data = {
                    name: $scope.name,
                    phone: $scope.phone,
                    country: "中国",
                    province: $scope.province,
                    firm: $scope.firm,
                    practice_area: $scope.practice_area,
                    license_number: $scope.license_number,
                    birth: $scope.birth,
                    sex: $scope.sex,
                    city: $scope.city,
                    address: $scope.address,
                    school: $scope.school,
                    position: $scope.position,
                    admin_case: $scope.admin_case,
                    income: $scope.income,
                    team_scale: $scope.team_scale,
                    remarks: $scope.remarks,
                    is_middle: $scope.is_middle,
                    judicial_type: "检察院",

                    procuratorate: $scope.procuratorate,
                    job_duty: $scope.job_duty,
                    start_time: $scope.start_time_year + "-" + $scope.start_time_month,
                    end_time: $scope.end_time_year + "-" + $scope.end_time_month
                }
            }
            if ($scope.judicial_type == "公安") {
                data = {
                    name: $scope.name,
                    phone: $scope.phone,
                    country: "中国",
                    province: $scope.province,
                    firm: $scope.firm,
                    practice_area: $scope.practice_area,
                    license_number: $scope.license_number,
                    birth: $scope.birth,
                    sex: $scope.sex,
                    city: $scope.city,
                    address: $scope.address,
                    school: $scope.school,
                    position: $scope.position,
                    admin_case: $scope.admin_case,
                    income: $scope.income,
                    team_scale: $scope.team_scale,
                    remarks: $scope.remarks,
                    is_middle: $scope.is_middle,
                    judicial_type: "公安",

                    police: $scope.police,
                    start_time: $scope.start_time_year + "-" + $scope.start_time_month,
                    end_time: $scope.end_time_year + "-" + $scope.end_time_month,
                    level: $scope.level
                }
            }
            consoleLog(data);
            if ($scope.judicial_type == "法院") {
                if ($scope.name == "" ||
                    $scope.phone == "" ||
                    $scope.province == "" ||
                    $scope.firm == "" ||
                    $scope.practice_area == "" ||
                    $scope.license_number == "" ||
                    $scope.birth == "" ||
                    $scope.sex == "" ||
                    $scope.city == "" ||
                    $scope.address == "" ||
                    $scope.position == "" ||
                    $scope.admin_case == "" ||
                    $scope.income == "" ||
                    $scope.team_scale == "" ||
                    $scope.is_middle == "" ||
                    $scope.judicial_type == "" ||
                    $scope.court == "" ||
                    $scope.case_type == "" ||
                    $scope.job_duty == "" ||
                    $scope.start_time_year == "" ||
                    $scope.start_time_month == "" ||
                    $scope.end_time_year == "" ||
                    $scope.end_time_month == "" ||
                    $scope.court_level == ""
                ) {
                    $scope.warnMessage = "带*号的为必填字段";
                    return false;
                }
            }
            else if ($scope.judicial_type == "检察院") {
                if ($scope.name == "" ||
                    $scope.phone == "" ||
                    $scope.province == "" ||
                    $scope.firm == "" ||
                    $scope.practice_area == "" ||
                    $scope.license_number == "" ||
                    $scope.birth == "" ||
                    $scope.sex == "" ||
                    $scope.city == "" ||
                    $scope.address == "" ||
                    $scope.position == "" ||
                    $scope.admin_case == "" ||
                    $scope.income == "" ||
                    $scope.team_scale == "" ||
                    $scope.is_middle == "" ||
                    $scope.judicial_type == "" ||

                    $scope.procuratorate == "" ||
                    $scope.job_duty == "" ||
                    $scope.start_time_year == "" ||
                    $scope.start_time_month == "" ||
                    $scope.end_time_year == "" ||
                    $scope.end_time_month == ""
                ) {
                    $scope.warnMessage = "带*号的为必填字段";
                    return false;
                }
            }
            else if ($scope.judicial_type == "检察院") {
                if ($scope.name == "" ||
                    $scope.phone == "" ||
                    $scope.province == "" ||
                    $scope.firm == "" ||
                    $scope.practice_area == "" ||
                    $scope.license_number == "" ||
                    $scope.birth == "" ||
                    $scope.sex == "" ||
                    $scope.city == "" ||
                    $scope.address == "" ||
                    $scope.position == "" ||
                    $scope.admin_case == "" ||
                    $scope.income == "" ||
                    $scope.team_scale == "" ||
                    $scope.is_middle == "" ||
                    $scope.judicial_type == "" ||

                    $scope.police == "" ||
                    $scope.level == "" ||
                    $scope.start_time_year == "" ||
                    $scope.start_time_month == "" ||
                    $scope.end_time_year == "" ||
                    $scope.end_time_month == ""
                ) {
                    $scope.warnMessage = "带*号的为必填字段";
                    return false;
                }
            }
            queryData.postData("lawyer/lawyer_insert", data).then(function (data) {
                if (data.status == false) {
                    alert(data.message);
                    consoleLog(data);
                    return false;
                }
                else {
                    $scope.warnMessage = "";
                    window.location.href = "#/allLawyer";
                    consoleLog(data);
                }
            });

        }
    }

}
/* 合作信息 */
function cooperationCtrl($scope, $http, $routeParams) {
    var phone = $routeParams.phone;
    var params = {phone: phone, type: "lawyer"};
    $http.get(url + "coop/info", {params: params}).success(function (result) {
        // 查询是否成功
        if (result.status == true) {
            $scope.result = result.data;
        }
        else {
            $scope.message = result.message;
        }
        consoleLog(result);
    });

}
/* excel 上传 */
function excelCtrl($scope, Upload) {
    /* 上传控制器,依赖Upload服务 */
    $scope.fileInfo = $scope.file;
    $scope.submit = function () {
        $scope.upload($scope.file);
    };
    $scope.upload = function (file, type) {
        Upload.upload({
            url: url + 'excel/lawyer',
            data: {file: file, uid: uid}
            //成功的情况
        }).success(function (data, status, headers, config) {
            $scope.error = data.data.error;
            $scope.failed_num = data.data.failed_num;
            $scope.success_num = data.data.success_num;
            consoleLog(data);

            //失败的情况
        }).error(function (data) {
            consoleLog(data);
        })
    }
}