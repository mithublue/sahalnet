<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mikrotik_routers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('host'); // IP address or hostname
            $table->integer('port')->default(8728);
            $table->string('username');
            $table->text('password'); // Will be encrypted
            $table->boolean('is_active')->default(true);
            $table->enum('connection_status', ['connected', 'disconnected', 'error'])->default('disconnected');
            $table->integer('total_connections')->default(0);
            $table->timestamp('last_connected_at')->nullable();
            $table->timestamps();
            
            $table->index('is_active');
            $table->index('connection_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mikrotik_routers');
    }
};
