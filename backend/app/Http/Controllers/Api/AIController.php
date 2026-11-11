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

    // 🔥 الشات بوت AI Chef: وصفات السيت أولا + وصفات من برا إلا ما كايناش
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:500',
        ]);

        $apiKey = env('GROQ_API_KEY');
        if (!$apiKey) {
            return response()->json(['message' => 'AI service not configured'], 500);
        }

        $message = trim($request->message);

        // 1) قلب فالوصفات ديال السيت على الكلمات المهمة فالرسالة (الاسم أو المكونات)
        $words = collect(preg_split('/[^\p{L}]+/u', mb_strtolower($message), -1, PREG_SPLIT_NO_EMPTY))
            ->filter(fn($w) => mb_strlen($w) >= 3)
            ->unique()
            ->take(6)
            ->values();

        $siteRecipes = collect();
        if ($words->isNotEmpty()) {
            $siteRecipes = Recipe::select('id', 'name', 'country')
                ->where(function ($q) use ($words) {
                    foreach ($words as $w) {
                        $q->orWhere('name', 'like', "%{$w}%")
                          ->orWhere('ingredients', 'like', "%{$w}%");
                    }
                })
                ->limit(8)
                ->get();
        }

        $siteList = $siteRecipes->isNotEmpty()
            ? $siteRecipes->map(fn($r) => "- {$r->name} ({$r->country})")->implode("\n")
            : '(none found on the site for this request)';

        $system = "You are Chef Saveurs, a friendly cooking assistant for the recipe website Saveurs.\n" .
            "Always reply in the same language and dialect as the user (for Moroccan Darija, answer in Darija using Arabic script).\n" .
            "Rules:\n" .
            "1. If the list of Saveurs recipes below matches the request, recommend up to 3 of them first, using their exact names.\n" .
            "2. If fewer than 3 match, or none, ALSO suggest well-known recipes from anywhere in the world that fit the request. " .
            "Mark each of these with the label '(not on Saveurs yet)' and give 1 short line about it and its main ingredients.\n" .
            "3. Never claim that a recipe is on Saveurs unless it appears in the list.\n" .
            "4. If the user asks how to cook a specific dish, give clear short steps and ingredient amounts.\n" .
            "5. Keep answers practical and concise.";

        $user = "Saveurs recipes relevant to the request:\n{$siteList}\n\nUser message: \"{$message}\"";

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => "Bearer {$apiKey}",
            ])->timeout(40)->post("https://api.groq.com/openai/v1/chat/completions", [
                'model' => 'openai/gpt-oss-20b',
                'messages' => [
                    ['role' => 'system', 'content' => $system],
                    ['role' => 'user', 'content' => $user],
                ],
                'temperature' => 0.6,
                'max_tokens' => 1200,
            ]);

            if (!$response->successful()) {
                return response()->json(['message' => 'AI request failed', 'error' => $response->body()], 500);
            }

            $data = $response->json();
            $aiReply = $data['choices'][0]['message']['content'] ?? '';

            if (empty(trim($aiReply))) {
                $aiReply = "I'm here to help! Try asking me about an ingredient like 'chicken' or a dish like 'lasagna'.";
            }

            return response()->json([
                'reply' => $aiReply,
                'site_recipes' => $siteRecipes,
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'AI error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
