<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Recipe;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    // List user favorites
    public function index(Request $request)
    {
        $favorites = Favorite::where('user_id', $request->user()->id)
            ->pluck('recipe_id');

        $recipes = Recipe::whereIn('id', $favorites)->get();

        return response()->json($recipes);
    }

    // Add favorite
    public function store(Request $request)
    {
        $request->validate([
            'recipe_id' => 'required|integer',
        ]);

        // Check if recipe exists
        $recipe = Recipe::find($request->recipe_id);
        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }

        // Check if already favorite
        $exists = Favorite::where('user_id', $request->user()->id)
            ->where('recipe_id', $request->recipe_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already in favorites'], 409);
        }

        $favorite = Favorite::create([
            'user_id' => $request->user()->id,
            'recipe_id' => $request->recipe_id,
        ]);

        return response()->json([
            'message' => 'Added to favorites',
            'favorite' => $favorite,
        ], 201);
    }

    // Remove favorite
    public function destroy(Request $request, $recipeId)
    {
        $deleted = Favorite::where('user_id', $request->user()->id)
            ->where('recipe_id', $recipeId)
            ->delete();

        if (!$deleted) {
            return response()->json(['message' => 'Favorite not found'], 404);
        }

        return response()->json(['message' => 'Removed from favorites']);
    }

    // Check if a recipe is favorite
    public function check(Request $request, $recipeId)
    {
        $isFavorite = Favorite::where('user_id', $request->user()->id)
            ->where('recipe_id', $recipeId)
            ->exists();

        return response()->json(['is_favorite' => $isFavorite]);
    }
}