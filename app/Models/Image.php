<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $guarded = [
        'id', 'updated_at', 'created_at'
    ];

    // Realtions

    public function items()
    {
        return $this->belongsToMany('App\Models\Item');
    }
}
