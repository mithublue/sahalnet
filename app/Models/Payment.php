<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'payment_number',
        'invoice_id',
        'customer_id',
        'amount',
        'payment_date',
        'payment_method',
        'transaction_id',
        'notes',
        'received_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($payment) {
            if (empty($payment->payment_number)) {
                $payment->payment_number = self::generatePaymentNumber();
            }
        });

        static::created(function ($payment) {
            // Update invoice paid amount
            $invoice = $payment->invoice;
            $invoice->paid_amount += $payment->amount;
            $invoice->save();
        });

        static::deleted(function ($payment) {
            // Update invoice paid amount
            $invoice = $payment->invoice;
            $invoice->paid_amount -= $payment->amount;
            $invoice->save();
        });
    }

    private static function generatePaymentNumber(): string
    {
        $lastPayment = self::orderBy('id', 'desc')->first();
        $number = $lastPayment ? ((int) substr($lastPayment->payment_number, 4)) + 1 : 1;
        return 'PAY-' . str_pad($number, 5, '0', STR_PAD_LEFT);
    }

    // Relationships
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function receivedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    // Scopes
    public function scopeByInvoice($query, $invoiceId)
    {
        return $query->where('invoice_id', $invoiceId);
    }

    public function scopeByCustomer($query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    public function scopeByMethod($query, $method)
    {
        return $query->where('payment_method', $method);
    }

    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('payment_date', [$startDate, $endDate]);
    }
}
