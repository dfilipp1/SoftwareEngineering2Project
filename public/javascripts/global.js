


// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the user table on initial page load
  populateTable();

  // Username link click
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

  // Add User button click
  $('#modal').on('click', '#btnAddUser' , addUser);

  // Search button click
  $('#btnSearch').on('click', rePopulateTable);
  
  // Delete User link click
  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
  
});

// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/users', function( data ) {

    // Stick our user data array into a userlist variable in the global object
    userListData = data;

    // For each item in our JSON, add a table row and cells to the contenyt str
    $.each(data, function() {
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</td>';
      tableContent += '<td>' + this.age + '</td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td>' + this.phone + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">Delete</a></td>'
    });

    // Inject the whole content string into our existing HTML table
    $('#userList table tbody').html(tableContent);
  });
};

function rePopulateTable(event) {

  event.preventDefault();

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/users', function( data ) {

    // Stick our user data array into a userlist variable in the global object
    userListData = data;

    // For each item in our JSON, add a table row and cells to the contenyt str
    $.each(data, function() {
      if($('#txtSearch').val() === ""  || this.username === $('#txtSearch').val()){
        tableContent += '<tr>';
        tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</td>';
        tableContent += '<td>' + this.age + '</td>';
        tableContent += '<td>' + this.email + '</td>';
        tableContent += '<td>' + this.phone + '</td>';
        tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
      }
    });

    // Inject the whole content string into our existing HTML table
    $('#userList table tbody').html(tableContent);
  });
};

// Show User Info
function showUserInfo(event) {

  // Prevent Link from Firing
  event.preventDefault();
  
  // Retrieve username from link rel attribute
  var thisUserName = $(this).attr('rel');

  // Get Index of object based on id value
  var arrayPosition = userListData.map(function(arrayItem) {return arrayItem.username;}).indexOf(thisUserName);

  // Get our User Object
  var thisUserObject = userListData[arrayPosition];

  //Populate Info Box
  $('#userInfoPic').html("<img src='" + thisUserObject.url + "'>");
  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoEmail').text(thisUserObject.email);
  $('#userInfoPhone').text(thisUserObject.phone);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoGender').text(thisUserObject.gender);
  $('#userInfoLocation').text(thisUserObject.location);
  $('#userInfoHobbies').text(thisUserObject.hobbies);
  $('#userInfoOccupation').text(thisUserObject.occupation);
};

//Add User
function addUser(event) {
  event.preventDefault();

  //Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addUser input').each(function(index, val) {
    if($(this).val() === '') {errorCount++;}
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {
    
    //If it is, compile all user info into one object
    var newUser = {
      'username': $('#addUser form input#inputUserName').val(),
      'password':$('#addUser form input#inputUserPassword').val(),
      'securityQuestion': $('#addUser form input#inputUserSecurityQuestion').val(),
      'securityQuestionAnswer': $('#addUser form input#inputUserSecurityQuestionAnswer').val(),
      'fullname': $('#addUser form input#inputUserFullname').val(),
      'url': $('#addUser form input#inputUserPicture').val(),
      'email': $('#addUser form input#inputUserEmail').val(),
      'phone': $('#addUser form input#inputUserPhone').val(),
      'age': $('#addUser form input#inputUserAge').val(),
      'location': $('#addUser form input#inputUserLocation').val(),
      'gender': $('#addUser form input#inputUserGender').val(),
      'occupation': $('#addUser form input#inputUserOccupation').val(),
      'hobbies': $('#addUser form input#inputUserHobbies').val()
    }

    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/adduser',
      dataType: 'JSON'
    }).done(function(response) {
      
      // Check for successful (blank) response
      if(response.msg === '') {
        
        //Clear the form inputs
        $('#addUser fieldset input').val('');
        
        //Update the table
        populateTable();
  
        //Fixs issue #6 
        $('.ng-modal-overlay').click();

      }
      else {
        //If something goes wrong, alert the error messag that our service returned
        alert('Error: '+response.msg);
      }
    });
  }
  else {
    //If errorCount is more then 0, error out
    alert('Please fill in all fields');
    return false;
  }
};

// Delete User
function deleteUser(event) {

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this user?');

  // Check and make sure the user confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/deleteuser/' + $(this).attr('rel')
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      // Update the table
      populateTable();

    });

  }
  else {

    // If they said no to the confirm, do nothing
    return false;

  }

};

function loginUser(event){
  event.preventDefault();
};

function switchLoginAdd(event){
  event.preventDefault();

};

//this is the function that should display the security question associated with the username
function getSecurityQuestion(event){

  // Empty content string
  var tableContent = '';
  var bool = 0;
  
  // jQuery AJAX call for JSON
  $.getJSON( '/users', function( data ) {

    // Stick our user data array into a userlist variable in the global object
    userListData = data;

    // For each item in our JSON, add a table row and cells to the contenyt str
    $.each(data, function() {
      if($('#inputUserName').val() === this.username){  
        tableContent = this.securityQuestion;    
		bool = 1;
      }
      else{
        if (bool === 0){
        tableContent = 'That username does not exist';
        }
      }
    });
    //Inject the whole content string into our existing HTML table
    $('#securityQuestion').html(tableContent); 
  });
};

// this function checks to see if the security question was answered correctly
function checkIfPasswordCorrect(event){

  // Empty content string
  var tableContent = '';
  var bool = 0;

  // jQuery AJAX call for JSON
  $.getJSON( '/users', function( data ) {

    // Stick our user data array into a userlist variable in the global object
    userListData = data;

    // For each item in our JSON, add a table row and cells to the contenyt str
    $.each(data, function() {
      if($('#inputUserName').val() === this.username && $('#inputSecurityAnswer').val() === this.securityQuestionAnswer){	
          tableContent = 'Correct';	
          bool = 1;		  
      }
      else{
          if (bool === 0){
            tableContent = 'Incorrect';
          }
      }
    }); 
    // Inject the whole content string into our existing HTML table
    $('#check').html(tableContent); 
  });
};

// this function resets the password
function resetPassword(event){
  
  //event.preventDefault();
  
  // Empty content string
  var tableContent = '';
  
  // jQuery AJAX call for JSON
  $.getJSON( '/users', function( data ) {

    // Stick our user data array into a userlist variable in the global object
    var userListData = data;
    
	console.log('Is this actually being called?');
	console.log(userListData);
	
    // For each item in our JSON, add a table row and cells to the content str
    $.each(data, function() {
      if($('#inputUserName').val() === this.username && $('#inputSecurityAnswer').val() === this.securityQuestionAnswer){
          console.log(this.username);
          $.ajax({
          type: 'PUT',
          url: '/updateuser',
		  data: {id: this._id, newPassword: $('#newPassword').val()}
          })
          tableContent = 'Password Reset';
      }
    }); 
    // Inject the whole content string into our existing HTML table
    $('display').html(tableContent); 
  });
};


