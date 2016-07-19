define(["playbackManager","inputManager","connectionManager","embyRouter","globalize","loading","dom"],function(e,t,i,n,r,a,o){function d(t,i,n){for(var r=t.parentNode,a=t.classList.length?"."+t.classList[0]:"",o=r.querySelectorAll(a+"[data-id]"),d=[],l=!1,u=0,s=o.length;s>u;u++)o[u]==t&&(l=!0),l&&d.push(o[u].getAttribute("data-id"));d.length&&(n?e.queue({ids:d,serverId:i}):e.play({ids:d,serverId:i}))}function l(e,t){var n=i.getApiClient(t),r=n.getCurrentUserId();return n.getItem(r,e).then(function(t){return n.getItems(r,{MediaTypes:"Photo",Filters:"IsNotFolder",ParentId:t.ParentId}).then(function(t){var i=t.Items,n=i.map(function(e){return e.Id}).indexOf(e);-1==n&&(n=0),require(["slideshow"],function(e){var t=new e({showTitle:!1,cover:!1,items:i,startIndex:n,interval:8e3,interactive:!0});t.show()})})})}function u(e){return"Photo"==e.Type?void l(e.Id,e.ServerId):void n.showItem(e)}function s(e){e=o.parentWithAttribute(e,"data-id");var t=e.getAttribute("data-serverid"),n=e.getAttribute("data-id"),r=e.getAttribute("data-type"),a=i.getApiClient(t);return"Timer"==r?a.getLiveTvTimer(n):a.getItem(a.getCurrentUserId(),n)}function c(e,t){s(e).then(function(i){var n=t.itemsContainer||o.parentWithAttribute(e,"is","emby-itemscontainer"),r=n?n.getAttribute("data-playlistid"):null,a=n?n.getAttribute("data-collectionid"):null;if(r){var d=o.parentWithAttribute(e,"data-playlistitemid");i.PlaylistItemId=d?d.getAttribute("data-playlistitemid"):null}require(["itemContextMenu"],function(o){o.show(Object.assign({item:i,play:!0,queue:!0,playAllFromHere:!i.IsFolder,queueAllFromHere:!i.IsFolder,identify:!1,playlistId:r,collectionId:a},t||{})).then(function(i){"playallfromhere"==i.command||"queueallfromhere"==i.command?f(e,t.positionTo,i.command):"removefromplaylist"==i.command||"removefromcollection"==i.command?n&&n.dispatchEvent(new CustomEvent("needsrefresh",{detail:{},cancelable:!1,bubbles:!0})):"canceltimer"==i.command&&n&&n.dispatchEvent(new CustomEvent("timercancelled",{detail:{},cancelable:!1,bubbles:!0}))})})})}function m(e,t){var i={Type:e.getAttribute("data-type"),Id:e.getAttribute("data-id"),ServerId:e.getAttribute("data-serverid"),MediaType:e.getAttribute("data-mediatype"),IsFolder:"true"==e.getAttribute("data-isfolder"),UserData:{PlaybackPositionTicks:parseInt(e.getAttribute("data-positionticks")||"0")}};require(["playMenu"],function(e){e.show({item:i,positionTo:t})})}function f(t,i,n){i=i||t;var r=t.getAttribute("data-id");r||(t=o.parentWithAttribute(t,"data-id"),r=t.getAttribute("data-id"));var a=t.getAttribute("data-serverid"),l=t.getAttribute("data-type"),f="true"==t.getAttribute("data-isfolder");if("link"==n)u({Id:r,Type:l,IsFolder:f,ServerId:a});else if("instantmix"==n)e.instantMix(r,a);else if("play"==n){var h=parseInt(t.getAttribute("data-positionticks")||"0");e.play({ids:[r],startPositionTicks:h,serverId:a})}else if("playallfromhere"==n)d(t,a);else if("queueallfromhere"==n)d(t,a,!0);else if("setplaylistindex"==n)e.currentPlaylistIndex(parseInt(t.getAttribute("data-index")));else if("record"==n)v(a,r,l,t.getAttribute("data-timerid"),t.getAttribute("data-seriestimerid"));else if("menu"==n){var I="false"==i.getAttribute("data-playoptions")?{shuffle:!1,instantMix:!1,play:!1,playAllFromHere:!1,queue:!1,queueAllFromHere:!1}:{};I.identify=!1,I.positionTo=i,c(t,I)}else"playmenu"==n?m(t,i):"edit"==n?s(i).then(function(e){g(e,a)}):"playtrailer"==n&&s(i).then(p)}function p(t){var n=i.getApiClient(t.ServerId);n.getLocalTrailers(n.getCurrentUserId(),t.Id).then(function(t){e.play({items:t})})}function g(e,t){var n=i.getApiClient(t);return new Promise(function(t,i){"Timer"==e.Type?require(["recordingEditor"],function(r){var a=n.serverInfo().Id;r.show(e.Id,a).then(t,i)}):require(["components/metadataeditor/metadataeditor"],function(n){n.show(e.Id).then(t,i)})})}function v(e,t,n,r,a){var o=i.getApiClient(e);a&&r?I(o,r,!0):r?h(o,r,t):"Program"==n&&b(o,t)}function h(e,t,i){a.show(),e.getItem(e.getCurrentUserId(),i).then(function(n){n.IsSeries?I(e,t,!1).then(function(){e.getNewLiveTvTimerDefaults({programId:i}).then(function(t){e.createLiveTvSeriesTimer(t).then(function(){a.hide(),A(r.translate("sharedcomponents#SeriesRecordingScheduled"))})})}):I(e,t,!0)})}function I(e,t,i){return a.show(),e.cancelLiveTvTimer(t).then(function(){i&&(a.hide(),A(r.translate("sharedcomponents#RecordingCancelled")))})}function b(e,t){a.show(),e.getNewLiveTvTimerDefaults({programId:t}).then(function(t){e.createLiveTvTimer(t).then(function(){a.hide(),A(r.translate("sharedcomponents#RecordingScheduled"))})})}function A(e){require(["toast"],function(t){t(e)})}function y(e){var t=o.parentWithClass(e.target,"itemAction");if(t){var i=t,n=i.getAttribute("data-action");if(n||(i=o.parentWithAttribute(i,"data-action"),n=i.getAttribute("data-action")),n)return f(t,i,n),e.preventDefault(),e.stopPropagation(),!1}}function T(e){var t=e.detail.command;if("play"==t||"record"==t||"menu"==t||"info"==t){var i=o.parentWithClass(e.target,"itemAction");i&&f(i,i,t)}}function w(e,i){i=i||{},i.click!==!1&&e.addEventListener("click",y),i.command!==!1&&t.on(e,T)}function C(e,i){i=i||{},e.removeEventListener("click",y),i.command!==!1&&t.off(e,T)}return{on:w,off:C,onClick:y,showContextMenu:c}});