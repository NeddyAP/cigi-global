<?php

namespace Database\Seeders;

use App\Models\BusinessUnit;
use Illuminate\Database\Seeder;

class BusinessUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create specific business units with enhanced data using factory
        $businessUnits = [
            [
                'name' => 'Cigi Net',
                'slug' => 'cigi-net',
                'description' => 'Penyedia layanan internet terpercaya untuk kebutuhan rumah dan bisnis Anda. Kami menyediakan koneksi internet berkecepatan tinggi dengan jangkauan luas.',
                'services' => "Internet Rumahan\nInternet Bisnis\nLayanan WiFi\nMaintenance Jaringan\nKonsultasi IT",
                'image' => '/assets/business/cigi-net.jpg',
                'contact_phone' => '+62 21 1234 5678',
                'contact_email' => 'info@ciginet.com',
                'address' => 'Jl. Teknologi No. 123, Jakarta Selatan',
                'website_url' => 'https://ciginet.com',
                'operating_hours' => 'Senin - Jumat: 08:00 - 17:00\nSabtu: 08:00 - 15:00\nMinggu: Tutup',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Cigi Mart',
                'slug' => 'cigi-mart',
                'description' => 'Pusat perbelanjaan modern dengan berbagai kebutuhan sehari-hari. Menyediakan produk berkualitas dengan harga terjangkau untuk keluarga Indonesia.',
                'services' => "Kebutuhan Pokok\nProduk Segar\nElektronik\nFashion\nKebutuhan Rumah Tangga",
                'image' => '/assets/business/cigi-mart.jpg',
                'contact_phone' => '+62 21 2345 6789',
                'contact_email' => 'info@cigimart.com',
                'address' => 'Jl. Perdagangan No. 456, Jakarta Barat',
                'website_url' => 'https://cigimart.com',
                'operating_hours' => 'Setiap Hari: 08:00 - 22:00',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Cigi Food',
                'slug' => 'cigi-food',
                'description' => 'Restoran dan layanan katering dengan cita rasa otentik Indonesia. Menghadirkan pengalaman kuliner terbaik dengan bahan-bahan berkualitas premium.',
                'services' => "Restoran Dine-in\nTakeaway & Delivery\nCatering Event\nPaket Ulang Tahun\nMeeting Package",
                'image' => '/assets/business/cigi-food.jpg',
                'contact_phone' => '+62 21 3456 7890',
                'contact_email' => 'info@cigifood.com',
                'address' => 'Jl. Kuliner No. 789, Jakarta Timur',
                'website_url' => 'https://cigifood.com',
                'operating_hours' => 'Setiap Hari: 10:00 - 23:00',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Cigi Farm',
                'slug' => 'cigi-farm',
                'description' => 'Peternakan dan pertanian organik yang menghasilkan produk segar dan berkualitas. Berkomitmen untuk mendukung ketahanan pangan nasional.',
                'more_about' => [
                    [
                        'title' => 'Misi Kami',
                        'description' => 'Menghasilkan produk pertanian dan peternakan organik berkualitas untuk ketahanan pangan nasional.',
                    ],
                    [
                        'title' => 'Visi Kami',
                        'description' => 'Menjadi pelopor pertanian organik yang berkelanjutan dan ramah lingkungan.',
                    ],
                    [
                        'title' => 'Pendekatan Kami',
                        'description' => 'Menggunakan metode pertanian modern yang ramah lingkungan dan mendukung kesejahteraan petani.',
                    ],
                ],
                'services' => "Sayuran Organik\nBuah Segar\nProduk Peternakan\nBibit Tanaman\nKonsultasi Pertanian",
                'image' => '/assets/business/cigi-farm.jpg',
                'contact_phone' => '+62 21 4567 8901',
                'contact_email' => 'info@cigifarm.com',
                'address' => 'Jl. Pertanian No. 012, Bogor',
                'website_url' => 'https://cigifarm.com',
                'operating_hours' => 'Senin - Sabtu: 06:00 - 18:00\nMinggu: 06:00 - 15:00',
                'is_active' => true,
                'sort_order' => 4,
            ],
        ];

        // Create business units with enhanced data from factory
        foreach ($businessUnits as $unitData) {
            $unit = BusinessUnit::factory()->make($unitData);
            $unit->save();

            // Create 2-5 services for each business unit
            $unit->unitServices()->saveMany(
                \App\Models\BusinessUnitService::factory()
                    ->count(fake()->numberBetween(2, 5))
                    ->make(['business_unit_id' => $unit->id])
            );
        }
    }
}
