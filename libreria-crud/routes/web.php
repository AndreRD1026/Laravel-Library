<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/books', function () {
    return Inertia::render('Books');
})->name('books');


Route::get('/authors', function () {
    return Inertia::render('Authors');
})->name('authors');

Route::get('/categories', function () {
    return Inertia::render('Categories');
})->name('categories');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
