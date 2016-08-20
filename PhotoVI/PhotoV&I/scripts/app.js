
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

let username;
function login() {
    let loginUrl = kinveyServiceBaseUrl + "user/" + kinveyAppID + "/login";
    let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppID + ":" + kinveyAppSecret)};
    let loginData = {
        username: $("#loginUserName").val(),
        password: $("#loginPassword").val()
    };
    username = $("#loginUserName").val();
    //let password = $("#loginPassword").val();
    //if (username.length < 1 || password.length < 1) { //TODO: To be or not :)
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
        }
    //} else{
        //showError("Please, enter user name and password!");
    //}
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

    function showAdminPage(response, status) {
        let responseString = JSON.stringify(response);
        let matches = responseString.search('"' + username + '"');

        if(matches > 0){
            //TODO:Functionalities
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

            function listUsers(response, status) {
                let usersTable = $('<table id="usersTableFromJS">')
                    .append($('<tr>').append(
                        '<th data-field="username">Username</th>',
                        '<th>Full name</th>',
                        '<th>Email adress</th>',
                        '<th data-field="username">IDs</th>',
                        '<th>Status</th>',
                        '<th>Check</th>')
                    );


                for (let user of response){
                    usersTable.append($('<tr class="users-list-td">').append(
                        $('<td>').text(user.username),
                        $('<td>').text(user.last_name),
                        $('<td>').text(user.email),
                        $('<td>').text(user._id),
                        $('<td>').text($('<form class="userStatus">').append($('<p>'))), //TODO: за СофтУни
                        $('<td>').append('<form class="adminCheckBoxes">').append($('<input type="checkbox" />')))
                    );
                }

                let isLockedData= {
                    //TODO     
                }; 

                function isLocked() { //TODO
                    $.ajax({
                        method: "POST",
                        url:isAdminUrl,
                        data: isAdminData,
                        ContentType: 'application/json',
                        headers: kinveyAuthHeaders,
                        success: showAdminPage,
                        error: showAjaxError
                    });
                }

                $("#usersTable").append(usersTable);

                let lockdonwUsers;
                $('#lockUserButton').click(function () {
                    lockdonwUsers = $('#usersTableFromJS').find('[type="checkbox"]:checked')
                        .map(function(){
                            return $(this).closest('tr').find('td:nth-child(4)').text();
                        }).get();

                        // TODO: как да се визуализират заключените юзири???
                        console.log(lockdonwUsers);

                        //for(let user of lockdonwUsers){
                          //  $(".userStatus").empty(); //TODO: Това е вярно, само не го хваща по клас
                          //  $(".userStatus").append("disabled");
                        //}

                        for (let user of lockdonwUsers) {
    
                            let dataForLockdown = {
                                "userId": '"' + user + '"',
                                "setLockdownStateTo": true //TODO: подавам булева, то ми казва че му подавам стринг????
                            };

                            let lockdownUsersUrl = kinveyServiceBaseUrl + "rpc/" + kinveyAppID + "/lockdown-user";

    
                            $.ajax({
                                method: "POST",
                                url: lockdownUsersUrl,
                                data: dataForLockdown,
                                ContentType: "application/json",
                                headers: kinveyAuthHeaders,
                                success: alert("SUCCESS"),
                                error: alert("FAIL")
                            });
                        }
                });

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

function showAjaxError(data, status) {
    let errorMsg = "Wrong password or user name!";
    $('#errorBox').text(errorMsg).show();
}

function showGalleryView() {
    showView('viewGallery');
    ajaxGallery();


    function ajaxGallery() {

        let showGalleryUrl = kinveyServiceBaseUrl + "blob/" + kinveyAppID;
        let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppID + ":" + kinveyAppMasterSecret)};

        $.ajax({
            method: "GET",
            url: showGalleryUrl,
            headers: kinveyAuthHeaders,
            success: loadGallery
        });

    }

    function loadGallery(data, status){

        showInfo("THE IMAGES!!!");

        let pictureTable = $('<table id="pictureTableFromJS">')
            .append($('<tr>').append(
                '<th>Picture name</th>',
                '<th>By</th>',
                '<th>Likes</th>',
                '<th>Check</th>')
            );

        let pictureName;
        let pictureId;
        let pictureLikes;
        let pictureObj;

        for (let picture of data){

            pictureName = picture._filename;
            pictureId = picture._id;
            pictureLikes = Number.parseFloat(picture.myProperty);

            pictureTable.append($('<tr>').append(
                $('<td>').text(picture._filename),
                $('<td>').text(picture._acl.creator),
                $('<td>').text(picture.myProperty),
                $('<td>').append('<form class="pictureLikesButton">').append($('<input type="checkbox" />')))
            );
        }


        $('#likeConfirm').click(function () {
            let likedPictures = $('#pictureTableFromJS').find('[type="checkbox"]:checked')
                .map(function(){
                    return $(this).closest('tr').find('td:nth-child(1)').text();
                }).get();


           pictureName = likedPictures[0];


            for (let picture of data){
                pictureLikes = Number.parseFloat(picture.myProperty);

                pictureId = picture._id;

                pictureObj = {
                    pictureName:pictureId,
                    myProperty: pictureLikes
                };

                if (picture._filename === pictureName){
                    break;
                }
            }


                let newLikeUrl = kinveyServiceBaseUrl + "blob/" + kinveyAppID + "/" + pictureObj.pictureName;
                let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppID + ":" + kinveyAppMasterSecret)};


                let newValueOfLikes = pictureObj.myProperty + 1;
                let dataNewValueOfLikes = {
                     "myProperty": newValueOfLikes
                };

                $.ajax({
                    method: "PUT",
                    url: newLikeUrl,
                    data: dataNewValueOfLikes,
                    ContentType: 'application/json',
                    headers: kinveyAuthHeaders,
                    success: likedPictureSuccessful
                });

            function likedPictureSuccessful() {
                showInfo("Like successful"); //TODO: адекватен начин за рефреш

                $('#pictureTableFromJS').empty();
                showGalleryView();
            }

        });

        $('#gallery').append(pictureTable);

        $('#deleteConfirm').click(function () { //TODO: да се оптимизира
            let likedPictures = $('#pictureTableFromJS').find('[type="checkbox"]:checked')
                .map(function(){
                    return $(this).closest('tr').find('td:nth-child(1)').text();
                }).get();

            pictureName = likedPictures[0];


            for (let picture of data){
                pictureLikes = Number.parseFloat(picture.myProperty);

                pictureId = picture._id;

                pictureObj = {
                    pictureName:pictureId,
                    myProperty: pictureLikes
                };

                if (picture._filename === pictureName){
                    break;
                }
            }

            console.log(pictureObj);

            let deletePictureUrl = kinveyServiceBaseUrl + "blob/" + kinveyAppID + "/" + pictureObj.pictureName;
            let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppID + ":" + kinveyAppMasterSecret)};

            $.ajax({
                method: "DELETE",
                url: deletePictureUrl,
                headers: kinveyAuthHeaders,
                success: deletePictureSuccessful
            });

            function deletePictureSuccessful() {
                showInfo("Delete successful"); //TODO: адекватен начин за рефреш

                $('#pictureTableFromJS').empty();
                showGalleryView();
            }

        });
    }
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
        last_name: $("#registerFullName").val(),
        email: $("#registerEmailAdress").val(), //TODO: валидация за имеил
        first_name: "user"
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
            error: showError("This username already exist!")
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
    $("#adminPanelButton").hide();
    location.reload(true);
}

function showProfileView() {
    showView('viewProfile');

    let profileView = $('<table id="profileViewFromJS">')
        .append($('<tr>').append(
            '<th data-field="username">Username: '+ username + '</th>',
            '<th data-field="email">Email</th>',
            '<th><form><input type="submit" value="delete"/></form></th>')
        );

    //$('#profileView').append(profileView); //TODO: Подготовка за когато има снимки в базата

    profileView.append($('<tr>').append(
        $('<td>').text('IMAGE'),
        $('<td>').text('IMAGE'),
        $('<td>').text('IMAGE')));
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
   $("#adminPanelButton").click(function(){ //TODO: Може да се изнесе в метод
       $("#viewAdminPanel").show();
       $("#viewHome").hide();
       $("#viewAbout").hide();
       $("#viewProfile").hide();
       $("#viewAddPhoto").hide();
       $("#viewGallery").hide();
   });

   showHomeView();
   showHideNavigationLinks();

});