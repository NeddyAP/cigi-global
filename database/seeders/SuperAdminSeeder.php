<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create superadmin if it doesn't exist
        if (! User::where('email', 'superadmin@cigiglobal.com')->exists()) {
            User::create([
                'name' => 'Super Admin',
                'email' => 'superadmin@cigiglobal.com',
                'password' => Hash::make('superadmin123'),
                'superadmin' => true,
            ]);

            $this->command->info('Super Admin created successfully!');
            $this->command->info('Email: superadmin@cigiglobal.com');
            $this->command->info('Password: password');
        } else {
            $this->command->info('Super Admin already exists!');
        }

        if (! User::where('email', 'neddy12898@gmail.com')->exists()) {
            User::create([
                'name' => 'Neddy',
                'email' => 'neddy12898@gmail.com',
                'password' => Hash::make('password'),
                'superadmin' => true,
            ]);

            $this->command->info('Neddy created successfully!');
            $this->command->info('Email: neddy12898@gmail.com');
            $this->command->info('Password: password');
        } else {
            $this->command->info('Neddy already exists!');
        }

        
    }
}
