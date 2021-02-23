<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMainStageSessionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('main_stage_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->string('title');
            $table->text('description')->nullable();
            $table->string('stream_src');
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();

            $table->boolean('chat')->default(false);
            $table->boolean('remote_control')->default(false);
            $table->boolean('reactions')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('main_stage_sessions');
    }
}
