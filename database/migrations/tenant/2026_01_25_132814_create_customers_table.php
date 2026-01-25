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
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('customer_code', 50)->unique();
            $table->string('full_name');
            $table->string('email')->nullable();
            $table->string('phone', 20);
            $table->string('alternative_phone', 20)->nullable();
            $table->string('nid_iqama', 50)->nullable();
            $table->string('nid_iqama_document')->nullable();
            $table->text('address')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->date('connection_date')->nullable();
            $table->enum('status', ['active', 'suspended', 'disconnected'])->default('active');
            $table->timestamps();

            $table->index('customer_code');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
