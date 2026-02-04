<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request){
        $validator = Validator::make($request->all(),[
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $users = User::all();
            $is_admin = $users->isEmpty() ? true : false;

            $image = 'defaultProfile.jpg';

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'image' => $image,
                'is_admin' => $is_admin,
            ]);

            return response()->json(['message' => 'User created successfully.', 'data' => $user], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function login(Request $request){
        $validator = Validator::make($request->all(),[
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $token = auth('api')->attempt($request->only('email', 'password'));

        if (!$token){
            return response()->json([
               'message' => 'error',
               'error' => 'Unauthorized. Either email or password is wrong.'
            ]);
        }

        $user = Auth::user();

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => $user,
            'expires_in' => env('JWT_TTL') * 60,
        ]);
    }

    public function logout(){
        Auth::logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    public function me(){
        return response()->json(Auth::user());
    }

    public function refresh(){
        $user = Auth::user();
        return response()->json([
            'access_token' => Auth::refresh(),
            'token_type' => 'bearer',
            'user' => $user,
            'expires_in' => env('JWT_TTL') * 60,
        ]);
    }
}
