/* 
 Created on : 2016-02-20, 15:29:37
 Author     : Łukasz Wróbel
 License     : MIT
 */

(function () {
    angular.module('testServices', [])
	.service('personsService', ['$q', '$timeout'
		, function ($q, $timeout) {
		    // Private vars
		    var _this = this;

		    // Public API ====================
		    this.model = {
			all: []
		    };

		    this.getAll = function () {
			// Simulation asyncronous request
			return $q(function (resolve, reject) {
			    $timeout(function () {
				// Check if global var persons exists
				if (persons)
				    resolve({status: 200, data: persons});
				else
				    reject('Cannot get data.');
			    }, 100);
			});
		    };

		    this.remove = function remove($index, callback) {
			_this.model.all.splice($index, 1);


			// Success
			if (typeof callback === 'function')
			    callback(null, true);


			// Failure:
//			callback(null);
		    };

		    this.init = function init(callback) {
			// Initial promises
			var promises = [];

			// Add to promises
			promises.push(
			    this.getAll()
			    .then(function (res) {
				if (res.status === 200) {
				    _this.model.all = res.data;
				    return runCallback(callback, null, res);
				}

				// Error
				return runCallback(callback, res);
			    }, function (res) {

				console.log('Error');

				// Error
				return runCallback(callback, res);

			    }));
			    
			return $q.all(promises);
		    };

		    // Private ====================
		    function runCallback(callbackFn, err, data) {
			return typeof callbackFn === 'function' ? callbackFn(err, data) : null;
		    }

		}]);
})();