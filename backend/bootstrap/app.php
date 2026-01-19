<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        using: function(Illuminate\Routing\Router $router): void {
            $router->middleware('api')->prefix('api')->group(base_path('routes/api.php'));
            $router->middleware('web')->group(base_path('routes/web.php'));
        }
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->validateCsrfTokens(except: ['login', 'register']);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
