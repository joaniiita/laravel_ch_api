<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AdminCategoryController extends Controller
{
    public function index(){
       $categories = Category::all();
       return response()->json($categories);
    }

    public function show(Category $category){
        return response()->json($category);
    }

    public function create(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()){
            return response()->json($validator->errors(), 422);
        }

        try{

            $category = Category::create([
                'name' => $request->name,
            ]);

            return response()->json(['message' => 'Category created successfully.', 'data' => $category], 201);


        } catch (\Exception $e){
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Category $category){
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()){
            return response()->json($validator->errors(), 422);
        }

        try {
            $category->name = $request->name;
            $category->save();
            return response()->json(['message' => 'Category updated successfully.', 'data' => $category], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Category $category){
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully.']);
    }
}
