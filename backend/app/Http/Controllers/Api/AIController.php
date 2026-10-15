<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AIController extends Controller
{
    public function suggestRecipes(Request $request)
    {
        $request->validate([
            'ingredients' => 'required|string|max:500',
        ]);

        $userIngredients = $request->ingredients;
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            return response()->json(['message' => 'AI service not configured'], 500);
        }

        $recipes = Recipe::select('id', 'name', 'cuisine', 'country')->get();
        $recipeList = $recipes->map(fn($r) => "{$r->id}. {$r->name} ({$r->cuisine}, {$r->country})")->implode("\n");

        $prompt = "I have these ingredients: {$userIngredients}. " .
            "Here is the list of available recipes:\n{$recipeList}\n\n" .
            "Which 3 recipes can I make with these ingredients? " .
            "Return ONLY a valid JSON array of recipe IDs, like this: [1, 5, 12]. " .
            "No explanation, no text, just the JSON array.";

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt],
                        ],
                    ],
                ],
                'generationConfig' => [
                    'thinkingConfig' => [
                        'thinkingBudget' => 0,
                    ],
                ],
            ]);

            if (!$response->successful()) {
                $errorBody = $response->body();
                return response()->json([
                    'message' => 'AI request failed',
                    'status' => $response->status(),
                    'error' => $errorBody,
                ], 500);
            }

            $data = $response->json();
            $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '[]';

            preg_match('/\[[\d,\s]+\]/', $text, $matches);
            $ids = isset($matches[0]) ? json_decode($matches[0], true) : [];

            if (!is_array($ids) || empty($ids)) {
                return response()->json(['recipes' => []]);
            }

            $suggested = Recipe::whereIn('id', $ids)->get();

            return response()->json(['recipes' => $suggested]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'AI error: ' . $e->getMessage()], 500);
        }
    }
}