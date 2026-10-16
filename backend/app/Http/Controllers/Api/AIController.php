<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class AIController extends Controller
{
    public function suggestRecipes(Request $request)
    {
        $request->validate([
            'ingredients' => 'required|string|max:500',
        ]);

        $userIngredients = trim(strtolower($request->ingredients));
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            return response()->json(['message' => 'AI service not configured'], 500);
        }

        // Cache: نفس المكونات = نفس النتيجة (24 ساعة)
        $cacheKey = 'ai_suggest_' . md5($userIngredients);
        if (Cache::has($cacheKey)) {
            return response()->json([
                'recipes' => Cache::get($cacheKey),
                'cached' => true,
            ]);
        }

        $recipes = Recipe::select('id', 'name', 'cuisine', 'country')->get();
        $recipeList = $recipes->map(fn($r) => "{$r->id}. {$r->name} ({$r->cuisine}, {$r->country})")->implode("\n");

        $prompt = "I have these ingredients: {$userIngredients}. " .
            "Here is the list of available recipes:\n{$recipeList}\n\n" .
            "Which 3 recipes can I make with these ingredients? " .
            "Return ONLY a valid JSON array of recipe IDs, like this: [1, 5, 12]. " .
            "No explanation, no text, just the JSON array.";

        // Fallback: جربي موديلات مختلفة
        $models = [
            'gemini-flash-latest',
            'gemini-2.5-flash',
            'gemini-2.0-flash',
            'gemini-2.5-flash-lite',
        ];

        $lastError = null;

        foreach ($models as $model) {
            for ($attempt = 0; $attempt < 2; $attempt++) {
                try {
                    $response = Http::timeout(30)->withHeaders([
                        'Content-Type' => 'application/json',
                    ])->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}", [
                        'contents' => [
                            [
                                'parts' => [
                                    ['text' => $prompt],
                                ],
                            ],
                        ],
                        'generationConfig' => [
                            'temperature' => 0.3,
                            'maxOutputTokens' => 100,
                        ],
                    ]);

                    if ($response->successful()) {
                        $data = $response->json();
                        $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '[]';

                        preg_match('/\[[\d,\s]+\]/', $text, $matches);
                        $ids = isset($matches[0]) ? json_decode($matches[0], true) : [];

                        if (is_array($ids) && !empty($ids)) {
                            $suggested = Recipe::whereIn('id', $ids)->get();
                            
                            // خزني فـ Cache
                            Cache::put($cacheKey, $suggested, now()->addHours(24));

                            return response()->json([
                                'recipes' => $suggested,
                                'cached' => false,
                            ]);
                        }
                    }

                    // إلا 503 (Overloaded) — صبري وعاودي
                    if ($response->status() === 503) {
                        sleep(2);
                        continue;
                    }

                    // خطأ آخر — جربي الموديل الجاي
                    $lastError = $response->status();
                    break;

                } catch (\Exception $e) {
                    $lastError = $e->getMessage();
                    continue;
                }
            }
        }

        return response()->json([
            'message' => 'AI service temporarily unavailable. Please try again in a moment.',
            'error' => $lastError,
        ], 503);
    }
}