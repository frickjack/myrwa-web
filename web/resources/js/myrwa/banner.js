/*
 * Copyright 2013 http://mysticriver.org
 *
 * The contents of this file are freely available subject to the 
 * terms of the Apache 2.0 open source license.
 */


/**
 * see http://yuiblog.com/blog/2007/06/12/module-pattern/
 * YUI doc comments: http://developer.yahoo.com/yui/yuidoc/
 * YUI extension mechanism: http://developer.yahoo.com/yui/3/yui/#yuiadd
 *
 * @module myrwa-banner
 * @namespace myrwa
 */
YUI.add( 'myrwa-banner', function(Y) {
    Y.namespace('myrwa');

    function log( msg, level ) {
        level = level || 2;
        Y.log( msg, level, "myrwa/banner.js" );
    }
    
    /**
     * View abstraction for the header banner which animates with
     * transitions between a set of gallery images.  
     * Initialize with container
     * selector for markup initialized with banner images
     * ready for progressive enhancement.
     * 
     * @class BannerView
     */
    var BannerView = Y.Base.create( 'bannerView', Y.View, [], 
        {
            initializer:function(config) {
            },
                    
            render:function() {
                // do not setup the animation than once
                if ( this.rendered ) return;
                var container = this.get( "container" );
                var logoNode = container.one( "img.logo" );
                var imageNodes = container.all( "img" 
                         ).filter( function(img) { return ! Y.Node(img).hasClass( "logo" ); } );
                
                Y.assert( "Found image nodes", imageNodes.size() > 0 );
                
                // initialize the banner to show the first image
                imageNodes.each( function(n) { n.setStyle( "opacity", 0 ); } );
                imageNodes.item(0).setStyle( "opacity", 1 );
                
                if ( imageNodes.size() == 1 ) return;  // no need to animate
                
                var animPeriod = this.get( "animPeriodSecs" );
                if ( animPeriod < 2 ) {
                    // check for an attribute on the container if period not set in js code
                    var tmp = parseInt( container.getAttribute( "data-anim-period-secs" ) );
                    if ( tmp ) { animPeriod = tmp; }
                }
                if ( animPeriod < 2 ) animPeriod = 2;
                
                var currentImageIndex = 0;
                log( "Launching banner animation ..." );
                //
                // Every animPeriod seconds ease the current node out, and the new node in
                //
                Y.later( animPeriod * 1000, this, 
                    function(){
                        var nextImageIndex = (currentImageIndex + 1) % imageNodes.size();
                        var inNode = imageNodes.item( nextImageIndex );
                        var outNode = imageNodes.item( currentImageIndex );
                        //log( "banner transition from " + currentImageIndex + " to " + nextImageIndex );

                        inNode.setStyle( "opacity", 0 );
                        outNode.setStyle( "opacity", 1 );
                        inNode.show();
                        outNode.show();

                        outNode.transition( 
                                {
                                 easing: 'ease-out',
                                 duration: 0.75, // seconds
                                 opacity: 0
                                 }, 
                             function() { outNode.hide(); } 
                         );
                         inNode.transition(
                                 {
                                  easing: 'ease-in',
                                  duration: 0.75,
                                  opacity: 1
                                 }
                             );
                         currentImageIndex = nextImageIndex;
                    }, 
                    [], true
                );

                this.rendered = true;
            }
        }, 
        {
            ATTRS: {
                animPeriodSecs: {
                    value:0
                }
            }
        } 
    );

    //---------------------------------------

    Y.myrwa.banner = {
        BannerView:BannerView
    };
}, '0.1.1' /* module version */, {
    requires: [ 'node', 'test', 'transition', 'view']
});
