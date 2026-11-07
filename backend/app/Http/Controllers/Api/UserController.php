<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // جلب بروفايل عام لمستخدم معين
    public function show($id)
    {
        $user = User::withCount(['followers', 'following'])
            ->find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // جلب الوصفات المفضلة ديال هاد المستخدم
        $favorites = $user->favorites()->with('recipe')->get()->pluck('recipe')->filter();

        // جلب التقييمات (Reviews) اللي دار هاد المستخدم
        $ratings = $user->ratings()->with('recipe')->latest()->take(10)->get();

        return response()->json([
            'user' => $user,
            'followers_count' => $user->followers_count,
            'following_count' => $user->following_count,
            'favorites' => $favorites,
            'ratings' => $ratings,
        ]);
    }

    // متابعة أو إلغاء متابعة مستخدم
    public function toggleFollow(Request $request, $id)
    {
        $userToFollow = User::find($id);
        
        if (!$userToFollow) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($request->user()->id === $userToFollow->id) {
            return response()->json(['message' => 'You cannot follow yourself'], 400);
        }

        // Toggle (إلا كان تابعو، حيدو، إلا ما كانش، زيدو)
        $result = $request->user()->following()->toggle($userToFollow->id);

        $isFollowing = count($result['attached']) > 0;

        return response()->json([
            'message' => $isFollowing ? 'Followed successfully' : 'Unfollowed successfully',
            'is_following' => $isFollowing,
        ]);
    }
}