
class UserController{
    constructor(userView, requester, baseUrl, appKey){
        this._userView = userView;
        this.requester = requester;
        this._appKey = appKey;
        this._baseServiceUrl = baseUrl + "/user/" + appKey + "/";
    }

    showLoginPage(){
        this._userView.showLoginPage();
    }
    
    showRegisterPage(){
        this._userView.showRegisterPage();
    }

    register(data){
        if(data.username.length < 6){
            showPopup('error', 'The user name is too short.');
            return;
        }

        if(data.fullName.length < 1){
            showPopup('error', 'Enter a full name.');
            return;
        }

        if(data.password.length < 3){
            showPopup('error', 'Password is too short.');
            return;
        }

        if(data.password != data.confirmPassword){
            showPopup('error', 'Password and confirm password not match!')
        }

        delete data['confirmPassword'];

        this.requester.post(this._baseServiceUrl, data,
            function successCallback(response) {
                showPopup('success', 'Registration done.');
                redirectUrl('#/login');
            },
            function errorCallback(response) {
                showPopup('error', 'Registration failed!');
            });
    }

    login(data){

    }

    logout(){
        sessionStorage.clear();
        redirectUrl('#/');
    }
}
