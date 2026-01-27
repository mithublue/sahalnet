<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_number')->unique();
            $table->foreignId('invoice_id')->constrained('invoices')->onDelete('cascade');
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->date('payment_date');
            $table->enum('payment_method', ['cash', 'bank_transfer', 'mobile_banking', 'card', 'online'])->default('cash');
            $table->string('transaction_id')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('received_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            
            $table->index('payment_number');
            $table->index('invoice_id');
            $table->index('customer_id');
            $table->index('payment_date');
            $table->index('payment_method');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
