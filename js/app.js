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
    .controller('configureController',function($timeout,$scope,httpService,localStorageService,moment,buildFormService){
        function getItem(key) {
            return localStorageService.get(key);
        }
        $scope.enableFeature = {
            addActivity : false,
            copyActivity:true,
            sortActivities:false,
            addField : true,
            copyField:true,
            //TODO enable drag sort
            dragFieldSort:false,
            activityPreview:true
        };
        $scope.makeTime = {
            time:moment().format('L')
        };
        $scope.fieldCategories = [];
        var newFieldField = {
            name:'',
            description:'',
            ordinal:0
        };
        $scope.newField = {
            fields:[]
        };
        httpService.getData('Data/Field/Categories').then(function(response){
            $scope.fieldCategories = response.data;
            var leadOption = {
                id:'00000000-0000-0000-0000-000000000000',
                name:'NA'
            };
            $scope.fieldCategories.push(leadOption)
        },function errorCallback(response){});
        $scope.availHeight = window.outerHeight;
        $scope.addMoreFields = function(){
            // var copyField = angular.copy(newFieldField)
            $scope.newField.fields.push(angular.copy(newFieldField));
            newFieldField.ordinal +=1;
        };
        $scope.submitNewList = function(){
            var postData = {
                Name:$scope.newField.name,
                ListItems:[]
            };
            angular.forEach($scope.newField.fields,function(value,index){
                console.log(value)
                var listObject = {
                    Name:value.name,
                    Description:value.description,
                    Ordinal:value.ordinal
                };
                postData.ListItems.push(listObject)
            })
            console.log(postData)
          httpService.postData('List',postData).then(function(response){
              getListList();
          },function errorCallback(response){})

        };
        $scope.addMoreFields();
        var recipient = 'Erica';
        $scope.makeTacos = function(recipient){
            var tacos = function(){
                var taco;
                var tacosIngredients = {
                    shell:'flour tortilla',
                    cheese:'cheddar',
                    meat:['bacon','eggs'],
                    potatos:'potatoes',
                    salsa:'tobasco'
                };
                angular.forEach(tacosIngredients,function(value,index){
                    taco += value;
                });
                // deliverTo(recipient)
                return taco;
            }
        }
        $scope.newFormHeight = 100;
        $scope.previewFormElements = [];
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
        $scope.listList = [];
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
        $scope.addNewList=true;
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
            console.log(form)
            console.log($scope.newData.activity);
            console.log(form.$valid)
            if(form.$valid){
                angular.forEach($scope.activities,function(value,index){
                    if(value.id===$scope.newData.activity.id){
                        value.hide=false;
                        value.hideRow=false;
                        value.edit=false;
                        $timeout(function(){value.hide=true},1000);
                    }
                });
                angular.forEach($scope.newData.activity.fields,function(value,index){
                    value.ordinal = index;
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
                $scope.clearNewActivity(form);
                console.log(form)
                form.$setPristine();
                form.$setUntouched();
console.log(postData)
                httpService.postData('Data/Activity/',postData).then(function(response){
                    console.log(response)
                },function errorCallabck(response){
                    console.log(response)
                })
            } else {
                console.log('dirty')
                form.$setDirty();
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
                value.headMessage='Edited Data must be submitted!';
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
        function getListList() {
            httpService.getData('List/All').then(function (response) {
                $scope.listList = response.data;
                var leadOption = {
                    id: 'new',
                    name: 'Add new'
                };
                $scope.listList.push(leadOption)
            }, function errorCallback(response) {
            });
        }
        getListList();
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
            activity.headMessage='Sending updated Activity data';
            console.log(activity);
            var putData = {
                "fields":[],
                "Id": activity.id,
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
                   fieldName:value.name,
                   ordinal:index
               }
                putData.fields.push(fieldData);
            });
            console.log(putData)
            //ready to PUT postData
            httpService.putData('Data/Activity/',activity.id,putData).then(function(response){
                activity.headMessage='Activity updated successfully';
                var timer = $timeout(function(){
                    activity.edit=false;
                    activity.headMessage='Edited Data must be submitted!';
                },300);
                $scope.showDrawerClose();
                $scope.clearWorkingActivity();
                // $scope.toggleFieldsLabel($event,items);
            },function errorCallback(response){

            })
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
            $scope.hideFieldSearch = true;
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
            // console.log(activity.fields)
            $scope.workingActivity = activity;
            $scope.hideDrawer = false;
            $scope.addFieldstoActivityTitle = activity.name;
            angular.forEach($scope.fields,function(value,index){
                // console.log(value)
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
            $scope.addNewList=true;
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
                        // $scope.hideDrawer = true;
                        if($scope.workingActivity)
                        $scope.workingActivity.fields = response.data.fields;
                        angular.forEach($scope.fields,function(value,index){
                            console.log(value)
                            value.showIncluded = false;
                            angular.forEach(response.data.fields,function(Fvalue,Findex){
                                console.log(Fvalue)
                                if(Fvalue.fieldId===value.fieldId){
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
        $scope.formBuilder;
        $scope.showPreview = function(activity){
            // $scope.hideNewActivity=!$scope.hideNewActivity;
            $scope.addNewList=false;
            $scope.previewFormElements = [];

            if(activity){
                angular.forEach(activity.fields,function(value,index){
                    if(value.fieldDataType){
                    }else {
                        angular.forEach($scope.fields,function(Fvalue,Findex){
                            if(value.fieldId===Fvalue.id){
                                value.instructions=Fvalue.instructions;
                                value.fieldDataTypeId=Fvalue.fieldDataTypeId;
                                value.fieldDataType=Fvalue.fieldDataType;
                                value.listId=Fvalue.listId;
                                value.fieldParentId=Fvalue.fieldParentId;
                                value.isMasterField=Fvalue.isMasterField;
                                value.canBeAutomated=Fvalue.canBeAutomated;
                                value.categoryId=Fvalue.categoryId;
                                value.categoryName=Fvalue.categoryName;
                                value.createdById=Fvalue.createdById;
                                value.createdDate=Fvalue.createdDate;
                                value.modifiedById=Fvalue.modifiedById;
                                value.modifiedDate=Fvalue.modifiedDate;
                            }
                        });
                    }
                    value.formElements = buildFormService.getFormType(value)
                });
                $scope.hideNewActivity=false;
                $scope.previewFormElements=activity;
                var formLineHeight = 90;
                var minformHeight = $scope.previewFormElements.fields.length*formLineHeight<=60?100:$scope.previewFormElements.fields.length*formLineHeight;
                $scope.newFormHeight = $scope.previewFormElements.fields.length*formLineHeight<=window.outerHeight?minformHeight:window.outerHeight;
                var childHeight;
                angular.forEach($scope.previewFormElements.fields,function(Pvalue,Pindex){
                    if(Pvalue.childFields){
                        angular.forEach(Pvalue.childFields,function(Cvalue,Cindex){
                            $scope.newFormHeight += formLineHeight;
                        })
                    }
                });
                $scope.oldHeight = angular.copy($scope.newFormHeight);
                $scope.newFormHeight = $scope.newFormHeight>window.outerHeight?window.outerHeight*.8:$scope.newFormHeight;
            } else{
                $scope.addNewList=false;
                $scope.hideNewActivity=true;
            }
        };
        console.log($scope)
    })
    .controller('planController',function($scope,httpService){

    })
    .controller('patientController',function($scope,httpService,moment,$window,$timeout,localStorageService,buildFormService){
        function getItem(key) {
            return localStorageService.get(key);
        }
        $scope.patient = {
            mrn:123456,
            field:"abcdfe"
        };
        $scope.fields = [];
        $scope.toggleReportView = false;
        $scope.workingActivity;
        $scope.hideFieldSearch = true;
        $scope.showDrawerClose = function(){
            $scope.hideDrawer=true;
            $scope.searchFields = undefined;
            $scope.hideFieldSearch = true;

        };
        $scope.closeDrawerSymbol = 'fa-times-circle';
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
        $scope.enableFeature = {
            copyActivity: true
        };
        $scope.reportRequestObject =
        $scope.hideDrawer = true;
        $scope.submitModel = {};
        $scope.userId = getItem('userId');
        $scope.userName = getItem('userName');
        $scope.activeProtocol = '2014-0386';
        $scope.floatyActive = false;
        $scope.patientIDType;
        $scope.activityStatus = [
            {id:'complete',name:'Complete',color:'green',icon:'fa-circle'},
            {id:'completewithvariance',name:'Complete with Variance',color:'yellow',icon:'fa-circle'},
            {id:'notcomplete',name:'Not Complete',color:'red',icon:'fa-circle'},
            {id:'pending',name:'Pending',color:'orange',icon:'fa-circle'},
            {id:'awaitingreview',name:'Awaiting Review',color:'black',icon:'fa-binoculars'},
            {id:'notspecified',name:'Not Specified',color:'silver',icon:'fa-circle'}
        ];
        $scope.protocols = [
            {id:"1",name:"Fetching Protocol list",icon:"foo"}
        ];
        httpService.getData('User/',$scope.userId,'/Protocols').then(function(response){
            $scope.protocols = response.data;
        },function errorCallback(response){
            console.log(response)
        });
        $scope.formElements = [
            {fieldName:"Date of Evaluation",type:"text"},
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
        $scope.types = [
            {id:"AccNo",name:"Session #",title:"Search by Session #",icon:"fa-heartbeat",action:"selectType",data:"data1"},
            {id:"MRN",name:"MRN",title:"Search by MRN",icon:"fa-medkit",action:"selectType",data:"data2"},
            {id:"SponsorSubjectId",name:"SponsorSubjectId",title:"Search by SponsorSubjectId",icon:"fa-crosshairs",action:"selectType",data:"data3"}
        ];
        $scope.selectType = function(data){
            angular.forEach($scope.types,function(value,index){
                value.selected=false;
            });
            data.selected=true;
            $scope.patientIDType = data.id;
        };
        $scope.timeData = {};
        $scope.patientData;
        $scope.launchReporting = function() {
            $scope.hideDrawer = false;
            httpService.getData('Data/Fields').then(function (response) {
                $scope.fields = [];
                angular.forEach(response.data, function (value, key) {
                    value.fieldName = value.name;
                    value.fieldId = value.id;
                    value.hide = true;
                    value.edit = false;
                    value.showIncluded = false;
                    value.block = false;
                    $scope.fields.push(value);
                });
            }, function errorCallBack(response) {
            });
            if(!$scope.patientData)
                $scope.submitSearch();
        };
        $scope.generateReport = function(){
            $scope.toggleReportView = true;
            $scope.hideDrawer=true;
            var reportData = {
                patientId:$scope.patientData.id,
                protocol:$scope.activeProtocol,
                List:[]
            };
            angular.forEach($scope.reportFieldsArray,function(value,index){
                reportData.List.push(value.id)
            });
            var postPath = 'Data/Patient/'+reportData.patientId+'/Protocol/'+reportData.protocol+'/Report';
            httpService.postData(postPath,reportData.List).then(function(response){
                $scope.timeData.fieldsReport = response.data;
                $scope.timeData.reportsGrid = [];
                angular.forEach($scope.timeData.timePointsColumnHeaders, function (value, index) {
                    var tempValue = {};
                    tempValue.head = value;
                    tempValue.valueArray = [];
                    angular.forEach($scope.timeData.fieldsReport, function (Fvalue, Findex) {
                        tempRow = {};
                        tempRow.value = false;
                        tempRow.active=false;
                        angular.forEach(Fvalue.patientFieldDataGroups,function(Gvalue,Gindex){
                            if(value.id===Gvalue.patientTimePointId){
                                tempRow.timePointName = $scope.timeData.timePointsColumnHeaders[index].fullName;
                                tempRow.fieldName=Fvalue.fieldName;
                                tempRow.fieldId=Fvalue.fieldId;
                                tempRow.patientId=Fvalue.patientId;
                                tempRow.value=Gvalue.value;
                            }
                        });
                        tempValue.valueArray.push(tempRow);
                    });
                    $scope.timeData.reportsGrid.push(tempValue)
                })
            },function errorCallback(){

            })

            };
        $scope.submitSearch = function(){
            $scope.toggleReportView = false;

            httpService.getData('data/patient','?protocol='+$scope.activeProtocol+'&selector='+$scope.patientIDType+'&selectorValue='+$scope.search).then(function(response){
                $scope.patientData={
                  id:response.data.id,
                    intId:response.data.intId,
                    mrn:response.data.mrn,
                    firstName:response.data.firstName,
                    middleName:response.data.middleName,
                    lastName:response.data.lastName,
                    dob:response.data.dob,
                    name:response.data.name
                };
                $scope.timePoints=response.data.patientTimePoints;
                $scope.timeData.timePointsColumnHeaders = response.data.patientTimePoints;
                $scope.timeData.activityRowHeaders = response.data.protocolActivities;
                $scope.timeData.patientData = response.data.patientDataGroup;
                $scope.timeData.dataGrid = [];


                angular.forEach($scope.timeData.timePointsColumnHeaders,function(value,index){
                    var tempValue = {};
                    tempValue.head = value;
                    tempValue.valueArray = [];

                    angular.forEach($scope.timeData.activityRowHeaders,function(Rvalue,Rindex){
                        tempRow = {};
                        tempRow.value = false;
                        tempRow.active=false;
                        angular.forEach($scope.timeData.patientData,function(Dvalue,Dindex){
                            if(Dvalue.patientTimePointId===$scope.timeData.timePointsColumnHeaders[index].id&&Dvalue.activityId===$scope.timeData.activityRowHeaders[Rindex].id)
                            {
                                tempRow.timePointName = $scope.timeData.timePointsColumnHeaders[index].fullName;
                                tempRow.activityId = Dvalue.activityId;
                                tempRow.patientActivityId = Dvalue.patientActivityId;
                                tempRow.value = true;
                                tempRow.status = Dvalue.status;
                                tempRow.required = Dvalue.isRequired;
                                angular.forEach($scope.activityStatus, function(Svalue,Sindex){
                                    if(Svalue.name.toLowerCase()===tempRow.status.toLowerCase()){
                                        tempRow.icon=Svalue.icon;
                                        tempRow.color=Svalue.color;
                                    }
                                })
                            }
                        });
                        tempValue.valueArray.push(tempRow);
                    });
                    $scope.timeData.dataGrid.push(tempValue)
                })

            },function errorCallback(response){

            })
        };
        $scope.postData = function(){
            console.log($scope.previewFormElements);
            console.log($scope.formElements);
            angular.forEach($scope.formElements.fields,function(value,index){
                value.value = value.formElements.fieldArray[0].value;
            });
            console.log()
            var data = {

            };
            switch ($scope.formElements.color){
                case 'green':
                    httpService.putData().then(function(response){

                    },function errorCallback(response){

                    });

                    break;
                case 'orange':
                    httpService.postData().then(function(response){

                    },function errorCallback(response){

                    });

                    break;
                case 'grey':
                    httpService.postData().then(function(response){

                    },function errorCallback(response){

                    });

                    break;
                default:
            }



        };
        $scope.putData = function(activity){

        };
        $scope.showFieldSearch = function(){
            $scope.hideFieldSearch = false;
        };
        $scope.closeFieldsSearch = function(){
            // if(!$scope.searchFields)
            $scope.hideFieldSearch = true;
            $scope.searchFields = undefined;
        };
        $scope.addThisFieldToActivity = function(obj,field){
            $scope.reportFieldsArray = [];
            angular.forEach($scope.fields,function(value,index){
                if(value.id===field.id){
                    if(obj.target.attributes.data.value==="add"){
                        field.fieldName = field.name;
                    }
                    if(obj.target.attributes.data.value==="remove"){
                        var foundIndex = undefined;
                        angular.forEach(value.childFields,function(Fvalue,Findex){
                            if(Fvalue.id===field.id){
                                foundIndex = Findex;
                            }
                        });
                    }
                }
                if(value.showIncluded===true){
                    $scope.reportFieldsArray.push(value);
                }
            });
        };

        $scope.makeTime = function(){
            var theTime = moment().format('L');
            return theTime;
        };
        $scope.availHeight = window.outerHeight;
        $scope.newFormHeight = 60;
        $scope.search;
        $scope.select;
        $scope.timePointsWidth = 91;
        $scope.gridPos = {
            left:0,
            right:0
        };
        $scope.hideNew = false;
        $scope.previewFormElements;
        $scope.revealHide = function(activity){
            $scope.formElements;
            $scope.previewFormElements = {
                fieldsMessage:'fetching fields...'
            };
            if(activity){
                activity.fieldsMessage= $scope.previewFormElements.fieldsMessage;
                $scope.formElements = activity;
                $scope.previewFormElements = activity;
                var pathVar=activity.patientActivityId!='00000000-0000-0000-0000-000000000000'?'/Data/Patient/PatientActivity/':'/Data/Patient/PatientActivity/Activity/';
                var idVar=activity.patientActivityId!='00000000-0000-0000-0000-000000000000'?activity.patientActivityId:activity.activityId;
                  //this condition could be removed once the PUT is implemented
                // if(!activity.fields)
                    httpService.getData(pathVar,idVar).then(function(response){
                        if(response.data.fields.length>0){
                            activity.fields=response.data.fields;
                            angular.forEach(activity.fields,function(value,index){
                                value.label=value.fieldName;
                                value.name=value.fieldName;
                                value.childFields = value.children;
                                // console.log(value)
                                angular.forEach(value.childFields,function(Cvalue,Cindex){
                                    Cvalue.label = Cvalue.fieldName;
                                    Cvalue.name = Cvalue.fieldName
                                });
                                if(value.fieldDataType){
                                }else {
                                    angular.forEach($scope.fields,function(Fvalue,Findex){
                                        if(value.fieldId===Fvalue.id){
                                            value.instructions=Fvalue.instructions;
                                            value.fieldDataTypeId=Fvalue.fieldDataTypeId;
                                            value.fieldDataType=Fvalue.fieldDataType;
                                            value.listId=Fvalue.listId;
                                            value.fieldParentId=Fvalue.fieldParentId;
                                            value.isMasterField=Fvalue.isMasterField;
                                            value.canBeAutomated=Fvalue.canBeAutomated;
                                            value.categoryId=Fvalue.categoryId;
                                            value.categoryName=Fvalue.categoryName;
                                            value.createdById=Fvalue.createdById;
                                            value.createdDate=Fvalue.createdDate;
                                            value.modifiedById=Fvalue.modifiedById;
                                            value.modifiedDate=Fvalue.modifiedDate;
                                        }
                                    });
                                }
                                value.formElements = buildFormService.getFormType(value)
                            });
                        } else {
                            $scope.previewFormElements.fieldsMessage = 'No Fields returned';
                        }
                        $scope.getPreviewHeight();
                    },function errorCallback(response){
                    });
                $scope.hideNew = true;
            } else {
                $scope.previewFormElements.fields=undefined;
                $scope.previewFormElements.fieldsMessage = 'No Fields returned';
                $scope.hideNew = false;
                $scope.loop($scope.callbackRemoveActive);
            }
        };
        $scope.getPreviewHeight = function(){
            var formLineHeight = 90;
            if($scope.previewFormElements.fields){
                var minformHeight = $scope.previewFormElements.fields.length*formLineHeight<=60?100:$scope.previewFormElements.fields.length*formLineHeight;
                $scope.newFormHeight = $scope.previewFormElements.fields.length*formLineHeight<=window.outerHeight?minformHeight:window.outerHeight;
                var childHeight;
                // console.log($scope.previewFormElements.fields)
                angular.forEach($scope.previewFormElements.fields,function(Pvalue,Pindex){
                    if(Pvalue.children.length>0){
                        angular.forEach(Pvalue.children,function(Cvalue,Cindex){
                            $scope.newFormHeight += formLineHeight;
                        })
                    }
                });
            }
            $scope.oldHeight = angular.copy($scope.newFormHeight);
            $scope.newFormHeight = $scope.newFormHeight>window.outerHeight?window.outerHeight*.8:$scope.newFormHeight;
        };
        $scope.rowActive = function(row){
            $scope.loop($scope.callbackRemoveActive);
            row.active=true;
        };
        $scope.callbackRemoveActive = function(value){
            value.active=false;
    };
        $scope.loop = function(callback){
            angular.forEach($scope.timeData.dataGrid,function(value,index){

                angular.forEach($scope.timeData.dataGrid[index].valueArray,function(Rvalue,Rindex) {
                    callback(Rvalue)
                })
            })
        };
        $scope.fixMe = function(){
            console.log('bar')
            return $scope.foo
        };


        $('html').addClass('hideOverflow');
        $(function(){
            $('#scrollMe1').scroll(function(){
                console.log('scroll')
                $('#timePointsHeader1')
                    .scrollLeft($('#scrollMe1').scrollLeft());

                $('#timePointsHeader2')
                    .scrollLeft($('#scrollMe1').scrollLeft());
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
                    // value.url = "#" + value.originalPath;
                    value.url = "#!" + value.originalPath;
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
    .service('buildFormService',function(httpService){
        var typeWorker = {};
        typeWorker.getFormType = function(field){
            var fieldObject = {}
            // fieldObject.fieldDataType = field.fieldDataType.toLowerCase();
            fieldObject.fieldArray = [];
            // console.log(field)
            switch(field.fieldDataType.toLowerCase()){
                case 'list':
                    fieldObject.fieldArray[0] = {
                        value:field.value?field.value:'',
                        cat:'select',
                        type:'select',
                        options:[]
                    };
                    httpService.getData('/list/all').then(function(response){
                        fieldObject.fieldArray[0].options = response.data;
                    },function errorCallback(response){
                    });
                    break;
                case 'yes/no':
                    fieldObject.fieldArray[0] = {
                        value:field.value?field.value:'',
                        cat:'radio',
                        type:'radio',
                        placeholder:'',
                        options:[{id:'yes',name:'yes'},{id:'no',name:'no'}]
                    };
                    break;
                case 'datetime':
                    if(field.value||moment(field.value,"YYYY-MM-DD")._isValid)
                        if (typeof field.value === 'string')
                        field.value = field.value.split('/')[2]+'-'+field.value.split('/')[0]+'-'+field.value.split('/')[1];
                    field.value = moment(field.value,"YYYY-MM-DD");
                    fieldObject.fieldArray[0] = {
                        value:field.value?field.value._i:'',
                        cat:'text',
                        placeholder:'date',
                        type:'date'
                    };
                    break;
                case 'float':
                    fieldObject.fieldArray[0] = {
                        value:field.value?parseInt(field.value):'',
                        cat:'text',
                        placeholder:'float',
                        type:'number'
                    };
                    break;
                case 'int':
                    fieldObject.fieldArray[0] = {
                        value:field.value?parseInt(field.value):'',
                        cat:'text',
                        placeholder:'int',
                        type:'number'
                    };
                    break;
                case 'group':
                    fieldObject.fieldArray[0] = {
                        value:field.value?field.value:'',
                        cat:'text',
                        placeholder:'',
                        type:'hidden',
                        children:typeWorker.loopChildFields(field.childFields,typeWorker.getFormType)
                    };
                    break;
                case 'boolean':
                    fieldObject.fieldArray[0] = {
                        value:field.value?field.value:'',
                        cat:'boolean',
                        type:'checkbox'
                    };
                    break;
                case 'labvalue':
                    fieldObject.fieldArray[0] = {
                        value:field.value?parseInt(field.value):'',
                        label:'value',
                        placeholder:'int',
                        cat:'labvalue',
                        type:'number'
                    };
                    fieldObject.fieldArray[1] = {
                        value:field.value?field.value:'',
                        label:'unit',
                        placeholder:'text',
                        cat:'labvalue',
                        type:'text'
                    };
                    fieldObject.fieldArray[2] = {
                        value:field.value?field.value:'',
                        label:'range',
                        placeholder:'number range',
                        cat:'labvalue',
                        type:'text',
                        minMax:[0,10]
                    };
                    break;
                case 'string':
                    fieldObject.fieldArray[0] = {
                        value:field.value?field.value:'',
                        cat:'text',
                        type:'text'
                    };
                    break;
                default:
            }

            fieldObject.fieldArray[0].label = field.label||field.name||field.fieldName;
            fieldObject.fieldArray[0].name = field.name||field.fieldName;
            return fieldObject;
        };
        typeWorker.somethingCallback=function(field){
            typeworker.getFormType(field)
        };
        typeWorker.loopChildFields=function(children,callBack){
            var childFormObject = {}
            childFormObject.forms = [];
            angular.forEach(children,function(value,index){
                childFormObject.forms.push(callBack(value))
            })
            return childFormObject;
        };
        return typeWorker;
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
