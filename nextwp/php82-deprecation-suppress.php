<?php
/**
 * Hide PHP 8.2 deprecation (ACF "dynamic property ... line 35").
 * Copy to: wp-content/mu-plugins/0-suppress-deprecation.php (directly in mu-plugins).
 *
 * Approach: buffer output and strip Deprecated lines so they never reach the browser.
 */
if ( PHP_VERSION_ID >= 80200 ) {
    ini_set( 'display_errors', 0 );
    error_reporting( E_ALL & ~E_DEPRECATED & ~E_STRICT );
    set_error_handler( function ( $errno, $errstr ) {
        if ( $errno === E_DEPRECATED || $errno === E_STRICT ) {
            return true;
        }
        return false;
    }, E_ALL );
    ob_start( function ( $buffer ) {
        if ( $buffer === null || $buffer === '' ) {
            return $buffer;
        }
        return preg_replace( '/\s*Deprecated:.*?(?=\n|$)/m', '', $buffer );
    } );
}
