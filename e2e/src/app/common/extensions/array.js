
if (!Array.prototype.remove) {
    Array.prototype.remove = function(elementToRemove) {
        var index = this.indexOf(elementToRemove);

        if (index > -1) {
            this.removeIndex(index);
        }
    }
}

if (!Array.prototype.removeIndex) {
    Array.prototype.removeIndex = function (index) {
        if (index < 0 || index > this.length - 1) {
            throw new RangeError("Index " + index.toString() + " is out of range");
        }
        this.splice(index, 1);
    }
}

if (!Array.prototype.contains) {
    Array.prototype.contains = function (item) {
        return this.indexOf(item) != -1;
    }
}

if (!Array.prototype.last) {
    Array.prototype.last = function (expression) {
        if(expression){
            let filteredCollection = this.filter(expression);
            if(filteredCollection.any()){
                return filteredCollection[filteredCollection.length - 1];
            }
            return null;
        }
        return this[this.length - 1];
    }
}

if (!Array.prototype.first) {
    Array.prototype.first = function (expression) {
        if(expression){
            let result = this.find(expression);

            if(typeof result === "undefined"){
                return null
            }

            return result;
        }
        return this[0];
    }
}

if (!Array.prototype.any) {
    Array.prototype.any = function (expression) {
        if(expression){
            return this.first(expression) != null;
        }
        return this.length > 0;
    }
}

if (!Array.prototype.copy) {
    Array.prototype.copy = function () {
        return this.slice();
    }
}
