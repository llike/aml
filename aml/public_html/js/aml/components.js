/* 
 Created on : 2016-02-20, 15:29:37
 Author     : Łukasz Wróbel
 License     : MIT
 */

(function () {
    angular.module('ml.components', [
	'ml.components.button'
	, 'ml.components.table'
	, 'ml.components.loadingCircular'
    ]);
})();


(function () {
    /**
     * @name material.components.button
     * @description
     */
    angular.module('ml.components.button', [])
	.directive('mlButton', mlButtonDirective);

    function mlButtonDirective($timeout) {
	return {
	    restrict: 'EA'
	    , replace: true
	    , transclude: true
	    , template: getTemplate
	    , link: getLink
	};


	// Returns template for directive
	function getTemplate(element, attr) {
	    return '<button class="ml-button" ng-transclude></button>';
	}

	// Link function 
	function getLink(scope, element, attr) {
	}
    }
})();

(function () {
    /**
     * @name material.components.loadingCircular
     * @description
     */
    angular.module('ml.components.loadingCircular', [])
	.directive('mlLoadingCircular', mlLoadingCircularDirective);

    function mlLoadingCircularDirective() {
	return {
	    restrict: 'EA'
	    , replace: true
	    , template: getTemplate
	    , link: getLink
	};


	// Returns template for directive
	function getTemplate(element, attr) {
	    return '<img src="./js/aml/img/ring.svg" class="ml-loading-circular">';
	}

	// Link function 
	function getLink(scope, element, attr) {
	}
    }
})();

