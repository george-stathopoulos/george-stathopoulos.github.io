/* George Stathopoulos — theme, menu, gentle reveals and the hero smoke. */
( function () {
	'use strict';

	var root = document.documentElement;
	root.classList.remove( 'no-js' );
	var reduceMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' );

	/* Theme ------------------------------------------------------------ */
	function store( key, value ) {
		try {
			if ( value === undefined ) {
				return localStorage.getItem( key );
			}
			localStorage.setItem( key, value );
		} catch ( e ) {}
		return null;
	}

	function isDark() {
		return root.dataset.theme
			? root.dataset.theme === 'dark'
			: window.matchMedia( '(prefers-color-scheme: dark)' ).matches;
	}

	document.querySelectorAll( '[data-theme-toggle]' ).forEach( function ( btn ) {
		btn.setAttribute( 'aria-pressed', isDark() ? 'true' : 'false' );
		btn.addEventListener( 'click', function () {
			root.dataset.theme = isDark() ? 'light' : 'dark';
			store( 'gs-theme', root.dataset.theme );
			btn.setAttribute( 'aria-pressed', isDark() ? 'true' : 'false' );
		} );
	} );

	/* Mobile menu ------------------------------------------------------ */
	var menuBtn = document.querySelector( '[data-menu-toggle]' );
	var nav = document.getElementById( 'site-nav' );
	if ( menuBtn && nav ) {
		var setOpen = function ( open ) {
			nav.classList.toggle( 'is-open', open );
			menuBtn.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
		};
		menuBtn.addEventListener( 'click', function () {
			setOpen( ! nav.classList.contains( 'is-open' ) );
		} );
		nav.addEventListener( 'click', function ( e ) {
			if ( e.target.closest( 'a' ) ) {
				setOpen( false );
			}
		} );
		document.addEventListener( 'keydown', function ( e ) {
			if ( e.key === 'Escape' && nav.classList.contains( 'is-open' ) ) {
				setOpen( false );
				menuBtn.focus();
			}
		} );
	}

	/* Reveal once, gently ---------------------------------------------- */
	var reveals = document.querySelectorAll( '.reveal' );
	if ( 'IntersectionObserver' in window && ! reduceMotion.matches ) {
		var ro = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( e ) {
					if ( e.isIntersecting ) {
						e.target.classList.add( 'in' );
						ro.unobserve( e.target );
					}
				} );
			},
			{ rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
		);
		reveals.forEach( function ( el ) {
			ro.observe( el );
		} );
	} else {
		reveals.forEach( function ( el ) {
			el.classList.add( 'in' );
		} );
	}

	/* Highlight the section in view ------------------------------------ */
	var links = document.querySelectorAll( '#site-nav a[href^="#"]' );
	if ( links.length && 'IntersectionObserver' in window ) {
		var byId = {};
		links.forEach( function ( a ) {
			byId[ a.getAttribute( 'href' ).slice( 1 ) ] = a;
		} );
		var so = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( e ) {
					if ( e.isIntersecting && byId[ e.target.id ] ) {
						links.forEach( function ( a ) {
							a.removeAttribute( 'aria-current' );
						} );
						byId[ e.target.id ].setAttribute( 'aria-current', 'true' );
					}
				} );
			},
			{ rootMargin: '-35% 0px -60% 0px' }
		);
		Object.keys( byId ).forEach( function ( id ) {
			var el = document.getElementById( id );
			if ( el ) {
				so.observe( el );
			}
		} );
	}

	/* Hero smoke ------------------------------------------------------- */
	// Soft, slow wisps drifting upward. Drawn small and stretched (smoke is blurry anyway),
	// paused when the hero is off screen or the tab is hidden, and a single still frame
	// when the visitor prefers reduced motion.
	var canvas = document.getElementById( 'smoke' );
	if ( ! canvas || ! canvas.getContext ) {
		return;
	}
	var ctx = canvas.getContext( '2d' );
	var hero = canvas.parentElement;
	var SCALE = 0.5;
	var W = 0;
	var H = 0;
	var puffs = [];

	// One irregular puff sprite: several offset soft circles, so wisps look like smoke, not bokeh.
	var sprite = document.createElement( 'canvas' );
	sprite.width = sprite.height = 256;
	( function () {
		var s = sprite.getContext( '2d' );
		var seed = 7;
		var rnd = function () {
			seed = ( seed * 16807 ) % 2147483647;
			return seed / 2147483647;
		};
		for ( var i = 0; i < 14; i++ ) {
			var x = 128 + ( rnd() - 0.5 ) * 110;
			var y = 128 + ( rnd() - 0.5 ) * 110;
			var r = 40 + rnd() * 70;
			var g = s.createRadialGradient( x, y, 0, x, y, r );
			g.addColorStop( 0, 'rgba(255,255,255,0.22)' );
			g.addColorStop( 0.6, 'rgba(255,255,255,0.07)' );
			g.addColorStop( 1, 'rgba(255,255,255,0)' );
			s.fillStyle = g;
			s.beginPath();
			s.arc( x, y, r, 0, Math.PI * 2 );
			s.fill();
		}
	} )();

	var TINTS = [ [ 201, 194, 255 ], [ 255, 255, 255 ], [ 165, 156, 240 ] ];

	function makePuff( fresh ) {
		var size = ( 0.35 + Math.random() * 0.45 ) * Math.max( W, H );
		return {
			x: Math.random() * W,
			y: fresh ? Math.random() * H : H + size * 0.3,
			size: size,
			vx: ( Math.random() - 0.5 ) * 0.08,
			vy: -( 0.06 + Math.random() * 0.12 ),
			rot: Math.random() * Math.PI * 2,
			vr: ( Math.random() - 0.5 ) * 0.0012,
			life: fresh ? Math.random() : 0,
			speed: 0.0006 + Math.random() * 0.0006,
			tint: TINTS[ Math.floor( Math.random() * TINTS.length ) ],
			phase: Math.random() * Math.PI * 2,
		};
	}

	function resize() {
		var rect = hero.getBoundingClientRect();
		W = Math.max( 1, Math.round( rect.width * SCALE ) );
		H = Math.max( 1, Math.round( rect.height * SCALE ) );
		canvas.width = W;
		canvas.height = H;
		var count = Math.round( Math.min( 22, Math.max( 10, ( W * H ) / 9000 ) ) );
		puffs = [];
		for ( var i = 0; i < count; i++ ) {
			puffs.push( makePuff( true ) );
		}
	}

	function draw( t ) {
		ctx.clearRect( 0, 0, W, H );
		ctx.globalCompositeOperation = 'lighter';
		for ( var i = 0; i < puffs.length; i++ ) {
			var p = puffs[ i ];
			var fade = Math.sin( Math.PI * Math.min( 1, p.life ) );
			ctx.save();
			ctx.globalAlpha = 0.12 * fade;
			ctx.translate( p.x + Math.sin( t * 0.0002 + p.phase ) * 12, p.y );
			ctx.rotate( p.rot );
			ctx.drawImage( sprite, -p.size / 2, -p.size / 2, p.size, p.size );
			ctx.restore();
		}
		ctx.globalCompositeOperation = 'source-over';
	}

	function step() {
		for ( var i = 0; i < puffs.length; i++ ) {
			var p = puffs[ i ];
			p.x += p.vx;
			p.y += p.vy;
			p.rot += p.vr;
			p.life += p.speed;
			if ( p.life >= 1 ) {
				puffs[ i ] = makePuff( false );
			}
		}
	}

	var running = false;
	var visible = true;
	function frame( t ) {
		if ( ! running ) {
			return;
		}
		step();
		draw( t );
		requestAnimationFrame( frame );
	}

	function update() {
		var should = visible && ! document.hidden && ! reduceMotion.matches;
		if ( should && ! running ) {
			running = true;
			requestAnimationFrame( frame );
		} else if ( ! should ) {
			running = false;
		}
	}

	resize();
	draw( 0 );

	if ( 'ResizeObserver' in window ) {
		var lastW = 0;
		new ResizeObserver( function ( entries ) {
			// Ignore height-only changes (mobile address bar), which would reset the smoke.
			var w = Math.round( entries[ 0 ].contentRect.width );
			if ( w !== lastW ) {
				lastW = w;
				resize();
				draw( performance.now() );
			}
		} ).observe( hero );
	}
	if ( 'IntersectionObserver' in window ) {
		new IntersectionObserver( function ( entries ) {
			visible = entries[ 0 ].isIntersecting;
			update();
		} ).observe( hero );
	}
	document.addEventListener( 'visibilitychange', update );
	if ( reduceMotion.addEventListener ) {
		reduceMotion.addEventListener( 'change', update );
	}
	update();
} )();
