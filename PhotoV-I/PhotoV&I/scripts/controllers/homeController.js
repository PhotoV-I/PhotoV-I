
class HomeController{
    constructor(homeView, requester, baseUrl, appKey){
        this._homeView = homeView;
        this.requester = requester;
        this._appKey = appKey;
        this._baseServiceUrl = baseUrl + "/appdata/" + appKey + "/gallery";
    }

    showGuestPage(){
        let _that = this;
        _that.requester.get(_that._baseServiceUrl,
            function (response) {
                showPopup('success', 'Data accepted.');
                _that._homeView.showGuestPage(response);
            },
            function (data) {
                showPopup('error', 'Data not accepted!')
            });
    }
    
    showUserPage(){
        this._homeView.showUserPage();
    }
    
    showAdminPage(){
        this._homeView.showAdminPage();
    }
}