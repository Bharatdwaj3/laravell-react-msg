<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class attachments extends Model
{
    use HasFactory;

    protected $fillable = [
        'mmesage_id',
        'name',
        'path',
        'mime',
        'size'
    ];
}
