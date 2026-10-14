<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Recipe;

class RecipeSeeder extends Seeder
{
    public function run(): void
    {
        $json = file_get_contents(database_path('recipes.json'));
        $recipes = json_decode($json, true);

        foreach ($recipes as $recipe) {
            Recipe::create([
                'name' => $recipe['name'],
                'season' => $recipe['season'],
                'cuisine' => $recipe['cuisine'],
                'country' => $recipe['country'],
                'image' => $recipe['image'],
                'ingredients' => $recipe['ingredients'],
                'steps' => $recipe['steps'],
            ]);
        }

        $this->command->info('120 recipes imported successfully!');
    }
}