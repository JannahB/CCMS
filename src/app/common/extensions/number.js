if (!Number.prototype.round) {
    Number.prototype.round = function (decimalPoints) {
        if (typeof decimalPoints === "undefined") {
            return Math.round(this);
        }

        var multiplier = Math.pow(10, decimalPoints);

        return Math.round(this * multiplier) / multiplier;
    }
}
