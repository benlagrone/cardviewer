angular.module('data', ['ngRoute', 'ngCookies','toaster','LocalStorageModule','ngAnimate','ui.bootstrap','angularMoment','angular-sortable-view'])
    .controller('homeController', function ($scope,httpService) {
        httpService.getSomething().then(function(response){
            console.log(response)
            $scope.something = response.data
        },function errorCallback(response){
            console.log(response)
        })
        $scope.message = 'Hello Home';
        $scope.foo = null;

        var data = null;

    })
    .controller('loginController',function($scope,httpService,$location,$cookies){
        $scope.user = {
            userName:'',
            password:''
        };
        $scope.login = function(){
            httpService.getLogin($scope.user).then(function(response){
                if(response.data.status===true){
                    $cookies.put('ARC_UserToken',response.data.token)
                    $location.path('/home')
                }
            })
        }
    })
    .controller('configureController',function($timeout,$scope,httpService,localStorageService,moment){
        function getItem(key) {
            return localStorageService.get(key);
        }
        $scope.enableFeature = {
            addActivity : true,
            copyActivity:true,
            sortActivities:false,
            addField : true,
            copyField:true,
            //TODO enable drag sort
            dragFieldSort:false
        };
        $scope.makeTime = {
            time:moment().format('L')
        };
        $scope.userId = getItem('userId');
        $scope.userName = getItem('userName');
        $scope.departmentNiceName = getItem('departmentNiceName');
        $scope.departmentId = getItem('departmentId');
        $scope.newActivityID = 0;
        $scope.newFieldID = 0;
        $scope.fields = [];
        $scope.activities = [];
        $scope.activityCats = [];
        $scope.activitySortBy = "name";
        $scope.activitySortTypes = [{value:'name',name:'name'},{value:'category',name:'category'}];
        $scope.restore = {
            fields : [],
            activities : []
        };
        $scope.newData = {
            field:{
                id:0,
                edit:true,
                hide:true,
                hideRow:true,
                childFields:[]
            },
            activity:{
                id:0,
                edit:true,
                hide:true,
                hideRow:true,
                fields:[]
            }
        };
        $scope.dataTypesList = [];
        $scope.addSymbol = 'fa-plus-square';
        $scope.hideNewActivity = true;
        $scope.hideNewField = true;
        $scope.hideDrawer = true;
        $scope.drawerSymbol ='fa-list';
        $scope.closeDrawerSymbol = 'fa-times-circle';
        $scope.hideFieldSearch = true;
        $scope.addFieldstoActivityTitle;
        $scope.workingActivity;
        $scope.workingField;
        $scope.addMouseOver = function(){
            $scope.addSymbol = 'fa-pencil-square';
        };
        $scope.searchFields;
        $scope.removeItem = function(item){
            console.log(item)
            angular.forEach($scope.fields,function(value,index){
                if(value.fieldId===item.fieldId){
                    $scope.fields.splice(index,1);
                    // httpService.deleteData('Data/Fields',).then(response){
                    //     console.log(response)
                    // },function errorCallback(response){
                    //     console.log(response)
                    // });
                    // return;
                }
            })
        };
        $scope.addMouseLeave = function(){
            $scope.addSymbol = 'fa-plus-square';
        };
        $scope.addClick = function(){
        };
        $scope.clearNewActivity = function(form){
            $scope.newData.activity = {};
            $scope.hideNewActivity = true;
            $scope.workingActivity=undefined;
            form.$setPristine();
            form.$setUntouched();
        };
        $scope.clearNewField = function(form){
            $scope.newField = {};
            $scope.hideNewField = true;
            $scope.workingField=undefined;
            form.$setPristine();
            form.$setUntouched();
        };
        $scope.postNewActivity = function(form){
            if(!form.$invalid){
                angular.forEach($scope.activities,function(value,index){
                    if(value.id===$scope.newData.activity.id){
                        value.hide=false;
                        value.hideRow=false;
                        value.edit=false;
                        $timeout(function(){value.hide=true},1000);
                    }
                });
                var postData = {
                    "fields": $scope.newData.activity.fields,
                    "id": $scope.newData.activity.id,
                    "name": $scope.newData.activity.name,
                    "category": $scope.newData.activity.category,
                    "description": $scope.newData.activity.description,
                    "isMasterActivity": $scope.newData.activity.isMasterActivity,
                    "departmentId": $scope.departmentId,
                    "createdById": $scope.userId,
                    "createdDate": moment().format('L'),
                    "modifiedById": $scope.userId,
                    "modifiedDate": moment().format('L')
                };
                var newData = {
                    edit:true,
                    hide:true,
                    hideRow:true,
                    fields:[]
                };
                $scope.newActivityID++;
                newData.id = $scope.newActivityID;
                $scope.newData.activity = newData;
                $scope.clearNewActivity();
                console.log(form)
                form.$setPristine();
                form.$setUntouched();

                // httpService.postData('Data/Field/',postData).then(function(response){
                //     console.log(response)
                // },function errorCallabck(response){
                //     console.log(response)
                // })
            }
        };
        $scope.openEditField = function(field){
            $scope.workingActivity = field;
            angular.forEach($scope.fields,function(value,index){
                value.block = false;
                if(value.fieldId===field.fieldId){
                    if(field.edit){
                        $scope.workingActivity = undefined;
                        value=false;
                    }
                    value.block = true;
                }
            });
        };
        $scope.postNewField = function(form){
            console.log(form)
            if(!form.$invalid){
                console.log($scope.newData.field)
                angular.forEach($scope.fields,function(value,index){
                    value.showIncluded = false;
                    if(value.id===$scope.newData.field.id){
                        value.hide=false;
                        value.hideRow=false;
                        value.edit=false;
                        $timeout(function(){value.hide=true},1000);
                    }
                });
                var postData = {
                    "childFields": $scope.newData.field.childFields,
                    "id": $scope.newData.field.id,
                    "name": $scope.newData.field.name,
                    "category": $scope.newData.field.category,
                    "description": $scope.newData.field.description,
                    "isMasterActivity": $scope.newData.field.isMasterField,
                    "departmentId": $scope.departmentId,
                    "createdById": $scope.userId,
                    "createdDate": moment().format('L'),
                    "modifiedById": $scope.userId,
                    "modifiedDate": moment().format('L')
                };
                var newData = {
                    edit:true,
                    hide:true,
                    hideRow:true,
                    fields:[]
                };
                $scope.workingActivity = undefined;
                $scope.newFieldID++;
                newData.id = $scope.newFieldID;
                $scope.newData.field = newData;
                $scope.clearNewField(form);
                console.log(form)
                form.$setPristine();
                form.$setUntouched();

                // httpService.postData('Data/Field/',postData).then(function(response){
                //     console.log(response)
                // },function errorCallabck(response){
                //     console.log(response)
                // })
            }
        };
        httpService.getUser().then(function(response){
            $scope.userInfo = response.data;
        },function errorCallback(response){
        });
        httpService.getData('Data/Activities').then(function(response){
            angular.forEach(response.data,function(value,key){
                if($scope.activityCats.length<1){
                    $scope.activityCats.push(value.category)
                }
                var found = false;
                angular.forEach($scope.activityCats,function(Avalue,Aindex){
                   if(Avalue===value.category){
                      found = true
                   }
                });
                if(!found){
                    $scope.activityCats.push(value.category)
                }
                value.hide = true;
                value.edit = false;
                value.hideRow = false;
                value.openCloseDrawerControls = false;
                    var valTmp = value;
                $scope.activities.push(value);
                $scope.restore.activities.push(valTmp);
            })
        },function errorCallBack(response){
            // console.log(response)
        });
        httpService.getData('Data/Field/DataTypes').then(function(response){
            $scope.dataTypesList = response.data;
        },function errorCallback(response){

        });
        httpService.getData('Data/Fields').then(function(response){
            angular.forEach(response.data,function(value,key){
                value.fieldName = value.name;
                value.fieldId = value.id;
                value.hide = true;
                value.edit = false;
                value.showIncluded = false;
                value.block = false;
                $scope.fields.push(value);
                $scope.restore.fields.push(value);
            })
        },function errorCallBack(response){
        });
        $scope.getFieldDataType = function(fileTypeID){
            var usedID;
            angular.forEach($scope.dataTypesList,function(value,index){
              if (value.id===fileTypeID){
                  usedID = value.name
              }
          });
            return usedID;
        };
        $scope.submitValid = true;
        $scope.submitActivityChanges = function(activity){
            console.log(activity);
            var putData = {
                "fields":[],
                "id": activity.id,
                "name": activity.name,
                "category": activity.category,
                "description": activity.description,
                "isMasterActivity": activity.isMasterActivity,
                "departmentId": $scope.departmentId,
                "createdById": activity.createdById,
                "createdDate": activity.createdDate,
                "modifiedById": $scope.userId,
                "modifiedDate": moment().format('L')
            };
            angular.forEach(activity.fields,function(value,index){
               var fieldData = {
                   // canBeAutomated:value.canBeAutomated,
                   // categoryId:value.categoryId,
                   // categoryName:value.categoryName,
                   // childFields:value.childFields,
                   // createdById:value.createdById,
                   // createdDate:value.createdDate,
                   // displayName:value.displayName,
                   activityId:value.activityId,
                   fieldId:value.fieldId,
                   ordinal:value.ordinal,
                   // fieldDataType:value.fieldDataType,
                   // fieldParentId:value.fieldParentId,
                   // id :value.id,
                   // instructions : value.instructions,
                   // isMasterField : value.isMasterField,
                   // listId:value.listId,
                   // modifiedById :value.modifiedById,
                   // modifiedDate: value.modifiedDate,
                   fieldName:value.name
               }
                putData.fields.push(fieldData);
            });
            console.log(putData)
            //ready to PUT postData
        };
        $scope.submitFieldChanges = function(field){
            console.log(field);
            var putData = {
                "id": field.id,
                "name": field.name,
                "instructions": field.instructions,
                "fieldDataType": field.fieldDataType,
                "listId": field.listId,
                "fieldParentId": field.fieldParentId,
                "isMasterField": field.isMasterField,
                "canBeAutomated": field.canBeAutomated,
                "categoryId": field.categoryId,
                "categoryName": field.categoryName,
                "createdById": field.createdById,
                "createdDate": field.createdDate,
                "modifiedById": $scope.userId,
                "modifiedDate": moment().format('L'),
                "childFields": field.childFields
            }
            console.log(putData)
            //ready to put postdatas
        };
        $scope.drawerMouseLeave = function(){
            $scope.drawerSymbol = 'fa-list'
        };
        $scope.drawerMouseOver = function(){
            $scope.drawerSymbol = 'fa-arrow-left'
        };
        $scope.closeDrawerMouseOver = function(){
            if($scope.closeDrawerSymbol != 'fa-arrow-circle-right')
            $scope.closeDrawerSymbol = 'fa-arrow-circle-right';
        };
        $scope.closeDrawerMouseLeave = function(){
            if($scope.closeDrawerSymbol != 'fa-times-circle')
            $scope.closeDrawerSymbol = 'fa-times-circle';
        };
        $scope.showFieldSearch = function(){
            $scope.hideFieldSearch = false;
        };
        $scope.searchFieldsMouseLeave = function(){
            // if(!$scope.searchFields)
            // $scope.hideFieldSearch = true;
        };
        $scope.closeFieldsSearch = function(){
            // if(!$scope.searchFields)
            $scope.hideFieldSearch = true;
            $scope.searchFields = undefined;
        };
        $scope.showDrawerClose = function(){
            $scope.hideDrawer=true;
            $scope.searchFields = undefined;
            $scope.hideFieldSearch = true;
        };
        $scope.showFieldInDrawer = function(fieldId){
            $scope.hideDrawer = false;
            $scope.searchFields = fieldId;
            $scope.hideFieldSearch = false;
        };
        $scope.addChildFieldToField = function(field){
            console.log(field)
            $scope.workingActivity = field;
            field.name?field.name=field.name:field.name="My New Field";
            $scope.addFieldstoActivityTitle = field.name;
            angular.forEach($scope.fields,function(value,index){
                $scope.fields[index].showIncluded = false;
                angular.forEach(field.fields,function(value2,index2){
                    if(value2.id===value.id){
                        $scope.fields[index].showIncluded = true;
                    }
                })
            })
        };
        $scope.addAFieldToActivity = function(activity){
            console.log(activity.fields)
            $scope.workingActivity = activity;
            $scope.hideDrawer = false;
            $scope.addFieldstoActivityTitle = activity.name;
            angular.forEach($scope.fields,function(value,index){
                console.log(value)
                $scope.fields[index].showIncluded = false;
                angular.forEach(activity.fields,function(value2,index2){
                    if(value2.fieldId===value.fieldId){
                        $scope.fields[index].showIncluded = true;
                    }
                })
            })
        };
        $scope.addThisFieldToActivity = function(obj,field){
            angular.forEach($scope.activities,function(value,index){
                if(value.id===$scope.workingActivity.id){
                    if(obj.target.attributes.data.value==="add"){
                        var fieldExists=false;
                        angular.forEach(value.fields,function(Fvalue,Findex){
                            if(Fvalue.fieldId===field.id){
                                fieldExists=true;
                            }
                        });
                        if(!fieldExists){
                            field.ordinal = 0;
                            field.fieldName = field.name;
                            field.activityId = value.id;
                            value.fields.push(field);
                            value.edit=true;
                        }
                    }
                    if(obj.target.attributes.data.value==="remove"){
                        var foundIndex = undefined;
                        angular.forEach(value.fields,function(Fvalue,Findex){
                            if(Fvalue.id===field.id){
                                foundIndex = Findex;
                            }
                        });
                        value.fields.splice(foundIndex,1);
                        value.edit=true;
                    }
                }
            });
            angular.forEach($scope.fields,function(value,index){
                if(value.id===$scope.workingActivity.id){
                    if(obj.target.attributes.data.value==="add"){
                        field.fieldName = field.name;
                        value.childFields.push(field);
                        value.edit=true;
                    }
                    if(obj.target.attributes.data.value==="remove"){
                        var foundIndex = undefined;
                        angular.forEach(value.childFields,function(Fvalue,Findex){
                            if(Fvalue.id===field.id){
                                foundIndex = Findex;
                            }
                        });
                        value.childFields.splice(foundIndex,1);
                        value.edit=true;
                    }
                }
            });
        };
        $scope.toggleFieldsLabel = function(obj,activity){
            angular.forEach($scope.activities,function(value,index){
                if(value.id!=activity.id){
                    $scope.activities[index].openCloseDrawerControls = false;
                } else if (value.id===activity.id){
                    console.log(obj.target.attributes.data.value)
                    if(obj.target.attributes.data.value==='open'){
                        activity.openCloseDrawerControls = true;
                    }
                    if(obj.target.attributes.data.value==='close'){
                        activity.openCloseDrawerControls = false;
                    }
                }
            })
        };
        $scope.addNewField = function(field){
            console.log(field)
            $scope.hideNewField=!$scope.hideNewField;
            if(!$scope.hideNewField){
                var newData = {
                    edit:true,
                    hide:true,
                    hideRow:true,
                    childFields:[]
                };
                if(field){
                    newData.canBeAutomated = field.canBeAutomated;
                    newData.categoryId = field.categoryId;
                    newData.categoryName = field.categoryName;
                    newData.childFields = field.childFields;
                    newData.fieldDataType = field.fieldDataType;
                    newData.fieldDataTypeId = field.fieldDataTypeId;
                    newData.childFields = field.childFields;
                    newData.instructions = field.instructions;
                    newData.isMasterField = field.isMasterField;
                    newData.listId = field.listId;
                }
                $scope.newFieldID++;
                newData.id = $scope.newFieldID;
                $scope.newData.field = newData;
                $scope.fields.push(newData);
            }
        };
        $scope.addNewActivity = function(activity){
            $scope.hideNewActivity=!$scope.hideNewActivity;
            if(!$scope.hideNewActivity){
                var newData = {
                    edit:true,
                    hide:true,
                    hideRow:true,
                    fields:[]
                };
                if(activity){
                    newData.category = activity.category;
                    newData.fields = activity.fields;
                    newData.departmentId = activity.departmentId;
                    newData.isMasterActivity = activity.isMasterActivity
                }
                $scope.newActivityID++;
                newData.id = $scope.newActivityID;
                $scope.newData.activity = newData;
                $scope.activities.push(newData);
            }
        };
        $scope.clearWorkingActivity = function(activity){
            if(!activity){
                $scope.workingActivity = activity;
                angular.forEach($scope.activities,function(value,index){
                    value.openCloseDrawerControls = false;
                })
            } else if(activity){
                if (activity.isMasterActivity!=true){
                }
            }
            var allClosed = true;
            angular.forEach($scope.activities,function(value,index){
                if(value.hide===false){
                    allClosed = false;
                }
            });
            if(allClosed===true){
                angular.forEach($scope.activities,function(value,index){
                   if($scope.workingActivity===value.id){
                       value.openCloseDrawerControls=false;
                   }
                });
                $scope.workingActivity=undefined;
            };
        };
        $scope.undoChanges = function(activity){
            angular.forEach($scope.restore.activities,function(value,key){
                if(value.id===activity.id){
                    httpService.getData('Data/Activity/',activity.id).then(function(response){
                        activity.fields = response.data.fields;
                        console.log($scope.workingActivity)
                        console.log(response.data)
                        $scope.workingActivity.fields = response.data.fields;
                        angular.forEach($scope.fields,function(value,index){
                            value.showIncluded = false;
                            console.log(response.data);
                            angular.forEach(response.data.fields,function(Fvalue,Findex){
                                if(Fvalue.id===value.id){
                                    value.showIncluded = true;
                                }
                            });
                        });
                    },function errorCallback(response){
                        console.log(response)
                    })
                }
            })
        };
        console.log($scope)
    })
    .controller('planController',function($scope,httpService){

    })
    .controller('patientController',function($scope,httpService,moment,$window,$timeout){
        $scope.patient = {
            mrn:123456,
            field:"abcdfe"
        };
        $scope.formElements = [
            {name:"Date of Evaluation",type:"text"},
        {name:"NEUT%",type:"text"},
        {name:"Lymph%",type:"text"},
        {name:"Mono%",type:"text"},
        {name:"Eos%",type:"text"},
        {name:"Baso%",type:"text"},
        {name:"IGRE%",type:"text"},
        {name:"NEUT ABS (K/uL)",type:"text"},
        {name:"LYMPH ABS (K/uL)",type:"text"},
        {name:"MONO ABS (K/uL)",type:"text"},
        {name:"EOS ABS (K/uL)",type:"text"},
        {name:"BASO ABS (K/uL)",type:"text"},
        {name:"IG ABS (K/uL)",type:"text"},
        {name:"WBC (K/uL)",type:"text"},
        {name:"RBC (M/uL)",type:"text"},
        {name:"HGB (gm/dl)",type:"text"},
        {name:"HCT (%)",type:"text"},
        {name:"MCV (fL)",type:"text"},
        {name:"MCH (pg)",type:"text"},
        {name:"MCHC (gm/dl)",type:"text"},
        {name:"RDWSD (fL)",type:"text"},
        {name:"RDWCV (%)",type:"text"},
        {name:"Platelet (K/uL)",type:"text"},
        {name:"MPV (fL)",type:"text"},
        {name:"INRBC (%)",type:"text"},
        {name:"Collected Elsewhere",type:"text"}
        ];
        $scope.protocols = [
            {id:"20012-1236"},
            {id:"20012-1236"},
            {id:"20012-1236"},
            {id:"20012-1236"},
            {id:"20012-1236"},
            {id:"20012-1236"},
            {id:"20012-1236"},
            {id:"20012-1236"}
        ];
        $scope.types = [
            {id:"123",name:"Core",title:"Toggle Core",icon:"fa-diamond",action:"function1",data:"data1"},
            {id:"123",name:"MRN",title:"Toggle MRN",icon:"fa-eye",action:"function2",data:"data2"},
            {id:"132",name:"SponsorSubjectId",title:"Toggle SponsorSubjectId",icon:"fa-crosshairs",action:"function3",data:"data3"}
        ];
        $scope.function1 = function(data){
            console.log(data)
        };
        $scope.random = function(x){
            var number = Math.floor((Math.random() * 100*x) + 1);
            return number;
        };
        $scope.generateTimepoints = function(x){
            var timePointsArray = [];
            for(i=0;i<$scope.random(x);i++){
                var point = {};
                point.numer = i;
                timePointsArray.push(point)
            }
            return timePointsArray;
        };
        $scope.makeTime = function(){
            var theTime = moment().format('L');
            return theTime;
        };
        $scope.availHeight = window.outerHeight;
        $scope.timePoints = $scope.generateTimepoints(10);
        $scope.dataRows = $scope.generateTimepoints(7);
        $scope.number = $scope.random();
        $scope.search;
        $scope.select;
        $scope.timePointsWidth = 91;
        $scope.gridPos = {
            left:0,
            right:0
        };
        $scope.hideNew = false;
        $scope.revealHide = function(){
            $scope.hideNew=!$scope.hideNew;
            console.log('open')
        }
        $scope.fooElement = document.getElementById('scrollMe');
        $scope.fooElement2 = document.getElementById('timePointsHeader');
        $scope.grid = document.getElementById('scrollGrid');
        $scope.foo = 'relative'
        $scope.fixMe = function(){
            console.log('bar')
            return $scope.foo
        }
        angular.element($scope.fooElement).bind("scroll",function(){
            $scope.fooElement2.left=$scope.gridPos.left;
        })
        angular.element($scope.fooElement2).bind("scroll",function(){
            var docLeft = $("#timePointsHeader").scrollLeft()-3;
            var docTop = $("#timePointsHeader").scrollTop();
            if ($scope.gridPos.left !== docLeft){
                $scope.startScroll(docLeft,docTop)
            }
            $timeout.cancel(timer);
            var timer = $timeout(function(){
                $scope.stopScroll(docLeft,docTop);
            },100);
        });
        $scope.startScroll = function(left,top){
            $('.dataRows li:first-child').css('position','absolute')
            $('.dataRows li:first-child').css('top',top)
        };
        $scope.stopScroll = function(left,top){
            $('.dataRows li:first-child').css('position','relative')
             $('.dataRows li:first-child').css('top',top);
        };
        $('html').addClass('hideOverflow')
        $(function(){
            $("#scrollMe").scroll(function(){
                $("#timePointsHeader")
                    .scrollLeft($("#scrollMe").scrollLeft());
            });
            $("#timePointsHeader").scroll(function(){
                $("#scrollMe")
                    .scrollLeft($("#timePointsHeader").scrollLeft());
            });
        });
        console.log($scope)

    })
    .controller('protocolController',function($scope,httpService){

    })
    .controller('requestaccountController',function($scope,httpService){

    })
    .directive('navigation', function ($route,logoutService,trackPageAccess,httpService,$location,localStorageService) {
        return {
            restrict: 'E',
            templateUrl: 'templates/components/navigation.html',
            link: function ($scope,scope, $element, $attrs) {
                httpService.checkAuthLogOut();
                $scope.location = $location.$$path;
                $scope.open = false;
                $scope.userInfo = {}
                $scope.welcomeButton = function(){
                    $scope.open = !$scope.open;
                };
                $scope.routesArray = [];
                $scope.logOut = function(){
                    logoutService.logout()
                };
                $scope.loggedIn = httpService.checkCookie('ARC_UserToken')!='';

                angular.forEach($route.routes, function (value, key) {
                    value.url = "#" + value.originalPath;
                    if (value.name != undefined) {
                        $scope.routesArray.push(value)
                    }
                });

                $scope.$location = location;
                $scope.$on("$routeChangeSuccess",function(event,current,previous){
                    $scope.loggedIn = httpService.checkCookie('ARC_UserToken')!='';
                    trackPageAccess.postData();
                    httpService.getUser().then(function(response){
                        $scope.userInfo = response.data;
                        function submit(key, val) {
                            return localStorageService.set(key, val);
                        }
                        submit('userName',$scope.userInfo.fullName);
                        submit('userId',$scope.userInfo.id);
                        submit('departmentId',$scope.userInfo.departmentId);
                        submit('departmentNiceName',$scope.userInfo.departmentNiceName);
                    },function errorCallback(response){
                        // console.log(response)
                    });
                    $scope.open = false;
                });
            }
        };
    })
    .service('logoutService',function($cookies,$location){
        var logoutWorker = {}
        logoutWorker.logout = function(){
            console.log('logging out now');
            $cookies.put('ARC_UserToken','')
            $location.path('/login')
            return;
        };
        return logoutWorker;
    })
    .service('httpService', function ($http,$cookies,logoutService){
        var httpWorker = {};
        httpWorker.getSomething = function(){
            if(httpWorker.checkCookie('ARC_UserToken')!=null){
                httpWorker.reqSpecs.headers.ARC_UserToken=httpWorker.checkCookie('ARC_UserToken');
                httpWorker.checkAuthLogOut();
                return $http({
                    method:'GET',
                    url:httpWorker.apiRoot.getPath()+'/Data/Fields',
                    headers:httpWorker.reqSpecs.headers
                })
            } else {
                logoutService.logout()
            }
        };
        httpWorker.getUser = function(){
            return httpWorker.getData('User/',httpWorker.checkCookie('ARC_UserToken'))
        };
        httpWorker.postData = function(path1,data){
            if(httpWorker.checkCookie('ARC_UserToken')!=null){
                httpWorker.reqSpecs.headers.ARC_UserToken=httpWorker.checkCookie('ARC_UserToken');
                httpWorker.checkAuthLogOut();
                return $http({
                    method:'POST',
                    url:httpWorker.apiRoot.getPath()+path1,
                    data:data,
                    headers:httpWorker.reqSpecs.headers
                })
            } else {
                // console.log('not logged in');
                logoutService.logout()
            }
        };
        httpWorker.putData = function(path1,param,data){
            param = param?param:'';
            //path2 = path2?path2:'';
            if(httpWorker.checkCookie('ARC_UserToken')!=null){
                httpWorker.reqSpecs.headers.ARC_UserToken=httpWorker.checkCookie('ARC_UserToken');
                httpWorker.checkAuthLogOut();
                return $http({
                    method:'PUT',
                    url:httpWorker.apiRoot.getPath()+path1+param,
                    data:data,
                    headers:httpWorker.reqSpecs.headers
                })
            } else {
                // console.log('not logged in');
                logoutService.logout()
            }
        };
        httpWorker.getData = function(path1,param,path2){
            param = param?param:'';
            path2 = path2?path2:'';
            if(httpWorker.checkCookie('ARC_UserToken')!=null){
                httpWorker.reqSpecs.headers.ARC_UserToken=httpWorker.checkCookie('ARC_UserToken');
                httpWorker.checkAuthLogOut();
                return $http({
                    method:'GET',
                    url:httpWorker.apiRoot.getPath()+path1+param+path2,
                    headers:httpWorker.reqSpecs.headers
                })
            } else {
                // console.log('not logged in');
                logoutService.logout()
            }
        };
        httpWorker.deleteData = function(path1,param,path2){
            param = param?param:'';
            path2 = path2?path2:'';
            if(httpWorker.checkCookie('ARC_UserToken')!=null){
                httpWorker.reqSpecs.headers.ARC_UserToken=httpWorker.checkCookie('ARC_UserToken');
                httpWorker.checkAuthLogOut();
                return $http({
                    method:'DELETE',
                    url:httpWorker.apiRoot.getPath()+path1+param+path2,
                    headers:httpWorker.reqSpecs.headers
                })
            } else {
                // console.log('not logged in');
                logoutService.logout()
            }
        };
        httpWorker.checkAuthLogOut = function(){
            httpWorker.getAuth(httpWorker.checkCookie('ARC_UserToken')).then(function(response){
                if(response.data!=true){
                    console.log('not logged in');
                    logoutService.logout()
                }

            },function errorCallback(response){
                console.log(response)
            });
        };
        httpWorker.getAuth = function(myCookie){
            return $http({
                    method:'GET',
                    url:httpWorker.apiRoot.getPath()+'Authorize/' + myCookie,
                    headers:httpWorker.reqSpecs.headers
                }
            )
        };
        httpWorker.checkCookie = function(token){
            return $cookies.get(token)
        };
        httpWorker.getLogin = function(user){
            return $http({
                url:httpWorker.apiRoot.getPath()+'/Authorize/login/'+user.userName+'/'+user.password,
                method:'GET',
                headers:''
            })
        };
        httpWorker.apiRoot = {
            //set setState as dev, prod, or local
            setState:'dev',
            prod: 'https://prometheus.mdanderson.edu/dataapi/',
            dev: 'https://gumedonc-dev.mdanderson.edu/dataapi/',
            local: 'http://localhost:56700/',
            prodRoot: 'https://prometheus.mdanderson.edu',
            devRoot: 'https://gumedonc-dev.mdanderson.edu',
            localRoot: 'http://localhost:56700',
            getPath: function(){
                var thePath = httpWorker.apiRoot.local;

                return thePath;
            }
        };
        httpWorker.reqSpecs = {
            method:'',
            url:'',
            headers:{
                'content-type':'application/json',
                'cache-control':'no-cache',
                //'Cookie':'',
                'ARC_UserToken':'',
                'ArcAppPublicKey':'371507A2-C5FB-4842-9AD5-477BA3A33A68',
                //private key for app
                'ArcAppPrivateKey':'a48ddc36-dd81-49b6-95fe-dbaaa6a272ac'
            }
        };
        return httpWorker;
    })
    .service('trackPageAccess',function($window,$http){
        var trackingWorker = {};
        var trackingObject = {
            path : window.location.href,
            width : $window.window.innerWidth,
            height : $window.window.innerHeight
        };
        trackingWorker.postData = function(){
            console.log(trackingObject)
            return $http({
                data:{URL:trackingObject.path,height:trackingObject.height,width:trackingObject.width},
                method:'POST',
                url:'/Prometheus/Administration/Tracking/TrackPageAccess'
            })
        };
        return trackingWorker;
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'templates/home.html',
                controller: 'homeController',
                icon:'fa-home'
            })
            .when('/configure', {
                templateUrl: 'templates/configure.html',
                controller: 'configureController',
                icon:'fa-cogs',
                name: 'Configure',
                menu:'main'
            })
            // .when('/plan', {
            //     templateUrl: 'templates/plan.html',
            //     controller: 'planController',
            //     icon:'fa-file-text',
            //     name: 'Plan',
            //     menu:'main'
            // })
            .when('/patient', {
                templateUrl: 'templates/patient.html',
                controller: 'patientController',
                icon:'fa-users',
                name: 'Patient',
                menu:'main'
            })
            .when('/requestaccount', {
                templateUrl: 'templates/requestaccount.html',
                controller: 'requestaccountController',
                icon:'fa-share-alt'
            })
            .when('/protocol', {
                templateUrl: 'templates/protocol.html',
                controller: 'protocolController',
                icon:'fa-share-alt',
                name: 'Protocol',
                menu:'main'
            })
            .when('/login', {
                templateUrl: 'templates/login.html',
                controller: 'loginController',
                icon:''
            })
            .otherwise({
                redirectTo: '/login'
            })
    })
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('data')
            .setNotify(true, true)
    });
