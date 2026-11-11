<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * "What's in Your Fridge?"
 * كياخد المكونات لي عند المستخدم، وكيرجع الوصفات مرتبة حسب شحال عندو منها.
 */
class FridgeController extends Controller
{
    /** كلمات كنعتبروها دايما موجودة فالدار (إلا فعّل المستخدم الخيار) */
    private const STAPLE_WORDS = ['salt', 'water', 'oil'];
    private const STAPLE_PHRASES = ['black pepper', 'white pepper', 'ground pepper', 'salt and pepper'];

    /** عربي / فرنسي  ->  إنجليزي (الوصفات مكتوبة بالإنجليزية) */
    private const SYNONYMS = [
        // عربي
        'طماطم' => 'tomato', 'طماطيم' => 'tomato', 'بندورة' => 'tomato',
        'بصل' => 'onion', 'بصلة' => 'onion', 'ثوم' => 'garlic',
        'بطاطس' => 'potato', 'بطاطا' => 'potato', 'جزر' => 'carrot',
        'أرز' => 'rice', 'ارز' => 'rice', 'رز' => 'rice',
        'دجاج' => 'chicken', 'جاج' => 'chicken', 'لحم' => 'beef', 'لحم بقري' => 'beef',
        'لحم غنم' => 'lamb', 'خروف' => 'lamb', 'سمك' => 'fish', 'حوت' => 'fish',
        'تونة' => 'tuna', 'جمبري' => 'shrimp', 'قمرون' => 'shrimp',
        'بيض' => 'egg', 'بيضة' => 'egg', 'حليب' => 'milk', 'جبن' => 'cheese', 'فرماج' => 'cheese',
        'زبدة' => 'butter', 'قشدة' => 'cream', 'زبادي' => 'yogurt', 'ياغورت' => 'yogurt',
        'زيت' => 'oil', 'زيتون' => 'olive', 'زيت الزيتون' => 'olive oil',
        'ليمون' => 'lemon', 'حامض' => 'lemon', 'فلفل' => 'pepper', 'فلفل حلو' => 'bell pepper',
        'خيار' => 'cucumber', 'خس' => 'lettuce', 'سبانخ' => 'spinach', 'فطر' => 'mushroom',
        'كوسة' => 'zucchini', 'كورجيت' => 'zucchini', 'باذنجان' => 'eggplant', 'دنجال' => 'eggplant',
        'قرع' => 'pumpkin', 'دلاع' => 'watermelon', 'ذرة' => 'corn', 'بسلة' => 'peas',
        'فاصوليا' => 'beans', 'لوبيا' => 'beans', 'عدس' => 'lentil', 'حمص' => 'chickpea', 'فول' => 'fava',
        'معكرونة' => 'pasta', 'مقرونة' => 'pasta', 'دقيق' => 'flour', 'طحين' => 'flour',
        'سكر' => 'sugar', 'ملح' => 'salt', 'خبز' => 'bread', 'عسل' => 'honey',
        'كمون' => 'cumin', 'زنجبيل' => 'ginger', 'قرفة' => 'cinnamon', 'كزبرة' => 'coriander',
        'قزبر' => 'coriander', 'معدنوس' => 'parsley', 'بقدونس' => 'parsley', 'نعناع' => 'mint',
        'تفاح' => 'apple', 'موز' => 'banana', 'برتقال' => 'orange', 'لوز' => 'almond',
        'فراولة' => 'strawberry', 'شوكولاتة' => 'chocolate', 'شكولاط' => 'chocolate',
        // فرنسي
        'tomate' => 'tomato', 'oignon' => 'onion', 'ail' => 'garlic',
        'pomme de terre' => 'potato', 'patate' => 'potato', 'carotte' => 'carrot', 'riz' => 'rice',
        'poulet' => 'chicken', 'boeuf' => 'beef', 'bœuf' => 'beef', 'agneau' => 'lamb',
        'poisson' => 'fish', 'thon' => 'tuna', 'crevette' => 'shrimp', 'crevettes' => 'shrimp',
        'oeuf' => 'egg', 'oeufs' => 'egg', 'œuf' => 'egg', 'œufs' => 'egg',
        'lait' => 'milk', 'fromage' => 'cheese', 'beurre' => 'butter', 'creme' => 'cream',
        'crème' => 'cream', 'yaourt' => 'yogurt', 'huile' => 'oil', 'huile d\'olive' => 'olive oil',
        'citron' => 'lemon', 'poivron' => 'bell pepper', 'poivre' => 'pepper', 'concombre' => 'cucumber',
        'laitue' => 'lettuce', 'salade' => 'lettuce', 'epinard' => 'spinach', 'epinards' => 'spinach',
        'épinards' => 'spinach', 'champignon' => 'mushroom', 'champignons' => 'mushroom',
        'courgette' => 'zucchini', 'aubergine' => 'eggplant', 'potiron' => 'pumpkin',
        'citrouille' => 'pumpkin', 'courge' => 'squash', 'mais' => 'corn', 'maïs' => 'corn',
        'petits pois' => 'peas', 'haricots' => 'beans', 'lentilles' => 'lentil',
        'pois chiches' => 'chickpea', 'pates' => 'pasta', 'pâtes' => 'pasta', 'farine' => 'flour',
        'sucre' => 'sugar', 'sel' => 'salt', 'pain' => 'bread', 'miel' => 'honey',
        'gingembre' => 'ginger', 'cannelle' => 'cinnamon', 'coriandre' => 'coriander',
        'persil' => 'parsley', 'menthe' => 'mint', 'pomme' => 'apple', 'banane' => 'banana',
        'amande' => 'almond', 'amandes' => 'almond', 'fraise' => 'strawberry', 'chocolat' => 'chocolate',
    ];

