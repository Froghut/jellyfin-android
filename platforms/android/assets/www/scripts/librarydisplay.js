define(["globalize"],function(e){function t(){return[{href:"library.html",name:e.translate("TabFolders")},{href:"librarydisplay.html",name:e.translate("TabDisplay")},{href:"librarypathmapping.html",name:e.translate("TabPathSubstitution")},{href:"librarysettings.html",name:e.translate("TabAdvanced")}]}return function(e){function r(){ApiClient.getServerConfiguration().then(function(t){e.querySelector(".chkFolderView").checked=t.EnableFolderView})}e.querySelector("form").addEventListener("submit",function(e){Dashboard.showLoadingMsg();var t=this;return ApiClient.getServerConfiguration().then(function(e){e.EnableFolderView=t.querySelector(".chkFolderView").checked,ApiClient.updateServerConfiguration(e).then(Dashboard.processServerConfigurationUpdateResult)}),e.preventDefault(),!1}),e.addEventListener("viewshow",function(){LibraryMenu.setTabs("librarysetup",1,t),r()})}});