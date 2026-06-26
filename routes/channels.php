<?php

use Illuminate\Support\Facades\Broadcast;
use App\Http\Resources\UserResource;

Broadcast::channel('online', function ($user) {
    
    /** 
    *return $user ? [
    *    'id' => $user->id,
    *    'name' => $user->name,
    *    'avatar_url' => $user->avatar_url,
    *] : null;
     */
    return auth()->check()?new UserResource($user) : null;
});


Broadcast::channel('message.user.{user1}.{user2}', function ($user, $user1, $user2) {
   return (int) $user->id === (int) $user1 || (int) $user->id === (int) $user2;
});


Broadcast::channel('message.group.{group}', function ($user, $group) {
    return $user->groups->contains($group);
});