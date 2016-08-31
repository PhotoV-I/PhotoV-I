
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
        $("#likeConfirm").show();
    } else {
        $("#linkAddPhoto").hide();
        $("#linkRegister").show();
        $("#linkLogin").show();
        $("#linkLogout").hide();
        $("#linkProfile").hide();
        $("#likeConfirm").hide();
        $("#deleteConfirm").hide();
    }
}

function showHomeView() {
    showView('viewHome');

    mostLikedPictures();
}

function mostLikedPictures() {

    let showGalleryUrl = kinveyServiceBaseUrl + "appdata/" + kinveyAppID + "/Test";
    let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppID + ":" + kinveyAppMasterSecret)};

    $.ajax({
        method: "GET",
        url: showGalleryUrl,
        headers: kinveyAuthHeaders,
        success: renderMostLikedPictures
    });

    function renderMostLikedPictures(data) {

            $('#favImages').text("");

            data.sort(function(a, b) {
                return parseFloat(a.likes) - parseFloat(b.likes);
            });
            data.reverse();

        let pictureForRender = data.slice(0, 3);

        for(let picture of pictureForRender){
            let placeholders = $('<a href=' + picture.file + ' target="_blank"><img src=' + picture.file + '></a>');

            $('#favImages').append(placeholders);
        }
    }
}

let username;
let categoryName;
let userEmail;
function login() {
    let loginUrl = kinveyServiceBaseUrl + "user/" + kinveyAppID + "/login";
    let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppID + ":" + kinveyAppSecret)};
    let loginData = {
        username: $("#loginUserName").val(),
        password: $("#loginPassword").val()
    };
    username = $("#loginUserName").val();
        $.ajax({
            method: "POST",
            url: loginUrl,
            data: loginData,
            headers: kinveyAuthHeaders,
            success: loginSuccess,
            error: showAjaxError
        });
        function loginSuccess(data, status) {
            sessionStorage.authtoken = data._kmd.authtoken;
            activeUser = data._kmd.authtoken;
            showHideNavigationLinks();
            isAdmin(username);
            showHomeView();
            showInfo("Welcome " + username);
            userEmail = data.email;
        }
}

function isAdmin(username) {

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
        success: showAdminPage,
        error: showAjaxError
    });

    function showAdminPage(response) {
        let responseString = JSON.stringify(response);
        let matches = responseString.search('"' + username + '"');

        if(matches > 0){

            $("#adminPanelButton").show();
            $("#viewHome").hide();
            $("#viewAdminPanel").show();
            $("#deleteConfirm").show();

            let listUsersData = {
                first_name: "user"
            };
            $.ajax({
                method: "POST",
                url:isAdminUrl,
                data: listUsersData,
                ContentType: 'application/json',
                headers: kinveyAuthHeaders,
                success: listUsers,
                error: showAjaxError
            });

            function listUsers(response) {
                let usersTable = $('<table id="usersTableFromJS">');                   
                
                for (let user of response){
                    usersTable.append($('<tr class="users-list-td">').append(
                        $('<td>').text(user.username),
                        $('<td>').text(user.last_name),
                        $('<td>').text(user.email),
                        $('<td>').text(user._id)));
                }

                $("#usersTable").append(usersTable);

            }
        }
        if(sessionStorage.authtoken == null){
            $("#adminPanelButton").hide();
            $("#viewLogin").show();
            $("#viewAdminPanel").hide();
            $("#deleteConfirm").hide();
        }
    }
}


function showInfo(messageText) {
    $('#infoBox').text(messageText).show().delay(3000).fadeOut();
}
   
function showAjaxError() {
    let errorMsg = "Wrong password or user name!";
    $('#errorBox').text(errorMsg).show();
}