    public function search(Request $request)
    {
        $data = $request->validate([
            'ingredients'      => 'required|array|min:1|max:30',
            'ingredients.*'    => 'required|string|max:60',
            'assume_staples'   => 'sometimes|boolean',
            'limit'            => 'sometimes|integer|min:1|max:100',
        ]);

        $assumeStaples = $data['assume_staples'] ?? true;
        $limit = $data['limit'] ?? 60;

        // كل مكون كيتحول لقائمة كلمات (stems)
        $terms = [];
        foreach ($data['ingredients'] as $raw) {
            $tokens = $this->termTokens($raw);
            if (!empty($tokens)) {
                $terms[] = $tokens;
            }
        }

        if (empty($terms)) {
            return response()->json(['recipes' => [], 'terms' => []]);
        }

        $results = [];

        foreach (Recipe::all() as $recipe) {
            $have = 0;
            $total = 0;
            $missing = [];
            $matchedTerms = [];

            foreach (($recipe->ingredients ?? []) as $line) {
                $norm = $this->normalize($line);
                $tokens = $this->tokens($norm);

                if ($assumeStaples && $this->isStaple($norm, $tokens)) {
                    continue;
                }

                $total++;
                $found = false;

                foreach ($terms as $i => $termTokens) {
                    if (empty(array_diff($termTokens, $tokens))) {
                        $found = true;
                        $matchedTerms[$i] = true;
                    }
                }

                if ($found) {
                    $have++;
                } else {
                    $missing[] = $line;
                }
            }

            if ($have === 0 || $total === 0) {
                continue;
            }

            $results[] = [
                'id'            => $recipe->id,
                'name'          => $recipe->name,
                'image'         => $recipe->image,
                'cuisine'       => $recipe->cuisine,
                'country'       => $recipe->country,
                'season'        => $recipe->season,
                'have'          => $have,
                'total'         => $total,
                'percent'       => (int) round($have / $total * 100),
                'missing'       => $missing,
                'can_cook'      => count($missing) === 0,
                'matched_terms' => count($matchedTerms),
            ];
        }

        usort($results, function ($a, $b) {
            return [$b['percent'], count($a['missing']), $b['matched_terms']]
               <=> [$a['percent'], count($b['missing']), $a['matched_terms']];
        });

        return response()->json([
            'recipes' => array_slice($results, 0, $limit),
            'total'   => count($results),
        ]);
    }

    // ---------- helpers ----------

    /** "Tomatoes", "طماطم", "pomme de terre"  ->  ['tomato'] / ['potato'] */
    private function termTokens(string $raw): array
    {
        $raw = trim(mb_strtolower($raw));
        if ($raw === '') {
            return [];
        }

        $mapped = self::SYNONYMS[$raw] ?? null;

        if ($mapped === null) {
            // نجرب بلا accents (é -> e) ولكن غير للحروف اللاتينية
            if (!preg_match('/\p{Arabic}/u', $raw)) {
                $ascii = Str::ascii($raw);
                $mapped = self::SYNONYMS[$ascii] ?? $ascii;
            } else {
                // عربي غير معروف: ما نقدروش نقارنوه مع وصفات بالإنجليزية
                return [];
            }
        }

        return $this->tokens($this->normalize($mapped));
    }

    private function normalize(string $s): string
    {
        return mb_strtolower(Str::ascii($s));
    }

    private function tokens(string $normalized): array
    {
        $words = preg_split('/[^a-z]+/', $normalized, -1, PREG_SPLIT_NO_EMPTY);
        return array_values(array_unique(array_map([$this, 'stem'], $words)));
    }

    private function stem(string $w): string
    {
        $len = strlen($w);
        if ($len > 4 && str_ends_with($w, 'ies')) {
            return substr($w, 0, -3) . 'y';          // berries -> berry
        }
        if ($len > 4 && str_ends_with($w, 'oes')) {
            return substr($w, 0, -2);                // tomatoes -> tomato
        }
        if ($len > 3 && str_ends_with($w, 's')
            && !str_ends_with($w, 'ss') && !str_ends_with($w, 'us')) {
            return substr($w, 0, -1);                // eggs -> egg
        }
        return $w;
    }

    private function isStaple(string $normalizedLine, array $tokens): bool
    {
        foreach (self::STAPLE_PHRASES as $phrase) {
            if (str_contains($normalizedLine, $phrase)) {
                return true;
            }
        }
        return !empty(array_intersect(self::STAPLE_WORDS, $tokens));
    }
}
