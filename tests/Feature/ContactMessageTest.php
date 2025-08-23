<?php

use App\Models\ContactMessage;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

describe('Public Contact Form', function () {
    it('can store a contact message', function () {
        $contactData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+62812345678',
            'subject' => 'Inquiry about services',
            'message' => 'I would like to know more about your services.',
        ];

        $response = $this->post(route('contact.store'), $contactData);

        $response->assertRedirect()
            ->assertSessionHas('success', 'Pesan Anda telah berhasil dikirim. Kami akan segera menghubungi Anda.');

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'subject' => 'Inquiry about services',
            'status' => 'unread',
        ]);
    });

    it('validates required fields', function () {
        $response = $this->post(route('contact.store'), []);

        $response->assertSessionHasErrors(['name', 'email', 'subject', 'message']);
    });

    it('validates email format', function () {
        $response = $this->post(route('contact.store'), [
            'name' => 'John Doe',
            'email' => 'invalid-email',
            'subject' => 'Test',
            'message' => 'Test message',
        ]);

        $response->assertSessionHasErrors(['email']);
    });

    it('stores additional metadata', function () {
        $response = $this->post(route('contact.store'), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'subject' => 'Test',
            'message' => 'Test message',
        ]);

        $message = ContactMessage::latest()->first();

        expect($message->ip_address)->not()->toBeNull();
        expect($message->user_agent)->not()->toBeNull();
    });
});

describe('Admin Contact Messages Management', function () {
    it('can view contact messages index', function () {
        ContactMessage::factory(5)->create();

        $response = $this->actingAs($this->user)
            ->get(route('admin.contact-messages.index'));

        $response->assertOk()
            ->assertInertia(
                fn ($page) => $page
                    ->component('admin/contact-messages/index')
                    ->has('contactMessages.data', 5)
                    ->has('stats')
            );
    });

    it('can view individual contact message', function () {
        $message = ContactMessage::factory()->create();

        $response = $this->actingAs($this->user)
            ->get(route('admin.contact-messages.show', $message));

        $response->assertOk()
            ->assertInertia(
                fn ($page) => $page
                    ->component('admin/contact-messages/show')
                    ->where('contactMessage.id', $message->id)
            );
    });

    it('marks message as read when viewing', function () {
        $message = ContactMessage::factory()->unread()->create();

        expect($message->status)->toBe('unread');
        expect($message->read_at)->toBeNull();

        $this->actingAs($this->user)
            ->get(route('admin.contact-messages.show', $message));

        $message->refresh();

        expect($message->status)->toBe('read');
        expect($message->read_at)->not()->toBeNull();
    });

    it('can update message status', function () {
        $message = ContactMessage::factory()->create();

        $response = $this->actingAs($this->user)
            ->patch(route('admin.contact-messages.update', $message), [
                'status' => 'archived',
            ]);

        $response->assertRedirect();

        $message->refresh();
        expect($message->status)->toBe('archived');
    });

    it('can delete a contact message', function () {
        $message = ContactMessage::factory()->create();

        $response = $this->actingAs($this->user)
            ->delete(route('admin.contact-messages.destroy', $message));

        $response->assertRedirect(route('admin.contact-messages.index'));

        $this->assertDatabaseMissing('contact_messages', [
            'id' => $message->id,
        ]);
    });

    it('can mark multiple messages as read', function () {
        $messages = ContactMessage::factory(3)->unread()->create();
        $ids = $messages->pluck('id')->toArray();

        $response = $this->actingAs($this->user)
            ->post(route('admin.contact-messages.mark-as-read'), [
                'ids' => $ids,
            ]);

        $response->assertRedirect();

        foreach ($messages as $message) {
            $message->refresh();
            expect($message->status)->toBe('read');
            expect($message->read_at)->not()->toBeNull();
        }
    });

    it('can mark multiple messages as archived', function () {
        $messages = ContactMessage::factory(3)->create();
        $ids = $messages->pluck('id')->toArray();

        $response = $this->actingAs($this->user)
            ->post(route('admin.contact-messages.mark-as-archived'), [
                'ids' => $ids,
            ]);

        $response->assertRedirect();

        foreach ($messages as $message) {
            $message->refresh();
            expect($message->status)->toBe('archived');
        }
    });

    it('can bulk delete messages', function () {
        $messages = ContactMessage::factory(3)->create();
        $ids = $messages->pluck('id')->toArray();

        $response = $this->actingAs($this->user)
            ->post(route('admin.contact-messages.bulk-delete'), [
                'ids' => $ids,
            ]);

        $response->assertRedirect();

        foreach ($ids as $id) {
            $this->assertDatabaseMissing('contact_messages', ['id' => $id]);
        }
    });

    it('can search messages', function () {
        ContactMessage::factory()->create(['name' => 'John Doe', 'email' => 'john@example.com']);
        ContactMessage::factory()->create(['name' => 'Jane Smith', 'email' => 'jane@example.com']);

        $response = $this->actingAs($this->user)
            ->get(route('admin.contact-messages.index', ['search' => 'John']));

        $response->assertOk()
            ->assertInertia(
                fn ($page) => $page
                    ->component('admin/contact-messages/index')
                    ->has('contactMessages.data', 1)
                    ->where('contactMessages.data.0.name', 'John Doe')
            );
    });

    it('can filter messages by status', function () {
        ContactMessage::factory()->unread()->create();
        ContactMessage::factory()->read()->create();
        ContactMessage::factory()->archived()->create();

        $response = $this->actingAs($this->user)
            ->get(route('admin.contact-messages.index', ['status' => 'unread']));

        $response->assertOk()
            ->assertInertia(
                fn ($page) => $page
                    ->component('admin/contact-messages/index')
                    ->has('contactMessages.data', 1)
                    ->where('contactMessages.data.0.status', 'unread')
            );
    });
});

describe('ContactMessage Model', function () {
    it('has correct default status', function () {
        $message = ContactMessage::factory()->make();

        expect($message->status)->toBe('unread');
    });

    it('can mark message as read', function () {
        $message = ContactMessage::factory()->unread()->create();

        $result = $message->markAsRead();

        expect($result)->toBeTrue();
        expect($message->fresh()->status)->toBe('read');
        expect($message->fresh()->read_at)->not()->toBeNull();
    });

    it('can mark message as archived', function () {
        $message = ContactMessage::factory()->create();

        $result = $message->markAsArchived();

        expect($result)->toBeTrue();
        expect($message->fresh()->status)->toBe('archived');
    });

    it('can mark message as unread', function () {
        $message = ContactMessage::factory()->read()->create();

        $result = $message->markAsUnread();

        expect($result)->toBeTrue();
        expect($message->fresh()->status)->toBe('unread');
        expect($message->fresh()->read_at)->toBeNull();
    });

    it('has working scopes', function () {
        ContactMessage::factory()->unread()->create();
        ContactMessage::factory()->read()->create();
        ContactMessage::factory()->archived()->create();

        expect(ContactMessage::unread()->count())->toBe(1);
        expect(ContactMessage::read()->count())->toBe(1);
        expect(ContactMessage::archived()->count())->toBe(1);
    });

    it('has working recent scope', function () {
        ContactMessage::factory()->create(['created_at' => now()->subDays(3)]);
        ContactMessage::factory()->create(['created_at' => now()->subDays(10)]);

        expect(ContactMessage::recent()->count())->toBe(1);
        expect(ContactMessage::recent(15)->count())->toBe(2);
    });
});
