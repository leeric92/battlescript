angular.module('battlescript.services', [])

////////////////////////////////////////////////////////////
// Auth factory
// 
// This takes care of all things auth related:
// 
// - user sign in
// - user sign up
// - user is authenticated
// - user logged out
////////////////////////////////////////////////////////////

.factory('Auth', function ($http, $location, $window) {
  
  // signs users in
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      // Saving a global username to be used throughout app
      $window.localStorage.setItem('username', resp.config.data.username);
      return resp.data.token;
    });
  };

  // signs users up
  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      // Saving a global username to be used throughout app
      $window.localStorage.setItem('username', resp.config.data.username);
      return resp.data.token;
    });
  };

  // helper to check if users are authorized
  var isAuth = function () {
    return !!$window.localStorage.getItem('battlepro');
  };

  // signs out users
  var signout = function (user) {
    $window.localStorage.setItem('username', undefined);
    $window.localStorage.removeItem('battlepro');
    $location.path('/signin');

    console.log('this is user!!!', user)
    console.log('inside signout factory')
    
    return $http({
      method: 'POST',
      url: '/api/users/signout',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });

  };

  // return all funcs as an obj
  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
})

////////////////////////////////////////////////////////////
// Users factory
// 
// Handles all things to do with users:
// 
// - fetching the currently logged in user
// - fetching online users
// - fetching all users
////////////////////////////////////////////////////////////

.factory('Users', function($http) {

  // gets the currently logged in user
  var getAuthUser = function() {
    return window.localStorage.getItem('username');
  };

  // gets all the users
  var getUsers = function(){
    // return $http({
    //   method: 'GET',
    //   url: '/api/users/getusers'
    // })
    // .then(function(res) {
    //   return res.data;
    // });
  };

  // gets only the online users
  var getOnlineUsers = function(){
    return $http({
      method: 'GET',
      url: '/api/users/getOnlineUsers'
    })
    .then(function(res) {
      return res.data;
    });
  };

  return {
    getAuthUser: getAuthUser,
    getUsers : getUsers,
    getOnlineUsers: getOnlineUsers
  };

})

////////////////////////////////////////////////////////////
// Sockets factory
// 
// A set of reusable functions to handle socket connections
// inside various controllers
////////////////////////////////////////////////////////////

.factory('Socket', function() {

  // creates a new socket base on the passed in params. Params
  // is an array of relationships, where each relationship is a
  // key pair value in string format
  var createSocket = function(route, params) {
    console.log('attempt to create');
    var query = params.join('&');

    //////////////////////////////////////////
    //HAVE TO CHANGE THIS TO GET HEROKU TO WORK
    //////////////////////////////////////////

    return io.connect('enigmatic-eyrie-6604.herokuapp.com/#/' + route, {
      query: query,
      'force new connection': true
    });
  };

  return {
    createSocket: createSocket
  }
})

////////////////////////////////////////////////////////////
// Notifications factory
// 
// A set of reusable functions to handle user notifications
// throughout the app
////////////////////////////////////////////////////////////

.factory('Notifications', function() {
  
})

////////////////////////////////////////////////////////////
// Dashboard factory
// 
// Handles all things on the user dashboard. Might be
// factored out depending on the state of the Users 
// factory
////////////////////////////////////////////////////////////

.factory('Dashboard',function ($http){


  return {};
})

////////////////////////////////////////////////////////////
// Battle factory
// 
// Handles all things to do when users engage in a battle
// against each other:
// 
// - get battle, gets a battle from the api
// - attempt battle, for when users attempt a solution
// - submit battle, for when a user wants to submit a 
//   final solution for a battle
////////////////////////////////////////////////////////////

.factory('Battle', function($http) {

  // checks if valid battle room
  var isValidBattleRoom = function(hash) {
    return $http({
      method: 'POST',
      url: '/api/battles/checkvalidbattleroom',
      data: {hash: hash}
    }).then(function(res) {
      return res.data;
    });
  };

  // gets a battle
  var getBattle = function() {
    return $http({
      method: 'GET',
      url: '/api/duels/getduel',
    }).then(function(res) {
      return res.data;
    });
  };

  // attempts a battle
  var attemptBattle = function(projectId, solutionId, code) {
    return $http({
      method: 'POST',
      url: '/api/duels/attemptduel',
      data: {
        code: code,
        projectId: projectId,
        solutionId: solutionId
      }
    }).then(function(res) {
      return res.data;
    });
  };

  return {
    isValidBattleRoom: isValidBattleRoom,
    getBattle: getBattle,
    attemptBattle: attemptBattle
  }
});
