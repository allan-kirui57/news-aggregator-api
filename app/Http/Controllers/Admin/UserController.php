<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of users (Admin only)
     */
    public function index()
    {
        $users = User::with('roles', 'permissions')->get();

        return Inertia::render('admin/users/index', [
            'users' => UserResource::collection($users)
        ]);
    }

    /**
     * Get current authenticated user profile
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        $user->load('roles', 'permissions');

        return new UserResource($user);
    }
}
