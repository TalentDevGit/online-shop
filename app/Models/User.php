<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];


    public function orders()
    {
        return $this->hasMany('App\Models\Order');
    }

    public function cart()
    {
        return $this->hasOne('App\Models\Cart');
    }

    public function favorites()
    {
        return $this->belongsToMany(
            'App\Models\Item',
            'favorites',
            'user_id',
            'item_id'
            )->withTimestamps();
    }

    public function vouchers()
    {
        return $this->belongsToMany(
            'App\Models\Voucher',
            'user_voucher',
            'user_id',
            'voucher_id'
        );
    }
}
