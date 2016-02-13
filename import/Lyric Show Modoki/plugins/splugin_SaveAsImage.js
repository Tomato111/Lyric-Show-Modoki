﻿pl = {
    name: 'splugin_SaveAsImage',
    label: prop.Panel.Lang == 'ja' ? '保存: 画像として保存' : 'Save: Save As Image',
    author: 'tomato111',
    onStartUp: function () { // 最初に一度だけ呼び出される関数
        this.isAvailable = 'SaveAs' in gdi.CreateImage(1, 1);
        if (!this.isAvailable)
            return;

        var _this = this;

        var saveAsImage = function (file) {
            if (!file)
                return;

            var ext = file.match(/\.(.{3})$/)[1].toLowerCase();
            var ds = _this.currentInfo[0];
            var w = _this.currentInfo[1];
            var h = _this.currentInfo[2];
            if (ds[_this.currentInfo[3] - 1].text !== '') // h は最終行の高さを含んでいないので空文字でないなら足してあげる
                h += ds[_this.currentInfo[3] - 1].height;

            var img = gdi.CreateImage(w, h + 15);
            var canvas = img.GetGraphics();
            ext !== 'png' && canvas.FillSolidRect(-1, -1, img.Width + 1, img.Height + 1, prop.Style.Color.Background);
            for (var i = 0; i < _this.currentInfo[3]; i++) {
                canvas.DrawImage(ds[i].textImg, 0, ds[i].cy, w, ds[i].height, 0, 0, w, ds[i].height, 0, 255);
            }
            img.ReleaseGraphics(canvas);
            img.SaveAs(file, 'image/' + ext.replace('jpg', 'jpeg'));
            img.Dispose();
        };

        var filter = "JPG - JPEG Format (*.jpg)|*.jpg|PNG - Portable Network Graphics (*.png)|*.png|GIF - Graphics Interchange Format (*.gif)|*.gif|BMP - Windows Bitmap (*.bmp)|*.bmp";

        this.fd = new FileDialog(commondir + 'FileDialog.exe -s "' + filter + '" jpg');
        this.fd.setOnReady(saveAsImage);
    },
    onPlay: function () { }, // 新たに曲が再生される度に呼び出される関数
    onCommand: function () { // プラグインのメニューをクリックすると呼び出される関数
        if (!this.isAvailable) {
            StatusBar.setText(prop.Panel.Lang == 'ja' ? 'このプラグインは JScript Panel 専用です。' : 'JScript Panel Only.');
            StatusBar.show();
            return;
        }
        if (!lyric) {
            StatusBar.setText(prop.Panel.Lang == 'ja' ? '歌詞がありません。' : 'Lyric is not found.');
            StatusBar.show();
            return;
        }

        if (prop.Style.DrawingMethod === 2 && (prop.Panel.ScrollType <= 3 || filetype === "txt")) {
            this.currentInfo = [LyricShow.setProperties.DrawStyle, LyricShow.on_paintInfo.w, LyricShow.setProperties.h, lyric.text.length];
            this.fd.open();
        }
        else {
            var tmpStyleTextRender = prop.Style.EnableStyleTextRender;
            var tmpScrollType = prop.Panel.ScrollType;

            prop.Style.EnableStyleTextRender = true;
            prop.Panel.ScrollType = 1;
            setDrawingMethod();

            this.currentInfo = [LyricShow.setProperties.DrawStyle, LyricShow.on_paintInfo.w, LyricShow.setProperties.h, lyric.text.length];
            this.fd.open();

            prop.Style.EnableStyleTextRender = tmpStyleTextRender;
            prop.Panel.ScrollType = tmpScrollType;
            setDrawingMethod();
        }
    }
};
