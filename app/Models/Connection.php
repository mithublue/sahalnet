<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Connection extends Model
{
    use HasFactory;

    protected $fillable = [
        'connection_id',
        'customer_id',
        'package_id',
        'mikrotik_router_id',
        'pppoe_username',
        'pppoe_password',
        'mikrotik_profile_id',
        'auto_sync',
        'ip_address',
        'mac_address',
        'installation_date',
        'expiry_date',
        'status',
        'mikrotik_profile',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'installation_date' => 'date',
        'expiry_date' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($connection) {
            if (empty($connection->connection_id)) {
                $connection->connection_id = self::generateConnectionId();
            }

            // Auto-calculate expiry date if not set
            if (empty($connection->expiry_date) && !empty($connection->installation_date) && !empty($connection->package_id)) {
                $package = Package::find($connection->package_id);
                if ($package) {
                    $connection->expiry_date = Carbon::parse($connection->installation_date)
                        ->addDays($package->validity_days);
                }
            }
        });
    }

    private static function generateConnectionId(): string
    {
        $lastConnection = self::orderBy('id', 'desc')->first();
        $number = $lastConnection ? ((int) substr($lastConnection->connection_id, 5)) + 1 : 1;
        return 'CONN-' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }

    // Relationships
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function mikrotikRouter()
    {
        return $this->belongsTo(MikroTikRouter::class, 'mikrotik_router_id');
    }

    // Accessors
    public function getIsExpiredAttribute(): bool
    {
        return $this->expiry_date && Carbon::parse($this->expiry_date)->isPast();
    }

    public function getDaysRemainingAttribute(): int
    {
        if (!$this->expiry_date) {
            return 0;
        }
        
        $days = Carbon::now()->diffInDays(Carbon::parse($this->expiry_date), false);
        return max(0, (int) $days);
    }

    public function getIsExpiringSoonAttribute(): bool
    {
        return $this->days_remaining > 0 && $this->days_remaining <= 7;
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeExpired($query)
    {
        return $query->where('expiry_date', '<', now());
    }

    public function scopeExpiringSoon($query, $days = 7)
    {
        return $query->where('expiry_date', '>', now())
                     ->where('expiry_date', '<=', now()->addDays($days))
                     ->where('status', 'active');
    }

    public function scopeByCustomer($query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    public function scopeByPackage($query, $packageId)
    {
        return $query->where('package_id', $packageId);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
