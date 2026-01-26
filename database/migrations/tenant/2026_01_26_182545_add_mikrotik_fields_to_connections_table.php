<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('connections', function (Blueprint $table) {
            $table->foreignId('mikrotik_router_id')->nullable()->after('connection_id')->constrained('mikrotik_routers')->onDelete('set null');
            $table->string('pppoe_username')->unique()->nullable()->after('mikrotik_router_id');
            $table->string('pppoe_password')->nullable()->after('pppoe_username');
            $table->string('mikrotik_profile_id')->nullable()->after('pppoe_password');
            $table->boolean('auto_sync')->default(true)->after('mikrotik_profile_id');
            
            $table->index('pppoe_username');
            $table->index('mikrotik_router_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('connections', function (Blueprint $table) {
            $table->dropForeign(['mikrotik_router_id']);
            $table->dropColumn([
                'mikrotik_router_id',
                'pppoe_username',
                'pppoe_password',
                'mikrotik_profile_id',
                'auto_sync',
            ]);
        });
    }
};
