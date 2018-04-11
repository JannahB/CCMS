if (!String.prototype.contains) {
    String.prototype.contains = function (item, caseSensitive) {
        if (typeof caseSensitive === "undefined") {
            caseSensitive = true;
        }

        if (caseSensitive) {
            return this.indexOf(item) != -1;
        }

        return this.toLowerCase().indexOf(item.toString().toLowerCase()) != -1;
    }
}
