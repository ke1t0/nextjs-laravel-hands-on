<?php

namespace App\Http\Controllers;

use App\Http\Requests\MemoPostRequest;
use App\Http\Resources\MemoResource;
use App\Models\Memo;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class MemoController extends Controller
{
    /**
     * メモの全件取得
     * @return AnonymousResourceCollection
     */
    public function fetch(): AnonymousResourceCollection
    {
        $id = Auth::id();
        if (!$id) {
            throw new Exception('未ログインです。');
        }

        try {
            $memos = Memo::where('user_id', $id)->latest()->get();
        } catch (Exception $e) {
            throw $e;
        }

        return MemoResource::collection($memos);
    }

    /**
     * メモの登録
     * @param MemoPostRequest $request
     * @return JsonResponse
     */
    public function create(MemoPostRequest $request): JsonResponse
    {
        try {
            $memo = new Memo();
            $memo->user_id = Auth::id();
            $memo->title = $request->title;
            $memo->body = $request->body;

            $memo->save();
        } catch (Exception $e) {
            throw $e;
        }

        return response()->json([
            'message' => 'メモの登録に成功しました'
        ], 201);
    }
}