function showGalleryView() {
    showView('viewCategory');
    showInfo("CATEGORIES");

    $('#catAnimals').click(loadAnimalsCategory);
    $('#catPeople').click(loadPeopleCategory);
    $('#catLandscapes').click(loadLandscapesCategory);
    $('#catFlowers').click(loadFlowersCategory);
    $('#catLove').click(loadLoveCategory);
    $('#catLogos').click(loadLogosCategory);
    $('#catGames').click(loadGamesCategory);
    $('#catOther').click(loadOtherCategory);

    function loadAnimalsCategory() {
        categoryName = "animals";
        showView('viewGallery');
        ajaxGallery();
    }

    function loadPeopleCategory() {
        categoryName = "people";
        showView('viewGallery');
        ajaxGallery();
    }
    
    function loadLandscapesCategory() {
        categoryName = "landscapes";
        showView('viewGallery');
        ajaxGallery();
    }

    function loadFlowersCategory() {
        categoryName = "flowers";
        showView('viewGallery');
        ajaxGallery();
    }

    function loadLoveCategory() {
        categoryName = "love";
        showView('viewGallery');
        ajaxGallery();
    }

    function loadLogosCategory() {
        categoryName = "logos";
        showView('viewGallery');
        ajaxGallery();
    }

    function loadGamesCategory() {
        categoryName = "games";
        showView('viewGallery');
        ajaxGallery();
    }

    function loadOtherCategory() {
        categoryName = "other";
        showView('viewGallery');
        ajaxGallery();
    }

    function ajaxGallery() {

        let showGalleryUrl = kinveyServiceBaseUrl + "appdata/" + kinveyAppID + "/Test";
        let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppID + ":" + kinveyAppMasterSecret)};

        $.ajax({
            method: "GET",
            url: showGalleryUrl,
            headers: kinveyAuthHeaders,
            success: loadGallery
        });
    }



    function loadGallery(data) {


            $('#photos').text('');


            showInfo("THE IMAGES!!!");

            let pictureTable = $('<table id="pictureTableFromJS">');



            let pictureName;
            let pictureId;
            let pictureLikes;
            let pictureObj;
            let pictureCategory;
            let usersWhoLiked;

            for (let picture of data) {


                    pictureName = picture._filename;
                    pictureId = picture._id;
                    pictureLikes = Number.parseFloat(picture.myProperty);
                    pictureCategory = picture.category;
                    usersWhoLiked = picture.usersWhoLiked;
                if (categoryName === pictureCategory) {

                    pictureTable.append($('<tr>').append(
                        $('<td>').text(picture.name),
                        $('<td>').text(picture.likes),
                        $("<td>").html($('<a href=' + picture.file + ' target="_blank"><img src=' + picture.file + '></a>')),
                        $('<td>').append('<form class="pictureLikesButton">').append($('<input type="radio" name="radioGroup" value="' + picture._id+ '"/>')))
                    );
                }
            }



        $('#likeConfirm').unbind('click').bind('click', function () {   //TODO:проблем с рефрешването



                let likedPictures = $('#pictureTableFromJS').find('[type="radio"]:checked')
                    .map(function () {
                        return $(this).closest('tr').find('td:nth-child(1)').text();
                    }).get();

                pictureId = $('input[name="radioGroup"]:checked').val();

                pictureName = likedPictures[0];


                if (likedPictures.length > 0) {
                    for (let picture of data) {
                        pictureLikes = Number.parseFloat(picture.likes);

                        //pictureId = picture._id;

                        pictureObj = {
                            pictureName: pictureId,
                            likes: pictureLikes,
                            name: picture.name,
                            file: picture.file,
                            creator: picture.creator,
                            category: picture.category,
                            usersWhoLiked: username
                        };

                        usersWhoLiked = picture.usersWhoLiked;

                        if (picture._id === pictureId) {
                            break;
                        }
                    }
                }
                console.log(pictureId);

                let newLikeUrl = kinveyServiceBaseUrl + "appdata/" + kinveyAppID + "/Test/" + pictureObj.pictureName;
                let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppID + ":" + kinveyAppMasterSecret)};

                let newValueOfLikes = pictureObj.likes + 1;
                let newValueOfUsersWhoLiked = usersWhoLiked.concat('/' + username);

                let dataNewValueOfLikes = {

                    "likes": newValueOfLikes,
                    "name": pictureObj.name,
                    "file": pictureObj.file,
                    "creator": pictureObj.creator,
                    "category": pictureObj.category,
                    "usersWhoLiked": newValueOfUsersWhoLiked
                };


                let matches = usersWhoLiked.indexOf(username);

                if (matches == -1){

                    $.ajax({
                        method: "PUT",
                        url: newLikeUrl,
                        data: dataNewValueOfLikes,
                        ContentType: 'application/json',
                        headers: kinveyAuthHeaders,
                        success: likedPictureSuccessful

                    });
                }

                if(matches > -1){
                    $('#alertAlreadyLiked').show().delay(3000).fadeOut();
                }

                function likedPictureSuccessful() {  //TODO: да не рефрешва при повторен лаик

                    if (matches == -1) {

                        $('#pictureTableFromJS').empty();
                        switch (categoryName) {
                            case "animals":
                                loadAnimalsCategory();
                                break;
                            case "people":
                                loadPeopleCategory();
                                break;
                            case "landscapes":
                                loadLandscapesCategory();
                                break;
                            case "flowers":
                                loadFlowersCategory();
                                break;
                            case "love":
                                loadLoveCategory();
                                break;
                            case "logos":
                                loadLogosCategory();
                                break;
                            case "games":
                                loadGamesCategory();
                                break;
                            case "other":
                                loadOtherCategory();
                                break;
                        }
                    }
                }

            });

            $('#photos').append(pictureTable);


            $('#deleteConfirm').unbind('click').bind('click', function () {
                let likedPictures = $('#pictureTableFromJS').find('[type="radio"]:checked')
                    .map(function () {
                        return $(this).closest('tr').find('td:nth-child(1)').text();
                    }).get();

                pictureId = $('input[name="radioGroup"]:checked').val();
                pictureName = likedPictures[0];


                if (likedPictures.length > 0) {
                    for (let picture of data) {
                        pictureLikes = Number.parseFloat(picture.likes);

                        //pictureId = picture._id;

                        pictureObj = {
                            pictureName: pictureId,
                            likes: pictureLikes,
                            name: picture.name,
                            file: picture.file,
                            creator: picture.creator,
                            category: picture.category
                        };

                        if (picture._id === pictureId) {
                            break;
                        }
                    }
                }

                let newLikeUrl = kinveyServiceBaseUrl + "appdata/" + kinveyAppID + "/Test/" + pictureObj.pictureName;
                let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppID + ":" + kinveyAppMasterSecret)};

                $.ajax({
                    method: "DELETE",
                    url: newLikeUrl,
                    ContentType: 'application/json',
                    headers: kinveyAuthHeaders,
                    success: deletePictureSuccessful
                });

                function deletePictureSuccessful() {

                    showError("Delete succesful!");
                    $('#pictureTableFromJS').empty();

                    switch (categoryName){
                        case "animals":
                            loadAnimalsCategory();
                            break;
                        case "people":
                            loadPeopleCategory();
                            break;
                        case "landscapes":
                            loadLandscapesCategory();
                            break;
                        case "flowers":
                            loadFlowersCategory();
                            break;
                        case "love":
                            loadLoveCategory();
                            break;
                        case "logos":
                            loadLogosCategory();
                            break;
                        case "games":
                            loadGamesCategory();
                            break;
                        case "other":
                            loadOtherCategory();
                            break;
                    }
                }
            });

    }
}


