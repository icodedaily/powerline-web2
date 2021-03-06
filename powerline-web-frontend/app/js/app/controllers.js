/**
 * Initialize controller module
 */

angular.module('app.controllers', [
  'app.filters',
  'app.services',
  'ngRoute'
]).run(function ($cacheFactory, $rootScope, $ngBootbox, navigateTo, groupsInvites, announcements, $window, $location, $q, invites, follows, socialActivity) {
  var isMenuClosed = true;
  var isFirstHomeLoaded = true;
  $rootScope.navigateTo = navigateTo;
  $rootScope.getActiveClass = function (a, b) {
    return a === b ? 'active' : '';
  };
  $rootScope.invalidClass = function (isInvalid) {
    return isInvalid ? 'invalid' : '';
  };
  $rootScope.back = function () {
    $window.history.back();
  };
  $rootScope.openSystem = function (link) {
    $window.open(link, '_system', 'location=yes');
  };
  $cacheFactory('discussionController', {capacity: 5});
  $cacheFactory('petitionController', {capacity: 5});
  $cacheFactory('groupProfileController', {capacity: 5});
  var searchCache = $cacheFactory('searchController', {capacity: 2});

  $rootScope.$on('home.activities-reloaded', function () {
    groupsInvites.load();
    announcements.updateNumberOfNew();
    if (isFirstHomeLoaded) {
      invites.load();
      announcements.load();
      follows.load();
    }
    isFirstHomeLoaded = false;
  });

  $rootScope.path = function (path) {
    return $location.path(path);
  };

  $rootScope.isMenuClosed = function () {
    return isMenuClosed;
  };
  $rootScope.menuToggle = function () {
    isMenuClosed = !isMenuClosed;
  };
  $rootScope.closeMenu = function () {
    isMenuClosed = true;
  };

  $rootScope.openTag = function (tag) {
    searchCache.put('query', tag);
    searchCache.put('data', null);
    $rootScope.path('/search');
  };

  $rootScope.execApply = function () {
    if ($rootScope.$$phase !== '$apply' && $rootScope.$$phase !== '$digest') {
      $rootScope.$apply();
    }
  };

  $rootScope.alert = function () {

    $ngBootbox.alert(arguments[0]);
    /*
    btnLabels = arguments[3]?arguments[3].split(","):null;

    $ngBootbox.alert('An important message!')
    .then(function() {
        console.log('Alert closed');
    });

    var options = {
        message: arguments[0]?arguments[0]:null,
        title: arguments[2]?arguments[2]:null,
        className: 'test-class',
        buttons: {
             warning: {
                 label: btnLabels[0],
                 className: "btn-warning",
                 callback: function() { return; }
             },
             success: {
                 label: btnLabels[1],
                 className: "btn-success",
                 callback: arguments[1]?arguments[1](1):null
             }
        }
    };

    $ngBootbox.customDialog(options);
    */
  };

  $rootScope.confirmAction = function (message, title, buttonLabels) {
    var deferred = $q.defer();
    $window.navigator.notification.confirm(message, function (btn) {
      if (1 === btn) {
        deferred.resolve(btn);
      } else {
        deferred.reject(btn);
      }
      $rootScope.execApply();
    }, title, buttonLabels);
    return deferred.promise;
  };

  $rootScope.confirm = function () {
    //$window.navigator.notification.confirm.apply(null, arguments);

    btnLabels = arguments[3]?arguments[3].split(","):['OK','Cancel'];

    var options = {
        message: arguments[0],
        title: arguments[2] || 'title',
        className: 'test-class',
        buttons: {
             warning: {
                 label: btnLabels[0],
                 className: "btn-warning",
                 callback: function() { return; }
             },
             success: {
                 label: btnLabels[1],
                 className: "btn-success",
                 callback: arguments[1](1)
             }
        }
    };

    $ngBootbox.customDialog(options);
  };

}).value('loaded', function (scope, callback) {
  return function () {
    scope.loading = false;
    if (_.isFunction(callback)) {
      callback.apply(this, arguments);
    }
  };
});