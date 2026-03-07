<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use App\Models\File;
use App\Models\Petition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PetitionController extends Controller
{
    public function index()
    {
        $petitions = Petition::with(['files', 'user', 'category'])->get();
        return response()->json($petitions);
    }

    public function show(Petition $petition)
    {
        return response()->json($petition->load(['files', 'user']));
    }

    public function listMine()
    {
        $id = Auth::id();
        $myPetitions = Petition::where('user_id', $id)->paginate(5);
        return response()->json($myPetitions->load(['files']));
    }

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'destinatary' => 'required',
            'category_id' => 'required',
            'image.*' => 'required|file|mimes:jpeg,png,jpg,svg',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
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
                foreach ($request->file('image') as $image) {
                    $this->fileUpload($image, $petition->id);
                }
            }
            return response()->json(['message' => 'Petition created successfully.', 'data' => $petition], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Petition $petition)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|max:255',
            'description' => 'required',
            'destinatary' => 'required',
            'category_id' => 'required',
            'image.*' => 'nullable|file|mimes:jpeg,png,jpg,svg',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            if ($request->hasFile('image')) {
                $oldFiles = File::where('petition_id', $petition->id)->get();
                foreach ($oldFiles as $oldFile) {
                    Storage::disk('public')->delete($oldFile->file_path);
                    $oldFile->delete();
                }

                foreach ($request->file('image') as $image) {
                    $this->fileUpload($image, $petition->id);
                }
            }


            if (!$request->has('status')) {
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
        $petition_img = File::where('petition_id', $petition->id)->get();

        foreach ($petition_img as $image) {
            if (Storage::disk('public')->exists($image->file_path)) {
                Storage::disk('public')->delete($image->file_path);
            }
            $image->delete();
        }

        $petition->delete();
        return response()->json(['message' => 'Petition deleted successfully.']);
    }

    public function sign(Request $request, Petition $petition)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => 'required|email|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $user = Auth::user();
            if ($petition->signers()->where('user_id', $user->id)->exists()) {
                return response()->json(['message' => 'You have already signed this petition.'], 400);
            }

            $petition->signers()->attach($user->id);

            $petition->signers = $petition->signers()->count();
            $petition->save();
            return response()->json(['message' => 'Petition signed successfully.']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function signedPetitions()
    {
        try {
            $user = Auth::user();
            $petitions = $user->signPetition()->get();
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
        return response()->json($petitions->load(['files']));
    }

    private function fileUpload($file, $id)
    {
        $path = $file->store('assets/images/petitions', 'public');
        $filename = basename($path);

        $petition = Petition::findOrFail($id);

        $petition->files()->create([
            'name' => $filename,
            'file_path' => $path,
            'petition_id' => $id
        ]);
    }
}
