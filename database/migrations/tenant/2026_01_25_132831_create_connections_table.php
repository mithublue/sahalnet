<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('package_id')->constrained();
            $table->foreignId('mikrotik_router_id')->nullable()->constrained('mikrotik_routers');
            $table->string('mikrotik_secret_name')->nullable();
            $table->string('mikrotik_profile')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('mac_address', 17)->nullable();
            $table->date('installation_date');
            $table->date('expiry_date')->nullable();
            $table->enum('status', ['active', 'suspended', 'expired', 'disconnected'])->default('active');
            $table->boolean('auto_disconnect')->default(true);
            $table->timestamps();

            $table->index('status');
            $table->index('expiry_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('connections');
    }
};
