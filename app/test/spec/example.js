define('test/example', ['jquery', 'main/main'], function($, run) {

    describe('main', function() {

        describe('app structure', function() {

            describe('vendors', function() {
                it('should use jQuery 1.9.1', function(){
                    expect($.fn.jquery).to.equal('1.9.1');
                });
            });

            it('should have a main function', function(){
                expect(typeof(run)).to.equal('function');
            });

        });

        describe('templates', function() {

            it('should render a template', function(){
                run();
                var names = $('#container ul li').map(function(i,e) {return $(e).text();});
                expect(names).to.have.length(4);
                expect(names[0]).to.equal("Jeff Smith");
                expect(names[1]).to.equal("Juliette Smith");
                expect(names[2]).to.equal("Allan McGuff");
                expect(names[3]).to.equal("Pete Hollinridge");
            });

        });

    });

});
