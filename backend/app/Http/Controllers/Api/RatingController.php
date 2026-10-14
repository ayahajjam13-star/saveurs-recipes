<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use App\Models\Recipe;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    // Get ratings for a recipe
    public function index($recipeId)
    {
        $ratings = Rating::where('recipe_id', $recipeId)
            ->with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        $average = $ratings->avg('score');
        $count = $ratings->count();

        return response()->json([
            'ratings' => $ratings,
            'average' => $average ? round($average, 1) : 0,
            'count' => $count,
        ]);
    }

    // Add or update rating
    public function store(Request $request)
    {
        $request->validate([
            'recipe_id' => 'required|integer',
            'score' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        $recipe = Recipe::find($request->recipe_id);
        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }

        $rating = Rating::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'recipe_id' => $request->recipe_id,
            ],
            [
                'score' => $request->score,
                'comment' => $request->comment,
            ]
        );

        return response()->json([
            'message' => 'Rating saved',
            'rating' => $rating,
        ], 201);
    }

    // Delete rating
    public function destroy(Request $request, $recipeId)
    {
        $deleted = Rating::where('user_id', $request->user()->id)
            ->where('recipe_id', $recipeId)
            ->delete();

        if (!$deleted) {
            return response()->json(['message' => 'Rating not found'], 404);
        }

        return response()->json(['message' => 'Rating deleted']);
    }

    // Check if user rated this recipe
    public function check(Request $request, $recipeId)
    {
        $rating = Rating::where('user_id', $request->user()->id)
            ->where('recipe_id', $recipeId)
            ->first();

        return response()->json([
            'has_rated' => $rating ? true : false,
            'rating' => $rating,
        ]);
    }
}