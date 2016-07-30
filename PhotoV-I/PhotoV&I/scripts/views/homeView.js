class HomeView{
    constructor(wrapperSelector, mainContentSelector){
        this._wrapperSelector = wrapperSelector;
        this._mainContentSelector = mainContentSelector;
    }

    showGuestPage(mainData){//TODO
        let _that = this;
        $.get('templates/home.html', function (template) {
            let renderedTemplate = Mustache.render(template, null);
            $(_that._wrapperSelector).html(renderedTemplate);            
        });
    }

    showUserPage(mainData){

    }

    showAdminPage(mainData){

    }
}
