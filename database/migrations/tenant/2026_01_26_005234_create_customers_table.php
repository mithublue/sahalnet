<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('customer_id')->unique(); // Auto-generated: CUST-XXXX
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone', 20);
            $table->string('secondary_phone', 20)->nullable();
            $table->string('nid', 50)->nullable(); // National ID
            $table->text('address');
            $table->string('area');
            $table->string('city');
            $table->string('postal_code', 10)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->enum('connection_type', ['fiber', 'wireless', 'cable'])->default('fiber');
            $table->enum('status', ['active', 'inactive', 'suspended', 'pending'])->default('pending');
            $table->enum('billing_cycle', ['monthly', 'quarterly', 'yearly'])->default('monthly');
            $table->integer('billing_day')->default(1); // Day of month for billing
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            $table->index('customer_id');
            $table->index('email');
            $table->index('phone');
            $table->index('status');
            $table->index('area');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
