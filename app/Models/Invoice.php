<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Invoice extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'invoice_number',
        'customer_id',
        'connection_id',
        'invoice_date',
        'due_date',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'total_amount',
        'paid_amount',
        'status',
        'payment_status',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'invoice_date' => 'date',
        'due_date' => 'date',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($invoice) {
            if (empty($invoice->invoice_number)) {
                $invoice->invoice_number = self::generateInvoiceNumber();
            }

            // Auto-calculate total if not set
            if (empty($invoice->total_amount)) {
                $invoice->total_amount = $invoice->subtotal + $invoice->tax_amount - $invoice->discount_amount;
            }

            // Set payment status based on paid amount
            $invoice->updatePaymentStatus();
        });

        static::updated(function ($invoice) {
            $invoice->updatePaymentStatus();
        });
    }

    private static function generateInvoiceNumber(): string
    {
        $lastInvoice = self::orderBy('id', 'desc')->first();
        $number = $lastInvoice ? ((int) substr($lastInvoice->invoice_number, 4)) + 1 : 1;
        return 'INV-' . str_pad($number, 5, '0', STR_PAD_LEFT);
    }

    public function updatePaymentStatus()
    {
        if ($this->paid_amount >= $this->total_amount) {
            $this->payment_status = 'paid';
            $this->status = 'paid';
        } elseif ($this->paid_amount > 0) {
            $this->payment_status = 'partial';
        } else {
            $this->payment_status = 'unpaid';
        }

        // Check if overdue
        if ($this->payment_status !== 'paid' && $this->due_date < Carbon::now()) {
            $this->status = 'overdue';
        }
    }

    // Relationships
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function connection(): BelongsTo
    {
        return $this->belongsTo(Connection::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Accessors
    public function getBalanceDueAttribute(): float
    {
        return max(0, $this->total_amount - $this->paid_amount);
    }

    public function getIsPaidAttribute(): bool
    {
        return $this->payment_status === 'paid';
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->status === 'overdue';
    }

    public function getDaysOverdueAttribute(): int
    {
        if (!$this->is_overdue) {
            return 0;
        }
        return Carbon::now()->diffInDays($this->due_date);
    }

    // Scopes
    public function scopeUnpaid($query)
    {
        return $query->whereIn('payment_status', ['unpaid', 'partial']);
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'overdue');
    }

    public function scopeByCustomer($query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByPaymentStatus($query, $paymentStatus)
    {
        return $query->where('payment_status', $paymentStatus);
    }

    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('invoice_date', [$startDate, $endDate]);
    }

    // Methods
    public function calculateTotals()
    {
        $this->subtotal = $this->items()->sum('amount');
        $this->total_amount = $this->subtotal + $this->tax_amount - $this->discount_amount;
        $this->save();
    }

    public function markAsSent()
    {
        $this->status = 'sent';
        $this->save();
    }

    public function markAsPaid()
    {
        $this->paid_amount = $this->total_amount;
        $this->payment_status = 'paid';
        $this->status = 'paid';
        $this->save();
    }
}
