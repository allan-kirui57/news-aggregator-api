<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),

            // Roles and Permissions
            'roles' => $this->getRoleNames(), // Returns collection of role names
            'permissions' => $this->getPermissionNames(), // Returns collection of permission names
            'all_permissions' => $this->getAllPermissions()->pluck('name'), // Direct + inherited permissions

            // Helper boolean flags
            'is_admin' => $this->hasRole('admin'),
            'is_user' => $this->hasRole('user'),

            // Role objects (if you need more details)
            'role_details' => RoleResource::collection($this->whenLoaded('roles')),
        ];
    }
}
