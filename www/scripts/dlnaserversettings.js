﻿(function ($, document, window) {

    function loadPage(page, config, users) {

        $('#chkEnableServer', page).checked(config.EnableServer).checkboxradio("refresh");
        $('#chkBlastAliveMessages', page).checked(config.BlastAliveMessages).checkboxradio("refresh");
        $('#txtBlastInterval', page).val(config.BlastAliveMessageIntervalSeconds);

        $('#chkEnableEnhancedMovies', page).checked(config.EnableEnhancedMovies).checkboxradio("refresh");

        var usersHtml = users.map(function (u) {
            return '<option value="' + u.Id + '">' + u.Name + '</option>';
        }).join('');

        $('#selectUser', page).html(usersHtml).val(config.DefaultUserId || '').selectmenu("refresh");

        Dashboard.hideLoadingMsg();
    }

    function onSubmit() {

        Dashboard.showLoadingMsg();

        var form = this;

        ApiClient.getNamedConfiguration("dlna").done(function (config) {

            config.EnableServer = $('#chkEnableServer', form).checked();
            config.BlastAliveMessages = $('#chkBlastAliveMessages', form).checked();
            config.BlastAliveMessageIntervalSeconds = $('#txtBlastInterval', form).val();
            config.DefaultUserId = $('#selectUser', form).val();

            config.EnableEnhancedMovies = $('#chkEnableEnhancedMovies', form).checked();

            ApiClient.updateNamedConfiguration("dlna", config).done(Dashboard.processServerConfigurationUpdateResult);
        });

        // Disable default form submission
        return false;
    }

    $(document).on('pageinitpdepends', "#dlnaServerSettingsPage", function () {

        $('.dlnaServerSettingsForm').off('submit', onSubmit).on('submit', onSubmit);

    }).on('pageshowready', "#dlnaServerSettingsPage", function () {

        Dashboard.showLoadingMsg();

        var page = this;

        var promise1 = ApiClient.getNamedConfiguration("dlna");
        var promise2 = ApiClient.getUsers();

        $.when(promise1, promise2).done(function (response1, response2) {

            loadPage(page, response1[0], response2[0]);

        });

    });

})(jQuery, document, window);
