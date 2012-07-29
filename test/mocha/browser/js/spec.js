/*global describe:true,it:true*/
define(['jquery', 'chai', 'main'],
function( $,        chai,   main) {

    var expect = chai.expect;

    describe('main', function() {
        describe('#version', function() {
            console.log("Running main#version");
            it('should use jQuery 1.7.2', function(){
                expect($.fn.jquery).to.equal('1.7.2');
            });
            it('should return "ok"', function(){
                expect(main()).to.equal('ok');
            });
        });

        console.log($.fn.jquery);
        console.log(expect);
        console.log(main);
    });

});
