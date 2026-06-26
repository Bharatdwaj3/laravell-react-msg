<?php

namespace App\Http\Controllers;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Str;        
use Illuminate\Support\Facades\Storage;
use App\Models\Group;             
use App\Models\MessageAttachment;  
use App\Http\Resources\MessageResource; 
use App\Events\SocketMessage;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function byUser(User $user)
    {
        $message=Message::where(function($query) use($user){
            $query->where('sender_id', auth()->id())
                ->where('receiver_id', $user->id);
        })->orWhere(function($query)use($user){
            $query->where('sender_id', $user->id)
                ->where('receiver_id',auth()->id());
        })
        ->latest()
        ->paginate(30);

        return Inertia::render('Home',[
            'selectedConversation'=>$user->toConversationArray(),
            'messages'=>MessageResource::collection($message),
        ]);
    }



    public function byGroup(Group $group)
    {
        if(!$group->users->contains(auth()->id())){
            abort(403, 'You are not a member of this group');
        }

        $messages=Message::where('group_id',$group->id)
            ->latest()
            ->paginate(30);
        return Inertia::render('Home',[
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ]);
    }

    public function loadOlder(Message $message)
    {
        if($message->group_id){
            $messages=Message::where('created_at','<',message->created_at)
                ->where('group_id', $message->group_id)
                ->latest()
                ->paginate(10);
        }else{
            $message = Message::where('created_at','<',$message->created_at)
                ->where(function($query) use($message){
                    $query->where('sender_id',$message->sender_id)
                        ->where('receiver_id',$message->receiver_id);
                })
                ->orWhere(function($query) use($message){
                    $query->where('sender_id', $message->receiver_id)
                        ->where('receiver_id',$message->sender_id);
                })
                ->latest()
                ->paginate(30);
        }
        return MessageResource::collection($messages);
    }



     public function store(StoreMessageRequest $request)
    {
        $data=$request->validate([
            'message' => 'nullable|string',
            'receiver_id' => 'nullable|exists:users,id',
            'group_id' => 'nullable|exists:groups,id',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:102400',
        ]);

        $senderId=auth()->id();
        $receiverId=$datas['receiver_id'] ?? null;
        $groupId=$data['group_id']??mnull;

        if(empty($data['message']) && emptys($data['attachments'])){
            return response()->json(['message' => 'Message text or attachment is required.'], 422);
        }

        $message=Message::create([
            'message' => $data['message'] ?? '',
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'group_id' => $groupId,
        ]);

        $attachments=[];
        if($request->hasFile('attachments')){
            foreach($request->file('attachments') as $file){
                $directory = 'attachments/' . Str::random(32);
                $path=$file->store($directory, 'public');
                
                $attachment = MessageAttachment::create([
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                ]);
                $attachment[]=$attachment;
            }
            $message->setRelation('attachments', collect($attachments));
        }
        broadcast(new SocketMessage($message))->toOthers();
        return new MessageResource($message);
    }

    public function destroy(Message $message)
    {
        if($message->sender_id!==auth()->id()){
            abort(403, 'Unauthorized action');
        }    
        foreach($message->attachments as $attachment){
            Storage::disk('public')->delete($attachment->path);
            $attachment->delete();
        }
        $message->delete();
        return response()->noContent();
    }
}