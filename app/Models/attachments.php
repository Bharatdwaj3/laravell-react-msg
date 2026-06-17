<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
