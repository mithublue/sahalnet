<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceItem extends Model
{
    protected $fillable = [
        'invoice_id',
        'description',
        'quantity',
        'unit_price',
        'amount',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'amount' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($item) {
            // Auto-calculate amount
            $item->amount = $item->quantity * $item->unit_price;
        });

        static::updating(function ($item) {
            // Auto-calculate amount
            $item->amount = $item->quantity * $item->unit_price;
        });

        static::saved(function ($item) {
            // Recalculate invoice totals
            $item->invoice->calculateTotals();
        });

        static::deleted(function ($item) {
            // Recalculate invoice totals
            $item->invoice->calculateTotals();
        });
    }

    // Relationships
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
