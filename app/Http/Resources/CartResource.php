<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
           'id' => $this->id,
            'cart_items' =>  CartItemResource::collection($this->whenLoaded('cart_items')),
            'vouchers' => $this->whenLoaded('vouchers')
        ];
    }
}
