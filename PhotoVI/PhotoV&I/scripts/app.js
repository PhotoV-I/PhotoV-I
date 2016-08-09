
const kinveyAppID = 'kid_HycsO3rF';
const kinveyAppSecret = 'd0c21de73cd04b95aa68f4f48ad6ce66';
const kinveyAppMasterSecret = "3b22a7bf51264d209af567ee79d4becc";
const kinveyServiceBaseUrl = 'https://baas.kinvey.com/';


function showView(viewId) {
    $('main > section').hide();

    $("#" + viewId).show();
}

function showHideNavigationLinks() {
    let loggedIn = sessionStorage.authtoken != null;
    if (loggedIn){
        $("#linkAddPhoto").show();
        $("#linkRegister").hide();
        $("#linkLogin").hide();
        $("#linkLogout").show();
        $("#linkProfile").show();
    } else {
        $("#linkAddPhoto").hide();
        $("#linkRegister").show();
        $("#linkLogin").show();
        $("#linkLogout").hide();
        $("#linkProfile").hide();
    }
}

function showHomeView() {
    showView('viewHome');
}

function login() {
    let loginUrl = kinveyServiceBaseUrl + "user/" + kinveyAppID + "/login";
    let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppID + ":" + kinveyAppSecret)};
    let loginData = {
        username: $("#loginUserName").val(),
        password: $("#loginPassword").val()
    };
    let username = $("#loginUserName").val();
    //let password = $("#loginPassword").val();
    //if (username.length < 1 || password.length < 1) { //TODO: To be or not :)
        $.ajax({
            method: "POST",
            url: loginUrl,
            data: loginData,
            headers: kinveyAuthHeaders,
            success: loginSuccess,
            error: showAjaxError()
        });
        function loginSuccess(data, status) {
            sessionStorage.authtoken = data._kmd.authtoken;
            showHideNavigationLinks();
            showHomeView();
            showInfo("Welcome " + username);
        }
    //} else{
        //showError("Please, enter user name and password!");
    //}
    //isAdmin(username);
}

function isAdmin(username) { //TODO

    let isAdminUrl = kinveyServiceBaseUrl + "user/" + kinveyAppID + "/_lookup";
    let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppID + ":" + kinveyAppMasterSecret)};
    let isAdminData = {
        first_name: "admin"
    };

    $.ajax({
        method: "POST",
        url:isAdminUrl,
        data: isAdminData,
        ContentType: 'application/json',
        headers: kinveyAuthHeaders,
        success: showAdminPage(),
        error: showAjaxError()
    });

    function showAdminPage(response, status) {
        let responseString = JSON.stringify(response);
        //let matches = responseString.search('"' + username + '"');

        //if(matches > 0){
        //    alert("te twa e ");
        //}

        alert(responseString);
    }
}

function showInfo(messageText) {
    $('#infoBox').text(messageText).show().delay(3000).fadeOut();
}

function showAjaxError(data, status) {
    let errorMsg = "Error: Something wrong"; //+ JSON.stringify(data); //TODO: Кво да пише?
    $('#errorBox').text(errorMsg).show();
}

function showGalleryView() {
    showView('viewGallery');
}

function addPhoto() {
    
}

function showAddPhotoView() {
    showView('viewAddPhoto');
}

function showAboutView() {
    showView('viewAbout');
}

function register() {

    let registerUrl = kinveyServiceBaseUrl + "user/" + kinveyAppID + "/";
    let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppID + ":" + kinveyAppSecret)};
    let registerData = {
        username: $("#registerUserName").val(),
        password: $("#registerPassword").val(),
        fullname: $("#registerFullName").val(),
        email: $("#registerEmailAdress").val() //TODO: валидация за имеил
    };
    let username = $("#registerUserName").val();
    let password = $("#registerPassword").val();
    let confirmPassword = $("#registerConfirmPassword").val();
    if( password == confirmPassword && password.length >= 6){ //TODO: по-читава валидация
        $.ajax({
            method: "POST",
            url: registerUrl,
            data: registerData,
            headers: kinveyAuthHeaders,
            success: registerSuccess,
            error: showAjaxError()
        });
        function registerSuccess(data, status) {
            sessionStorage.authtoken = data._kmd.authtoken;
            showHideNavigationLinks();
            showHomeView();
            showInfo("Register successful, dear " + username);
        }
    } else{
        showError("Password and confirm password is not match or is too short! Must be minimum 6 symbol length!");
    }

}

function showError(errorMessage) {
    $('#errorBox').text(errorMessage).show();
}

function showRegisterView() {
    showView('viewRegister');
}

function showLoginView() {
    showView('viewLogin')
}

function logout() {
    sessionStorage.clear();
    showHideNavigationLinks();
    showHomeView();
}

function showProfileView() {
    showView('viewProfile');
}

$(function () {
   $("#linkHome").click(showHomeView);
   $("#linkGallery").click(showGalleryView);
   $("#linkAddPhoto").click(showAddPhotoView);
   $("#linkAbout").click(showAboutView);
   $("#linkRegister").click(showRegisterView);
   $("#linkLogin").click(showLoginView);
   $("#linkLogout").click(logout);
   $("#linkProfile").click(showProfileView);

   $("#loginButton").click(login);
   $("#registerButton").click(register);
   $("#addPhotoButton").click(addPhoto); //TODO 
   

   showHomeView();
   showHideNavigationLinks();
});