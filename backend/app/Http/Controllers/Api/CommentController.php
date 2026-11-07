<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Recipe;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // جلب تعليقات وصفة معينة
    public function index($recipeId)
    {
        $comments = Comment::with('user:id,name,avatar')
            ->where('recipe_id', $recipeId)
            ->latest()
            ->get();
            
        return response()->json($comments);
    }

    // إضافة تعليق جديد
    public function store(Request $request, $recipeId)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $recipe = Recipe::find($recipeId);
        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }

        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'recipe_id' => $recipeId,
            'content' => $request->content,
        ]);

        $comment->load('user:id,name,avatar');

        return response()->json($comment, 201);
    }
}