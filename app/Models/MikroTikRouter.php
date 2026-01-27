<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Crypt;

class MikroTikRouter extends Model
{
    protected $table = 'mikrotik_routers';

    protected $fillable = [
        'name',
        'host',
        'port',
        'username',
        'password',
        'is_active',
        'connection_status',
        'total_connections',
        'last_connected_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'total_connections' => 'integer',
        'last_connected_at' => 'datetime',
    ];

    protected $hidden = [
        'password',
    ];

    /**
     * Encrypt password before saving
     */
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Crypt::encryptString($value);
    }

    /**
     * Decrypt password when retrieving
     */
    public function getPasswordAttribute($value)
    {
        try {
            return Crypt::decryptString($value);
        } catch (\Exception $e) {
            return $value; // Return as-is if not encrypted
        }
    }

    /**
     * Get all connections for this router
     */
    public function connections(): HasMany
    {
        return $this->hasMany(Connection::class, 'mikrotik_router_id');
    }

    /**
     * Get active connections
     */
    public function activeConnections()
    {
        return $this->connections()->where('status', 'active');
    }

    /**
     * Scope: Active routers only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Connected routers only
     */
    public function scopeConnected($query)
    {
        return $query->where('connection_status', 'connected');
    }

    /**
     * Check if router is connected
     */
    public function isConnected(): bool
    {
        return $this->connection_status === 'connected';
    }

    /**
     * Update connection status
     */
    public function updateConnectionStatus(string $status, ?\DateTime $lastConnected = null)
    {
        $this->connection_status = $status;
        if ($lastConnected) {
            $this->last_connected_at = $lastConnected;
        }
        $this->save();
    }

    /**
     * Update total connections count
     */
    public function updateConnectionsCount()
    {
        $this->total_connections = $this->activeConnections()->count();
        $this->save();
    }
}
