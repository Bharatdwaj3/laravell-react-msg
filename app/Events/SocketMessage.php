<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SocketMessage implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct()
    {
        $this->message->load(['sender','attachments']);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        if($this->message->group_id){
            return[
                new PrivateChannel('message.group.' . $this->message->group_id)
            ];
        }
        return [
            new PrivateChannel('message.user.' . collect([$this->message->sender_id, $this->message->receiver_id])->sort()->implode('-'))
        ];
    }
    public function broadcastWith(): array
    {
        return (new MessageResource($this->message))->resolve();
    }
}
