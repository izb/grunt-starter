/* A simple example module that 'generates' data. */

define(function() {

    function DataSource() {
    }

    DataSource.prototype.getData = function() {
        return [
            {name:"Jeff Smith", age:23},
            {name:"Juliette Smith", age:25},
            {name:"Allan McGuff", age:45},
            {name:"Pete Hollinridge", age:32}
        ];
    };

    return DataSource;
});
