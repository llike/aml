/* 
 Created on : 2016-02-20, 15:29:37
 Author     : Łukasz Wróbel
 License     : MIT
 */

(function () {
    angular.module('testControllers', [])
	.controller('appController', ['$scope', 'personsService'
		, function ($scope, personsService) {

		    $scope.flags = {
			init: false
		    };


		    // Persons
		    $scope.persons = personsService.model;

		    // Describes persons table
		    $scope.personsHeaders = [
			{
			    value: 'First name'
			    , field: 'first_name'
			    , type: 'string'
			}, {
			    value: 'Last name'
			    , field: 'last_name'
			    , type: 'string'
//			    , classes: ['ml-center', 'xxxx']
			}, {
			    value: 'SEX'
			    , field: 'gender'
			    , type: 'string'
			    , classes: function (elementValue) {
				return elementValue === 'Female' ? 'ml-center ml-bg-gray' : 'ml-center ';
			    }
			    , cellValue: function (elementValue) {
				if (!elementValue)
				    return '';
				return elementValue === 'Male' ? 'M' : 'F';
			    }
			}, {
			    value: 'E-mail'
			    , field: 'email'
			    , type: 'string'
			}, {
			    value: 'Country'
			    , field: 'country'
			    , type: 'string'
			}, {
			    value: 'Company'
			    , field: 'company'
			    , type: 'string'
			}
		    ];

		    $scope.deleteAction = {
			iconSrc: 'Delete'
			, multipleDisplay: true
			, fn: personsService.remove
		    };

		    $scope.personsActions = [
			{
			    iconSrc: 'Archive'
			    , multipleDisplay: false
			    , fn: function () {
				alert('Not implemented.');
			    }
//			}
			}
		    ];

		    function init() {
			// Set init flag
			$scope.flags.init = true;
			personsService.init()
			    .then(function (res) {
				// Init process end, unset init flag
				$scope.flags.init = false;
			    }, function (res) {
				// Errors occurred, unset init flag
				$scope.flags.init = false;
			    });
		    }

		    init();
		}]);
})();