function showAddPhotoView() {
    showView('viewAddPhoto');


    addPhoto()
}


function addPhoto() {
//////////////////////////////////////////////OSPRAY/////////////////////////////////////

    let ospry = new Ospry('pk-test-rjna2is16e0hjq6g7810zhym');
    let uploadURL;

    let fileName = $('#fileName').val;

    let onUpload = function(err, metadata) {
        ospry.get({
            url: metadata.url,
            maxHeight: 400
        });
        uploadURL = metadata.url;
        console.log(uploadURL);
        ///// POST to Kinvey
        if(uploadURL.length > 0){
            let uploadDataUrl = kinveyServiceBaseUrl + "appdata/" + kinveyAppID + "/Test";


            let kinveyAppHeaders = {
                'Authorization': "Basic " + btoa(kinveyAppID + ":" + kinveyAppSecret),
                'Content-Type' : "application/json"
            };


            let uploadData = {
                name: $('#photoName').val(),
                file: uploadURL,
                creator: username,
                category: $('#categoryName').val(),
                likes: 0,
                usersWhoLiked: ""

            };

            let loginUrl = kinveyServiceBaseUrl + "user/" + kinveyAppID + "/login";


            let loginData = {
                "username": "ivo",
                "password": "123"
            };

            $.when( $.ajax({
                method: "POST",
                url:loginUrl,
                data: JSON.stringify(loginData),
                headers: kinveyAppHeaders
            })).then(function( data ) {

                var auth = data._kmd.authtoken;
                var userHeaders = {
                    'Authorization': "Kinvey " + auth,
                    'Content-Type' : "application/json"
                };

                $.when( $.ajax({
                    method: "POST",
                    url:uploadDataUrl,
                    data: JSON.stringify(uploadData),
                    headers: userHeaders
                })).then(function(data) {
                    showInfo("Upload successful!");
                    $('#photoName').val("");
                    $('.upload-label-buton').val("");
                    $('#categoryName').val('other');
                });
            });
        }
    };

    $('#up-form').unbind('submit').bind('submit',function(e) {
        e.preventDefault();
        ospry.up({
            form: this,
            imageReady: onUpload
        });
    });
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
        last_name: $("#registerFullName").val(),
        email: $("#registerEmailAdress").val(),
        first_name: "user"
    };

    username = $("#registerUserName").val();
    let password = $("#registerPassword").val();
    let confirmPassword = $("#registerConfirmPassword").val();
    userEmail = $("#registerEmailAdress").val();

    if( password == confirmPassword && password.length >= 6){
        $.ajax({
            method: "POST",
            url: registerUrl,
            data: registerData,
            headers: kinveyAuthHeaders,
            success: registerSuccess,
            error: showAjaxError
        });
        function registerSuccess(data) {
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
    $("#adminPanelButton").hide();
    location.reload(true);
}

function showProfileView() {
    showView('viewProfile');
    $('#profileView').text('');
    $('#infoUser').text('');

    $('#infoUser').append($('<span id="usernameProfile">Username: '+ username +'</span>'));
    if(userEmail == ""){
        $('#infoUser').append($('<span id="emailProfile">Email: not specified</span>'));
    }else {
        $('#infoUser').append($('<span id="emailProfile">Email: ' + userEmail + '</span>'));
    }
    ajaxGallery();
    function ajaxGallery() {

        let showGalleryUrl = kinveyServiceBaseUrl + "appdata/" + kinveyAppID + "/Test";
        let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppID + ":" + kinveyAppMasterSecret)};

        $.ajax({
            method: "GET",
            url: showGalleryUrl,
            headers: kinveyAuthHeaders,
            success: loadGallery
        });

        function loadGallery(data, status){
            let responseString = JSON.stringify(data);
            let matches = responseString.search('"' + username + '"');

            $('#photos').text('');

            let pictureTable = $('<table id="pictureTableFromJSProfile">');                

            let pictureName;
            let pictureId;
            let pictureLikes;
            let pictureObj;

            for (let picture of data){

                pictureName = picture.name;
                pictureId = picture._id;
                pictureLikes = Number.parseFloat(picture.myProperty);
                pictureCreator = picture.creator;

                if(matches < 0){

                    $('#noPicturesAlert').show();

                }

                if(pictureCreator === username) {
                    showInfo("THE IMAGES!!!");
                    $('#staticProfilePicturesTableHeader').show();
                    $('#deleteConfirmProfile').show();

                    pictureTable.append($('<tr>').append(
                        $('<td>').text(picture.name),
                        $('<td>').text(picture.likes),
                        $("<td>").html($('<a href='+ picture.file +' target="_blank"><img src=' + picture.file + '></a>')),
                        $('<td>').append('<form class="pictureLikesButton">').append($('<input type="radio" name="radioGroupProfile" value="' + picture._id+ '"/>')))
                    );
                }

            }

            $('#profileView').append(pictureTable);

            $('#deleteConfirmProfileForm').unbind('submit').bind('submit',function(e) {
                e.preventDefault();

                let likedPictures = $('#pictureTableFromJSProfile').find('[type="radio"]:checked')
                    .map(function(){
                        return $(this).closest('tr').find('td:nth-child(1)').text();
                    }).get();

                pictureName = likedPictures[0];
                pictureId = $('input[name="radioGroupProfile"]:checked').val();
                if(likedPictures.length > 0){
                    for (let picture of data){
                        pictureLikes = Number.parseFloat(picture.likes);

                        //pictureId = picture._id;

                        pictureObj = {
                            pictureName:pictureId,
                            likes: pictureLikes,
                            name:picture.name,
                            file:picture.file,
                            creator:picture.creator,
                            category:picture.category
                        };

                        if (picture._id === pictureId){
                            break;
                        }
                    }
                }


                let newLikeUrl = kinveyServiceBaseUrl + "appdata/" + kinveyAppID + "/Test/" + pictureObj.pictureName;
                let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppID + ":" + kinveyAppMasterSecret)};

                $.ajax({
                    method: "DELETE",
                    url: newLikeUrl,
                    ContentType: 'application/json',
                    headers: kinveyAuthHeaders,
                    success: likedPictureSuccessful
                });

                function likedPictureSuccessful() {
                    $('#pictureTableFromJSProfile').empty();
                    showProfileView();
                }
            });

        }
    }


}

$(function () {

    sessionStorage.clear();

   $("#linkHome").click(showHomeView);
   $("#linkGallery").click(showGalleryView);
   $("#linkAddPhoto").click(showAddPhotoView);
   $("#linkAbout").click(showAboutView);
   $("#linkRegister").click(showRegisterView);
   $("#linkLogin").click(showLoginView);
   $("#linkLogout").click(logout);
   $("#linkProfile").click(showProfileView);

   $("#loginForm").unbind('submit').bind('submit',function(event) {
        event.preventDefault();
        login();
    });
   $("#registerForm").unbind('submit').bind('submit',function(event) {
        event.preventDefault();
        register();
    });

   $("#adminPanelButton").click(function(){
       $("#viewAdminPanel").show();
       $("#viewHome").hide();
       $("#viewAbout").hide();
       $("#viewProfile").hide();
       $("#viewAddPhoto").hide();
       $("#viewGallery").hide();
       $("#viewCategory").hide();
   });

   showHomeView();
   showHideNavigationLinks();

});