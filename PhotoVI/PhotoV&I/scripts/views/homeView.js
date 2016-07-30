class HomeView{
    constructor(wrapperSelector, mainContentSelector){
        this._wrapperSelector = wrapperSelector;
        this._mainContentSelector = mainContentSelector;
    }

    showGuestPage(mainData){//TODO
        let _that = this;
        $.get('templates/home.html', function (template) {
            //let renderedTemplate = Mustache.render(template, null);
            $.get('.wrapper').includes('templates/home.html');
        });
    }

    showUserPage(mainData){

    }

    showAdminPage(mainData){

    }
}
