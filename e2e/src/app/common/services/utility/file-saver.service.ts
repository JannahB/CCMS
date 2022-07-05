export class FileSaver{

    public readonly INIT:number = 0;
    public readonly WRITING:number = 1;
    public readonly DONE:number = 2;

    private type:string;
    private blobChanged:boolean = false;
    private objectUrl:string;
    private targetView;
    private view:any;
    private readyState:number = this.INIT;
    private doc:Document;
    private saveLink:any;
    private canUseSaveLink:boolean; 
    private arbitraryRevokeTimeout:number = 500;
    private createIfNotFound = {create: true, exclusive: false};
    private slice;
    private webkitReqFs;
    private reqFs;
    private forceSaveableType:string = "application/octet-stream";
    private fsMinSize:number = 0;
    private blob:Blob;
    
    private error = null;
    private onwritestart = null;
    private onprogress = null;
    private onwrite = null;
    private onabort = null;
    private onerror = null;
    private onwriteend = null;

    constructor(){
        this.view = typeof self !== "undefined" && self
            || typeof window !== "undefined" && window;

        this.doc = this.view.document;
        this.saveLink = this.doc.createElementNS("http://www.w3.org/1999/xhtml", "a");
        this.canUseSaveLink = "download" in this.saveLink;
        this.webkitReqFs = this.view.webkitRequestFileSystem;
        this.reqFs = this.view.requestFileSystem || this.webkitReqFs || this.view.mozRequestFileSystem;
    }

    public saveAs(blob:any, name:string){
        this.type = blob.type;
        this.blob = blob;

        // IE <10 is explicitly unsupported
        if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
            return;
        }

        if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
            return (blob, name) => {
                return navigator.msSaveOrOpenBlob(this.autoBom(blob), name);
            };
        }

        this.readyState = this.INIT;
        if (!name) {
            name = "download";
        }
        if (this.canUseSaveLink) {
            this.objectUrl = this.getURL().createObjectURL(blob);
            this.saveLink.href = this.objectUrl;
            this.saveLink.download = name;
            this.click(this.saveLink);
            this.readyState = this.DONE;
            this.dispatchAll();
            this.revoke(this.objectUrl);
            return;
        }
        // Object and web filesystem URLs have a problem saving in Google Chrome when
        // viewed in a tab, so I force save with application/octet-stream
        // http://code.google.com/p/chromium/issues/detail?id=91158
        // Update: Google errantly closed 91158, I submitted it again:
        // https://code.google.com/p/chromium/issues/detail?id=389642
        if (this.view.chrome && this.type && this.type !== this.forceSaveableType) {
            this.slice = blob.slice || blob.webkitSlice;
            blob = this.slice.call(blob, 0, blob.size, this.forceSaveableType);
            this.blobChanged = true;
        }
        // Since I can't be sure that the guessed media type will trigger a download
        // in WebKit, I append .download to the filename.
        // https://bugs.webkit.org/show_bug.cgi?id=65440
        if (this.webkitReqFs && name !== "download") {
            name += ".download";
        }
        if (this.type === this.forceSaveableType || this.webkitReqFs) {
            this.targetView = this.view;
        }
        if (!this.reqFs) {
            this.fsError();
            return;
        }
        this.fsMinSize += blob.size;
        this.reqFs(this.view.TEMPORARY, this.fsMinSize, this.abortable(fs => {
            fs.root.getDirectory("saved", this.createIfNotFound, this.abortable(dir => {
                var save = () => {
                    dir.getFile(name, this.createIfNotFound, this.abortable(file => {
                        file.createWriter(this.abortable(writer => {
                            writer.onwriteend = event => {
                                this.targetView.location.href = file.toURL();
                                this.readyState = this.DONE;
                                this.dispatch("writeend", event);
                                this.revoke(file);
                            };
                            writer.onerror = () => {
                                var error = writer.error;
                                if (error.code !== error.ABORT_ERR) {
                                    this.fsError();
                                }
                            };
                            "writestart progress write abort".split(" ").forEach(event => {
                                writer["on" + event] = this["on" + event];
                            });
                            writer.write(blob);
                            this.abort = () => {
                                writer.abort();
                                this.readyState = this.DONE;
                            };
                            this.readyState = this.WRITING;
                        }), this.fsError);
                    }), this.fsError);
                };
                dir.getFile(name, {create: false}, this.abortable(file => {
                    // delete file if it already exists
                    file.remove();
                    save();
                }), this.abortable(ex => {
                    if (ex.code === ex.NOT_FOUND_ERR) {
                        save();
                    } else {
                        this.fsError();
                    }
                }));
            }), this.fsError);
        }), this.fsError); 
    }

    private fsError() {
        // don't create more object URLs than needed
        if (this.blobChanged || !this.objectUrl) {
            this.objectUrl = this.getURL().createObjectURL(this.blob);
        }
        if (this.targetView) {
            this.targetView.location.href = this.objectUrl;
        } else {
            var new_tab = this.view.open(this.objectUrl, "_blank");
            if (new_tab == undefined && typeof this.view.safari !== "undefined") {
                //Apple do not allow window.open, see http://bit.ly/1kZffRI
                this.view.location.href = this.objectUrl
            }
        }
        this.readyState = this.DONE;
        this.dispatchAll();
        this.revoke(this.objectUrl);
    }

    private click(node) {
        var event = this.doc.createEvent("MouseEvents");
        event.initMouseEvent(
            "click", true, false, this.view, 0, 0, 0, 0, 0
            , false, false, false, false, 0, null
        );
        node.dispatchEvent(event);
    }

    private getURL() {
        return this.view.URL || this.view.webkitURL || this.view;
    }

    private autoBom(blob) {
        // prepend BOM for UTF-8 XML and text/* types (including HTML)
        if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
            return new Blob(["\ufeff", blob], {type: blob.type});
        }
        return blob;
    }

    private dispatch(eventTypes, event?){
        eventTypes = [].concat(eventTypes);
        var i = eventTypes.length;
        while (i--) {
            var listener = this["on" + eventTypes[i]];
            if (typeof listener === "function") {
                try {
                    listener.call(this, event || this);
                } catch (ex) {
                    this.throwOutside(ex);
                }
            }
        }
    }

    private dispatchAll() {
        this.dispatch("writestart progress write writeend".split(" "));
    }

    private throwOutside(ex) {
        (this.view.setImmediate || this.view.setTimeout)(() => {
            throw ex;
        }, 0);
    }

    private revoke(file) {
        let revoker = () => {
            if (typeof file === "string") { // file is an object URL
                this.getURL().revokeObjectURL(file);
            } else { // file is a File
                file.remove();
            }
        };
        if (this.view.chrome) {
            revoker();
        } else {
            setTimeout(revoker, this.arbitraryRevokeTimeout);
        }
    }

    private abortable(func) {
        return function() {
            if (this.readyState !== this.DONE) {
                return func.apply(this, arguments);
            }
        };
    }

    private abort() {
		this.readyState = this.DONE;
		this.dispatch(this, "abort");
	}
}