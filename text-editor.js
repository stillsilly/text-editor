class TextEditor {
    constructor(option = {}) {

        this.el = option.el
        this.styleWithCSS = option.styleWithCSS !== false
        this.currentRange = null;
        this.supportRange = typeof document.createRange === 'function'

        this.init()
        this.bind()
    }

    init() {
        if (this.styleWithCSS) {
            document.execCommand("styleWithCSS", false, true)
        }
    }

    bind() {
        this.bindBlur()
    }

    bindBlur() {
        this.el.addEventListener('blur', (e) => {
            if (!e.isTrusted) {
                return
            }
            this.saveSelection()
            this.el.blur() // 有一个奇怪的问题，可以连续blur两次  el的可点击区域比实际的大
            // el是行级元素的时候 可点击区域比元素大，有两次blur。是块级元素的时候正常。

        })
    }

    setFontSize(val) {
        this.execCommand('fontSize', false, 7)
        this.fixFontSize(val)
    }

    // fontSize只有1-7，单位不是像素，处理一下
    fixFontSize(val) {
        this.el.querySelectorAll('font').forEach((el) => {
            if (el.size === '7') {
                el.removeAttribute('size')
                el.style.fontSize = val + 'px'
            }
        })

        this.el.querySelectorAll('span').forEach((el) => {
            if (el.style.fontSize === 'xxx-large') {
                el.style.fontSize = val + 'px'
            }
        })
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

    saveSelection() {
        this.currentRange = this.getCurrentRange();
    }

    getCurrentRange() {
        if (this.supportRange) {
            let selection = document.getSelection();
            if (selection.getRangeAt && selection.rangeCount) {
                return selection.getRangeAt(0)
            }
        } else {
            return document.selection.createRange()
        }
    }

    restoreSelection() {
        if (!this.currentRange) {
            return;
        }

        if (this.supportRange) {
            this.restoreBrowserNotIESelection()
        } else {
            this.restoreIESelection()
        }
    }

    restoreBrowserNotIESelection() {
        let selection = document.getSelection()
        selection.removeAllRanges()
        selection.addRange(this.currentRange)
    }

    restoreIESelection() {
        let range = document.selection.createRange()
        range.setEndPoint('EndToEnd', this.currentRange)
        if (this.currentRange.text.length === 0) {
            range.collapse(false)
        } else {
            range.setEndPoint('StartToStart', this.currentRange)
        }
        range.select()
    }

    execCommand(name, showUI, value) {
        if (document.getSelection().toString()) {
            document.execCommand(name, showUI, value)
        } else {
            this.restoreSelection()
            document.execCommand(name, showUI, value)
        }
    }

    getHTML() {
        let div = document.createElement('div')
        div.style.lineHeight = this.el.style.lineHeight     // 行高在el上
        div.innerHTML = this.el.innerHTML
        return div.outerHTML
    }
}
