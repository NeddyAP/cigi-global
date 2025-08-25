<?php

namespace Database\Seeders;

use App\Models\CommunityClub;
use Illuminate\Database\Seeder;

class CommunityClubSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create specific community clubs with enhanced data using factory
        $communityClubs = [
            [
                'name' => 'PB Cigi',
                'slug' => 'pb-cigi',
                'description' => 'Persatuan Bulutangkis Cigi adalah wadah bagi para pecinta olahraga bulutangkis. Kami mengadakan latihan rutin dan turnamen untuk mengembangkan bakat dan prestasi.',
                'type' => 'Olahraga',
                'activities' => "Latihan Rutin\nTurnamen Bulutangkis\nKelas Pelatihan\nSparing Partner\nKompetisi Antar Club",
                'image' => '/assets/community/pb-cigi.jpg',
                'contact_person' => 'Budi Santoso',
                'contact_phone' => '+62 812 3456 7890',
                'contact_email' => 'pbcigi@gmail.com',
                'meeting_schedule' => 'Selasa & Kamis: 19:00 - 21:00\nSabtu: 16:00 - 18:00',
                'location' => 'GOR Bulutangkis Cigi, Jl. Olahraga No. 123',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Cigi FC',
                'slug' => 'cigi-fc',
                'description' => 'Cigi Football Club adalah komunitas sepak bola yang menggabungkan semangat sportivitas dan persaudaraan. Terbuka untuk semua usia dan tingkat kemampuan.',
                'type' => 'Olahraga',
                'activities' => "Latihan Sepak Bola\nPertandingan Persahabatan\nTurnamen Lokal\nPembinaan Anak\nKegiatan Sosial",
                'image' => '/assets/community/cigi-fc.jpg',
                'contact_person' => 'Ahmad Rifai',
                'contact_phone' => '+62 813 4567 8901',
                'contact_email' => 'cigifc@gmail.com',
                'meeting_schedule' => 'Minggu: 07:00 - 09:00\nRabu: 19:00 - 21:00',
                'location' => 'Lapangan Sepak Bola Cigi, Jl. Stadion No. 456',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Cigi Archery',
                'slug' => 'cigi-archery',
                'description' => 'Klub panahan yang fokus pada pengembangan konsentrasi, disiplin, dan ketepatan. Menyediakan pelatihan dari tingkat pemula hingga mahir.',
                'type' => 'Olahraga',
                'activities' => "Pelatihan Panahan\nKompetisi Panahan\nWorkkshop Teknik\nMeditasi & Konsentrasi\nOutbound Archery",
                'image' => '/assets/community/cigi-archery.jpg',
                'contact_person' => 'Sari Indah',
                'contact_phone' => '+62 814 5678 9012',
                'contact_email' => 'cigiarchery@gmail.com',
                'meeting_schedule' => 'Sabtu: 14:00 - 17:00\nMinggu: 08:00 - 11:00',
                'location' => 'Lapangan Panahan Cigi, Jl. Sasaran No. 789',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Majelis Cigi',
                'slug' => 'majelis-cigi',
                'description' => 'Majelis Taklim dan Kajian Al-Quran yang mengkaji ilmu agama Islam. Terbuka untuk semua kalangan yang ingin memperdalam pemahaman agama.',
                'type' => 'Keagamaan',
                'activities' => "Kajian Al-Quran\nTafsir Hadits\nKelas Tahfidz\nCeramah Agama\nSilaturahmi",
                'image' => '/assets/community/rt-cigi.jpg',
                'contact_person' => 'Ustadz Mahmud',
                'contact_phone' => '+62 815 6789 0123',
                'contact_email' => 'majeliscigi@gmail.com',
                'meeting_schedule' => 'Jumat: 19:30 - 21:00\nMinggu: 08:00 - 10:00',
                'location' => 'Masjid Al-Hikmah Cigi, Jl. Dakwah No. 012',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'KRL Cigi',
                'slug' => 'krl-cigi',
                'description' => 'Kampung Ramah Lingkungan Cigi adalah program komunitas untuk menciptakan lingkungan yang bersih, hijau, dan berkelanjutan.',
                'type' => 'Lingkungan',
                'activities' => "Penghijauan\nPengelolaan Sampah\nUrban Farming\nSosialisasi Lingkungan\nGotong Royong",
                'image' => '/assets/community/krl-cigi.jpg',
                'contact_person' => 'Ibu Rina',
                'contact_phone' => '+62 816 7890 1234',
                'contact_email' => 'krlcigi@gmail.com',
                'meeting_schedule' => 'Sabtu: 06:00 - 09:00\nSetiap Minggu ke-3: Kerja Bakti',
                'location' => 'Balai Kampung Cigi, Jl. Lingkungan No. 345',
                'is_active' => true,
                'sort_order' => 5,
            ],
        ];

        // Create community clubs with enhanced data from factory
        foreach ($communityClubs as $clubData) {
            $club = CommunityClub::factory()->make($clubData);
            $club->save();

            // Create 2-4 activities for each community club
            $club->clubActivities()->saveMany(
                \App\Models\CommunityClubActivity::factory()
                    ->count(fake()->numberBetween(2, 4))
                    ->make(['community_club_id' => $club->id])
            );
        }
    }
}
