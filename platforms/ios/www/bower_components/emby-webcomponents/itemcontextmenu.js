define(["apphost","globalize","connectionManager","itemHelper"],function(e,n,t,r){function o(o){var i=o.item,a=i.ServerId,s=t.getApiClient(a);return s.getCurrentUser().then(function(t){var o=[];return r.supportsAddingToCollection(i)&&o.push({name:n.translate("sharedcomponents#AddToCollection"),id:"addtocollection"}),r.supportsAddingToPlaylist(i)&&o.push({name:n.translate("sharedcomponents#AddToPlaylist"),id:"addtoplaylist"}),i.CanDelete&&o.push({name:n.translate("sharedcomponents#Delete"),id:"delete"}),t.Policy.IsAdministrator&&"Video"==i.MediaType&&"TvChannel"!=i.Type&&"Program"!=i.Type&&"Virtual"!=i.LocationType&&o.push({name:n.translate("sharedcomponents#EditSubtitles"),id:"editsubtitles"}),i.CanDownload&&e.supports("filedownload")&&o.push({name:n.translate("sharedcomponents#Download"),id:"download"}),t.Policy.IsAdministrator&&o.push({name:n.translate("Refresh"),id:"refresh"}),"Timer"!=i.Type&&t.Policy.EnablePublicSharing&&e.supports("sharing")&&o.push({name:n.translate("Share"),id:"share"}),o})}function i(e,n){var r=e.Id,o=e.ServerId,i=t.getApiClient(o);return new Promise(function(e,t){switch(n){case"addtocollection":require(["collectionEditor"],function(e){(new e).show({items:[r],serverId:o}).then(t,t)});break;case"addtoplaylist":require(["playlistEditor"],function(e){(new e).show({items:[r],serverId:o}).then(t,t)});break;case"download":require(["fileDownloader"],function(e){var n=i.getUrl("Items/"+r+"/Download",{api_key:i.accessToken()});e.download([{url:n,itemId:r,serverId:o}]),t()});break;case"editsubtitles":require(["subtitleEditor"],function(n){var o=i.serverInfo().Id;n.show(r,o).then(e,t)});break;case"refresh":s(i,r),t();break;case"delete":a(i,r).then(function(){e(!0)});break;case"share":require(["sharingmanager"],function(e){e.showMenu({serverId:o,itemId:r}).then(t)});break;default:t()}})}function a(e,t){return new Promise(function(r,o){var i=n.translate("sharedcomponents#ConfirmDeleteItem"),a=n.translate("sharedcomponents#HeaderDeleteItem");require(["confirm"],function(n){n(i,a).then(function(){e.deleteItem(t).then(function(){r(!0)})},o)})})}function s(e,n){require(["refreshDialog"],function(t){new t({itemIds:[n],serverId:e.serverInfo().Id}).show()})}function d(e){return o(e).then(function(n){return new Promise(function(t,r){require(["actionsheet"],function(o){o.show({items:n}).then(function(n){i(e.item,n).then(t)},r)})})})}return{getCommands:o,show:d}});