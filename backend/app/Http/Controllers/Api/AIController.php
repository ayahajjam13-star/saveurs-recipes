<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class AIController extends Controller
{
    // الدالة القديمة (للـ Suggest Recipes)
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

        $cacheKey = 'ai_suggest_' . md5($userIngredients);
        if (Cache::has($cacheKey)) {
            $cachedData = Cache::get($cacheKey);
            if (!empty($cachedData)) {
                return response()->json(['recipes' => $cachedData, 'cached' => true]);
            }
        }

        $keywords = explode(',', $userIngredients);
        $directResults = Recipe::where(function ($query) use ($keywords) {
            foreach ($keywords as $keyword) {
                $query->orWhere('name', 'like', '%' . trim($keyword) . '%');
            }
        })->limit(3)->get();

        $recipes = Recipe::select('id', 'name')->get();
        $recipeList = $recipes->map(fn($r) => "{$r->id}: {$r->name}")->implode(", ");

        $prompt = "Find the best 3 recipe IDs for these ingredients: {$userIngredients}. " .
                  "Recipes: {$recipeList}. " .
                  "Return ONLY a JSON array of numbers like [1, 5, 12]. No text, no markdown.";

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => "Bearer {$apiKey}",
            ])->post("https://api.groq.com/openai/v1/chat/completions", [
                'model' => 'openai/gpt-oss-20b',
                'messages' => [
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.1,
                'max_tokens' => 50,
            ]);

            $data = $response->json();
            $text = $data['choices'][0]['message']['content'] ?? '';
            
            preg_match('/\[([\d,\s]+)\]/', $text, $matches);
            
            if (isset($matches[1])) {
                $ids = explode(',', $matches[1]);
                $ids = array_map('intval', array_map('trim', $ids));
            } else {
                preg_match_all('/\d+/', $text, $matches);
                $ids = array_map('intval', $matches[0] ?? []);
            }

            $suggested = collect();
            if (!empty($ids)) {
                $ids = array_slice($ids, 0, 3);
                $suggested = Recipe::whereIn('id', $ids)->get();
            }

            if ($suggested->isEmpty() && $directResults->isNotEmpty()) {
                $suggested = $directResults;
            }

            if ($suggested->isNotEmpty()) {
                Cache::put($cacheKey, $suggested, now()->addHours(24));
            }

            return response()->json(['recipes' => $suggested, 'cached' => false]);
            
        } catch (\Throwable $e) {
            if ($directResults->isNotEmpty()) {
                return response()->json(['recipes' => $directResults, 'cached' => false]);
            }
            return response()->json(['message' => 'AI service unavailable'], 500);
        }
    }

    // 🔥 الدالة الجديدة (للشات بوت AI Chef)
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:500',
        ]);

        $apiKey = env('GROQ_API_KEY');
        if (!$apiKey) {
            return response()->json(['message' => 'AI service not configured'], 500);
        }

        // جيب غير 20 وصفة باش الـ Prompt ما يطولش
        $recipes = Recipe::select('name', 'country')->take(20)->get();
        $recipeList = $recipes->map(fn($r) => "- {$r->name} ({$r->country})")->implode("\n");

        $prompt = "You are Chef Saveurs. User said: \"{$request->message}\".\n" .
                  "Recipes available:\n{$recipeList}\n" .
                  "Reply in the same language. If the user mentions ingredients, suggest 1-3 recipes from the list. Keep it short (max 3 sentences).";

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => "Bearer {$apiKey}",
            ])->post("https://api.groq.com/openai/v1/chat/completions", [
                'model' => 'openai/gpt-oss-20b',
                'messages' => [
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.6,
                'max_tokens' => 200,
            ]);

            if (!$response->successful()) {
                return response()->json(['message' => 'AI request failed', 'error' => $response->body()], 500);
            }

            $data = $response->json();
            $aiReply = $data['choices'][0]['message']['content'] ?? '';

            if (empty(trim($aiReply))) {
                $aiReply = "I'm here to help! Try asking me about a specific ingredient like 'chicken' or 'apple'.";
            }

            return response()->json([
                'reply' => $aiReply,
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'AI error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}