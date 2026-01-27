<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateMikroTikTablesSeeder extends Seeder
{
    public function run(): void
    {
        // Create mikrotik_routers table if it doesn't exist
        if (!Schema::hasTable('mikrotik_routers')) {
            DB::statement("
                CREATE TABLE `mikrotik_routers` (
                  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
                  `name` varchar(255) NOT NULL,
                  `host` varchar(255) NOT NULL,
                  `port` int NOT NULL DEFAULT '8728',
                  `username` varchar(255) NOT NULL,
                  `password` text NOT NULL,
                  `is_active` tinyint(1) NOT NULL DEFAULT '1',
                  `connection_status` enum('connected','disconnected','error') NOT NULL DEFAULT 'disconnected',
                  `total_connections` int NOT NULL DEFAULT '0',
                  `last_connected_at` timestamp NULL DEFAULT NULL,
                  `created_at` timestamp NULL DEFAULT NULL,
                  `updated_at` timestamp NULL DEFAULT NULL,
                  PRIMARY KEY (`id`),
                  KEY `is_active` (`is_active`),
                  KEY `connection_status` (`connection_status`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");
            
            echo "mikrotik_routers table created\n";
        }

        // Check if connections table needs MikroTik fields
        if (!Schema::hasColumn('connections', 'mikrotik_router_id')) {
            DB::statement("
                ALTER TABLE `connections` 
                ADD COLUMN `mikrotik_router_id` bigint unsigned NULL AFTER `connection_id`,
                ADD COLUMN `pppoe_username` varchar(255) NULL AFTER `mikrotik_router_id`,
                ADD COLUMN `pppoe_password` varchar(255) NULL AFTER `pppoe_username`,
                ADD COLUMN `mikrotik_profile_id` varchar(255) NULL AFTER `pppoe_password`,
                ADD COLUMN `auto_sync` tinyint(1) NOT NULL DEFAULT '1' AFTER `mikrotik_profile_id`
            ");
            
            echo "MikroTik fields added to connections table\n";
            
            // Add indexes and foreign key
            DB::statement("
                ALTER TABLE `connections`
                ADD KEY `mikrotik_router_id` (`mikrotik_router_id`),
                ADD UNIQUE KEY `pppoe_username` (`pppoe_username`)
            ");
            
            DB::statement("
                ALTER TABLE `connections`
                ADD CONSTRAINT `connections_mikrotik_router_id_foreign` 
                  FOREIGN KEY (`mikrotik_router_id`) 
                  REFERENCES `mikrotik_routers` (`id`) 
                  ON DELETE SET NULL
            ");
            
            echo "Indexes and foreign key added\n";
        }
        
        echo "MikroTik tables setup complete!\n";
    }
}
