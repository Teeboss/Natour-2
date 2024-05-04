<?php

// autoload_real.php @generated by Composer

class ComposerAutoloaderInit15f96a0f28c1b36632e3b0f2577e8bb6
{
    private static $loader;

    public static function loadClassLoader($class)
    {
        if ('Composer\Autoload\ClassLoader' === $class) {
            require __DIR__ . '/ClassLoader.php';
        }
    }

    /**
     * @return \Composer\Autoload\ClassLoader
     */
    public static function getLoader()
    {
        if (null !== self::$loader) {
            return self::$loader;
        }

        spl_autoload_register(array('ComposerAutoloaderInit15f96a0f28c1b36632e3b0f2577e8bb6', 'loadClassLoader'), true, true);
        self::$loader = $loader = new \Composer\Autoload\ClassLoader(\dirname(__DIR__));
        spl_autoload_unregister(array('ComposerAutoloaderInit15f96a0f28c1b36632e3b0f2577e8bb6', 'loadClassLoader'));

        require __DIR__ . '/autoload_static.php';
        call_user_func(\Composer\Autoload\ComposerStaticInit15f96a0f28c1b36632e3b0f2577e8bb6::getInitializer($loader));

        $loader->register(true);

        return $loader;
    }
}
