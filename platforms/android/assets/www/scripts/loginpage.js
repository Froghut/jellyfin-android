define(["libraryBrowser"],function(e){function a(){var e=getParameterByName("serverid");return e?ConnectionManager.getOrCreateApiClient(e):ApiClient}function t(){Dashboard.alert({message:Globalize.translate("MessageUnableToConnectToServer"),title:Globalize.translate("HeaderConnectionFailure")})}function r(e,a,t){e.querySelector(".manualLoginForm").classList.remove("hide"),e.querySelector(".visualLoginForm").classList.add("hide"),t?e.querySelector("#txtManualPassword").focus():e.querySelector("#txtManualName").focus(),a?e.querySelector(".btnCancel").classList.remove("hide"):e.querySelector(".btnCancel").classList.add("hide")}function n(a,t,r){for(var n="",s=0,o=r.length;o>s;s++){var l=r[s];n+='<div class="card squareCard bottomPaddedCard"><div class="cardBox visualCardBox">',n+='<div class="cardScalable">',n+='<div class="cardPadder"></div>',n+='<a class="cardContent" href="#" data-ajax="false" data-haspw="'+l.HasPassword+'" data-username="'+l.Name+'" data-userid="'+l.Id+'">';var d;if(l.PrimaryImageTag)d=t.getUserImageUrl(l.Id,{width:300,tag:l.PrimaryImageTag,type:"Primary"}),n+='<div class="cardImage" style="background-image:url(\''+d+"');\"></div>";else{var c=e.getMetroColor(l.Id);d="css/images/logindefault.png",n+='<div class="cardImage" style="background-image:url(\''+d+"');background-color:"+c+';"></div>'}n+="</a>",n+="</div>",n+='<div class="cardFooter">',n+='<div class="cardText">'+l.Name+"</div>",n+='<div class="cardText">';var u=i.getLastSeenText(l.LastActivityDate);n+=""!=u?u:"&nbsp;",n+="</div>",n+="</div>",n+="</div>",n+="</div>"}a.querySelector("#divUsers").innerHTML=n}function s(e,a){for(;!e.classList||!e.classList.contains(a);)if(e=e.parentNode,!e)return null;return e}var i={showVisualForm:function(e){e.querySelector(".visualLoginForm").classList.remove("hide"),e.querySelector(".manualLoginForm").classList.add("hide")},getLastSeenText:function(e){return e?"Last seen "+humane_date(e):""},authenticateUserByName:function(e,a,r,n){Dashboard.showLoadingMsg(),a.authenticateUserByName(r,n).then(function(e){var t,r=e.User,n=getParameterByName("serverid");t=r.Policy.IsAdministrator&&!n?"dashboard.html":"home.html",Dashboard.hideLoadingMsg(),Dashboard.onServerChanged(r.Id,e.AccessToken,a),Dashboard.navigate(t)},function(a){e.querySelector("#txtManualName").value="",e.querySelector("#txtManualPassword").value="",Dashboard.hideLoadingMsg(),401==a.status?require(["toast"],function(e){e(Globalize.translate("MessageInvalidUser"))}):t()})}};return function(e){e.querySelector("#divUsers").addEventListener("click",function(t){var n=s(t.target,"cardContent");if(n){var o=e,l=n.getAttribute("data-userid"),d=n.getAttribute("data-username"),c=n.getAttribute("data-haspw");"manual"==l?(o.querySelector("#txtManualName").value="",r(o,!0)):"false"==c?i.authenticateUserByName(o,a(),d,""):(o.querySelector("#txtManualName").value=d,o.querySelector("#txtManualPassword").value="",r(o,!0,!0))}}),e.querySelector(".manualLoginForm").addEventListener("submit",function(t){var r=a();return i.authenticateUserByName(e,r,e.querySelector("#txtManualName").value,e.querySelector("#txtManualPassword").value),t.preventDefault(),!1}),e.querySelector(".btnForgotPassword").addEventListener("click",function(){Dashboard.navigate("forgotpassword.html")}),e.querySelector(".btnCancel").addEventListener("click",function(){i.showVisualForm(e)}),e.querySelector(".btnManual").addEventListener("click",function(){e.querySelector("#txtManualName").value="",r(e,!0)}),e.addEventListener("viewshow",function(){Dashboard.showLoadingMsg();var t=a();t.getPublicUsers().then(function(a){a.length?(i.showVisualForm(e),n(e,t,a)):(e.querySelector("#txtManualName").value="",r(e,!1,!1)),Dashboard.hideLoadingMsg()}),t.getJSON(t.getUrl("Branding/Configuration")).then(function(a){e.querySelector(".disclaimer").innerHTML=a.LoginDisclaimer||""}),Dashboard.isConnectMode()?e.querySelector(".connectButtons").classList.remove("hide"):e.querySelector(".connectButtons").classList.add("hide")})}});