<?php
/**
 * Suppress PHP 8.2+ deprecation (e.g. ACF dynamic properties).
 * Copy to: wp-content/mu-plugins/0-suppress-deprecation.php
 * Must be directly in mu-plugins. "0-" makes it load first.
 */
if ( PHP_VERSION_ID >= 80200 ) {
    error_reporting( E_ALL & ~E_DEPRECATED & ~E_STRICT );
    set_error_handler( function ( $errno, $errstr, $errfile, $errline ) {
        if ( $errno === E_DEPRECATED || $errno === E_STRICT ) {
            return true;
        }
        return false;
    }, E_ALL );
}
