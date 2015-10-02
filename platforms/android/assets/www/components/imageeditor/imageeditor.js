﻿(function ($, document, window, FileReader, escape) {

    var currentItem;

    function getBaseRemoteOptions() {

        var options = {};

        options.itemId = currentItem.Id;

        return options;
    }

    function reload(page, item) {

        Dashboard.showLoadingMsg();

        if (item) {
            reloadItem(page, item);
        }
        else {
            ApiClient.getItem(Dashboard.getCurrentUserId(), currentItem.Id).done(function (item) {
                reloadItem(page, item);
            });
        }
    }

    function reloadItem(page, item) {

        currentItem = item;

        ApiClient.getRemoteImageProviders(getBaseRemoteOptions()).done(function (providers) {

            if (providers.length) {
                $('.lnkBrowseAllImages', page).removeClass('hide');
            } else {
                $('.lnkBrowseAllImages', page).addClass('hide');
            }

            ApiClient.getItemImageInfos(currentItem.Id).done(function (imageInfos) {

                renderStandardImages(page, item, imageInfos, providers);
                renderBackdrops(page, item, imageInfos, providers);
                renderScreenshots(page, item, imageInfos, providers);
                Dashboard.hideLoadingMsg();
            });
        });
    }

    function renderImages(page, item, images, imageProviders, elem) {

        var html = '';

        for (var i = 0, length = images.length; i < length; i++) {

            var image = images[i];

            html += '<div class="editorTile imageEditorTile">';
            html += '<div class="editorTileInner">';

            var height = 150;

            html += '<div style="height:' + height + 'px;vertical-align:top;background-repeat:no-repeat;background-position:center bottom;background-size:contain;" class="lazy" data-src="' + LibraryBrowser.getImageUrl(currentItem, image.ImageType, image.ImageIndex, { height: height }) + '"></div>';

            html += '<div class="editorTileFooter">';

            if (image.ImageType !== "Backdrop" && image.ImageType !== "Screenshot") {
                html += '<h3>' + image.ImageType + '</h3>';
            }

            if (image.Width && image.Height) {
                html += '<p>' + image.Width + ' X ' + image.Height + '</p>';
            } else {
                html += '<p>&nbsp;</p>';
            }

            html += '<div>';

            if (image.ImageType == "Backdrop" || image.ImageType == "Screenshot") {

                if (i > 0) {
                    html += '<paper-icon-button class="btnMoveImage" icon="chevron-left" data-imagetype="' + image.ImageType + '" data-index="' + image.ImageIndex + '" data-newindex="' + (image.ImageIndex - 1) + '" title="' + Globalize.translate('ButtonMoveLeft') + '"></paper-icon-button>';
                } else {
                    html += '<paper-icon-button icon="chevron-left" disabled title="' + Globalize.translate('ButtonMoveLeft') + '"></paper-icon-button>';
                }

                if (i < length - 1) {
                    html += '<paper-icon-button class="btnMoveImage" icon="chevron-right" data-imagetype="' + image.ImageType + '" data-index="' + image.ImageIndex + '" data-newindex="' + (image.ImageIndex + 1) + '" title="' + Globalize.translate('ButtonMoveRight') + '"></paper-icon-button>';
                } else {
                    html += '<paper-icon-button icon="chevron-right" disabled title="' + Globalize.translate('ButtonMoveRight') + '"></paper-icon-button>';
                }
            }
            else {
                if (imageProviders.length) {
                    html += '<paper-icon-button icon="search" data-imagetype="' + image.ImageType + '" class="btnSearchImages" title="' + Globalize.translate('ButtonBrowseOnlineImages') + '"></paper-icon-button>';
                }
            }

            html += '<paper-icon-button icon="delete" data-imagetype="' + image.ImageType + '" data-index="' + (image.ImageIndex != null ? image.ImageIndex : "null") + '" class="btnDeleteImage" title="' + Globalize.translate('Delete') + '"></paper-icon-button>';

            html += '</div>';

            html += '</div>';
            html += '</div>';
            html += '</div>';
        }

        elem.innerHTML = html;
        ImageLoader.lazyChildren(elem);

        $('.btnSearchImages', elem).on('click', function () {
            showImageDownloader(page, this.getAttribute('data-imagetype'));
        });

        $('.btnDeleteImage', elem).on('click', function () {

            var type = this.getAttribute('data-imagetype');
            var index = this.getAttribute('data-index');
            index = index == "null" ? null : parseInt(index);
            Dashboard.confirm(Globalize.translate('DeleteImageConfirmation'), Globalize.translate('HeaderDeleteImage'), function (result) {

                if (result) {
                    ApiClient.deleteItemImage(currentItem.Id, type, index).done(function () {

                        reload(page);

                    });
                }

            });
        });

        $('.btnMoveImage', elem).on('click', function () {
            var type = this.getAttribute('data-imagetype');
            var index = parseInt(this.getAttribute('data-index'));
            var newIndex = parseInt(this.getAttribute('data-newindex'));
            ApiClient.updateItemImageIndex(currentItem.Id, type, index, newIndex).done(function () {

                reload(page);

            });
        });
    }

    function renderStandardImages(page, item, imageInfos, imageProviders) {

        var images = imageInfos.filter(function (i) {
            return i.ImageType != "Screenshot" && i.ImageType != "Backdrop" && i.ImageType != "Chapter";
        });

        renderImages(page, item, images, imageProviders, page.querySelector('#images'));
    }

    function renderBackdrops(page, item, imageInfos, imageProviders) {

        var images = imageInfos.filter(function (i) {
            return i.ImageType == "Backdrop";

        }).sort(function (a, b) {
            return a.ImageIndex - b.ImageIndex;
        });

        if (images.length) {
            $('#backdropsContainer', page).show();
            renderImages(page, item, images, imageProviders, page.querySelector('#backdrops'));
        } else {
            $('#backdropsContainer', page).hide();
        }
    }

    function renderScreenshots(page, item, imageInfos, imageProviders) {

        var images = imageInfos.filter(function (i) {
            return i.ImageType == "Screenshot";

        }).sort(function (a, b) {
            return a.ImageIndex - b.ImageIndex;
        });

        if (images.length) {
            $('#screenshotsContainer', page).show();
            renderImages(page, item, images, imageProviders, $('#screenshots', page));
        } else {
            $('#screenshotsContainer', page).hide();
        }
    }

    function showImageDownloader(page, imageType) {
        require(['components/imagedownloader/imagedownloader'], function () {

            ImageDownloader.show(currentItem.Id, currentItem.Type, imageType).done(function (hasChanges) {

                if (hasChanges) {
                    reload(page);
                }
            });
        });
    }

    function initEditor(page) {

        $('.btnOpenUploadMenu', page).on('click', function () {

            require(['components/imageuploader/imageuploader'], function () {

                ImageUploader.show(currentItem.Id).done(function (hasChanges) {

                    if (hasChanges) {
                        reload(page);
                    }
                });
            });
        });

        $('.btnBrowseAllImages', page).on('click', function () {
            showImageDownloader(page, this.getAttribute('data-imagetype') || 'Primary');
        });
    }

    function showEditor(itemId) {

        Dashboard.showLoadingMsg();

        ApiClient.ajax({

            type: 'GET',
            url: 'components/imageeditor/imageeditor.template.html'

        }).done(function (template) {

            ApiClient.getItem(Dashboard.getCurrentUserId(), itemId).done(function (item) {

                var dlg = PaperDialogHelper.createDialog();

                var html = '';
                html += '<h2 class="dialogHeader">';
                html += '<paper-fab icon="arrow-back" class="mini btnCloseDialog"></paper-fab>';
                html += '<div style="display:inline-block;margin-left:.6em;vertical-align:middle;">' + item.Name + '</div>';
                html += '</h2>';

                html += '<div class="editorContent">';
                html += Globalize.translateDocument(template);
                html += '</div>';

                dlg.innerHTML = html;
                document.body.appendChild(dlg);

                initEditor(dlg);

                // Has to be assigned a z-index after the call to .open() 
                $(dlg).on('iron-overlay-closed', onDialogClosed);

                PaperDialogHelper.openWithHash(dlg, 'imageeditor');

                var editorContent = dlg.querySelector('.editorContent');
                reload(editorContent, item);

                $('.btnCloseDialog', dlg).on('click', function() {
                    
                    PaperDialogHelper.close(dlg);
                });
            });
        });
    }

    function onDialogClosed() {

        $(this).remove();
        Dashboard.hideLoadingMsg();
    }

    window.ImageEditor = {
        show: function (itemId) {

            require(['components/paperdialoghelper'], function () {

                Dashboard.importCss('css/metadataeditor.css');
                showEditor(itemId);
            });
        }
    };

})(jQuery, document, window, window.FileReader, escape);