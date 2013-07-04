
/**
 * main javascript entry point - instruments banner animation.
 */
YUI().use('myrwa-banner', 'test', function(Y){
	
    Y.log( "Hello, World!", 2, "myrwa/main.js" );
    var banner = new Y.myrwa.banner.BannerView( 
            {
                container:"#banner"
            }
        );
    Y.assert( "banner is defined", ! Y.Lang.isUndefined( banner.get( "container" ) ) );
    banner.render();
});