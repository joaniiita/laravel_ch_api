<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminUserController extends Controller
{
    public function index(){
        $users = User::all();
         return response()->json($users);
    }

    public function show(User $user){
        return response()->json($user);
    }

    public function update(Request $request, User $user){
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'email' => 'required|email',
            'role' => 'required',
            'image' => 'nullable|file|mimes:jpeg,png,jpg',
            'password' => 'required|string|min:8'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $image = $user->image;
        if ($request->hasFile('image')) {
            $image = time().'.'.$request->image->extension();
            $request->image->move(public_path('assets/images/users'), $image);
        }

        if ($request->get('password') != null) {
            $user->password = Hash::make($request->get('password'));
        } else {
            $user->password = $user->password;
        }

        $user->name = $request->get('name');
        $user->email = $request->get('email');
        $user->image = $image;
        $user->role = $request->get('role');
        $user->update();

        return response()->json($user, 200);
    }

    public function destroy(User $user){
        if ($user->image !== 'defaultProfile.png') {
            $path = public_path('assets/images/users/' . $user->image);
            if (file_exists($path)) {
                unlink($path);
            }
        }

        foreach ($user->signPetition as $petition) {
            $petition->signers()->detach($user->id);
            $petition->signers = $petition->signers()->count();
            $petition->save();
        }

        foreach ($user->petitions as $petition) {
            $petition->files()->delete();
            $petition->delete();
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully.']);
    }
}
