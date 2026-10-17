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
        $apiKey = env('GROQ_API_KEY');

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

        $prompt = "You are a JSON-only API. I have these ingredients: {$userIngredients}.\n\n" .
            "Available recipes:\n{$recipeList}\n\n" .
            "Task: Return the IDs of the 3 recipes that best match the ingredients.\n" .
            "STRICT RULES:\n" .
            "- Return ONLY a JSON array of integers, like [1, 5, 12].\n" .
            "- Do NOT include any text, explanation, or markdown.\n" .
            "- Do NOT wrap in ```json or any other syntax.\n" .
            "- If no recipes match, return [].\n\n" .
            "Output:";

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => "Bearer {$apiKey}",
            ])->post("https://api.groq.com/openai/v1/chat/completions", [
                'model' => 'llama-3.1-8b-instant',
                'messages' => [
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.1,
                'max_tokens' => 100,
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'message' => 'AI request failed',
                    'error' => $response->body(),
                ], 500);
            }

            $data = $response->json();
            $text = $data['choices'][0]['message']['content'] ?? '[]';

            // نظفو النص (إلا كان فيه markdown)
            $text = preg_replace('/```json\s*|\s*```/', '', $text);
            $text = trim($text);

            preg_match('/\[[\d,\s]*\]/', $text, $matches);
            $ids = isset($matches[0]) ? json_decode($matches[0], true) : [];

            if (!is_array($ids) || empty($ids)) {
                return response()->json(['recipes' => []]);
            }

            $suggested = Recipe::whereIn('id', $ids)->get();
            
            // خزني فـ Cache
            Cache::put($cacheKey, $suggested, now()->addHours(24));

            return response()->json([
                'recipes' => $suggested,
                'cached' => false,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'AI error: ' . $e->getMessage()], 500);
        }
    }
}