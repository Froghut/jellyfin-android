define(["components/categorysyncbuttons"],function(e){function t(){return"Thumb"}function r(e,t){Dashboard.showLoadingMsg();var r=Dashboard.getCurrentUserId(),n=t.topParentId,a={IncludeItemTypes:"Episode",Limit:30,Fields:"PrimaryImageAspectRatio,SyncInfo",ParentId:n,ImageTypeLimit:1,EnableImageTypes:"Primary,Backdrop,Thumb"};return ApiClient.getJSON(ApiClient.getUrl("Users/"+r+"/Items/Latest",a))}function n(e,r,n){n.then(function(r){var n=t(),a="";"ThumbCard"==n?a+=LibraryBrowser.getPosterViewHtml({items:r,shape:"backdrop",preferThumb:!0,inheritThumb:!1,showUnplayedIndicator:!1,showChildCountIndicator:!0,overlayText:!1,showParentTitle:!0,lazy:!0,showTitle:!0,cardLayout:!0}):"Thumb"==n&&(a+=LibraryBrowser.getPosterViewHtml({items:r,shape:"backdrop",preferThumb:!0,inheritThumb:!1,showParentTitle:!1,showUnplayedIndicator:!1,showChildCountIndicator:!0,overlayText:!1,centerText:!0,lazy:!0,showTitle:!1,overlayPlayButton:AppInfo.enableAppLayouts}));var o=e.querySelector("#latestEpisodes");o.innerHTML=a,ImageLoader.lazyChildren(o),Dashboard.hideLoadingMsg()})}return function(t,a,o){var i=this;e.init(o);var s;i.preRender=function(){s=r(t,a)},i.renderTab=function(){n(o,a,s)}}});