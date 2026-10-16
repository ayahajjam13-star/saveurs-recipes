<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;

class RecipeController extends Controller
{
    // كل الوصفات
    public function index()
    {
        return response()->json(Recipe::all());
    }

    // وصفة وحدة
    public function show($id)
    {
        $recipe = Recipe::find($id);
        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }
        return response()->json($recipe);
    }

    // حسب الموسم
    public function bySeason($season)
    {
        $recipes = Recipe::where('season', ucfirst($season))->get();
        return response()->json($recipes);
    }

    // البحث بالاسم
    public function search(Request $request)
    {
        $query = $request->input('q');
        $recipes = Recipe::where('name', 'like', "%$query%")->get();
        return response()->json($recipes);
    }
        // Top rated recipes
    public function topRated()
    {
        $recipes = Recipe::all();
        $ratings = \App\Models\Rating::all();

        $stats = $recipes->map(function ($recipe) use ($ratings) {
            $recipeRatings = $ratings->where('recipe_id', $recipe->id);
            $count = $recipeRatings->count();
            $avg = $count > 0 ? round($recipeRatings->avg('score'), 1) : 0;

            return [
                'recipe' => $recipe,
                'count' => $count,
                'average' => $avg,
            ];
        });

        // Top 10 by average (مع شرط على الأقل 1 rating)
        $topRated = $stats->filter(fn($s) => $s['count'] > 0)
            ->sortByDesc('average')
            ->take(10)
            ->values();

        // Top 10 by count
        $mostRated = $stats->sortByDesc('count')
            ->take(10)
            ->values();

        // Distribution
        $distribution = [
            '5' => $ratings->where('score', 5)->count(),
            '4' => $ratings->where('score', 4)->count(),
            '3' => $ratings->where('score', 3)->count(),
            '2' => $ratings->where('score', 2)->count(),
            '1' => $ratings->where('score', 1)->count(),
        ];

        return response()->json([
            'total_recipes' => $recipes->count(),
            'total_ratings' => $ratings->count(),
            'average_rating' => $ratings->count() > 0 ? round($ratings->avg('score'), 2) : 0,
            'top_rated' => $topRated,
            'most_rated' => $mostRated,
            'distribution' => $distribution,
        ]);
    }

    // البحث بالمكونات
    public function searchByIngredients(Request $request)
    {
        $request->validate([
            'ingredients' => 'required|string|max:500',
        ]);

        $searchTerms = array_map('trim', explode(',', strtolower($request->ingredients)));
        $searchTerms = array_filter($searchTerms);

        if (empty($searchTerms)) {
            return response()->json(['recipes' => []]);
        }

        $allRecipes = Recipe::all();
        $matched = [];

        foreach ($allRecipes as $recipe) {
            $recipeIngredients = strtolower(implode(' ', $recipe->ingredients));
            $matchCount = 0;

            foreach ($searchTerms as $term) {
                if (str_contains($recipeIngredients, $term)) {
                    $matchCount++;
                }
            }

            if ($matchCount > 0) {
                $recipeArray = $recipe->toArray();
                $recipeArray['match_count'] = $matchCount;
                $recipeArray['match_percent'] = round(($matchCount / count($searchTerms)) * 100);
                $matched[] = $recipeArray;
            }
        }

        usort($matched, fn($a, $b) => $b['match_percent'] <=> $a['match_percent']);

        return response()->json(['recipes' => $matched]);
    }
}