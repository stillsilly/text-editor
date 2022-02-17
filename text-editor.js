class TextEditor {
    constructor(option = {}) {

        this.el = option.el
        this.useCSS = option.useCSS !== false
        this.currentRange = null;
        this.supportRange = typeof document.createRange === 'function'

        this.init()
        this.bind()
    }

    init() {
        if (this.useCSS) {
            document.execCommand("styleWithCSS", false, true);
        }
    }

    bind() {
        this.bindBlur()
    }

    bindBlur() {
        this.el.addEventListener('blur', () => {
            this.getCurrentRange()
            this.saveSelection()
        })
    }

    setFontSize(val) {
        this.execCommand('fontSize', false, 7)
        this.fixFontSize(val)
    }

    // 行高没有api，要自己写
    setLineHeight(val) {
        this.el.style['line-height'] = val + 'px'
    }

    setFontColor(val) {
        this.execCommand('foreColor', false, val)
    }

    setBackgroundColor(val) {
        this.execCommand('backColor', false, val)
    }

    setFontFamily(val) {
        this.execCommand('fontName', false, val)
    }

    setBold() {
        this.execCommand('bold', false, true)
    }

    setItalic() {
        this.execCommand('italic', false, true)
    }

    setUnderline() {
        this.execCommand('underline', false, true)
    }

    setStrikeThrough() {
        this.execCommand('strikeThrough', false, true)
    }

    alignCenter() {
        this.execCommand('justifyCenter', false, true)
    }

    alignLeft() {
        this.execCommand('justifyLeft', false, true)
    }

    alignRight() {
        this.execCommand('justifyRight', false, true)
    }

    alignJustify() {
        this.execCommand('justifyFull', false, true)
    }


    // fontSize只有1-7，单位不是像素，处理一下
    fixFontSize(val) {
        this.el.querySelectorAll('font').forEach((el) => {
            if (el.size === '7') {
                el.removeAttribute('size')
                el.style.fontSize = val + 'px'
            }
        })
    }

    saveSelection() {
        this.currentRange = this.getCurrentRange();
    }


    getCurrentRange() {
        var selection,
            range;
        if (this.supportRange) {
            selection = document.getSelection();
            if (selection.getRangeAt && selection.rangeCount) {
                range = document.getSelection().getRangeAt(0);
                this._parentElem = range.commonAncestorContainer;
            }
        } else {
            range = document.selection.createRange();
            this._parentElem = range.parentElement();
        }
        return range;
    }

    restoreSelection() {
        console.log('restoreSelection')
        console.log('this.currentRange:', this.currentRange)
        if (!this.currentRange) {
            return;
        }
        var selection,
            range;
        if (this.supportRange) {
            selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(this.currentRange);
        } else {
            range = document.selection.createRange();
            range.setEndPoint('EndToEnd', this.currentRange);
            if (this.currentRange.text.length === 0) {
                range.collapse(false);
            } else {
                range.setEndPoint('StartToStart', this.currentRange);
            }
            range.select();
        }
    }

    execCommand(name, showUI, value, cb) {
        // console.log('this.currentRange:', this.currentRange)
        // console.log('document.activeElement:', document.activeElement)
        // console.log('document.getSelection().toString():', document.getSelection().toString())
        if (document.getSelection().toString()) {
            document.execCommand(name, showUI, value)
        } else {
            this.restoreSelection()
            document.execCommand(name, showUI, value)
        }
        // document.execCommand(name, showUI, value)
        cb && cb()
    }
}
