(function(context) {

    function multiple(child) {

    }

    if (context.module && context.exports) {
        module.exports = multiple;
    } else if (context.require && context.define) {
        context.define([], function () {
            return multiple;
        });
    } else {
        context.multiple = multiple;
    }

})(this);