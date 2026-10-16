<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MealPlan;
use App\Models\Recipe;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MealPlanController extends Controller
{
    // Get meal plan for a week
    public function show(Request $request)
    {
        $weekStart = $request->input('week_start', Carbon::now()->startOfWeek()->toDateString());

        $plan = MealPlan::where('user_id', $request->user()->id)
            ->where('week_start', $weekStart)
            ->first();

        if (!$plan) {
            return response()->json([
                'week_start' => $weekStart,
                'meals' => [
                    'monday' => [],
                    'tuesday' => [],
                    'wednesday' => [],
                    'thursday' => [],
                    'friday' => [],
                    'saturday' => [],
                    'sunday' => [],
                ],
            ]);
        }

        // Enrich meals with recipe details
        $recipeIds = collect($plan->meals)->flatten()->unique()->filter()->values();
        $recipes = Recipe::whereIn('id', $recipeIds)->get()->keyBy('id');

        $mealsWithDetails = [];
        foreach ($plan->meals as $day => $ids) {
            $mealsWithDetails[$day] = collect($ids)
                ->map(fn($id) => $recipes->get($id))
                ->filter()
                ->values();
        }

        return response()->json([
            'week_start' => $plan->week_start->toDateString(),
            'meals' => $mealsWithDetails,
        ]);
    }

    // Save/Update meal plan
    public function store(Request $request)
    {
        $request->validate([
            'week_start' => 'required|date',
            'meals' => 'required|array',
        ]);

        $plan = MealPlan::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'week_start' => $request->week_start,
            ],
            [
                'meals' => $request->meals,
            ]
        );

        return response()->json([
            'message' => 'Meal plan saved',
            'plan' => $plan,
        ], 201);
    }

    // Add recipe to a day
    public function addRecipe(Request $request)
    {
        $request->validate([
            'week_start' => 'required|date',
            'day' => 'required|string|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'recipe_id' => 'required|integer|exists:recipes,id',
        ]);

        $plan = MealPlan::firstOrCreate(
            [
                'user_id' => $request->user()->id,
                'week_start' => $request->week_start,
            ],
            [
                'meals' => [
                    'monday' => [], 'tuesday' => [], 'wednesday' => [],
                    'thursday' => [], 'friday' => [], 'saturday' => [], 'sunday' => [],
                ],
            ]
        );

        $meals = $plan->meals;
        if (!in_array($request->recipe_id, $meals[$request->day] ?? [])) {
            $meals[$request->day][] = $request->recipe_id;
        }
        $plan->meals = $meals;
        $plan->save();

        return response()->json(['message' => 'Recipe added', 'plan' => $plan]);
    }

    // Remove recipe from a day
    public function removeRecipe(Request $request)
    {
        $request->validate([
            'week_start' => 'required|date',
            'day' => 'required|string',
            'recipe_id' => 'required|integer',
        ]);

        $plan = MealPlan::where('user_id', $request->user()->id)
            ->where('week_start', $request->week_start)
            ->first();

        if ($plan) {
            $meals = $plan->meals;
            $meals[$request->day] = array_values(
                array_filter($meals[$request->day] ?? [], fn($id) => $id != $request->recipe_id)
            );
            $plan->meals = $meals;
            $plan->save();
        }

        return response()->json(['message' => 'Recipe removed']);
    }

    // Shopping list from meal plan
    public function shoppingList(Request $request)
    {
        $weekStart = $request->input('week_start', Carbon::now()->startOfWeek()->toDateString());

        $plan = MealPlan::where('user_id', $request->user()->id)
            ->where('week_start', $weekStart)
            ->first();

        if (!$plan) {
            return response()->json(['ingredients' => []]);
        }

        $recipeIds = collect($plan->meals)->flatten()->unique()->filter()->values();
        $recipes = Recipe::whereIn('id', $recipeIds)->get();

        $allIngredients = [];
        foreach ($recipes as $recipe) {
            foreach ($recipe->ingredients as $ing) {
                $allIngredients[] = $ing;
            }
        }

        // Remove duplicates
        $uniqueIngredients = array_values(array_unique($allIngredients));

        return response()->json([
            'ingredients' => $uniqueIngredients,
            'count' => count($uniqueIngredients),
        ]);
    }
}