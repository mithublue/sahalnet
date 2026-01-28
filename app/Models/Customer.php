<?php

namespace App\Models;

use App\Traits\HasNotifications;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Customer extends Authenticatable
{
    use HasFactory, SoftDeletes, Notifiable, HasNotifications;

    protected $fillable = [
        'customer_id',
        'name',
        'email',
        'password',
        'phone',
        'secondary_phone',
        'nid',
        'address',
        'area',
        'city',
        'postal_code',
        'latitude',
        'longitude',
        'connection_type',
        'status',
        'billing_cycle',
        'billing_day',
        'created_by',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'billing_day' => 'integer',
        'password' => 'hashed',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($customer) {
            if (empty($customer->customer_id)) {
                $customer->customer_id = self::generateCustomerId();
            }
        });
    }

    private static function generateCustomerId(): string
    {
        // Include soft-deleted records to prevent ID conflicts
        $lastCustomer = self::withTrashed()->orderBy('id', 'desc')->first();
        $number = $lastCustomer ? ((int) substr($lastCustomer->customer_id, 5)) + 1 : 1;
        return 'CUST-' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }

    // Relationships
    public function connections()
    {
        return $this->hasMany(Connection::class);
    }

    public function activeConnections()
    {
        return $this->hasMany(Connection::class)->where('status', 'active');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function supportTickets()
    {
        return $this->hasMany(SupportTicket::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Accessors
    public function getFullAddressAttribute(): string
    {
        return "{$this->address}, {$this->area}, {$this->city}" .
            ($this->postal_code ? " - {$this->postal_code}" : '');
    }

    public function getHasCoordinatesAttribute(): bool
    {
        return !is_null($this->latitude) && !is_null($this->longitude);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByArea($query, $area)
    {
        return $query->where('area', $area);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%")
                ->orWhere('customer_id', 'like', "%{$search}%");
        });
    }
}
