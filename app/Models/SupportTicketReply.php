<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportTicketReply extends Model
{
    use HasFactory;

    protected $fillable = [
        'support_ticket_id',
        'user_id',
        'customer_id',
        'message',
        'is_internal',
    ];

    protected $casts = [
        'is_internal' => 'boolean',
    ];

    // Relationships
    public function ticket()
    {
        return $this->belongsTo(SupportTicket::class, 'support_ticket_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // Accessors
    public function getAuthorAttribute()
    {
        if ($this->user_id) {
            return $this->user;
        }
        return $this->customer;
    }

    public function getAuthorNameAttribute()
    {
        if ($this->user_id) {
            return $this->user->name . ' (Admin)';
        }
        return $this->customer->name;
    }
}
