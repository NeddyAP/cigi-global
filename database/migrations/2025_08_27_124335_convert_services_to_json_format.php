<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Convert existing services data from newline-separated to JSON format
        $businessUnits = DB::table('business_units')->whereNotNull('services')->get();
        
        foreach ($businessUnits as $unit) {
            if (!empty($unit->services)) {
                // Split by newline and create JSON structure
                $servicesArray = array_filter(array_map('trim', explode("\n", $unit->services)));
                
                $jsonServices = [];
                foreach ($servicesArray as $index => $service) {
                    if (!empty($service)) {
                        $jsonServices[] = [
                            'id' => 'service_' . ($index + 1),
                            'title' => $service,
                            'description' => 'Layanan profesional dengan metodologi terbukti dan praktik terbaik industri.',
                            'image' => '',
                            'price_range' => '',
                            'duration' => '',
                            'features' => [],
                            'technologies' => [],
                            'process_steps' => [],
                            'featured' => $index === 0, // First service is featured
                            'active' => true,
                        ];
                    }
                }
                
                // Update the services field with JSON data
                DB::table('business_units')
                    ->where('id', $unit->id)
                    ->update(['services' => json_encode($jsonServices)]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Convert back to newline-separated format if needed
        $businessUnits = DB::table('business_units')->whereNotNull('services')->get();
        
        foreach ($businessUnits as $unit) {
            if (!empty($unit->services)) {
                try {
                    $servicesArray = json_decode($unit->services, true);
                    if (is_array($servicesArray)) {
                        $titles = array_map(function($service) {
                            return $service['title'] ?? '';
                        }, $servicesArray);
                        
                        $newlineServices = implode("\n", array_filter($titles));
                        
                        DB::table('business_units')
                            ->where('id', $unit->id)
                            ->update(['services' => $newlineServices]);
                    }
                } catch (Exception $e) {
                    // If JSON parsing fails, leave as is
                    continue;
                }
            }
        }
    }
};
