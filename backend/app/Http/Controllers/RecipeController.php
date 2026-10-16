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