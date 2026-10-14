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

    // البحث
    public function search(Request $request)
    {
        $query = $request->input('q');
        $recipes = Recipe::where('name', 'like', "%$query%")->get();
        return response()->json($recipes);
    }
}