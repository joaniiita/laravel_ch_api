<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\File;
use App\Models\Petition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AdminPetitionController extends Controller
{
    public function index()
    {
        $petitions = Petition::with(['files', 'user', 'category'])->get();
        return response()->json($petitions);
    }

    public function show(Petition $petition){
        return response()->json($petition->load(['files', 'user']));
    }

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'destinatary' => 'required',
            'category_id' => 'required',
            'image' => 'required|file|mimes:jpeg,png,jpg,svg',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            if (Auth::user()->is_admin) {
                $user = Auth::user();


                $petition = Petition::create([
                    'title' => $request->get('title'),
                    'description' => $request->get('description'),
                    'destinatary' => $request->get('destinatary'),
                    'category_id' => $request->get('category_id'),
                    'user_id' => $user->id,
                    'signers' => 0,
                    'status' => 'pending',
                ]);

                if ($request->hasFile('image')) {
                    $this->fileUpload($request, $petition->id);
                }

                return response()->json(['message' => 'Petition created successfully.', 'data' => $petition->load('categories')], 201);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Petition $petition){
        $validator = Validator::make($request->all(), [
            'title' => 'required|max:255',
            'description' => 'required',
            'destinatary' => 'required',
            'category_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $oldFile = File::where('petition_id', $petition->id)->first();

            if ($request->hasFile('image')) {

                if ($oldFile) {
                    $oldPath = public_path($oldFile->file_path);

                    if (file_exists($oldPath)) {
                        unlink($oldPath);
                    }

                    $oldFile->delete();
                }

                $image = $request->file('image');
                $newName = time() . '_' . $image->getClientOriginalName();
                $destination = 'assets/images/petitions/';
                $image->move(public_path($destination), $newName);

                File::create([
                    'name' => $newName,
                    'file_path' => $newName,
                    'petition_id' => $petition->id
                ]);
            }

            if (!$request->has('status')){
                $status = $petition->status;
            } else {
                $status = $request->get('status');
            }

            $petition->update([
                'title' => $request->title,
                'description' => $request->description,
                'destinatary' => $request->destinatary,
                'category_id' => $request->get('category_id'),
                'status' => $status,
            ]);

            return response()->json(['message' => 'Petition updated successfully.', 'data' => $petition], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Petition $petition)
    {
        $petition->delete();
        return response()->json(['message' => 'Petition deleted successfully.']);
    }

    public function changeStatus(Petition $petition){
        if ($petition->status === 'pending'){
            $petition->status = 'accepted';
        } else {
            $petition->status = 'pending';
        }

        $petition->save();
        return response()->json(['message' => 'Petition status changed successfully.' , 'data' => $petition]);
    }

    private function fileUpload(Request $request, $id)
    {
        $image = null;
        if ($request->hasFile('image')) {
            $image = time() . '.' . $request->image->extension();
            $request->image->move(public_path('assets/images/petitions'), $image);
        }

        $petition = Petition::findOrFail($id);

        $petition->files()->create([
            'name' => $image,
            'file_path' => $image,
            'petition_id' => $id
        ]);

    }
}

