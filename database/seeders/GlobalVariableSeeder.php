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
                'key' => 'company_logo',
                'value' => '/assets/cigi-global.png',
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

            // Homepage
            [
                'key' => 'homepage_tagline',
                'value' => 'Cimande Girang - UMKM Lokal, Solusi Global',
                'type' => 'text',
                'category' => 'homepage',
                'description' => 'Tagline homepage',
                'is_public' => true,
            ],
            [
                'key' => 'homepage_title',
                'value' => 'UMKM Lokal Berkualitas',
                'type' => 'text',
                'category' => 'homepage',
                'description' => 'Title homepage',
                'is_public' => true,
            ],
            [
                'key' => 'homepage_description',
                'value' => 'Cigi Global adalah grup perusahaan yang bergerak di berbagai bidang usaha dan komunitas. Kami berkomitmen untuk memberikan pelayanan terbaik dan berkontribusi positif bagi masyarakat.',
                'type' => 'textarea',
                'category' => 'homepage',
                'description' => 'Description homepage',
                'is_public' => true,
            ],

            // Homepage Tentang Kami
            [
                'key' => 'visi_description',
                'value' => 'Menjadi perusahaan UMKM terdepan yang menghadirkan solusi inovatif dan berkelanjutan untuk kemajuan masyarakat.',
                'type' => 'textarea',
                'category' => 'about_us',
                'description' => 'Visi description',
                'is_public' => true,
            ],
            [
                'key' => 'misi_description',
                'value' => 'Mengembangkan UMKM lokal untuk kemajuan ekonomi dan kesejahteraan masyarakat.',
                'type' => 'textarea',
                'category' => 'about_us',
                'description' => 'Misi description',
                'is_public' => true,
            ],
            [
                'key' => 'value_description',
                'value' => 'Integritas, Inovasi, dan kolaborasi adalah fondasi kami dalam memberikan solusi terbaik untuk masyarakat.',
                'type' => 'textarea',
                'category' => 'about_us',
                'description' => 'Value description',
                'is_public' => true,
            ],
            [
                'key' => 'commitment_description',
                'value' => 'Kami berkomitmen untuk memberikan pelayanan terbaik dan berkontribusi positif bagi masyarakat.',
                'type' => 'textarea',
                'category' => 'about_us',
                'description' => 'Commitment description',
                'is_public' => true,
            ],
            [
                'key' => 'commitment_tagline',
                'value' => 'Bersama membangun masa depan yang berkelanjutan.',
                'type' => 'text',
                'category' => 'about_us',
                'description' => 'Commitment tagline',
                'is_public' => true,
            ],
            [
                'key' => 'commitment_image',
                'value' => '/assets/cigi-global-2.jpg',
                'type' => 'text',
                'category' => 'about_us',
                'description' => 'Commitment image',
                'is_public' => true,
            ],

            // Halaman TENTANG KAMI
            [
                'key' => 'why_choose_us_title_1',
                'value' => 'Berpengalaman',
                'type' => 'text',
                'category' => 'about_us',
                'description' => 'Judul Kenapa Memilih Kami 1',
                'is_public' => true,
            ],
            [
                'key' => 'why_choose_us_title_2',
                'value' => 'Terpercaya',
                'type' => 'text',
                'category' => 'about_us',
                'description' => 'Judul Kenapa Memilih Kami 2',
                'is_public' => true,
            ],
            [
                'key' => 'why_choose_us_title_3',
                'value' => 'Inovatif',
                'type' => 'text',
                'category' => 'about_us',
                'description' => 'Judul Kenapa Memilih Kami 3',
                'is_public' => true,
            ],
            [
                'key' => 'why_choose_us_title_4',
                'value' => 'Kolaboratif',
                'type' => 'text',
                'category' => 'about_us',
                'description' => 'Judul Kenapa Memilih Kami 4',
                'is_public' => true,
            ],
            [
                'key' => 'why_choose_us_description_1',
                'value' => 'Lebih dari 4 tahun melayani berbagai klien.',
                'type' => 'textarea',
                'category' => 'about_us',
                'description' => 'Deskripsi Kenapa Memilih Kami 1',
            ],
            [
                'key' => 'why_choose_us_description_2',
                'value' => 'Komitmen tinggi pada kualitas dan kepuasan klien.',
                'type' => 'textarea',
                'category' => 'about_us',
                'description' => 'Deskripsi Kenapa Memilih Kami 2',
            ],
            [
                'key' => 'why_choose_us_description_3',
                'value' => 'Menggunakan teknologi terdepan dan solusi kreatif.',
                'type' => 'textarea',
                'category' => 'about_us',
                'description' => 'Deskripsi Kenapa Memilih Kami 3',
            ],
            [
                'key' => 'why_choose_us_description_4',
                'value' => 'Mengembangkan kolaborasi dan kerja sama dengan berbagai pihak.',
                'type' => 'textarea',
                'category' => 'about_us',
                'description' => 'Deskripsi Kenapa Memilih Kami 4',
            ],


            // Contact Information
            [
                'key' => 'contact_address',
                'value' => 'Jl. Cimande Girang, Kec. Caringin, Kab. Bogor',
                'type' => 'textarea',
                'category' => 'contact',
                'description' => 'Alamat kantor pusat',
                'is_public' => true,
            ],
            [
                'key' => 'contact_phone',
                'value' => '+62 812 3456 7890',
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
