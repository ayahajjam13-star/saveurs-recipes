<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $apiKey = env('BREVO_API_KEY');

        if (!$apiKey) {
            return response()->json(['message' => 'Newsletter service not configured'], 500);
        }

        try {
            $response = Http::withHeaders([
                'api-key' => $apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post('https://api.brevo.com/v3/contacts', [
                'email' => $request->email,
                'listIds' => [3],
                'updateEnabled' => true,
            ]);

            if ($response->successful() || $response->status() === 204) {
                return response()->json(['message' => 'Subscribed successfully!']);
            }

            if ($response->status() === 400 && str_contains($response->body(), 'Contact already exist')) {
                return response()->json(['message' => 'You are already subscribed!']);
            }

            return response()->json([
                'message' => 'Subscription failed',
                'error' => $response->body(),
            ], 500);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Newsletter error: ' . $e->getMessage()], 500);
        }
    }
}