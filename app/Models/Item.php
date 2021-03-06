<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;
use TeamTNT\TNTSearch\Indexer\TNTIndexer;

class Item extends Model
{
    use Searchable;

    protected $guarded = [
        'id', 'updated_at', 'created_at'
    ];

    public $asYouType = true;

    // Relations
    public function category()
    {
        return $this->belongsTo('App\Models\Category', 'cat_id', 'id');
    }

    public function images()
    {
        return $this->belongsToMany('App\Models\Image');
    }

    public function item_properties()
    {
        return $this->belongsToMany('App\Models\ItemProperty');
    }

    public function item_variants()
    {
        return $this->belongsToMany('App\Models\ItemVariant');
    }

    public function orders()
    {
        return $this->belongsToMany('App\Models\Order');
    }

    public function cart_item()
    {
        return $this->hasOne('App\Models\CartItem');
    }

    public function favorites()
    {
        return $this->belongsToMany(
            'App\Models\User',
            'favorites',
            'item_id',
            'user_id'
        )->withTimestamps();
    }

    public function vouchers()
    {
        return $this->belongsToMany(
            'App\Models\Voucher',
            'item_voucher',
            'item_id',
            'voucher_id'
        );
    }

    public function searchableAs()
    {
        return 'items_index';
    }

    public function toSearchableArray()
    {
        $array = $this->only('name');
        $array['nameNgrams'] = utf8_encode((new TNTIndexer)->buildTrigrams($this->name));
        $array[$this->getKeyName()] = $this->getKey();

        return $array;
    }

}
