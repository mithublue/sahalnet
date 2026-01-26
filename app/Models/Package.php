<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'bandwidth_download',
        'bandwidth_upload',
        'price',
        'setup_fee',
        'validity_days',
        'description',
        'is_active',
    ];

    protected $casts = [
        'bandwidth_download' => 'integer',
        'bandwidth_upload' => 'integer',
        'price' => 'decimal:2',
        'setup_fee' => 'decimal:2',
        'validity_days' => 'integer',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function connections()
    {
        return $this->hasMany(Connection::class);
    }

    public function activeConnections()
    {
        return $this->hasMany(Connection::class)->where('status', 'active');
    }

    // Accessors
    public function getFormattedBandwidthAttribute(): string
    {
        return "{$this->bandwidth_download} Mbps / {$this->bandwidth_upload} Mbps";
    }

    public function getFormattedPriceAttribute(): string
    {
        return number_format($this->price, 2);
    }

    public function getConnectionCountAttribute(): int
    {
        return $this->connections()->count();
    }

    public function getActiveConnectionCountAttribute(): int
    {
        return $this->activeConnections()->count();
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }
}
