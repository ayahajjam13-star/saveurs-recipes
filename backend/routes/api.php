<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\RatingController;

// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public Rating (Read)
Route::get('/ratings/{recipeId}', [RatingController::class, 'index']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{recipeId}', [FavoriteController::class, 'destroy']);
    Route::get('/favorites/check/{recipeId}', [FavoriteController::class, 'check']);
    
    // Ratings
    Route::post('/ratings', [RatingController::class, 'store']);
    Route::delete('/ratings/{recipeId}', [RatingController::class, 'destroy']);
    Route::get('/ratings/check/{recipeId}', [RatingController::class, 'check']);
});

// Recipe Routes (Public)
Route::get('/recipes', [RecipeController::class, 'index']);
Route::get('/recipes/search', [RecipeController::class, 'search']);
Route::get('/recipes/season/{season}', [RecipeController::class, 'bySeason']);
Route::get('/recipes/{id}', [RecipeController::class, 'show']);