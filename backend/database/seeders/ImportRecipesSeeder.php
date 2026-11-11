
<?php

namespace Database\Seeders;

use App\Models\Recipe;
use Illuminate\Database\Seeder;
use RuntimeException;

class ImportRecipesSeeder extends Seeder
{
    public function run(): void
    {
        $files = [
            'recipes.json',
            'additional_recipes.json',
        ];

        $unique = [];

        foreach ($files as $file) {
            $path = database_path($file);

            if (!file_exists($path)) {
                throw new RuntimeException("$file not found");
            }

            $recipes = json_decode(file_get_contents($path), true);

            if (!is_array($recipes)) {
                throw new RuntimeException("Invalid JSON: $file");
            }

            foreach ($recipes as $recipe) {
                $name = trim($recipe['name'] ?? '');

                if ($name === '') {
                    continue;
                }

                $key = mb_strtolower($name);

                $unique[$key] = [
                    'name' => $name,
                    'category' => $recipe['category'] ?? 'Other',
                    'season' => $recipe['season'],
                    'cuisine' => $recipe['cuisine'],
                    'country' => $recipe['country'],
                    'image' => $recipe['image'],
                    'ingredients' => $recipe['ingredients'],
                    'steps' => $recipe['steps'],
                ];
            }
        }

        foreach ($unique as $recipe) {
            Recipe::updateOrCreate(
                ['name' => $recipe['name']],
                $recipe
            );
        }

        $this->command->info(
            count($unique) . ' recipes imported successfully!'
        );
    }
}
