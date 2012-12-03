/*global describe:true,it:true*/
define(['jquery', 'chai', 'main', 'use!handlebars'],
function($,        chai,   main,   Handlebars) {

    var expect = chai.expect;

    describe('main', function() {

        describe('versions', function() {

            it('should use jQuery 1.8.3', function(){
                expect($.fn.jquery).to.equal('1.8.3');
            });

            it('should use submod v1', function(){
                expect(main.submodVer).to.equal(1);
            });

            it('should have templates loaded', function(){
                expect(Handlebars.templates.listitem({items:[{name:1},{name:2},{name:3}]})).to.equal(
                    '<ul>\n\n' +
                    '    <li class="myli">1</li>\n\n' +
                    '    <li class="myli">2</li>\n\n' +
                    '    <li class="myli">3</li>\n\n' +
                    '</ul>\n');
            });

        });

        describe('#sayok', function() {

            it('should return "ok"', function(){
                expect(main.sayok()).to.equal('ok');
            });

        });

    });

});
