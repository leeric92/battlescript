angular.module('battlescript.collab', [])

.controller('CollabController', function ($scope) {

  $scope.init = function(){
      //// Initialize Firebase.
      var firepadRef = getExampleRef();
      // TODO: Replace above line with:
      // var firepadRef = new Firebase('<YOUR FIREBASE URL>');
      // var firepadRef = new Firebase('https://battlescript.firebaseio.com/');

      //// Create ACE
      var editor = ace.edit("firepad-container");
      editor.setTheme("ace/theme/terminal");
      var session = editor.getSession();
      session.setUseWrapMode(true);
      session.setUseWorker(false);
      session.setMode("ace/mode/javascript");

      var userId = Math.floor(Math.random() * 9999999999).toString();

      //// Create Firepad.
      var firepad = Firepad.fromACE(firepadRef, editor, {
        defaultText: '// JavaScript Editing with Firepad!\nfunction go() {\n  var message = "Hello, world.";\n  console.log(message);\n}', userId: userId
      });

      var firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'),
          document.getElementById('userlist'), userId);
  };

  // Helper to get hash from end of URL or generate a random one.
  $scope.getExampleRef = function() {
      var ref = new Firebase('https://battlescript.firebaseio.com/');
      var hash = window.location.hash.replace(/#/g, '');
      if (hash) {
        ref = ref.child(hash);
      } else {
        ref = ref.push(); // generate unique location.
        window.location = window.location + '#' + ref.key(); // add it as a hash to the URL.
      }
      if (typeof console !== 'undefined')
        console.log('Firebase data: ', ref.toString());
      return ref;
  }

});




