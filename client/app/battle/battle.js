angular.module('battlescript.battle', [])

.controller('BattleController', function($scope, $timeout, Battle){
  $scope.playerOne = window.localStorage.getItem('username');
  $scope.playerTwo = "Waiting for 2nd player"

  ////////////////////////////////////////////////////////////
  // stuff to handle the waiting on both opponents
  ////////////////////////////////////////////////////////////
  
  // initial battle wait time when two users enter battle room
  $scope.battleWaitTime = 300000;

  // updates the battle wait time
  $scope.updateBattleWaitTime = function() {
    if ($scope.battleWaitTime === 0) {
      // we've timed out, need to do something...
    } else {
      $timeout(function() {
        $scope.battleWaitTime = $scope.battleWaitTime - 1000;
        $scope.updateBattleWaitTime();
      }, 1000);
    }
  };

  // call func immediately
  $scope.updateBattleWaitTime();


  ////////////////////////////////////////////////////////////
  // handle when both users are ready
  ////////////////////////////////////////////////////////////
  
  $scope.userReadyState = false;
  $scope.userReadyClass = '';
  $scope.userReadyText = 'Waiting on you...';

  $scope.updateUserReadyState = function() {
    if ($scope.userReadyState === false) {
      $scope.userReadyState = true;
      $scope.userReadyClass = 'active';
      $scope.userReadyText = 'Ready for battle!';
    }
  };

  $scope.opponentReadyState = false;
  $scope.opponentReadyClass = '';
  $scope.opponentReadyText = 'Waiting on opponent...';

  $scope.updateOpponentReadyState = function() {
    if ($scope.opponentReadyState === false) {
      $scope.opponentReadyState = true;
      $scope.opponentReadyClass = 'active';
      $scope.opponentReadyText = 'Ready for battle!';
    }
  };


  ////////////////////////////////////////////////////////////
  // battle logistics
  ////////////////////////////////////////////////////////////

  // first, cache some vars
  $scope.battle;
  $scope.battleDescription = null;
  $scope.battleProjectId = null;
  $scope.battleSolutionId = null;

  // fetch a battle
  $scope.getBattle = function() {
    console.log('getting');
    Battle.getBattle()
      .then(function(data) {
        $scope.battle = JSON.parse(data.body);
        $scope.battleDescription = $scope.battle.description;

        $scope.battleProjectId = $scope.battle.session.projectId;
        $scope.battleSolutionId = $scope.battle.session.solutionId;
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  // var socket = io.connect('http://localhost:8000');
  var socket = io('//enigmatic-eyrie-6604.herokuapp.com/#/battle',{query: "username=" + $scope.playerOne});

  // Initializes the editors
  var editor1 = ace.edit("editor1");
  editor1.setTheme("ace/theme/monokai");
  editor1.getSession().setMode("ace/mode/javascript");

  var editor2 = ace.edit("editor2");
  editor2.setTheme("ace/theme/monokai");
  editor2.getSession().setMode("ace/mode/javascript");
  editor2.setReadOnly(true);

  editor1.getSession().on('change', function(e) {
    //console.log(editor1.getValue());
    socket.emit('textChange', editor1.getValue());
  });

  socket.emit('updateUsers');
  socket.on('userList', function(userArray){
    // THIS WILL ONLY WORK FOR TWO USERS RIGHT NOW
    // loop over array looking for other users
    if (userArray.length === 1){
      $scope.playerTwo = "Waiting for 2nd player";
    }
    userArray.forEach(function(name){
      if(name !== $scope.playerOne){
        $scope.playerTwo = name;    
        $scope.$apply();
      }
    });
    // set other user to player2 variable
    // if only one user, don't change player 2
  });

  socket.on('updateEnemy', function(text){
    editor2.setValue(text);
    editor2.clearSelection();
  });

  // What this does is when someone goes on a different page, it disconnects the "user"
  // So, it emits the event disconnect user
  $scope.$on('$routeChangeStart', logout);

  // This does the same, for refresh. Now go to socket handler for more info
  window.onbeforeunload = function(e) {
    logout();
  };
  
  // Logout on back button
  window.addEventListener("hashchange", logout)

  var logout = function(){
    socket.emit('updateUsers');
    socket.emit('disconnectedClient', {username: $scope.playerOne});
  }


});
