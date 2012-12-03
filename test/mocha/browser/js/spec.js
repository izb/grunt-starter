/*global describe:true,it:true*/
define(['jquery', 'chai', 'main'],
function( $,        chai,   main) {

    var expect = chai.expect;

    describe('main', function() {

        describe('versions', function() {

            it('should use jQuery 1.7.2', function(){
                expect($.fn.jquery).to.equal('1.7.2');
            });

            it('should use submod v1', function(){
                expect(main.submodVer).to.equal(1);
            });

        });

        describe('#sayok', function() {

            it('should return "ok"', function(){
                expect(main.sayok()).to.equal('ok');
            });

        });

    });

});
