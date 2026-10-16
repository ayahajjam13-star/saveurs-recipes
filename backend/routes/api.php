<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\AIController;
use App\Http\Controllers\Api\MealPlanController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\GoogleAuthController;
use App\Http\Controllers\Api\EmailVerificationController;

// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Email Verification (Public — كيكليكي على الرابط من الإيميل)
Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

// Public Rating
Route::get('/ratings/{recipeId}', [RatingController::class, 'index']);

// AI (Public)
Route::post('/ai/suggest', [AIController::class, 'suggestRecipes']);

// Newsletter (Public)
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);

// Google OAuth
Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Email Verification (Send)
    Route::post('/email/verification-notification', [EmailVerificationController::class, 'send'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // Profile
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar']);
    Route::delete('/profile/avatar', [ProfileController::class, 'removeAvatar']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{recipeId}', [FavoriteController::class, 'destroy']);
    Route::get('/favorites/check/{recipeId}', [FavoriteController::class, 'check']);

    // Ratings
    Route::post('/ratings', [RatingController::class, 'store']);
    Route::delete('/ratings/{recipeId}', [RatingController::class, 'destroy']);
    Route::get('/ratings/check/{recipeId}', [RatingController::class, 'check']);

    // Meal Plans
    Route::get('/meal-plans', [MealPlanController::class, 'show']);
    Route::post('/meal-plans', [MealPlanController::class, 'store']);
    Route::post('/meal-plans/add', [MealPlanController::class, 'addRecipe']);
    Route::post('/meal-plans/remove', [MealPlanController::class, 'removeRecipe']);
    Route::get('/shopping-list', [MealPlanController::class, 'shoppingList']);
});

// Recipe Routes (Public)
Route::get('/recipes', [RecipeController::class, 'index']);
Route::get('/recipes/search', [RecipeController::class, 'search']);
Route::get('/recipes/search-by-ingredients', [RecipeController::class, 'searchByIngredients']);
Route::get('/recipes/stats/top-rated', [RecipeController::class, 'topRated']);
Route::get('/recipes/season/{season}', [RecipeController::class, 'bySeason']);
Route::get('/recipes/{id}', [RecipeController::class, 'show']);