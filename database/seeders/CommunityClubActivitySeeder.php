<?php

namespace Database\Seeders;

use App\Models\CommunityClub;
use App\Models\CommunityClubActivity;
use Illuminate\Database\Seeder;

class CommunityClubActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing community clubs
        $communityClubs = CommunityClub::all();

        if ($communityClubs->isEmpty()) {
            $this->command->info('No community clubs found. Please run CommunityClubSeeder first.');
            return;
        }

        $activities = [
            [
                'title' => 'Turnamen Bulutangkis Mingguan',
                'description' => 'Turnamen bulutangkis mingguan untuk anggota komunitas dengan berbagai kategori skill level.',
                'short_description' => 'Turnamen bulutangkis mingguan dengan berbagai kategori',
                'duration' => '2 jam',
                'max_participants' => 32,
                'requirements' => 'Minimal skill intermediate, membawa raket sendiri',
                'benefits' => [
                    'Meningkatkan skill bulutangkis',
                    'Networking dengan anggota komunitas',
                    'Fisik lebih sehat dan bugar',
                    'Kesempatan memenangkan hadiah'
                ],
                'status' => 'active',
                'featured' => true,
                'is_active' => true,
                'schedule' => 'Setiap Sabtu jam 19:00',
                'location' => 'GOR Bulutangkis Cigi',
                'contact_info' => 'Hubungi Pak Budi di 0812-3456-7890'
            ],
            [
                'title' => 'Latihan Bersama Pemula',
                'description' => 'Sesi latihan khusus untuk pemula yang ingin belajar bulutangkis dari dasar.',
                'short_description' => 'Latihan bulutangkis untuk pemula',
                'duration' => '1.5 jam',
                'max_participants' => 20,
                'requirements' => 'Pemula, tidak perlu pengalaman sebelumnya',
                'benefits' => [
                    'Belajar teknik dasar bulutangkis',
                    'Latihan dengan pelatih berpengalaman',
                    'Membangun kepercayaan diri',
                    'Persiapan untuk turnamen'
                ],
                'status' => 'active',
                'featured' => false,
                'is_active' => true,
                'schedule' => 'Setiap Selasa dan Kamis jam 18:00',
                'location' => 'GOR Bulutangkis Cigi',
                'contact_info' => 'Hubungi Ibu Sari di 0812-3456-7891'
            ],
            [
                'title' => 'Klinik Teknik Lanjutan',
                'description' => 'Klinik khusus untuk pemain intermediate dan advanced yang ingin meningkatkan teknik mereka.',
                'short_description' => 'Klinik teknik untuk level lanjutan',
                'duration' => '2.5 jam',
                'max_participants' => 16,
                'requirements' => 'Skill level intermediate ke atas, membawa raket sendiri',
                'benefits' => [
                    'Teknik smash yang lebih powerful',
                    'Strategi permainan ganda',
                    'Teknik defense yang efektif',
                    'Mental game dan konsentrasi'
                ],
                'status' => 'active',
                'featured' => true,
                'is_active' => true,
                'schedule' => 'Setiap Minggu jam 15:00',
                'location' => 'GOR Bulutangkis Cigi',
                'contact_info' => 'Hubungi Coach Ahmad di 0812-3456-7892'
            ],
            [
                'title' => 'Fun Games & Social Event',
                'description' => 'Event santai untuk bersosialisasi sambil bermain bulutangkis dengan format yang menyenangkan.',
                'short_description' => 'Event sosial sambil bermain bulutangkis',
                'duration' => '3 jam',
                'max_participants' => 40,
                'requirements' => 'Semua skill level, membawa makanan untuk sharing',
                'benefits' => [
                    'Bersosialisasi dengan anggota komunitas',
                    'Permainan santai dan menyenangkan',
                    'Sharing makanan dan cerita',
                    'Membangun persahabatan'
                ],
                'status' => 'active',
                'featured' => false,
                'is_active' => true,
                'schedule' => 'Setiap bulan pada hari Sabtu terakhir',
                'location' => 'GOR Bulutangkis Cigi',
                'contact_info' => 'Hubungi Ketua Komunitas di 0812-3456-7893'
            ]
        ];

        foreach ($activities as $activityData) {
            // Assign to random community club
            $communityClub = $communityClubs->random();
            
            CommunityClubActivity::create([
                'community_club_id' => $communityClub->id,
                ...$activityData
            ]);
        }

        $this->command->info('Community Club Activities seeded successfully!');
    }
}
