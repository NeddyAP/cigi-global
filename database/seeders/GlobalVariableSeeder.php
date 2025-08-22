<?php

namespace Database\Seeders;

use App\Models\GlobalVariable;
use Illuminate\Database\Seeder;

class GlobalVariableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $variables = [
            // Company Information
            [
                'key' => 'company_name',
                'value' => 'Cigi Global',
                'type' => 'text',
                'category' => 'company',
                'description' => 'Nama perusahaan utama',
                'is_public' => true,
            ],
            [
                'key' => 'company_tagline',
                'value' => 'Membangun Masa Depan Bersama',
                'type' => 'text',
                'category' => 'company',
                'description' => 'Tagline perusahaan',
                'is_public' => true,
            ],
            [
                'key' => 'company_description',
                'value' => 'Cigi Global adalah grup perusahaan yang bergerak di berbagai bidang usaha dan komunitas. Kami berkomitmen untuk memberikan pelayanan terbaik dan berkontribusi positif bagi masyarakat.',
                'type' => 'textarea',
                'category' => 'company',
                'description' => 'Deskripsi singkat perusahaan',
                'is_public' => true,
            ],

            // Contact Information
            [
                'key' => 'contact_address',
                'value' => 'Jl. Cigi Raya No. 123, Jakarta Selatan 12345',
                'type' => 'textarea',
                'category' => 'contact',
                'description' => 'Alamat kantor pusat',
                'is_public' => true,
            ],
            [
                'key' => 'contact_phone',
                'value' => '+62 21 1234 5678',
                'type' => 'text',
                'category' => 'contact',
                'description' => 'Nomor telepon utama',
                'is_public' => true,
            ],
            [
                'key' => 'contact_email',
                'value' => 'info@cigiglobal.com',
                'type' => 'email',
                'category' => 'contact',
                'description' => 'Email utama',
                'is_public' => true,
            ],
            [
                'key' => 'contact_whatsapp',
                'value' => '+62 812 3456 7890',
                'type' => 'text',
                'category' => 'contact',
                'description' => 'Nomor WhatsApp',
                'is_public' => true,
            ],

            // Social Media
            [
                'key' => 'social_facebook',
                'value' => 'https://facebook.com/cigiglobal',
                'type' => 'url',
                'category' => 'social',
                'description' => 'URL Facebook',
                'is_public' => true,
            ],
            [
                'key' => 'social_instagram',
                'value' => 'https://instagram.com/cigiglobal',
                'type' => 'url',
                'category' => 'social',
                'description' => 'URL Instagram',
                'is_public' => true,
            ],
            [
                'key' => 'social_youtube',
                'value' => 'https://youtube.com/@cigiglobal',
                'type' => 'url',
                'category' => 'social',
                'description' => 'URL YouTube',
                'is_public' => true,
            ],
            [
                'key' => 'social_linkedin',
                'value' => 'https://linkedin.com/company/cigiglobal',
                'type' => 'url',
                'category' => 'social',
                'description' => 'URL LinkedIn',
                'is_public' => true,
            ],

            // Business Hours
            [
                'key' => 'business_hours',
                'value' => 'Senin - Jumat: 08:00 - 17:00\nSabtu: 08:00 - 15:00\nMinggu: Tutup',
                'type' => 'textarea',
                'category' => 'contact',
                'description' => 'Jam operasional kantor',
                'is_public' => true,
            ],
        ];

        foreach ($variables as $variable) {
            GlobalVariable::create($variable);
        }
    }
}
