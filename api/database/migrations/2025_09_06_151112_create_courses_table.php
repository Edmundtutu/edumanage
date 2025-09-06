<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->unsignedBigInteger('school_id');
            $table->unsignedBigInteger('teacher_id')->nullable();
            $table->json('class_ids')->nullable(); // Store as JSON array
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->integer('credits')->nullable();
            $table->boolean('self_enrollment')->default(false);
            $table->json('enrolled_students')->nullable(); // Store as JSON array
            $table->integer('max_students')->nullable();
            $table->timestamps();

            $table->foreign('school_id')->references('id')->on('schools')->onDelete('cascade');
            $table->foreign('teacher_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
