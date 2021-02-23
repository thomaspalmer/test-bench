<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmailResetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('email_resets', function (Blueprint $table) {
            $table->uuid('id')->primary()->unique();
            $table->foreignUuid('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('new_email');
            $table->string('existing_email')->nullable();
            $table->string('token');
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
        Schema::dropIfExists('email_resets');
    }
}
