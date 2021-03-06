<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $guarded = [
        'id', 'updated_at', 'created_at'
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function cart_items()
    {
        return $this->belongsToMany('App\Models\CartItem');
    }

    public function vouchers()
    {
        return $this->belongsToMany(
            'App\Models\Voucher',
            'cart_voucher',
            'cart_id',
            'voucher_id'
        );
    }
}
