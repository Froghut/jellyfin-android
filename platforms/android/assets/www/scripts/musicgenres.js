define(["libraryBrowser"],function(e){return function(t,r,n){function o(){var t=u(),n=l[t];return n||(n=l[t]={query:{SortBy:"SortName",SortOrder:"Ascending",IncludeItemTypes:"Audio,MusicAlbum",Recursive:!0,Fields:"DateCreated,SyncInfo,ItemCounts",StartIndex:0},view:e.getSavedView(t)||e.getDefaultItemsView("Thumb","Thumb")},n.query.ParentId=r.topParentId,e.loadSavedQueryValues(t,n.query)),n}function i(){return o().query}function u(){return e.getSavedQueryKey("genres")}function a(){Dashboard.showLoadingMsg();var e=i();return ApiClient.getGenres(Dashboard.getCurrentUserId(),e)}function s(t,r){var n=i();r.then(function(r){var o="",i=d.getCurrentViewStyle();"Thumb"==i?o=e.getPosterViewHtml({items:r.Items,shape:"backdrop",preferThumb:!0,context:"music",showItemCounts:!0,centerText:!0,lazy:!0,overlayMoreButton:!0}):"ThumbCard"==i?o=e.getPosterViewHtml({items:r.Items,shape:"backdrop",preferThumb:!0,context:"music",showItemCounts:!0,cardLayout:!0,showTitle:!0,lazy:!0}):"PosterCard"==i?o=e.getPosterViewHtml({items:r.Items,shape:"portrait",context:"music",showItemCounts:!0,lazy:!0,cardLayout:!0,showTitle:!0}):"Poster"==i&&(o=e.getPosterViewHtml({items:r.Items,shape:"portrait",context:"music",centerText:!0,showItemCounts:!0,lazy:!0,overlayMoreButton:!0}));var a=t.querySelector("#items");a.innerHTML=o,ImageLoader.lazyChildren(a),e.saveQueryValues(u(),n),Dashboard.hideLoadingMsg()})}function c(){d.preRender(),d.renderTab()}var d=this,l={};d.getViewStyles=function(){return"Poster,PosterCard,Thumb,ThumbCard".split(",")},d.getCurrentViewStyle=function(){return o(n).view},d.setCurrentViewStyle=function(t){o(n).view=t,e.saveViewSetting(u(n),t),c()},d.enableViewSelection=!0;var m;d.preRender=function(){m=a()},d.renderTab=function(){s(n,m)};var y=n.querySelector(".btnSelectView");y.addEventListener("click",function(t){e.showLayoutMenu(t.target,d.getCurrentViewStyle(),d.getViewStyles())}),y.addEventListener("layoutchange",function(e){d.setCurrentViewStyle(e.detail.viewStyle)})}});