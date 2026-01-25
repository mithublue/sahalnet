<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class AssignSuperAdminRole extends Command
{
    protected $signature = 'user:make-super-admin {email}';
    protected $description = 'Assign super admin role to a user';

    public function handle()
    {
        $email = $this->argument('email');
        
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $this->error("User with email {$email} not found!");
            return 1;
        }
        
        $user->assignRole('super_admin');
        
        $this->info("Super admin role assigned to {$user->name} ({$user->email})");
        
        return 0;
    }
}
