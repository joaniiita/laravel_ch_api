<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use App\Models\File;
use App\Models\Petition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PetitionController extends Controller
{
    public function index(){
        $petitions = Petition::all();
        return response()->json($petitions);
    }

    public function show(Petition $petition){
        return response()->json($petition);
    }

    public function listMine(){
        $id = Auth::id();
        $myPetitions = Petition::where('user_id', $id)->paginate(5);
        return response()->json(['message' => 'Petitions fetched successfully.', 'data' => $myPetitions->load('categories')]);
    }

    public function create(Request $request){
        $validator = Validator::make($request->all(), [
            'title' => 'required|max:255',
            'description' => 'required',
            'destinatary' => 'required',
            'category' => 'required',
            'image' => 'required|file|mimes:jpeg,png,jpg,svg',
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
                'category_id' => $request->get('category'),
                'user_id' => $user->id,
                'signers' => 0,
                'status' => 'pending'

            ]);

            if ($request->hasFile('image')) {
                $this->fileUpload($request, $petition->id);
            }

            return response()->json(['message' => 'Petition created successfully.', 'data' => $petition], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Petition $petition){
        $validator = Validator::make($request->all(), [
            'title' => 'required|max:255',
            'description' => 'required',
            'destinatary' => 'required',
            'category' => 'required',
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
                'category_id' => $request->category,
                'status' => $status,
            ]);

            return response()->json(['message' => 'Petition updated successfully.', 'data' => $petition], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Petition $petition){
        $petition_img = File::where('petition_id', $petition->id)->first();

        if ($petition_img) {
            $petition_path = public_path($petition_img->file_path);

            if (file_exists($petition_path)) {
                unlink($petition_path);
            }

            $petition_img->delete();
        }


        $petition->delete();
        return response()->json(['message' => 'Petition deleted successfully.']);
    }

    public function sign(Request $request, Petition $petition){
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
            if ($user->email === $petition->email){
                if ($petition->signers()->where('user_id', $user->id)->exists()) {
                    return back()->withErrors(['Ya has firmado esta petición'])->withInput();
                }

                $petition->signers()->attach($user->id);

                $petition->signers = $petition->signers()->count();
                $petition->save();
            }
            return response()->json(['message' => 'Petition signed successfully.']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function fileUpload(Request $request, $id)
    {
        $image = null;
        if ($request->hasFile('image')) {
            $image = time().'.'.$request->image->extension();
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
