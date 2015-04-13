(function ExtendModule(context) {

    /**
     * Prototypal inheritance with support for multiple inheritance
     *
     * @author op1ekun@borntoco.de
     * @param  {function} child [description]
     *
     * TODO
     * document optional parent classes arguments (multiple)
     * @return {object}       return child object that extends provided parent classes
     */
    function extend(child) {
        if (!child) {
            throw new ReferenceError('No child class provided.');
        } else if ( !(child instanceof Function) ) {
            throw new TypeError('Provided child is not a class.');
        } else if (arguments.lentgh < 2) {
            throw new TypeError('Nothing to inherit.');
        }

        var inherited = {};

        function Temp() {}

        // creates a closure for parent's prototype method
        function extendPrototype(innerParent, innerPropName) {

            return function() { 
                // preserve changes to the prototype chain
                return innerParent.prototype[innerPropName].apply(innerParent, arguments);
            };
        }

        function superMethod(childMethod, parent, methodName) {

            return function() {
                // create a reference to super method ONLY during runtime
                this._super = parent.prototype[methodName];
                // run the child method to get the results
                // the child method has access to super method now
                var result = childMethod.apply(this, arguments);
                // delete super method from the child's instance
                // so it doesn't hang around in the object
                delete this._super;

                return result;
            };
        }

        for (var i = 1, l = arguments.length; i < l; i++) {
            var parent = arguments[i];

            for (var propName in parent.prototype) {
                // inherit prototype methods
                if (parent.prototype[propName] instanceof Function) {

                    if (child.prototype[propName] &&
                        !inherited[propName]) {
                        child.prototype[propName] = superMethod(child.prototype[propName], parent, propName);
                        // for multiple inheritance, methods are copied from left to right,
                        // once a method is copied and a super method is created we don't want to overwrite it
                        // there can be only one super method
                        inherited[propName] = true;
                    }
                    else if (!inherited[propName]) {
                        child.prototype[propName] = extendPrototype(parent, propName);
                    }


                }
                // inherit prototype property
                // only if child object doesn't have it
                else if (!child.prototype[propName]) {
                    child.prototype[propName] = parent.prototype[propName];
                }
            }
        }

        return child;
    }               

    if (context.module && context.exports) {
        module.exports = extend;
    } else if (context.require && context.define) {
        context.define([], function () {
            return extend;
        });
    } else {
        context.extend = extend;
    }

})(this);