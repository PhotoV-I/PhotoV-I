
const kynveyAppID = 'kid_rypBID8w';
const kynveyAppSecret = 'f3610928907d4fc691152798e5385946';
const kynveyServiceBaseUrl = 'https://baas.kynvey.com/';


function showView(viewId) {
    $('main > section').hide();

    $("#" + viewId).show();
}

function showHideNavigationLinks() {
    let loggedIn = sessionStorage.authToken != null;
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
    let authBase = btoa(kynveyAppID + ":" + kynveyAppSecret);
    let loginUrl = kynveyServiceBaseUrl + "user/" + kynveyAppID + "/login";
    $.ajax({
       method: "POST",
       url: loginUrl,
       headers: {"Authorization": "Basic" + authBase},
       success: loginSuccess,
       error: showAjaxError
    });
    
    function loginSuccess() {
        alert("success") //TODO
    }
}

function showAjaxError() {
    //TODO
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
    
}

function showRegisterView() {
    showView('viewRegister');
}

function showLoginView() {
    showView('viewLogin')
}

function logout() {
    alert(1);
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
   $("#registerButton").click(register); //TODO 
   $("#addPhotoButton").click(addPhoto); //TODO 
   

   showHomeView();
   showHideNavigationLinks();
});