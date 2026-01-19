<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Petition extends Model
{
    protected $table = 'petitions';

    protected $fillable = [
        'title',
        'description',
        'destinatary',
        'signers',
        'status',
        'image',
        'user_id',
        'category_id',
    ];

    protected $hidden = [

    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function category(){
        return $this->belongsTo(Category::class);
    }

    public function signers()
    {
        return $this->belongsToMany(User::class, 'petition_user', 'petition_id', 'user_id');
    }

    public function files(){
        return $this->hasMany(File::class);
    }
}
