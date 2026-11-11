<?php

namespace Database\Seeders;

use App\Models\Recipe;
use Illuminate\Database\Seeder;
use RuntimeException;

class AdditionalRecipeSeeder extends Seeder
{
    public function run(): void
    {
        $filePath = database_path('additional_recipes.json');

        if (!file_exists($filePath)) {
            throw new RuntimeException(
                'additional_recipes.json not found.'
            );
        }

        $json = file_get_contents($filePath);

        $recipes = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new RuntimeException(
                'Invalid JSON: ' . json_last_error_msg()
            );
        }

        if (!is_array($recipes)) {
            throw new RuntimeException('Invalid recipes data.');
        }

        $added = 0;
        $skipped = 0;

        foreach ($recipes as $recipe) {
            $requiredFields = [
                'name',
                'category',
                'season',
                'cuisine',
                'country',
                'image',
                'ingredients',
                'steps',
            ];

            foreach ($requiredFields as $field) {
                if (!isset($recipe[$field])) {
                    throw new RuntimeException(
                        "Missing field: {$field}"
                    );
                }
            }

            $result = Recipe::firstOrCreate(
                ['name' => $recipe['name']],
                [
                    'category' => $recipe['category'],
                    'season' => $recipe['season'],
                    'cuisine' => $recipe['cuisine'],
                    'country' => $recipe['country'],
                    'image' => $recipe['image'],
                    'ingredients' => $recipe['ingredients'],
                    'steps' => $recipe['steps'],
                ]
            );

            if ($result->wasRecentlyCreated) {
                $added++;
            } else {
                $skipped++;
            }
        }

        $this->command->info("Added: {$added} recipes");
        $this->command->info("Skipped: {$skipped} recipes");
    }
}
