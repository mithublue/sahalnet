<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BillingCycle extends Model
{
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'status',
        'total_invoices',
        'total_amount',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'total_invoices' => 'integer',
        'total_amount' => 'decimal:2',
    ];

    // Relationships
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class, 'billing_cycle_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeClosed($query)
    {
        return $query->where('status', 'closed');
    }

    // Methods
    public function generateInvoices()
    {
        // Get all active connections
        $connections = Connection::active()->with(['customer', 'package'])->get();
        
        $invoiceCount = 0;
        $totalAmount = 0;

        foreach ($connections as $connection) {
            // Create invoice for this connection
            $invoice = Invoice::create([
                'customer_id' => $connection->customer_id,
                'connection_id' => $connection->id,
                'invoice_date' => now(),
                'due_date' => now()->addDays(7),
                'subtotal' => $connection->package->price,
                'tax_amount' => 0,
                'discount_amount' => 0,
                'total_amount' => $connection->package->price,
                'status' => 'draft',
                'created_by' => auth()->id(),
            ]);

            // Add invoice item
            $invoice->items()->create([
                'description' => $connection->package->name . ' - ' . $this->name,
                'quantity' => 1,
                'unit_price' => $connection->package->price,
                'amount' => $connection->package->price,
            ]);

            $invoiceCount++;
            $totalAmount += $connection->package->price;
        }

        // Update billing cycle
        $this->total_invoices = $invoiceCount;
        $this->total_amount = $totalAmount;
        $this->save();

        return $invoiceCount;
    }

    public function close()
    {
        $this->status = 'closed';
        $this->save();
    }
}