(function () {
    /**
     * @name material.components.button
     * @description
     */
    angular.module('ml.components.table', [])
	.directive('mlTable', mlTableDirective);

    function mlTableDirective() {
	return {
	    restrict: 'E'
	    , replace: true
	    , link: getLink
	    , template: getTemplate
	    , scope: {
		
		/*
		 * mlHeaders example:
		 * [
		 *  {
		 *	value: 'First name' // STRING
		 *	, field: 'first_name' // STRING
		 *	, type: 'string' // STRING, possible values: 'string', 'number'
		 *	, classess: ['ml-center', 'ml-red'] || (function(element){}) // ARRAY of classes names OR FUNCTION
		 *  }
		 * ]
		 */
		mlHeaders: '=' // Array with columns to display from mlData
		
		    /**
		     * mlActions example:
		     * [
		     *  {
		     *	iconSrc: '/img/eg.svg'		// STRING - img src TODO: Implement icons
		     *	, multipleDisplay: true		// BOOLEAN - display if multiple rows are selected
		     *	, fn: function($index, row){}	// FUNCTION (CALLBACK) - where row is row from mlData
		     *  }
		     * ]
		     */
		, mlActions: '=' // Array with actions for row
		
		    /**
		     * mlDeleteAction example:
		     *  {
		     *	iconSrc: '/img/eg.svg'		// STRING - img src TODO: Implement icons
		     *	, multipleDisplay: true		// BOOLEAN - display if multiple rows are selected
		     *	, fn: function($index, callback){}// FUNCTION - returns index of element to delete. Important callback must have implemented two args (err, data)
		     *  }
		     */
		, mlDeleteAction: '=' // Array with actions for row
		, mlTitle: '@' // STRING - table title
		, mlData: '=' // Array data
	    }
	};

	// Returns template for directive
	function getTemplate(element, attr) {
	    return '<table class="ml-table">\n\
			<thead>\n\
			<tr ng-if="mlTitle">\n\
			    <th class="ml-title" colspan="{{::mlHeaders.length + 1}}">\n\
			    {{mlTitle}}\n\
			    </th>\n\
			</tr>\n\
			<tr>\n\
			    <th colspan="{{::mlHeaders.length + 1}}">\n\
				<span ng-show="selectedItems" class="ml-fl-left">Selected: {{selectedItems}}</span>\n\
				\n\
				<span class="ml-fl-right">\n\
				    <ml-button	ng-repeat="action in mlActions" \n\
						ng-if="selectedItems && ((!action.multipleDisplay && selectedItems === 1) || (action.multipleDisplay && selectedItems > 0))"\n\
						ng-click="prepareAction(action)">{{::action.iconSrc}}</ml-button>\n\
				    \n\
				    <ml-button	ng-if="mlDeleteAction && selectedItems && ((!mlDeleteAction.multipleDisplay && selectedItems === 1) || (mlDeleteAction.multipleDisplay && selectedItems > 0))"\n\
						ng-click="performDeleteAction()">{{::mlDeleteAction.iconSrc}}</ml-button>\n\
				</span>\n\
			    </th>\n\
			</tr>\n\
			<tr>\n\
			    <th><input type="checkbox" ng-model="checkAll" /></th>\n\
			    <th ng-repeat="header in mlHeaders" ng-click="order.perform(header)" class="ml-tbl-header">\n\
				{{header.value}}\n\
				<span class="ml-order" ng-show="order.predicate === header.field" ng-class="{\'ml-reverse\':order.reverse}"></span>\n\
			    </th>\n\
			</tr>\n\
			</thead>\n\
			<tbody>\n\
			<tr ng-repeat="($indexRow, row) in mlData | orderBy:order.predicate:order.reverse">\n\
			    <td>\n\
				<input type="checkbox" ng-model="row.checked" ng-click="handleCheckboxClick(row)" />\n\
			    </td>\n\
			    <td ng-repeat="header in mlHeaders" class="{{::prepareClasses(header, row[header.field])}} ">{{getCellValue(header, row[header.field])}}</td>\n\
			</tr>\n\
			</tbody>\n\
			<tfoot></tfoot>\n\
		    </table>';
	}

	// Link function 
	function getLink(scope, element, attr) {

	    // Flags
	    scope.checkAll = false;

	    // Selected items counter
	    scope.selectedItems = 0;

	    scope.checked = {};

	    /**
	     * Prepares cell class
	     * @param {Object} header - header element from mlHeaders
	     * @returns {String}
	     */
	    scope.prepareClasses = function prepareClasses(header, elementValue) {
		return checkType(header) + ' ' + // Returns class for type
		    ((header.classes instanceof Array) ? header.classes.join(' ') // If classes is array
			: (typeof header.classes === 'function') ? header.classes(elementValue) : ''); // Otherwise check if class is function
	    };
	    
	    /**
	     * 
	     * @param {type} action - element from mlActions
	     * @returns {undefined}
	     */
	    scope.prepareAction = function (action) {
		var checkedIndexes = []
		    , i;

		checkedIndexes = getIndexesFromWhere(scope.mlData, 'value', true);

		// Send checked Object for easy unselect, and prepared array with row indexes
		action.fn(checkedIndexes);
	    };

	    /**
	     * 
	     * @returns {undefined}
	     */
	    scope.performDeleteAction = function performDeleteAction() {
		var indexes = []
		    , i;

		indexes = getIndexesFromWhere(scope.mlData, 'checked', true);

		// Sort out array
		indexes.sort(function (a, b) {
		    return b - a;
		});

		// Send checked Object for easy unselect, and prepared array with row indexes
		for (i in  indexes) {
		    // Uncheck
		    scope.mlData[indexes[i]].value = false;
		    // Perform delete
		    scope.mlDeleteAction.fn(indexes[i], function (err, data) {
			if(err)
			    return ;
			
			// If success then decrement selection counter
			scope.selectedItems--;
		    });
		}
	    };
	    
	    scope.order = {
		predicate: 'ss'
		, reverse : false
		, perform : function order_perform(header) {
		    this.reverse = (this.predicate === header.field) ? !this.reverse : false;
		    this.predicate = header.field;
		}
	    };
	    
//	    scope.sortTable = function sortTable(header) {
//		console.log(header);
//	    };

	    scope.issetActions = function issetActions() {
		return scope.mlActions instanceof Array && scope.mlActions.length;
	    };

	    /**
	     * Returns cell value
	     * @param {type} header
	     * @param {type} elementValue
	     * @returns {String}
	     */
	    scope.getCellValue = function getCellValue(header, elementValue) {
		if (!header.cellValue)
		    return elementValue;
		return (typeof header.cellValue === 'function') ? header.cellValue(elementValue) : '';
	    };

	    /**
	     * Handles check box click
	     * @param {type} $index
	     * @param {type} value - checkbox value
	     * @returns {undefined}
	     */
	    scope.handleCheckboxClick = function handleCheckboxClick(row) {
		row.checked ? scope.selectedItems++ : scope.selectedItems--;
	    };

	    // Watches
	    scope.$watch('checkAll', function (newVal, oldVal) {
		var i;

		// Set counter
		scope.selectedItems = newVal ? scope.mlData.length : 0;

		// Select all
		for (i in scope.mlData) 
		    scope.mlData[i].checked = newVal;
	    });

	    // Private functions\
	    function checkType(header) {
		switch (header.type) {
		    case 'string':
			return 'mlt-string';
		    case 'number':
			return 'mlt-number';
		    default :
			return '';
		}
	    }

	    function getIndexesFromWhere(from, where, equals) {
		var outArray = []
		    , i;

		for (i in from)
		    if (from[i][where] === equals)
			outArray.push(i);

		return outArray;
	    }
	}
    }
})();