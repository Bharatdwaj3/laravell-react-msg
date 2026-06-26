<?php

namespace Database\Seeders;
use App\Models\Group;
use App\Models\User;
use App\Models\Conversation;
use App\Models\Message;
use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
{
    // 1. Create standard seed users
    User::factory()->create([
        'name' => 'John Doe',
        'email' => 'John@Doe.com',
        'password' => bcrypt('password'),
        'is_admin' => true
    ]);
    User::factory()->create([
        'name' => 'Jane Doe',
        'email' => 'Jane@Doe.com',
        'password' => bcrypt('password'),
    ]);

    User::factory(10)->create();

    // 2. Create groups and attach random members
    for ($i = 0; $i < 5; $i++) {
        $group = Group::factory()->create([
            'owner_id' => 1,
        ]);
        $users = User::inRandomOrder()->limit(rand(2, 5))->pluck('id');
        $group->users()->attach(array_unique([1, ...$users]));
    }

    // 3. Generate the 1,000 mock messages
    Message::factory(1000)->create();

    // 4. Group, map, AND SAVE private user-to-user conversations
    $messages = Message::whereNull('group_id')->orderBy('created_at')->get();
    
    $conversations = $messages->groupBy(function ($message) {
        return collect([$message->sender_id, $message->receiver_id])
            ->sort()->implode('_');
    })->map(function ($groupedMessages) {
        return [
            'user_id1'        => $groupedMessages->first()->sender_id,
            'user_id2'        => $groupedMessages->first()->receiver_id,
            'last_message_id' => $groupedMessages->last()->id,
            'created_at'      => Carbon::now(),
            'updated_at'      => Carbon::now(),
        ];
    })->values();

    // CRITICAL FIX: Actually insert the records into your database!
    Conversation::insert($conversations->toArray());

    // 5. Update Group Models with their latest generated message ID
    Group::all()->each(function ($group) {
        $lastGroupMessage = Message::where('group_id', $group->id)
            ->latest()
            ->first();

        if ($lastGroupMessage) {
            $group->update([
                'last_message_id' => $lastGroupMessage->id,
            ]);
        }
    });
}
}
