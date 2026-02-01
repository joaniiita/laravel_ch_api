<?php

use App\Http\Controllers\admin\AdminCategoryController;
use App\Http\Controllers\admin\AdminPetitionController;
use App\Http\Controllers\admin\AdminUserController;
use App\Http\Controllers\auth\AuthController;
use App\Http\Controllers\user\CategoryController;
use App\Http\Controllers\user\PetitionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'auth', 'middleware' => 'api'], function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:api');
});

Route::group(['middleware' => 'api', 'prefix' => 'admin'], function () {
    Route::get('categories', [AdminCategoryController::class, 'index']);
    Route::get('category/{category}', [AdminCategoryController::class, 'show']);
    Route::post('category', [AdminCategoryController::class, 'create']);
    Route::put('category/{category}', [AdminCategoryController::class, 'update']);
    Route::delete('category/{category}', [AdminCategoryController::class, 'destroy']);

});

Route::group(['middleware' => 'api'], function () {
    Route::get('petitions', [PetitionController::class, 'index']);
    Route::get('petition/{petition}', [PetitionController::class, 'show']);
    Route::post('petition', [PetitionController::class, 'create']);
    Route::put('petition/{petition}', [PetitionController::class, 'update']);
    Route::delete('petition/{petition}', [PetitionController::class, 'destroy']);
    Route::post('petition/{petition}/sign', [PetitionController::class, 'sign']);
});

Route::group(['middleware' => 'api', 'prefix' => 'admin'], function () {
    Route::get('petitions', [AdminPetitionController::class, 'index']);
    Route::get('petition/{petition}', [AdminPetitionController::class, 'show']);
    Route::post('petition', [AdminPetitionController::class, 'create']);
    Route::put('petition/{petition}', [AdminPetitionController::class, 'update']);
    Route::delete('petition/{petition}', [AdminPetitionController::class, 'destroy']);
    Route::post('petition/{petition}/change', [AdminPetitionController::class, 'changeStatus']);
});

//Route::middleware('admin')->controller(AdminPetitionController::class)->group(function () {
//    Route::get('admin', 'home')->name('admin.home');
//    Route::get('admin/petitions/index', 'home')->name('adminpetitions.index');
//    Route::get('admin/petition/{id}', 'show')->name('adminpetitions.show');
//    Route::get('admin/petitions/add', 'create')->name('adminpetitions.create');
//    Route::get('admin/petitions/edit/{id}', 'edit')->name('adminpetitions.edit');
//    Route::post('admin/petitions', 'store')->name('adminpetitions.store');
//    Route::delete('admin/petitions/{id}', 'delete')->name('adminpetitions.delete');
//    Route::put('admin/petitions/{id}', 'update')->name('adminpetitions.update');
//    Route::put('admin/petitions/status/{id}', 'changeStatus')->name('adminpetitions.estado');
//    Route::put('admin/petition/{id}', 'changeStatus')->name('adminpetitions.change');
//});
//
//Route::middleware('admin')->controller(AdminUserController::class)->group(function () {
//    Route::get('admin/users/index', 'index')->name('adminusers.index');
//    Route::get('admin/user/{id}', 'show')->name('adminusers.show');
//    Route::get('admin/users/edit/{id}', 'edit')->name('adminusers.edit');
//    Route::delete('admin/users/{id}', 'delete')->name('adminusers.delete');
//    Route::put('admin/users/{id}', 'update')->name('adminusers.update');
//});
//
//
//Route::controller(PetitionController::class)->group(function () {
//    Route::get('petitions/index', 'index')->name('petitions.index');
//    Route::get('petitions/{id}', 'show')->name('petitions.show');
//    Route::delete('petition/{id}', 'delete')->name('petitions.delete');
//    Route::put('petition/{id}', 'update')->name('petitions.update');
//    Route::get('petition/edit/{id}', 'edit')->name('petitions.edit');
//});
//
//Route::controller(PetitionController::class)->middleware('auth')->group(function () {
//    Route::get('mypetitions', 'listMine')->name('petitions.mine');
//    Route::get('signedPetitions', 'signedPetitions')->name('petitions.signedPetitions');
//    Route::get('petition/add', 'create')->name('petitions.create');
//    Route::post('petition', 'store')->name('petitions.store');
//    Route::post('petition/sign/{id}', 'sign')->name('petitions.sign');
//});
