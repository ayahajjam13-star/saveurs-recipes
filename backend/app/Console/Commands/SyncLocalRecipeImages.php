<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class SyncLocalRecipeImages extends Command
{
    protected $signature = 'recipes:sync-local-images {--apply}';

    protected $description = 'Sync recipe images from the local export';

    public function handle(): int
    {
        $path = database_path('local_recipe_images.json');

        if (!file_exists($path)) {
            throw new RuntimeException('Local recipe images file not found.');
        }

        $localRows = json_decode(file_get_contents($path), true);

        if (!is_array($localRows)) {
            throw new RuntimeException('Invalid JSON file.');
        }

        $categories = [
            'Breakfast',
            'Lunch',
            'Dinner',
            'Desserts',
            'Healthy',
            'Vegan',
            'Quick & Easy',
        ];

        $localMap = [];

        foreach ($localRows as $row) {
            if (
                !isset($row['name'], $row['category']) ||
                !in_array($row['category'], $categories, true)
            ) {
                continue;
            }

            $key = strtolower(trim($row['name'])) . '|' .
                   strtolower(trim($row['category']));

            if (isset($localMap[$key])) {
                $localMap[$key] = null;
                continue;
            }

            $localMap[$key] = $row;
        }

        $onlineRows = DB::table('recipes')
            ->whereIn('category', $categories)
            ->get(['id', 'name', 'category', 'image']);

        $updates = [];
        $missing = 0;
        $ambiguous = 0;

        foreach ($onlineRows as $online) {
            $key = strtolower(trim($online->name)) . '|' .
                   strtolower(trim($online->category));

            if (!array_key_exists($key, $localMap)) {
                $missing++;
                continue;
            }

            if ($localMap[$key] === null) {
                $ambiguous++;
                continue;
            }

            $newImage = $localMap[$key]['image'] ?? null;

            if (!$newImage) {
                $missing++;
                continue;
            }

            if ($online->image !== $newImage) {
                $updates[] = [
                    'id' => $online->id,
                    'name' => $online->name,
                    'category' => $online->category,
                    'old_image' => $online->image,
                    'new_image' => $newImage,
                ];
            }
        }

        $this->info('Railway recipes checked: ' . $onlineRows->count());
        $this->info('Images to update: ' . count($updates));
        $this->info('No matching local recipe/image: ' . $missing);
        $this->info('Ambiguous local matches: ' . $ambiguous);

        if (!$this->option('apply')) {
            $this->warn('DRY RUN: No database changes were made.');
            $this->info('Run with --apply only after reviewing this result.');
            return self::SUCCESS;
        }

        $backupName = 'recipe-image-backup-' . now()->format('Ymd-His') . '.json';
        $backupPath = storage_path('app/' . $backupName);

        file_put_contents(
            $backupPath,
            json_encode($updates, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );

        foreach ($updates as $item) {
            DB::table('recipes')
                ->where('id', $item['id'])
                ->update(['image' => $item['new_image']]);
        }

        $this->info('Updated images: ' . count($updates));
        $this->info('Backup saved: ' . $backupPath);

        return self::SUCCESS;
    }
}
