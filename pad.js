$(function() {
    // model
    var doc = {
        text: "",
        pos: 0,
        bs: function() {
            var str = this.text.substring(0, this.pos - 1) + this.text.substring(this.pos);
            this.cursor(-1);
            this.setText(str);
        },
        length: function() {
            return this.text.length;
        },
        append: function(s) {
            var str = this.text.substring(0, this.pos) + s + this.text.substring(this.pos);
            this.setText(str);
            this.cursor(s.length);
        },
        setText: function(s) {
            this.text = s;
            view.update();
        },
        cursor: function(value) {
            this.setCursor(this.pos + value);
            view.update();
        },
        setCursor: function(pos) {
            this.pos = pos;
            if (this.pos < 0) { this.pos = 0; }
            if (this.pos > this.text.length) { this.pos = this.text.length; }
            console.log('pos=' + this.pos);
        },
        keyCode: function(keyCode) {
            if (keyCode == 8) {
                this.bs();
            } else if (keyCode == 13) {
               this.append('\n');
            } else if (keyCode == 37) {
                this.cursor(-1);
            } else if (keyCode == 39) {
                this.cursor(+1);
            }
            // TODO 上下カーソル移動
        }
    };

    // view
    var $input = $('#input');
    var $content = $('#content');
    var $canvas = $("#canvas");
    var ctx = $canvas.get(0).getContext("2d");

    var view = {
        update: function() {
            ctx.fillStyle = "rgb(250, 250, 250)";
            ctx.fillRect(0, 0, $canvas.width(), $canvas.height());
            ctx.fillStyle = "black";
            doc.text.split('\n').forEach(function(s, i) {
                ctx.fillText(s, 0, 12 * (i + 1));
            });

            // draw cursor
            var beforeText = doc.text.substring(0, doc.pos);
            var beforeLines = beforeText.split('\n');
            var y = (beforeLines.length  - 1) * 12 + 3;
            var lastLine = beforeLines[beforeLines.length - 1];
            var x = ctx.measureText(lastLine).width;
            var pos = $canvas.position();
            $input.css({top: (pos.top + y - 1) + 'px', left: (pos.left + x) + 'px'});
            
            // preの場合
            //var html = doc.text.substring(0, doc.pos) + '<b style="color:red">I</b>' + doc.text.substring(doc.pos);
            //$content.html(html);
        }
    }
    var im = {
        clear: function() {
            this.blur();
            $input.html('');
            this.focus();
        },
        blur: function() {
            $input.blur();
        },
        focus: function() {
            $input.focus();
        }
    }

    // controller TODO iframeに移動する
    var $doc = $(document);
    var enter = false;
    var oldInput = "";
    $doc.keyup(function(e) {
        console.log('enter=' + enter);
        console.log(e.keyCode);
        if (enter == false || e.keyCode == 13) {
            var completed = $input.text();
            console.log('確定:' + completed);
            if (completed != "") {
                doc.append(completed);
            } else {
                if ($input.html().indexOf('<br>') != -1) {
                    doc.keyCode(13);
                } else {
                    // Firefox
                    doc.keyCode(e.keyCode);
                }
            }
            im.clear();
            enter = false;
        } else {
            // Chrome & more
            if (!jQuery.browser.mozilla && oldInput.length == 0) {
                doc.keyCode(e.keyCode);
            }
        }
    });
    $doc.keydown(function(e) {
        console.log('keydown=' + e.keyCode);
        oldInput = $input.text();
        enter = true;
    });
    $doc.keypress(function(e) {
        enter = false;
    });
    im.focus();
    doc.setText("");
});