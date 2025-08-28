<?php

use App\Models\BusinessUnit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create();
});

it('transforms team members social links correctly', function () {
    $data = [
        'name' => 'Test Unit',
        'services' => 'Test service',
        'is_active' => true,
        'team_members' => [
            [
                'name' => 'John Doe',
                'role' => 'Developer',
                'bio' => 'Experienced developer',
                'social_links_linkedin' => 'https://linkedin.com/in/johndoe',
                'social_links_twitter' => 'https://twitter.com/johndoe',
                'social_links_github' => 'https://github.com/johndoe',
            ],
        ],
    ];

    $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

    $response->assertRedirect();

    $businessUnit = BusinessUnit::where('name', 'Test Unit')->first();
    expect($businessUnit)->not->toBeNull();

    $teamMembers = $businessUnit->team_members;
    expect($teamMembers)->toHaveCount(1);

    expect($teamMembers[0]['social_links'])->toHaveCount(3);
    expect($teamMembers[0]['social_links'][0]['platform'])->toBe('linkedin');
    expect($teamMembers[0]['social_links'][0]['url'])->toBe('https://linkedin.com/in/johndoe');
    expect($teamMembers[0]['social_links'][1]['platform'])->toBe('twitter');
    expect($teamMembers[0]['social_links'][1]['url'])->toBe('https://twitter.com/johndoe');
    expect($teamMembers[0]['social_links'][2]['platform'])->toBe('github');
    expect($teamMembers[0]['social_links'][2]['url'])->toBe('https://github.com/johndoe');
});

it('transforms company stats correctly', function () {
    $data = [
        'name' => 'Test Unit',
        'description' => 'Test description',
        'services' => 'Test service',
        'is_active' => true,
        'company_stats' => [
            'years_in_business' => '5',
            'projects_completed' => '100',
            'clients_served' => '50',
            'team_size' => '25',
        ],
    ];

    $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

    $response->assertRedirect();

    $businessUnit = BusinessUnit::where('name', 'Test Unit')->first();
    expect($businessUnit)->not->toBeNull();

    $companyStats = $businessUnit->company_stats;
    expect($companyStats)->toHaveCount(4);

    // Check years in business
    $yearsStat = collect($companyStats)->firstWhere('label', 'Years in Business');
    expect($yearsStat)->not->toBeNull();
    expect($yearsStat['value'])->toBe('5');
    expect($yearsStat['icon'])->toBe('📅');

    // Check projects completed
    $projectsStat = collect($companyStats)->firstWhere('label', 'Projects Completed');
    expect($projectsStat)->not->toBeNull();
    expect($projectsStat['value'])->toBe('100');
    expect($projectsStat['icon'])->toBe('🚀');

    // Check clients served
    $clientsStat = collect($companyStats)->firstWhere('label', 'Clients Served');
    expect($clientsStat)->not->toBeNull();
    expect($clientsStat['value'])->toBe('50');
    expect($clientsStat['icon'])->toBe('👥');

    // Check team size
    $teamStat = collect($companyStats)->firstWhere('label', 'Team Size');
    expect($teamStat)->not->toBeNull();
    expect($teamStat['value'])->toBe('25');
    expect($teamStat['icon'])->toBe('👨‍💼');
});

it('handles empty social links correctly', function () {
    $data = [
        'name' => 'Test Unit',
        'services' => 'Test service',
        'is_active' => true,
        'team_members' => [
            [
                'name' => 'Jane Doe',
                'role' => 'Designer',
                'bio' => 'Creative designer',
                'social_links_linkedin' => '',
                'social_links_twitter' => '',
                'social_links_github' => '',
            ],
        ],
    ];

    $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

    $response->assertRedirect();

    $businessUnit = BusinessUnit::where('name', 'Test Unit')->first();
    expect($businessUnit)->not->toBeNull();

    $teamMembers = $businessUnit->team_members;
    expect($teamMembers)->toHaveCount(1);
    expect($teamMembers[0]['social_links'])->toHaveCount(0);
});

it('handles empty company stats correctly', function () {
    $data = [
        'name' => 'Test Unit',
        'services' => 'Test service',
        'is_active' => true,
        'company_stats' => [
            'years_in_business' => '',
            'projects_completed' => '',
            'clients_served' => '',
            'team_size' => '',
        ],
    ];

    $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

    $response->assertRedirect();

    $businessUnit = BusinessUnit::where('name', 'Test Unit')->first();
    expect($businessUnit)->not->toBeNull();

    $companyStats = $businessUnit->company_stats;
    expect($companyStats)->toHaveCount(0);
});

it('transforms partial company stats correctly', function () {
    $data = [
        'name' => 'Test Unit',
        'services' => 'Test service',
        'is_active' => true,
        'company_stats' => [
            'years_in_business' => '10',
            'projects_completed' => '',
            'clients_served' => '75',
            'team_size' => '',
        ],
    ];

    $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

    $response->assertRedirect();

    $businessUnit = BusinessUnit::where('name', 'Test Unit')->first();
    expect($businessUnit)->not->toBeNull();

    $companyStats = $businessUnit->company_stats;
    expect($companyStats)->toHaveCount(2);

    // Only filled stats should be included
    $yearsStat = collect($companyStats)->firstWhere('label', 'Years in Business');
    expect($yearsStat)->not->toBeNull();
    expect($yearsStat['value'])->toBe('10');

    $clientsStat = collect($companyStats)->firstWhere('label', 'Clients Served');
    expect($clientsStat)->not->toBeNull();
    expect($clientsStat['value'])->toBe('75');
});
