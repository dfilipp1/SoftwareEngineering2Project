
app = angular.module('LoginApp', []);
app.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  };
});

function stageController($scope) {

    $scope.username1 = 'Peter Parker';
    $scope.email1 = 'pparker@gmail.com';
	$scope.inputUserPassword = 'password';
	
    $scope.submitForm = function () {
        console.info("Here I should implement the logic to send a request to the server.");
    }

}

app.directive('passwordValidate', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {

                scope.pwdValidLength = (viewValue && viewValue.length >= 8 ? 'valid' : undefined);
                scope.pwdHasLetter = (viewValue && /[A-z]/.test(viewValue)) ? 'valid' : undefined;
                scope.pwdHasNumber = (viewValue && /\d/.test(viewValue)) ? 'valid' : undefined;

                if(scope.pwdValidLength && scope.pwdHasLetter && scope.pwdHasNumber) {
                    ctrl.$setValidity('pwd', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('pwd', false);                    
                    return undefined;
                }

            });
        }
    };
});

app.directive('pwCheck', [function () {
                return {
                    require: 'ngModel',
                    link: function (scope, elem, attrs, ctrl) {

						var me = attrs.ngModel;
						var matchTo = attrs.pwCheck;

						scope.$watch('[me, matchTo]', function(value){
							ctrl.$setValidity('pwmatch', scope[me] === scope[matchTo] );
						});

                    }
                }
            }]);

app.controller('MyCtrl', ['$scope', function($scope) {
  $scope.modalShown = false;
  $scope.viewType = "Login Koala Bear";
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };
  $scope.switchViews = function(){
    if($scope.viewType === "Login Koala Bear") {
      $scope.viewType = 'Add Koala Bear';
    }
    else if($scope.viewType === "Add Koala Bear"){
      $scope.viewType = "Login Koala Bear";
    }
  };
  $scope.switchViews2 = function(){
    if($scope.viewType === "Login Koala Bear") {
      $scope.viewType = "Reset Password";
    }
	else if($scope.viewType === "Reset Password"){
      $scope.viewType = "Login Koala Bear";
    }
  };  
}]);