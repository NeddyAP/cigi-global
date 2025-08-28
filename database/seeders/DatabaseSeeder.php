<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user if it doesn't exist
        if (! User::where('email', 'admin@cigiglobal.com')->exists()) {
            User::factory()->create([
                'name' => 'Admin Cigi Global',
                'email' => 'admin@cigiglobal.com',
                'password' => Hash::make('admin123'),
            ]);
        }

        // Seed all data
        $this->call([
            GlobalVariableSeeder::class,
            BusinessUnitSeeder::class,
            CommunityClubSeeder::class,
            SuperAdminSeeder::class,
        ]);
    }
}
