
class PostController{
    constructor(postView, requester, baseUrl, appKey){
        this._postView = postView;
        this.requester = requester;
        this._appKey = appKey;
        this._baseServiceUrl = baseUrl; //TODO
    }

    showAddPhotoPage(){
        this._postView.showAddPhotoPage();
    }

    addPhoto(data){
        
    }
}
